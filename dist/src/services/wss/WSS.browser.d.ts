import { GraphNode, GraphNodeProperties } from "../../core/Graph";
import { Service, ServiceMessage, ServiceOptions } from "../Service";
export type WSSRoute = {
    socket?: WebSocketInfo;
    transferFunctions?: {
        [key: string]: Function;
    };
    transferClasses?: {
        [key: string]: Function;
    };
    parentRoute?: string;
    callback?: string;
    stopped?: boolean;
    blocking?: boolean;
    init?: string;
    initArgs?: any[];
} & GraphNodeProperties & WebSocketProps;
export type WebSocketProps = {
    host: string;
    port: number;
    path?: string;
    debug?: boolean;
    onmessage?: (data: string | ArrayBufferLike | Blob | ArrayBufferView, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    onopen?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    onclose?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    onerror?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
    protocol?: 'ws' | 'wss';
    keepState?: boolean;
    type?: 'socket';
    _id?: string;
    [key: string]: any;
} & GraphNodeProperties;
export type WebSocketInfo = {
    socket: WebSocket;
    address: string;
    send: (message: any) => void;
    request: (message: any, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, method?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string, args?: any[], key?: string, subInput?: boolean) => any;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
    terminate: () => boolean;
    _id?: string;
    graph: WSSfrontend;
} & WebSocketProps & GraphNode;
export declare class WSSfrontend extends Service {
    name: string;
    sockets: {
        [key: string]: WebSocketInfo & GraphNode;
    };
    connections: {
        sockets: {
            [key: string]: {
                socket: WebSocket;
                address: string;
                send: (message: any) => void;
                request: (message: any, method?: string) => Promise<any>;
                post: (route: any, args?: any) => void;
                run: (route: any, args?: any, method?: string) => Promise<any>;
                subscribe: (route: any, callback?: string | ((res: any) => void), args?: any[], key?: string, subInput?: boolean) => any;
                unsubscribe: (route: any, sub: number) => Promise<boolean>;
                terminate: () => boolean;
                _id?: string;
                graph: WSSfrontend;
            } & {
                [key: string]: any;
                host: string;
                port: number;
                path?: string;
                debug?: boolean;
                onmessage?: (data: string | ArrayBufferView | ArrayBufferLike | Blob, ws: WebSocket, wsinfo: WebSocketInfo) => void;
                onopen?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
                onclose?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
                onerror?: (ev: any, ws: WebSocket, wsinfo: WebSocketInfo) => void;
                protocol?: "ws" | "wss";
                keepState?: boolean;
                type?: "socket";
                _id?: string;
            } & GraphNodeProperties & GraphNode;
        };
    };
    constructor(options?: ServiceOptions);
    loadWebSocketRoute: (node: WebSocketProps & GraphNode) => WebSocketInfo;
    socketloader: {
        websockets: (node: WebSocketProps & GraphNode, parent: WebSocketProps & GraphNode, graph: WSSfrontend, roots: any) => void;
    };
    openWS: (options?: WebSocketProps) => WebSocketInfo;
    open: (options?: WebSocketProps) => WebSocketInfo;
    transmit: (data: string | ArrayBufferLike | Blob | ArrayBufferView | ServiceMessage, ws: WebSocket) => boolean;
    terminate: (ws: WebSocket | string) => boolean;
    request: (message: ServiceMessage | any, ws: WebSocket, _id: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, ws: WebSocket | string, callbackId: string | number) => any;
    subscribeSocket: (route: string, socket: WebSocket | string, args?: any[], key?: string, subInput?: boolean) => number;
    subscribeToSocket: (route: string, socketId: string, callback?: string | ((res: any) => void), args?: any[], key?: string, subInput?: boolean) => Promise<any>;
}
