import { EventHandler } from "./services/EventHandler";
export declare const state: EventHandler;
export declare type GraphNodeProperties = {
    _node?: {
        tag?: string;
        state?: EventHandler;
        operator?: ((...args: any[]) => any) | string;
        children?: {
            [key: string]: GraphNodeProperties;
        };
        oncreate?: Function | Function[];
        ondelete?: Function | Function[];
        listeners?: {
            [key: string]: ((result: any) => void) | {
                callback: (result: any) => void;
            };
        };
        inputState?: boolean;
        [key: string]: any;
    };
    [key: string]: any;
};
export declare type GraphProperties = {
    tree?: {
        [key: string]: any;
    };
    loaders?: {
        [key: string]: {
            node: GraphNode;
            parent: Graph | GraphNode;
            graph: Graph;
            tree: any;
            properties: GraphNodeProperties;
        };
    };
    state?: EventHandler;
    childrenKey?: string;
    mapGraphs?: false;
    [key: string]: any;
};
export declare type GraphOptions = {
    tree?: {
        [key: string]: any;
    };
    loaders?: {
        [key: string]: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, tree: any, properties: GraphNodeProperties) => void;
    };
    state?: EventHandler;
    childrenKey?: string;
    mapGraphs?: false;
    [key: string]: any;
};
export declare class GraphNode {
    _node: {
        [key: string]: any;
    };
    constructor(properties: any, parent?: {
        [key: string]: any;
    }, graph?: Graph);
    _subscribe: (callback: string | GraphNode | ((res: any) => void), key?: string, subInput?: boolean) => any;
    _subscribeState: (callback: string | GraphNode | ((res: any) => void)) => any;
    _unsubscribe: (sub?: number, key?: string, subInput?: boolean) => any;
    _setOperator: (fn: (...args: any[]) => any) => any;
    _addLocalState(props?: {
        [key: string]: any;
    }): void;
}
export declare class Graph {
    _node: {
        tag: string;
        state: EventHandler;
        nodes: Map<string, GraphNode | any>;
        [key: string]: any;
    };
    constructor(options?: GraphOptions);
    init: (options: GraphOptions) => void;
    setTree: (tree: {
        [key: string]: any;
    }) => void;
    setLoaders: (loaders: {
        [key: string]: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, tree: any, props: any) => void;
    }, replace?: boolean) => any;
    add: (properties: any, parent?: GraphNode | string) => GraphNode;
    recursiveSet: (t: any, parent: any, listeners?: {}) => {};
    remove: (node: GraphNode | string, clearListeners?: boolean) => string | GraphNode;
    removeTree: (tree: any) => void;
    run: (node: string | GraphNode, ...args: any[]) => any;
    setListeners: (listeners: {
        [key: string]: {
            [key: string]: any;
        };
    }) => void;
    clearListeners: (node: GraphNode | string, listener?: string) => void;
    get: (tag: any) => any;
    set: (tag: any, node: any) => void;
    getProps: (node: GraphNode | string, getInitial?: boolean) => void;
    subscribe: (node: GraphNode | string, key: string | undefined, callback: string | GraphNode | ((res: any) => void), subInput?: boolean) => any;
    unsubscribe: (node: GraphNode | string, key?: string, sub?: number, subInput?: boolean) => any;
    setState: (update: {
        [key: string]: any;
    }) => void;
}
