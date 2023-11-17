import { Service, ServiceMessage, ServiceOptions } from "../Service";
import Worker from 'web-worker';
import { GraphNode, GraphNodeProperties } from "../../core/Graph";
export type WorkerRoute = {
    worker?: WorkerInfo;
    workerUrl?: string | URL | Blob;
    transferFunctions?: {
        [key: string]: Function;
    };
    transferClasses?: {
        [key: string]: Function;
    };
    parentRoute?: string;
    portId?: string;
    callback?: string;
    stopped?: boolean;
    blocking?: boolean;
    init?: string;
    initArgs?: any[];
    initTransfer?: any[];
} & GraphNodeProperties & WorkerProps;
export type WorkerProps = {
    worker?: WorkerInfo;
    workerUrl?: string | URL | Blob;
    url?: URL | string | Blob;
    _id?: string;
    port?: MessagePort;
    onmessage?: (ev: any) => void;
    onerror?: (ev: any) => void;
    onclose?: (worker: Worker | MessagePort) => void;
};
export type WorkerInfo = {
    worker: Worker | MessagePort;
    send: (message: any, transfer?: any) => void;
    request: (message: any, method?: string, transfer?: any) => Promise<any>;
    post: (route: any, args?: any, method?: string, transfer?: any) => void;
    run: (route: any, args?: any, method?: string, transfer?: any) => Promise<any>;
    subscribe: (route: any, callback?: ((res: any) => void) | string, args?: any[], key?: string, subInput?: boolean, blocking?: boolean) => Promise<any>;
    unsubscribe: (route: any, sub: number) => Promise<boolean>;
    start: (route?: any, portId?: string, callback?: ((res: any) => void) | string, blocking?: boolean) => Promise<boolean>;
    stop: (route?: string, portId?: string) => Promise<boolean>;
    workerSubs: {
        [key: string]: {
            sub: number | false;
            route: string;
            portId: string;
            callback?: ((res: any) => void) | string;
            blocking?: boolean;
        };
    };
    terminate: () => boolean;
    postMessage: (message: any, transfer?: any[]) => void;
    graph: WorkerService;
    _id: string;
} & WorkerProps & WorkerRoute;
export declare class WorkerService extends Service {
    name: string;
    workers: {
        [key: string]: WorkerInfo;
    };
    threadRot: number;
    connections: any;
    constructor(options?: ServiceOptions);
    loadWorkerRoute: (node: WorkerRoute & GraphNode, routeKey: string) => WorkerInfo;
    workerloader: any;
    addDefaultMessageListener: () => void;
    postMessage: (message: any, target: string, transfer?: Transferable[]) => void;
    addWorker: (options: {
        url?: URL | string | Blob;
        port?: MessagePort;
        _id?: string;
        onmessage?: (ev: any) => void;
        onerror?: (ev: any) => void;
    }) => WorkerInfo;
    open: (options: {
        url?: URL | string | Blob;
        port?: MessagePort;
        _id?: string;
        onmessage?: (ev: any) => void;
        onerror?: (ev: any) => void;
    }) => WorkerInfo;
    close: () => void;
    toObjectURL: (scriptTemplate: string) => string;
    getTransferable(message: any): any;
    transmit: (message: ServiceMessage | any, worker?: Worker | MessagePort | string, transfer?: StructuredSerializeOptions) => any;
    terminate: (worker: Worker | MessagePort | string | WorkerInfo) => boolean;
    establishMessageChannel: (worker: Worker | string | MessagePort | WorkerInfo, worker2?: Worker | string | MessagePort | WorkerInfo) => string | false;
    request: (message: ServiceMessage | any, workerId: string, transfer?: any, method?: string) => Promise<unknown>;
    runRequest: (message: ServiceMessage | any, worker: undefined | string | Worker | MessagePort, callbackId: string | number) => any;
    subscribeWorker: (route: string, worker: WorkerInfo | Worker | string | MessagePort, args?: any[], key?: string, subInput?: boolean, blocking?: boolean) => number;
    subscribeToWorker: (route: string, workerId: string, callback?: string | ((res: any) => void), args?: any[], key?: string, subInput?: boolean, blocking?: boolean) => Promise<any>;
    triggerSubscription: (route: string, workerId: string, result: any) => Promise<boolean>;
    pipeWorkers: (sourceWorker: WorkerInfo | string, listenerWorker: WorkerInfo | string, sourceRoute: string, listenerRoute: string, portId?: string, args?: any[], key?: any, subInput?: boolean, blocking?: boolean) => Promise<number>;
    unpipeWorkers: (sourceRoute: string, sourceWorker: WorkerInfo | string, sub?: number) => Promise<any>;
}
