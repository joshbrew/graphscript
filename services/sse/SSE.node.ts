import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
import {createSession, createChannel, Session, SessionState, Channel} from 'better-sse'; //third party lib. SSEs really just push notifications to an http endpoint but it's minimal overhead
import http from 'http'
import https from 'https'
import { Readable } from "node:stream";

//using better-sse, load any http/https servers in

export type SSEProps = {
    server:http.Server|https.Server,
    path:string,
    channels?:string[],
    onconnection?:(session:any,sseinfo:any,_id:string,req:http.IncomingMessage,res:http.ServerResponse)=>void,
    onclose?:(sse:any)=>void,
    onconnectionclose?:(session:any,sseinfo:any,_id:string,req:http.IncomingMessage,res:http.ServerResponse)=>void,
    type?:'sse'|string,
    _id?:string,
    [key:string]:any
}

export type SSEChannelInfo = {
    channel: Channel<Record<string, unknown>>,
    sessions:{
        [key:string]:Session<SessionState>
    },
    requests:{[key:string]:Function}, //outstanding request promises
    send:(message:any, eventName?:string, sessionId?:string)=>any,
    request:(message:any, method?:string, sessionId?:string, eventName?:string)=>Promise<any>|Promise<any>[],
    post:(route:any, args?:any, method?:string, sessionId?:string, eventName?:string)=>void,
    run:(route:any, args?:any, method?:string, sessionId?:string, eventName?:string)=>Promise<any>|Promise<any>[],
    subscribe:(route:any, callback?:((res:any)=>void)|string, sessionId?:string)=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe:(route:any, sub:number, sessionId?:string, eventName?:string)=>Promise<boolean>|Promise<boolean>[],
    terminate:() => boolean,
    _id:string,
    graph:SSEbackend
} & SSEProps;

export type SSEClientInfo = {
    _id:string, 
    session:Session<SessionState>, 
    served:SSEChannelInfo,
    send:(message:any, eventName?:string)=>any,
    request:(message:any, method?:string,  eventName?:string)=>Promise<any>,
    post:(route:any, args?:any, method?:string, eventName?:string)=>void,
    run:(route:any, args?:any, method?:string, eventName?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number, eventName?:string)=>Promise<boolean>,
    terminate:() => boolean,
    onclose?:(session:any,sseinfo:any,_id:string,req:http.IncomingMessage,res:http.ServerResponse)=>void,
    graph:SSEbackend
}

export class SSEbackend extends Service {

    name='sse'
    
    debug=false;

    servers:{
        [key:string]:SSEChannelInfo
    }={}
    
    eventsources:{ //the session instances
        [key:string]:SSEClientInfo
    }={}

    connections = { //higher level reference for router
        servers:this.servers, eventsources:this.eventsources
    }

    
    constructor(options?:ServiceOptions) {
        super(options)
        this.load(this.routes);
    }

    setupSSE = (options:SSEProps) => {

        const server = options.server; 
        let path = options.path;
        
        if(this.servers[path]) {
            return false;
        }

        const channel = createChannel(); //sse broadcasting channel

        let sse = {
            type:'sse',
            channel,
            sessions:{},
            requests:{}, //outstanding request promises
            ...options
        } as SSEChannelInfo;
        
        this.servers[path] = sse;

        sse._id = options._id ? options._id : path;

        if(!sse.onconnectionclose) sse.onconnectionclose = (session,sse,id,req,res) => {
            delete sse.sessions[id];
        }

        const send = (
            message:any, //the data you want to send
            eventName?:string, //send as a particular event? Default is 'message'
            sessionId?:string //send to a particular client?
        ) => {
            return this.transmit(message, path, eventName, sessionId);
        }

        const terminate = () => {
            return this.terminate(path);
        }

        let request = (message:ServiceMessage|any, method?:string, sessionId?:string, eventName?:string) => {
            if(!sessionId) {
                let promises:Promise<any>[] = [];
                for(const key in sse.sessions) {
                    promises.push(this.request(message, path, key, eventName));
                }
                return promises;
            }
            return this.request(message, path, method, sessionId, eventName)
        }

        let post = (route:any, args?:any, method?:string, sessionId?:string, eventName?:string) => {
            //console.log('sent', message)
            let message:any = {
                route,
                args
            };
            if(method) message.method = method;

            return this.transmit(message, path, eventName, sessionId);
        }

        let run = (route:any, args?:any, method?:string, sessionId?:string, eventName?:string) => {
            let r = {route,args};
            if(!sessionId) {
                let promises:Promise<any>[] = [];
                for(const key in sse.sessions) {
                    promises.push(this.request(r, path, key, eventName));
                }
                return promises;
            }
            return this.request(r, path, method, sessionId, eventName)
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string, sessionId?:string):Promise<number>|Promise<number>[]|undefined => {
            return this.subscribeToSSE(route, options.url, callback, sessionId);
        }

        let unsubscribe = (route:any, sub:number, sessionId?:string, eventName?:string):Promise<boolean>|Promise<boolean>[] => {
            return run('unsubscribe',[route,sub],undefined,sessionId,eventName);
        }

        sse.send = send;
        sse.request = request;
        sse.post = post;
        sse.run = run;
        sse.subscribe = subscribe;
        sse.unsubscribe = unsubscribe;
        sse.terminate = terminate;
        sse.graph = this;


        let onRequest = (req:http.IncomingMessage,response:http.ServerResponse) => {
            if(req.url?.includes(path)) {
                if(req.method === 'GET') {
                    if(this.debug) console.log('SSE Request', path);
    
                    createSession(req,response).then((session) => {
    
                        channel.register(session);
                        let _id = `sse${Math.floor(Math.random()*1000000000000000)}`;
                        sse.sessions[_id] = session;
    
                        this.eventsources[_id] = {
                            _id,
                            session,
                            served:sse,
                            send:(message,eventName?)=>{
                                return send(message,eventName,_id);
                            },
                            request:(message,method,eventName?)=>{
                                return request(message,method,_id,eventName);
                            },
                            post:(route,args,method?,eventName?) =>{
                                return post(route,args,method,_id,eventName);
                            },
                            run:(route,args,method?,eventName?) => {
                                return run(route,args,method,_id,eventName);
                            },
                            subscribe:(route,callback?)=>{
                                return subscribe(route,callback,_id);
                            },
                            unsubscribe:(route,sub,eventName?)=>{
                                return unsubscribe(route,sub,_id,eventName);
                            },
                            terminate:() => {
                                delete this.eventsources[_id];
                                delete sse.sessions[_id];
                                return true;
                            },
                            onclose:()=>options.onconnectionclose,
                            graph:this
                        } as SSEClientInfo;
    
                        session.push(JSON.stringify({route:'setId',args:_id})); //associate this user's connection with a server generated id 
                        session.on('close',()=>{if(this.eventsources[_id].onclose) (this.eventsources[_id] as any).onclose(session,sse,_id,req,response)})
                        if(sse.onconnection) {sse.onconnection(session,sse,_id,req,response);}
                    
                    });
                } else { //e.g. POST from the client to this url to run processes to receive results back thru the sse
                    let body:any = [];
                    req.on('data',(chunk)=>{ //https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
                        body.push(chunk);
                    }).on('end',() => {
                        body = Buffer.concat(body).toString(); //now it's a string
                                
                        if(typeof body === 'string') {
                            let substr = body.substring(0,8);
                            if(substr.includes('{') || substr.includes('[')) {
                                if(substr.includes('\\')) body = body.replace(/\\/g,""); 
                                if(body[0] === '"') { body = body.substring(1,body.length-1)};
                                body = JSON.parse(body); //parse stringified args, this is safer in a step
                            }
                        }

                        
                        let route,method,args,callbackId;
                        if(body?.route || body?.callbackId){ //if arguments were posted 
                            method = body.method;
                            args = body.args;
                            callbackId = body.callbackId;

                            if(typeof body.route === 'string') {
                                if(body.route.includes('/') && body.route.length > 1) 
                                    body.route = body.route.split('/').pop();
                                route = this.routes[body.route];
                            }
                           
                        }
                        if(route) {
                            let res = this.receive({route,args,method});
                        } else if (callbackId && sse.requests[callbackId]) {
                            sse.requests[callbackId](args);
                        }
                        if(this.keepState) this.setState({[path]:body});
                    });
                }
            }
            
        }

        let requestListeners = server.listeners('request');
        server.removeAllListeners('request');

        const otherListeners = (req:http.IncomingMessage,res:http.ServerResponse) => {
            requestListeners.forEach((l)=> {
                l(req,res);
            });
        }
        
        const sseListener =  (req:http.IncomingMessage,res:http.ServerResponse) => { 
            if(req.url) if(req.url.indexOf(path) > -1) { //redirect requests to this listener if getting this path
                if(!this.servers[path]) { //removes this listener if not found and returns to the original listener array
                    server.removeListener('request',sseListener);
                    server.addListener('request',otherListeners);
                }
                onRequest(req,res);
            }
            else otherListeners(req,res);
        }

        server.addListener('request',sseListener);

        server.addListener('close',()=>{
            if(sse.onclose) sse.onclose(sse);
        });

        return sse;

    }

    streamIterable = (
        path:string,
        iterable:Iterable<any>|AsyncIterable<any>,
        sessionId?:string,
        eventName:string='message'
    ) => {
        let server = this.servers[path];
        if(server) {
            if(sessionId) {
                if(server.sessions[sessionId]) {
                    return server.sessions[sessionId].iterate(iterable,{eventName});
                }
            } else {
                let promises:Promise<void>[] = [];
                for(const key in server.sessions) {
                    promises.push(server.sessions[key].iterate(iterable));
                }
                return promises;
            }
        }
    }
    
    streamReadable = (
        path:string,
        readable:Readable,
        sessionId?:string,
        eventName='message'
    ) => {
        let server = this.servers[path];
        if(server) {
            if(sessionId) {
                if(server.sessions[sessionId]) {
                    return server.sessions[sessionId].stream(readable,{eventName});
                }
            } else {
                let promises:Promise<boolean>[] = [];
                for(const key in server.sessions) {
                    promises.push(server.sessions[key].stream(readable));
                }
                return promises;
            }
        }
    }
    
    transmit = (
        data:string | ServiceMessage, 
        path?:string, 
        eventName?:string, //event name? default is 'message'
        sessionId?:string //particular client?
    ) => {
        if(!path && typeof data === 'object') {
            if(data.route) {
                let keys = Object.keys(this.servers)
                if(keys.length > 0) 
                    {
                        let evs = this.servers[keys[0]];
                        if(evs.channels?.includes(data.route)) {
                            path = evs.path;
                            eventName = data.route;
                        }
                    }
                if(!path && data.route) 
                    if(this.servers[data.route]) 
                        path = data.route;
                
            }
            //if(!channel && data.route) channel = path; //there could be a channel for each route 
            data = JSON.stringify(data);
        }

        if(!path) path = Object.keys(this.servers)[0]; //transmit on default channel

        if(path && this.servers[path]) {
            if(sessionId) {
                if(this.servers[path].sessions[sessionId]?.isConnected) {
                    this.servers[path].sessions[sessionId].push(data, eventName);
                } else if(this.servers[path].sessions[sessionId]) {
                    delete this.servers[path].sessions[sessionId]; //remove inactive sessions
                    return false;
                }
            }
            else this.servers[path].channel.broadcast(data, eventName); // specific events broadcasted to all sessions on the event source
        
            return true;
        } 

        return false;
    }

    request = (
        message:any,
        path:string,
        method?:string,
        sessionId?:string,
        eventName?:string
    ):Promise<any> => {
        
        return new Promise((res,rej) => {
            let callbackId = `${Math.random()}`;
            let req:any = {route:'runRequest',args:[message,path,callbackId,sessionId]}
            if(method) req.method = method;
            let sse = this.servers[path];

            let callback = (result:any) => {
                res(result);
            }

            sse.requests[callbackId] = callback; //this is resolved in the SSE path's request handler

            if(sse) {
                if(sessionId) {
                    if(sse.sessions[sessionId]) sse.sessions[sessionId].push(JSON.stringify(req),eventName)
                } else sse.channel.broadcast(JSON.stringify(req),eventName);
            }


        });
    }

    runRequest = (
        message:any,
        path:string,
        callbackId:string|number,
        sessionId?:string
    ) => {
        let res = this.receive(message);
        if(path) {
            let sse = this.servers[path];
            if(sse) {
                if(res instanceof Promise) {
                    res.then((r) => {
                        if(sessionId) {
                            if(sse.sessions[sessionId]) {
                                sse.sessions[sessionId].push(JSON.stringify({args:r,callbackId}));
                            }
                        }
                        else {
                            sse.channel.broadcast(JSON.stringify({args:r,callbackId})) //send to all if no sessionId specified (wheeee)
                        }
                    })
                }
                else {
                    if(sessionId) {
                        if(sse.sessions[sessionId]) {
                            sse.sessions[sessionId].push(JSON.stringify({args:res,callbackId}));
                        }
                    }
                    else sse.channel.broadcast(JSON.stringify({args:res,callbackId})) //send to all if no sessionId specified (wheeee)
                }
            }
        }
        return res;
    }

    subscribeSSE = (
        route:string, 
        path:string, 
        sessionId?:string,
        eventName?:string
    ) => {
        if(this.servers[path]) {
            return this.subscribe(route, (res) => {
                this.servers[path].send({args:res, callbackId:route}, eventName, sessionId);
            })
        }
    }

    subscribeToSSE = (
        route:string, 
        path:string, 
        callback?:string|((res:any)=>void), 
        sessionId?:string,
        eventName?:string
    ) => {
        if(this.servers[path]) {

            this.subscribe(path,(res) => {
                if(res?.callbackId === route) {
                    if(!callback) this.setState({[path]:res.args}); //just set state
                    else if(typeof callback === 'string') { //run a local node
                        this.run(callback,res.args);
                    }
                    else callback(res.args);
                }
            });

            if(sessionId) {
                if(this.servers[path].sessions[sessionId]) {
                    return this.eventsources[sessionId].run(
                        'subscribeSSE', 
                        {route:'subscribeSSE',args:[route,path]}, 
                        undefined, 
                        eventName
                    ) as Promise<number>
                }
            } else {
                let promises:Promise<number>[] = [];
                for(const key in this.servers[path].sessions) {
                    promises.push(
                        this.eventsources[key].run(
                            'subscribeSSE', 
                            {route:'subscribeSSE',args:[route,path]}, 
                            undefined, 
                            eventName
                        ) as Promise<number>
                    )
                }
                return promises;
            }
        }
    }

    terminate = (sse:string|SSEChannelInfo) => {
        if(typeof sse === 'object') delete this.servers[sse.path];
        else if(typeof sse === 'string') {
            delete this.servers[sse];
            delete this.eventsources[sse]; //delete sessions by ID too
        }

        return true;
    }

    routes:Routes = {
        setupSSE:{
            operator:this.setupSSE,
            aliases:['open']  
        },
        terminate:this.terminate,
        transmit:this.transmit,
        request:this.request,
        runRequest:this.runRequest,
        streamReadable:this.streamReadable,
        streamIterable:this.streamIterable
    }

}