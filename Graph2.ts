//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import { EventHandler } from "./services/EventHandler";

export const state = new EventHandler();


export type GraphNodeProperties = {
    _node?:{
        tag?:string,
        state?:EventHandler,
        operator?:((...args:any[])=>any)|string,
        children?:{[key:string]:GraphNodeProperties},
        oncreate?:Function|Function[],
        ondelete?:Function|Function[],
        listeners?:{[key:string]:(result)=>void},
        [key:string]:any
    },
    [key:string]:any
}

export type GraphProperties = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:(properties:GraphNodeProperties,parent:Graph|GraphNode,graph:Graph)=>void},
    state?:EventHandler,
    childrenKey?:string,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}

//this is a scope
export class GraphNode {

    _node:{
        [key:string]:any
    } = { //GraphNode-specific properties 
        tag:`node${Math.floor(Math.random()*1000000000000000)}`,
        unique:`${Math.random()}`,
        state,
        // operator: undefined as any,
        // graph: undefined as any,
        // children: undefined as any,
        // localState: undefined as any,
        // events: undefined as any,
        // oncreate:undefined as any, //function or array of functions
        // ondelete:undefined as any, //function or array of functions
        // listeners:undefined as any, //e.g. { 'nodeA.x':(newX)=>{console.log('nodeA.x changed:',x)}  }
        // source:undefined as any// source graph if a graph is passed as properties
    }

    //pass GraphNodeProperties, functions, or tags of other nodes
    constructor(properties:any, parent?:{[key:string]:any}, graph?:Graph) {

        if(typeof properties === 'function') {
            properties = {
                _node:{
                    operator:properties,
                    tag:properties.name
                }
            };
        } else if (typeof properties === 'string') {
            if(graph?.get(properties)) {
                properties = graph.get(properties);
            }
        }
        
        if(typeof properties === 'object') {
            if (typeof properties._node === 'string') {
                //copy
                if(graph?.get(properties._node)) {
                    properties = graph.get(properties._node);
                } else properties._node = {}
            } else if(!properties._node) properties._node = {};

            if(parent) properties._node.parent = parent;
            if(graph) properties._node.graph = graph;

            for(const key in properties) {
                if(typeof properties[key] === 'function') 
                    properties[key] = properties[key].bind(this);
            }

            if(typeof properties.default === 'function') 
                properties.default = this._setOperator(properties.default);
            else if(properties._node.operator) {
                if (typeof properties._node.operator === 'string') {
                    if(graph) {
                        let n = graph.get(properties._node.operator);
                        if(n) properties._node.operator = n._node.operator;
                        if(!properties._node.tag && (properties._node.operator as Function).name) 
                            properties._node.tag = (properties._node.operator as Function).name;
                    }
                }
                if(typeof properties._node.operator === 'function') 
                    properties._node.operator = this._setOperator(properties._node.operator);
            }

            if(!properties._node.tag) {
                if(properties._node.operator?.name)
                    properties._node.tag = properties._node.operator.name;
                else 
                    properties._node.tag = `node${Math.floor(Math.random()*1000000000000000)}`;
            }

            //nested graphs or 2nd level+ nodes get their parents as a tag
            if(parent?._node && (!(parent instanceof Graph) || properties instanceof Graph)) properties._node.tag = parent._node.tag + '.' + properties._node.tag; //load parents first
            if(parent instanceof Graph && properties instanceof Graph) {

                if(properties._node.loaders) Object.assign(parent._node.loaders ? parent._node.loaders : {}, properties._node.loaders); //let the parent graph adopt the child graph's loaders

                if(parent._node.mapGraphs) {
                    //do we still want to register the child graph's nodes on the parent graph with unique tags for navigation? Need to add cleanup in this case
                    properties._node.nodes.forEach((n) => {parent._node.nodes.set(properties._node.tag+'.'+n._node.tag,n)});

                    let ondelete = () => { properties._node.nodes.forEach((n) => {parent._node.nodes.delete(properties._node.tag+'.'+n._node.tag)}); }
                    if(Array.isArray(this._node.ondelete)) { this._node.ondelete.push(ondelete); }
                    else if (this._node.ondelete) { this._node.ondelete = [ondelete,this._node.ondelete] }
                    else this._node.ondelete = [ondelete];

                }
            }

            properties._node.initial = properties; //original object or function

            properties._node = Object.assign(this._node,properties._node);
            Object.assign(this,properties);

            if(properties._node.operator && parent instanceof GraphNode && parent._node.operator) {
                let sub = parent._subscribe(this);
                let ondelete = () => { parent?._unsubscribe(sub);}
                if(Array.isArray(this._node.ondelete)) { this._node.ondelete.push(ondelete); }
                else if (this._node.ondelete) { this._node.ondelete = [ondelete,this._node.ondelete] }
                else this._node.ondelete = [ondelete];
            }
            if(properties instanceof Graph) this._node.source = properties; //keep tabs on source graphs passed to make nodes

            if(typeof this._node.oncreate === 'function') { this._node.oncreate(this); }
            else if (Array.isArray(this._node.oncreate)) { this._node.oncreate.forEach((o:Function) => { o(this); }) }
        }
    }

    //subscribe an output with an arbitrary callback
    _subscribe = (callback:string|GraphNode|((res)=>void), key?:string) => {
        if(key) {
            if(!this._node.localState) {
                this._addLocalState(this);
            }
             
            if(typeof callback === 'string') {
                if(this._node.graph) callback = this._node.graph.get(callback);
                else callback = this._node.graph.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this._node.events.subscribeTrigger(key, callback);
            } else if((callback as GraphNode)?._node) return this._node.events.subscribeTrigger(key, (state:any)=>{ if((callback as any)._node.operator) (callback as any)._node.operator(state); })
            
        }
        else {
            if(typeof callback === 'string') {
                if(this._node.graph) callback = this._node.graph.get(callback);
                else callback = this._node.graph.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this._node.state.subscribeTrigger(this._node.tag, callback);
            } else if((callback as GraphNode)?._node) return this._node.state.subscribeTrigger(this._node.tag, (res:any)=>{ if((callback as any)._node.operator) (callback as any)._node.operator(res); })
        
        }
    }

    _subscribeState = (callback:string|GraphNode|((res)=>void)) => {
        if(typeof callback === 'string') {
            if(this._node.graph) callback = this._node.graph.get(callback);
            else callback = this._node.graph.nodes.get(callback);
        }
        if(typeof callback === 'function') {
            return this._node.state.subscribeTrigger(this._node.unique, callback);
        } else if((callback as GraphNode)?._node) return this._node.state.subscribeTrigger(this._node.unique, (state:any)=>{ if((callback as any)?._node.operator) (callback as any)._node.operator(state); })
        
    }
    
    //unsub the callback
    _unsubscribe = (sub?:number, key?:string) => {
        if(key && this._node.events) return this._node.events.unsubscribeTrigger(key,sub);
        else return this._node.state.unsubscribeTrigger(this._node.tag,sub);
    }

    _setOperator = (fn:(...args:any[])=>any) => {
        fn = fn.bind(this);
        this._node.operator = (...args) => {
            let result = fn(...args);
            if(typeof result?.then === 'function') {
                result.then((res)=>{ if(res !== undefined) this._node.state.setValue( this._node.tag,res ) }).catch(console.error);
            } else if(result !== undefined) this._node.state.setValue(this._node.tag,result);
            return result;
        } 

        return this._node.operator;
    }

    
// added to GraphNode and Graph
_addLocalState(props?:{[key:string]:any}) {
    if(!props) return;
    if(!this._node.localState) {
        this._node.localState = {};
    }
    if(!this._node.events) {
        this._node.events = new EventHandler(this._node.localState);
    }
    let localState = this._node.localState;
    for (let k in props) {
        if(typeof props[k] === 'function') {
            if(!k.startsWith('_')) {
                let fn = props[k].bind(this) as Function;
                props[k] = (...args) => { //all functions get state functionality when called, incl resolving async results for you
                    let result = fn(...args);
                    if(typeof result?.then === 'function') {
                        result.then((res)=>{ this._node.events.setValue( k, res ) }).catch(console.error);
                    } else this._node.events.setValue(k,result);
                    return result;
                }
                this[k] = props[k]; 
            }
        } else {
            localState[k] = props[k];
            //console.log(k, localState[k]);

            let definition = {
                get: () => {
                    return localState[k];
                },
                set: (v) => {
                    if(this._node.state.triggers[this._node.unique]) {
                        this._node.state.setValue(this._node.unique,this); //trigger subscriptions, if any
                    }
                    this._node.events.setValue(k,v); //this will update localState and trigger local key subscriptions
                },
                enumerable: true,
                configurable: true
            } as any;

            Object.defineProperty(this, k, definition);
            
            const ogProps = this._node.initial
            let dec = Object.getOwnPropertyDescriptor(ogProps,k);
            if(dec === undefined || dec?.configurable) Object.defineProperty(ogProps, k, definition);
        }
    }
}
}

export class Graph {

    _node:{[key:string]:any} = {
        tag:`graph${Math.floor(Math.random()*1000000000000000)}`,
        nodes:new Map(),
        state,
        // addState:true //apply the addLocalState on node init 
        // mapGraphs:false //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
        // tree:undefined as any,
        // loaders:undefined as any,
        // childrenKey:undefined as any
    }

    constructor(
        options?:{
            tree?:{[key:string]:any},
            loaders?:{[key:string]:(properties:any,parent:Graph|GraphNode,graph:Graph)=>void},
            state?:EventHandler,
            childrenKey?:string,
            mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
            [key:string]:any
        }
    ) {
        if(options) {
            recursivelyAssign.call(this, this._node,options); //assign loaders etc
            if(options.tree) this.setTree(options.tree);
        }

    }

    setTree(tree:{[key:string]:any}) {

        this._node.tree = Object.assign(this._node.tree ? this._node.tree : {}, tree);

        let cpy = Object.assign({},tree);
        delete cpy._node; //we can specify _node behaviors on the tree too to specify listeners

        let listeners = this.recursiveSet(cpy,this);

        //make the tree a node 
        if(tree._node) {
            if(!tree._node.tag) tree._node._tag = `tree${Math.floor(Math.random()*1000000000000000)}`;
            for(const l in this._node.loaders) { this._node.loaders[l](tree,this,this); } //run any passes on the nodes to set things up further
            let node = new GraphNode(tree,this,this); //blank node essentially for creating listeners
            this._node.nodes.set(node._node.tag,node);
            if(node._node.listeners) {
                listeners[node._node.tag] = node._node.listeners;
            } //now the tree can specify nodes
    
        }

        //now setup event listeners
        this.setListeners(listeners);

    }

    setLoaders(loaders:{[key:string]:(properties:any,parent:Graph|GraphNode,graph:Graph)=>void}, replace?:boolean) {
        if(replace)  this._node.loaders = loaders;
        else Object.assign(this._node.loaders,loaders);
        return this._node.loaders;
    }

    add(properties:any, parent?:GraphNode|string) {

        let listeners = {}; //collect listener props declared

        if(typeof parent === 'string') parent = this.get(parent);
        let node = new GraphNode(properties, parent as GraphNode, this);
        this._node.nodes.set(node._node.tag,node);

        //console.log('old:',properties._node,'new:',node._node);
        
        if(node._node.listeners) {
            listeners[node._node.tag] = node._node.listeners;
        }

        if(node._node.children) {
            node._node.children = Object.assign({},node._node.children);
            this.recursiveSet(node._node.children,node,listeners);
        }

        //now setup event listeners
        this.setListeners(listeners);

        return node;
    }

    recursiveSet = (t,parent,listeners={}) =>  {
        for(const key in t) {
            let p = t[key];
            if(typeof p === 'function') p = {_node:{ operator:p }} 
            else if (typeof p === 'string') p = this._node.tree[p];
            else if (typeof p === 'boolean') p = this._node.tree[key];
            if(typeof p === 'object') {
                if(!p._node) p._node = {};
                if(!p._node.tag) p._node.tag = key;
                if(this.get(p._node.tag)) continue; //don't duplicate a node we already have in the graph by tag
                for(const l in this._node.loaders) { this._node.loaders[l](p,parent,this); } //run any passes on the nodes to set things up further
                let nd = new GraphNode(p,parent,this);
                t[key] = nd; //replace child with a graphnode
                this._node.tree[nd._node.tag] = p; //reference the original props by tag in the tree for children
                this.set(nd._node.tag,nd);
                if(nd._node.listeners) {
                    listeners[nd._node.tag] = nd._node.listeners;
                }
                else if(nd._node.children) {
                    nd._node.children = Object.assign({},nd._node.children);
                    this.recursiveSet(nd._node.children, nd, listeners);
                }
            }
        } 
        return listeners;
    }

    remove(node:GraphNode|string, clearListeners:boolean=true) {
        this.unsubscribe(node);

        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            this._node.nodes.delete(node._node.tag);
            delete this._node.tree[node._node.tag];

            if(clearListeners) {
                this.clearListeners(node);
            }

            if(typeof node._node.ondelete === 'function') node._node.ondelete(node);
            else if (Array.isArray(node._node.ondelete)) { node._node.ondelete.forEach((o:Function) => {o(node)}); }
 
            const recursiveRemove = (t) => {
                for(const key in t) {
                    this.unsubscribe(t[key]);
                    this._node.nodes.delete(t[key]._node.tag);
                    delete this._node.tree[t[key]._node.tag]
                    this._node.nodes.delete(key);
                    delete this._node.tree[key]

                    //console.log(key, 'removing child',t[key]);
                    t[key]._node.tag = t[key]._node.tag.substring(t[key]._node.tag.lastIndexOf('.')+1);

                    if(clearListeners) {
                        this.clearListeners(t[key]);
                    }

                    if(typeof t[key]?._node?.ondelete === 'function') t[key]._node.ondelete(t[key]);
                    else if (Array.isArray(t[key]?._node.ondelete)) { t[key]?._node.ondelete.forEach((o:Function) => {o(node)}); }
                   
                    if(t[key]._node.children) {
                        recursiveRemove(t[key]._node.children);
                    }

                   // console.log('removed!', t[key])
                } 
            }

            if(node._node.children) {
                recursiveRemove(node._node.children);
            }
        }

        if((node as any)?._node.tag && (node as any)?._node.parent) {
            delete (node as any)?._node.parent;
            (node as any)._node.tag = (node as any)._node.tag.substring((node as any)._node.tag.indexOf('.')+1);
        }

        return node;
    }

    run(node:string|GraphNode, ...args:any[]) {
        if(typeof node === 'string') node = this.get(node);
        if((node as GraphNode)?._node?.operator) {
            return (node as GraphNode)?._node?.operator(...args);
        }
    }

    setListeners(listeners:{[key:string]:{[key:string]:any}}) {
        //now setup event listeners
        for(const key in listeners) {
            let node = this.get(key);
            if(typeof listeners[key] === 'object') {
                for(const k in listeners[key]) {
                    let n = this.get(k);
                    let sub;
                    let fn = listeners[key][k].bind(node);//bind 'this' for the callback to the owner node 
                    listeners[key][k] = fn; 
                    if(!n) {
                        let tag = k.substring(0,k.lastIndexOf('.'));
                        n = this.get(tag);
                        if(n) {
                            sub = this.subscribe(n,k.substring(k.lastIndexOf('.')+1),listeners[key][k]);
                            if(!node._node.listenerSubs) node._node.listenerSubs = {};
                            node._node.listenerSubs[k] = sub;
                        }
                    } else {
                        sub = this.subscribe(n,undefined,listeners[key][k]);
                        if(!node._node.listenerSubs) node._node.listenerSubs = {};
                        node._node.listenerSubs[k] = sub;
                    }
                }
            }
        }
    }

    clearListeners(node:GraphNode|string,listener?:string) {
        if(typeof node === 'string') node = this.get(node) as GraphNode;
        if(node?._node.listenerSubs) {
            //console.log(node?._node.listenerSubs);
            //console.log(node._node.listenerSubs);
            for(const key in node._node.listenerSubs) {
                if(listener && key !== listener) continue; 
                if(typeof node._node.listenerSubs[key] !== 'number') continue;
                let n = this.get(key);
                if(!n) {
                    n = this.get(key.substring(0,key.lastIndexOf('.')));
                    //console.log(key.substring(0,key.lastIndexOf('.')),key,n,node._node.listenerSubs[key]);
                    if(n) this.unsubscribe(n,key.substring(key.lastIndexOf('.')+1),node._node.listenerSubs[key]);
                } else {
                    this.unsubscribe(n,undefined,node._node.listenerSubs[key]);
                }

                //console.log('unsubscribed', key)
                delete node._node.listeners[key];
                delete node._node.listenerSubs[key];
            }
        }
    }

    get = (tag) => { return this._node.nodes.get(tag); };
    set = (tag,node) => { this._node.nodes.set(tag,node); };

    getProps = (node:GraphNode|string, getInitial?:boolean) => {
        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            
            let cpy;
            if(getInitial) cpy = Object.assign({}, this._node.tree[node._node.tag]);
            else {
                cpy = Object.assign({},node) as any;
                //remove graphnode methods to return the arbitrary props
                delete cpy._unsubscribe;
                delete cpy._setOperator;
                delete cpy._node;
                delete cpy._subscribeState;
                delete cpy._subscribe;
            }
        }
    }

    subscribe = (
        node:GraphNode|string, key:string|undefined, callback:(res:any)=>void
    ) => {
        if(!(node instanceof GraphNode)) node = this.get(node);

        let sub;
        if(node instanceof GraphNode) {
            sub = node._subscribe(callback,key);

            let ondelete = () => {
                (node as GraphNode)._unsubscribe(sub,key);
                //console.log('unsubscribed', key)
            }

            if(node._node.ondelete) {
                if(Array.isArray(node._node.ondelete)) {node._node.ondelete.push(ondelete);}
                else node._node.ondelete = [ondelete,node._node.ondelete];
            } else node._node.ondelete = [ondelete];
        }

        return sub;
    }

    unsubscribe = ( node:GraphNode|string, key?:string, sub?:number ) => {
        if(node instanceof GraphNode) {
            //console.log(node,node._unsubscribe);
            return node._unsubscribe(sub,key);
        }
        else return this.get(node)?._unsubscribe(sub,key);
    }

    setState = (update:{[key:string]:any}) => {
        this._node.state.setState(update);
    }

    

}



function recursivelyAssign (target,obj) {
    for(const key in obj) {
        if(obj[key]?.constructor.name === 'Object' && !Array.isArray(obj[key])) {
            if(target[key]?.constructor.name === 'Object' && !Array.isArray(target[key])) 
                recursivelyAssign(target[key], obj[key]);
            else target[key] = recursivelyAssign({},obj[key]); 
        } else {
            target[key] = obj[key];
            if(typeof target[key] === 'function') target[key] = target[key].bind(this);
        }
    }

    return target;
}


/*
Usage:

import * as nodeZ from './nodeZ.js'

let tree = {

    nodeA:{
        x:1,
        y:2,
        _node:{
            listeners:{
                'nodeB.x':function(newX){ console.log('nodeB x prop changed:',newX, this); this.x = newX; }, //listeners in a scope are bound to 'this' node
                'nodeB.nodeC':function(op_result){console.log('nodeC operator returned:', op_result, this)},
                'nodeB.nodeC.z':function(newZ){console.log('nodeC z prop changed:', newZ, this)}
            }
        }
    },

    nodeB:{
        x:3,
        y:4,
        _node:{
            children:{
                nodeC:{
                    z:4,
                    _node:{
                        operator:function(a) { this.z += a; console.log('nodeC z prop added to',this); return this.z; },
                        listeners:{
                            'nodeA.x':function(newX) { console.log('nodeA x prop updated', newX);}
                        }
                    }
                }
            }
        }
    },


    nodeC:(a,b,c)=>{ return a+b+c; }, //becomes the ._node.operator prop and calling triggers setState for this tag (or nested tag if a child)

    nodeZ //can treat imports as default objects

};

let graph = new Graph({
    tree
});

graph.get('nodeB').x += 1; //should trigger nodeA listener

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

console.log('graph1',graph);

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

let popped = graph.remove('nodeB');

console.log(popped._node.tag, 'popped')

graph2.add(popped); //reparent nodeB to the parent graph

console.log('nodeB reparented to graph2',popped,graph2);


popped.x += 1; //should no longer trigger nodeA.x listener on nodeC
*/