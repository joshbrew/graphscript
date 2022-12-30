import { GraphNode } from "../../Graph";


const checkIfSubscribed = (node) => {
    const root = node.__node
    if(!root.operator.subscribedToParent) { //for child nodes

        const parent = node.__parent
        const parentRef = parent ? node.__parent.__node.ref : null;
        if(parentRef instanceof GraphNode && node.__parent.__operator) {
            let sub = parentRef.__node.listeners.subscribe(node);
            let ondelete = () => { if (parent) parent.__node.listeners.unsubscribe(sub); delete root.__subscribedToParent;}
            
            // TODO: Ensure this is available on the properties...
            root.addOnDisconnected(ondelete);
            root.operator.subscribedToParent = true;
        }
    }
}

export default (properties) => {

    const root = properties.__node;
    const graph = properties.__node.graph;
    const ref = properties.__node.ref;

    let value = properties.__operator

    root.operator = {
        subscribedToParent: false
    }

    Object.defineProperty(properties, '__operator', {
        get: () => value,
        set: (fn:(...args:any[])=>any) => {
            fn = fn.bind(ref); // Bind to node reference
            
            let inpstr = `${properties.__node.unique}input`;

            value = (...args) => {
                if(properties.__node.state.triggers[inpstr]) properties.__node.state.setValue(inpstr,args);
                let result = fn(...args);
                if(properties.__node.state.triggers[properties.__node.unique]) { //don't set state (i.e. copy the result) if no subscriptions
                    if(typeof result?.then === 'function') {
                        result.then((res)=>{ if(res !== undefined) properties.__node.state.setValue( properties.__node.unique,res ) }).catch(console.error);
                    } else if(result !== undefined) properties.__node.state.setValue(properties.__node.unique,result);
                }
                return result;
            } 
    
            checkIfSubscribed(properties); // Check this for parent node

            const children = properties.__children;
            for (let key in children) checkIfSubscribed(children[key]); // Check this for child nodes

        }
    })


    if (value) {

        if (typeof value === 'string') {
            if(graph) {
                let n = graph.get(value);
                if(n) value = n.__operator;
                if(!properties.__node.tag && (value as Function).name) properties.__node.tag = (value as Function).name;
            }
        }

        if (typeof value === 'function') properties.__operator = value;
        
    }

    return properties
}