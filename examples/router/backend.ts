import { Router } from "../../services/router/Router";
import { SocketServerProps, WSSbackend } from "../../services/wss/WSS.node";
import { SSEbackend, SSEProps } from "../../services/sse/SSE.node";
import { HTTPbackend, ServerProps } from "../../services/http/HTTP.node";
import { SessionsService } from "../../services/streaming/sessions.service";
import { scriptBoilerPlate } from "../../services/http/boilerplate";

const router = new Router({
    routes:{
        SessionsService
    },
    services:{
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
                            }
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
