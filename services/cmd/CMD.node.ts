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
    controller:AbortController,
    send:(data:Serializable)=>boolean,
    request:(message:ServiceMessage|any,method?:string) => Promise<any>,
    post:(route:string, args:any, method?:string) => boolean,
    run:(route:any, args?:any, method?:string) => Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string) => number,
    unsubscribe:(route:any, sub:number) => Promise<boolean>
} & CMDRoute


export class CMDService extends Service {

    processes:{
        [key:string]:{
            _id:string,
            process:ChildProcess,
            controller:AbortController
        } & CMDRoute
    } 

    connections = { //higher level reference for Router
        processes:this.processess
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
        let newprocess = properties;
        if(!newprocess.command) newprocess.command = 'node' //default command
        if(!newprocess.args) newprocess.args = [path.join(process.cwd(),'node_modules','graphscript-node','services','cmd','childprocess.js')] //default child process
        if(newprocess.command) {
            let p:ChildProcess;
            if(!newprocess.options) {
                newprocess.options = {shell:true, stdio:'inherit'}
            }
            newprocess.controller = new AbortController();
            newprocess.options = Object.assign({signal:(newprocess.controller as AbortController).signal, env:process.env, cwd:process.cwd()},newprocess.options)

            if(newprocess.tag) newprocess._id = newprocess.tag;
            else {
                newprocess._id = `process${Math.floor(Math.random()*1000000000000000)}`;
                newprocess.tag = newprocess._id;
            }

            if(typeof newprocess.command === 'string') {
                if(newprocess.command.includes('.js')) {
                    p = fork(newprocess.command,newprocess.args,newprocess.options);
                } else p = spawn(newprocess.command,newprocess.args ? newprocess.args : [],newprocess.options);

                if(p instanceof ChildProcess) {
                    if(p.stderr) {
                        if(newprocess.onerror) {
                            p.stderr.on('data', newprocess.onerror);
                        } else p.stderr.on('data', console.error)
                    }
                    if(p.stdout) {
                        if(newprocess.stdout) {
                            p.stdout.on('data', newprocess.stdout)
                        } else p.stdout.on('data', (data)=>{ 
                            let str = data.toString();
                            this.receive(str);
                            this.setState({[newprocess._id]:str}); 
                        } )
                    }

                    if(newprocess.onclose) {
                        p.on('close',newprocess.onclose);
                    }

                    newprocess.process = p; //keep the process referenced locally
                    newprocess.controller = new AbortController();

                    newprocess.send = (data:Serializable) => {
                        return p.send(data);
                    }

                    newprocess.request = (message:ServiceMessage|any,  method?:string) => {
                        return this.request(message,newprocess._id,method) as Promise<any>;
                    }

                    newprocess.post = (route:string, args:any,  method?:string) => {
                        //console.log('sent', message)
                        let message:any = {
                            route,
                            args
                        };
                        if(method) message.method = method;

                        return p.send(JSON.stringify(message));
                    }

                    newprocess.run = (route:any, args?:any, method?:string) => {
                        let message:any = {
                            route,
                            args
                        };
                        if(method) message.method = method;

                        return this.request(message, newprocess._id);
                    }

                    
                    newprocess.subscribe = (route:any, callback?:((res:any)=>void)|string) => {
                        return this.subscribeToProcess(route, newprocess._id, callback);
                    }

                    newprocess.unsubscribe = (route:any, sub:number) => {
                        return newprocess.run('unsubscribe',[route,sub]);
                    }


                    this.processes[newprocess._id] = newprocess as CMDInfo;
                }

            }
        }

        return newprocess;
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

    request = (message:ServiceMessage|any, processId:string, method?:string) => {
        let childprocess = this.processes[processId].process;
        return new Promise ((res,rej) => {
            let callbackId = Math.random();
            let req = {route:'runRequest', args:[message, callbackId]} as any;
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