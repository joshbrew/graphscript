import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
export declare type WebSocketProps = {
    host: string;
    port: number;
    path?: string;
    onmessage?: (data: string | ArrayBufferLike | Blob | ArrayBufferView, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    onopen?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    onclose?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    onerror?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    protocol?: 'ws' | 'wss';
    keepState?: boolean;
    type?: 'socket';
    _id?: string;
    [key: string]: any;
};
export declare type WebSocketInfo = {
    socket: WebSocket;
    address: string;
} & WebSocketProps;
export declare class WSSfrontend extends Service {
    name: string;
    sockets: {
        [key: string]: WebSocketInfo;
    };
    constructor(options?: ServiceOptions);
    openWS: (options?: WebSocketProps) => WebSocketInfo;
    transmit: (data: string | ArrayBufferLike | Blob | ArrayBufferView | ServiceMessage, ws: WebSocket) => boolean;
    terminate: (ws: WebSocket | string) => boolean;
    request: (message: ServiceMessage | any, ws: WebSocket, _id: string, origin?: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, ws: WebSocket | string, callbackId: string | number) => any;
    routes: Routes;
}
