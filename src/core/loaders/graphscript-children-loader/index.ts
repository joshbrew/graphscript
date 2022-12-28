import { root } from "..";
import { GraphNode } from "../../Graph";
import { isNativeClass } from "../../parsers/function";

export default (properties) => {
    const root = properties.__node;
    const graph = root.graph;
    if(properties.__children) {
       const children = properties.__children = Object.assign({},properties.__children);    
        recursiveSet(children, properties, children, graph)
    }

    const parent = properties.__parent;
    if (parent) {
        const parentRoot = parent.__node;
        if (parentRoot.addOnConnected) parentRoot.addOnConnected(root.callConnected) // Connect children of the parent
    }

    return properties
}

export function recursiveSet (t,parent,origin, graph) {
    let keys = Object.getOwnPropertyNames(origin);
    for(const key of keys) {
        if(key.includes('__')) continue;
        let p = origin[key];
        if(Array.isArray(p)) continue;
        let instanced;
        if(typeof p === 'function') {
            if(isNativeClass(p)) { //works on custom classes
                p = new p(); //graph is a class that returns a node definition
                if(p instanceof GraphNode) { p = p.prototype.constructor(p,parent,graph); instanced = true; } //re-instance a new node
            } else p = { __operator:p };
        } else if (typeof p === 'string') {
            if(graph.__node.nodes.get(p)) p = graph.__node.nodes.get(p);
            else p = graph.__node.roots[p];
        } else if (typeof p === 'boolean') {
            if(graph.__node.nodes.get(key)) p = graph.__node.nodes.get(key);
            else p = graph.__node.roots[key];
        }

        if(typeof p === 'object') {
            
            if(!instanced && !(p instanceof GraphNode)) {
                p = Object.assign({},p); //make sure we don't mutate the original object
            }
            if(!p.__node) p.__node = {};
            if(!p.__node.tag) p.__node.tag = key;
            if(!p.__node.initial) p.__node.initial = t[key];
            if((graph.get(p.__node.tag) && !(parent?.__node && graph.get(parent.__node.tag + '.' + p.__node.tag))) || (parent?.__node && graph.get(parent.__node.tag + '.' + p.__node.tag))) continue; //don't duplicate a node we already have in the graph by tag
            let node: GraphNode;
            if(instanced || p instanceof GraphNode) {
                node = p;
            } else node = new GraphNode(p, parent as GraphNode, graph); 
            if(p instanceof GraphNode && !instanced && parent instanceof GraphNode) { //make sure graph node is subscribed to the parent, can use graph to subscribe a node multiple times as a child
                let sub = graph.subscribe(parent.__node.tag, node.__node.tag);
                let ondelete = (node) => {graph.unsubscribe(parent.__node.tag, sub);}
                node.addOnDisconnected(ondelete); //cleanup sub
            } else { //fresh node, run loaders etc.
                graph.set(node.__node.tag,node);
                graph.runLoaders(node); // Setup node further

                t[key] = node; //replace child with a graphnode
                graph.__node.roots[node.__node.tag] = p; //reference the original props by tag in the roots for children
            }
        }
    } 
}