import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
import Worker from 'web-worker';
import { GraphNodeProperties } from "../../Graph";
export declare type WorkerRoute = {
    worker?: WorkerInfo;
    workerUrl?: string | URL | Blob;
    workerId?: string;
    transferFunctions?: {
        [key: string]: Function;
    };
    transferClasses?: {
        [key: string]: Function;
    };
    parentRoute?: string;
    callback?: string;
} & GraphNodeProperties & WorkerProps;
export declare type WorkerProps = {
    worker: WorkerInfo;
    workerUrl?: string | URL | Blob;
    url?: URL | string | Blob;
    _id?: string;
    port?: MessagePort;
    onmessage?: (ev: any) => void;
    onerror?: (ev: any) => void;
};
export declare type WorkerInfo = {
    worker: Worker;
    send: (message: any, transfer?: any) => void;
    request: (message: any, transfer?: any, method?: string) => Promise<any>;
    post: (route: any, args?: any, transfer?: any) => void;
    run: (route: any, args?: any, transfer?: any, method?: string) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string) => any;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
} & WorkerProps & WorkerRoute;
export declare class WorkerService extends Service {
    name: string;
    workers: {
        [key: string]: WorkerInfo;
    };
    threadRot: number;
    constructor(options?: ServiceOptions);
    customRoutes: ServiceOptions["customRoutes"];
    customChildren: ServiceOptions["customChildren"];
    addWorker: (options: {
        url?: URL | string | Blob;
        port?: MessagePort;
        _id?: string;
        onmessage?: (ev: any) => void;
        onerror?: (ev: any) => void;
    }) => WorkerInfo;
    toObjectURL: (scriptTemplate: string) => string;
    transmit: (message: ServiceMessage | any, worker?: Worker | MessagePort | string, transfer?: any) => any;
    terminate: (worker: Worker | MessagePort | string) => boolean;
    establishMessageChannel: (worker: Worker | string | MessagePort, worker2?: Worker | string | MessagePort) => string | false;
    request: (message: ServiceMessage | any, workerId: string, transfer?: any, method?: string) => Promise<unknown>;
    runRequest: (message: ServiceMessage | any, worker: undefined | string | Worker | MessagePort, callbackId: string | number) => any;
    subscribeWorker: (route: string, worker: Worker | string | MessagePort) => number;
    subscribeToWorker: (route: string, workerId: string, callback?: string | ((res: any) => void)) => Promise<any>;
    transferFunction(worker: WorkerInfo, fn: Function, fnName?: string): Promise<any>;
    transferClass(worker: WorkerInfo, cls: Function, className?: string): Promise<any>;
    routes: Routes;
}
