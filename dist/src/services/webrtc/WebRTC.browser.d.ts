import { Service, ServiceMessage, ServiceOptions } from "../Service";
export type WebRTCProps = {
    _id?: string;
    channels?: {
        [key: string]: (true | RTCDataChannelInit | RTCDataChannel);
    };
    config?: RTCConfiguration;
    description?: RTCSessionDescription | string;
    offer?: RTCOfferOptions;
    hostcandidates?: {
        [key: string]: RTCIceCandidate;
    };
    peercandidates?: {
        [key: string]: RTCIceCandidate;
    };
    candidates?: {
        [key: string]: RTCIceCandidate;
    };
    answer?: RTCAnswerOptions;
    ontrack?: (ev: RTCTrackEvent) => void;
    removetrack?: (ev: MediaStreamTrackEvent) => void;
    onicecandidate?: (ev: RTCPeerConnectionIceEvent) => void;
    onicecandidateerror?: (ev: Event) => void;
    onnegotiationneeded?: (ev: Event, description: RTCSessionDescription) => void;
    ondatachannel?: (ev: RTCDataChannelEvent) => void;
    ondata?: (ev: MessageEvent<any>, channel: RTCDataChannel, room: any) => void;
    onconnectionstatechange?: (ev: Event) => void;
    oniceconnectionstatechange?: (ev: Event) => void;
    onclose?: (rtc: WebRTCInfo) => void;
};
export type WebRTCInfo = {
    _id: string;
    rtc: RTCPeerConnection;
    senders?: (RTCRtpSender | undefined)[];
    receivers?: (RTCRtpReceiver | undefined)[];
    streams?: (MediaStream | undefined)[];
    polite?: boolean;
    videoSender?: RTCRtpSender;
    audioSender?: RTCRtpSender;
    videoStream?: MediaStream;
    audioStream?: MediaStream;
    send: (message: any) => void;
    request: (message: any, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, method?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string, args?: any[], key?: string, subInput?: boolean, channelId?: string) => Promise<number>;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
    terminate: () => boolean;
    graph: WebRTCfrontend;
} & WebRTCProps;
export declare class WebRTCfrontend extends Service {
    name: string;
    rtc: {
        [key: string]: WebRTCInfo;
    };
    unanswered: {
        [key: string]: WebRTCProps;
    };
    iceServers: RTCIceServer[];
    connections: {
        rtc: {
            [key: string]: WebRTCInfo;
        };
    };
    constructor(options?: ServiceOptions, iceServers?: RTCIceServer[]);
    openRTC: (options?: WebRTCProps) => Promise<WebRTCInfo>;
    open: (options?: WebRTCProps) => Promise<WebRTCInfo>;
    addIceCandidate: (rtc: RTCPeerConnection | string, candidate: RTCIceCandidate) => Promise<void>;
    receiveCallInformation: (options: WebRTCProps) => Promise<string>;
    answerCall: (options: WebRTCProps | string) => Promise<WebRTCInfo>;
    negotiateCall: (rtc: RTCPeerConnection | string, description: string | RTCSessionDescription, polite?: boolean) => Promise<string>;
    createOffer(rtc: RTCPeerConnection | string, options: WebRTCProps | string): Promise<unknown>;
    createAnswer(rtc: RTCPeerConnection | string, options: WebRTCProps | string): Promise<unknown>;
    answerPeer: (rtc: RTCPeerConnection | string, options: WebRTCProps | string) => Promise<unknown>;
    createStream: (options: {
        [key: string]: {
            track: MediaStreamTrack | MediaTrackConstraints;
            onended: (ev: any) => void;
            onmute: (ev: any) => void;
            onunmute: (ev: any) => void;
        };
    }) => MediaStream;
    addUserMedia: (rtc: RTCPeerConnection, options?: MediaStreamConstraints, info?: WebRTCInfo) => Promise<unknown>;
    addTrack: (rtc: RTCPeerConnection, track: MediaStreamTrack, stream: MediaStream) => RTCRtpSender;
    removeTrack: (rtc: RTCPeerConnection, sender: RTCRtpSender) => boolean;
    addDataChannel: (rtc: RTCPeerConnection, name: string, options?: RTCDataChannelInit) => RTCDataChannel;
    enableAudio: (call: WebRTCInfo, audioOptions?: boolean | (MediaTrackConstraints & {
        deviceId?: string;
    })) => Promise<unknown>;
    enableVideo: (call: WebRTCInfo, videoOptions?: (MediaTrackConstraints & {
        deviceId?: string;
        optional?: {
            minWidth: number;
        }[];
    }), includeAudio?: boolean | (MediaTrackConstraints & {
        deviceId?: string;
    })) => Promise<unknown>;
    disableAudio(call: WebRTCInfo): void;
    disableVideo(call: WebRTCInfo): void;
    transmit: (data: ServiceMessage | any, id?: string, channel?: string | RTCDataChannel) => boolean;
    terminate: (rtc: RTCPeerConnection | WebRTCInfo | string) => boolean;
    request: (message: ServiceMessage | any, channel: RTCDataChannel, _id: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, channelOrRtcId: RTCDataChannel | string, callbackId: string | number) => any;
    subscribeRTC: (route: string, rtcId: string, args?: any[], key?: string, subInput?: boolean, channel?: string | RTCDataChannel) => number;
    subscribeToRTC: (route: string, rtcId: string, channelId: string, callback?: string | ((res: any) => void), args?: any[], key?: string, subInput?: boolean) => Promise<any>;
}
