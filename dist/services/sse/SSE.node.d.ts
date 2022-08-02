/// <reference types="node" />
import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
import { Session, SessionState } from 'better-sse';
import http from 'http';
import https from 'https';
export declare type SSEProps = {
    server: http.Server | https.Server;
    path: string;
    channels?: string[];
    onconnection?: (session: any, sseinfo: any, _id: string, req: http.IncomingMessage, res: http.ServerResponse) => void;
    onclose?: (sse: any) => void;
    onconnectionclose?: (session: any, sseinfo: any, _id: string, req: http.IncomingMessage, res: http.ServerResponse) => void;
    type?: 'sse' | string;
    [key: string]: any;
};
export declare type SSESessionInfo = {
    sessions: {
        [key: string]: any;
    };
} & SSEProps;
export declare class SSEbackend extends Service {
    name: string;
    debug: boolean;
    servers: {
        [key: string]: SSESessionInfo;
    };
    eventsources: {
        [key: string]: {
            _id: string;
            session: Session<SessionState>;
            served: SSESessionInfo;
        };
    };
    constructor(options?: ServiceOptions);
    setupSSE: (options: SSEProps) => false | SSESessionInfo;
    transmit: (data: string | ServiceMessage, path: string, channel: string) => void;
    terminate: (path: string | SSEProps) => void;
    routes: Routes;
}
