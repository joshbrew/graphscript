import { Router, HTTPbackend, WSSbackend, ServerProps, SSEbackend, SessionsService, SocketServerProps, SSEProps, User, OneWaySessionProps, SharedSessionProps } from '../../../../index.node'


const router = new Router({
    graph:{
        sessions:SessionsService,
        wss:WSSbackend,
        sse:SSEbackend,
        http: {
            service: HTTPbackend,
            config:{
                protocol:'http',
                host:'localhost',
                port:8081,
                pages:{
                    '/':{
                        template:'./index.html'
                    }
                },
                onopen:(served) => {
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
            } as ServerProps
        }
    }
});



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
            },
            onopen:(session)=>{
                console.log("Session Started:",session);
            },
            onhasupdate:(session, update)=>{
                console.log("Session Has Update:", update, session);
            },
            onclose:(session)=>{
                console.log("Session closed!", session);
            }
        }
    },
    'admin'
);

//fires when a session in the loop has an update
function sessionHasUpdate (
    session:OneWaySessionProps|SharedSessionProps,
    update:{shared?:any,oneWay?:any}
){
    console.log("Session Update:",session,update);
}

router.run('sessionLoop',sessionHasUpdate);

//add users to a global session
router.subscribe('addUser', (user:User) => {
    console.log('new user!', user._id);
    if(typeof user === 'object') {
        let joined = (router.services.sessions as SessionsService).joinSession('webrtcrooms', user._id, undefined, true);
    }
});