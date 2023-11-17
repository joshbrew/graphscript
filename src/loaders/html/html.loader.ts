
import {GraphNode, GraphNodeProperties,Graph} from '../../core/Graph'

export type HTMLNodeProperties = GraphNodeProperties & {
    __props?:HTMLElement,
    __onresize?:(elm:HTMLElement) => void,
    __onremove?:(elm:HTMLElement) => void,
    __onrender?:(elm:HTMLElement) => void,
    tagName?:string, //can provide this instead of an element or html template string
    parentNode?:string|HTMLElement, //can define a specific parentNode, else a parent graph node with an HTMLElement as __props will be selected, else graph.parentNode if defined, else document.body 
    style?:Partial<CSSStyleDeclaration>, //supply an object with style properties for this element's inline styles
    //applies to custom webcomponent only (wchtmlloader):
    __template?:string|((...args:any[]) => string),
    __renderonchanged?:(elm:HTMLElement) => void,
    useShadow?:boolean,
    __css?:string, //stylesheet template string for use with web components (just prepends a <style> sheet before the new divs)

    //more
    __element?:string|HTMLElement //alt way to set __props with a more explicit key
    __attributes?:{[key:string]:any} //can assign these to the html node, or just use the node definition itself as all element props are available on 'this'
}

export const htmlloader = (
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
        node.__onremove = (element:HTMLElement) => {
            ondelete.call(node, element);
        }
    }

    if(node.__onrender) {
        let onrender = node.__onrender;
        node.__onrender = (element:HTMLElement) => {
            onrender.call(node, element);
        }
    }

    if(node.tagName || node.__element) {
        if(node.tagName) node.__props = document.createElement(node.tagName);
        else if (node.__element) {
            if(node.__element instanceof HTMLElement) node.__props = node.__element;
            else node.__props = document.createElement(node.__element);
        }
        if(!(node.__props instanceof HTMLElement)) return; 
        
    }
    
    if(node.__props instanceof HTMLElement) {
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
            } else if(!(node.__props instanceof HTMLBodyElement || node.__props instanceof HTMLHeadElement)) document.body.appendChild(node.__props);
        
            //add slight delay for sizing etc to kick in correctly
            if(node.__onrender) setTimeout(()=>{node.__onrender(node.__props)},0.01);

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