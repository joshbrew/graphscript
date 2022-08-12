//for running parallel processes (with their own memory, as opposed to workers which share memory) in node.js
import {ChildProcess, fork, Serializable, spawn} from 'child_process'
import { Route, Routes, Service, ServiceMessage, ServiceOptions } from '../Service';
import { GraphNodeProperties } from '../../Graph';
import path from 'path';

//enable message passing between child processes.
//You can use these services across processes to enable full scripting abilities

export type CMDRoute = {
    command:string|ChildProcess,
    args?:string[],
    options?:{shell:true, stdio:'inherit',[key:string]:any},
    env?:any,
    cwd?:any,
    signal?:any,
    stdout?:(data:any)=>void,
    onerror?:(error:Error)=>void,
    onclose?:(code: number | null, signal: NodeJS.Signals | null)=>void
} & GraphNodeProperties

export type CMDInfo = {
    process:ChildProcess,
    _id:string,
    controller:AbortController
} & CMDRoute


export class CMDService extends Service {

    processes:{
        [key:string]:{
            _id:string,
            process:ChildProcess,
            controller:AbortController
        } & CMDRoute
    } 

    customRoutes:ServiceOptions['customRoutes']={
        'process':(route: CMDRoute|Route, routeKey: string, routes: Routes) => {
            if((route as CMDRoute).command) {
               this.createProcess((route as CMDRoute)); 
            }
            return route;
        }
    }

    constructor(options?:ServiceOptions) {
        super(options)
        this.load(this.routes);

        if(process.stdin) {
            process.stdin.on('data', (data) => {
                let str = data.toString(); 
                this.receive(str);
            });
            // process.stdin.on('readable', () => { //https://www.geeksforgeeks.org/node-js-process-stdin-property/#:~:text=The%20process.,to%20listen%20for%20the%20event.
            //     let chunk;
            //     // Use a loop to make sure we read all available data.
            //     while ((chunk = process.stdin.read()) !== null) {
            //      process.stdout.write(`data: ${chunk}`);
            //     }
            //   });
        }
        
    }

    createProcess = (properties:CMDRoute) => {
        let rt = properties;
        if(!rt.command) rt.command = 'node' //default command
        if(!rt.args) rt.args = [path.join(process.cwd(),'services','cmd','childprocess.js')] //default child process
        if(rt.command) {
            let p:ChildProcess;
            if(!rt.options) {
                rt.options = {shell:true, stdio:'inherit'}
            }
            rt.controller = new AbortController();
            rt.options = Object.assign({signal:(rt.controller as AbortController).signal, env:process.env, cwd:process.cwd()},rt.options)

            if(rt.tag) rt._id = rt.tag;
            else {
                rt._id = `process${Math.floor(Math.random()*1000000000000000)}`;
                rt.tag = rt._id;
            }

            if(typeof rt.command === 'string') {
                if(rt.command.includes('.js')) {
                    p = fork(rt.command,rt.args,rt.options);
                } else p = spawn(rt.command,rt.args ? rt.args : [],rt.options);

                if(p instanceof ChildProcess) {
                    if(p.stderr) {
                        if(rt.onerror) {
                            p.stderr.on('data', rt.onerror);
                        } else p.stderr.on('data', console.error)
                    }
                    if(p.stdout) {
                        if(rt.stdout) {
                            p.stdout.on('data', rt.stdout)
                        } else p.stdout.on('data', (data)=>{ 
                            let str = data.toString();
                            this.receive(str);
                            this.setState({[rt._id]:str}); 
                        } )
                    }

                    if(rt.onclose) {
                        p.on('close',rt.onclose);
                    }

                    rt.process = p; //keep the process referenced locally
                    rt.controller = new AbortController();

                    rt.send = (data:Serializable) => {
                        p.send(data);
                    }

                    rt.request = (message:ServiceMessage|any, origin?:string, method?:string) => {
                        this.request(message,rt._id,origin,method);
                    }

                    rt.post = (route:string, args:any, origin?:string, method?:string) => {
                        //console.log('sent', message)
                        let message:any = {
                            route,
                            args
                        };
                        if(origin) message.origin = origin;
                        if(method) message.method = method;

                        return p.send(JSON.stringify(message));
                    }

                    rt.run = (route:any, args?:any, origin?:string, method?:string) => {
                        let message:any = {
                            route,
                            args
                        };
                        if(origin) message.origin = origin;
                        if(method) message.method = method;

                        return this.request(message, rt._id);
                    }

                    
                    rt.subscribe = (route:any, callback?:((res:any)=>void)|string) => {
                        return this.subscribeToProcess(route, rt._id, callback);
                    }

                    rt.unsubscribe = (route:any, sub:number):Promise<any> => {
                        return rt.run('unsubscribe',[route,sub]);
                    }


                    this.processes[rt._id] = rt as CMDInfo;
                }

            }
        }

        return rt;
    }

    abort = (childprocess:ChildProcess|CMDInfo) => {
        if((childprocess as CMDInfo).controller) 
            (childprocess as CMDInfo).controller.abort();
        else childprocess.kill();

        return true;
    }
    
    send = (childprocess:ChildProcess, data:Serializable) => {
        return childprocess.send(data);
    }

    request = (message:ServiceMessage|any, processId:string, origin?:string, method?:string) => {
        let childprocess = this.processes[processId].process;
        return new Promise ((res,rej) => {
            let callbackId = Math.random();
            let req = {route:'runRequest', args:[message, callbackId]} as any;
            if(origin) req.origin = origin;
            if(method) req.method = method;
            let ondata = (data:Buffer)=>{
                let str = data.toString();
                if(str.includes('{')) {
                    let parsed = JSON.parse(str);
                    if(parsed.callbackId === callbackId) {
                        childprocess.removeListener('data',ondata);
                        res(parsed.args); //resolve the request with the corresponding message
                    }
                }
            }
            childprocess.addListener('data',ondata);
            childprocess.send(req);
            //this.transmit(req, worker, transfer);
        });
    }

    runRequest = (message:any, callbackId:string|number, childprocess?:ChildProcess|string) => { //send result back
        let res = this.receive(message);

        if(typeof childprocess === 'string') childprocess = this.processes[childprocess].process;
        if(res instanceof Promise) {
            res.then((v) => {        
                res = {args:v, callbackId};
                if(childprocess instanceof ChildProcess) childprocess.send(JSON.stringify(res));
                else process.stdout.write(JSON.stringify(res))
            });
        }
        else { 
            res = {args:res, callbackId};
            if(childprocess instanceof ChildProcess) childprocess.send(JSON.stringify(res));
            else process.stdout.write(JSON.stringify(res))
        }

        return res;
    }

    subscribeProcess(route:string, childprocess:ChildProcess|string) {
        if(typeof childprocess === 'string' && this.processes[childprocess]) {
            childprocess = this.processes[childprocess].process;
        }
        return this.subscribe(route, (res:any) => {
            //console.log('running request', message, 'for worker', worker, 'callback', callbackId)
            if(res instanceof Promise) {
                res.then((r) => {
                    (childprocess as ChildProcess).send(JSON.stringify({args:r, callbackId:route}));
                });
            } else {
                (childprocess as ChildProcess).send(JSON.stringify({args:res, callbackId:route}));
            }
        });
    } 

    subscribeToProcess(route:string, processId:string, callback?:((res:any)=>void)|string) {
        if(typeof processId === 'string' && this.processes[processId]) {
            this.subscribe(processId, (res) => {
                if(res?.callbackId === route) {
                    if(!callback) this.setState({[processId]:res.args}); //just set state
                    else if(typeof callback === 'string') { //run a local node
                        this.run(callback,res.args);
                    }
                    else callback(res.args);
                }
            });
            return this.processes[processId].request(JSON.stringify({route:'subscribeSocket', args:[route,processId]}));
        }
    }

    routes:Routes={
        createProcess:this.createProcess,
        abort:this.abort,
        send:this.send,
        request:this.request,
        runRequest:this.runRequest,
        subscribeProcess:this.subscribeProcess,
        subscribeToProcess:this.subscribeToProcess,
        unsubscribe:this.unsubscribe
    }

}