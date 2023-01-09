import { GraphNode, GraphNodeProperties, Graph } from '../../core/Graph';
export declare type HTMLNodeProperties = GraphNodeProperties & {
    __props?: HTMLElement;
    __onresize?: (elm: HTMLElement) => void;
    __onremove?: (elm: HTMLElement) => void;
    __onrender?: (elm: HTMLElement) => void;
    tagName?: string;
    parentNode?: string | HTMLElement;
    style?: Partial<CSSStyleDeclaration>;
    __template?: string | ((...args: any[]) => string);
    __renderonchanged?: (elm: HTMLElement) => void;
    useShadow?: boolean;
    __css?: string;
    __element?: string | HTMLElement;
    __attributes?: {
        [key: string]: any;
    };
};
export declare const htmlloader: (node: GraphNode, parent: Graph | GraphNode, graph: Graph, roots: any, properties: GraphNodeProperties, key: string) => void;
