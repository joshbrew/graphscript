## WSSfrontend


To open a websocket connection from node to another server

```ts

import {WSSfrontend} from 'graphscript'


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


const wss = new WSSfrontend();

let socketinfo = wss.openWS({
    host:'localhost',
    port:8080, //server port, not the wss port 
    path:'wss' //if using the actual wss port, don't pass a path
} as SocketProps) as SocketInfo;

//e.g..
socketinfo.subscribe('ping', console.log); //ping is available if loadDefaultRoutes is set to true when initializing a service
socketinfo.post('ping');

```


The default onmessage function handles service calls with jsonified commands. You can overwrite this or add custom listeners in parallel, everything else follows standard WebSocket API usage.