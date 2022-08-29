import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service";
export declare type RequestOptions = {
    method: string;
    url: string | URL;
    data?: Document | string | Blob | BufferSource | FormData | URLSearchParams;
    responseType?: XMLHttpRequestResponseType;
    mimeType?: string | undefined;
    onload?: (ev: any) => void;
    onprogress?: (ev: any) => void;
    onabort?: (ev: any) => void;
    onerror?: (er: any) => void;
    onloadend?: (ev: any) => void;
    user?: string;
    pass?: string;
};
export declare class HTTPfrontend extends Service {
    name: string;
    fetchProxied: boolean;
    listening: {};
    constructor(options?: ServiceOptions, path?: string, fetched?: (clone: Response, args: any[], response: Response) => Promise<void>);
    static request: (options: RequestOptions) => XMLHttpRequest;
    GET: (url?: string | URL, type?: XMLHttpRequestResponseType, mimeType?: string | undefined) => Promise<unknown>;
    POST: (message: any | ServiceMessage, url?: string | URL, type?: XMLHttpRequestResponseType, mimeType?: string | undefined) => Promise<unknown>;
    transmit: (message: any | ServiceMessage, url: string | URL) => any;
    transponder: (url: string | URL, message: any | ServiceMessage | undefined, type?: XMLHttpRequestResponseType, mimeType?: string) => Promise<unknown>;
    listen: (path?: string | undefined | '0', fetched?: (clone: Response, args: any[], response: Response) => Promise<void>) => string;
    stopListening: (path: string | 0 | undefined, listener?: string) => void;
    routes: Routes;
}
