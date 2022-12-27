/// <reference types="node" />
import { Graph, GraphNode, GraphNodeProperties, OperatorType } from "../Graph";
/**
 *
 * A service extends acyclic graph to enhance networking operations and aggregate for our microservices
 *
 */
export declare type RouteProp = {
    get?: ((...args: any) => any | void);
    post?: OperatorType | ((...args: any[]) => any | void);
    put?: (...args: any) => any | void;
    head?: (...args: any) => any | void;
    delete?: (...args: any) => any | void;
    patch?: (...args: any) => any | void;
    options?: (...args: any) => any | void;
    connect?: (...args: any) => any | void;
    trace?: (...args: any) => any | void;
    aliases?: string[];
} & GraphNodeProperties;
export declare type Class = {
    new (...args: any[]): any;
};
export declare type Route = GraphNode | GraphNodeProperties | Graph | Service | OperatorType | ((...args: any[]) => any | void) | ({
    aliases?: string[];
} & GraphNodeProperties) | RouteProp | Class | any;
export declare type Routes = {
    [key: string]: Route;
};
export declare type ServiceMessage = {
    route?: string;
    args?: any;
    method?: string;
    node?: string | GraphNode;
    [key: string]: any;
};
export declare type ServiceOptions = {
    routes?: Routes | Routes[];
    name?: string;
    props?: {
        [key: string]: any;
    };
    loadDefaultRoutes?: boolean;
    includeClassName?: boolean;
    routeFormat?: string;
    customRoutes?: {
        [key: string]: (route: Route, routeKey: string, routes: Routes) => Route | any | void;
    };
    customChildren?: {
        [key: string]: (child: Route, childRouteKey: string, parent: Route, routes: Routes, checked: Routes) => Route | any | void;
    };
    sharedState?: boolean;
    [key: string]: any;
};
export declare type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare class Service extends Graph {
    routes: Routes;
    loadDefaultRoutes: boolean;
    keepState: boolean;
    firstLoad: boolean;
    customRoutes: any;
    customChildren: any;
    constructor(options?: ServiceOptions);
    init: (options?: ServiceOptions) => void;
    load: (routes?: any, includeClassName?: boolean, routeFormat?: string, customRoutes?: ServiceOptions["customRoutes"], customChildren?: ServiceOptions["customChildren"], sharedState?: boolean) => Routes;
    unload: (routes?: Service | Routes | any) => Routes;
    handleMethod: (route: string, method: string, args?: any) => any;
    handleServiceMessage(message: ServiceMessage): any;
    handleGraphNodeCall(route: string | GraphNode, args: any): any;
    transmit: (...args: any[]) => any | void;
    receive: (...args: any[]) => any | void;
    pipe: (source: GraphNode | string, destination: string, endpoint?: string | any, method?: string, callback?: (res: any) => any | void) => number;
    pipeOnce: (source: GraphNode | string, destination: string, endpoint?: string | any, method?: string, callback?: (res: any) => any | void) => void;
    terminate: (...args: any) => void;
    isTypedArray(x: any): boolean;
    recursivelyAssign: (target: any, obj: any) => any;
    spliceTypedArray(arr: TypedArray, start: number, end?: number): TypedArray;
    defaultRoutes: Routes;
}
