import { WorkerInfo, WorkerService } from './Worker.service';
export declare type Subprocess = (context: SubprocessContext, data: {
    [key: string]: any;
} | any) => {
    [key: string]: any;
} | undefined;
export declare type SubprocessContextProps = {
    ondata: Subprocess;
    oncreate?: (context: SubprocessContext) => void;
    structs?: {
        [key: string]: any;
    };
    [key: string]: any;
};
export declare type SubprocessContext = {
    ondata: Subprocess;
    oncreate?: (context: SubprocessContext) => void;
    run?: (data: {
        [key: string]: any;
    } | any) => any;
    [key: string]: any;
};
export declare type SubprocessWorkerProps = {
    subprocess: string | {
        name: string;
        structs: {};
        oncreate: string | ((ctx: SubprocessContext) => void);
        ondata: string | ((context: any, data: {
            [key: string]: any;
        } | any) => {
            [key: string]: any;
        } | undefined);
        props?: {
            [key: string]: any;
        };
    };
    subscribeRoute: string;
    source?: WorkerInfo;
    route: string;
    init?: string;
    initArgs?: any[];
    otherArgs?: any[];
    callback?: string | ((data: any) => any);
    pipeTo?: {
        worker?: WorkerInfo;
        portId?: string;
        route: string;
        otherArgs?: any[];
        init?: string;
        initArgs?: any[];
    };
    worker?: WorkerInfo;
    url?: any;
    stopped?: boolean;
};
export declare type SubprocessWorkerInfo = {
    sub: number;
    blocking?: boolean;
    stop: () => void;
    start: () => void;
    terminate: () => void;
    setArgs: (args: any[] | {
        [key: string]: any;
    }) => void;
} & SubprocessWorkerProps;
export declare const algorithms: {
    [key: string]: SubprocessContextProps;
};
export declare const loadAlgorithms: (settings: {
    [key: string]: SubprocessContextProps;
}) => {
    [key: string]: SubprocessContextProps;
} & {
    [key: string]: SubprocessContextProps;
};
export declare function createSubprocess(options: SubprocessContextProps, inputs?: {
    [key: string]: any;
}): SubprocessContext;
export declare const subprocessRoutes: {
    loadAlgorithms: (settings: {
        [key: string]: SubprocessContextProps;
    }) => {
        [key: string]: SubprocessContextProps;
    } & {
        [key: string]: SubprocessContextProps;
    };
    initSubprocesses: (subprocesses: {
        [key: string]: SubprocessWorkerProps;
    }, service?: WorkerService) => Promise<{
        [key: string]: SubprocessWorkerInfo;
    }>;
    addSubprocessTemplate: (name: string, structs: {}, oncreate: string | ((ctx: SubprocessContext) => void), ondata: string | ((context: any, data: any) => {
        [key: string]: any;
    }), props?: {
        [key: string]: any;
    }) => boolean;
    updateSubprocess: (structs: {}, _id?: string) => void;
    createSubprocess: (options: SubprocessContextProps | string, inputs?: {
        [key: string]: any;
    }) => any;
    runSubprocess: (data: {
        [key: string]: any;
    }, _id?: string) => any;
    setRoute: (fn: string | (() => any), fnName?: string) => boolean;
    setNode: (fn: string | (() => any), fnName?: string) => boolean;
    setMethod: (route: string, fn: string | (() => any), fnName?: string) => boolean;
    assignRoute: (route: string, source: {
        [key: string]: any;
    }) => void;
    transferClass: (classObj: any, className?: string) => false | {
        route: string;
        args: any[];
    };
    receiveClass: (stringified: string, className?: string) => boolean;
    setGlobal: (key: string, value: any) => boolean;
    assignGlobalObject: (target: string, source: {
        [key: string]: any;
    }) => boolean;
    setValue: (key: string, value: any) => boolean;
    assignObject: (target: string, source: {
        [key: string]: any;
    }) => boolean;
    setGlobalFunction: (fn: any, fnName?: string) => boolean;
    assignFunctionToGlobalObject: (globalObjectName: string, fn: any, fnName: any) => boolean;
    setFunction: (fn: any, fnName?: string) => boolean;
    assignFunctionToObject: (objectName: string, fn: any, fnName: any) => boolean;
};
