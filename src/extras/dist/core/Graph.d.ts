import { EventHandler } from "./EventHandler";
export declare const state: EventHandler;
export type GraphNodeProperties = {
    __props?: Function | GraphNodeProperties;
    __operator?: ((...args: any[]) => any) | string;
    __children?: {
        [key: string]: GraphNodeProperties;
    };
    __listeners?: {
        [key: string]: true | string | ((result: any) => void) | {
            __callback: string | ((result: any) => void) | true;
            subInput?: boolean;
            [key: string]: any;
        };
    } | {
        [key: string]: ((result: any) => void) | true | string;
    };
    __onconnected?: ((node: any) => void | ((node: any) => void)[]);
    __ondisconnected?: ((node: any) => void | ((node: any) => void)[]);
    __node?: {
        tag?: string;
        state?: EventHandler;
        [key: string]: any;
    };
    __args?: any[];
    [key: string]: any;
};
export type Loader = (node: GraphNode, parent: Graph | GraphNode, graph: Graph, roots: any, properties: GraphNodeProperties, key: string) => void;
export type GraphOptions = {
    roots?: {
        [key: string]: any;
    };
    loaders?: {
        [key: string]: Loader | {
            init?: Loader;
            connected?: (node: any) => void;
            disconnected?: (node: any) => void;
        };
    };
    state?: EventHandler;
    mapGraphs?: false;
    [key: string]: any;
};
export declare class GraphNode {
    __node: {
        tag: string;
        unique: string;
        state: EventHandler;
        [key: string]: any;
    };
    __children?: {
        [key: string]: GraphNode;
    };
    __parent?: Graph | GraphNode;
    __operator?: any;
    __listeners?: any;
    __props?: any;
    __args: any[];
    [key: string]: any;
    constructor(properties: any, parent?: {
        [key: string]: any;
    }, graph?: Graph);
    __setProperties: (properties: any, parent: any, graph: any) => void;
    __subscribe: (callback: string | GraphNode | ((res: any) => void), key?: string, subInput?: boolean, bound?: string, target?: string) => any;
    __unsubscribe: (sub?: number, key?: string, unsubInput?: boolean) => boolean;
    __setOperator: (fn: (...args: any[]) => any) => any;
    __addLocalState: (props?: {
        [key: string]: any;
    }, key?: string) => void;
    __proxyObject: (obj: any) => void;
    __addOnconnected(callback: (node: any) => void): void;
    __addOndisconnected(callback: (node: any) => void): void;
    __callConnected(node?: this): void;
    __callDisconnected(node?: this): void;
}
export declare class Graph {
    [key: string]: any;
    __node: {
        tag: string;
        unique: string;
        state: EventHandler;
        nodes: Map<string, GraphNode | any>;
        roots: {
            [key: string]: any;
        };
        mapGraphs?: boolean;
        [key: string]: any;
    };
    constructor(options?: GraphOptions);
    init: (options?: GraphOptions) => void;
    load: (roots: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
    setLoaders: (loaders: {
        [key: string]: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, roots: any, props: any, key: string) => void;
    }, replace?: boolean) => any;
    runLoaders: (node: any, parent: any, properties: any, key: any) => void;
    add: (properties: any, parent?: GraphNode | string) => GraphNode | undefined;
    recursiveSet: (t: any, parent: any, listeners: any, origin: any) => any;
    remove: (node: GraphNode | string, clearListeners?: boolean) => string | GraphNode;
    run: (node: string | GraphNode, ...args: any[]) => any;
    setListeners: (listeners: {
        [key: string]: {
            [key: string]: any;
        };
    }) => void;
    clearListeners: (node: GraphNode | string, listener?: string) => void;
    get: (tag: string) => any;
    set: (tag: string, node: GraphNode) => Map<string, any>;
    delete: (tag: string) => boolean;
    getProps: (node: GraphNode | string, getInitial?: boolean) => void;
    subscribe: (nodeEvent: GraphNode | string, onEvent: string | GraphNode | ((...res: any) => void), args?: any[], key?: string | undefined, subInput?: boolean, target?: string | GraphNode, bound?: string) => any;
    unsubscribe: (node: GraphNode | string, sub?: number, key?: string, subInput?: boolean) => any;
    setState: (update: {
        [key: string]: any;
    }) => void;
}
export declare function getAllProperties(obj: any): any[];
export declare function instanceObject(obj: any): any;
export declare function isNativeClass(thing: any): boolean;
export declare function isFunction(x: any): "function" | "class" | "async" | "arrow" | "";
export declare const wrapArgs: (callback: any, argOrder: any, graph: any) => any;
