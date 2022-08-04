import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
export declare type WebRTCProps = {
    _id?: string;
    origin?: string;
    channels?: {
        [key: string]: (true | RTCDataChannelInit | RTCDataChannel);
    };
    config?: RTCConfiguration;
    hostdescription?: RTCSessionDescriptionInit;
    peerdescription?: RTCSessionDescriptionInit;
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
};
export declare type WebRTCInfo = {
    rtcTransmit: RTCPeerConnection;
    rtcReceive: RTCPeerConnection;
    send: (message: any) => void;
    request: (message: any, origin?: string, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, origin?: string, method?: string) => Promise<any>;
} & WebRTCProps;
export declare class WebRTCfrontend extends Service {
    name: string;
    rtc: {
        [key: string]: any;
    };
    iceServers: {
        urls: string[];
    }[];
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
    addUserMedia: (rtc: RTCPeerConnection, options?: MediaStreamConstraints) => any[];
    addTrack: (rtc: RTCPeerConnection, track: MediaStreamTrack, stream: MediaStream) => boolean;
    removeTrack: (rtc: RTCPeerConnection, sender: RTCRtpSender) => boolean;
    addDataChannel: (rtc: RTCPeerConnection, name: string, options?: RTCDataChannelInit) => RTCDataChannel;
    transmit: (data: ServiceMessage | any, channel?: string | RTCDataChannel, id?: string) => boolean;
    terminate: (rtc: RTCPeerConnection | WebRTCInfo | string) => boolean;
    request: (message: ServiceMessage | any, channel: RTCDataChannel, _id: string, origin?: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, channel: RTCDataChannel | string, callbackId: string | number) => any;
    routes: Routes;
}
