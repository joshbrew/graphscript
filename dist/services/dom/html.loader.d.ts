import { GraphNode, GraphNodeProperties, Graph } from '../../Graph';
export declare type HTMLNodeProperties = GraphNodeProperties & {
    __props?: HTMLElement;
    __onresize?: (elm: HTMLElement) => void;
    __onremove?: (elm: HTMLElement) => void;
    __onrender?: (elm: HTMLElement) => void;
    tagName?: string;
    __template?: string;
    __renderonchanged?: (elm: HTMLElement) => void;
    useShadow?: boolean;
    __css?: string;
    __element?: string | HTMLElement;
    __attributes?: {
        [key: string]: any;
    };
};
export declare const htmlloader: (node: GraphNode, parent: GraphNode | Graph, graph: Graph, tree: any, properties: GraphNodeProperties, key: string) => void;