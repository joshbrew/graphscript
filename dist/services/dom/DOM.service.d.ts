import { DOMElement } from "./DOMElement";
import { Graph, GraphNode } from '../../Graph';
import { Service, ServiceOptions } from "../Service";
import { CompleteOptions, ElementInfo, ElementProps, ComponentProps, ComponentInfo, CanvasElementProps, CanvasOptions, CanvasElementInfo } from './types/index';
export declare type DOMRouteProp = ElementProps | ComponentProps | CanvasElementProps;
export declare class DOMService extends Service {
    loadDefaultRoutes: boolean;
    keepState: boolean;
    parentNode: HTMLElement;
    name: string;
    interpreters: {
        md: (template: string, options: ComponentProps) => void;
        jsx: (template: any, options: ComponentProps) => void;
    };
    domloader: {
        dom: (r: DOMRouteProp & GraphNode, parent: GraphNode & DOMRouteProp, graph: Graph, tree: any, props: any, key: string) => void;
    };
    constructor(options?: ServiceOptions, parentNode?: HTMLElement, interpreters?: {
        [key: string]: (template: string, options: ComponentProps) => void;
    });
    elements: {
        [key: string]: ElementInfo;
    };
    components: {
        [key: string]: ComponentInfo | CanvasElementInfo;
    };
    templates: {
        [key: string]: ComponentProps | CanvasElementProps;
    };
    addElement: (options: ElementProps, generateChildElementNodes?: boolean) => ElementInfo;
    createElement: (options: ElementProps) => HTMLElement;
    updateOptions: (options: any, element: any) => CompleteOptions;
    resolveParentNode: (elm: any, parentNode: any, options: any, oncreate?: any) => void;
    resolveGraphNode: (element: any, options: any) => GraphNode & DOMRouteProp;
    addComponent: (options: ComponentProps, generateChildElementNodes?: boolean) => ComponentInfo;
    addCanvasComponent: (options: CanvasOptions) => CanvasElementInfo;
    terminate: (element: string | DOMElement | HTMLElement | ComponentInfo | CanvasElementInfo) => boolean;
}
/**
 * Usage
 */
