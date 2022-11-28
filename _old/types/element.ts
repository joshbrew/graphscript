import { Graph, GraphNode, GraphNodeProperties } from "../../../Graph";
import { CanvasElementProps } from "./canvascomponent";
import { ComponentProps } from "./component";

export type ElementProps = GraphNodeProperties & {
    tagName?:string, //e.g. 'div', 'canvas'
    element?:HTMLElement, //alternatively set an element
    style?:Partial<CSSStyleDeclaration>,
    attributes?:{[key:string]:any}, //specify any attributes/values
    parentNode?:string|HTMLElement,
    onrender?:(element:HTMLElement,info:ElementInfo)=>void,
    onresize?:(ev,element:HTMLElement,info:ElementInfo)=>void,
    ondelete?:(element:HTMLElement,info:ElementInfo)=>void,
    innerText?:string,
    innerHTML?:string,
    id?:string,
    children?:{[key:string]:string|boolean|undefined|GraphNodeProperties|GraphNode|Graph|ComponentProps|ElementProps|CanvasElementProps},
    generateChildElementNodes?:boolean //generate these element info and graphnodes for every node in an element hierarchy
}

export type ElementInfo = { //returned from addElement
    element:HTMLElement,
    node:GraphNode,
    parentNode:HTMLElement,
    divs:any[]
} & ElementProps;

export type ElementOptions = GraphNodeProperties & {
    tagName?:string, //e.g. 'div', 'canvas'
    element?:HTMLElement, //alternatively set an element
    style?:Partial<CSSStyleDeclaration>,
    attributes?:{[key:string]:any}, //specify any attributes/values e.g. innerHTML, onclick,...
    parentNode?:string|HTMLElement,
    onrender?:(element:HTMLElement,info:ElementInfo)=>void,
    onresize?:(ev,element:HTMLElement,info:ElementInfo)=>void,
    onremove?:(element:HTMLElement,info:ElementInfo)=>void,
    innerText?:string,
    innerHTML?:string,
    children?:{[key:string]:string|boolean|undefined|GraphNodeProperties|GraphNode|Graph|ComponentProps|ElementProps|CanvasElementProps},
    id?:string
} 