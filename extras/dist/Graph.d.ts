import { EventHandler } from "./services/EventHandler";
export declare const state: EventHandler;
export declare type GraphNodeProperties = {
    __props?: Function | GraphNodeProperties;
    __operator?: ((...args: any[]) => any) | string;
    __children?: {
        [key: string]: GraphNodeProperties;
    };
    __listeners?: {
        [key: string]: ((result: any) => void) | {
            callback: (result: any) => void;
            subInput?: boolean;
            [key: string]: any;
        };
    };
    __onconnected?: ((node: any) => void | ((node: any) => void)[]);
    __ondisconnected?: ((node: any) => void | ((node: any) => void)[]);
    __node?: {
        tag?: string;
        state?: EventHandler;
        inputState?: boolean;
        [key: string]: any;
    };
    [key: string]: any;
};
export declare type GraphOptions = {
    tree?: {
        [key: string]: any;
    };
    loaders?: {
        [key: string]: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, tree: any, properties: GraphNodeProperties, key: string) => void;
    };
    state?: EventHandler;
    mapGraphs?: false;
    [key: string]: any;
};
export declare class GraphNode {
    __node: {
        [key: string]: any;
    };
    __children?: any;
    __operator?: any;
    __listeners?: any;
    __props?: any;
    [key: string]: any;
    constructor(properties: any, parent?: {
        [key: string]: any;
    }, graph?: Graph);
    __subscribe: (callback: string | GraphNode | ((res: any) => void), key?: string, subInput?: boolean, bound?: string, target?: string) => any;
    __unsubscribe: (sub?: number, key?: string, subInput?: boolean) => any;
    __setOperator: (fn: (...args: any[]) => any) => any;
    __addLocalState(props?: {
        [key: string]: any;
    }): void;
    __proxyObject: (obj: any) => void;
    __addOnconnected(callback: (node: any) => void): void;
    __addDisconnected(callback: (node: any) => void): void;
    __callConnected(node?: this): void;
    __callDisconnected(node?: this): void;
}
export declare class Graph {
    [key: string]: any;
    __node: {
        tag: string;
        state: EventHandler;
        nodes: Map<string, GraphNode | any>;
        [key: string]: any;
    };
    constructor(options?: GraphOptions);
    init: (options: GraphOptions) => void;
    setTree: (tree: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
    setLoaders: (loaders: {
        [key: string]: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, tree: any, props: any, key: string) => void;
    }, replace?: boolean) => any;
    add: (properties: any, parent?: GraphNode | string) => GraphNode;
    recursiveSet: (t: any, parent: any, listeners: {}, origin: any) => {};
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
    subscribe: (node: GraphNode | string, callback: string | GraphNode | ((res: any) => void), key?: string | undefined, subInput?: boolean, target?: string, bound?: string) => any;
    unsubscribe: (node: GraphNode | string, sub?: number, key?: string, subInput?: boolean) => any;
    setState: (update: {
        [key: string]: any;
    }) => void;
}
export declare function getAllProperties(obj: any): any[];
export declare function instanceObject(obj: any): {};
