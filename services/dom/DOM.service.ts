import { DOMElement } from "fragelement"; //https://github.com/joshbrew/DOMElement <---- this is the special sauce
import { GraphNode, Graph } from '../../Graph';
import { Routes, Service } from "../Service";

export type DOMElementProps = {
    template?:string|((props:any)=>string), //string or function that passes the modifiable props on the element (the graph node properties)
    parentNode?:string|HTMLElement,
    styles?:string, //will use the shadow DOM automatically in this case
    oncreate?:(props:any,self:DOMElement)=>void,
    onresize?:(props:any,self:DOMElement)=>void,
    ondelete?:(props:any,self:DOMElement)=>void,
    onchanged?:(props:any,self:DOMElement)=>void,
    renderonchanged?:boolean|((props:any,self:DOMElement)=>void),
    route?:string|GraphNode,
    divs?:any[]
}

export type DOMElementInfo = {
    element:DOMElement,
    node:GraphNode
} & DOMElementProps

export type CanvasElementProps = {
    draw:((props:any,self:DOMElement)=>string),
    context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent',
    width?:string,
    height?:string,
    style?:string,
    divs?:any[]
} & DOMElementProps

export type CanvasElementInfo = {
    element:DOMElement,
    context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent',
    animating:boolean,
    animation:any,
    node:GraphNode
} & CanvasElementProps

export class DOMService extends Service {
    
    elements:{
        [key:string]:any
    }

    components:{
        [key:string]:DOMElementInfo|CanvasElementInfo
    } = {}

    templates:{ //pass these in as options for quicker iteration
        [key:string]:DOMElementProps|CanvasElementProps
    }

    routeElement=(
        tagName:string, //e.g. 'div', 'canvas'
        styles:CSSStyleDeclaration,
        parentNode:string|HTMLElement,
        id?:string
    )=>{
        let elm = document.createElement(tagName);
        Object.assign(elm.style,styles);

        if(!id) id = `element${Math.floor(Math.random()*1000000000000000)}`;
        elm.id = id;

        if(typeof parentNode === 'string') parentNode = document.body;
        if(!parentNode) parentNode = document.body;
        parentNode.appendChild(elm);

        let node = new GraphNode({
            element:elm,   
            operator:(node,origin,props:{[key:string]:any})=>{ 
                if(typeof props === 'object') 
                    for(const key in props) { 
                        if(node.element) node.element[key] = props[key]; 
                    }
                }
        });

        this.elements[id] = {element:elm, node, parentNode};

        return node;

    }

    //create an element that is tied to a specific node, multiple elements can aggregate
    // with the node
    routeComponent=(
        options:{
            template:string|((props:any)=>string), //string or function that passes the modifiable props on the element (the graph node properties)
            parentNode?:string|HTMLElement,
            styles?:string, //will use the shadow DOM automatically in this case
            oncreate?:(props:any,self:DOMElement)=>void,
            onresize?:(props:any,self:DOMElement)=>void,
            ondelete?:(props:any,self:DOMElement)=>void,
            onchanged?:(props:any,self:DOMElement)=>void,
            renderonchanged?:boolean|((props:any,self:DOMElement)=>void), //set true to auto refresh the element render (it re-appends a new fragment in its container)
            props?:{[key:string]:any},
            id?:string
        }
    )=>{
        

        let elm = new DOMElement();
        if(options.props) elm.props = options.props;
        if(options.template) elm.template = options.template;
        if(options.oncreate) elm.oncreate = options.oncreate;
        if(options.onresize) elm.onresize = options.onresize;
        if(options.ondelete) elm.ondelete = options.ondelete;
        if(options.onchanged) elm.onchanged = options.onchanged;
        if(options.renderonchanged) elm.renderonchanged = options.renderonchanged;

        if(!options.id) options.id = `element${Math.floor(Math.random()*1000000000000000)}`

        if(typeof options.parentNode === 'string') options.parentNode = document.body;
        if(!options.parentNode) options.parentNode = document.body;
        options.parentNode.appendChild(elm);

        this.templates[options.id] = options;

        this.components[options.id].divs = elm.querySelectorAll('*');
     
        let node = new GraphNode({
            element:elm,   
            operator:(node,origin,props:{[key:string]:any})=>{ 
                if(typeof props === 'object') 
                    for(const key in props) { 
                        if(node.element) node.element[key] = props[key]; 
                    }
                }
        });

        this.components[options.id] = {
            element:elm,
            node,
            ...options
        };

        return this.components[options.id];
    }

    //create a canvas with a draw loop that can respond to props
    routeCanvasComponent=(
        options:{
            context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent', //
            draw:((props:any,self:DOMElement)=>string), //string or function that passes the modifiable props on the element (the graph node properties)
            width?:string,
            height?:string,
            style?:string,
            parentNode?:string|HTMLElement,
            styles?:string, //will use the shadow DOM automatically in this case
            oncreate?:(props:any,self:DOMElement)=>void,
            onresize?:(props:any,self:DOMElement)=>void,
            ondelete?:(props:any,self:DOMElement)=>void,
            onchanged?:(props:any,self:DOMElement)=>void,
            renderonchanged?:boolean|((props:any,self:DOMElement)=>void),
            props?:{[key:string]:any}
            id?:string
        }
    ) => {

        let elm = new DOMElement();
        if(options.props) elm.props = options.props;
        elm.template = `<canvas `;
        if(options.width) elm.template += `width="${options.width}"`;
        if(options.height) elm.template += `height="${options.height}"`;
        if(options.style) elm.template += `style="${options.style}"`;
        elm.template+=` ></canvas>`;

        if(options.oncreate) elm.oncreate = options.oncreate;
        if(options.onresize) elm.onresize = options.onresize;
        if(options.ondelete) elm.ondelete = options.ondelete;
        if(options.onchanged) elm.onchanged = options.onchanged;
        if(options.renderonchanged) elm.renderonchanged = options.renderonchanged;

        if(!options.id) options.id = `element${Math.floor(Math.random()*1000000000000000)}`

        if(typeof options.parentNode === 'string') options.parentNode = document.body;
        if(!options.parentNode) options.parentNode = document.body;
        options.parentNode.appendChild(elm);

        let animation = () => {
            if((this.elements[options.id as string] as CanvasElementInfo)?.animating) {
                (this.elements[options.id as string] as CanvasElementInfo).draw(this.elements[options.id as string].route,this.elements[options.id as string].element);
                requestAnimationFrame(animation);
            }
        }

        this.templates[options.id] = options;
                
        let node = new GraphNode({
            element:elm,   
            operator:(node,origin,props:{[key:string]:any})=>{ 
                if(typeof props === 'object') 
                    for(const key in props) { 
                        if(node.element) node.element[key] = props[key]; 
                    }
                }
        });


        this.components[options.id] = {
            element:elm,
            template:elm.template,
            animating:true,
            animation,
            node,
            ...options
        };

        this.components[options.id].divs = elm.querySelectorAll('*'); //get all child divs, this can include other component divs fyi since the scoped stylesheets will apply

        (this.components[options.id] as CanvasElementInfo).animation(); //start the animation loop

        return this.components[options.id];

    }

    terminate=(element:string|DOMElement|HTMLElement|DOMElementInfo|CanvasElementInfo)=>{
        if(typeof element === 'object') {
            if((element as CanvasElementInfo).animating)
               (element as CanvasElementInfo).animating = false;

            if((element as DOMElementInfo|CanvasElementInfo).element) element = (element as DOMElementInfo|CanvasElementInfo).element;
         }
        else if(typeof element === 'string' && this.elements[element]) {
            if((this.elements[element] as CanvasElementInfo).animating)
            (this.elements[element] as CanvasElementInfo).animating = false; //quits the anim
            element = this.elements[element].element;
        }
        
        if(element instanceof DOMElement)
            element.delete(); //will trigger the ondelete callback
        else if ((element as HTMLElement)?.parentNode)
            (element as any).parentNode.removeChild(element);

        return true;
    }

    routes:Routes = {
        routeElement:this.routeElement,
        routeComponent:this.routeComponent,
        routeCanvasComponent:this.routeCanvasComponent,
        terminate:this.terminate
    }
}