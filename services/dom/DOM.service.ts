import { DOMElement } from "./DOMElement"; //https://github.com/joshbrew/DOMElement <---- this is the special sauce
import { Graph, GraphNode, GraphNodeProperties, OperatorType } from '../../Graph';
import { RouteProp, Service, ServiceOptions } from "../Service";

import {CompleteOptions, ElementInfo, ElementProps, ComponentProps, ComponentInfo, CanvasElementProps, CanvasOptions, CanvasElementInfo} from './types/index';

//alternative base service that additioanlly allows 'DOMRoutes' to be loaded which can tie in html and webcomponent blocks


export type DOMRouteProp = 
    ElementProps |
    ComponentProps |
    CanvasElementProps

export type DOMServiceRoute = 
    GraphNode |
    GraphNodeProperties |
    Graph |
    OperatorType |
    ((...args)=>any|void) |
    { aliases?:string[] } & GraphNodeProperties |
    RouteProp | 
    DOMRouteProp


export type DOMRoutes = {
    [key:string]:DOMServiceRoute
}


export class DOMService extends Service {

    //routes denote paths and properties callable across interfaces and inherited by parent services (adding the service name in the 
    // front of the route like 'http/createServer'.
    loadDefaultRoutes = false; //load default routes?
    keepState:boolean = true; //routes that don't trigger the graph on receive can still set state
    parentNode:HTMLElement=document.body; //default parent elements for elements added
    name:string;
    
    interpreters = {
        md:(template:string, options:ComponentProps) => { //https://unpkg.com/markdown-it@latest/dist/markdown-it.min.js 
            //@ts-ignore
            if(typeof markdownit === 'undefined') { //this should synchronously load this script
                document.head.insertAdjacentHTML('beforeend',`
                    <script src='https://unpkg.com/markdown-it@latest/dist/markdown-it.min.js'></script>`
                )
            }

            //@ts-ignore
            let md = globalThis.markdownit(); //window.markdownit.parse() also
            let html = md.render(template);
        
            options.template = html; // new template is the rendered markdown
        },
        jsx:(template:any, options:ComponentProps) => { //https://unpkg.com/react@latest/umd/react.production.min.js and https://unpkg.com/react-dom@latest/umd/react-dom.production.min.js
            if(!options.parentNode) options.parentNode = this.parentNode;
            if(typeof options.parentNode === 'string')  options.parentNode = document.getElementById( options.parentNode);

            //@ts-ignore
            if(typeof ReactDOM === 'undefined') {
                document.head.insertAdjacentHTML('beforeend',`
                    <script src='https://unpkg.com/react@latest/umd/react.production.min.js'></script>
                    <script src='https://unpkg.com/react-dom@latest/umd/react-dom.production.min.js'></script>`
                ); //get the necessary packages
            }

            options.template = '';

            let onrender = options.onrender
            options.onrender = (self: DOMElement, info?: ComponentInfo) => {
                //@ts-ignore
                const modal = ReactDOM.createPortal(template,options.id); //append the react modal to the new web component
                onrender(self,info)
            }
            
        }
    }

    customRoutes:ServiceOptions["customRoutes"] = {
        'dom':(r:DOMServiceRoute|any, route:string, routes:DOMRoutes|any) => {
            // console.log(r)
            if(!(r instanceof GraphNode)) {

                if(r.element?.parentNode?.id && r.graph?.parentNode?.id) {
                    if(r.graph.parentNode.id === r.element.id) {
                        r.parentNode = this.parentNode; //triggers the setter to reparent
                    }
                }
                else {
                    if(r.template) { //assume its a component node
                        if(!r.tag) r.tag = route;
                        this.addComponent(r,r.generateChildElementNodes);
                    }
                    else if(r.context) { //assume its a canvas node
                        if(!r.tag) r.tag = route;
                        this.addCanvasComponent(r);
                    }
                    else if(r.tagName || r.element) { //assume its an element node
                        if(!r.tag) r.tag = route;
                        this.addElement(r,r.generateChildElementNodes);
                    }
                }

            }

            return r;
        }
    }

    customChildren:ServiceOptions["customChildren"] = {
        'dom':(rt:DOMServiceRoute|any, routeKey:string, parent:any, routes:DOMRoutes, checked:DOMRoutes) => {
            //automatically parent children html routes to parent html routes without needing explicit parentNode definitions
            if((parent.tag || parent.id) && (parent.template || parent.context || parent.tagName || parent.element) && (rt.template || rt.context || rt.tagName || rt.element) && !rt.parentNode) {
                if(parent.tag) rt.parentNode = parent.tag; 
                if(parent.id) rt.parentNode = parent.id;
            }
            return rt;
        }
    }

    constructor(
        options?:ServiceOptions,
        parentNode?:HTMLElement,
        interpreters?:{[key:string]:(template:string,options:ComponentProps) => void}
    ) {
            super({props:options?.props,name:options?.name ? options.name : `dom${Math.floor(Math.random()*1000000000000000)}`});
            
            if(options?.parentNode) parentNode = options.parentNode;
            if(typeof parentNode === 'string') parentNode = document.getElementById(parentNode);
            if(parentNode instanceof HTMLElement) this.parentNode = parentNode;

            if(interpreters) {
                Object.assign(this.interpreters,interpreters);
            }

            //console.log('init domservice', options)

            this.init(options);
            
    }
    
    elements:{
        [key:string]:ElementInfo
    } = {}

    components:{
        [key:string]:ComponentInfo|CanvasElementInfo
    } = {}

    templates:{ //pass these in as options for quicker iteration
        [key:string]:ComponentProps|CanvasElementProps
    } = {}



    addElement=(
        options: ElementProps,
        generateChildElementNodes=false      
    )=>{

        let elm:HTMLElement = this.createElement(options);

        if(!options.element) options.element = elm;
        if(!options.operator) options.operator = function (props:{[key:string]:any}){ 
            if(typeof props === 'object') 
                for(const key in props) { 
                    if(this.element) {
                        if(typeof this.element[key] === 'function' && typeof props[key] !== 'function')
                            { //attempt to execute a function with arguments
                                if(Array.isArray(props[key]))
                                this.element[key](...props[key]);
                                else this.element[key](props[key]);
                            } 
                        else if (key === 'style') { Object.assign(this.element[key],props[key])}
                        else this.element[key] = props[key]; 
                    }
                }
                
            return props;
        }


        let node = this.resolveGraphNode(elm, options);
        
        let divs:any[] = Array.from(elm.querySelectorAll('*'));
        if(generateChildElementNodes) { //convert all child divs to additional nodes
            divs = divs.map((d:HTMLElement,i) => this.addElement({element:d}));
        }

        this.elements[options.id] = {element:elm, node, parentNode: (options as CompleteOptions).parentNode, divs};
        
        if(!node.ondelete) node.ondelete = (node) => { 
            elm.remove(); 
            if(options.onremove) options.onremove.call(this.elements[options.id].node, elm, this.elements[options.id]); 
        } //in this case we need to remove the element from the dom via the node and run callbacks here due to elements lacking an 'onremove' event

        if(options.onresize) {
            let onresize = options.onresize;
            options.onresize = (ev) => { onresize.call(this.elements[options.id].node, ev, elm, this.elements[options.id]) };
            window.addEventListener('resize', options.onresize as EventListener);
        }

        //this.resolveParentNode(elm, options, oncreate)

        return this.elements[options.id] as ElementInfo;
    }

    createElement = (options: ElementProps) => {

        let elm: HTMLElement

        if(options.element) {
            if(typeof options.element === 'string') {
                elm = document.querySelector(options.element); //get first element by tag or id 
                if(!elm) elm = document.getElementById(options.element); 
            }
            else elm = options.element;
        }
        else if (options.tagName) elm = document.createElement(options.tagName);
        else if(options.id && document.getElementById(options.id)) elm = document.getElementById(options.id);

        if(!elm) return undefined;
        this.updateOptions(options, elm);

        return elm;
    }

    updateOptions = (options, element): CompleteOptions => {

        if(!options.id && options.tag) options.id = options.tag;
        if(!options.tag && options.id) options.tag = options.id;
        if(!options.id) options.id = `${options.tagName ?? 'element'}${Math.floor(Math.random()*1000000000000000)}`;

        let p = options.parentNode;
        delete options.parentNode;
        Object.defineProperty(options,'parentNode',{
            get:function () { return element.parentNode; },
            set:(v) => { 
                if(element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                //console.log('setting parentnode',v, element);
                this.resolveParentNode(element, v ? v : this.parentNode, options, options.onrender);
             },
             enumerable:true,
             configurable:true
        });
        options.parentNode = p ? p : this.parentNode;
       
        element.id = options.id;
        if(options.style) Object.assign(element.style,options.style);
        if(options.attributes) {
            for (let key in options.attributes) {
                if(typeof options.attributes[key] === 'function') element[key] = (...args) => options.attributes[key](...args); // replace this scope
                else element[key] = options.attributes[key];
            }
        } 
        if (!options.attributes?.innerHTML && options.innerHTML) {
            element.innerHTML = options.innerHTML;
        } else if (!options.attributes?.innerText && options.innerText) {
            element.innerText = options.innerText;
        }
        
        return options;
    }

    resolveParentNode = (elm, parentNode, options, oncreate?) => {
        if(!elm.parentNode) {
            setTimeout(()=>{ //slight delay on appendChild so the graph is up to date after other sync loading calls are finished
                if(typeof parentNode === 'string') parentNode = document.getElementById(parentNode);
                if(parentNode && typeof parentNode === 'object') {
                    // if(options.parentNode.shadowRoot) {
                    //     console.log(options.parentNode.shadowRoot)
                    //     options.parentNode.shadowRoot.appendChild(elm);
                    // } else 
                    parentNode.appendChild(elm);
                }

                if(oncreate) oncreate.call(elm.node, elm, this.elements[options.id]);

                if(elm.node.animation || elm.node.animate) {
                    elm.node.runAnimation();
                }
                if(elm.node.looper || typeof elm.node.loop === 'number' && elm.node.loop) {
                    elm.node.runLoop()
                }   
            },0.01); //small timeout makes sure the elements all load before executing node utilities
        }
    }
    
    resolveGraphNode = (element, options) => {


        let node: GraphNode
        if(this.nodes.get(options.id)?.element?.parentNode?.id === options.parentNode || this.nodes.get(options.id)?.parentNode === options.parentNode) {
            node = this.nodes.get(options.id);
        } else {
            let parentId = options.parentNode instanceof HTMLElement ? options.parentNode?.id : typeof options.parentNode === 'string' ? options.parentNode : undefined;
            let parent;
            if(parentId) parent = this.nodes.get(parentId);
            node = new GraphNode(
                options instanceof Graph ? options : Object.assign({},options),
                parent,
                this
            );
        }

        delete node.parentNode; //give the node a setter as well
        Object.defineProperty(node,'parentNode',{
            get:function () { return element.parentNode; },
            set:(v) => { 
                if(element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.resolveParentNode(element, v ? v : this.parentNode, options, options.onrender);
             },
             enumerable:true,
             configurable:true
        });

        // Use Graph Elements as Parent Nodes
        Object.defineProperty(node, 'element', {
            get: () => element,
            set: (v) => {
                element = v
                node.nodes.forEach(n => {
                    if (node.source?._unique === n.graph?._unique) n.parentNode = element
                })
            }
        })

        node.element = element;
        element.node = node;

        // -------- Bind Functions to GraphNode --------
        const initialOptions = options._initial ?? options
        for (let key in initialOptions) {
            if (typeof initialOptions[key] === 'function') initialOptions[key] = initialOptions[key].bind(node)
            else if (key === 'attributes') {
                for (let key2 in initialOptions.attributes) {
                    if (typeof initialOptions.attributes[key2] === 'function') {
                        initialOptions.attributes[key2] = initialOptions.attributes[key2].bind(node)
                    }
                }
            }
        }

        return node;
    }
    //create an element that is tied to a specific node, multiple elements can aggregate
    // with the node
    addComponent=(
        options: ComponentProps,
        generateChildElementNodes=true
    )=>{
        
        if(options.onrender) {
            let oncreate = options.onrender;
            (options.onrender as any) = (element:DOMElement) => {
                oncreate.call((element as any).node, element, options as ComponentInfo);
            }
        }
        if(options.onresize) {
            let onresize = options.onresize;
            (options.onresize as any) = (element:DOMElement) => {
                onresize.call((element as any).node, element, options as ComponentInfo);
            }
        }
        if(options.onremove) {
            let ondelete = options.onremove;
            (options.onremove as any) = (element:DOMElement) => {
                ondelete.call((element as any).node, self, options as ComponentInfo);
            }
        }
        if(typeof options.renderonchanged === 'function') {
            let renderonchanged = options.renderonchanged;
            (options.renderonchanged as any) = (element:DOMElement) => {
                renderonchanged.call((element as any).node, element, options as ComponentInfo);
            }
        }

        if(options.interpreter && options.interpreter !== 'wc') {
            this.interpreters[options.interpreter](options.template as string, options);
        }

        class CustomElement extends DOMElement {
            props = options.props;
            styles = options.styles;
            useShadow = options.useShadow;
            template = options.template as any;
            oncreate = options.onrender;
            onresize = options.onresize;
            ondelete = options.onremove;
            renderonchanged = options.renderonchanged as any;
        }

        if(!options.tagName) options.tagName = `custom-element${Math.random()*1000000000000000}`;

        CustomElement.addElement(options.tagName); 

        let elm = document.createElement(options.tagName);
        let completeOptions = this.updateOptions(options, elm) as ComponentProps
        this.templates[completeOptions.id] = completeOptions;

        let divs:any[] = Array.from(elm.querySelectorAll('*'));
        if(generateChildElementNodes) { //convert all child divs to additional nodes
            divs = divs.map((d:HTMLElement) => this.addElement({element:d}));
        }

        if(!options.element) options.element = elm;
        if(!options.operator) options.operator = function op(props:{[key:string]:any}){ 
            if(typeof props === 'object') 
                for(const key in props) { 
                    if(this.element) {
                        if(typeof this.element[key] === 'function' && typeof props[key] !== 'function')
                            { //attempt to execute a function with arguments
                                if(Array.isArray(props[key]))
                                this.element[key](...props[key]);
                                else this.element[key](props[key]);
                            } 
                        else if (key === 'style') { Object.assign(this.element[key],props[key])}
                        else this.element[key] = props[key]; 
                    }
                }
                
            return props;
        }

        
        let node = this.resolveGraphNode(elm, options);

        if(!node.ondelete) node.ondelete = (node) => { (elm as DOMElement).delete(); }


        this.components[completeOptions.id] = {
            element:elm as any,
            class:CustomElement,
            node,
            divs,
            ...completeOptions
        };


        return this.components[completeOptions.id] as ComponentInfo;
    }

    //create a canvas with a draw loop that can respond to props
    addCanvasComponent=(
        options: CanvasOptions
    ) => {

        if(!options.canvas) {
            options.template = `<canvas `;
            if(options.width) options.template += `width="${options.width}"`;
            if(options.height) options.template += `height="${options.height}"`;
            options.template+=` ></canvas>`;
        } else options.template = options.canvas;
                
        if(options.onrender) {
            let oncreate = options.onrender;
            (options.onrender as any) = (element:DOMElement) => {
                oncreate.call((element as any).node, element, options as any);
            }
        }
        if(options.onresize) {
            let onresize = options.onresize;
            (options.onresize as any) = (element:DOMElement) => {
                onresize.call((element as any).node, element, options as any);
            }
        }
        if(options.ondelete) {
            let ondelete = options.onremove;
            (options.onremove as any) = (element:DOMElement) => {
                ondelete.call((element as any).node, element, options as any);
            }
        }
        if(typeof options.renderonchanged === 'function') {
            let renderonchanged = options.renderonchanged;
            (options.renderonchanged as any) = (element:DOMElement) => {
                renderonchanged.call((element as any).node, element, options as any);
            }
        }

        
        class CustomElement extends DOMElement {
            props = options.props;
            styles = options.styles;
            template = options.template;
            oncreate = options.onrender;
            onresize = options.onresize;
            ondelete = options.onremove;
            renderonchanged = options.renderonchanged as any;
        }

        if(!options.tagName) options.tagName = `custom-element${Math.random()*1000000000000000}`;

        CustomElement.addElement(options.tagName);         
        let elm = document.createElement(options.tagName);
        const completeOptions = this.updateOptions(options, elm) as CanvasElementProps


        let animation = () => { //default animation
            if((this.components[completeOptions.id as string] as CanvasElementInfo)?.animating) {
                (this.components[completeOptions.id as string] as CanvasElementInfo).draw(this.components[completeOptions.id as string].element,this.components[completeOptions.id as string] as CanvasElementInfo);
                requestAnimationFrame(animation);
            }
        }

        this.templates[completeOptions.id] = completeOptions;

        if(!options.element) options.element = elm;
        if(!options.operator) options.operator = function op(props:{[key:string]:any}){ 
            if(typeof props === 'object') 
                for(const key in props) { 
                    if(this.element) {
                        if(typeof this.element[key] === 'function' && typeof props[key] !== 'function')
                            { //attempt to execute a function with arguments
                                if(Array.isArray(props[key]))
                                this.element[key](...props[key]);
                                else this.element[key](props[key]);
                            } 
                        else if (key === 'style') { Object.assign(this.element[key],props[key])}
                        else this.element[key] = props[key]; 
                    }
                }
                
            return props;
        }

        let node = this.resolveGraphNode(elm, options);

        if(!node.ondelete) node.ondelete = (node) => { (elm as DOMElement).delete(); }

        let canvas = elm.querySelector('canvas');
        if(completeOptions.style) Object.assign(canvas.style,completeOptions.style); //assign the style object

        let context;
        if(typeof completeOptions.context === 'object') context = options.context;
        else if(typeof completeOptions.context === 'string') context = (canvas as HTMLCanvasElement).getContext(completeOptions.context);

        this.components[completeOptions.id] = {
            element:elm,
            class:CustomElement,
            template:completeOptions.template,
            canvas,
            node,
            ...completeOptions
        } as any;

        (this.components[completeOptions.id] as CanvasElementInfo).context = context;

        (elm as any).canvas = canvas; //make sure everything is accessible;
        (elm as any).context = context; 
        node.canvas = canvas; //make sure everything is accessible;
        node.context = context;
      

        return this.components[completeOptions.id] as CanvasElementInfo;

    }

    terminate = (element:string|DOMElement|HTMLElement|ComponentInfo|CanvasElementInfo)=>{
        if(typeof element === 'object') {
            if((element as CanvasElementInfo).animating)
               (element as CanvasElementInfo).animating = false;

            if((element as ComponentInfo|CanvasElementInfo).element) element = (element as ComponentInfo|CanvasElementInfo).element;
         }
        else if(typeof element === 'string' && this.components[element]) {
            if((this.components[element] as CanvasElementInfo).node.isAnimating)
                (this.components[element] as CanvasElementInfo).node.stopNode();
            if((this.components[element] as ComponentInfo).divs)
                (this.components[element] as ComponentInfo).divs.forEach((d) => this.terminate(d));
                
            let temp = this.components[element].element;
            delete this.components[element]
            element = temp;
        }
        else if(typeof element === 'string' && this.elements[element]) {
            if(this.elements[element].divs)
                this.elements[element].divs.forEach((d) => this.terminate(d));
            let temp = this.elements[element].element;
            if(this.elements[element].onresize) window.removeEventListener('resize',this.elements[element].onresize as EventListener);
            if(this.elements[element].ondelete) this.elements[element].ondelete(temp,this.elements[element]);
            delete this.elements[element];
            element = temp;
        }
        
        if(element) {
            if(this.nodes.get((element as any).id)) {
                this.removeTree((element as any).id);
            }

            if(element instanceof DOMElement)
                element.delete(); //will trigger the ondelete callback
            else if ((element as HTMLElement)?.parentNode) {
                (element as any).parentNode.removeChild(element);
            }

            return true;
        }
        return false;
    }
    
    defaultRoutes:DOMRoutes = { //declared at the end so everything on this class is defined to pass through as node props
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
//     oncreate:(self:DOMElement,props:any) => { 
//         let button = self.querySelector('button');
//         button.onclick = (ev) => { alert('Hello World!'); }
//     }
// });

// let ccomp = router.html.addCanvasComponent({
//     context:'2d',
//     draw:(self:DOMElement,props:any)=>{
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