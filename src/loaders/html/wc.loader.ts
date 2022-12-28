
import {GraphNode, GraphNodeProperties,Graph} from '../../core/Graph'
import {DOMElement} from './DOMElement'
export {HTMLNodeProperties} from './html.loader'

//includes the webcomponent library, specify components with '__template' and 
//   custom tagnames with  `__element` or `tagName`, else it uses a random tagname.
// once the first web component template is registered with a new tagname, you can instantiate more down the tree

export const wchtmlloader = (
    node:GraphNode
) => {

    const root = node.__node
    const parent = node.__parent
    const graph = root.graph
    // const key = root.tag
    const key = root.tag.split('.').slice(-1)[0]

    const properties = root.properties
    let entries = Object.entries(properties); // Don't get all properties, just the enumerable ones, and before you set __props
    

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

        entries.forEach(([k,v]) => {
            if(k === 'style' && typeof v === 'object') {Object.assign(node.__props.style, v);} // Ensure all style properties are set
            // else node.__props[k] = v; 
        })
    } else if (typeof node.__css === 'string') {
        node.__template = `<style> ${node.__css} </style>`; delete node.__css;
    }
    
    if (node.__template) {

        if(typeof node.__renderonchanged === 'function') {
            let renderonchanged = node.__renderonchanged;
            node.__renderonchanged = (element:DOMElement) => {
                renderonchanged.call((element as any).node, element);
            }
        }

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

        if(node.__element) node.tagName = node.__element;
        if(!node.tagName) node.tagName = `element${Math.floor(Math.random()*1000000000000000)}-`;

        CustomElement.addElement(node.tagName);

        node.__props = document.createElement(node.tagName);
        node.__props.node = node;
        entries.forEach(([k,v]) => {
            if(k === 'style' && typeof v === 'object') {Object.assign(node.__props.style, v);} // Ensure all style properties are set
            // else node.__props[k] = v; 
        })

    } else if(node.__props instanceof HTMLElement) {

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

        const root = node.__node

        root.addOnConnected((n) => { 
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

        root.addOnDisconnected((n) => { 
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