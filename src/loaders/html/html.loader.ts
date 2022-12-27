
import {GraphNode, GraphNodeProperties,Graph} from '../../core/Graph'

export type HTMLNodeProperties = GraphNodeProperties & {
    __props?:HTMLElement,
    __onresize?:(elm:HTMLElement) => void,
    __onremove?:(elm:HTMLElement) => void,
    __onrender?:(elm:HTMLElement) => void,
    tagName?:string, //can provide this instead of an element or html template string
    parentNode?:string, //can define a specific parentNode, else a parent graph node with an HTMLElement as __props will be selected, else graph.parentNode if defined, else document.body 
    style?:Partial<CSSStyleDeclaration>, //supply an object with style properties for this element's inline styles
    //applies to custom webcomponent only:
    __template?:string,
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
        node.__proxyObject(node.__props);
        let keys = Object.getOwnPropertyNames(properties);
        for(const k of keys) { 
            if(k === 'style' && typeof properties[k] === 'object') {Object.assign(node.__props.style,properties[k]);}
            else node.__props[k] = properties[k]; 
        }
    }
    
    if(node.__props instanceof HTMLElement) {

        if(node.__onresize)
            window.addEventListener('resize', node.__onresize as EventListener);

    } 

    if(node.__attributes && node.__props instanceof HTMLElement) { 
        for(const k in node.__attributes) {
            if(k === 'style' && typeof node.__attribute[k] === 'object') {Object.assign(node.__props.style,node.__attribute[k]);}
            node.__props[k] = node.__attributes[k];
        }
    }
    
    if(node.__props instanceof HTMLElement) {
        node.__props.id = key;

        node.__addOnconnected((n) => { 
            if(n.__props.parentNode) (n.__props as HTMLElement).remove(); 
            if(n.parentNode) {
                if(typeof n.parentNode === 'string' && document.getElementById(n.parentNode))  
                    document.getElementById(n.parentNode)?.appendChild(n.__props);
                else if (n.parentNode instanceof HTMLElement) n.parentNode.appendChild(n.__props);
            } else if(parent.__props instanceof HTMLElement) {
                parent.__props.appendChild(node.__props);
            } else if (typeof graph.parentNode === 'string' && document.getElementById(n.parentNode)) {  
                document.getElementById(n.parentNode)?.appendChild(graph.__props);
            } else if(graph.parentNode instanceof HTMLElement) {
                graph.parentNode.appendChild(node.__props);
            } else if(!(node.__props instanceof HTMLBodyElement || node.__props instanceof HTMLHeadElement)) document.body.appendChild(node.__props);
        
            //add slight delay for sizing etc to kick in correctly
            if(node.__onrender && !node.__template) setTimeout(()=>{node.__onrender(node.__props)},0.01);

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