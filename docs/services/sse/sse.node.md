## SSEbackend


The SSEbackend utilizes the lean `better-sse` library to do server-sent events. These are a special type of HTTP protocol that allow server events to be broadcast one-way, to all or to specific users. This is a nice way to avoid using sockets or bulky REST probes and fetch proxies. 

We built generic controls for each server and each client session instance for sending/receiving/subscribing/etc. which attempts to use the HTTP requests to handle two way communications.

```ts

import {SSEbackend} from 'graphscript-node'


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


const sse = new SSEbackend();

const sseinfo = sse.setupSSE(
        {
            server:served.server, //e.g. returned from httpbackend.setupServer
            path:'sse',
            channels:['test'], //custom channels, the default are 'message', 'close', 'error', and 'open' 
            onconnection:(session,sseinfo,id,req,res)=>{
                console.log('pushing sse!')
                session.push('Hello from SSE!');
                sseinfo.channels.forEach(
                    (c:string) => sseinfo.channel.broadcast(
                        'SSE connection at '+req.headers.host+'/'+req.url, c 
                    )
                );
            },
        } as SSEProps
    ) as SSESessionInfo

```

The service by default handles cleanup when connections close automatically. Sessions are specific to each connection so you can directly push messages to clients instead of broadcasting to all, shown above. There are common communication callbacks for all of our services that support such connectivity for predictable behaviors.

 Best practice is SSEs for outgoing messages from server, and sockets for incoming messages. For peer 2 peer, use sockets for the handshake and then peers can have direct controls via our message passing system. Use all of the protocols in combination for high performance, easily composable servers.