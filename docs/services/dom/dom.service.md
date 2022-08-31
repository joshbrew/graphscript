## DOMService

DOMService is a dedicated browser html rendering solution which incorporates basic html elements or fully functioning customizable web components. Elements and web components can be loaded right in route trees on setup with page positions based on the tree hierarchies. 

You can also build web component classes directly when importing DOMElement, which includes a lot of quality of life features that are not in base HTMLElements like states, onrender, ondelete etc callbacks, rendering templates and props you can update on-the-fly, etc.

``` ts

import {DOMService} from 'graphscript'

//base element routes
type ElementProps = GraphNodeProperties & {
    tagName?:string, //e.g. 'div', 'canvas'
    element?:HTMLElement, //alternatively set an element
    style?:Partial<CSSStyleDeclaration>,
    attributes?:{[key:string]:any}, //specify any attributes/values
    parentNode?:string|HTMLElement,
    onrender?:(self:HTMLElement,info:ElementInfo)=>void,
    onresize?:(ev,self:HTMLElement,info:ElementInfo)=>void,
    ondelete?:(self:HTMLElement,info:ElementInfo)=>void,
    innerText?:string,
    innerHTML?:string,
    id?:string,
    children?:{[key:string]:string|boolean|undefined|GraphNodeProperties|GraphNode|Graph|ComponentProps|ElementProps|CanvasElementProps},
    generateChildElementNodes?:boolean //generate these element info and graphnodes for every node in an element hierarchy
}

type ElementInfo = { //returned from addElement
    element:HTMLElement,
    node:GraphNode,
    parentNode:HTMLElement,
    divs:any[]
} & ElementProps;

type ComponentProps = GraphNodeProperties & {
    tagName?:string, //custom node tag name, requires a '-' in it 
    template?:string|((self:DOMElement, props:any)=>string|HTMLElement)|HTMLElement, //string or function that passes the modifiable props on the element (the graph node properties)
    interpreter?:'md'|'jsx' //standard web components, md file text, react jsx?
    parentNode?:string|HTMLElement,
    styles?:string,  //Insert a stylesheet in front of the template
    onrender?:(self:DOMElement,info?:ComponentInfo)=>void, //use self.querySelector to select nested elements without worrying about the rest of the page.
    onresize?:(self:DOMElement,info?:ComponentInfo)=>void,
    ondelete?:(self:DOMElement,info?:ComponentInfo)=>void,
    onchanged?:(props:any)=>void,
    renderonchanged?:boolean|((self:DOMElement,info:ComponentInfo)=>void), //set true to auto refresh the element render (it re-appends a new fragment in its container)
    innerText?:string,
    innerHTML?:string,
    id?:string,
    children?:{[key:string]:string|boolean|undefined|GraphNodeProperties|GraphNode|Graph|ComponentProps|ElementProps|CanvasElementProps},
    generateChildElementNodes?:boolean //generate these element info and graphnodes for every node in an element hierarchy
}

type ComponentInfo = { //returned from addComponent
    element:DOMElement,
    class:any, //the customized DOMElement class
    node:GraphNode,
    divs?:any[]
} & ComponentProps


//service tree custom routes recognized by domservices (or services/routers loading a domservice)
type DOMRouteProp = 
    ElementProps |
    ComponentProps |
    CanvasElementProps


const dom = new DOMService();

dom.load({
    'testdiv':{
        tagName:'div',
        style:{backgroundColor:'black', color:'white' }, //style this div using CSS objects
        children:{
            'testcomponent':{
                tagName:'my-component', //custom web component tag! Once one is created you can reuse it elsewhere in the tree as an element
                styles:`
                    .wcdiv { color:'blue' }
                `, //can pass a whole stylesheet definition to components
                template:'<div class="wcdiv">Ello govna!</div>', //defining a template will make this a webcomponent
                onrender:(self, info)=>{ console.log(self, info); }
            } as ComponentProps,
            'testbutton':{
                tagName:'button',
                innerText:'Click Me',
                style:{backgroundColor:'blue', color:'red'},
                attributes:{
                    onclick:(ev)=>{
                        ev.target.innerText = 'Clicked!'
                        setTimeout(()=>{ ev.target.innerText = 'Click Me'},2000)
                    }
                },
                onrender:(self, info)=>{ console.log(this, self, info); } //button onrender callback
            } as ElementProps
        }
    } as ElementProps
}); //will by default load the top elements to document.body, or specify dom.parentNode, or parentNode per element


```

You can do quite a lot with this service, like creating pluggable web component/web app trees so it's all conditionally loaded. Deleting the associated GraphNodes will delete the elements as well so it is fully tied to the graph trees.