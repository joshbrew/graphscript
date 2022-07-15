import { DOMElementProps } from "./component"
import { DOMElement } from "../DOMElement"
import { GraphNode, GraphNodeProperties } from "../../../Graph"

export type CanvasElementProps = {
    draw:((props:any,self:DOMElement)=>string),
    context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent',
    width?:string,
    height?:string,
    style?:string
} & DOMElementProps

export type CanvasElementInfo = { //returned from addCanvasComponent
    element:DOMElement & {canvas:HTMLCanvasElement, context:RenderingContext},
    draw:((props:any,self:DOMElement)=>void),
    canvas:HTMLCanvasElement,
    context:RenderingContext,
    animating:boolean,
    animation:any,
    width?:string,
    height?:string,
    style?:string,
    class:any, //the customized DOMElement class
    node:GraphNode
} & DOMElementProps


export type CanvasOptions = {
    tagName?:string, //custom element tagName, requires a '-' in the tag or it gets added to the end
    context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent', //
    draw:((props:any,self:DOMElement)=>void), //string or function that passes the modifiable props on the element (the graph node properties)
    width?:string, //e.g. '300px'
    height?:string, //e.g. '300px'
    style?:CSSStyleDeclaration, //canvas inline style string
    parentNode?:string|HTMLElement,
    styles?:string, //stylesheet text, goes inside a <style> tag. This will use the shadow DOM automatically in this case
    oncreate?:(self:DOMElement,props:any)=>void,
    onresize?:(self:DOMElement,props:any)=>void,
    ondelete?:(self:DOMElement,props:any)=>void,
    onchanged?:(props:any)=>void,
    renderonchanged?:boolean|((self:DOMElement,props:any)=>void),
    props?:{[key:string]:any}
    id?:string
} & GraphNodeProperties