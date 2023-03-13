function exitHandler(options, exitCode) {
        
    if (exitCode || exitCode === 0) console.log('SERVER EXITED WITH CODE: ',exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));


import { Router, User } from "../../../src/services/router/Router";
import { SocketServerProps, WSSbackend } from "../../../src/services/wss/WSS.node";
import { SSEbackend, SSEProps } from "../../../src/services/sse/SSE.node";
import { HTTPbackend, ServerProps } from "../../../src/services/http/HTTP.node";
import { SessionsService } from "../../../src/services/sessions/sessions.service";
import { scriptBoilerPlate } from "../../../src/services/http/boilerplate";

const router = new Router({
    graph:{
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
                            template:'tinybuild.config.js',
                            onrequest:function (self, node, request, response) {
                                
                            }
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

                        console.log('server opened!');

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
    order:['sse','wss'],//prefer certain connection sources in a certain order, defaults to load order (if appropriate callbacks are available for subscription)
}); //on frontend we want to prefer wss first as sse is POST-reliant from browser

//router.services.sessions.users = router.users;

//console.log(Object.keys(router.services));

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

router.run('sessionLoop');

router.subscribe('addUser', (user:User) => {
    console.log('new user!', user._id);
    if(typeof user === 'object') {
        let joined = (router.services.sessions as SessionsService).joinSession('webrtcrooms', user._id);
        if(joined) {
            user.send({route:'joinSession',args:[joined._id,user._id,joined]})
        }
    }
});

//console.log('router nodes',router.__node.nodes.keys())