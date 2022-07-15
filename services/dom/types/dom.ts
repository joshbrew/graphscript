import { DOMElement } from "../DOMElement"
import { GraphNode, GraphNodeProperties } from "../../../Graph"

export type DOMElementProps = {
    tagName?:string, //custom node tag name, requires a '-' in it 
    template?:string|((props:any)=>string), //string or function that passes the modifiable props on the element (the graph node properties)
    parentNode?:string|HTMLElement,
    styles?:string, //will use the shadow DOM automatically in this case
    oncreate?:(props:any,self:DOMElement)=>void,
    onresize?:(props:any,self:DOMElement)=>void,
    ondelete?:(props:any,self:DOMElement)=>void,
    onchanged?:(props:any,self:DOMElement)=>void,
    renderonchanged?:boolean|((props:any,self:DOMElement)=>void),
    id?:string
}

export type DOMElementInfo = { //returned from addComponent
    element:DOMElement,
    class:any, //the customized DOMElement class
    node:GraphNode,
    divs:any[]
} & DOMElementProps

export type ComponentOptions = {
    tagName?:string,
    template?:string|((props:any)=>string), //string or function that passes the modifiable props on the element (the graph node properties)
    parentNode?:string|HTMLElement,
    styles?:string, //will use the shadow DOM automatically in this case
    oncreate?:(props:any,self:DOMElement)=>void, //use self.querySelector to select nested elements without worrying about the rest of the page.
    onresize?:(props:any,self:DOMElement)=>void,
    ondelete?:(props:any,self:DOMElement)=>void,
    onchanged?:(props:any,self:DOMElement)=>void,
    renderonchanged?:boolean|((props:any,self:DOMElement)=>void), //set true to auto refresh the element render (it re-appends a new fragment in its container)
    props?:{[key:string]:any},
    id?:string
} & GraphNodeProperties