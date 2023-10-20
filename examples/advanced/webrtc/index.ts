import { HTTPfrontend } from '../../../src/services/http/HTTP.browser';
import { Router } from '../../../src/services/router/Router'
import { EventSourceProps, SSEfrontend } from '../../../src/services/sse/SSE.browser';
import { PrivateSessionProps, SessionUser, SessionsService, SharedSessionProps } from '../../../src/services/sessions/sessions.service';
import { WebRTCfrontend, WebRTCInfo } from '../../../src/services/webrtc/WebRTC.browser';
import { WebSocketProps, WSSfrontend } from '../../../src/services/wss/WSS.browser';
import {Graph, HTMLNodeProperties, htmlloader, wchtmlloader} from '../../../index'

//how it works
//https://hacks.mozilla.org/2013/07/webrtc-and-the-ocean-of-acronyms/

/* Execution. A Signal channel is an intermediary to pass data, e.g. a socket server.
________________________________________________________
| peer A |  STUN  |  TURN  |  Signal channel  |  Peer B  |
    |          |       |              |              |
    |x-whoamI->|       |              |              |
    |<--NAT---x|       |              |              |
    |x--make channel-->|              |              |
    |x----------offer sdp------------>|x------------>|        //make call
    |<---------answer sdp------------x|<------------x|        //accept call
    |x------ice candidate A---------->|x------------>|        //send communication stuff
    |<------ice candidate B----------x|<------------x|        //send communication stuff back
               |<---------------who am I?-----------x|        //then this stuff establishes the data channels and streams (or something)
               |x-------------IP and port----------->|
*/


/**
 * 
 * Server Sessions: Online Users & Room hosts/Room Session Ids
 * Clientside Sessions: WebRTC private calls with shared host context, 
 * rotate hosts (who streams data back to everyone) incl for shared video calls.
 * 
 */

const router = new Router({
    order:['webrtc','wss','sse'],
    graph:{
        'dom': new Graph({
            loaders:{
                wchtmlloader
            },
            roots:{
                'main':{ //quick page skeleton
                    tagName:'div',
                    __children:{
                        'header':{
                            tagName:'h4',
                            innerHTML:`Hello World!`
                        },
                        'webrtc':{
                            tagName:'div',
                            __children:{
                                'sessioninfo':{
                                    tagName:'div'
                                },
                                'myrooms':{
                                    tagName:'div',
                                    style:{borderStyle:'1px solid black'},
                                    __children:{
                                        'open':{
                                            tagName:'button',
                                            innerText:'Create Room'
                                        },
                                        'myrooms':{
                                            tagName:'div'
                                        }
                                    }
                                },
                                'otherrooms':{
                                    tagName:'div'
                                },
                                'users':{
                                    tagName:'div'
                                }
                            }
                        }
                    }
                } as HTMLNodeProperties //these html nodes (defined by tagName or __element) get lots of benefits
            }
        }),
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
        'webrtc':WebRTCfrontend,
        'wss':{
            service:WSSfrontend,
            config:{
                'testsocket':{
                    host:'localhost',
                    port:8080,
                    path:'wss',
                    onopen:(ev,ws,wsinfo)=>{
                        console.log('socket opened!');

                        let userId = `user${Math.floor(Math.random()*1000000000000000)}`;
                        router.subscribe('joinSession', (res) => {
                            console.log('joinSession fired', res);
                        });

                        router.addUser(
                            { _id:userId },
                            { 'ws':{ connection:wsinfo } }
                        ).then((user) => {
                            console.log('new user', user._id);
                            
                            (router.services.sessions as SessionsService).run(
                                'userUpdateLoop', 
                                user,
                                () => {
                                    if(user.draws) {
                                        user.draws.length = 0;
                                    } //reset onupdate 
                                }
                            );

                            console.log(router);

                            user.rooms = {};   //rooms the user belongs to
                            user.hosting = {}; //rooms the user's hosting
                            user.peer = {}     //rooms the user's a peer to

                        });
                    }
                } as WebSocketProps
            }
        }
    }
});

//chat/game call demos for router, webrtc, and session service
//demo 1:1    call (private session)
//demo 1:many call (group session w/ attempt for piping camera/audio data thru a host, maybe we can distribute the load e.g. faster/preferred connections get more load?)

//we need to make a room on the backend that just lists the host and the user count 
// and then have other connect to that host to connect to the rest of the users (via routers)
function createPrivateRoom(
    router:Router, 
    user:SessionUser, 
    propnames=['draw'],
    userId:string //specify another user to invite
) {
    const sessions = (router.services.sessions as SessionsService);
    sessions.openPrivateSession()
}

function createGroupRoom(
    router:Router, 
    user:SessionUser, 
    propnames=['draw']
) {

}

function endSessionAsHost(
    router:Router, 
    user:SessionUser, 
    del=true
) { //if not deleting host will be swapped

}

function createRTCHandshake(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}

function endRTCCalls(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}

//set a user for data to be piped thru (need to create an independent media stream channel for this)
function setRTCProvider(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps, 
    userId:string
) {
    //need to swap provider deets
}

function enableAudio(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}

function enableVideo(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}

function disableAudio(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}

function disableVideo(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}

function sendMessage(
    router:Router, 
    user:SessionUser, 
    session:PrivateSessionProps|SharedSessionProps
) {

}
