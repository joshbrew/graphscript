# Routers


Routers extend Services with a uniform networking layer to pool templated service connections based on services and arbitrary source ids. This includes convenience features for adding and removing users from the system in a self-cleaning fashion (when using the defaults) so you can quickly make multi-tiered server and peer-2-peer communication schemes.

See `examples/webrtcrouter` for a robust example that implements a backend with server-sent events, websockets, hot reloading, and a frontend for sharing webrtc peer connections mediated by the socket server - all in less than 500 lines of code! The Frontend-Backend and the Peer-Peer connections are handled with the exact same callbacks, only specifying different endpoint ids! This allows for remote controls and multi-user contexts with the smoothest code you've ever seen! 

#### Router Options

Routers have additional important options on top of the base service. They otherwise function exactly like a service, where any service can load any other service, but give an additional layer of control to how services are named, configured, and referenced in your program, as well as the macros for user and general remote networking graphs.

```ts

export type RouterOptions = ServiceOptions & {
    services?:{
        [key:string]:Service|any|{
            service:Service|any,
            connections:string[]|{[key:string]:any},
            config?:{ //configure connections per service
                [key:string]:{ //configure multiple connection instances using the generic 'open' function
                    _id?:string,
                    source?:string,
                    onclose?:(c:ConnectionInfo,...args:any[])=>void,
                    args?:any[], //other arguments a service spec expects other than the main config object (try to make it just one object for easier config automation!)
                    [key:string]:any //configuration settings
                }
            }, //configure new connections after adding the relevant services?
        } //can be a service constructor
    }
    syncServices?:boolean,
    order?:string[]
}

```

#### Connection Template Schema

Any service can have a 'connections' object for storing connections or multiple groups of connections (e.g. socket servers in one group and all of the client sockets in another group) that the Router can look for automatically to pool connections that are then available by id for tying to different sources. It makes it a series of one-liners to configure a full endpoint systems and subscriptions through connections to events on programs across clients and servers. 


```ts

type ConnectionTemplate = {
    _id?:string,
    send?:(message:any, ...args:any[])=>any,
    request?:(message:any, method?:any,...args:any[])=>Promise<any>|Promise<any>[],
    post?:(route:any, args?:any, method?:string, ...args:any[])=>void,
    run?:(route:any, args?:any, method?:string, ...args:any[])=>Promise<any>|Promise<any>[],
    subscribe?:(route:any, callback?:((res:any)=>void)|string, ...args:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe?:(route:any, sub:number, ...args:any[])=>Promise<boolean>|Promise<boolean>[],
    terminate:(...args:any[]) => boolean,
}

```

The current templates exist based on the frontend and backend (respective) remote endpoint services we've constructed so far:

```ts
type WebRTCInfo; //rtc
type WebSocketInfo; //browser ws
type SocketInfo; //node ws, incl wss clients
type SocketServerInfo; //node wss
type SSEChannelInfo; //node sse
type SSESessionInfo; //node sse client-specific
type EventSourceInfo; //browser sse
type ServerInfo;    //node http/https server
```

Or use any Graphs or GraphNodes to wrap with the template functions, these can then handle local transmission or be a quick proxy to other connections you want to add yourself without implementing a Service.

Now add a connection with `addConnection` or use the router constructor options to do it all in one shot with each service specified
```ts
router.addConnection(options:ConnectionProps|ConnectionInfo|string,source?:string)

//via


export type ConnectionProps = {
    connection:GraphNode|Graph|{[key:string]:any}|string, //can be a node, graph, connection Info object or _id string 
    service?:string|Graph|Service, //
    source?:string, //group of connections the connection belongs to, e.g. a user id or a service 
    onclose?:(connection:ConnectionInfo,...args:any[])=>void
}
//valid connections: SocketInfo, SocketServerInfo, SSEChannelInfo, SSESessionInfo, EventSourceInfo, ServerInfo, WebRTCInfo

export type ConnectionInfo = {
    connection:GraphNode|Graph|{[key:string]:any}, //can be a node, graph, connection Info object or _id string 
    service?:string|Service|Graph,
    _id:string,
    source:string, // base connections can have multiple sources if you add the same connection again via addConnection with a new source specified!! These objects will be duplicated on each source container
    connectionType?:string, //if we know the key on the service we sourced an endpoint connection from, this helps with keeping track of things 
    connectionsKey?:string, //if we know the object on the service that the connection info is stored on
    send?:(message:any, ...a:any[])=>any,
    request?:(message:any, method?:any,...a:any[])=>Promise<any>|Promise<any>[],
    post?:(route:any, args?:any, method?:string, ...a:any[])=>void,
    run?:(route:any, args?:any, method?:string, ...a:any[])=>Promise<any>|Promise<any>[],
    subscribe?:(route:any, callback?:((res:any)=>void)|string, ...a:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe?:(route:any, sub:number, ...arrayBuffer:any[])=>Promise<boolean>|Promise<boolean>[],
    terminate:(...a:any[]) => boolean,
    onclose?:(connection:ConnectionInfo,...args:any[])=>void
}


```

Or something like:
```ts
router.addUser({_id:'me'},{socketId:'socket12345678'})

//which returns via promise:
export type User = { //users have macros to call grouped connections generically, based on what's available
    _id:string,
    send:(...args:any[])=>any,
    request:(...args:any[])=>Promise<any>|Promise<any>[]|undefined,
    post:(...args:any[])=>void,
    run:(...args:any[])=>Promise<any>|Promise<any>[]|undefined,
    subscribe:(...args:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe:(...args:any[])=>Promise<boolean>|Promise<boolean>[]|undefined,
    terminate:(...args:any[]) => boolean,
    onclose?:(user:User)=>void,
    [key:string]:any
} & Partial<ProfileStruct>

```

The user's send/post/etc. handles will search available connections sourced to that user and use the best connection that has the available functionality based on matching methods. The services we have all follow the same straightforward, fully functional (including all of the source API features for each type of protocol still on-hand), and reproducible format for pooling and matching connections for easier high level integration and a fairly limited learning curve for the amount of features you can pack together in a few dozen lines. It's very performant, while you still have full control over your servers and services as you need deeper specifications.


All together now with sessions and mixed SSE + Websocket connections and a configurable http/https server... See backend.ts in `examples/webrtcrouter`

```ts


import { Router, User } from "../../services/router/Router";
import { SocketServerProps, WSSbackend } from "../../services/wss/WSS.node";
import { SSEbackend, SSEProps } from "../../services/sse/SSE.node";
import { HTTPbackend, ServerProps } from "../../services/http/HTTP.node";
import { SessionsService } from "../../services/streaming/sessions.service";
import { scriptBoilerPlate } from "../../services/http/boilerplate";

const router = new Router({
    services:{
        'sessions':SessionsService,
        'wss':WSSbackend,
        'sse':SSEbackend,
        'http':{
            service: HTTPbackend, //the router can instantiate the class for us
            config:{
                'server1':{
                    protocol:'http',
                    host:'localhost',
                    port:8080,
                    pages:{
                        '/':scriptBoilerPlate('dist/frontend.js'), //serve the built dist
                        'config':{
                            template:'tinybuild.config.js'
                        },
                        'home':{
                            redirect:'/'
                        },
                        'redir':{
                            redirect:'https://google.com'
                        },
                        'test':'<div>TEST</div>',
                        _all:{
                            inject:{ //page building
                                hotreload:'ws://localhost:8080/hotreload' //this is a route that exists as dynamic content with input arguments, in this case it's a url, could pass objects etc in as arguments
                            }
                        }
                    },
                    onopen:(served)=>{

                        router.openConnection(
                            'wss',
                            {
                                server:served.server,
                                host:served.host,
                                port:8081,
                                path:'wss',
                                onconnection:(ws,req,serverinfo,id)=>{
                                    ws.send('Hello from WSS!');
                                }
                            } as SocketServerProps
                        )

                        router.openConnection(
                            'wss',
                            {
                                server:served.server,
                                host:served.host,
                                port:7000,
                                path:'hotreload',
                                onconnection:(ws)=>{
                                    ws.send('Hot reload port opened!');
                                }
                            } as SocketServerProps
                        )

                        router.openConnection(
                            'sse',
                            {
                                server:served.server,
                                path:'sse',
                                channels:['test'],
                                onconnection:(session,sseinfo,id,req,res)=>{
                                    console.log('pushing sse!')
                                    session.push('Hello from SSE!');
                                    sseinfo.channels.forEach(
                                        (c:string) => sseinfo.channel.broadcast(
                                            'SSE connection at '+req.headers.host+'/'+req.url, c 
                                        )
                                    );
                                }
                            } as SSEProps
                        )
                    }
                    // startpage:'index.html',
                    // errpage:undefined,
                    // certpath:'cert.pem', 
                    // keypath:'key.pem',
                    // passphrase:'encryption',
                } as ServerProps
            }
        }
    },
    loadDefaultRoutes:true,
    order:['sse','wss'],//prefer certain connection sources in a certain order, defaults to load order (if appropriate callbacks are available for subscription)
    syncServices:true
}); //on frontend we want to prefer wss first as sse is POST-reliant from browser

//router.services.sessions.users = router.users;

router.addUser({
    _id:'admin'
});

let session = (router.services.sessions as SessionsService).openSharedSession(
    {
        _id:'webrtcrooms',
        settings:{
            name:'webrtcrooms',
            propnames:{
                rooms:true //if these props are updated on the user object we'll return them
            }  
        }
    },
    'admin'
);

router.run('sessions.sessionLoop');

router.subscribe('addUser', (user:User) => {
    console.log('new user!', user._id)
    if(typeof user === 'object') {
        let joined = (router.services.sessions as SessionsService).joinSession('webrtcrooms', user._id);
        if(joined) {
            user.send({route:'joinSession',args:[joined._id,user._id,joined]})
        }
    }
});

//console.log('router nodes',router.nodes.keys(),'\n\n wss nodes',router.services.wss.nodes.keys())

```