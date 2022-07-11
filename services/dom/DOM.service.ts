import { DOMElement } from "fragelement"; //https://github.com/joshbrew/DOMElement <---- this is the special sauce
import { GraphNode } from '../../Graph';
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
}

export type DOMElementInfo = {
    element:DOMElement,
    node:GraphNode,
    divs?:any[]
} & DOMElementProps

export type CanvasElementProps = {
    draw:((props:any,self:DOMElement)=>string),
    context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent',
    width?:string,
    height?:string,
    style?:string
} & DOMElementProps

export type CanvasElementInfo = {
    element:DOMElement,
    draw:((props:any,self:DOMElement)=>string),
    canvas:HTMLCanvasElement,
    context:RenderingContext,
    animating:boolean,
    animation:any,
    width?:string,
    height?:string,
    style?:string,
    divs?:any[],
    node:GraphNode
} & DOMElementProps

export class DOMService extends Service {

    name='html'
    
    elements:{
        [key:string]:any
    }

    components:{
        [key:string]:DOMElementInfo|CanvasElementInfo
    } = {}

    templates:{ //pass these in as options for quicker iteration
        [key:string]:DOMElementProps|CanvasElementProps
    }

    addElement=(
        options:{
            tagName:string, //e.g. 'div', 'canvas'
            element?:HTMLElement, //alternatively set an element
            style:CSSStyleDeclaration,
            parentNode:string|HTMLElement,
            id?:string
        }
        
    )=>{

        let elm;
        if(options.element) {
            if(typeof options.element === 'string') {
                elm = document.querySelector(options.element); //get first element by tag or id 
                if(!elm) elm = document.getElementById(options.element); 
            }
            else elm = options.element;
        }
        else if (options.tagName) elm = document.createElement(options.tagName);

        if(!elm) return undefined;

        if(options.style) Object.assign(elm.style,options.style);

        if(!options.id) options.id = `element${Math.floor(Math.random()*1000000000000000)}`;
        elm.id = options.id;

        if(typeof options.parentNode === 'string') options.parentNode = document.body;
        if(!options.parentNode) options.parentNode = document.body;
        options.parentNode.appendChild(elm);

        let node = new GraphNode({
            element:elm,   
            operator:(node,origin,props:{[key:string]:any})=>{ 
                if(typeof props === 'object') 
                    for(const key in props) { 
                        if(node.element) {
                            if(typeof node.element[key] === 'function' && typeof props[key] !== 'function')
                                { //attempt to execute a function with arguments
                                    if(Array.isArray(props[key]))
                                        node.element[key](props[key]);
                                    else node.element[key](props[key]);
                                } 
                            else if (key === 'style') { Object.assign(node.element[key],props[key])}
                            else node.element[key] = props[key]; 
                        }
                    }
                    
                return props;
            }
        });

        this.add(node);

        this.elements[options.id] = {element:elm, node, parentNode:options.parentNode};

        return this.elements[options.id];

    }

    //create an element that is tied to a specific node, multiple elements can aggregate
    // with the node
    addComponent=(
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

        options.parentNode.appendChild(elm);  //this instantiates the DOMElement

        this.templates[options.id] = options;

        let divs = elm.querySelectorAll('*');
     
        let node = new GraphNode({
            element:elm,   
            operator:(node,origin,props:{[key:string]:any})=>{ 
                if(typeof props === 'object') 
                    for(const key in props) { 
                        if(node.element) {
                            if(typeof node.element[key] === 'function' && typeof props[key] !== 'function')
                                { //attempt to execute a function with arguments
                                    if(Array.isArray(props[key]))
                                        node.element[key](props[key]);
                                    else node.element[key](props[key]);
                                } 
                            else node.element[key] = props[key]; 
                        }
                    }
                    
                return props;
            }
        });

        this.add(node);

        this.components[options.id] = {
            element:elm,
            node,
            divs,
            ...options
        };

        return this.components[options.id];
    }

    //create a canvas with a draw loop that can respond to props
    addCanvasComponent=(
        options:{
            context:'2d'|'webgl'|'webgl2'|'bitmaprenderer'|'experimental-webgl'|'xrpresent', //
            draw:((props:any,self:DOMElement)=>void), //string or function that passes the modifiable props on the element (the graph node properties)
            width?:string, //e.g. '300px'
            height?:string, //e.g. '300px'
            style?:CSSStyleDeclaration, //canvas inline style string
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
        elm.template+=` ></canvas>`;

        if(options.oncreate) elm.oncreate = options.oncreate;
        if(options.onresize) elm.onresize = options.onresize;
        if(options.ondelete) elm.ondelete = options.ondelete;
        if(options.onchanged) elm.onchanged = options.onchanged;
        if(options.renderonchanged) elm.renderonchanged = options.renderonchanged;

        if(!options.id) options.id = `element${Math.floor(Math.random()*1000000000000000)}`

        if(typeof options.parentNode === 'string') options.parentNode = document.body;
        if(!options.parentNode) options.parentNode = document.body;
        
        options.parentNode.appendChild(elm); //this instantiates the DOMElement

        let animation = () => { //default animation
            if((this.components[options.id as string] as CanvasElementInfo)?.animating) {
                (this.components[options.id as string] as CanvasElementInfo).draw(this.components[options.id as string].element.props,this.components[options.id as string].element);
                requestAnimationFrame(animation);
            }
        }

        this.templates[options.id] = options;

        let divs = elm.querySelectorAll('*');
                
        let node = new GraphNode({
            element:elm,   
            operator:(node,origin,props:{[key:string]:any})=>{ 
                if(typeof props === 'object') 
                    for(const key in props) { 
                        if(node.element) {
                            if(typeof node.element[key] === 'function' && typeof props[key] !== 'function')
                                { //attempt to execute a function with arguments
                                    if(Array.isArray(props[key]))
                                        node.element[key](props[key]);
                                    else node.element[key](props[key]);
                                } 
                            else node.element[key] = props[key]; 
                        }
                    }
                return props;
            }
        });

        this.add(node);

        let canvas = elm.querySelector('canvas');
        if(options.style) Object.assign(canvas.style,options.style); //assign the style object

        let context = (canvas as HTMLCanvasElement).getContext(options.context);

        this.components[options.id] = {
            element:elm,
            template:elm.template,
            canvas,
            node,
            divs,
            ...options
        };

        (this.components[options.id] as CanvasElementInfo).context = context;
        elm.canvas = canvas; //make sure everything is accessible;
        elm.context = context; 
        node.canvas = canvas; //make sure everything is accessible;
        node.context = context;

        node.runAnimation(animation); //update the animation by calling this function again or setting node.animation manually

        return this.components[options.id];

    }

    terminate=(element:string|DOMElement|HTMLElement|DOMElementInfo|CanvasElementInfo)=>{
        if(typeof element === 'object') {
            if((element as CanvasElementInfo).animating)
               (element as CanvasElementInfo).animating = false;

            if((element as DOMElementInfo|CanvasElementInfo).element) element = (element as DOMElementInfo|CanvasElementInfo).element;
         }
        else if(typeof element === 'string' && this.components[element]) {
            if((this.components[element] as CanvasElementInfo).node.isAnimating)
                (this.components[element] as CanvasElementInfo).node.stopNode();
            element = this.components[element].element;
            delete this.components[element]
        }
        else if(typeof element === 'string' && this.elements[element]) {
            element = this.elements[element].element;
            delete this.elements[element]
        }
        
        if(this.nodes.get(element.id)) {
            this.removeTree(element.id);
        }

        if(element instanceof DOMElement)
            element.delete(); //will trigger the ondelete callback
        else if ((element as HTMLElement)?.parentNode) {
            (element as any).parentNode.removeChild(element);
        }

        return true;
    }

    routes:Routes = {
        addElement:this.addElement,
        addComponent:this.addComponent,
        addCanvasComponent:this.addCanvasComponent,
        terminate:this.terminate
    }
}

/**
 * Usage
 */

// import {Router} from '../../routers/Router'

// let router = new Router([
//     DOMService
// ]);

// let elem = router.html.addElement(
// {
//     tagName:'div', //for an existing element, just pass the element object e.g. document.getElementById('testdiv')
//     style:{backgroundColor:'black', width:'100px', height:'100px' },
//     parentNode:document.body,
//     id:'testdiv'
// }
// ); //this adds the element and creates a node that allows you to modify the HTMLElement properties or run functions e.g. click()

// let node = elem.node;
// let div = elem.element; //or node.element 

// setTimeout(()=>{
//     node.run('testdiv',{style:{backgroundColor:'red'}}) //now we can modify properties on the element via node trees, function names can be called to pass an argument or array of arguments (wrap arrays in an array if its a single argument requiring an array)
//     setTimeout(()=>{
//         router.html.run('testdiv',{style:{backgroundColor:'black'}}) //equivalent call via the service stack
//     },1000);
// },1000);


// let comp = router.html.addComponent({
//     template:` 
//         <div>
//             <button>Hello World!</button>
//         </div>
//     `, //or load an html file (if bundling)
//     parentNode:document.body,
//     styles:`
//         div {
//             background-color:black;
//             width:100px;
//             height:100px;
//         }

//         button {
//             background-color: green;
//             color: red;
//         }
//     `, //or load a css file (if bundling, scss also supported natively in esbuild)
//     oncreate:(props:any,self:DOMElement) => { 
//         let button = self.querySelector('button');
//         button.onclick = (ev) => { alert('Hello World!'); }
//     }
// });

// let ccomp = router.html.addCanvasComponent({
//     context:'2d',
//     draw:(props:any,self:DOMElement)=>{
//         let canvas = self.canvas as HTMLCanvasElement;
//         let context = self.context as CanvasRenderingContext2D;

//         context.clearRect(0,0,canvas.width,canvas.height);

//         context.fillStyle = `rgb(0,0,${Math.sin(performance.now()*0.001)*255})`;
//         context.fillRect(0,0,canvas.width,canvas.height);
//     },
//     width:'300px',
//     height:'300px',
//     style:{width:'300px', height:'300px'}
// });