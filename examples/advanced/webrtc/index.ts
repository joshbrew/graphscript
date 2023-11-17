import { HTTPfrontend } from '../../../src/services/http/HTTP.browser';
import { Router } from '../../../src/services/router/Router'
import { EventSourceProps, SSEfrontend } from '../../../src/services/sse/SSE.browser';
import { OneWaySessionProps, SessionUser, SessionsService, SharedSessionProps } from '../../../src/services/sessions/sessions.service';
import { WebRTCfrontend, WebRTCInfo, WebRTCProps } from '../../../src/services/webrtc/WebRTC.browser';
import { WebSocketInfo, WebSocketProps, WSSfrontend } from '../../../src/services/wss/WSS.browser';
import {Graph, HTMLNodeProperties, html, htmlloader, wchtmlloader} from '../../../index'

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
        dom: new Graph({
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
                                'users':{
                                    tagName:'div'
                                },
                                'invites':{
                                    tagName:'div'
                                },
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
                            }
                        }
                    }
                } as HTMLNodeProperties //these html nodes (defined by tagName or __element) get lots of benefits
            }
        }),
        http:HTTPfrontend,
        sessions:SessionsService,
        sse:{
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
        webrtc:WebRTCfrontend,
        wss:{
            service:WSSfrontend,
            config:{
                'testsocket':{
                    host:'localhost',
                    port:8080,
                    path:'wss',
                    onopen:(ev,ws,wsinfo)=>{
                        console.log('socket opened!');

                        const sessions = (router.services.sessions as SessionsService);
   
                        let userId = `user${Math.floor(Math.random()*1000000000000000)}`;
                        
                        router.subscribe('joinSession', (res:SharedSessionProps|OneWaySessionProps|false) => {
                            console.log('joinSession:', res);
                        });
                        router.subscribe('receiveSessionInvite', (sessionId:string) => {
                            const invite = sessions.invites[userId]?.[sessionId];
                            if(!invite) return;
                            console.log('receiveSessionInvite:', sessionId, invite);
                            let sessionInviteDiv = document.createElement('div');
                            let sessionInfoSpan = document.createElement('span');
                            
                            
                            let sessionAcceptButton = document.createElement('button');
                            sessionAcceptButton.innerHTML = 'Accept';
                            
                            sessionAcceptButton.onclick = () => {
                                acceptInvite(router, sessions.users[userId], invite.session as any, wsinfo);
                            }
                            
                            let sessionRejectButton = document.createElement('button');
                            sessionRejectButton.innerHTML = 'Reject';

                            sessionRejectButton.onclick = () => {
                                sessions.rejectInvite(invite.session, userId, true);
                            }

                            //using the lit-html plugin to interpret the template string text
                            sessionInfoSpan.appendChild(html`
                                <span>
                                    Id: ${sessionId}<br/>
                                    Host: ${(invite.session as any)?.settings?.host};
                                </span>
                            `());

                            sessionInviteDiv.appendChild(html`
                                ${sessionInfoSpan}
                                ${sessionAcceptButton}
                                ${sessionRejectButton}
                            `())

                            document.getElementById('invites')?.appendChild(sessionInviteDiv);

                        });

                        router.addUser(
                            { _id:userId },
                            { 'ws':{ connection:wsinfo } }
                        ).then((user) => {
                            console.log('new user', user._id);
                            
                            sessions.run(
                                'userUpdateLoop', 
                                user,
                                () => {
                                    if(user.draws) {
                                        user.draws.length = 0;
                                    } //reset onupdate 
                                }
                            );

                            console.log(router);

                            user.rooms = {};   //rooms the user belongs to, this will be synced to server
                            user.hosting = {}; //rooms the user's hosting
                            user.peer = {}     //rooms the user's a peer to

                        });
                    }
                } as WebSocketProps
            }
        }
    }
});
console.log(router);
//make room as host
//make canvas for host
//join room as user, get canvas copy
//on draw update, users/host push updates to server 

//chat/game call demos for router, webrtc, and session service
//demo 1:1    call (private session)
//demo 1:many call (group session w/ attempt for piping camera/audio data thru a host, maybe we can distribute the load e.g. faster/preferred connections get more load?)

//we need to make a room on the backend that just lists the host and the user count 
// and then have other connect to that host to connect to the rest of the users (via routers)

//  build in an ask-to-join system to just run a callback on listener/user(s) 
//  side to then pull options/duplicate data. 
function createOutgoingStream( //needs to go to a specified user
    router:Router, 
    user:SessionUser, //user's main connection to backend, or the listener user's direct webrtc representation
    listenerUserId:string,//specify another user to invite
    sessionName?:string,
    propnames={draw:true},
) {
    const sessions = (router.services.sessions as SessionsService);
    const session = sessions.openOneWaySession(
        {
            settings:{
                name:sessionName ? sessionName : `room${Math.floor(Math.random()*1000000000000000)}`,
                propnames,
                source:user._id, //outgoing
                listener:listenerUserId,
                onopen:(session)=>{
                    console.log("Session started:", session);
                },
                onhasupdate:(session, update)=>{
                    console.log("Session has update:", session, update);
                },
                onclose:(session)=>{
                    console.log("Session closed!", session);
                }
            }
        }, 
        user._id,
        listenerUserId
    );

    user.rooms[session._id] = true;

    //ping listenerUser to joinSession
    if(user.send) 
        user.send(
            'inviteToSession',
            [
                session,
                listenerUserId,
                user._id
            ]
        );
}

function createRoom(
    router:Router, 
    user:SessionUser, 
    sessionName?:string,
    hostprops:{[key:string]:true}={draw:true},
    propnames:{[key:string]:true}={draw:true},
    users?:{[key:string]:true},
    password?:string
) {
    const sessions = (router.services.sessions as SessionsService);
    const session = sessions.openSharedSession(
        {
            settings:{
                name:sessionName ? sessionName : `room${Math.floor(Math.random()*1000000000000000)}`,
                host:user._id,
                hostprops,
                propnames,
                users,
                password,
                onopen:(session)=>{
                    console.log("Session started:", session);
                },
                onhasupdate:(session, update)=>{
                    console.log("Session has update:", session, update);
                },
                onclose:(session)=>{
                    console.log("Session closed!", session);
                }
            }
        },
        user._id
    );

    user.rooms[session._id] = Object.keys(session.settings.users).length;

    if(users && user.send) {
        for(const listenerUserId in users) {
            user.send(
                'inviteToSession',
                [
                    session,
                    listenerUserId,
                    user._id
                ]
            );
        }
    }
}

async function acceptInvite (
    router:Router,
    user:SessionUser,
    session:OneWaySessionProps|SharedSessionProps,
    wsinfo:WebSocketInfo,
    useWebRTC=true
) {
    const sessions = (router.services.sessions as SessionsService);


    if(session.settings) { //add some callbacks
        if(useWebRTC && session.settings.host) 
            await createRTCHandshake(router, user, session.settings.host, session, wsinfo);
        session.settings.onopen=(session)=>{
            console.log("Session started:", session);
        },
        session.settings.onmessage=(session, update)=>{
            console.log("Session has update:", session, update);
        },
        session.settings.onclose=(session)=>{
            console.log("Session closed!", session);
        }
    }
    
    return sessions.acceptInvite(
        session,
        user._id,
        true
    );
}

async function joinRoom(
    router:Router,
    user:SessionUser,
    session:string|OneWaySessionProps|SharedSessionProps,
    useWebRTC=true
) {
    const sessions = (router.services.sessions as SessionsService);
    
    if(!useWebRTC) {
        //create relay thru UserSession and pipe session data thru backend
        
    } else {
        //establish webrtc channels with other user(s) in session and pipe session data p2p
    }
}

async function endSessionAsHost(
    router:Router, 
    user:SessionUser,
    session:string|OneWaySessionProps|SharedSessionProps,
    del=true
) { //if not deleting host will be swapped
    const sessions = (router.services.sessions as SessionsService); 
    if(del) sessions.deleteSession(session, user._id, false);
    else sessions.leaveSession(session,user._id,true,false);
}

function genCallSettings(
    user:SessionUser, 
    receivingUser, 
    rtcId
) {
    const webrtc = router.services.webrtc as WebRTCfrontend;
    return {
        onicecandidate:async (ev) => {
            if(ev.candidate) { //we need to pass our candidates to the other endpoint, then they need to accept the call and return their ice candidates
                let cid = `candidate${Math.floor(Math.random()*1000000000000000)}`;
                (user as any).run(
                    'runConnection', //run this function on the backend router
                    [
                        receivingUser, //run this connection 
                        'runAll',  //use this function (e.g. run, post, subscribe, etc. see User type)
                        [ //and pass these arguments
                            'receiveCallInformation', //run this function on the user's end
                            {
                                _id:rtcId, 
                                candidates:{[cid]:ev.candidate}
                            }
                        ]
                    ]
                ).then((id) => {
                    //console.log('call information echoed from peer:', id);
                });
            }
        },
        onnegotiationneeded: async (ev, description) => {//both ends need to set this function up when adding audio and video tracks freshly
    
            //console.log('negotiating');

            (user as any).run(
                'runConnection', //run this function on the backend router
                [
                    receivingUser, //run this connection 
                    'run',  //use this function (e.g. run, post, subscribe, etc. see User type)
                    [ //and pass these arguments
                        'negotiateCall', //run this function on the user's end
                        [rtcId, encodeURIComponent(JSON.stringify(description))]
                    ],
                    webrtc.rtc[rtcId].remoteId //the other user's backend connection for routing
                ]
            ).then((description) => {
                //if(description) console.log('remote description returned');
                //else console.log('caller renegotiated');
                
                if(description) webrtc.negotiateCall(rtcId as string, description);
            });
        }
        //ontrack, onclose, ondatachannel, ondata
    } as Partial<WebRTCProps>
}

//the host will relay session data to users
async function createRTCHandshake(
    router:Router, 
    user:SessionUser, 
    receivingUser:string,
    session:OneWaySessionProps|SharedSessionProps,
    wsinfo:WebSocketInfo
) {
    if(session.settings) {
        let host = session.settings.host;
        const webrtc = (router.services.webrtc as WebRTCfrontend);
        let rtcId = `room${Math.floor(Math.random()*1000000000000000)}`;

        let call = await webrtc.openRTC({ 
            _id:rtcId,
            ...genCallSettings(user,receivingUser,rtcId)
        });

        user.post('runConnection',[
            'postAll',
            [
                'receiveCallInformation',
                {
                    _id:rtcId,
                    description:encodeURIComponent(JSON.stringify(call.rtc.localDescription)), //the peer needs to accept this
                    caller:user._id,
                    remoteId:wsinfo._id, //my socketId so they know which connection this call is on (for renegotiating)
                }
            ]
        ])
    }
}

async function acceptRTCHandshake(
    router:Router,
    user:SessionUser,
    rtcId:string,
    wsinfo:WebSocketInfo
) {
    const webrtc = (router.services.webrtc as WebRTCfrontend);
    let call = webrtc.unanswered[rtcId];
    Object.assign(call, genCallSettings(user, call.caller, rtcId))

    let rtc = await webrtc.answerCall(call as any);

    user.run(
        'runConnection', //run this function on the backend router
        [
            user._id, //run this connection 
            'postAll',  //use this function (e.g. run, post, subscribe, etc. see User type)
            [ //and pass these arguments
                'cleanupCallInfo', //run this function on the user's end
                call._id
            ]
        ]
    );

    user.run(
        'runConnection', //run this function on the backend router
        [
            call.caller, //run this connection 
            'run',  //use this function (e.g. run, post, subscribe, etc. see User type)
            [ //and pass these arguments
                'answerPeer', //run this function on the user's end
                [
                    rtc._id,
                    {
                        description:encodeURIComponent(JSON.stringify(rtc.rtc.localDescription)), //the host needs this
                        caller:user._id,
                        remoteId:wsinfo._id
                    }
                ]
            ],
            call.remoteId
        ]
    );
}

//need to establish webrtc calls with everyone in the session (if they don't exist, or maybe better to make separate calls for simplicity?)
function endRTCCalls(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps
) {

}

//set a user for data to be piped thru (need to create an independent media stream channels for this to pipe additional streams out)
function setRTCProvider(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps, 
    userId:string
) {
    //need to swap provider deets
}

function enableAudio(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps
) {

}

function enableVideo(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps
) {

}

function disableAudio(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps
) {

}

function disableVideo(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps
) {

}

function sendMessage(
    router:Router, 
    user:SessionUser, 
    session:OneWaySessionProps|SharedSessionProps
) {

}
