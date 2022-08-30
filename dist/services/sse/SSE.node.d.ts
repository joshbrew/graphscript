/// <reference types="node" />
import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
import { Session, SessionState, Channel } from 'better-sse';
import http from 'http';
import https from 'https';
import { Readable } from "node:stream";
export declare type SSEProps = {
    server: http.Server | https.Server;
    path: string;
    channels?: string[];
    onconnection?: (session: any, sseinfo: any, _id: string, req: http.IncomingMessage, res: http.ServerResponse) => void;
    onclose?: (sse: any) => void;
    onconnectionclose?: (session: any, sseinfo: any, _id: string, req: http.IncomingMessage, res: http.ServerResponse) => void;
    type?: 'sse' | string;
    _id?: string;
    [key: string]: any;
};
export declare type SSEChannelInfo = {
    channel: Channel<Record<string, unknown>>;
    sessions: {
        [key: string]: Session<SessionState>;
    };
    requests: {
        [key: string]: Function;
    };
    send: (message: any, eventName?: string, sessionId?: string) => any;
    request: (message: any, method?: string, sessionId?: string, eventName?: string) => Promise<any> | Promise<any>[];
    post: (route: any, args?: any, method?: string, sessionId?: string, eventName?: string) => void;
    run: (route: any, args?: any, method?: string, sessionId?: string, eventName?: string) => Promise<any> | Promise<any>[];
    subscribe: (route: any, callback?: ((res: any) => void) | string, sessionId?: string) => Promise<number> | Promise<number>[] | undefined;
    unsubscribe: (route: any, sub: number, sessionId?: string, eventName?: string) => Promise<boolean> | Promise<boolean>[];
    terminate: () => boolean;
    _id: string;
    graph: SSEbackend;
} & SSEProps;
export declare type SSEClientInfo = {
    _id: string;
    session: Session<SessionState>;
    served: SSEChannelInfo;
    send: (message: any, eventName?: string) => any;
    request: (message: any, method?: string, eventName?: string) => Promise<any>;
    post: (route: any, args?: any, method?: string, eventName?: string) => void;
    run: (route: any, args?: any, method?: string, eventName?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string) => any;
    unsubscribe: (route: any, sub: number, eventName?: string) => Promise<boolean>;
    terminate: () => boolean;
    onclose?: (session: any, sseinfo: any, _id: string, req: http.IncomingMessage, res: http.ServerResponse) => void;
    graph: SSEbackend;
};
export declare class SSEbackend extends Service {
    name: string;
    debug: boolean;
    servers: {
        [key: string]: SSEChannelInfo;
    };
    eventsources: {
        [key: string]: SSEClientInfo;
    };
    connections: {
        servers: {
            [key: string]: SSEChannelInfo;
        };
        eventsources: {
            [key: string]: SSEClientInfo;
        };
    };
    constructor(options?: ServiceOptions);
    setupSSE: (options: SSEProps) => false | SSEChannelInfo;
    streamIterable: (path: string, iterable: Iterable<any> | AsyncIterable<any>, sessionId?: string, eventName?: string) => Promise<void> | Promise<void>[];
    streamReadable: (path: string, readable: Readable, sessionId?: string, eventName?: string) => Promise<boolean> | Promise<boolean>[];
    transmit: (data: string | ServiceMessage, path?: string, eventName?: string, sessionId?: string) => boolean;
    request: (message: any, path: string, method?: string, sessionId?: string, eventName?: string) => Promise<any>;
    runRequest: (message: any, path: string, callbackId: string | number, sessionId?: string) => any;
    subscribeSSE: (route: string, path: string, sessionId?: string, eventName?: string) => number;
    subscribeToSSE: (route: string, path: string, callback?: string | ((res: any) => void), sessionId?: string, eventName?: string) => Promise<number> | Promise<number>[];
    terminate: (sse: string | SSEChannelInfo) => boolean;
    routes: Routes;
}
