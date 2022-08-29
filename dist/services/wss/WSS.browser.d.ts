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
    send: (message: any) => void;
    request: (message: any, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, method?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string) => any;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
    terminate: () => boolean;
    _id?: string;
    graph: WSSfrontend;
} & WebSocketProps;
export declare class WSSfrontend extends Service {
    name: string;
    sockets: {
        [key: string]: WebSocketInfo;
    };
    connections: {
        sockets: {
            [key: string]: WebSocketInfo;
        };
    };
    constructor(options?: ServiceOptions);
    openWS: (options?: WebSocketProps) => WebSocketInfo;
    transmit: (data: string | ArrayBufferLike | Blob | ArrayBufferView | ServiceMessage, ws: WebSocket) => boolean;
    terminate: (ws: WebSocket | string) => boolean;
    request: (message: ServiceMessage | any, ws: WebSocket, _id: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, ws: WebSocket | string, callbackId: string | number) => any;
    subscribeSocket: (route: string, socket: WebSocket | string) => number;
    subscribeToSocket: (route: string, socketId: string, callback?: string | ((res: any) => void)) => Promise<any>;
    routes: Routes;
}
