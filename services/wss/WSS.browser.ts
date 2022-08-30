import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";

export type WebSocketProps = {
    host:string,
    port:number,
    path?:string,
    onmessage?:(data:string | ArrayBufferLike | Blob | ArrayBufferView,  ws:WebSocket, wsinfo:WebSocketInfo)=>void, //will use this.receive as default
    onopen?:(ev:any, ws:WebSocket, wsinfo:WebSocketInfo)=>void,
    onclose?:(ev:any,  ws:WebSocket, wsinfo:WebSocketInfo)=>void,
    onerror?:(ev:any,  ws:WebSocket, wsinfo:WebSocketInfo)=>void
    protocol?:'ws'|'wss',
    keepState?:boolean,
    type?:'socket',
    _id?:string,
    [key:string]:any
}

export type WebSocketInfo = {
    socket:WebSocket,
    address:string,
    send:(message:any)=>void,
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:()=>boolean,
    _id?:string,
    graph:WSSfrontend
} & WebSocketProps

//browser side websockets
export class WSSfrontend extends Service {

    name='wss'
    
    sockets:{
        [key:string]:WebSocketInfo
    } = { }

    connections = { //higher level reference for Router
        sockets:this.sockets
    }

    
    constructor(options?:ServiceOptions) {
        super(options)
        this.load(this.routes);
    }

    openWS = (
        options:WebSocketProps = {
            host:'localhost',
            port:7000,
            path:undefined,
            protocol:'ws',
            onclose:(ev:any,socket:WebSocket,wsinfo:WebSocketInfo)=>{
                if(ev.target.url) delete this.sockets[ev.target.url];
            }
        }
    ) => {
        let protocol = options.protocol;
        if(!protocol) protocol = 'ws';
        let address = `${protocol}://${options.host}`;

        if(!('keepState' in options)) options.keepState = true;
        if(options.port) address+= ':'+options.port;
        if(options.path && !options.path?.startsWith('/')) address += '/';
        if(options.path) address += options.path;

        if(this.sockets[address]?.socket)
            if(this.sockets[address].socket.readyState === this.sockets[address].socket.OPEN) 
                this.sockets[address].socket.close(); //we'll try refresh the socket

        const socket = new WebSocket(address);

        if(!options.onmessage) {
            if(!options._id){
            options.onmessage = (data:any, ws:WebSocket, wsinfo:WebSocketInfo) => { 
                if(data) if(typeof data === 'string') {
                    let substr = data.substring(0,8);
                    if(substr.includes('{') || substr.includes('[')) {    
                        if(substr.includes('\\')) data = data.replace(/\\/g,"");
                        if(data[0] === '"') { data = data.substring(1,data.length-1)};
                        //console.log(message)
                        data = JSON.parse(data); //parse stringified objects

                        if(data.route === 'setId') {
                            this.sockets[address]._id = data.args;
                            options.onmessage = (data:any, ws:WebSocket, wsinfo:WebSocketInfo) => { //clear extra logic after id is set
                                this.receive(data); 
                                if(options.keepState) {
                                    this.setState({[address as string]:data});
                                }
                            }
                        }
                    }
                } 
                
                let res = this.receive(data); 
                if(options.keepState) this.setState({[address]:data}); 
            } //default onmessage
            }
            else {
                options.onmessage = (data:any, ws:WebSocket, wsinfo:WebSocketInfo)=> {
                    this.receive(data,socket,this.sockets[address]); 
                    if(options.keepState) {
                        this.setState({[address]:data});
                    }
                }; //clear this extra logic after id is set
            }
        }

        if((options as any).onmessage) {
            socket.addEventListener('message',(ev)=>{
                (this.sockets[address] as any).onmessage(ev.data, socket, this.sockets[address]);
            });
        }
        socket.addEventListener('open',(ev)=>{if(this.sockets[address].onopen) (this.sockets[address] as any).onopen(ev,socket, this.sockets[address]);});
        socket.addEventListener('close',(ev)=>{if(this.sockets[address].onclose) (this.sockets[address] as any).onclose(ev,socket, this.sockets[address]);});
        socket.addEventListener('error',(ev)=>{if(this.sockets[address].onerror) (this.sockets[address] as any).onerror(ev,socket, this.sockets[address]);});

        
        let send = (message:ServiceMessage|any) => {
            //console.log('sent', message)
            return this.transmit(message,socket);
        }

        let post = (route:any,args?:any, method?:string) => {
            //console.log('sent', message)
            let message:any = {
                route,
                args
            };
            if(method) message.method = method;

            return this.transmit(message,socket);
        }

        let run = (route:any,args?:any,method?:string) => {
            return new Promise ((res,rej) => {
                let callbackId = Math.random();
                let req = {route:'runRequest', args:[{route, args}, options._id, callbackId]} as any;
                //console.log(req)
                if(method) req.args[0].method = method;
                let onmessage = (ev)=>{
                    if(typeof ev.data === 'string' && ev.data.indexOf('{') > -1) ev.data = JSON.parse(ev.data);
                    if(typeof ev.data === 'object') {
                        if(ev.data.callbackId === callbackId) {
                            socket.removeEventListener('message',onmessage);
                            res(ev.data.args); //resolve the request with the corresponding message
                        }
                    }
                }
                socket.addEventListener('message',onmessage)
                this.transmit(req, socket);
            });
        }
        
        let request = (message:ServiceMessage|any, method?:string) => {
            return new Promise ((res,rej) => {
                let callbackId = Math.random();
                let req = {route:'runRequest', args:[message,options._id,callbackId]} as any;
                //console.log(req)
                if(method) req.method = method;
                let onmessage = (ev)=>{
                    if(typeof ev.data === 'string' && ev.data.indexOf('{') > -1) ev.data = JSON.parse(ev.data);
                    if(typeof ev.data === 'object') {
                        if(ev.data.callbackId === callbackId) {
                            socket.removeEventListener('message',onmessage);
                            res(ev.data.args); //resolve the request with the corresponding message
                        }
                    }
                }
                socket.addEventListener('message',onmessage)
                this.transmit(req, socket);
            });
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string):Promise<number> => {
            return this.subscribeToSocket(route, options._id, callback);
        }

        let unsubscribe = (route:any, sub:number):Promise<any> => {
            return run('unsubscribe',[route,sub]);
        }

        let terminate = () => {
            return this.terminate(options._id);
        }

        this.sockets[address] = {
            type:'socket',
            socket,
            address,
            send,
            post,
            run,
            request,
            subscribe,
            unsubscribe,
            terminate,
            graph:this,
            ...options
        };

        return this.sockets[address];
    }

    transmit = (
        data:string | ArrayBufferLike | Blob | ArrayBufferView | ServiceMessage, 
        ws:WebSocket
    ) => {
        if(typeof data === 'object') data = JSON.stringify(data);
        if(!ws) {
            let s = this.sockets[Object.keys(this.sockets)[0]];
            if(s) ws = s.socket;
        }
        if(ws instanceof WebSocket && ws?.readyState === 1) ws.send(data);

        return true;
    }

    terminate = (ws:WebSocket|string) => {
        if(!ws) {
            let key = Object.keys(this.sockets)[0]
            if(key) ws = this.sockets[key].socket;
        }
        else if(typeof ws === 'string') {
            for(const k in this.sockets) {
                if(k.includes(ws)) {
                    ws = this.sockets[k].socket;
                    break;
                }
            }
        }

        if(ws instanceof WebSocket) 
            if(ws.readyState === ws.OPEN) 
                ws.close();

        return true;
    }

    request = (
        message:ServiceMessage|any, 
        ws:WebSocket, 
        _id:string, 
        method?:string
    ) => { //return a promise which can resolve with a server route result through the socket
        let callbackId = `${Math.random()}`;
        let req:any = {route:'runRequest', args:[message,_id,callbackId]};
        if(method) req.method = method;
        return new Promise((res,rej) => {
            let onmessage = (ev:any) => {
                let data = ev.data;
                if(typeof data === 'string') if(data.includes('callbackId')) data = JSON.parse(data);
                if(typeof data === 'object') if(data.callbackId === callbackId) {
                    ws.removeEventListener('message',onmessage);
                    res(data.args);
                }
            }

            ws.addEventListener('message',onmessage);
            ws.send(JSON.stringify(req));
        })
    }

    runRequest = (
        message:any, 
        ws:WebSocket|string, 
        callbackId:string|number
    ) => { //send result back
        let res = this.receive(message);
        if(typeof ws === 'string') {
            for(const s in this.sockets) {
                if(s === ws) {ws = this.sockets[s].socket; break;}
            }
        }
        if(ws) {
            if(res instanceof Promise) {
                res.then((v) => {        
                    res = {args:v, callbackId};
                    if(ws instanceof WebSocket) ws.send(JSON.stringify(res));
                })
            }
            else { 
                res = {args:res, callbackId};
                if(ws instanceof WebSocket) ws.send(JSON.stringify(res));
            }
        }

        return res;
    }

    subscribeSocket = (route:string, socket:WebSocket|string) => {
        if(typeof socket === 'string' && this.sockets[socket]) {
            socket = this.sockets[socket].socket;
        }

        if(typeof socket === 'object')
            return this.subscribe(route, (res:any) => {
                //console.log('running request', message, 'for worker', worker, 'callback', callbackId)
                if((socket as WebSocket).readyState === (socket as WebSocket).OPEN) {
                    if(res instanceof Promise) {
                        res.then((r) => {
                            (socket as WebSocket).send(JSON.stringify({args:r, callbackId:route}));
                        });
                    } else {
                        (socket as WebSocket).send(JSON.stringify({args:res, callbackId:route}));
                    }
                }
            });
    } 

    subscribeToSocket = (route:string, socketId:string, callback?:((res:any)=>void)|string) => {
        if(typeof socketId === 'string' && this.sockets[socketId]) {
            this.subscribe(socketId, (res) => {
                let msg = JSON.parse(res);
                if(msg?.callbackId === route) {
                    if(!callback) this.setState({[socketId]:msg.args}); //just set state
                    else if(typeof callback === 'string') { //run a local node
                        this.run(callback,msg.args);
                    }
                    else callback(msg.args);
                }
            });
            return this.sockets[socketId].request({route:'subscribeSocket', args:[route,socketId]});
        }
    }

    routes:Routes = {
        openWS:{
            operator:this.openWS,
            aliases:['open']
        },
        request:this.request,
        runRequest:this.runRequest,
        terminate:this.terminate,
        subscribeSocket:this.subscribeSocket,
        subscribeToSocket:this.subscribeToSocket,
        unsubscribe:this.unsubscribe
    }

}
