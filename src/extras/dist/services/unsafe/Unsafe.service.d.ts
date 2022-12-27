export declare const unsafeRoutes: {
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
