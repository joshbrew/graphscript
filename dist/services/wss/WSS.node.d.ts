/// <reference types="node" />
import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import https from 'https';
export declare type SocketServerProps = {
    server: http.Server | https.Server;
    host: 'localhost' | '127.0.0.1' | string;
    port: 7000 | number;
    path: 'wss' | 'hotreload' | 'python' | string;
    onmessage?: (data: any, ws: WebSocket, serverinfo: SocketServerInfo) => void;
    onclose?: (wss: WebSocketServer, serverinfo: SocketServerInfo) => void;
    onconnection?: (ws: WebSocket, request: http.IncomingMessage, serverinfo: SocketServerInfo, clientId: string) => void;
    onconnectionclosed?: (code: number, reason: Buffer, ws: WebSocket, serverinfo: SocketServerInfo, clientId: string) => void;
    onerror?: (err: Error, wss: WebSocketServer, serverinfo: SocketServerInfo) => void;
    onupgrade?: (ws: WebSocket, serverinfo: SocketServerInfo, request: http.IncomingMessage, socket: any, head: Buffer) => void;
    keepState?: boolean;
    type?: 'wss';
    [key: string]: any;
};
export declare type SocketServerInfo = {
    wss: WebSocketServer;
    clients: {
        [key: string]: WebSocket;
    };
    address: string;
} & SocketServerProps;
export declare type SocketProps = {
    host: string;
    port: number;
    path?: string;
    serverOptions?: WebSocket.ServerOptions;
    onmessage?: (data: string | ArrayBufferLike | Blob | ArrayBufferView | Buffer[], ws: WebSocket, wsinfo: SocketProps) => void;
    onopen?: (ws: WebSocket, wsinfo: SocketProps) => void;
    onclose?: (code: any, reason: any, ws: WebSocket, wsinfo: SocketProps) => void;
    onerror?: (er: Error, ws: WebSocket, wsinfo: SocketProps) => void;
    protocol?: 'ws' | 'wss';
    type?: 'socket';
    _id?: string;
    keepState?: boolean;
};
export declare type SocketInfo = {
    socket: WebSocket;
    address?: string;
    send: (message: any) => void;
    request: (message: any, origin?: string, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, origin?: string, method?: string) => Promise<any>;
} & SocketProps;
export declare class WSSbackend extends Service {
    name: string;
    debug: boolean;
    servers: {
        [key: string]: SocketServerInfo;
    };
    sockets: {
        [key: string]: SocketInfo;
    };
    constructor(options?: ServiceOptions);
    setupWSS: (options: SocketServerProps) => SocketServerInfo;
    openWS: (options: SocketProps) => WebSocket;
    transmit: (message: string | ArrayBufferLike | Blob | ArrayBufferView | Buffer[] | ServiceMessage, ws: WebSocketServer | WebSocket) => void;
    closeWS: (ws: WebSocket | string) => boolean;
    terminate: (ws: WebSocketServer | WebSocket | string) => boolean;
    request: (message: ServiceMessage | any, ws: WebSocket, _id: string, origin?: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, ws: WebSocket | string, callbackId: string | number) => any;
    routes: Routes;
}
