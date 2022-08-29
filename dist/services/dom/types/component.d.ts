import { DOMElement } from "../DOMElement";
import { Graph, GraphNode, GraphNodeProperties } from "../../../Graph";
import { ElementProps } from "./element";
import { CanvasElementProps } from "./canvascomponent";
export declare type ComponentProps = GraphNodeProperties & {
    tagName?: string;
    template?: string | ((element: DOMElement, props: any) => string | HTMLElement) | HTMLElement;
    interpreter?: 'wc' | 'md' | 'jsx';
    parentNode?: string | HTMLElement;
    styles?: string;
    onrender?: (element: DOMElement, info?: ComponentInfo) => void;
    onresize?: (element: DOMElement, info?: ComponentInfo) => void;
    ondelete?: (element: DOMElement, info?: ComponentInfo) => void;
    onchanged?: (props: any) => void;
    renderonchanged?: boolean | ((element: DOMElement, info: ComponentInfo) => void);
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
    template?: string | ((element: DOMElement, props: any) => string | HTMLElement) | HTMLElement;
    parentNode?: string | HTMLElement;
    styles?: string;
    useShadow?: boolean;
    onrender?: (element: DOMElement, info?: ComponentInfo) => void;
    onresize?: (element: DOMElement, info?: ComponentInfo) => void;
    onremove?: (element: DOMElement, info?: ComponentInfo) => void;
    onchanged?: (props: any) => void;
    renderonchanged?: boolean | ((element: DOMElement, info: ComponentInfo) => void);
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
