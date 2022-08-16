import { DOMElement } from "./DOMElement";
import { Graph, GraphNode, GraphNodeProperties, OperatorType } from '../../Graph';
import { RouteProp, Service, ServiceOptions } from "../Service";
import { CompleteOptions } from './types/general';
import { ElementInfo, ElementProps } from './types/element';
import { ComponentProps, ComponentInfo } from './types/component';
import { CanvasElementProps, CanvasOptions, CanvasElementInfo } from './types/canvascomponent';
export declare type DOMRouteProp = ElementProps | ComponentProps | CanvasElementProps;
export declare type DOMServiceRoute = GraphNode | GraphNodeProperties | Graph | OperatorType | ((...args: any[]) => any | void) | ({
    aliases?: string[];
} & GraphNodeProperties) | RouteProp | DOMRouteProp;
export declare type DOMRoutes = {
    [key: string]: DOMServiceRoute;
};
export declare class DOMService extends Service {
    loadDefaultRoutes: boolean;
    keepState: boolean;
    parentNode: HTMLElement;
    name: string;
    interpreters: {
        md: (template: string, options: ComponentProps) => void;
        jsx: (template: any, options: ComponentProps) => void;
    };
    customRoutes: ServiceOptions["customRoutes"];
    customChildren: ServiceOptions["customChildren"];
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
    addComponent: (options: ComponentProps, generateChildElementNodes?: boolean) => ComponentInfo;
    addCanvasComponent: (options: CanvasOptions) => CanvasElementInfo;
    terminate: (element: string | DOMElement | HTMLElement | ComponentInfo | CanvasElementInfo) => boolean;
    defaultRoutes: DOMRoutes;
}
/**
 * Usage
 */
