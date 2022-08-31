## WSSbackend

This WSSbackend provides websocket server and websocket tools with one-liner configuration. Chain this with the HTTPbackend or use any generic http/https server. This uses the [`ws`](https://github.com/websockets/ws) library which includes the websocket server spec that is not default in Node.js.

Socket server clients can subscribe to node states on the socket server as well so it's easy to set up listener logic in your flow graph.

The default onmessage function handles service calls with jsonified commands. You can overwrite this or add custom listeners in parallel, everything else follows standard WebSocket API usage.

```ts
//e.g.. let served = await http.setupServer(...) from HTTPBackend

import {WSSbackend} from 'graphscript-node'


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


const wss = new WSSbackend({loadDefaultRoutes:true});

let socketserver = wss.setupWSS(
    {
        server:served.server, //e.g. returned from httpbackend.setupServer
        host:served.host,
        port:8081,
        path:'wss',
        onconnection:(ws,req,serverinfo,id)=>{
            ws.send('Hello from WSS!');
        }
    } as SocketServerProps
) as SocketServerInfo;

```


To open a websocket connection from node to another server

```ts


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

let socketinfo = wss.openWS({
    host:'localhost',
    port:8081
} as SocketProps) as SocketInfo;

//e.g..
socketinfo.subscribe('ping', console.log); //ping is available if loadDefaultRoutes is set to true when initializing a service
socketinfo.post('ping');

```