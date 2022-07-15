/// <reference types="node" />
import { DOMElement } from "./DOMElement";
import { Graph, GraphNode, GraphNodeProperties, OperatorType } from '../../Graph';
import { RouteProp, Routes, Service, ServiceMessage } from "../Service";
export declare type ElementProps = {
    tagName?: string;
    element?: HTMLElement;
    style?: CSSStyleDeclaration;
    parentNode?: string | HTMLElement;
    id?: string;
};
export declare type ElementInfo = {
    element: HTMLElement;
    node: GraphNode;
    parentNode: HTMLElement;
    divs: any[];
};
export declare type DOMElementProps = {
    tagName?: string;
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
    class: any;
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
    draw: ((props: any, self: DOMElement) => void);
    canvas: HTMLCanvasElement;
    context: RenderingContext;
    animating: boolean;
    animation: any;
    width?: string;
    height?: string;
    style?: string;
    class: any;
    node: GraphNode;
} & DOMElementProps;
export declare type DOMRouteProp = (ElementProps & GraphNodeProperties) | (DOMElementProps & GraphNodeProperties) | (CanvasElementProps & GraphNodeProperties);
export declare type DOMRoutes = {
    [key: string]: GraphNode | GraphNodeProperties | OperatorType | ((...args: any[]) => any | void) | ({
        aliases?: string[];
    } & GraphNodeProperties) | RouteProp | DOMRouteProp;
};
export declare class DOMService extends Graph {
    routes: DOMRoutes;
    firstLoad: boolean;
    name: string;
    keepState: boolean;
    constructor(routes?: DOMRoutes, name?: string, props?: {
        [key: string]: any;
    });
    elements: {
        [key: string]: ElementInfo;
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
    } & GraphNodeProperties, generateChildElementNodes?: boolean) => ElementInfo;
    addComponent: (options: {
        tagName?: string;
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
    } & GraphNodeProperties, generateChildElementNodes?: boolean) => DOMElementInfo;
    addCanvasComponent: (options: {
        tagName?: string;
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
    } & GraphNodeProperties) => CanvasElementInfo;
    load: (routes?: any, enumRoutes?: boolean) => DOMRoutes;
    unload: (routes?: Service | Routes | any) => DOMRoutes;
    handleMethod: (route: string, method: string, args?: any, origin?: string | GraphNode | Graph | Service) => any;
    handleServiceMessage(message: ServiceMessage): any;
    handleGraphNodeCall(route: string | GraphNode, args: any, origin?: string | GraphNode | Graph): any;
    transmit: (...args: any[]) => any | void;
    receive: (...args: any[]) => any | void;
    pipe: (source: GraphNode | string, destination: string, endpoint?: string | any, origin?: string, method?: string, callback?: (res: any) => any | void) => number;
    pipeOnce: (source: GraphNode | string, destination: string, endpoint?: string | any, origin?: string, method?: string, callback?: (res: any) => any | void) => void;
    terminate: (element: string | DOMElement | HTMLElement | DOMElementInfo | CanvasElementInfo) => boolean;
    isTypedArray(x: any): boolean;
    recursivelyAssign: (target: any, obj: any) => any;
    defaultRoutes: DOMRoutes;
}
/**
 * Usage
 */
