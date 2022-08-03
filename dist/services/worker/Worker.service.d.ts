import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
import Worker from 'web-worker';
import { GraphNodeProperties } from "../../Graph";
export declare type WorkerRoute = {
    worker: string | URL | Blob;
    workerId?: string;
} & GraphNodeProperties & WorkerProps;
export declare type WorkerProps = {
    url?: URL | string | Blob;
    _id?: string;
    port?: MessagePort;
    onmessage?: (ev: any) => void;
    onerror?: (ev: any) => void;
};
export declare type WorkerInfo = {
    worker: Worker;
    send: (message: any, transfer?: any) => void;
    request: (message: any, transfer?: any, origin?: string, method?: string) => Promise<any>;
    post: (route: any, args?: any, transfer?: any) => void;
    run: (route: any, args?: any, transfer?: any, origin?: string, method?: string) => Promise<any>;
} & WorkerProps;
export declare class WorkerService extends Service {
    name: string;
    workers: {
        [key: string]: WorkerInfo;
    };
    threadRot: number;
    constructor(options?: ServiceOptions);
    customRoutes: ServiceOptions["customRoutes"];
    addWorker: (options: {
        url?: URL | string | Blob;
        port?: MessagePort;
        _id?: string;
        onmessage?: (ev: any) => void;
        onerror?: (ev: any) => void;
    }) => WorkerInfo;
    toObjectURL: (scriptTemplate: string) => string;
    transmit: (message: ServiceMessage | any, worker?: Worker | MessagePort | string, transfer?: StructuredSerializeOptions) => any;
    terminate: (worker: Worker | MessagePort | string) => boolean;
    establishMessageChannel: (worker: Worker | string | MessagePort, worker2?: Worker | string | MessagePort) => string | false;
    request: (message: ServiceMessage | any, workerId: string, transfer?: any, origin?: string, method?: string) => Promise<unknown>;
    runRequest: (message: ServiceMessage | any, worker: undefined | string | Worker | MessagePort, callbackId: string | number) => any;
    routes: Routes;
}
