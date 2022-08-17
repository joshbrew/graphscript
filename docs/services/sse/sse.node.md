## SSEbackend


The SSEbackend utilizes the lean `better-sse` library to do server-sent events. These are a special type of HTTP protocol that allow server events to be broadcast one-way, to all or to specific users. This is a nice way to avoid using sockets or bulky REST probes and fetch proxies. 


```ts

import {SSEbackend} from 'graphscript-node'

type SSEProps = {
    server:http.Server|https.Server,
    path:string,
    channels?:string[],
    onconnection?:(session:any,sseinfo:any,_id:string,req:http.IncomingMessage,res:http.ServerResponse)=>void,
    onclose?:(sse:any)=>void,
    onconnectionclose?:(session:any,sseinfo:any,_id:string,req:http.IncomingMessage,res:http.ServerResponse)=>void,
    type?:'sse'|string,
    [key:string]:any
}

type SSESessionInfo = {
    sessions:{
        [key:string]:any
    }
} & SSEProps;

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

The service by default handles cleanup when connections close automatically. Sessions are specific to each connection so you can directly push messages to clients instead of broadcasting to all, shown above.x