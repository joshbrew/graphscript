import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
export declare type WebRTCProps = {
    _id?: string;
    channels?: {
        [key: string]: (true | RTCDataChannelInit | RTCDataChannel);
    };
    config?: RTCConfiguration;
    hostdescription?: RTCSessionDescriptionInit | string;
    peerdescription?: RTCSessionDescriptionInit | string;
    offer?: RTCOfferOptions;
    hostcandidates?: {
        [key: string]: RTCIceCandidate;
    };
    peercandidates?: {
        [key: string]: RTCIceCandidate;
    };
    answer?: RTCAnswerOptions;
    ontrack?: (ev: RTCTrackEvent) => void;
    onicecandidate?: (ev: RTCPeerConnectionIceEvent) => void;
    onicecandidateerror?: (ev: Event) => void;
    onnegotiationneeded?: (ev: Event) => void;
    ondatachannel?: (ev: RTCDataChannelEvent) => void;
    ondata?: (ev: MessageEvent<any>, channel: RTCDataChannel, room: any) => void;
    onconnectionstatechange?: (ev: Event) => void;
    oniceconnectionstatechange?: (ev: Event) => void;
    onclose?: (rtc: WebRTCInfo) => void;
};
export declare type WebRTCInfo = {
    _id: string;
    rtc: RTCPeerConnection;
    send: (message: any) => void;
    request: (message: any, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, method?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string) => Promise<number>;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
    terminate: () => boolean;
    graph: WebRTCfrontend;
} & WebRTCProps;
export declare class WebRTCfrontend extends Service {
    name: string;
    rtc: {
        [key: string]: WebRTCInfo;
    };
    iceServers: {
        urls: string[];
    }[];
    connections: {
        rtc: {
            [key: string]: WebRTCInfo;
        };
    };
    constructor(options?: ServiceOptions, iceServers?: {
        urls: string[];
    }[]);
    createStream: (options: {
        [key: string]: {
            track: MediaStreamTrack | MediaTrackConstraints;
            onended: (ev: any) => void;
            onmute: (ev: any) => void;
            onunmute: (ev: any) => void;
        };
    }) => MediaStream;
    openRTC: (options?: WebRTCProps) => Promise<WebRTCInfo>;
    addIceCandidate(rtc: RTCPeerConnection, candidate: RTCIceCandidate): Promise<void>;
    answerPeer(rtc: RTCPeerConnection, options: WebRTCProps): Promise<unknown>;
    addUserMedia: (rtc: RTCPeerConnection, options?: MediaStreamConstraints) => any[];
    addTrack: (rtc: RTCPeerConnection, track: MediaStreamTrack, stream: MediaStream) => boolean;
    removeTrack: (rtc: RTCPeerConnection, sender: RTCRtpSender) => boolean;
    addDataChannel: (rtc: RTCPeerConnection, name: string, options?: RTCDataChannelInit) => RTCDataChannel;
    transmit: (data: ServiceMessage | any, id?: string, channel?: string | RTCDataChannel) => boolean;
    terminate: (rtc: RTCPeerConnection | WebRTCInfo | string) => boolean;
    request: (message: ServiceMessage | any, channel: RTCDataChannel, _id: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, channel: RTCDataChannel | string, callbackId: string | number) => any;
    subscribeRTC: (route: string, rtcId: string, channel: string | RTCDataChannel) => number;
    subscribeToRTC: (route: string, rtcId: string, channelId: string, callback?: string | ((res: any) => void)) => Promise<any>;
    routes: Routes;
}
