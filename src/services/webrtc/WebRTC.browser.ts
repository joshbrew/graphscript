import { Service, ServiceMessage, ServiceOptions } from "../Service";

//how it works:
//https://hacks.mozilla.org/2013/07/webrtc-and-the-ocean-of-acronyms/

export type WebRTCProps = {
    _id?:string,
    channels?:{
        [key:string]:(true|RTCDataChannelInit|RTCDataChannel)
    },
    config?:RTCConfiguration,
    description?:RTCSessionDescription|string,
    offer?:RTCOfferOptions,
    hostcandidates?:{[key:string]:RTCIceCandidate},
    peercandidates?:{[key:string]:RTCIceCandidate},
    candidates?:{[key:string]:RTCIceCandidate},
    answer?:RTCAnswerOptions,
    ontrack?:(ev:RTCTrackEvent)=>void,
    removetrack?:(ev:MediaStreamTrackEvent)=>void, //when a media stream track is removed by the peer
    onicecandidate?:(ev:RTCPeerConnectionIceEvent)=>void,
    onicecandidateerror?:(ev:Event)=>void,
    onnegotiationneeded?:(ev:Event, description:RTCSessionDescription)=>void,
    ondatachannel?:(ev:RTCDataChannelEvent)=>void,
    ondata?:(ev:MessageEvent<any>, channel:RTCDataChannel, room)=>void,
    onconnectionstatechange?:(ev:Event)=>void,
    oniceconnectionstatechange?:(ev:Event)=>void,
    onclose?:(rtc:WebRTCInfo)=>void //custom callback
    caller?:string, //e.g. caller's userId from Router
    remoteId?:string, //e.g. set this when passing to the opposite user's 'receiveCallInformation' so you know which connection to call in the router for renegotiating
    [key:string]:any  //set whatever else for reference
}

export type WebRTCInfo = {
    _id:string,
    rtc:RTCPeerConnection,
    senders?:(RTCRtpSender|undefined)[],
    receivers?:(RTCRtpReceiver|undefined)[],
    streams?:(MediaStream|undefined)[], //received mediastreams
    polite?:boolean, //peer will prevent race conditions for simultaneous negotiations
    videoSender?:RTCRtpSender, //audio track channel
    audioSender?:RTCRtpSender, //video track channel
    videoStream?:MediaStream, //audio track channel
    audioStream?:MediaStream, //video track channel
    send:(message:any)=>void, //these callbacks work on the first available data channel to call to other webrtc services
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string,args?:any[],key?:string,subInput?:boolean,channelId?:string)=>Promise<number>,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:()=>boolean,
    graph:WebRTCfrontend
} & WebRTCProps

//webrtc establishes secure P2P contexts between two users directly.
// However, we need a backend as a way to list available connections.
export class WebRTCfrontend extends Service {

    name='webrtc'

    rtc:{
        [key:string]:WebRTCInfo
    } = {}

    unanswered:{
        [key:string]:WebRTCProps
    } = {}

    iceServers:RTCIceServer[] = [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
        { urls: ['stun:stun2.l.google.com:19302'] },
        { urls: ['stun:stun3.l.google.com:19302'] },
        { urls: ['stun:stun4.l.google.com:19302'] }
    ];

    connections = { //higher level reference for router
        rtc:this.rtc
    }

    constructor(
        options?:ServiceOptions, 
        iceServers?:RTCIceServer[] 
    ) {
        super(options);

        if(iceServers) this.iceServers = iceServers;

        this.load(this);
        //console.log(this)
    }

    openRTC = async (
        options?:WebRTCProps
    ):Promise<WebRTCInfo> => {
        if(!options) options = {};
        if(!options._id) options._id = `rtc${Math.floor(Math.random()*1000000000000000)}`;
        if(!options.config) options.config = {iceServers:this.iceServers};
        


        if(!this.rtc[options._id]) {
            let rtc = new RTCPeerConnection(options.config);
  
            if(!options.channels) options.channels = { 'data':true  }; //need one channel at least for the default service stuff to work
            
            let firstChannel;
            for(const key in options.channels) {
                firstChannel = key;
                break;
            }

            let send = (message:any) => {
                //console.log('sent', message)
                return this.transmit(message,options._id,options.channels[firstChannel] as RTCDataChannel);
            }

            let post = (route:any,args?:any, method?:string) => {
                //console.log('sent', message)
                let message:any = {
                    route,
                    args
                };
                if(method) message.method = method;

                return this.transmit(message,options._id,options.channels[firstChannel] as RTCDataChannel);
            }

            let run = (route:any,args?:any, method?:string):Promise<any> => {
                return new Promise ((res,rej) => {
                    let callbackId = Math.random();
                    let req = {route:'runRequest', args:[{route, args}, options._id, callbackId]} as any;
                    //console.log(req)
                    if(method) req.args[0].method = method;
                    
                    let sub;
                    let ondata = (data:any)=>{
                        if(typeof data === 'string' && data.indexOf('{') > -1) data = JSON.parse(data);
                        if(typeof data === 'object') {
                            if(data.callbackId === callbackId) {
                                //(options.channels[firstChannel] as RTCDataChannel).removeEventListener('message',onmessage);
                                this.unsubscribe(options._id,sub);
                                res(data.args); //resolve the request with the corresponding message
                            }
                        }
                    }

                    sub = this.subscribe(options._id,ondata);

                    //(options.channels[firstChannel] as RTCDataChannel).addEventListener('message',onmessage)
                    this.transmit(req, options._id,options.channels[firstChannel] as RTCDataChannel);
                });
            }
            
            let request = (message:ServiceMessage|any, method?:string):Promise<any> => {
                return new Promise ((res,rej) => {
                    let callbackId = Math.random();
                    let req = {route:'runRequest', args:[message,options._id,callbackId]} as any;
                    //console.log(req)
                    if(method) req.method = method;

                    let sub;
                    let ondata = (data:any)=>{
                        if(typeof data === 'string' && data.indexOf('{') > -1) data = JSON.parse(data);
                        if(typeof data === 'object') {
                            if(data.callbackId === callbackId) {
                                //(options.channels[firstChannel] as RTCDataChannel).removeEventListener('message',onmessage);
                                this.unsubscribe(options._id,sub);
                                res(data.args); //resolve the request with the corresponding message
                            }
                        }
                    }

                    sub = this.subscribe(options._id,ondata);
                    this.transmit(req, options._id,options.channels[firstChannel] as RTCDataChannel);
                });
            }

            let subscribe = (route:any, callback?:((res:any)=>void)|string, 
                args?:any[],key?:string,
                subInput?:boolean,
                channelId?:string
            ) => {
                return this.subscribeToRTC(route, options._id, channelId ? channelId : firstChannel, callback, args, key, subInput);
            }

            let unsubscribe = (route:any, sub:number) => {
                return run('unsubscribe',[route,sub]);
            }
 
            let terminate = () => {
                return this.terminate(options._id);
            }

            this.rtc[options._id] = {
                rtc,
                _id:options._id,
                request,
                run,
                post,
                send,
                subscribe,
                unsubscribe,
                terminate,
                graph:this,
                ...options
            }

            const setMessageChannelHandle = (channel:RTCDataChannel) => {
                if(!this.rtc[options._id].ondata) {
                    this.rtc[options._id].ondata = (mev) => {
                        //console.log('message on data channel', mev);
                        this.receive(mev.data, channel, this.rtc[options._id]);
                        this.setState({[options._id]:mev.data});
                    }
                    channel.addEventListener('message', (mev) => {
                        //console.log('message on data channel', mev);
                        if(this.rtc[options._id].ondata) 
                            this.rtc[options._id].ondata(mev, channel, this.rtc[options._id]);
                    });
                }
                else {
                    channel.addEventListener('message', (mev) => { 
                        if(this.rtc[options._id].ondata) 
                            this.rtc[options._id].ondata(mev, channel, this.rtc[options._id]); 
                    });
                }
            }

            if(this.rtc[options._id].channels) {
                for(const channel in this.rtc[options._id].channels) {
                    if(this.rtc[options._id].channels[channel] instanceof RTCDataChannel) {
                    //OK
                    }
                    else if( typeof this.rtc[options._id].channels[channel] === 'object') {
                        this.rtc[options._id].channels[channel] = this.addDataChannel(rtc,channel,(this.rtc[options._id].channels)[channel] as any);
                    } else {
                        this.rtc[options._id].channels[channel] = this.addDataChannel(rtc,channel);
                    }

                    setMessageChannelHandle(this.rtc[options._id].channels[channel] as RTCDataChannel);

                }
            } 
        
    
            rtc.ontrack = (ev) => {
                if(!this.rtc[options._id].receivers) this.rtc[options._id].receivers = [];
                this.rtc[options._id].receivers.push(ev.receiver);

                if(!this.rtc[options._id].streams) this.rtc[options._id].streams = [];
                this.rtc[options._id].streams.push(...ev.streams);

                let rlength = this.rtc[options._id].receivers.length;
                let slength = this.rtc[options._id].streams.length;

                ev.streams.forEach((s) => {
                    s.addEventListener('removetrack', (ev) => {
                        this.rtc[options._id].receivers[rlength] = undefined;
                        this.rtc[options._id].streams[slength] = undefined;
                        if(this.rtc[options._id].removetrack) this.rtc[options._id].removetrack(ev);
                    })
                })
                
                if(this.rtc[options._id].ontrack) this.rtc[options._id].ontrack(ev);
            };

            rtc.ondatachannel = (ev) => { 
                this.rtc[options._id].channels[ev.channel.label] = ev.channel;
                
                setMessageChannelHandle(ev.channel);
            
                if(this.rtc[options._id].ondatachannel) 
                    this.rtc[options._id].ondatachannel(ev);
            };

            rtc.onicecandidate = (ev) => { if(this.rtc[options._id].onicecandidate) this.rtc[options._id].onicecandidate(ev); };
            rtc.onicecandidateerror = (ev) => { if(this.rtc[options._id].onicecandidateerror) this.rtc[options._id].onicecandidateerror(ev); }; 
       
            let initialOffer = this.rtc[options._id].description === undefined;

            rtc.onnegotiationneeded = async (ev) => { 
                if(!initialOffer) {
                    const offer = await rtc.createOffer(this.rtc[options._id].offer);
                    if (rtc.signalingState != "stable") return;
                    await rtc.setLocalDescription(offer);
    
                    if(this.rtc[options._id].onnegotiationneeded) this.rtc[options._id].onnegotiationneeded(ev, rtc.localDescription); 
                }
            }; 
            /*
            rtc.onnegotiationneeded = async () => { //you need to implement this
                const offer = await rtc.createOffer();
                if (rtc.signalingState != "stable") return;
                await rtc.setLocalDescription(offer);
                io.send({route:'negotiateCall', args: [options._id, rtc.localDescription]});
            }
            */
            rtc.oniceconnectionstatechange =  (ev) => { if(this.rtc[options._id].oniceconnectionstatechange) this.rtc[options._id].oniceconnectionstatechange(ev); }; 
            rtc.onconnectionstatechange =  (ev) => { if(this.rtc[options._id].onconnectionstatechange) this.rtc[options._id].onconnectionstatechange(ev); }; 
            rtc.addEventListener('connectionstatechange', (ev) => {
                if(rtc.connectionState === 'closed' || rtc.connectionState === 'failed') {
                    if(this.rtc[options._id].onclose) {
                        this.rtc[options._id].onclose(this.rtc[options._id]);
                    }

                    delete this.rtc[options._id];
                } 
            });

        
            if(!this.rtc[options._id].onicecandidate) this.rtc[options._id].onicecandidate = (ev:RTCPeerConnectionIceEvent) => {
                if(ev.candidate) {
                    let icecandidate = ev.candidate; 
    
                    if(!this.rtc[options._id].candidates) this.rtc[options._id].candidates = {};
                    this.rtc[options._id].candidates[`candidate${Math.floor(Math.random()*1000000000000000)}`] = icecandidate;
    
                }
            }

            if(!options.description) return await new Promise((res,rej) => {
                this.rtc[options._id].rtc.createOffer(options.offer)
                .then((offer) => this.rtc[options._id].rtc.setLocalDescription(offer))
                .then(()=>{
                    initialOffer = false;
                    res(this.rtc[options._id]); //this is to be transmitted to the user 
                });
            });

        } else {
            Object.assign(this.rtc[options._id],options);
        }


        if(options.description) {
            this.rtc[options._id].polite = true;
            await this.negotiateCall(options._id, options.description, true);
        }

        if(options.candidates) {
            for(const prop in options.candidates) {
                const candidate = new RTCIceCandidate(options.candidates[prop])
                this.rtc[options._id].rtc.addIceCandidate(candidate).catch(console.error);
            }
        }

        return this.rtc[options._id];
    
    }

    open = this.openRTC; //for the router

    addIceCandidate = (rtc:RTCPeerConnection|string, candidate:RTCIceCandidate) => {
        if(typeof rtc === 'string') rtc = this.rtc[rtc]?.rtc;
        if(typeof candidate === 'string') candidate = JSON.parse(decodeURIComponent(candidate));
        if(rtc && rtc.remoteDescription) return rtc.addIceCandidate(candidate);
    }

    //receive and compile unanswered/unadded call information (e.g. peer descriptions and ice candidates)
    //https://hacks.mozilla.org/2013/07/webrtc-and-the-ocean-of-acronyms/
    receiveCallInformation = async ( options:WebRTCProps ) => {
        if(!options._id) options._id = `rtc${Math.floor(Math.random()*1000000000000000)}`;
        if (this.rtc[options._id]) {
            if(options.candidates) {
                for(const key in options.candidates) 
                   this.addIceCandidate(this.rtc[options._id].rtc, options.candidates[key]);
                delete options.candidates;
            }
            Object.assign(this.rtc[options._id],options);
        }
        else if(this.unanswered[options._id]) {
            this.recursivelyAssign(this.unanswered[options._id], options); //
        } else this.unanswered[options._id] = options;

        return options._id;
    }

    answerCall = ( options:WebRTCProps|string ) => {
        if(typeof options === 'string') options = this.unanswered[options];
        delete this.unanswered[options._id];
        return this.openRTC(options);
    }

    rejectCall = ( options:WebRTCProps|string ) => {
        if(typeof options === 'string') options = this.unanswered[options];
        delete this.unanswered[options._id];
        return true;
    }

    negotiateCall = async ( rtc:RTCPeerConnection|string, description:string|RTCSessionDescription, polite?:boolean) => {
        if(typeof rtc === 'string') {
            if(polite === undefined) 
                polite = this.rtc[rtc].description !== undefined; //only the person called should have this defined
            rtc = this.rtc[rtc].rtc;
        }
        if(typeof description === 'string') description = new RTCSessionDescription(JSON.parse(decodeURIComponent(description)));
        if((description as RTCSessionDescription).type === 'offer' && rtc.signalingState !== 'stable') {
            if(!polite) return;
            await Promise.all([
                rtc.setLocalDescription({type:'rollback'}),
                rtc.setRemoteDescription(description as RTCSessionDescription)
            ]);
            return encodeURIComponent(JSON.stringify((rtc as RTCPeerConnection).localDescription)); //we need to run negotiateCall on the other end now with this description to update the call information
        } else {
            await rtc.setRemoteDescription(description as RTCSessionDescription);
        } if ((description as RTCSessionDescription).type == "offer") {
            await rtc.setLocalDescription(await rtc.createAnswer());
            return encodeURIComponent(JSON.stringify((rtc as RTCPeerConnection).localDescription)); //we need to run negotiateCall on the other end now with this description to update the call information
        }
    }

    createOffer(rtc:RTCPeerConnection|string, options:WebRTCProps|string) {
        if(typeof rtc === 'string') rtc = this.rtc[rtc].rtc;
        if(typeof options === 'string') options = this.rtc[options];
        return new Promise((res,rej) => {
            if(!rtc) rej(undefined);
            (rtc as RTCPeerConnection).createOffer((options as WebRTCProps).offer)
            .then((offer) => (rtc as RTCPeerConnection).setLocalDescription(offer))
            .then(()=>{
                let description = encodeURIComponent(JSON.stringify((rtc as RTCPeerConnection).localDescription));
                res(description); //this is to be transmitted to the user 
            });
        })
    }

    createAnswer(rtc:RTCPeerConnection|string, options:WebRTCProps|string) {
        if(typeof rtc === 'string') rtc = this.rtc[rtc]?.rtc as RTCPeerConnection;
        if(typeof options === 'string') options = this.rtc[options];

        return new Promise((res,rej) => {
            if(!rtc) rej(undefined);
            (rtc as RTCPeerConnection).createAnswer((options as WebRTCProps).answer)
            .then((answer)=> (rtc as RTCPeerConnection).setLocalDescription(answer))
            .then(()=>{
                let description = encodeURIComponent(JSON.stringify((rtc as RTCPeerConnection).localDescription));
                res(description);
            });
        });
    }
    
    answerPeer = (rtc:RTCPeerConnection|string, options:WebRTCProps|string) => {
        if(typeof rtc === 'string') {
            let cpy = Object.assign(this.rtc[rtc],options);
            delete cpy.description;
            delete cpy.candidates;
            Object.assign(this.rtc[rtc],cpy);

            rtc = this.rtc[rtc]?.rtc;
        }
        if(typeof options === 'string') options = this.rtc[options];
        return new Promise((res,rej) => {
            if(typeof (options as WebRTCProps).description === 'string') {
                (options as WebRTCProps).description = JSON.parse(decodeURIComponent((options as WebRTCProps).description as string));
            }
            const description = new RTCSessionDescription((options as WebRTCProps).description as RTCSessionDescriptionInit);
            
            (rtc as RTCPeerConnection).setRemoteDescription(description).then(()=>{
                if((options as WebRTCProps).candidates) {
                    for(const prop in (options as WebRTCProps).candidates) {
                        const candidate = new RTCIceCandidate((options as WebRTCProps).candidates[prop])
                        if(this.rtc[(options as WebRTCProps)._id]) this.rtc[(options as WebRTCProps)._id].candidates[prop] = (options as WebRTCProps).candidates[prop];
                        (rtc as RTCPeerConnection).addIceCandidate(candidate).catch(console.error);
                    }
                }
                if(description.type === 'offer') {
                    this.rtc[(options as WebRTCProps)._id].rtc.createAnswer((options as WebRTCProps).answer).then((a) => {
                        this.rtc[(options as WebRTCProps)._id].rtc.setLocalDescription(a);
                    });
                }
                res(this.rtc[(options as WebRTCProps)._id] ? this.rtc[(options as WebRTCProps)._id] : rtc);
            }).catch(rej); //we can now receive data
        });
    }
    
    createStream = ( //use navigator.mediaDevices.getUserMedia({audio:true,video:true}) for audio/video streams
        options:{
            [key:string]:{
                track:MediaStreamTrack|MediaTrackConstraints,
                onended:(ev)=>void,
                onmute:(ev)=>void,
                onunmute:(ev)=>void
            }
        }
    ) => {
        let stream = new MediaStream();
        for(const key in options) {
            let track = options[key].track;
            if(!(track instanceof MediaStreamTrack) && typeof track === 'object') {
                track = new MediaStreamTrack();
                track.applyConstraints(options[key].track as MediaTrackConstraints)
                stream.addTrack(track);
            }

            if(track instanceof MediaStreamTrack) {
                stream.addTrack(track as MediaStreamTrack);
                track.onmute = options[key].onmute;
                track.onunmute = options[key].onunmute;
                track.onended = options[key].onended;

            }
        }
        return stream;
    }

    addUserMedia = (
        rtc:RTCPeerConnection,
        options:MediaStreamConstraints={
            audio:true,
            video:{
                optional:[
                    {minWidth: 320  },
                    {minWidth: 640  },
                    {minWidth: 1024 },
                    {minWidth: 1280 },
                    {minWidth: 1920 },
                    {minWidth: 2560 },
                  ]
            } as MediaTrackConstraints
        },
        info?:WebRTCInfo
    ) => {

        return new Promise(async (res,rej) => {

            let RTCRtpSenders:any[] = [];

            let stream = await navigator.mediaDevices.getUserMedia(options)
              
            if(stream) {
                let tracks = stream.getTracks()
                tracks.forEach((track) => {
                    let sender = rtc.addTrack(track,stream);
                    if(track.kind === 'video' && info) {info.videoSender = sender; info.videoStream = stream; }
                    if(track.kind === 'audio' && info) {info.audioSender = sender; info.audioStream = stream;  }
                    RTCRtpSenders.push(sender);
                });
                let str = stream;
    
                if(info) info.senders =
                info.senders ? 
                    [...info.senders, ...RTCRtpSenders] : 
                RTCRtpSenders;
    
                res(str);
            }
        });
    }

    //add media streams to the dat channel
    addTrack = (rtc:RTCPeerConnection, track:MediaStreamTrack, stream:MediaStream) => {
        return rtc.addTrack(track,stream);
    }

    removeTrack = (rtc:RTCPeerConnection,sender:RTCRtpSender) => {
        rtc.removeTrack(sender); //e.g. remove the senders removed by addUserMedia
        return true;
    }

    addDataChannel = ( //send arbitrary strings
        rtc:RTCPeerConnection, 
        name:string,
        options?:RTCDataChannelInit//{ negotiated: false }
    ) => {
        return rtc.createDataChannel(name,options);
    }

    enableAudio = async (call:WebRTCInfo, audioOptions:boolean|(MediaTrackConstraints & {deviceId?:string})=true) => {
        if(call.audioStream) this.disableAudio(call);
        let stream = await this.addUserMedia(
            call.rtc, 
            {
                audio:audioOptions,
                video:false
            }, 
            call 
        );

        if((audioOptions as any)?.deviceId) (call.audioSender as any).deviceId = (audioOptions as any).deviceId;

        return stream;
    }
    
    enableVideo = async (
        call:WebRTCInfo, 
        videoOptions:(MediaTrackConstraints & {deviceId?:string, optional?:{minWidth: number}[] })  = {
            //deviceId: 'abc' //or below default setting:
            optional:[
                {minWidth: 320},
                {minWidth: 640},
                {minWidth: 1024},
                {minWidth: 1280},
                {minWidth: 1920},
                {minWidth: 2560},
                {minWidth: 3840},
            ]
        } as MediaTrackConstraints  & { deviceId?:string, optional?:{minWidth: number}[] },
        includeAudio:boolean|(MediaTrackConstraints & {deviceId?:string}) = false
    ) => { //the maximum available resolution will be selected if not specified
        
        if(call.videoStream) this.disableVideo(call);
    
        let stream = await this.addUserMedia(
            call.rtc, 
            {
                audio:includeAudio, 
                video:videoOptions ? videoOptions : {
                    optional: [
                        {minWidth: 320},
                        {minWidth: 640},
                        {minWidth: 1024},
                        {minWidth: 1280},
                        {minWidth: 1920},
                        {minWidth: 2560},
                        {minWidth: 3840},
                    ]
                } as MediaTrackConstraints
            }, 
            call 
        );

        if(videoOptions?.deviceId) (call.videoSender as any).deviceId = videoOptions.deviceId;
        if(includeAudio) {
            if((includeAudio as any)?.deviceId)
                (call.audioSender as any).deviceId = (includeAudio as any).deviceId; 
            else if(videoOptions?.deviceId) (call.audioSender as any).deviceId = (videoOptions as any).deviceId; 
        }

        return stream;
    }
    
    disableAudio(call:WebRTCInfo) {
        if(call.audioSender) {
            call.senders?.find((s,i) => {
                if(call.audioStream?.getAudioTracks()[0].id === s.track.id) {
                    call.senders.splice(i,1);
                    return true;
                }
            });
            call.rtc.removeTrack(call.audioSender);
            call.audioSender = undefined;
        }
        call.audioStream?.getTracks().forEach((track) => {
            if(track.kind === 'audio') track.stop();
        });
        call.audioStream = undefined;
    }
    
    disableVideo(call:WebRTCInfo) {
        if(call.videoSender) {
            call.senders?.find((s,i) => {
                if(call.videoStream?.getVideoTracks()[0].id === s.track.id) {
                    call.senders.splice(i,1);
                    return true;
                }
            });
            call.rtc.removeTrack(call.videoSender);
            call.videoSender = undefined;
        }
        call.videoStream?.getTracks().forEach((track) => {
            if(track.kind === 'video') track.stop();
        });
        call.videoStream = undefined;
    }

    //send data on a data channel
    transmit = (data:ServiceMessage|any, id?:string, channel?:string|RTCDataChannel ) => {
        if((typeof data === 'object' && ((data.route || data.node) || !(data as ArrayBufferLike).byteLength && typeof (data as Blob).arrayBuffer !== 'function') || typeof data === 'number')) 
            data = JSON.stringify(data); //we need strings
        
        if(!channel && id) { //select first channel
            let keys = Object.keys(this.rtc[id].channels);
            if(keys[0])
                channel = this.rtc[id].channels[keys[0]] as RTCDataChannel;
        }

        if(typeof channel === 'string')  {
            if(id) {
                channel = this.rtc[id].channels[channel] as RTCDataChannel;
            } else { //send on all channels on all rooms
                for(const id in this.rtc) {
                    if(this.rtc[id].channels[channel] instanceof RTCDataChannel)
                        (this.rtc[id].channels[channel] as RTCDataChannel).send(data); // This may be a string, a Blob, an ArrayBuffer, a TypedArray or a DataView object.
                }
            }
        }

        if(channel instanceof RTCDataChannel)
            channel.send(data); // This may be a string, a Blob, an ArrayBuffer, a TypedArray or a DataView object.
    
        //console.log('sending',channel,data)

        return true;
    }

    //close a channel
    terminate = (rtc:RTCPeerConnection|WebRTCInfo|string) => {
        let tx;
        if(typeof rtc === 'string') {
            let room = this.rtc[rtc];
            delete this.rtc[rtc];
            if(room) {
                tx = room.rtc;
            }
        }
        else if (typeof rtc === 'object') {
            tx = (rtc as WebRTCInfo).rtc;
        }
    
        if(rtc instanceof RTCPeerConnection && rtc.signalingState !== 'closed') {
            rtc.close();
        } else if(tx && tx.signalingState !== 'closed') {
            if(tx) tx.close();
        }

        return true;
    }

    request = (message:ServiceMessage|any, channel:RTCDataChannel, _id:string, method?:string) => { //return a promise which can resolve with a server route result through the socket
        let callbackId = `${Math.random()}`;
        let req:any = {route:'runRequest', args:[message,_id,callbackId]};
        if(method) req.method = method;
        return new Promise((res,rej) => {
            let onmessage = (ev:any) => {
                let data = ev.data;
                if(typeof data === 'string' && data.indexOf('{') > -1) data = JSON.parse(ev.data);
                if(typeof data === 'object') if(data.callbackId === callbackId) {
                    channel.removeEventListener('message',onmessage);
                    res(data.args);
                }
            }

            channel.addEventListener('message',onmessage);
            channel.send(JSON.stringify(req));
        });
    }

    runRequest = (
        message:any, 
        channelOrRtcId:RTCDataChannel|string, //data channel or rtc id (which grabs the first channel)
        callbackId:string|number
    ) => { //send result back
        let res = this.receive(message);
        if(channelOrRtcId) {
            if(typeof channelOrRtcId === 'string') {
                for(const key in this.rtc) {
                    if(key === channelOrRtcId) {channelOrRtcId = this.rtc[key].channels.data ? this.rtc[key].channels.data as RTCDataChannel : this.rtc[key].channels[Object.keys(this.rtc[key].channels)[0]] as RTCDataChannel; break;}
                }
            } 
            if(res instanceof Promise)
                res.then((v) => {
                    res = {args:v, callbackId};
                    if(channelOrRtcId instanceof RTCDataChannel) channelOrRtcId.send(JSON.stringify(res));
                    
                    return res;
                })
            else {
                res = {args:res, callbackId};
                if(channelOrRtcId instanceof RTCDataChannel) channelOrRtcId.send(JSON.stringify(res));
            }
        }
        return res;
    }
            
    subscribeRTC = (
        route:string, 
        rtcId:string, 
        args?:any[],
        key?:string,
        subInput?:boolean,
        channel?:string|RTCDataChannel
    ) => {
        if(this.restrict?.[route]) return undefined;
        if(typeof channel === 'string' && this.rtc[rtcId]) {
            channel = this.rtc[rtcId].channels[channel] as RTCDataChannel;
        } else if (!channel) { channel = this.rtc[rtcId].channels[Object.keys(this.rtc[rtcId].channels)[0]] as RTCDataChannel }
        return this.subscribe(route, (res:any) => {
            //console.log('running request', message, 'for worker', worker, 'callback', callbackId)
            if(res instanceof Promise) {
                res.then((r) => {
                    (channel as RTCDataChannel).send(JSON.stringify({args:r, callbackId:route}));
                });
            } else {
                (channel as RTCDataChannel).send(JSON.stringify({args:res, callbackId:route}));
            }
        },args,key,subInput);
    } 

    subscribeToRTC = (
        route:string, rtcId:string, channelId:string, callback?:string|((res:any)=>void),
        args?:any[],
        key?:string,
        subInput?:boolean
    ) => {
        if(typeof channelId === 'string' && this.rtc[rtcId]) {
            let c = this.rtc[rtcId];
            let channel = c.channels[channelId];

            if(channel) {
                this.__node.state.subscribeEvent(rtcId, (res) => {
                    if(res?.callbackId === route) {
                        if(!callback) this.setState({[rtcId]:res.args}); //just set state
                        else if(typeof callback === 'string') { //run a local node
                            this.run(callback,res.args);
                        }
                        else callback(res.args);
                    }
                });
                return c.request({route:'subscribeRTC', args:[route,rtcId,args,key,subInput,channelId]});
            }
        }
    }

}