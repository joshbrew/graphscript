import { HTTPfrontend } from '../../services/http/HTTP.browser';
import { Router } from '../../services/router/Router'
import { EventSourceProps, SSEfrontend } from '../../services/sse/SSE.browser';
import { SessionsService } from '../../services/streaming/sessions.service';
import { WebRTCfrontend } from '../../services/webrtc/WebRTC.browser';
import { WebSocketProps, WSSfrontend } from '../../services/wss/WSS.browser';
import { DOMService } from '../../services/dom/DOM.service';

const router = new Router({
    routes:{
        'dom': new DOMService({
            routes:{
                'main':{
                    tagName:'div',
                    children:{
                        'header':{
                            tagName:'h4',
                            innerHTML:`Hello World!`
                        }
                    }
                }
            }
        })
    },
    services:{
        'http':HTTPfrontend,
        'sessions':SessionsService,
        'sse':{
            service:SSEfrontend,
            config:{
                'testsse':{
                    url:'http://localhost:8080/sse',
                    events:{
                        'test':(ev)=>{console.log('test',ev.data)}
                    }
                } as EventSourceProps
            }
        },
        'wss':{
            service:WSSfrontend,
            config:{
                'testsocket':{
                    host:'localhost',
                    port:8080,
                    path:'wss',
                    onopen:(ev,ws,wsinfo)=>{
                        console.log('socket opened!');

                        router.addUser(
                            {_id:`user${Math.floor(Math.random()*1000000000000000)}`},
                            { 'ws':{ connection:wsinfo } }
                        ).then((user) => {
                            console.log('new user', user._id);

                            router.subscribe('joinSession', (res) => {
                                console.log('joinSession fired', res);
                                (document.getElementById('header') as HTMLElement).innerHTML = `Joined: ${JSON.stringify(res)}`;
                            });
                        });

                    }
                } as WebSocketProps,
                // 'hotreload':{
                //     host:'localhost',
                //     port:8080,
                //     path:'hotreload'
                // } as WebSocketProps
            }
        },
        'webrtc':WebRTCfrontend
    },
    syncServices:true,
    order:['webrtc','wss','sse']
});

//router.services.sessions.users = router.users;

console.log(router.nodes.keys())