import { DOMElement } from "fragelement";
import { GraphNode } from "../../Graph";
import { Routes, Service } from "../Service";
export declare type DOMElementProps = {
    route: string | GraphNode;
    template?: string | ((props: any) => string);
    parentNode?: string | HTMLElement;
    styles?: string;
    oncreate?: (props: any, self: DOMElement) => void;
    onresize?: (props: any, self: DOMElement) => void;
    ondelete?: (props: any, self: DOMElement) => void;
    onchanged?: (props: any, self: DOMElement) => void;
    renderonchanged?: boolean | ((props: any, self: DOMElement) => void);
};
export declare type DOMElementInfo = {
    element: DOMElement;
} & DOMElementProps;
export declare type CanvasElementProps = {
    draw: ((props: any, self: DOMElement) => string);
    context: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' | 'experimental-webgl' | 'xrpresent';
    width?: string;
    height?: string;
    style?: string;
} & DOMElementProps;
export declare type CanvasElementInfo = {
    element: DOMElement;
    context: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' | 'experimental-webgl' | 'xrpresent';
    animating: boolean;
    animation: any;
} & CanvasElementProps;
export declare class DOMService extends Service {
    elements: {
        [key: string]: DOMElementInfo | CanvasElementInfo;
    };
    templates: {
        [key: string]: DOMElementProps | CanvasElementProps;
    };
    routeElement: (options: {
        route: string | GraphNode;
        template: string | ((props: any) => string);
        parentNode?: string | HTMLElement;
        styles?: string;
        oncreate?: (props: any, self: DOMElement) => void;
        onresize?: (props: any, self: DOMElement) => void;
        ondelete?: (props: any, self: DOMElement) => void;
        onchanged?: (props: any, self: DOMElement) => void;
        renderonchanged?: boolean | ((props: any, self: DOMElement) => void);
        _id?: string;
    }) => false | DOMElementInfo;
    routeCanvas: (options: {
        route: string | GraphNode;
        context: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' | 'experimental-webgl' | 'xrpresent';
        draw: (props: any, self: DOMElement) => string;
        width?: string;
        height?: string;
        style?: string;
        parentNode?: string | HTMLElement;
        styles?: string;
        oncreate?: (props: any, self: DOMElement) => void;
        onresize?: (props: any, self: DOMElement) => void;
        ondelete?: (props: any, self: DOMElement) => void;
        onchanged?: (props: any, self: DOMElement) => void;
        renderonchanged?: boolean | ((props: any, self: DOMElement) => void);
        _id?: string;
    }) => false | DOMElementInfo;
    terminate: (element: string | DOMElement | HTMLElement | DOMElementInfo | CanvasElementInfo) => boolean;
    routes: Routes;
}
