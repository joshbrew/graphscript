import { HTTPfrontend } from '../../services/http/HTTP.browser';
import { Router } from '../../services/router/Router'
import { EventSourceProps, SSEfrontend } from '../../services/sse/SSE.browser';
import { SessionsService } from '../../services/streaming/sessions.service';
import { WebRTCfrontend } from '../../services/webrtc/WebRTC.browser';
import { WebSocketProps, WSSfrontend } from '../../services/wss/WSS.browser';
import { DOMService } from '../../services/dom/DOM.service';

const router = new Router({
    routes:{
        HTTPfrontend,
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
                        let user = router.addUser(
                            {_id:`user${Math.floor(Math.random()*1000000000000000)}`},
                            { 'ws':{ connection:wsinfo } }
                        ).then((user) => {
                            router.subscribe('sessions.joinSession', (res) => {
                                console.log('joinSessions fired', res);
                            });
                        });

                    }
                } as WebSocketProps,
                'hotreload':{
                    host:'localhost',
                    port:8080,
                    path:'hotreload'
                } as WebSocketProps
            }
        },
        'webrtc':WebRTCfrontend
    },
    syncServices:true,
    order:['webrtc','wss','sse']
});


