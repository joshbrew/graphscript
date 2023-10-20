import { HTTPfrontend } from '../../../src/services/http/HTTP.browser';
import { Router } from '../../../src/services/router/Router'
import { EventSourceProps, SSEfrontend } from '../../../src/services/sse/SSE.browser';
import { SessionsService } from '../../../src/services/sessions/sessions.service';
import { WebRTCfrontend, WebRTCInfo } from '../../../src/services/webrtc/WebRTC.browser';
import { WebSocketProps, WSSfrontend } from '../../../src/services/wss/WSS.browser';
import {Graph, htmlloader} from '../../../index'

//how it works
//https://hacks.mozilla.org/2013/07/webrtc-and-the-ocean-of-acronyms/

/* Execution. A Signal channel is an intermediary to pass data, e.g. a socket server.
________________________________________________________
| peer A |  STUN  |  TURN  |  Signal channel  |  Peer B  |

    x-whoamI->
    <--NAT---x
    x---make channel-->
    x----------offer sdp------------>|x------------>        //make call
    <---------answer sdp------------x|<------------x        //accept call
    x------ice candidate A---------->|x------------>        //send communication stuff
    <------ice candidate B----------x|<------------x        //send communication stuff back
             <---------------who am I?-------------x        //then this stuff establishes the data channels and streams (or something)
             x--------------IP and port------------>
*/

const router = new Router({
    order:['webrtc','wss','sse'],
    graph:{
        'dom': new Graph({
            loaders:{
                htmlloader
            },
            roots:{
                'main':{
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
                                            innerText:'Create Peer Connection'
                                        },
                                        'myrooms':{
                                            tagName:'div'
                                        }
                                    }
                                },
                                'otherrooms':{
                                    tagName:'div'
                                }
                            }
                        }
                    }
                }
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

                        router.addUser(
                            {_id:`user${Math.floor(Math.random()*1000000000000000)}`},
                            { 'ws':{ connection:wsinfo } }
                        ).then((user) => {
                            console.log('new user', user._id);
                            
                            (router.services.sessions as SessionsService).run('userUpdateLoop',user);

                            user.rooms = {} as any;
                            user.localrtc = {} as any;

                            console.log(user);

                            router.subscribe('joinSession', (res) => {
                                console.log('joinSession fired', res);
                                (document.getElementById('sessioninfo') as HTMLElement).innerHTML = `Joined: ${JSON.stringify(res)}`;
                                if(res?.settings.name === 'webrtcrooms'){


                                    //make it so we can open rooms
                                    (document.getElementById('open') as HTMLButtonElement).onclick = () => {
                                        let newId = `rtc${Math.floor(Math.random()*1000000000000000)}`;

                                        user.rooms[newId] = {
                                            joined:false,
                                            ownerId:user._id,
                                            deleted:false,
                                            isLive:false,
                                            hostcandidates:{},
                                            hostdescription:undefined,
                                            peercandidates:{},
                                            peerdescription:undefined
                                        };

                                        (router.services.webrtc as WebRTCfrontend).openRTC({
                                            _id:newId,
                                            onicecandidate:(ev) => {
                                                if(ev.candidate) {
                                                    let cid = `hostcandidate${Math.floor(Math.random()*1000000000000000)}`;
                                                    user.rooms[newId].hostcandidates[cid] = ev.candidate;   
                                                    console.log('setting ice candidate!', cid, ev.candidate);
                                                }
                                            },
                                        }).then((room:WebRTCInfo) => {

                                            user.rooms[newId].hostdescription = room.description;
                                            user.localrtc[newId] = room;
                                            
                                            (document.getElementById('myrooms') as HTMLElement).insertAdjacentHTML('beforeend',`
                                                <div id='${room._id}'>
                                                    Room ID: ${room._id}<br>
                                                    <div id='${room._id}joined'>Available: ${!user.rooms[room._id].joined}</div>
                                                    <button id='${room._id}close'>Close</button>
                                                </div>
                                            `);

                                            (document.getElementById(room._id+'close') as HTMLButtonElement).onclick = () => {
                                                (router.services.webrtc as WebRTCfrontend).terminate(room._id);
                                                document.getElementById(room._id)?.remove();
                                                user.rooms[room._id].deleted = true;                
                                            }
                                        });
                                    }


                                    (router.services.sessions as SessionsService).subscribeToSession(
                                        'webrtcrooms',(user as any)._id,
                                        (res:any) => {
                                            console.log('server sent to you: ',res);
                                            if(res.data) {
                                                if(res.data.shared) {
                                                    for(const userId in res.data.shared) {
                                                        if(userId == user._id) { // this is your data returned to you
                                                            console.log(userId, '(my data, returned from server)',res.data.shared[userId]);
                                                        } else{
                                                            //this is data from other windows
                                                            console.log(userId, res.data.shared[userId]);
                                                            let userrooms = document.querySelector('#'+userId);
                                                            if(!userrooms) {
                                                                (document.getElementById('otherrooms') as HTMLElement).insertAdjacentHTML('beforeend',`
                                                                    <div id='${userId}'>
                                                                        User ${userId} rooms:<br>
                                                                    </div> 
                                                                `);
                                                                userrooms = (document.getElementById('otherrooms') as HTMLElement).querySelector('#'+userId);
                                                            } 

                                                            if(userrooms && res.data.shared[userId].rooms) {
                                                                for(const roomId in res.data.shared[userId].rooms) {

                                                                    const remoteroom = res.data.shared[userId].rooms[roomId];


                                                                    if(remoteroom.deleted) {
                                                                        if(((document.getElementById('myrooms') as HTMLElement).querySelector('#'+roomId+'joined') as any)) 
                                                                            ((document.getElementById('myrooms') as HTMLElement).querySelector('#'+roomId) as any).remove();
                                                                        else if((userrooms.querySelector('#'+roomId+'joined') as any)) 
                                                                            (userrooms.querySelector('#'+roomId) as any).remove();
                                                                        delete user.rooms[roomId];
                                                                    } 
                                                                    else if(!(document.getElementById('otherrooms') as HTMLElement).querySelector('#'+roomId) && remoteroom.ownerId === userId) {
                                                                            userrooms.insertAdjacentHTML('beforeend',`
                                                                                <div id='${roomId}'>
                                                                                    Room ID: ${roomId}<br>
                                                                                    <div id='${roomId}joined'>Available: ${!remoteroom.joined}</div>
                                                                                    <button id='${roomId}join'>Join</button>
                                                                                </div>
                                                                            `);

                                                                            //let's join a room as a peer
                                                                            (document.getElementById(roomId+'join') as HTMLButtonElement).onclick = () => {

                                                                                user.rooms[roomId] = {
                                                                                    joined:true,
                                                                                    ownerId:userId,
                                                                                    isLive:false,
                                                                                    hostcandidates:{},
                                                                                    hostdescription:remoteroom.description,
                                                                                    peercandidates:{},
                                                                                    peerdescription:undefined
                                                                                };

                                                                                (router.services.webrtc as WebRTCfrontend).openRTC({
                                                                                    _id:roomId, 
                                                                                    description:remoteroom.description,
                                                                                    onicecandidate:(ev) => {
                                                                                        if(ev.candidate) user.rooms[roomId].peercandidates[`peercandidate${Math.floor(Math.random()*1000000000000000)}`] = ev.candidate;
                                                                                    },
                                                                                }).then((localroom) => {

                                                                                    user.localrtc[roomId] = localroom;
                                                                                    user.rooms[roomId].peerdescription = localroom.description;


                                                                                    (user.localrtc[roomId].rtc as RTCPeerConnection).addEventListener('datachannel',(ev) => {
                                                                                        if(ev.channel.readyState === 'open') {
                                                                                            //you can add user as both the host and the peer
                                                                                            if(!router.users[roomId]) {
                                                                                                router.addUser({_id:roomId},{0:roomId}).then((rtcUser) => {
                                                                                                    console.log('Attempting to ping HOST from PEER', rtcUser);
                                                                                                    (rtcUser as any).run('ping').then((r)=>{console.log('RETURNED FROM REMOTE PEER (YOU ARE PEER):',r);  }).catch(console.error);
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                    
                                                                                    if(remoteroom.hostcandidates) {
                                                                                        for(const c in remoteroom.hostcandidates) {
                                                                                            //console.log('adding host ice candidate!', remoteroom.hostcandidates[c], 'for room', localroom)
                                                                                            user.rooms[roomId].hostcandidates[c] = true;
                                                                                            (localroom.rtc as RTCPeerConnection).addIceCandidate(remoteroom.hostcandidates[c]);
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                        
                                                                    } else {

                                                                        console.log('remote room',remoteroom, ', local room?',user.localrtc[roomId]);
                                                                        let otherRoom = ((document.getElementById('otherrooms') as HTMLElement).querySelector('#'+roomId+'joined') as any);
                                                                        if(otherRoom) otherRoom.innerHTML = 'Available: ' + !remoteroom.joined;

                                                                        if(remoteroom.hostcandidates && user.rooms[roomId] && user._id !== remoteroom.ownerId) {
                                                                            for(const c in remoteroom.hostcandidates) {
                                                                                if(!(c in user.rooms[roomId].hostcandidates)) {
                                                                                    //console.log('adding new host ice candidate!', remoteroom.hostcandidates[c], 'for room', user.localrtc[roomId].rtc)
                                                                                    user.rooms[roomId].hostcandidates[c] = true;
                                                                                    (user.localrtc[roomId].rtc as RTCPeerConnection).addIceCandidate(remoteroom.hostcandidates[c]);
                                                                                }
                                                                            }
                                                                            if(remoteroom.isLive && !user.rooms[roomId].isLive) {
                                                                                user.rooms[roomId].isLive = true;
                                                                                console.log('session is live!', roomId);
                                                                                
                                                                            }
                                                                        } 
                                                                        
                                                                        if (
                                                                            remoteroom.peerdescription && 
                                                                            user.rooms[roomId] && 
                                                                            user._id === remoteroom.ownerId 
                                                                        ) {
                                                                            if(!user.rooms[roomId].peerdescription) {
                                                                                (router.services.webrtc as WebRTCfrontend).answerPeer((user.localrtc[roomId].rtc as RTCPeerConnection), remoteroom).then(() => {
                                                                                    user.rooms[roomId].isLive = true;
                                                                                    user.rooms[roomId].joined = true;
                                                                                    user.rooms[roomId].peerdescription = remoteroom.peerdescription;
                                                                                    if(user.rooms[roomId].peercandidates) {
                                                                                        for(const c in user.rooms[roomId].peercandidates) {
                                                                                            //console.log('adding new peer ice candidate!', remoteroom.peercandidates[c], 'for room', user.localrtc[roomId].rtc);
                                                                                            user.rooms[roomId].peercandidates[c] = true;
                                                                                        }
                                                                                    }
                                                                                    console.log('session is live!', roomId);

                                                                                    (user.localrtc[roomId].rtc as RTCPeerConnection).addEventListener('datachannel',(ev) => {
                                                                                        if(ev.channel.readyState === 'open') {
                                                                                        //you can add user as both the host and the peer
                                                                                            if(!router.users[roomId]) {
                                                                                                router.addUser({_id:roomId},{0:roomId}).then((rtcUser) => {
                                                                                                    console.log('Attempting to ping PEER from HOST', rtcUser);
                                                                                                    (rtcUser as any).run('ping').then((r)=>{console.log('RETURNED FROM REMOTE PEER (YOU ARE HOST):',r);  }).catch(console.error);
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                    //(user.localrtc[roomId] as WebRTCInfo).run('ping').then((r)=>{console.log('returned from remote peer:',r);  }).catch(console.error);
                                                                                })
                                                                                // remoteroom.peerdescription = JSON.parse(decodeURIComponent(remoteroom.peerdescription));
                                                                                // (user.localrtc[roomId].rtc as RTCPeerConnection).setRemoteDescription(remoteroom.peerdescription).then(() => {
                                                                                //     user.rooms[roomId].peerdescription = remoteroom.peerdescription;
                                                                                //     for(const c in remoteroom.peercandidates) {
                                                                                //         console.log('adding new peer ice candidate!', remoteroom.peercandidates[c], 'for room', user.localrtc[roomId].rtc);
                                                                                //         (user.localrtc[roomId].rtc as RTCPeerConnection).addIceCandidate(remoteroom.peercandidates[c]);
                                                                                //         user.rooms[roomId].peercandidates[c] = true;
                                                                                //     }
                                                                                // });
                                                                            } else if(remoteroom.peercandidates) {
                                                                                for(const c in remoteroom.peercandidates) {
                                                                                    if(!user.rooms[roomId].peercandidates[c]) {
                                                                                        console.log('adding new peer ice candidate!', remoteroom.peercandidates[c], 'for room', user.localrtc[roomId].rtc);
                                                                                        (user.localrtc[roomId].rtc as RTCPeerConnection).addIceCandidate(remoteroom.peercandidates[c]);
                                                                                        user.rooms[roomId].peercandidates[c] = true;
                                                                                    }
                                                                                }
                                                                            }
                                                                        } 

                                                                        
                                                                    }
                                                                }
                                                            }
                                                        }
    
                                                    }
                                                } 
                                            }
                                        }
                                    )
                                }
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
        }
    }
});

//router.services.sessions.users = router.users;

console.log(router.__node.nodes.keys())