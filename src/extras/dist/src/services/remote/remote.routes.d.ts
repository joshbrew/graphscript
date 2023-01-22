import { GraphNodeProperties } from "../../core/Graph";
export declare const nodeTemplates: {};
export declare const remoteGraphRoutes: {
    transferNode: (properties: string | Function | (GraphNodeProperties & {
        __methods?: {
            [key: string]: string | Function;
        };
    }), connection: any | Worker | WebSocket, name?: string) => any;
    setNode: (properties: string | (() => any) | (GraphNodeProperties & {
        __methods?: {
            [key: string]: string | Function;
        };
    })) => any;
    proxyRemoteNode: (name: string, connection: any) => Promise<unknown>;
    makeNodeTransferrable: (properties: GraphNodeProperties, name?: string) => {};
    setTemplate: (properties: string | (() => any) | (GraphNodeProperties & {
        __methods?: {
            [key: string]: string | Function;
        };
    }), name?: string) => string | false;
    loadFromTemplate: (templateName: string, name?: string, properties?: {
        [key: string]: any;
    }) => any;
    setMethod: (route: string, fn: string | (() => any), methodKey?: string) => boolean;
    assignNode: (nodeTag: string, source: {
        [key: string]: any;
    }) => void;
    getNodeProperties: (nodeTag: string) => {};
    transferClass: (classObj: any, connection: any | Worker | WebSocket, className?: string) => any;
    receiveClass: (stringified: string, className?: string) => boolean;
    transferFunction: (fn: Function, connection: any | Worker | WebSocket, fnName?: string) => any;
    setGlobal: (key: string, value: any) => boolean;
    assignGlobalObject: (target: string, source: {
        [key: string]: any;
    }) => boolean;
    setValue: (key: string, value: any) => boolean;
    assignObject: (target: string, source: {
        [key: string]: any;
    }) => boolean;
    setGlobalFunction: (fn: any, fnName?: string) => boolean;
    setGraphFunction: (fn: any, fnName?: string) => boolean;
};
