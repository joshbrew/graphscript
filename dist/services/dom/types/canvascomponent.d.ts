import { DOMElementProps } from "./component";
import { DOMElement } from "../DOMElement";
import { GraphNode, GraphNodeProperties } from "../../../Graph";
export declare type CanvasElementProps = {
    draw: ((self: DOMElement, info: CanvasElementInfo) => string);
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
    draw: ((self: DOMElement, info: CanvasElementInfo) => void);
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
export declare type CanvasOptions = {
    tagName?: string;
    context: '2d' | 'webgl' | 'webgl2' | 'bitmaprenderer' | 'experimental-webgl' | 'xrpresent';
    draw: ((self: DOMElement, info: CanvasElementInfo) => void);
    width?: string;
    height?: string;
    style?: CSSStyleDeclaration;
    parentNode?: string | HTMLElement;
    styles?: string;
    oncreate?: (self: DOMElement, props: any) => void;
    onresize?: (self: DOMElement, props: any) => void;
    ondelete?: (self: DOMElement, props: any) => void;
    onchanged?: (props: any) => void;
    renderonchanged?: boolean | ((self: DOMElement, props: any) => void);
    props?: {
        [key: string]: any;
    };
    id?: string;
} & GraphNodeProperties;
