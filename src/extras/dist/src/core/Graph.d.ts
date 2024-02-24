import { EventHandler } from "./EventHandler";
export declare const state: EventHandler;
export type GraphNodeProperties = {
    __props?: Function | {
        [key: string]: any;
    } | GraphNodeProperties | GraphNode;
    __operator?: ((...args: any[]) => any) | string;
    __children?: {
        [key: string]: any;
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
    __callable?: boolean;
    [key: string]: any;
};
export type Loader = (node: GraphNode, parent: Graph | GraphNode, graph: Graph, roots: any, properties: GraphNodeProperties, key: string) => void;
export type Roots = {
    [key: string]: any;
};
export type GraphOptions = {
    roots?: Roots;
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
export type argObject = {
    __input?: string | ((...args: any[]) => any);
    __callback: string | ((...args: any[]) => any);
    __args?: any[];
    __output?: string | argObject | ((...args: any[]) => any);
};
export type Listener = {
    __callback?: string;
    __args?: (argObject | Function | string)[];
    sub: number;
    node: GraphNode;
    graph: Graph;
    source?: string;
    key?: string;
    target?: string;
    tkey?: string;
    arguments?: Function[];
    subInput?: boolean;
    onchange: Function;
};
export declare class Callable extends Function {
    __bound: Callable;
    __call: ((...args: any[]) => any);
    [key: string]: any;
    constructor();
}
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
    constructor(properties: GraphNodeProperties, parent?: {
        [key: string]: any;
    }, graph?: Graph);
    get __graph(): any;
    set __graph(graph: any);
    __setProperties: (properties: any, parent: any, graph: any) => void;
    __subscribe: (callback: string | GraphNode | ((res: any) => void), key?: string, subInput?: boolean, target?: string, tkey?: string, args?: any[], callbackStr?: string) => any;
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
    }, overwrite?: boolean) => {
        [key: string]: any;
    };
    setLoaders: (loaders: {
        [key: string]: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, roots: any, props: any, key: string) => void;
    }, replace?: boolean) => any;
    runLoaders: (node: any, parent: any, properties: any, key: any) => void;
    add: (properties: any, parent?: GraphNode | string, overwrite?: boolean) => GraphNode;
    recursiveSet: (originCpy: any, parent: any, listeners: any, origin: any, overwrite?: boolean) => any;
    remove: (node: GraphNode | string, clearListeners?: boolean) => string | GraphNode;
    run: (node: string | GraphNode, ...args: any[]) => any;
    /**
     *
     * Listeners are an object where each key is a node tag, and each value is an object specifying callbacks or multiple callback for events on the graph, e.g. function outputs or variable changes.
     * {
     *   [node.__node.tag (or arbitrary)]:{
     *      [node.key (key optional)]:{__callback:string|Function, __args?:[], subInput?:boolean} | Function (bound to main node tag if specified) | string
     *   }
     * }
     *
     * __args can be strings referencing other nodes/methods or values to pass correct inputs into the callback if more than one is required, else the output of the thing listened to is used by default
     */
    setListeners: (listeners: {
        [key: string]: {
            [key: string]: any;
        };
    }) => void;
    clearListeners: (node: GraphNode | string, listener?: string) => void;
    get: (tag: string) => any;
    getByUnique: (unique: string) => any;
    set: (tag: string, node: GraphNode) => Map<string, any>;
    delete: (tag: string) => boolean;
    list: () => string[];
    getListener: (nodeTag: string, key?: string, sub?: number) => Listener;
    getProps: (node: GraphNode | string, getInitial?: boolean) => void;
    subscribe: (nodeEvent: GraphNode | string, onEvent: string | GraphNode | ((...res: any) => void), args?: any[], key?: string | undefined, subInput?: boolean, target?: string | GraphNode, tkey?: string) => number;
    unsubscribe: (node: GraphNode | string, sub?: number, key?: string, subInput?: boolean) => any;
    setState: (update: {
        [key: string]: any;
    }) => void;
}
export declare function getAllProperties(obj: any): any[];
export declare function instanceObject(obj: any): any;
export declare function isNativeClass(thing: any): boolean;
export declare function isFunction(x: any): "function" | "class" | "async" | "arrow" | "";
export declare let getCallbackFromString: (a: any, graph: any) => (...inp: any[]) => any;
export declare const wrapArgs: (callback: any, argOrder: any, graph: any) => {
    __callback: any;
    __args: any[];
};
