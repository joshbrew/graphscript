import { Service, Routes } from "../Service";
export declare type EventSourceProps = {
    url: string;
    events: {
        message?: (ev: any, sseinfo?: EventSourceInfo) => void;
        open?: (ev: any, sseinfo?: EventSourceInfo) => void;
        close?: (ev: any, sseinfo?: EventSourceInfo) => void;
        error?: (ev: any, sseinfo?: EventSourceInfo) => void;
        [key: string]: any;
    };
    evoptions?: boolean | AddEventListenerOptions;
    type?: 'eventsource' | string;
    _id?: string;
    keepState?: boolean;
};
export declare type EventSourceInfo = {
    source: EventSource;
} & EventSourceProps;
export declare class SSEfrontend extends Service {
    name: string;
    eventsources: {
        [key: string]: EventSourceInfo;
    };
    constructor(routes?: Routes, name?: string);
    openSSE: (options: EventSourceProps) => {
        url: string;
        events: {
            [key: string]: any;
            message?: (ev: any, sseinfo?: EventSourceInfo) => void;
            open?: (ev: any, sseinfo?: EventSourceInfo) => void;
            close?: (ev: any, sseinfo?: EventSourceInfo) => void;
            error?: (ev: any, sseinfo?: EventSourceInfo) => void;
        };
        evoptions?: boolean | AddEventListenerOptions;
        type: string;
        _id?: string;
        keepState?: boolean;
        source: EventSource;
    };
    terminate: (sse: EventSourceInfo | EventSource | string) => void;
    routes: Routes;
}
