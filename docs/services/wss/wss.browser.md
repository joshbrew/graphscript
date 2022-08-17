## WSSfrontend


To open a websocket connection from node to another server

```ts

import {WSSfrontend} from 'graphscript'


type SocketProps = {
    host:string,
    port:number,
    path?:string,
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

type SocketInfo = {
    socket:WebSocket,
    address?:string,
    send:(message:any)=>void,
    request:(message:any, origin?:string, method?:string)=>Promise<any>,
    post:(route:any, args?:any)=>void,
    run:(route:any, args?:any, origin?:string, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>
} & SocketProps;


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