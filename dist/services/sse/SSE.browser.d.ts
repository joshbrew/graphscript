import { Service, Routes, ServiceOptions, ServiceMessage } from "../Service";
export declare type EventSourceProps = {
    url: string;
    events: {
        message?: (ev: any, sseinfo?: EventSourceInfo) => void;
        open?: (ev: any, sseinfo?: EventSourceInfo) => void;
        close?: (ev: any, sseinfo?: EventSourceInfo) => void;
        error?: (ev: any, sseinfo?: EventSourceInfo) => void;
        [key: string]: any;
    };
    onmessage?: (ev: any, sseinfo?: EventSourceInfo) => void;
    onopen?: (ev: any, sseinfo?: EventSourceInfo) => void;
    onclose?: (ev: any, sseinfo?: EventSourceInfo) => void;
    onerror?: (ev: any, sseinfo?: EventSourceInfo) => void;
    evoptions?: boolean | AddEventListenerOptions;
    type?: 'eventsource' | string;
    _id?: string;
    keepState?: boolean;
};
export declare type EventSourceInfo = {
    source: EventSource;
    send: (message: any) => any;
    request: (message: any, method?: string) => Promise<any>;
    post: (route: any, args?: any) => void;
    run: (route: any, args?: any, method?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string) => any;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
    terminate: () => void;
    graph: SSEfrontend;
} & EventSourceProps;
export declare class SSEfrontend extends Service {
    name: string;
    eventsources: {
        [key: string]: EventSourceInfo;
    };
    connections: {
        eventsources: {
            [key: string]: EventSourceInfo;
        };
    };
    constructor(options?: ServiceOptions);
    openSSE: (options: EventSourceProps) => EventSourceInfo;
    POST: (message: any | ServiceMessage, url?: string | URL, type?: XMLHttpRequestResponseType, mimeType?: string | undefined) => Promise<unknown>;
    transmit: (message: any | ServiceMessage, url: string | URL) => Promise<unknown>;
    request: (message: ServiceMessage | any, url: string, method?: string, sessionId?: string) => Promise<unknown>;
    runRequest: (message: any, url: string | any, callbackId: string | number, sessionId?: string) => any;
    subscribeSSE: (route: string, url: string) => number;
    subscribeToSSE: (route: string, url: string, callback?: string | ((res: any) => void), sessionId?: string) => Promise<any>;
    terminate: (sse: EventSourceInfo | EventSource | string) => void;
    routes: Routes;
}
