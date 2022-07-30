import { GraphNode } from "../../Graph";
export declare const unsafeRoutes: {
    setRoute: (self: GraphNode, origin: any, fn: string | (() => any), fnName?: string) => boolean;
    setMethod: (self: GraphNode, origin: any, route: string, fn: string | (() => any), fnName?: string) => boolean;
    assignRoute: (self: GraphNode, origin: any, route: string, source: {
        [key: string]: any;
    }) => void;
    transferClass: (classObj: any, className?: string) => false | {
        route: string;
        args: any[];
    };
    receiveClass: (self: GraphNode, origin: any, stringified: string, className?: string) => boolean;
    setValue: (self: GraphNode, origin: any, key: string, value: any) => boolean;
    assignObject: (self: GraphNode, origin: any, target: string, source: {
        [key: string]: any;
    }) => boolean;
    setFunction: (self: GraphNode, origin: any, fn: any, fnName?: string) => boolean;
    assignFunctionToObject: (self: GraphNode, origin: any, globalObjectName: string, fn: any, fnName: any) => boolean;
};
