export declare function parseFunctionFromText(method?: string): any;
export declare type OperatorType = (//can be async
...args: any) => any | void;
export declare type Tree = {
    [key: string]: //the key becomes the node tag on the graph
    GraphNode | Graph | //for graphs, pass an input object to the operator like so: e.g. to run a node in the graph: node.run({run:[arg1,arg2]})
    GraphNodeProperties | OperatorType | ((...args: any[]) => any | void) | ({
        aliases: string[];
    } & GraphNodeProperties);
};
export declare type GraphNodeProperties = {
    tag?: string;
    operator?: string | OperatorType | ((...args: any[]) => any | void);
    forward?: boolean;
    backward?: boolean;
    children?: {
        [key: string]: string | boolean | undefined | GraphNodeProperties | GraphNode | Graph;
    };
    parent?: GraphNode | Graph | string;
    branch?: {
        [label: string]: {
            if: any | ((output: any) => boolean);
            then: string | ((...operator_result: any[]) => any) | GraphNode;
        };
    };
    tree?: Tree;
    delay?: false | number;
    repeat?: false | number;
    recursive?: false | number;
    reactive?: boolean | ((self: GraphNode) => void) | {
        "self"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "parent"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "children"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "self."?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "parent."?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "children."?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "[tag]."?: (self: GraphNode, prop: any, node: any, key: string) => void;
        [key: string]: (self: GraphNode, prop: any, node: any, key: string) => void;
    };
    frame?: boolean;
    animate?: boolean;
    loop?: false | number;
    animation?: OperatorType;
    looper?: OperatorType;
    oncreate?: (self: GraphNode | any, ...args: any[]) => void;
    ondelete?: (self: GraphNode | any, ...args: any[]) => void;
    DEBUGNODE?: boolean;
    [key: string]: any;
};
export declare class EventHandler {
    pushToState: {};
    data: {};
    triggers: {};
    constructor(data?: {
        [key: string]: any;
    });
    setState: (updateObj: {
        [key: string]: any;
    }) => {};
    subscribeTrigger: (key: string, onchange: (res: any) => void) => number;
    unsubscribeTrigger: (key: string, sub?: number) => boolean;
    subscribeTriggerOnce: (key: string, onchange: (res: any) => void) => void;
}
export declare const state: EventHandler;
/**
 * Creates new instance of a GraphNode
 * The methods of this class can be referenced in the operator after setup for more complex functionality
 *
 * ```typescript
 * const graph = new GraphNode({custom: 1, operator: (input) => console.log(input, self.custom)});
 * ```
 */
declare function addLocalState(props?: any): void;
export declare class GraphNode {
    nodes: Map<any, any>;
    _initial: {
        [key: string]: any;
    };
    _unique: string;
    tag: string;
    parent: GraphNode | Graph;
    children: any;
    graph: Graph;
    state: EventHandler;
    isLooping: boolean;
    isAnimating: boolean;
    looper: any;
    animation: any;
    forward: boolean;
    backward: boolean;
    reactive: boolean | ((self: GraphNode) => void) | {
        "self"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "parent"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "children"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "self.x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "parent.x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "children.x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        "[tag].x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        [key: string]: (self: GraphNode, prop: any, node: any, key: string) => void;
    };
    _events?: EventHandler;
    runSync: boolean;
    firstRun: boolean;
    DEBUGNODE: boolean;
    source: Graph | GraphNode;
    tree: Tree;
    [key: string]: any;
    constructor(properties?: GraphNodeProperties | Graph | OperatorType | ((...args: any[]) => any | void), parent?: GraphNode | Graph | string, graph?: Graph);
    addLocalState: typeof addLocalState;
    operator: OperatorType;
    runOp: (...args: any[]) => any;
    setOperator: (operator: OperatorType | string) => string | OperatorType;
    /**
     * Runs the graph node and passes output to connected nodes
     *
     * ```typescript
     * const res = await node.run(arg1, arg2, arg3);
     * ```
     */
    runAsync: (...args: any[]) => Promise<unknown>;
    transformArgs: (args: any[], self?: GraphNode) => any[];
    isRunSync: () => boolean;
    run: (...args: any[]) => any;
    runParent: (n: GraphNode, ...args: any[]) => Promise<void>;
    runChildren: (n: GraphNode, ...args: any[]) => Promise<void>;
    runBranch: (n: GraphNode, output: any) => Promise<void>;
    runAnimation: (animation?: OperatorType, args?: any[]) => void;
    runLoop: (loop?: OperatorType, args?: any[], timeout?: number) => void;
    setParent: (parent: GraphNode) => void;
    setChildren: (children: GraphNode | GraphNode[]) => void;
    add: (n?: GraphNodeProperties | OperatorType | ((...args: any[]) => any | void)) => GraphNode | GraphNodeProperties;
    append: (n: string | GraphNode, parentNode?: this) => void;
    subscribe: (callback: string | GraphNode | ((res: any) => void), tag?: string) => number;
    unsubscribe: (sub?: number, tag?: string) => boolean;
    subscribeState: (callback: string | GraphNode | ((res: any) => void)) => number;
    addChildren: (children: {
        [key: string]: string | boolean | GraphNode | Graph | GraphNodeProperties;
    }) => void;
    callParent: (...args: any[]) => any;
    callChildren: (...args: any[]) => any;
    getProps: (n?: this, getInitial?: boolean) => {
        tag: string;
        operator: OperatorType;
        graph: Graph;
        children: any;
        parent: GraphNode | Graph;
        forward: boolean;
        backward: any;
        loop: any;
        animate: any;
        frame: any;
        delay: any;
        recursive: any;
        repeat: any;
        branch: any;
        oncreate: any;
        reactive: boolean | ((self: GraphNode) => void) | {
            [key: string]: (self: GraphNode, prop: any, node: any, key: string) => void;
            self?: (self: GraphNode, prop: any, node: any, key: string) => void;
            parent?: (self: GraphNode, prop: any, node: any, key: string) => void;
            children?: (self: GraphNode, prop: any, node: any, key: string) => void;
            "self.x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
            "parent.x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
            "children.x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
            "[tag].x"?: (self: GraphNode, prop: any, node: any, key: string) => void;
        };
        DEBUGNODE: boolean;
    };
    setProps: (props?: GraphNodeProperties) => void;
    remove: (n: string | GraphNode) => void;
    cleanup: () => void;
    removeTree: (n: GraphNode | string) => void;
    checkNodesHaveChildMapped: (n: GraphNode | Graph, child: GraphNode, checked?: {}) => void;
    convertChildrenToNodes: (n?: GraphNode) => any;
    stopLooping: (n?: GraphNode) => void;
    stopAnimating: (n?: GraphNode) => void;
    stopNode: (n?: GraphNode) => void;
    subscribeNode: (n: GraphNode | string) => number;
    print: (n?: string | GraphNode, printChildren?: boolean, nodesPrinted?: any[]) => any;
    reconstruct: (json: string | {
        [x: string]: any;
    }) => GraphNode | GraphNodeProperties;
    setState: (data: {
        [key: string]: any;
    }) => void;
    DEBUGNODES: (debugging?: boolean) => void;
}
export declare class Graph {
    nNodes: number;
    tag: string;
    nodes: Map<any, any>;
    state: EventHandler;
    reactive: boolean | ((_state: {
        [key: string]: any;
    }) => void);
    _initial: any;
    _events?: EventHandler;
    _unique: string;
    tree: Tree;
    [key: string]: any;
    constructor(tree?: Tree, tag?: string, props?: {
        [key: string]: any;
    });
    addLocalState: typeof addLocalState;
    add: (n?: GraphNode | GraphNodeProperties | OperatorType | ((...args: any[]) => any | void)) => GraphNode | GraphNodeProperties;
    setTree: (tree?: Tree) => void;
    get: (tag: string) => any;
    set: (n: GraphNode) => Map<any, any>;
    run: (n: string | GraphNode, ...args: any[]) => any;
    runAsync: (n: string | GraphNode, ...args: any[]) => Promise<unknown>;
    removeTree: (n: string | GraphNode, checked?: any) => void;
    remove: (n: string | GraphNode) => string | GraphNode;
    append: (n: GraphNode, parentNode: GraphNode) => void;
    callParent: (n: GraphNode, ...args: any[]) => Promise<any>;
    callChildren: (n: GraphNode, ...args: any[]) => Promise<any>;
    subscribe: (n: string | GraphNode, callback: string | GraphNode | ((res: any) => void)) => number;
    unsubscribe: (tag: string, sub?: number) => boolean;
    subscribeState: (callback: string | GraphNode | ((res: any) => void)) => number;
    subscribeNode: (inputNode: string | GraphNode, outputNode: GraphNode | string) => number;
    stopNode: (n: string | GraphNode) => void;
    print: (n?: GraphNode, printChildren?: boolean) => any;
    reconstruct: (json: string | {
        [x: string]: any;
    }) => GraphNode | GraphNodeProperties;
    create: (operator: OperatorType, parentNode: GraphNode, props: GraphNodeProperties) => GraphNode;
    setState: (data: {
        [key: string]: any;
    }) => void;
    DEBUGNODES: (debugging?: boolean) => void;
}
export declare function reconstructNode(json: string | {
    [x: string]: any;
}, parentNode: any, graph: any): GraphNode;
export declare function reconstructObject(json?: string | {
    [x: string]: any;
}): any;
export declare const stringifyWithCircularRefs: (obj: any, space?: any) => string;
export declare const stringifyFast: (obj: any, space?: any) => string;
export declare function createNode(operator: OperatorType, parentNode: GraphNode, props: GraphNodeProperties, graph: Graph): GraphNode;
export {};
