import { HTTPfrontend } from '../../services/http/HTTP.browser';
import { Router } from '../../services/router/Router'
import { EventSourceProps, SSEfrontend } from '../../services/sse/SSE.browser';
import { SessionsService } from '../../services/streaming/sessions.service';
import { WebRTCfrontend } from '../../services/webrtc/WebRTC.browser';
import { WebSocketProps, WSSfrontend } from '../../services/wss/WSS.browser';

const router = new Router({
    routes:{
        HTTPfrontend,
        SessionsService
    },
    services:{
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
                    path:'wss'
                } as WebSocketProps
            }
        },
        'webrtc':WebRTCfrontend
    },
    syncServices:true,
    order:['webrtc','wss','sse']
})
