import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
import WebSocket, { WebSocketServer } from 'ws'; //third party lib. //createWebSocketStream <-- use this for cross-node instance communication
import http from 'http'
import https from 'https'
//import { GraphNode } from "../Graph";

export type SocketServerProps = {
    server:http.Server|https.Server,
    host:'localhost'|'127.0.0.1'|string,
    port:7000|number,
    path:'wss'|'hotreload'|'python'|string,
    onmessage?:(data:any, ws:WebSocket, serverinfo:SocketServerInfo)=>void,
    onclose?:(wss:WebSocketServer, serverinfo:SocketServerInfo)=>void,
    onconnection?:(ws:WebSocket,request:http.IncomingMessage, serverinfo:SocketServerInfo, clientId:string)=>void,
    onconnectionclosed?:(code:number,reason:Buffer,ws:WebSocket, serverinfo:SocketServerInfo, clientId:string)=>void,
    onerror?:(err:Error, wss:WebSocketServer, serverinfo:SocketServerInfo)=>void,
    onupgrade?:(ws:WebSocket, serverinfo:SocketServerInfo, request:http.IncomingMessage, socket:any, head:Buffer)=>void, //after handleUpgrade is called
    keepState?:boolean,
    type?:'wss',
    [key:string]:any
}

export type SocketServerInfo = {
    wss:WebSocketServer,
    clients:{[key:string]:WebSocket}, //corresponding socket controls are found in this.sockets for each clientId
    address:string,
    send:(message:any,socketId?:string)=>void,
    request:(message:any, method?:string, socketId?:string)=>Promise<any>|Promise<any>[],
    post:(route:any, args?:any, method?:string, socketId?:string)=>void,
    run:(route:any, args?:any, method?:string, socketId?:string)=>Promise<any>|Promise<any>[],
    subscribe:(route:any, callback?:((res:any)=>void)|string, socketId?:string)=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe:(route:any, sub:number,socketId?:string)=>Promise<boolean>|Promise<boolean>[],
    terminate:(socketId?:string)=>boolean,
    graph:WSSbackend
} & SocketServerProps;

export type SocketProps = {
    host?:string,
    port?:number,
    path?:string,
    socket?:WebSocket,
    address?:string,
    serverOptions?:WebSocket.ServerOptions
    onmessage?:(data:string | ArrayBufferLike | Blob | ArrayBufferView | Buffer[], ws:WebSocket,wsinfo:SocketProps)=>void,  //will use this.receive as default
    onopen?:(ws:WebSocket,wsinfo:SocketProps)=>void,
    onclose?:(code:any,reason:any,ws:WebSocket,wsinfo:SocketProps)=>void,
    onerror?:(er:Error, ws:WebSocket,wsinfo:SocketProps)=>void,
    protocol?:'ws'|'wss',
    type?:'socket',
    _id?:string,
    keepState?:boolean
}

export type SocketInfo = {
    socket:WebSocket,
    address?:string,
    send:(message:any)=>void,
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any, method?:string)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:()=>void,
    graph:WSSbackend
} & SocketProps;

//server side (node) websockets
export class WSSbackend extends Service {

    name='wss'

    debug:boolean=false;
    
    //servers
    servers:{
        [key:string]:SocketServerInfo
    }={};

    //clients
    sockets:{
        [key:string]:SocketInfo
    }={};

    connections = { //higher level reference for Router
        servers:this.servers, sockets:this.sockets
    };

    constructor(options?:ServiceOptions) {
        super(options)
        this.load(this.routes);
    }

    setupWSS = (
        options:SocketServerProps,
    ) => {

        const host = options.host;
        const port = options.port;
        let path = options.path;
        const server = options.server;
        delete (options as any).server
        if(!('keepState' in options)) options.keepState = true;

        let opts = {
            host,
            port
        };

        if(typeof options.serverOptions) Object.assign(opts,options.serverOptions)

        const wss = new WebSocketServer(opts);

        let address = `${host}:${port}/`;
        if(path) {
            if(path.startsWith('/')) path = path.substring(1);
            address += path;
        }

        this.servers[address] = {
            type:'wss',
            wss,
            clients:{},
            address,
            ...options
        } as SocketServerInfo;

        if(!options.onmessage) options.onmessage = (data) => {  //default onmessage
            if(data instanceof Buffer) data = data.toString();
            //console.log(data);
            const result = this.receive(data, wss, this.servers[address]); 
            //console.log(result)
            if(options.keepState) this.setState({[address]:result}); 

        }

        wss.on('connection',(ws,request) => {
            if(this.debug) console.log(`New socket connection on ${address}`);

            let clientId = `socket${Math.floor(Math.random()*1000000000000)}`;
            this.servers[address].clients[clientId] = ws;

            ws.send(JSON.stringify({ route:'setId', args:clientId }));

            let info = this.openWS({
                socket:ws,
                address:clientId,
                _id:clientId
            }); //add send/receive etc functionality


            if((this.servers[address] as any).onconnection) 
                (this.servers[address] as any).onconnection(ws,request,this.servers[address], clientId);//can overwrite the default onmesssage response 
            
            if((this.servers[address] as any).onconnectionclosed) 
                ws.on('close',(code,reason)=>{
                    if(this.servers[address].onconnectionclosed) (this.servers[address] as any).onconnectionclosed(code,reason,ws, this.servers[address], clientId);
                });
        });

        wss.on('error',(err) => {
            if(this.debug) console.log("Socket Error:",err);
            if(this.servers[address].onerror) (this.servers[address] as any).onerror(err, wss, this.servers[address]);   
            else console.error(err);
        })

        let onUpgrade = (request:http.IncomingMessage,socket:any,head:Buffer) => { //https://github.com/websockets/ws
            
            if(request.headers && request.url) {
                if(this.debug) console.log("Upgrade request at: ", request.url);
                let addr = (request as any).headers.host.split(':')[0];
                addr += ':'+port;
                addr += request.url.split('?')[0];

                if(addr === address && this.servers[addr]) {
                    this.servers[addr].wss.handleUpgrade(request,socket,head, (ws) => {
                        if((this.servers[address] as any).onupgrade) (this.servers[address] as any).onupgrade(ws, this.servers[address], request, socket, head);
                        this.servers[addr].wss.emit('connection',ws,request);
                    });
                }
            }
        }

        server.addListener('upgrade',onUpgrade);

        wss.on('close',()=> {
            server.removeListener('upgrade',onUpgrade);
            if((this.servers[address] as any).onclose) (this.servers[address] as any).onclose(wss, this.servers[address]);
            else console.log(`wss closed: ${address}`);
        });

        let send = (message:any, socketId?:string) => {
            if(!socketId) {
                for(const key in this.servers[address].clients) {
                    this.sockets[key].send(message);
                }
            } else return this.sockets[socketId].send(message);
        }

        let request = (message:ServiceMessage|any, method?:string, socketId?:string) => {
            if(!socketId) {
                let promises:any=[]
                for(const key in this.servers[address].clients) {
                    promises.push(this.sockets[key].request(message,method));
                }
                return promises;
            } else return this.sockets[socketId].request(message,method);
        };

        let post = (route:any,args?:any, method?:string,socketId?:string) => {
            if(!socketId) {
                for(const key in this.servers[address].clients) {
                    this.sockets[key].post(route,args,method);
                }
            } else return this.sockets[socketId].post(route,args,method);
        };

        let run = (route:any,args?:any, method?:string,socketId?:string) => {
            if(!socketId) {
                let promises:any=[]
                for(const key in this.servers[address].clients) {
                    promises.push(this.sockets[key].run(route,args, method));
                }
                return promises;
            } else return this.sockets[socketId].run(route,args, method);
        };

        let subscribe = (route:any, callback?:((res:any)=>void)|string,socketId?:string) => {
            if(!socketId) {
                let promises:any=[]
                for(const key in this.servers[address].clients) {
                    promises.push(this.sockets[key].subscribe(route,callback));
                }
                return promises;
            } else this.sockets[socketId].subscribe(route,callback);
        };

        let unsubscribe = (route:any, sub:number,socketId?:string) => {
            if(!socketId) {
                let promises:any=[]
                for(const key in this.servers[address].clients) {
                    promises.push(this.sockets[key].unsubscribe(route,sub));
                }
                return promises;
            } else this.sockets[socketId].unsubscribe(route,sub);
        };

        let terminate = (socketId?:string) => {
            if(socketId) return this.terminate(socketId);
            else return this.terminate(address)
        };

        this.servers[address].send = send;
        this.servers[address].request = request;
        this.servers[address].post = post;
        this.servers[address].run = run;
        this.servers[address].subscribe = subscribe;
        this.servers[address].unsubscribe = unsubscribe;
        this.servers[address].terminate = terminate;
        this.servers[address].graph = this;
        this.servers[address]._id = options._id ? options._id : address;

        return this.servers[address];
    }

    openWS = (
        options:SocketProps,
    ) => {
        if(!options.address) {

            let protocol = options.protocol;
            if(!protocol) protocol = 'wss';
            options.address = `${protocol}://${options.host}`;
            if(options.port) options.address+= ':'+options.port;
            if(!options.path || options.path?.startsWith('/')) options.address += '/';
            if(options.path) options.address += options.path;
        }
        const address = options.address as string;

        let socket;
        if(options.socket) socket = options.socket;
        else socket = new WebSocket(address);

        if(!('keepState' in options)) options.keepState = true;

        if(options.onmessage) socket.on('message',(data)=>{(this.sockets[address] as any).onmessage(data,socket,this.sockets[address]);}); 
        else if (options._id) {
            socket.on('message', (data:any)=> {
                if(ArrayBuffer.isView(data)) data = data.toString();
                this.receive(data,socket,this.sockets[address]); 
                if(options.keepState) {
                    this.setState({[address]:data});
                }
            }); //clear this extra logic after id is set
        }
        else {
            let socketonmessage = (data:any)=>{ 
                if(ArrayBuffer.isView(data)) data = data.toString();
                if(data) {
                    if(typeof data === 'string') { //pulling this out of receive to check if setId was called
                        let substr = data.substring(0,8);
                        if(substr.includes('{') || substr.includes('[')) {    
                            if(substr.includes('\\')) data = data.replace(/\\/g,"");
                            if(data[0] === '"') { data = data.substring(1,data.length-1)};
                            //console.log(message)
                            data = JSON.parse(data); //parse stringified objects

                            if(data.route === 'setId') {
                                this.sockets[address]._id = data.args;
                                socket.removeEventListener('message',socketonmessage);
                                socket.on('message', (data:any)=> {                
                                    if(ArrayBuffer.isView(data)) data = data.toString();
                                    this.receive(data,socket,this.sockets[address]); 
                                    if(options.keepState) {
                                        this.setState({[address]:data});
                                    }
                                }); //clear this extra logic after id is set
                            }
                        }
                    } 
                }

                this.receive(data,socket,this.sockets[address]); 
                if(options.keepState) this.setState({[address]:data}); 
            }
            socket.on('message',socketonmessage); //add default callback if none specified
            options.onmessage = socketonmessage;
        }
        socket.on('open',()=>{if(this.sockets[address].onopen) (this.sockets[address] as any).onopen(socket,this.sockets[address]);});
        socket.on('close',(code,reason)=>{
            if(this.sockets[address].onclose) (this.sockets[address] as any).onclose(code,reason,socket,this.sockets[address]);});
        socket.on('error',(er)=>{if(this.sockets[address].onerror) (this.sockets[address] as any).onerror(er,socket,this.sockets[address]);});

        let send = (message:any) => {
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

        let run = (route:any,args?:any, method?:string):Promise<any> => {
            return new Promise ((res,rej) => {
                let callbackId = Math.random();
                let req = {route:'runRequest', args:[{route, args}, address, callbackId]} as any;
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
        
        let request = (message:ServiceMessage|any, method?:string):Promise<any> => {
            return this.request(message,socket, address, method);
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string) => {
            return this.subscribeToSocket(route, address, callback);
        }

        let unsubscribe = (route:any, sub:number):Promise<any> => {
            return run('unsubscribe',[route,sub]);
        }

        let terminate = () => {
            this.terminate(address);
        }

        this.sockets[address] = {
            type:'socket',
            socket,
            send,
            post,
            request,
            run,
            subscribe,
            unsubscribe,
            terminate,
            graph:this,
            ...options
        }

        return this.sockets[address];
    }

    transmit = (
        message:string | ArrayBufferLike | Blob | ArrayBufferView | Buffer[] | ServiceMessage, 
        ws:WebSocketServer|WebSocket,
    ) => {
        if(typeof message === 'object') message = JSON.stringify(message);

        if(!ws) {
            
            let served = this.servers[Object.keys(this.servers)[0]];
            if(served) ws = served.wss; //select first websocket server to transmit to all clients
            else {//else select first active socket to transmit to one endpoint
                let s = this.sockets[Object.keys(this.sockets)[0]];
                if(s) ws = s.socket; 
            };
        }
        if(ws instanceof WebSocketServer) { //broadcast to all clients
            ws.clients.forEach((c:WebSocket) => {c.send(message)})
        }
        else if(ws instanceof WebSocket) ws.send(message);
    }

    closeWS = (ws:WebSocket|string) => {
        if(!ws) {   
            let s = this.sockets[Object.keys(this.sockets)[0]];
            if(s) ws = s.socket; 
        }
        else if(typeof ws === 'string') {
            for(const k in this.sockets) {
                if(k.includes(ws)) {
                    ws = this.sockets[k].socket;
                    delete this.sockets[k];
                    break;
                }
            }
        }
        
        if(ws instanceof WebSocket) 
            if(ws.readyState === ws.OPEN) 
                ws.close();

        return true;
    }

    terminate = (ws:WebSocketServer|WebSocket|string) => {
        if(!ws) {
            let served = this.servers[Object.keys(this.servers)[0]];
            if(served) ws = served.wss; //select first websocket server to transmit to all clients
        }
        else if(typeof ws === 'string') {
            for(const k in this.servers) {
                if(k.includes(ws)) {
                    ws = this.servers[k].wss;
                    for(const key in this.servers[k].clients) {
                        this.closeWS(this.servers[k].clients[key]);
                    }
                    delete this.servers[k];
                    break;
                }
            }
            if(!ws) {
                for(const k in this.sockets) {
                    if(k.includes(ws as string)) {
                        ws = this.sockets[k].socket;
                        delete this.sockets[k];
                        break;
                    }
                }
            }
        }

        if(ws instanceof WebSocketServer) {
            ws.close((er) => {if(er) console.error(er);});
        }
        else if(ws instanceof WebSocket)
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
        if(ws) {
            if(typeof ws === 'string') {
                for(const key in this.servers) {
                    for(const c in this.servers[key].clients) {
                        if(c === ws) {ws = this.servers[key].clients[c]; break;}
                    }
                }
                if(!(ws instanceof WebSocket)) { 
                    for(const s in this.sockets) {
                        if(s === ws) {ws = this.sockets[s].socket; break;}
                    }
                }
            }

            if(res instanceof Promise) {
                res.then((v) => {
                    res = {args:v, callbackId}; //route straight to the message listener we created with the request function
                    if(ws instanceof WebSocket) ws.send(JSON.stringify(res));
    
                })
            }
            else { 
                res = {args:res, callbackId}; //route straight to the message listener we created with the request function
                if(ws instanceof WebSocket) ws.send(JSON.stringify(res));
            }//console.log(this.nodes.keys());
    
        }

        return res;
    }

    subscribeSocket = (route:string, socket:WebSocket|string) => {
        if(typeof socket === 'string') {
            if(this.sockets[socket]) socket = this.sockets[socket].socket;
            else {
                for(const prop in this.servers) {
                    if(this.servers[prop].clients[socket as string])
                        socket = this.servers[prop].clients[socket as string];
                }
            }
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

    subscribeToSocket = (route:string, socketId:string, callback?:string|((res:any)=>void)) => {
        if(typeof socketId === 'string' && this.sockets[socketId]) {
            this.subscribe(socketId, (res) => {
                if(res?.callbackId === route) {
                    if(!callback) this.setState({[socketId]:res.args});
                    else if(typeof callback === 'string') { //just set state 
                        this.setState({[callback]:res.args});
                    }
                    else callback(res.args);
                }
            })
            return this.sockets[socketId].request({route:'subscribeSocket', args:[route,socketId]});
        }
    }

    routes:Routes={
        open:(options:SocketServerProps|SocketProps) => {
            if((options as SocketServerProps).server) return this.setupWSS(options as SocketServerProps);
            else return this.openWS(options as SocketProps);
        },
        setupWSS:this.setupWSS,
        openWS:this.openWS,
        closeWS:this.closeWS,
        request:this.request,
        runRequest:this.runRequest,
        terminate:this.terminate,
        subscribeSocket:this.subscribeSocket,
        subscribeToSocket:this.subscribeToSocket,
        unsubscribe:this.unsubscribe
    }

}