import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";

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

//webrtc establishes secure P2P contexts between two users directly.
// However, we need a backend as a way to list available connections.
export class WebRTCfrontend extends Service {

    name='webrtc'

    rtc:{
        [key:string]:WebRTCInfo
    } = {}

    iceServers:{urls:string[]}[] = [
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
        iceServers?:{urls:string[]}[] 
    ) {
        super(options);
        this.load(this.routes);

        if(iceServers) this.iceServers = iceServers;
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

    openRTC = async (
        options?:WebRTCProps
    ):Promise<WebRTCInfo> => {
        if(!options) options = {};
        if(!options._id) options._id = `rtc${Math.floor(Math.random()*1000000000000000)}`;
        if(!options.config) options.config = {iceServers:this.iceServers};
        
        let rtc = new RTCPeerConnection(options.config);


        if(!this.rtc[options._id]) {
  
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

            let subscribe = (route:any, callback?:((res:any)=>void)|string) => {
                return this.subscribeToRTC(route, options._id, firstChannel, callback);
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

            //console.log('opening webrtc channel',this.rtc)
            if(!options.ondatachannel) options.ondatachannel = (ev:RTCDataChannelEvent) => {
                this.rtc[options._id].channels[ev.channel.label] = ev.channel;
                if(!options.ondata) {
                    ev.channel.addEventListener('message', (mev) => {
                        //console.log('message on data channel', mev);
                        this.receive(mev.data, ev.channel, this.rtc[options._id]);
                        this.setState({[options._id]:mev.data});
                    });
                }
                else ev.channel.addEventListener('message', (mev) => { options.ondata(mev.data, ev.channel, this.rtc[options._id]); });
            
            }

            if(options.channels) {
                for(const channel in options.channels) {
                    if(options.channels[channel] instanceof RTCDataChannel) {
                    //OK
                    }
                    else if( typeof options.channels[channel] === 'object') {
                        options.channels[channel] = this.addDataChannel(rtc,channel,(options.channels)[channel] as any);
                    } else {
                        options.channels[channel] = this.addDataChannel(rtc,channel);
                    }

                    (options.channels[channel] as RTCDataChannel).addEventListener('message', (mev) => {
                        //console.log('message on data channel', mev);
                        this.receive(mev.data, channel, this.rtc[options._id]);
                        this.setState({[options._id]:mev.data});
                    });
                }
            } 
        
    
            rtc.ontrack = options.ontrack;
            rtc.onicecandidate = options.onicecandidate;
            rtc.onicecandidateerror = options.onicecandidateerror; 
            rtc.ondatachannel = options.ondatachannel; 
            rtc.onnegotiationneeded = options.onnegotiationneeded; 
            rtc.oniceconnectionstatechange = options.oniceconnectionstatechange; 
            rtc.onconnectionstatechange = options.onconnectionstatechange; 
            rtc.addEventListener('connectionstatechange', (ev) => {
                if(rtc.connectionState === 'closed' || rtc.connectionState === 'failed') {
                    if(this.rtc[options._id].onclose) {
                        this.rtc[options._id].onclose(this.rtc[options._id]);
                    }
                } 
            })
        
        } else {
            Object.assign(this.rtc[options._id],options);
        }

        if(options.hostdescription && !options.peerdescription)   {
            if(!options.onicecandidate) options.onicecandidate = (ev:RTCPeerConnectionIceEvent) => {
                if(ev.candidate) {
                    let icecandidate = ev.candidate; 
    
                    if(!this.rtc[options._id].peercandidates) this.rtc[options._id].peercandidates = {};
                    this.rtc[options._id].peercandidates[`peercandidate${Math.floor(Math.random()*1000000000000000)}`] = icecandidate;
    
                }
            }
    
        // console.log(options.hostdescription)
            return await new Promise((res,rej) => {
                //console.log('desc', options.hostdescription)
                if(typeof options.hostdescription === 'string') {
                    options.hostdescription = JSON.parse(decodeURIComponent(options.hostdescription));
                }
                const description = new RTCSessionDescription(options.hostdescription as RTCSessionDescriptionInit);
                //console.log('desc2', description)

                options.hostdescription = description
                rtc.setRemoteDescription(description).then(()=>{
                    if(options.hostcandidates) {
                        for(const prop in options.hostcandidates) {
                            const candidate = new RTCIceCandidate(options.hostcandidates[prop])
                            rtc.addIceCandidate(candidate).catch(console.error);
                        }
                    }
                    rtc.createAnswer(options.answer)
                    .then((answer)=> rtc.setLocalDescription(answer))
                    .then(()=>{
                        this.rtc[options._id].peerdescription = encodeURIComponent(JSON.stringify(rtc.localDescription));
                        res(this.rtc[options._id]);
                    });
                }).catch(rej); //we can now receive data
            });
        }
    
        if(options.peerdescription)  {
            this.answerPeer(rtc,options);
        }

        if(!options.onicecandidate && !this.rtc[options._id]?.onicecandidate) options.onicecandidate = (ev:RTCPeerConnectionIceEvent) => {
            if(ev.candidate) {
                let icecandidate = ev.candidate; 

                if(!this.rtc[options._id].hostcandidates) this.rtc[options._id].hostcandidates = {};
                this.rtc[options._id].hostcandidates[`hostcandidate${Math.floor(Math.random()*1000000000000000)}`] = icecandidate;

            }
        }

        return await new Promise((res,rej) => {
            rtc.createOffer(options.offer)
            .then((offer) => rtc.setLocalDescription(offer))
            .then(()=>{
                    this.rtc[options._id].hostdescription = encodeURIComponent(JSON.stringify(rtc.localDescription));
                    res(this.rtc[options._id]); //this is to be transmitted to the user 
                });
        });
    
    }

    addIceCandidate(rtc:RTCPeerConnection, candidate:RTCIceCandidate) {
        return rtc.addIceCandidate(candidate);
    }

    //use the 
    answerPeer(rtc:RTCPeerConnection,options:WebRTCProps) {
        return new Promise((res,rej) => {
            if(typeof options.peerdescription === 'string') {
                options.peerdescription = JSON.parse(decodeURIComponent(options.peerdescription));
            }
            const description = new RTCSessionDescription(options.peerdescription as RTCSessionDescriptionInit);
            options.peerdescription = description;

            if(this.rtc[options._id]) this.rtc[options._id].peerdescription = description;
            rtc.setRemoteDescription(description).then(()=>{
                if(options.peercandidates) {
                    for(const prop in options.peercandidates) {
                        const candidate = new RTCIceCandidate(options.peercandidates[prop])
                        if(this.rtc[options._id]) this.rtc[options._id].peercandidates[prop] = options.peercandidates[prop];
                        rtc.addIceCandidate(candidate).catch(console.error);
                    }
                }
                res(this.rtc[options._id] ? this.rtc[options._id] : rtc);
            }).catch(rej); //we can now receive data
        });
    }

    addUserMedia = (
        rtc:RTCPeerConnection,
        options:MediaStreamConstraints={
            audio:false,
            video:{
                optional:[
                    {minWidth: 320},
                    {minWidth: 640},
                    {minWidth: 1024},
                    {minWidth: 1280},
                    {minWidth: 1920},
                    {minWidth: 2560},
                  ]
            } as MediaTrackConstraints
        }
    ) => {
        let senders:any[] = [];
        navigator.mediaDevices.getUserMedia(options)
            .then((stream) => {
                let tracks = stream.getTracks()
                tracks.forEach((track) => {
                    senders.push(rtc.addTrack(track,stream));
                });
            }
        )
        return senders;
    }

    //add media streams to the dat channel
    addTrack = (rtc:RTCPeerConnection, track:MediaStreamTrack, stream:MediaStream) => {
        rtc.addTrack(track,stream);
        return true;
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

    //send data on a data channel
    transmit = (data:ServiceMessage|any, id?:string, channel?:string|RTCDataChannel ) => {
        if(typeof data === 'object' || typeof data === 'number') 
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
                        (this.rtc[id].channels[channel] as RTCDataChannel).send(data);
                }
            }
        }

        if(channel instanceof RTCDataChannel)
            channel.send(data);
    
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
    
        if(rtc instanceof RTCPeerConnection) {
            rtc.close();
        } else if(tx) {
            if(tx) tx.close();
        }

        return true;
    }

    request = (message:ServiceMessage|any, channel:RTCDataChannel, _id:string,method?:string) => { //return a promise which can resolve with a server route result through the socket
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

    runRequest = (message:any, channel:RTCDataChannel|string, callbackId:string|number) => { //send result back
        let res = this.receive(message);
        if(channel) {
            if(typeof channel === 'string') {
                for(const key in this.rtc) {
                    if(key === channel) {channel = this.rtc[key].channels.data as RTCDataChannel; break;}
                }
            }
            if(res instanceof Promise)
                res.then((v) => {
                    res = {args:v, callbackId};
                    if(channel instanceof RTCDataChannel) channel.send(JSON.stringify(res));
                    
                    return res;
                })
            else {
                res = {args:res, callbackId};
                if(channel instanceof RTCDataChannel) channel.send(JSON.stringify(res));
            }
        }
        return res;
    }
            
    subscribeRTC = (route:string, rtcId:string, channel:string|RTCDataChannel) => {
        if(typeof channel === 'string' && this.rtc[rtcId]) {
            channel = this.rtc[rtcId].channels[channel] as RTCDataChannel;
        }
        return this.subscribe(route, (res:any) => {
            //console.log('running request', message, 'for worker', worker, 'callback', callbackId)
            if(res instanceof Promise) {
                res.then((r) => {
                    (channel as RTCDataChannel).send(JSON.stringify({args:r, callbackId:route}));
                });
            } else {
                (channel as RTCDataChannel).send(JSON.stringify({args:res, callbackId:route}));
            }
        });
    } 

    subscribeToRTC = (route:string, rtcId:string, channelId:string, callback?:string|((res:any)=>void)) => {
        if(typeof channelId === 'string' && this.rtc[rtcId]) {
            let c = this.rtc[rtcId];
            let channel = c.channels[channelId];

            if(channel) {
                this.subscribe(rtcId, (res) => {
                    if(res?.callbackId === route) {
                        if(!callback) this.setState({[rtcId]:res.args}); //just set state
                        else if(typeof callback === 'string') { //run a local node
                            this.run(callback,res.args);
                        }
                        else callback(res.args);
                    }
                })
                return c.request({route:'subscribeRTC', args:[route,channelId]});
            }
        }
    }
    
    routes:Routes = {
        //just echos webrtc info for server subscriptions to grab onto
        openRTC:{
            operator:this.openRTC,
            aliases:['open']
        },
        request:this.request,
        runRequest:this.runRequest,
        createStream:this.createStream,
        addUserMedia:this.addUserMedia,
        addTrack:this.addTrack,
        removeTrack:this.removeTrack,
        addDataChannel:this.addDataChannel,
        subscribeRTC:this.subscribeRTC,
        subscribeToRTC:this.subscribeToRTC,
        unsubscribe:this.unsubscribe,
        terminate:this.terminate
    }

}