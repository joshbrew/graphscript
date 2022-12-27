## WebRTCfrontend

WebRTC allows peer-2-peer connections directly through the browser. Chain this with a socket server and the user router to pass session info remotely so users can connect from anywhere, with the only server overhead being the passing of needed information between clients. 

See `examples/webrtc` for a basic implementation you can modify easily. There are a lot of options you can customize to constrain RTC sessions. A default data channel is used to pass service messages bidirectionally, or if you don't specify a callback for custom data channels (or the first channel available).

```ts

import {WebRTCfrontend} from 'graphscript'

export type WebRTCProps = {
    _id?:string,
    channels?:{
        [key:string]:(true|RTCDataChannelInit|RTCDataChannel)
    },
    config?:RTCConfiguration,
    hostdescription?:RTCSessionDescriptionInit|string,
    peerdescription?:RTCSessionDescriptionInit|string,
    offer?:RTCOfferOptions,
    hostcandidates?:{[key:string]:RTCIceCandidate},
    peercandidates?:{[key:string]:RTCIceCandidate},
    answer?:RTCAnswerOptions,
    ontrack?:(ev:RTCTrackEvent)=>void,
    onicecandidate?:(ev:RTCPeerConnectionIceEvent)=>void,
    onicecandidateerror?:(ev:Event)=>void,
    onnegotiationneeded?:(ev:Event)=>void,
    ondatachannel?:(ev:RTCDataChannelEvent)=>void,
    ondata?:(ev:MessageEvent<any>, channel:RTCDataChannel, room)=>void,
    onconnectionstatechange?:(ev:Event)=>void,
    oniceconnectionstatechange?:(ev:Event)=>void,
    onclose?:(rtc:WebRTCInfo)=>void //custom callback
}

export type WebRTCInfo = {
    _id:string,
    rtc:RTCPeerConnection,
    send:(message:any)=>void, //these callbacks work on the first available data channel to call to other webrtc services
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>Promise<number>,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:()=>boolean,
    graph:WebRTCfrontend
} & WebRTCProps

let rtc = new WebRTCfrontend();

rtc.openRTC().then((room:WebRTCInfo) => {
    room.rtcTransmit.addEventListener('icecandidate',(ev)=>{
        if(room._id) {
            if(ev.candidate) {
                //send the candidate to the other client
                socket.send(JSON.stringify({
                    _id:room._id,
                    hostdescription:room.hostdescription,
                    hostcandidates:room.hostcandidates //update endpoint with all of the host candidates
                })); //e.g. using a socket connection 
                //in another client, join this session
                //need to send this info to the server which should happen automatically via the userupdateloop
            }
        }
    })


    socket.addEventListener('message',(ev) => {
        let peerinfo = JSON.parse(ev.data);

        if(peerinfo.peerdescription) {
            rtc.answerPeer(room.rtc,peerinfo);
        }

    });
})

```

Then on the receiving end...
```ts

socket.addEventListener('message',(ev) => {
    let hostinfo = JSON.parse(ev.data);

    if(!rtc.rooms[hostinfo._id]) {

        let room = rtc.openRTC(hostinfo as WebRTCProps).then((room:WebRTCInfo) => {

            room.rtcReceive.addEventListener('icecandidate',(ev)=>{
                if(ev.candidate && room._id) {
                    socket.send(JSON.stringify({
                        _id:room._id,
                        peerdescription:room.peerdescription,
                        peercandidates:room.peercandidates
                    }))
                }
            })
        })
        
    } else {
        for(const prop in hostinfo.hostcandidates) {
            if(!rtc.rooms[hostinfo._id].hostcandidates[prop]) {
                rtc.addIceCandidate(rtc.rooms[hostinfo._id].rtcReceive, hostinfo.hostcandidates[prop])
            }
        }
    }
})


```