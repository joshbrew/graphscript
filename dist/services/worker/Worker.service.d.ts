import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
import Worker from 'web-worker';
export declare type WorkerProps = {
    url?: URL | string;
    _id?: string | number;
    port?: MessagePort;
    onmessage?: (ev: any) => void;
    onerror?: (ev: any) => void;
};
export declare type WorkerInfo = {
    worker: Worker;
    send: (message: any, transfer?: any) => void;
    request: (message: any, transfer?: any, origin?: string, method?: string) => Promise<any>;
} & WorkerProps;
export declare class WorkerService extends Service {
    name: string;
    workers: {
        [key: string]: WorkerInfo;
    };
    threadRot: number;
    constructor(options?: ServiceOptions);
    addWorker: (options: {
        url: URL | string;
        _id?: string;
        onmessage?: (ev: any) => void;
        onerror?: (ev: any) => void;
    }) => WorkerInfo;
    toObjectURL: (scriptTemplate: string) => string;
    transmit: (message: ServiceMessage | any, worker?: Worker | MessagePort | string, transfer?: StructuredSerializeOptions) => any;
    terminate: (worker: Worker | MessagePort | string) => boolean;
    establishMessageChannel: (worker: Worker | string, worker2?: Worker | string) => false | MessageChannel;
    request: (message: ServiceMessage | any, worker: Worker, transfer?: any, origin?: string, method?: string) => Promise<unknown>;
    runRequest: (message: ServiceMessage | any, worker: undefined | string | Worker | MessagePort, callbackId: string | number) => any;
    routes: Routes;
}
