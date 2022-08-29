/// <reference types="node" />
import { RouteProp, Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import { GraphNode } from "../../Graph";
export declare type ServerProps = {
    host: string;
    port: number;
    certpath?: string;
    keypath?: string;
    passphrase?: string;
    startpage?: string;
    errpage?: string;
    pages?: {
        [key: 'all' | string]: string | ({
            template?: string;
            onrequest?: GraphNode | string | ((self: HTTPbackend, node: GraphNode, request: http.IncomingMessage, response: http.ServerResponse) => void);
            redirect?: string;
            inject?: {
                [key: string]: {} | null;
            } | string[] | string | ((...args: any) => any);
        } & RouteProp);
    };
    protocol?: 'http' | 'https';
    type?: 'httpserver' | string;
    keepState?: boolean;
    onopen?: (served: ServerInfo) => void;
    onclose?: (served: ServerInfo) => void;
    _id?: string;
    [key: string]: any;
};
export declare type ServerInfo = {
    server: https.Server | http.Server;
    address: string;
    terminate: () => void;
    graph: HTTPbackend;
    _id: string;
} & ServerProps;
export declare type ReqOptions = {
    protocol: 'http' | 'https' | string;
    host: string;
    port: number;
    method: string;
    path?: string;
    headers?: {
        [key: string]: any;
        'Content-Type'?: string;
        'Content-Length'?: number;
    };
};
export declare class HTTPbackend extends Service {
    name: string;
    server: any;
    debug: boolean;
    servers: {
        [key: string]: ServerInfo;
    };
    mimeTypes: {
        [key: string]: string;
    };
    constructor(options?: ServiceOptions, settings?: {
        host?: string;
        port?: number;
        protocol?: 'http' | 'https';
        certpath?: string;
        keypath?: string;
    });
    onStarted: (protocol: 'http' | 'https' | string, host: string, port: number) => void;
    setupServer: (options?: ServerProps, requestListener?: http.RequestListener, onStarted?: () => void) => Promise<ServerInfo>;
    setupHTTPserver: (options?: ServerProps, requestListener?: http.RequestListener, onStarted?: () => void) => Promise<ServerInfo>;
    setupHTTPSserver: (options?: ServerProps, requestListener?: http.RequestListener, onStarted?: () => void) => Promise<ServerInfo>;
    transmit: (message: any | ServiceMessage, options: string | {
        protocol: 'http' | 'https' | string;
        host: string;
        port: number;
        method: string;
        path?: string;
        headers?: {
            [key: string]: any;
            'Content-Type'?: string;
            'Content-Length'?: number;
        };
    }, ondata?: (chunk: any) => void, onend?: () => void) => Promise<Buffer> | http.ClientRequest;
    withResult: (response: http.ServerResponse, result: any, message: {
        route: string;
        args: {
            request: http.IncomingMessage;
            response: http.ServerResponse;
        };
        method?: string;
        served?: ServerInfo;
    }) => void;
    injectPageCode: (templateString: string, url: string, served: ServerInfo) => string;
    receive: (message: {
        route: string;
        args: {
            request: http.IncomingMessage;
            response: http.ServerResponse;
        };
        method?: string;
        node?: string;
        served?: ServerInfo;
        redirect?: string;
    }) => Promise<unknown>;
    request: (options: ReqOptions | any, send?: any, ondata?: (chunk: any) => void, onend?: () => void) => http.ClientRequest;
    post: (url: string | URL, data: any, headers?: {
        [key: string]: any;
        'Content-Type'?: string;
        'Content-Length'?: number;
    }) => http.ClientRequest;
    get: (url: string | URL | http.RequestOptions) => Promise<Buffer>;
    terminate: (served: string | ServerInfo) => void;
    getRequestBody(req: http.IncomingMessage): Promise<Buffer>;
    addPage: (path: string, template: string) => void;
    addHTML: (path: string, template: string) => void;
    buildPage: (pageStructure: string | string[] | {
        [key: string]: any;
    } | ((...args: any) => any), baseTemplate: string) => string;
    routes: Routes;
}
