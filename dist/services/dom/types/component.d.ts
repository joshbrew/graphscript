import { DOMElement } from "../DOMElement";
import { Graph, GraphNode, GraphNodeProperties } from "../../../Graph";
import { ElementProps } from "./element";
import { CanvasElementProps } from "./canvascomponent";
export declare type ComponentProps = GraphNodeProperties & {
    tagName?: string;
    template?: string | ((self: DOMElement, props: any) => string | HTMLElement) | HTMLElement;
    interpreter?: 'wc' | 'md' | 'jsx';
    parentNode?: string | HTMLElement;
    styles?: string;
    onrender?: (self: DOMElement, info?: ComponentInfo) => void;
    onresize?: (self: DOMElement, info?: ComponentInfo) => void;
    ondelete?: (self: DOMElement, info?: ComponentInfo) => void;
    onchanged?: (props: any) => void;
    renderonchanged?: boolean | ((self: DOMElement, info: ComponentInfo) => void);
    innerText?: string;
    innerHTML?: string;
    id?: string;
    children?: {
        [key: string]: string | boolean | undefined | GraphNodeProperties | GraphNode | Graph | ComponentProps | ElementProps | CanvasElementProps;
    };
    generateChildElementNodes?: boolean;
};
export declare type ComponentInfo = {
    element: DOMElement;
    class: any;
    node: GraphNode;
    divs?: any[];
} & ComponentProps;
export declare type ComponentOptions = GraphNodeProperties & {
    tagName?: string;
    template?: string | ((self: DOMElement, props: any) => string | HTMLElement) | HTMLElement;
    parentNode?: string | HTMLElement;
    styles?: string;
    useShadow?: boolean;
    onrender?: (self: DOMElement, info?: ComponentInfo) => void;
    onresize?: (self: DOMElement, info?: ComponentInfo) => void;
    onremove?: (self: DOMElement, info?: ComponentInfo) => void;
    onchanged?: (props: any) => void;
    renderonchanged?: boolean | ((self: DOMElement, info: ComponentInfo) => void);
    props?: {
        [key: string]: any;
    };
    innerText?: string;
    innerHTML?: string;
    children?: {
        [key: string]: string | boolean | undefined | GraphNodeProperties | GraphNode | Graph | ComponentProps | ElementProps | CanvasElementProps;
    };
    id?: string;
    interpreter?: 'wc' | 'md' | 'jsx';
};
