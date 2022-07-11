import { DOMElement } from "fragelement";
import { GraphNode } from '../../Graph';
import { Routes, Service } from "../Service";
export declare type ElementInfo = {
    element: HTMLElement;
    node: GraphNode;
    parentNode: HTMLElement;
    divs: any[];
};
export declare type DOMElementProps = {
    template?: string | ((props: any) => string);
    parentNode?: string | HTMLElement;
    styles?: string;
    oncreate?: (props: any, self: DOMElement) => void;
    onresize?: (props: any, self: DOMElement) => void;
    ondelete?: (props: any, self: DOMElement) => void;
    onchanged?: (props: any, self: DOMElement) => void;
    renderonchanged?: boolean | ((props: any, self: DOMElement) => void);
    id?: string;
};
export declare type DOMElementInfo = {
    element: DOMElement;
    node: GraphNode;
    divs: any[];
} & DOMElementProps;
export declare type CanvasElementProps = {
    draw: ((props: any, self: DOMElement) => string);
    context: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' | 'experimental-webgl' | 'xrpresent';
    width?: string;
    height?: string;
    style?: string;
} & DOMElementProps;
export declare type CanvasElementInfo = {
    element: DOMElement & {
        canvas: HTMLCanvasElement;
        context: RenderingContext;
    };
    draw: ((props: any, self: DOMElement) => string);
    canvas: HTMLCanvasElement;
    context: RenderingContext;
    animating: boolean;
    animation: any;
    width?: string;
    height?: string;
    style?: string;
    node: GraphNode;
} & DOMElementProps;
export declare class DOMService extends Service {
    name: string;
    elements: {
        [key: string]: any;
    };
    components: {
        [key: string]: DOMElementInfo | CanvasElementInfo;
    };
    templates: {
        [key: string]: DOMElementProps | CanvasElementProps;
    };
    addElement: (options: {
        tagName?: string;
        element?: HTMLElement;
        style?: CSSStyleDeclaration;
        parentNode?: string | HTMLElement;
        id?: string;
    }, generateChildElementNodes?: boolean) => any;
    addComponent: (options: {
        template?: string | ((props: any) => string);
        parentNode?: string | HTMLElement;
        styles?: string;
        oncreate?: (props: any, self: DOMElement) => void;
        onresize?: (props: any, self: DOMElement) => void;
        ondelete?: (props: any, self: DOMElement) => void;
        onchanged?: (props: any, self: DOMElement) => void;
        renderonchanged?: boolean | ((props: any, self: DOMElement) => void);
        props?: {
            [key: string]: any;
        };
        id?: string;
    }, generateChildElementNodes?: boolean) => DOMElementInfo | CanvasElementInfo;
    addCanvasComponent: (options: {
        context: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' | 'experimental-webgl' | 'xrpresent';
        draw: (props: any, self: DOMElement) => void;
        width?: string;
        height?: string;
        style?: CSSStyleDeclaration;
        parentNode?: string | HTMLElement;
        styles?: string;
        oncreate?: (props: any, self: DOMElement) => void;
        onresize?: (props: any, self: DOMElement) => void;
        ondelete?: (props: any, self: DOMElement) => void;
        onchanged?: (props: any, self: DOMElement) => void;
        renderonchanged?: boolean | ((props: any, self: DOMElement) => void);
        props?: {
            [key: string]: any;
        };
        id?: string;
    }) => DOMElementInfo | CanvasElementInfo;
    terminate: (element: string | DOMElement | HTMLElement | DOMElementInfo | CanvasElementInfo) => boolean;
    routes: Routes;
}
/**
 * Usage
 */
