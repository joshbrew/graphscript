import { Graph, GraphNode, GraphNodeProperties } from "../../../Graph";
import { CanvasElementProps } from "./canvascomponent";
import { ComponentProps } from "./component";
export declare type ElementProps = GraphNodeProperties & {
    tagName?: string;
    element?: HTMLElement;
    style?: Partial<CSSStyleDeclaration>;
    attributes?: {
        [key: string]: any;
    };
    parentNode?: string | HTMLElement;
    onrender?: (element: HTMLElement, info: ElementInfo) => void;
    onresize?: (ev: any, element: HTMLElement, info: ElementInfo) => void;
    ondelete?: (element: HTMLElement, info: ElementInfo) => void;
    innerText?: string;
    innerHTML?: string;
    id?: string;
    children?: {
        [key: string]: string | boolean | undefined | GraphNodeProperties | GraphNode | Graph | ComponentProps | ElementProps | CanvasElementProps;
    };
    generateChildElementNodes?: boolean;
};
export declare type ElementInfo = {
    element: HTMLElement;
    node: GraphNode;
    parentNode: HTMLElement;
    divs: any[];
} & ElementProps;
export declare type ElementOptions = GraphNodeProperties & {
    tagName?: string;
    element?: HTMLElement;
    style?: Partial<CSSStyleDeclaration>;
    attributes?: {
        [key: string]: any;
    };
    parentNode?: string | HTMLElement;
    onrender?: (element: HTMLElement, info: ElementInfo) => void;
    onresize?: (ev: any, element: HTMLElement, info: ElementInfo) => void;
    onremove?: (element: HTMLElement, info: ElementInfo) => void;
    innerText?: string;
    innerHTML?: string;
    children?: {
        [key: string]: string | boolean | undefined | GraphNodeProperties | GraphNode | Graph | ComponentProps | ElementProps | CanvasElementProps;
    };
    id?: string;
};
