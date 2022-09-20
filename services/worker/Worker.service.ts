import { Service, Routes, ServiceMessage, ServiceOptions, Route } from "../Service";
import Worker from 'web-worker' //cross platform for node and browser
import { GraphNodeProperties } from "../../Graph";

declare var WorkerGlobalScope;

export type WorkerRoute = {
    worker?:WorkerInfo
    workerUrl?: string|URL|Blob,
    workerId?: string,
    transferFunctions?:{[key:string]:Function},
    transferClasses?:{[key:string]:Function},
    parentRoute?:string, //if a child of a worker node, subscribe to a route on a parent worker?
    portId?:string, //port to subscribe to for the parent route? will establish new one if parent has a worker defined, there is no limit on MessagePorts so they can be useful for organizing 
    callback?:string, //Run this route on the worker when the operator is called. If this route is a child of another node, run this node on the child worker when it receives a message. 
    stopped?:boolean, // Don't run the callback until we call the thread to start? E.g. for recording data periodically.
    blocking?:boolean, //should the subscribed worker wait for the subscriber to resolve before sending a new result? Prevents backup and makes async processing easier
    init?:string, //run a callback on the worker on worker init?
    initArgs?:any[] //arguments to go with the worker init?
    initTransfer?:any[] //transferrable stuff with the init?
} & GraphNodeProperties & WorkerProps

export type WorkerProps = {
    worker:WorkerInfo,
    workerUrl?: string|URL|Blob,
    url?:URL|string|Blob,
    _id?:string,
    port?:MessagePort, //message channel for this instance
    onmessage?:(ev)=>void,
    onerror?:(ev)=>void,
    onclose?:(worker:Worker|MessagePort)=>void
} 

export type WorkerInfo = {
    worker:Worker|MessagePort,
    send:(message:any,transfer?:any)=>void,
    request:(message:any, transfer?:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any, transfer?:any)=>void,
    run:(route:any, args?:any, transfer?:any, method?:string)=>Promise<any>
    subscribe:(route:any, callback?:((res:any)=>void)|string, blocking?:boolean)=>Promise<any>,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    start:(route?:any, portId?:string, callback?:((res:any)=>void)|string, blocking?:boolean)=>Promise<boolean>,
    stop:(route?:string, portId?:string)=>Promise<boolean>,
    workerSubs:{[key:string]:{sub:number|false, route:string, portId:string, callback?:((res:any)=>void)|string, blocking?:boolean}},
    terminate:()=>boolean,
    postMessage:(message:any,transfer:any[])=>void, //original worker post message
    graph:WorkerService,
    _id:string
} & WorkerProps & WorkerRoute

//this spawns the workers
export class WorkerService extends Service {
    
    name='worker'
    
    workers:{
        [key:string]:WorkerInfo
    }={}

    threadRot = 0; //thread rotation if not specifying

    connections = { //higher level reference for Router
        workers:this.workers
    }

    constructor(options?:ServiceOptions) {
        super(options);
        this.load(this.routes);

        if(typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope) {
            this.addDefaultMessageListener();    
        }
    }

    loadWorkerRoute(rt:WorkerRoute,routeKey:string,) {
        if(rt.workerUrl) rt.url = rt.workerUrl;
        if(rt.workerId) rt.tag = rt.workerId;
        if(!rt.tag) rt.tag = routeKey;
        rt._id = rt.tag;

        let worker:WorkerInfo;
        if(this.workers[rt._id]) worker = this.workers[rt._id];
        else if (rt.worker) worker = rt.worker;
        if(!worker) {
            worker = this.addWorker(rt);

            let ondelete = (rt) => { //removing the original route will trigger ondelete
                rt.worker?.terminate();
            }
            let oldondelete;
            if(rt.ondelete) oldondelete = rt.ondelete;  
            
            rt.ondelete = (n) => {
                if(oldondelete) oldondelete(n);
                ondelete(n);
            }
        }

        rt.worker = worker;

        //requires unsafeRoutes on the worker (enabled on the default worker)
        if(rt.transferFunctions) {
            for(const prop in rt.transferFunctions) {
                this.transferFunction(worker,rt.transferFunctions[prop],prop)
            }
        }
        if(rt.transferClasses) {
            for(const prop in rt.transferClasses) {
                this.transferClass(worker,rt.transferClasses[prop],prop)
            }
        }

        if(worker) {
            if(!rt.operator) {
                rt.operator = (...args) => {
                    //console.log('operator', args)
                    if(rt.callback) {
                        if(!this.nodes.get(rt.tag)?.children) worker.post(rt.callback,args);
                        else return worker.run(rt.callback,args);
                    } else {
                        if(!this.nodes.get(rt.tag)?.children) worker.send(args);
                        else return worker.request(args);
                    }
                }
            }

            if(rt.init) { //requires unsafeRoutes
                worker.run(rt.init,rt.initArgs,rt.initTransfer);
            } 

            // //need unsafeRoutes loaded
            // worker.run('setValue',[rt.callback+'_routeProxy', rt.callback]);

            // this.transferFunction(
            //     worker,
            //     function routeProxy(data:any) {
            //         let r = this.graph.nodes.get(this.graph[this.tag]).operator(data);
                    
            //         if(this.graph.state.triggers[this.graph[this.tag]]) {
            //             if(r instanceof Promise) {
            //                 r.then((rr) => {
            //                     if(rr !== undefined) this.setState({[this.graph[this.tag]]:rr});
            //                 });
            //             }
            //             else if(r !== undefined) this.setState({[this.graph[this.tag]]:r}); //so we can subscribe to the original route
            //         }

            //         return r;
            //     },
            //     rt.callback+'_routeProxy'
            // )

            // rt.callback = rt.callback+'_routeProxy'; //proxying through here 

            return worker;
        }
    }

    customRoutes:ServiceOptions["customRoutes"] = {
        'worker':(route:Route | WorkerRoute, routeKey:string, routes:Routes) => {
            let rt = route as WorkerRoute;
            if(rt?.worker || rt?.workerId || (rt as WorkerRoute)?.workerUrl) { //each set of props with a worker will instantiate a new worker, else you can use the same worker elsewhere by passing the corresponding tag
                let worker = this.loadWorkerRoute(rt, routeKey);
                if(worker) {
                    if(!rt.parentRoute && (rt.parent as any)?.callback) rt.parentRoute = (rt.parent as any).callback;
                    if(rt.parent && !rt.portId){ 
                        if(typeof rt.parent === 'string') {
                            if(rt.tag !== rt.parent && worker._id !== rt.parent)
                                rt.portId = this.establishMessageChannel(worker, rt.parent) as string; 
                        }
                        else if(rt.tag !== rt.parent.tag && worker._id !== rt.parent.tag) {
                            rt.portId = this.establishMessageChannel(worker, (rt.parent as any).worker) as string; 
                        }
                    };
                    if(rt.parentRoute) {
                        if(!rt.stopped) {
                            if(typeof rt.parent === 'string' && rt.parent === worker._id) {
                                worker.run('subscribe', [rt.parentRoute, rt.callback]);
                            }
                            else if(rt.tag === (rt.parent as any)?.tag || worker._id === (rt.parent as any)?.tag) {
                                worker.run('subscribe', [rt.parentRoute, rt.callback]);
                            }
                            else worker.run('subscribeToWorker', [rt.parentRoute, rt.portId, rt.callback, rt.blocking]).then((sub)=>{ //if no callback specified it will simply setState on the receiving thread according to the portId
                                worker.workerSubs[rt.parentRoute+rt.portId].sub = sub;
                            });
                        }
                        if(!(typeof rt.parent === 'string' && rt.parent === worker._id) && !(rt.tag === (rt.parent as any)?.tag || worker._id === (rt.parent as any)?.tag)) 
                            worker.workerSubs[rt.parentRoute+rt.portId] = {sub:null, route:rt.parentRoute, portId:rt.portId, callback:rt.callback, blocking:rt.blocking };
                    } else if (rt.parent) {
                        if(typeof rt.parent === 'string') {
                            if(!rt.stopped) {
                                if(rt.parent === worker._id) {
                                    worker.run('subscribe', [rt.parent, rt.callback]);
                                }
                                else worker.run('subscribeToWorker', [rt.parent, rt.portId, rt.callback, rt.blocking]).then((sub)=>{ //if no callback specified it will simply setState on the receiving thread according to the portId
                                    worker.workerSubs[rt.parentRoute+rt.portId].sub = sub;
                                });
                            }
                            if(!(typeof rt.parent === 'string' && rt.parent === worker._id)) 
                                worker.workerSubs[rt.parentRoute+rt.portId] = {sub:null, route:rt.parentRoute, portId:rt.portId, callback:rt.callback, blocking:rt.blocking };
                        } else if(rt.parent?.tag) {
                            if(!rt.stopped) {
                                if(rt.tag === (rt.parent as any)?.tag || worker._id === (rt.parent as any)?.tag) {
                                    worker.run('subscribe', [rt.parent.tag, rt.callback]);
                                }
                                else worker.run('subscribeToWorker', [rt.parent.tag, rt.portId, rt.callback, rt.blocking]).then((sub)=>{ //if no callback specified it will simply setState on the receiving thread according to the portId
                                    worker.workerSubs[rt.parentRoute+rt.portId].sub = sub;
                                });
                            }
                            if(!(rt.tag === (rt.parent as any)?.tag || worker._id === (rt.parent as any)?.tag)) 
                                worker.workerSubs[rt.parentRoute+rt.portId] = {sub:null, route:rt.parentRoute, portId:rt.portId, callback:rt.callback, blocking:rt.blocking };
                        }
                    }

                }
            } else if(rt.parent && rt.parentRoute) {
                if(typeof rt.parent === 'string' && (routes[rt.parent] as any)?.worker) {
                    ((routes[rt.parent] as any).worker as WorkerInfo).subscribe(rt.parentRoute, rt.tag, rt.blocking);
                } else if((rt.parent as any)?.worker) {
                    ((rt.parent as any).worker as WorkerInfo).subscribe(rt.parentRoute, rt.tag, rt.blocking);
                }
            }

            //console.log(rt);
            return rt;
        }
    }

    customChildren:ServiceOptions["customChildren"] = {
        'worker':(child: WorkerRoute, childRouteKey: string, parent: WorkerRoute, routes: Routes, checked: Routes) => {

            if(!child.parentRoute && parent?.callback) child.parentRoute = parent.callback;
            if(!child.parent && parent.tag) child.parent = parent.tag;
            
            return child;
        }
    } //todo, create message ports between workers with parent/child relationships and set up pipes

    //works in window as well (caution)
    addDefaultMessageListener() {
        globalThis.onmessage = (ev:MessageEvent) => {
            let result = this.receive(ev.data); //this will handle graph logic and can run requests for the window or messsage ports etc etc.
            //console.log(JSON.stringify(ev.data), JSON.stringify(result),JSON.stringify(Array.from((self as any).SERVICE.nodes.keys())))
            //console.log(result);
            if(this.keepState) this.setState({[this.name]:result}); //subscribe to all outputs
        } //this will work for iframes too
    }

    //post messages to workers or to window (or self as worker)
    postMessage = (message:any, target:string, transfer?:Transferable[]) => {
        if(this.workers[target]) {
            this.workers[target].send(message,transfer);
        } else {
            globalThis.postMessage(message, target, transfer)
        }
    }

    addWorker = (options:{
        url?:URL|string|Blob,
        port?:MessagePort,
        _id?:string,
        onmessage?:(ev)=>void,
        onerror?:(ev)=>void
    }) => { //pass file location, web url, or javascript dataurl string
        let worker:Worker|MessagePort;

        if(!options._id) 
            options._id = `worker${Math.floor(Math.random()*1000000000000000)}`;

        if(options.url) worker = new Worker(options.url);
        else if (options.port) {
            worker = options.port;
        } else if (this.workers[options._id]) {
            if(this.workers[options._id].port) worker = this.workers[options._id].port;
            else worker = this.workers[options._id].worker;
        }

        //console.log('adding worker', options._id);

        if(!worker) return;

        let send = (message:any,transfer?:any) => {
            //console.log('sent', message)
            return this.transmit(message,worker,transfer);
        }

        let post = (route:any,args?:any,transfer?:any, method?:string) => {
            //console.log('sent', message)
            let message:any = {
                route,
                args
            };
            if(method) message.method = method;

            return this.transmit(message,worker,transfer);
        }

        let run = (route:any,args?:any, transfer?:any, method?:string) => {
            return new Promise ((res,rej) => {
                let callbackId = Math.random();
                let req = {route:'runRequest', args:[{route, args}, options._id, callbackId]} as any;
                //console.log(req)
                if(method) req.args[0].method = method;
                let onmessage = (ev)=>{
                    if(typeof ev.data === 'object') {
                        if(ev.data.callbackId === callbackId) {
                            worker.removeEventListener('message',onmessage);
                            res(ev.data.args); //resolve the request with the corresponding message
                        }
                    }
                }
                worker.addEventListener('message',onmessage)
                this.transmit(req, worker, transfer);
            });
        }
        
        let request = (message:ServiceMessage|any, transfer?:any, method?:string) => {
            return new Promise ((res,rej) => {
                let callbackId = Math.random();
                let req = {route:'runRequest', args:[message,options._id,callbackId]} as any;
                //console.log(req)
                if(method) req.method = method;
                let onmessage = (ev)=>{
                    if(typeof ev.data === 'object') {
                        if(ev.data.callbackId === callbackId) {
                            worker.removeEventListener('message',onmessage);
                            res(ev.data.args); //resolve the request with the corresponding message
                        }
                    }
                }
                worker.addEventListener('message',onmessage)
                this.transmit(req, worker, transfer);
            });
        }

        let workerSubs = {};

        //subscribe to this worker from the thread running this function
        let subscribe = (route:any, callback?:((res:any)=>void)|string, blocking?:boolean) => {
            return this.subscribeToWorker(route, options._id, callback, blocking);
        }

        let unsubscribe = (route:any, sub:number):Promise<any> => {
            return run('unsubscribe',[route,sub]);
        }

        //start a subscription to another worker/main thread on this worker
        let start = async (route?:string, portId?:string, callback?:string, blocking?:boolean) => {
            if(route)
                await run('subscribeToWorker',[route, portId, callback, blocking]).then((sub) => { 
                    if(sub) workerSubs[route+portId] = {sub, route, portId, callback, blocking}; 
                });
            else for(const key in workerSubs) {
                if(typeof workerSubs[key].sub !== 'number')
                    await run('subscribeToWorker', [workerSubs[key].route, workerSubs[key].portId, workerSubs[key].callback, workerSubs[key].blocking]).then((sub) => {
                        workerSubs[key].sub = sub;
                    }); 
            }
            return true;
        }

        //stop a subscription to another worker/main thread on this worker
        let stop = async (route?:string, portId?:string) => {
            if(route && portId && workerSubs[route+portId]) {
                await run('unsubscribe',[route,workerSubs[route+portId].sub]);
                workerSubs[route+portId].sub = false;
            } else {
                for(const key in workerSubs) {
                    if(typeof workerSubs[key].sub === 'number') {
                        await run('unpipeWorkers',[workerSubs[key].route, workerSubs[key].portId, workerSubs[key].sub])
                    } workerSubs[key].sub = false;
                }
            }
            return true;
        }

        let terminate = () => {
            for(const key in workerSubs) {
                if(typeof workerSubs[key].sub === 'number') {
                    run('unpipeWorkers',[workerSubs[key].route,workerSubs[key].portId,workerSubs[key].sub])
                } workerSubs[key].sub = false;
            }
            return this.terminate(options._id);
        }

        if(!options.onmessage) options.onmessage = (ev) => {
            this.receive(ev.data);
            this.setState({[options._id as string]:ev.data});
        }

        if(!options.onerror) {
            options.onerror = (ev) => {
                console.error(ev.data);
            }
        }

        worker.onmessage = options.onmessage;
        (worker as Worker).onerror = options.onerror;

        this.workers[options._id] = {
            worker:(worker as any),
            send,
            post,
            run,
            request,
            subscribe,
            unsubscribe,
            terminate,
            start,
            stop,
            postMessage:worker.postMessage,
            workerSubs,
            graph:this,
            ...options
        } as WorkerInfo;

        return this.workers[options._id];
    }

    //new Worker(urlFromString)
    toObjectURL = (scriptTemplate:string) => {
        let blob = new Blob([scriptTemplate],{type:'text/javascript'});
        return URL.createObjectURL(blob);
    }

    getTransferable(message:any) {
        //automatic dataview/typedarray/arraybuffer transferring. 
        // There are more transferable types but we start to slow things 
        //   down if we check too many cases so make transfer explicit in general! This is mainly for automating subscriptions
        let transfer;
        if(typeof message === 'object') {
            if(message.args) {
                if (message.args.constructor?.name === 'Object') {
                    for(const key in message.args) {
                        if(ArrayBuffer.isView(message.args[key])) {
                            if(!transfer) 
                                transfer = [message.args[key].buffer]  as StructuredSerializeOptions;
                            else 
                                (transfer as any[]).push(message.args[key].buffer);
                        } else if (message.args[key]?.constructor?.name === 'ArrayBuffer') {
                            if(!transfer) 
                                transfer = [message.args[key]]  as StructuredSerializeOptions;
                            else 
                                (transfer as any[]).push(message.args[key]);
                        }
                    }
                }
                else if(Array.isArray(message.args) && message.args.length < 11) { //lets check any argument less size 10 or less for typed array inputs
                    message.args.forEach((arg) => {
                        if(ArrayBuffer.isView(arg)) { 
                            transfer = [arg.buffer] as StructuredSerializeOptions;
                        } else if (arg.constructor?.name === 'ArrayBuffer') 
                            transfer = [arg] as StructuredSerializeOptions;
                    });
                } 
                else if(ArrayBuffer.isView(message.args)) { 
                    transfer = [message.args.buffer] as StructuredSerializeOptions;
                } 
                else if (message.args.constructor?.name === 'ArrayBuffer') {
                    transfer = [message] as StructuredSerializeOptions;
                } 
            }
            else if (message.constructor?.name === 'Object') { 
                for(const key in message) {
                    if(ArrayBuffer.isView(message[key])) {
                        if(!transfer) 
                            transfer = [message[key].buffer]  as StructuredSerializeOptions;
                        else 
                            (transfer as any[]).push(message[key].buffer);
                    } else if (message[key]?.constructor?.name === 'ArrayBuffer') {
                        if(!transfer) 
                            transfer = [message[key]]  as StructuredSerializeOptions;
                        else 
                            (transfer as any[]).push(message[key]);
                    }
                }
            }
            else if(Array.isArray(message) && message.length < 11) { //lets check any argument size 10 or less for typed array inputs
                message.forEach((arg) => {
                    if(ArrayBuffer.isView(arg)) { 
                        transfer = [arg.buffer] as StructuredSerializeOptions;
                    } else if (arg.constructor?.name === 'ArrayBuffer') 
                        transfer = [arg] as StructuredSerializeOptions;
                });
            } 
            else if(ArrayBuffer.isView(message)) { 
                transfer = [message.buffer] as StructuredSerializeOptions;
            }  
            else if (message.constructor?.name === 'ArrayBuffer') {
                transfer = [message] as StructuredSerializeOptions;
            } 
        }

        return transfer;
    }

    transmit = (message:ServiceMessage|any, worker?:Worker|MessagePort|string, transfer?:StructuredSerializeOptions ) => {
        
        if(!transfer) {
            transfer = this.getTransferable(message); //automatically transfer arraybuffers
        }

        //console.log(message)

        if(worker instanceof Worker || worker instanceof MessagePort) {
            worker.postMessage(message,transfer);
        } else if(typeof worker === 'string') {
            if(this.workers[worker as string]) {
                if(this.workers[worker as string].port)
                    (this.workers[worker as string].port as any).postMessage(message,transfer);
                else if (this.workers[worker as string].worker) 
                    this.workers[worker as string].worker.postMessage(message,transfer);
            }
        } else {
            let keys = Object.keys(this.workers);
            this.workers[keys[this.threadRot]].worker.postMessage(message,transfer);
            this.threadRot++;
            if(this.threadRot === keys.length) this.threadRot = 0;
        }
        return message;
    }

    terminate = (worker:Worker|MessagePort|string) => {
        let onclose;
        if(typeof worker === 'string') {
            let obj = this.workers[worker];
            if(obj) delete this.workers[worker];
            worker = obj.worker;
            if(obj.onclose) onclose = obj.onclose;
        }
        if(worker instanceof Worker) {
            worker.terminate();
            if(onclose) onclose(worker);
            return true;
        }
        if(worker instanceof MessagePort) {
            worker.close();
            if(onclose) onclose(worker);
            return true;
        }
        return false;
    }

    //if no second id provided, message channel will exist to this thread
    establishMessageChannel = (
        worker:Worker|string|MessagePort|WorkerInfo, 
        worker2?:Worker|string|MessagePort|WorkerInfo
    ) => {
        
        let workerId;
        if(typeof worker === 'string') {
            workerId = worker;
            if(this.workers[worker]){
                if(this.workers[worker].port) worker = this.workers[worker].port;
                else worker2 = this.workers[worker].worker;
            }
        } else if ((worker as WorkerInfo)?.worker) {
            worker = (worker as WorkerInfo).worker
        }
        if(typeof worker2 === 'string') {
            if(this.workers[worker2]){
                if(this.workers[worker2].port) worker2 = this.workers[worker2].port;
                else worker2 = this.workers[worker2].worker;
            }
        } else if ((worker2 as WorkerInfo)?.worker) {
            worker2 = (worker2 as WorkerInfo).worker
        }

        if(worker instanceof Worker || worker instanceof MessagePort) {
            let channel = new MessageChannel();
            let portId = `port${Math.floor(Math.random()*1000000000000000)}`;

            worker.postMessage({route:'addWorker',args:{port:channel.port1, _id:portId }},[channel.port1]);

            if(worker2 instanceof Worker || worker2 instanceof MessagePort) {
                worker2.postMessage({route:'addWorker',args:{port:channel.port2, _id:portId }},[channel.port2]);
            } else if(workerId && this.workers[workerId]) {
                channel.port2.onmessage = this.workers[workerId].onmessage;
                this.workers[workerId].port = channel.port2;
            }
        
            return portId;
        }

        return false;
        
    }

    request = (message:ServiceMessage|any, workerId:string, transfer?:any, method?:string) => {
        let worker = this.workers[workerId].worker;
        return new Promise ((res,rej) => {
            let callbackId = Math.random();
            let req = {route:'runRequest', args:[message, callbackId]} as any;
            if(method) req.method = method;
            let onmessage = (ev)=>{
                if(typeof ev.data === 'object') {
                    if(ev.data.callbackId === callbackId) {
                        worker.removeEventListener('message',onmessage);
                        res(ev.data.args); //resolve the request with the corresponding message
                    }
                }
            }
            worker.addEventListener('message',onmessage)
            this.transmit(req, worker, transfer);
        });
    }

    runRequest = (message:ServiceMessage|any, worker:undefined|string|Worker|MessagePort, callbackId:string|number) => {  
        let res = this.receive(message);
        if(typeof worker === 'string' && this.workers[worker]) {
            if(this.workers[worker].port) worker = this.workers[worker].port;
            else worker = this.workers[worker].worker;
        }
        //console.log('running request', message, 'for worker', worker, 'callback', callbackId)
        if(res instanceof Promise) {
            res.then((r) => {
                if(worker instanceof Worker || worker instanceof MessagePort) 
                    worker.postMessage({args:r,callbackId})
                else if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
                    globalThis.postMessage({args:r,callbackId});
            });
        } else {
            if(worker instanceof Worker || worker instanceof MessagePort) 
                worker.postMessage({args:res,callbackId})
            else if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
                globalThis.postMessage({args:res,callbackId});
        }

        return res;
    }

    subscribeWorker = (
        route:string, 
        worker:WorkerInfo|Worker|string|MessagePort, 
        blocking?:boolean //requires a WorkerInfo object 
    ) => {

        let callback:(res:any) => void;

        //console.log(route,worker);

        if(blocking) {

            let blocked = false;

            callback = (res:any) => {
                //console.log(worker,res,route,blocked)
                if(!blocked) {
                    blocked = true;
                
                    if(res instanceof Promise) {
                        res.then((r) => {
                            if((worker as WorkerInfo)?.run) 
                                (worker as WorkerInfo).run('triggerSubscription',[route,(worker as WorkerInfo)._id,r]).then((ret)=>{
                                    blocked = false;
                                    //if(ret !== undefined) this.setState({[worker._id]:ret});
                                    //console.log(ret)
                                });
                        });
                    } else {
                        if((worker as WorkerInfo)?.run) 
                            (worker as WorkerInfo).run('triggerSubscription',[route,(worker as WorkerInfo)._id,res]).then((ret)=>{
                                blocked = false;
                                //if(ret !== undefined) this.setState({[worker._id]:ret});
                                //console.log(ret)
                            });
                    }
                } 
            }
        }
        else {
            callback = (res:any) => {
                //console.log('running request', message, 'for worker', worker, 'callback', callbackId)
                //console.log('subscription triggered for', route, 'to', worker instanceof Worker ? worker : 'window', 'result:', res);
                if(res instanceof Promise) {
                    res.then((r) => {
                        if((worker as any)?.postMessage) 
                            (worker as any).postMessage({args:r,callbackId:route})
                        else if(globalThis.postMessage)
                            globalThis.postMessage({args:r,callbackId:route});
                    });
                } else {
                    if((worker as any)?.postMessage) 
                        (worker as any).postMessage({args:res,callbackId:route})
                    else if(globalThis.postMessage)
                        globalThis.postMessage({args:res,callbackId:route});
                }
            }
        }

        if(!blocking && (worker as WorkerInfo)?.port) {
            worker = (worker as WorkerInfo).port;
        }
        else if(!blocking && (worker as WorkerInfo)?.worker) {
            worker = (worker as WorkerInfo).worker;
        } 
        else if(typeof worker === 'string' && this.workers[worker]) {
            if(blocking) worker = this.workers[worker];
            else if(this.workers[worker].port) worker = this.workers[worker].port;
            else worker = this.workers[worker].worker;
        } //else we are subscribing to window

        return this.subscribe(route,callback);
    }

    subscribeToWorker = (
        route:string, 
        workerId:string, 
        callback?:((res:any)=>void)|string,
        blocking?:boolean
    ) => {
        //console.log(route, workerId, callback, this.workers[workerId]);
        if(typeof workerId === 'string' && this.workers[workerId]) {
            this.subscribe(workerId, (res) => {
                //console.log('res',res);
                if(res?.callbackId === route) {
                    if(!callback) this.setState({[workerId]:res.args}); //just set state
                    else if(typeof callback === 'string') { //run a local node
                        this.run(callback,res.args);
                    }
                    else callback(res.args);
                }
            });
            return this.workers[workerId].run('subscribeWorker', [route, workerId, blocking]);
        }
    }

    triggerSubscription = async (
        route:string,
        workerId:string,
        result:any
    ) => {
        if(this.state.triggers[workerId]) for(let i = 0; i < this.state.triggers[workerId].length; i++) {
            await this.state.triggers[workerId][i].onchange({args:result, callbackId:route});//make sure async stuff resolves too
        }
        return true;
    }

    pipeWorkers = ( //worker a listens to worker b, be sure to unsubscribe on the source when terminating
        sourceWorker:WorkerInfo|string,
        listenerWorker:WorkerInfo|string, 
        sourceRoute:string, 
        listenerRoute:string, 
        portId?:string,
        blocking?:boolean
    ) => {
        if(typeof sourceWorker === 'string') sourceWorker = this.workers[sourceWorker];
        if(typeof listenerWorker === 'string') listenerWorker = this.workers[listenerWorker];
        if(!portId) {
            portId = this.establishMessageChannel(sourceWorker.worker,listenerWorker.worker) as string;
        }
        return listenerWorker.run('subscribeToWorker',[sourceRoute,portId,listenerRoute,blocking]) as Promise<number>; //just run .unsubscribe on worker2.
    }

    unpipeWorkers = (
        sourceRoute:string,
        sourceWorker:WorkerInfo|string,
        sub?:number
    ) => {
        if(typeof sourceWorker === 'string') sourceWorker = this.workers[sourceWorker];
        if(sourceWorker)
            return sourceWorker.run('unsubscribe',[sourceRoute,sub]);
    }

    //requires unsafe service to load on other end
    transferFunction(worker:WorkerInfo, fn:Function, fnName?:string) {
        if(!fnName) fnName = fn.name;
        return worker.request({
            route:'setRoute',
            args:[
                fn.toString(),
                fnName
            ]
        } as ServiceMessage);
    }

    //requires unsafe service to load on other end
    transferClass(worker:WorkerInfo, cls:Function, className?:string) {
        if(!className) className = cls.name;
        return worker.request({
            route:'receiveClass',
            args:[
                cls.toString(),
                className
            ] 
        } as ServiceMessage);
    }


    routes:Routes={
        addWorker:{
            operator:this.addWorker,
            aliases:['open']
        },
        toObjectURL:this.toObjectURL,
        request:this.request,
        runRequest:this.runRequest,
        establishMessageChannel:this.establishMessageChannel,
        subscribeWorker:this.subscribeWorker,
        subscribeToWorker:this.subscribeToWorker,
        triggerSubscription:this.triggerSubscription,
        subscribe:this.subscribe,
        pipeWorkers:this.pipeWorkers,
        unpipeWorkers:this.unpipeWorkers,
        unsubscribe:(route,sub)=>{
            //console.log('unsubbing',route,sub,this.state.triggers,this.nodes.keys());  
            this.unsubscribe(route,sub);
        },
        terminate:this.terminate
    }

}