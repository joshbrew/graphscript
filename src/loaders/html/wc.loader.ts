
import {GraphNode, GraphNodeProperties,Graph, isNativeClass} from '../../core/Graph'
import {DOMElement} from './DOMElement'
export {HTMLNodeProperties} from './html.loader'

//includes the webcomponent library, specify components with '__template' and 
//   custom tagnames with  `__element` or `tagName`, else it uses a random tagname.
// once the first web component template is registered with a new tagname, you can instantiate more down the tree

export const wchtmlloader = (
    node:GraphNode,
    parent:Graph|GraphNode,
    graph:Graph,
    roots:any,
    properties:GraphNodeProperties,
    key:string
) => {


    if(node.__onresize) {
        let onresize = node.__onresize;
        node.__onresize = (ev) => { onresize.call(node, ev, node.__props) };
    }

    if(node.__onremove) {
        let ondelete = node.__onremove;
        node.__onremove = (element:DOMElement) => {
            ondelete.call(node, element);
        }
    }

    if(node.__onrender) {
        let onrender = node.__onrender;
        node.__onrender = (element:DOMElement) => {
            onrender.call(node, element);
        }
    }

    if((node.tagName || node.__element) && !node.__props && !node.__template) {
        if(node.tagName) node.__props = document.createElement(node.tagName);
        else if (node.__element) {
            if(node.__element instanceof HTMLElement) node.__props = node.__element;
            else node.__props = document.createElement(node.__element);
        }
        if(!(node.__props instanceof HTMLElement)) return; 
        
    } else if (typeof node.__css === 'string') {
        node.__template += `<style> ${node.__css} </style>`; delete node.__css;
    }


    const registerElement = (node, tagNameOverride?:string) => {
        if (isNativeClass(node)) node = new node();
        else if (typeof node === 'function' && !node.__node) node = node();

        class CustomElement extends DOMElement {
            props = node.props;
            styles = node.__css;
            useShadow = node.useShadow;
            template = node.__template as any;
            oncreate = node.__onrender;
            onresize = node.__onresize;
            ondelete = node.__onremove;
            renderonchanged = node.__renderonchanged as any;
        }

        if (tagNameOverride?.includes('-')) node.tagName = tagNameOverride
        else if(node.__element) node.tagName = node.__element;
        
        if(!node.tagName) node.tagName = `element${Math.floor(Math.random()*1000000000000000)}-`;

        CustomElement.addElement(node.tagName);
    }


    if ('__components' in node) {
        if (Array.isArray(node.__components)) node.__components.forEach(c => registerElement(c))
        else Object.entries(node.__components).forEach(([k, c]) => registerElement(c, k.includes('-') ? k : undefined))
    }

    if ('__template' in node) {

        if(typeof node.__renderonchanged === 'function') {
            let renderonchanged = node.__renderonchanged;
            node.__renderonchanged = (element:DOMElement) => {
                renderonchanged.call((element as any).node, element);
            }
        }

        registerElement(node);
        node.__props = document.createElement(node.tagName);

        let cpy = Object.assign({},node);
        let keys = Object.getOwnPropertyNames(cpy);
        for(const k of keys) { 
            if(k === 'style' && typeof node[k] === 'object') {Object.assign(node.__props.style,cpy[k]);}
            else if (k === 'className') node.__props.setAttribute('class', cpy[k]);
            else if (!k.includes('outer')) node.__props[k] = cpy[k]; 
        }

        if(node.__attributes) { 
            for(const k in node.__attributes) {
                if(k === 'style' && typeof node.__attributes[k] === 'object') {Object.assign(node.__props.style,node.__attributes[k]);}
                else if (k === 'className') node.__props.setAttribute('class', node.__attributes[k]);
                else if (!k.includes('outer')) node.__props[k] = node.__attributes[k];
            }
        }
        node.__proxyObject(node.__props);

        //fix for event listeners 
        for(const k of keys) { 
            if(typeof cpy[k] === 'function') {
                let fn = cpy[k];
                node.__props[k] = (...inp) => { let res = fn(...inp); node.__node.state.triggerEvent(node.__node.unique+'.'+k, res); }; 
            }
        }

        if(node.__attributes) { 
            for(const k in node.__attributes) {
                if(typeof cpy[k] === 'function') {
                    let fn = node.__attributes[k];
                    node.__props[k] = (...inp) => { let res = fn(...inp); node.__node.state.triggerEvent(node.__node.unique+'.'+k, res); };
                }
            }
        }
        ///

    } else if(node.__props instanceof HTMLElement) {
        let cpy = Object.assign({},node);
        let keys = Object.getOwnPropertyNames(cpy);

        for(const k of keys) { 
            if(k === 'style' && typeof node[k] === 'object') {Object.assign(node.__props.style,cpy[k]);}
            else if (k === 'className') node.__props.setAttribute('class', cpy[k]);
            else if (!k.includes('outer')) node.__props[k] = cpy[k]; 
        }

        if(node.__attributes) { 
            for(const k in node.__attributes) {
                if(k === 'style' && typeof node.__attributes[k] === 'object') {Object.assign(node.__props.style,node.__attributes[k]);}
                else if (k === 'className') node.__props.setAttribute('class', cpy[k]);
                else if (!k.includes('outer')) node.__props[k] = node.__attributes[k];
            }
        }

        node.__proxyObject(node.__props);
        
        //fix for event listeners 
        for(const k of keys) { 
            if(typeof cpy[k] === 'function') {
                let fn = cpy[k];
                node.__props[k] = (...inp) => { let res = fn(...inp); node.__node.state.triggerEvent(node.__node.unique+'.'+k, res); }; 
                node[k] = node.__props[k];
            }
        }

        if(node.__attributes) { 
            for(const k in node.__attributes) {
                if(typeof cpy[k] === 'function') {
                    let fn = node.__attributes[k];
                    node.__props[k] = (...inp) => { let res = fn(...inp); node.__node.state.triggerEvent(node.__node.unique+'.'+k, res); };
                    node[k] = node.__props[k];
                }
            }
        }
        ///

        if(node.__onresize)
            window.addEventListener('resize', node.__onresize as EventListener);

    }
    
    if(node.__props instanceof HTMLElement) {
        node.__props.id = key;
        (node.__props as any).node = node;
        
        node.__addOnconnected((n) => { 
            if(!(node.__props instanceof HTMLBodyElement || node.__props instanceof HTMLHeadElement) && n.__props.parentNode) (n.__props as HTMLElement).remove(); 
            if(properties.parentNode) {
                if(typeof properties.parentNode === 'string' && document.getElementById(properties.parentNode))  
                    document.getElementById(properties.parentNode)?.appendChild(n.__props);
                else if (properties.parentNode instanceof HTMLElement) properties.parentNode.appendChild(n.__props);
            } else if(parent?.__props instanceof HTMLElement) {
                parent.__props.appendChild(node.__props);
            } else if (typeof graph.parentNode === 'string' && document.getElementById(properties.parentNode)) {  
                document.getElementById(properties.parentNode)?.appendChild(graph.__props);
            } else if(graph.parentNode instanceof HTMLElement) {
                graph.parentNode.appendChild(node.__props);
            } else if(!(node.__props instanceof HTMLBodyElement || node.__props instanceof HTMLHeadElement)) 
                document.body.appendChild(node.__props);
        
            //add slight delay for sizing etc to kick in correctly
            if(node.__onrender && !(node.__props instanceof DOMElement) && !node.__template) setTimeout(()=>{node.__onrender(node.__props)},0.01);

        });

        node.__addOndisconnected((n) => { 
            (n.__props as HTMLElement).remove(); 

            if(typeof n.__onremove === 'function') {
                n.__onremove(n.__props)
            }

            if(n.__onresize) {
                window.removeEventListener('resize', n.__onresize);
            }
        });
    }


}