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
    callback?:string //Run this route on the worker when the operator is called. If this route is a child of another node, run this node on the child worker when it receives a message. 
} & GraphNodeProperties & WorkerProps

export type WorkerProps = {
    worker:WorkerInfo,
    workerUrl?: string|URL|Blob,
    url?:URL|string|Blob,
    _id?:string,
    port?:MessagePort, //message channel for this instance
    onmessage?:(ev)=>void,
    onerror?:(ev)=>void
} 

export type WorkerInfo = {
    worker:Worker,
    send:(message:any,transfer?:any)=>void,
    request:(message:any, transfer?:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any, transfer?:any)=>void,
    run:(route:any, args?:any, transfer?:any, method?:string)=>Promise<any>
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:()=>boolean,
    graph:WorkerService
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
            globalThis.onmessage = (ev:MessageEvent) => {
                let result = this.receive(ev.data); //this will handle graph logic and can run requests for the window or messsage ports etc etc.
                //console.log(JSON.stringify(ev.data), JSON.stringify(result),JSON.stringify(Array.from((self as any).SERVICE.nodes.keys())))
                //console.log(result);
                if(this.keepState) this.setState({[this.name]:result}); //subscribe to all outputs
            }
        }
    }

    customRoutes:ServiceOptions["customRoutes"] = {
        'worker':(route:Route | WorkerRoute,routeKey:string, routes:Routes) => {
            let rt = route as WorkerRoute;
            if(rt?.worker || rt?.workerId) { //each set of props with a worker will instantiate a new worker, else you can use the same worker elsewhere by passing the corresponding tag
                if(rt.workerUrl) rt.url = rt.workerUrl;
                if(rt.workerId) rt.tag = rt.workerId;
                if(!rt.tag) rt.tag = routeKey;
                rt._id = rt.tag;

                let worker:WorkerInfo;
                if(this.workers[rt._id]) worker = this.workers[rt._id];
                if(!worker) worker = this.addWorker(rt);
                rt.worker = worker;

                //requires unsafeservice on the worker (enabled on the default worker)
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
                            console.log('operator', args)
                            if(rt.callback) {
                                if(!this.nodes.get(rt.tag)?.children) worker.post(rt.callback,args);
                                else return worker.run(rt.callback,args);
                            } else {
                                if(!this.nodes.get(rt.tag)?.children) worker.send(args);
                                else return worker.request(args);
                            }
                        }
                    }
                }
            }

            return rt;
        }
    }

    customChildren:ServiceOptions["customChildren"] = {
        'worker':(child: WorkerRoute, childRouteKey: string, parent: WorkerRoute, routes: Routes, checked: Routes) => {

            let worker;
            if((child as WorkerRoute)?.worker || (child as WorkerRoute)?.workerId) {
                if(child.workerUrl) child.url = child.workerUrl;
                if(child.workerId) child.tag = child.workerId;
                if(!child.tag) child.tag = childRouteKey;
                child._id = child.tag;

                if(this.workers[child._id]) worker = this.workers[child._id];
                if(!worker) worker = this.addWorker(child);
                child.worker = worker;
        
                //requires unsafeservice on the worker (enabled on the default worker)
                if(child.transferFunctions) {
                    for(const prop in child.transferFunctions) {
                        this.transferFunction(worker,child.transferFunctions[prop],prop)
                    }
                }
                if(child.transferClasses) {
                    for(const prop in child.transferClasses) {
                        this.transferClass(worker,child.transferClasses[prop],prop)
                    }
                }

                if(worker) {
                    if(!child.operator) {
                        child.operator = (...args) => {
                            console.log('operator', args)

                            if(child.callback) {
                                if(!this.nodes.get(child.tag)?.children) worker.post(child.callback,args);
                                else return worker.run(child.callback,args);
                            } else { //just post whatever 
                                if(!this.nodes.get(child.tag)?.children) worker.send(args);
                                else return worker.request(args);
                            }
                        }
                    }
                }
            }
            if(child.parentRoute && ((parent as WorkerRoute)?.worker || (parent as WorkerRoute)?.workerId)) {
                
                if(worker) {
                    let portId = this.establishMessageChannel(worker,parent.worker.worker)
                    worker.post('subscribeToWorker', child.parentRoute, portId, child.callback);
                } else {
                    parent.worker.subscribe(child.parentRoute,(result) => {this.nodes.get(child.tag ? child.tag : childRouteKey).run(result)});
                }
            }
        }
    } //todo, create message ports between workers with parent/child relationships and set up pipes

    addWorker = (options:{
        url?:URL|string|Blob,
        port?:MessagePort,
        _id?:string,
        onmessage?:(ev)=>void,
        onerror?:(ev)=>void
    }) => { //pass file location, web url, or javascript dataurl string
        let worker;

        if(!options._id) 
            options._id = `worker${Math.floor(Math.random()*1000000000000000)}`;

        if(options.url) worker = new Worker(options.url);
        else if (options.port) {
            worker = options.port;
        } else if (this.workers[options._id]) {
            if(this.workers[options._id].port) worker = this.workers[options._id].port;
            else worker = this.workers[options._id].worker;
        }

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

        let subscribe = (route:any, callback?:((res:any)=>void)|string) => {
            return this.subscribeToWorker(route, options._id, callback);
        }

        let unsubscribe = (route:any, sub:number):Promise<any> => {
            return run('unsubscribe',[route,sub]);
        }

        let terminate = () => {
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
        worker.onerror = options.onerror;

        this.workers[options._id] = {
            worker,
            send,
            post,
            run,
            request,
            subscribe,
            unsubscribe,
            terminate,
            graph:this,
            ...options
        }

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
        if(typeof worker === 'string') {
            let obj = this.workers[worker];
            if(obj) delete this.workers[worker];
            worker = obj.worker;
        }
        if(worker instanceof Worker) {
            worker.terminate();
            return true;
        }
        if(worker instanceof MessagePort) {
            worker.close();
            return true;
        }
        return false;
    }

    //if no second id provided, message channel will exist to this thread
    establishMessageChannel = (worker:Worker|string|MessagePort, worker2?:Worker|string|MessagePort) => {
        
        let workerId;
        if(typeof worker === 'string') {
            workerId = worker;
            if(this.workers[worker]){
                if(this.workers[worker].port) worker = this.workers[worker].port;
                else worker2 = this.workers[worker].worker;
            }
        }
        if(typeof worker2 === 'string') {
            if(this.workers[worker2]){
                if(this.workers[worker2].port) worker2 = this.workers[worker2].port;
                else worker2 = this.workers[worker2].worker;
            }
        } 

        if(worker instanceof Worker || worker instanceof MessagePort) {
            let channel = new MessageChannel();
            let portId = `port${Math.floor(Math.random()*1000000000000000)}`;

            worker.postMessage({route:'addWorker',args:{port:channel.port1, _id:portId}},[channel.port1]);

            if(worker2 instanceof Worker || worker2 instanceof MessagePort) {
                worker2.postMessage({route:'addWorker',args:{port:channel.port2, _id:portId}},[channel.port2]);
            } else if(workerId && this.workers[workerId]) this.workers[workerId].port = channel.port2;
        
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

    subscribeWorker = (route:string, worker:Worker|string|MessagePort) => {
        //console.log('subscribed!',worker, this.workers, WorkerGlobalScope);
        if(typeof worker === 'string' && this.workers[worker]) {
            if(this.workers[worker].port) worker = this.workers[worker].port;
            else worker = this.workers[worker].worker;
        }
        return this.subscribe(route, (res:any) => {
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
        });
    }

    subscribeToWorker = (route:string, workerId:string, callback?:((res:any)=>void)|string) => {
        if(typeof workerId === 'string' && this.workers[workerId]) {
            this.subscribe(workerId, (res) => {
                if(res?.callbackId === route) {
                    if(!callback) this.setState({[workerId]:res.args}); //just set state
                    else if(typeof callback === 'string') { //run a local node
                        this.run(callback,res.args);
                    }
                    else callback(res.args);
                }
            });
            return this.workers[workerId].run('subscribeWorker', [route, workerId]);
        }
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
        unsubscribe:this.unsubscribe,
        terminate:this.terminate
    }

}