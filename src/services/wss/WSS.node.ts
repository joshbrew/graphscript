import { Service, ServiceMessage, ServiceOptions } from "../Service";
import WebSocket, { PerMessageDeflateOptions, WebSocketServer } from 'ws'; //third party lib. //createWebSocketStream <-- use this for cross-node instance communication
import http from 'http'
import https from 'https'
import { GraphNodeProperties } from "../../core/Graph";
//import { GraphNode } from "../Graph";

export type SocketServerProps = {
    server?:http.Server|https.Server|true, //set to true to indicate you want a wss when using the open() command if not providing a server...
    port?:7000|number,
    path?:'wss'|'hotreload'|'python'|string,
    noServer?:boolean,
    host?:'localhost'|'127.0.0.1'|string, //for matching upgrade urls
    perMessageDeflate?:PerMessageDeflateOptions,
    onmessage?:(data:any, ws:WebSocket, serverinfo:SocketServerInfo)=>void,
    onclose?:(wss:WebSocketServer, serverinfo:SocketServerInfo)=>void,
    onconnection?:(ws:WebSocket,request:http.IncomingMessage, serverinfo:SocketServerInfo, clientId:string)=>void,
    onconnectionclosed?:(code:number,reason:Buffer,ws:WebSocket, serverinfo:SocketServerInfo, clientId:string)=>void,
    onerror?:(err:Error, wss:WebSocketServer, serverinfo:SocketServerInfo)=>void,
    onupgrade?:(ws:WebSocket, serverinfo:SocketServerInfo, request:http.IncomingMessage, socket:any, head:Buffer)=>void, //after handleUpgrade is called
    keepState?:boolean,
    type?:'wss',
    debug?:boolean
    serverOptions?:WebSocket.ServerOptions,
    [key:string]:any
} & GraphNodeProperties

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
    debug?:boolean,
    serverOptions?:WebSocket.ServerOptions
    onmessage?:(data:string | ArrayBufferLike | Blob | ArrayBufferView | Buffer[], ws:WebSocket,wsinfo:SocketProps)=>void,  //will use this.receive as default
    onopen?:(ws:WebSocket,wsinfo:SocketProps)=>void,
    onclose?:(code:any,reason:any,ws:WebSocket,wsinfo:SocketProps)=>void,
    onerror?:(er:Error, ws:WebSocket,wsinfo:SocketProps)=>void,
    protocol?:'ws'|'wss',
    type?:'socket',
    _id?:string,
    keepState?:boolean
} & GraphNodeProperties

export type SocketInfo = {
    socket:WebSocket,
    address?:string,
    send:(message:any)=>void,
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any, method?:string)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string, args?:any[], key?:string, subInput?:boolean)=>any,
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
        this.load(this);
    }

    open = (options:SocketServerProps | SocketProps) => {
        if((options as SocketServerProps)?.server) {
            return this.setupWSS(options as SocketServerProps);
        } else return this.openWS(options as SocketProps);
    }

    setupWSS = (
        options:SocketServerProps,
    ) => {

        let port = options.port;
        let path = options.path;
        const server = typeof options.server === 'object' ? options.server : undefined;
        let host = options.host;
        delete (options as any).server
        if(!('keepState' in options)) options.keepState = true;

        let opts = {} as any;
        if(options.noServer) opts.noServer = true;
        else if(port) {
            if(port) opts.port = port;
        }
        else if(server) opts.server = server;
        if(options.perMessageDeflate) opts.perMessageDeflate = options.perMessageDeflate;

        if(typeof options.serverOptions) Object.assign(opts,options.serverOptions);

        const wss = new WebSocketServer(opts);

        let address = '';
        if(!host && server) {
            let addr = server.address() as any;
            if(!port) port = addr.port;
            address = addr.address;

        } else if(host) address = host;
        if(port) address += ':'+port;
        if(path) {
            if(!path.startsWith('/')) path = '/'+path;
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

            if(options.debug) {
                console.log(data);
            }
            //console.log(data);
            const result = this.receive(data, wss, this.servers[address]); 
            //console.log(result)
            if(options.keepState) this.setState({[address]:result}); 

        }

        wss.addListener('connection',(ws,request) => {
            if(this.debug) console.log(`New socket connection on ${address}`);

            let clientId = `socket${Math.floor(Math.random()*1000000000000)}`;
            this.servers[address].clients[clientId] = ws;

            ws.send(JSON.stringify({ route:'setId', args:clientId }));

            this.openWS({
                socket:ws,
                address:clientId,
                _id:clientId,
                debug:options.debug,
                onclose:(code,reason) => {
                    if(this.servers[address].onconnectionclosed) 
                        (this.servers[address] as any).onconnectionclosed(code, reason, ws, this.servers[address], clientId);

                    delete this.servers[address].clients[clientId]; //delete by default onclose (memory saving)
                }
            }); //add send/receive etc functionality


            if(options.debug) {
                let time = getHoursAndMinutes(new Date());
                console.log(time, ' | ', clientId, ' | Number of live sockets: ', Object.keys(this.servers[address].clients).length);
            }

            if((this.servers[address] as any).onconnection) 
                (this.servers[address] as any).onconnection(ws,request,this.servers[address], clientId);//can overwrite the default onmesssage response 
          
        });

        wss.on('error',(err) => {
            if(this.debug) console.log("Socket Error:",err);
            if(this.servers[address].onerror) (this.servers[address] as any).onerror(err, wss, this.servers[address]);   
            else console.error(err);
        })

        let onUpgrade = (request:http.IncomingMessage, socket:any, head:Buffer) => { //https://github.com/websockets/ws
            
            if(request.headers && request.url) {
                if(this.debug) console.log("Upgrade request at: ", request.url);
                let pass = false;
                
                if(path && request.url === path) pass = true;
                else {
                    let addr = (request as any).headers.host.split(':')[0];
                    if(port) addr += ':'+port;
                    if(addr === address) pass = true;
                    else {
                        addr += request.url.split('?')[0];
                        if(addr === address) pass = true;
                    }
                }
                
                if(pass && this.servers[address]) {
                    this.servers[address].wss.handleUpgrade(request,socket,head, (ws) => {
                        if((this.servers[address] as any).onupgrade) 
                            (this.servers[address] as any).onupgrade(ws, this.servers[address], request, socket, head);
                        this.servers[address].wss.emit('connection', ws, request);
                    });
                }
            }
        }

        if(server) 
            server.addListener('upgrade', onUpgrade);

        wss.addListener('close',()=> {
            if(server) server.removeListener('upgrade',onUpgrade);
            if((this.servers[address] as any).onclose) (this.servers[address] as any).onclose(wss, this.servers[address]);
            else console.log(`wss closed: ${address}`);

            delete this.servers[address];
        });

        let send = (message:any, socketId?:string) => {
            if(typeof message === 'object') message = JSON.stringify(message);
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

        let subscribe = (route:any, callback?:((res:any)=>void)|string,socketId?:string, args?:any[], key?:string, subInput?:boolean) => {
            if(!socketId) {
                let promises:any=[]
                for(const k in this.servers[address].clients) {
                    promises.push(this.sockets[k].subscribe(route,callback,args,key,subInput));
                }
                return promises;
            } else this.sockets[socketId].subscribe(route,callback,args,key,subInput);
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

        if(options.onmessage) {
            socket.on(
                'message',
                (data)=>{(
                    this.sockets[address] as any).onmessage(
                        data,
                        socket,
                        this.sockets[address]
                    );
                }
            ); 
        } 
           
        else if (options._id) {
            socket.addListener('message', (data:any)=> {
                if(ArrayBuffer.isView(data)) data = data.toString();
                
                if(options.debug) {
                    console.log("Message from ",options._id, ": ", data);
                }

                this.receive(data,socket, this.sockets[address]); 
                //console.log('socket received',data,Array.from(this.__node.nodes.keys()));
                if(options.keepState) {
                    this.setState({[address]:data});
                }
            }); //clear this extra logic after id is set
        }
        else {
            let socketonmessage = (data:any)=>{ 
                if(ArrayBuffer.isView(data)) data = data.toString();
                if(data) {
                    if(options.debug) {
                        console.log("Message from ",address, ": ", data);
                    }
                    if(typeof data === 'string') { //pulling this out of receive to check if setId was called
                        let substr = data.substring(0,8);
                        if(substr.includes('{') || substr.includes('[')) {    
                            if(substr.includes('\\')) data = data.replace(/\\/g,"");
                            if(data[0] === '"') { data = data.substring(1,data.length-1)};
                            //console.log(message)
                            data = JSON.parse(data); //parse stringified objects

                            if(data.route === 'setId') {
                                this.sockets[address]._id = data.args;
                                socket.removeEventListener(
                                    'message',
                                    socketonmessage
                                );

                                socket.on('message', (data:any)=> {                
                                    if(ArrayBuffer.isView(data)) data = data.toString();
                                    if(options.debug) {
                                        console.log("Message from ",this.sockets[address]._id, ": ", data);
                                    }
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
            socket.addListener('message',socketonmessage); //add default callback if none specified
            options.onmessage = socketonmessage;
        }

        socket.addListener('open',()=>{
            if(this.sockets[address].onopen) (this.sockets[address] as any).onopen(socket,this.sockets[address]);
        });
        
        socket.addListener('close',(code,reason)=>{
            if(this.sockets[address].onclose) 
                (this.sockets[address] as any).onclose(code,reason,socket,this.sockets[address]);
            
            delete this.sockets[address]; //delete by default onclose (memory saving)
        });

            
        socket.on('error',(er)=>{
            if(this.sockets[address].onerror) (this.sockets[address] as any).onerror(er,socket,this.sockets[address]);
        });

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
                let req = {route:'runRequest', args:[{route, args}, this.sockets[address]._id, callbackId]} as any;
                if(method) req.args[0].method = method;
                let onmessage = (ev)=>{
                    let data = ev.data;
                    if(typeof data === 'string' && data.indexOf('{') > -1) 
                        data = JSON.parse(data);
                    if(typeof data === 'object') {
                        if(data.callbackId === callbackId) {
                            socket.removeEventListener('message',onmessage);
                            res(data.args); //resolve the request with the corresponding message
                        }
                    }
                }
                socket.addEventListener('message',onmessage)
                this.transmit(req, socket);
            });
        }
        
        let request = (message:ServiceMessage|any, method?:string):Promise<any> => {
            return this.request(message,socket, this.sockets[address]._id as string, method);
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string) => {
            return this.subscribeToSocket(route, this.sockets[address]._id as string, callback);
        }

        let unsubscribe = (route:any, sub:number):Promise<any> => {
            return run('unsubscribe',[route,sub]);
        }

        let terminate = () => {
            this.terminate(this.sockets[address]._id as string);
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
            __node:{tag:address},
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
            ws.clients.forEach((c:WebSocket) => {c.send(message as string)})
        }
        else if(ws instanceof WebSocket) ws.send(message as string);
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

        let str;
        if(!ws) {
            let served = Object.keys(this.servers);
            for(const key in served) {
                this.terminate(key);
            }
            let sockets = Object.keys(this.sockets);
            for(const key in sockets) {
                this.terminate(key)
            }
        }
        else if(typeof ws === 'string') {
            str = ws;
            for(const k in this.servers) {
                if(k.includes(ws) || this.servers[k]._id === ws) {
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
                    if(k.includes(ws as string) || this.sockets[k]._id === ws) {
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
        else if(ws instanceof WebSocket) {
            if(ws.readyState === ws.OPEN) 
                ws.close();

            if(this.get(str ? str : ws.url)) this.remove(str ? str : ws.url);
        }
    
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

    subscribeSocket = (route:string, socket:WebSocket|string, args?:any[], key?:string, subInput?:boolean) => {
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
            },args,key,subInput);
    } 

    subscribeToSocket = (route:string, socketId:string, callback?:string|((res:any)=>void), args?:any[], key?:string, subInput?:boolean) => {
        if(typeof socketId === 'string' && this.sockets[socketId]) {
            this.__node.state.subscribeEvent(socketId, (res) => {
                if(res?.callbackId === route) {
                    if(!callback) this.setState({[socketId]:res.args});
                    else if(typeof callback === 'string') { //just set state 
                        this.setState({[callback]:res.args});
                    }
                    else callback(res.args);
                }
            })
            return this.sockets[socketId].request({route:'subscribeSocket', args:[route,socketId,args,key,subInput]});
        }
    }

}








function getHoursAndMinutes(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Convert the hours and minutes to two digits
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes}`;
}