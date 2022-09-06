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
        [key: string]: {
            subprocess: string | {
                name: string;
                structs: {};
                oncreate: string | ((ctx: SubprocessContext) => void);
                ondata: string | ((context: any, data: any) => {
                    [key: string]: any;
                });
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
                portId: string;
                route: string;
                otherArgs: any[];
            };
            worker?: WorkerInfo;
            url?: any;
        };
    }, service?: WorkerService) => {
        [key: string]: {
            subprocess: string | {
                name: string;
                structs: {};
                oncreate: string | ((ctx: SubprocessContext) => void);
                ondata: string | ((context: any, data: any) => {
                    [key: string]: any;
                });
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
                portId: string;
                route: string;
                otherArgs: any[];
            };
            worker?: WorkerInfo;
            url?: any;
        };
    };
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
};
