//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import { EventHandler } from "./services/EventHandler";

export const state = new EventHandler();


export type GraphNodeProperties = {
    __props?:Function|GraphNodeProperties, //a class constructor function (calls 'new x()') or an object we want to proxy all of the methods on this node. E.g. an html element gains 'this' access through operators and listeners on this node.
    __operator?:((...args:any[])=>any)|string, //The 'main' function of the graph node, children will call this function if triggered by a parent. Functions passed as graphnodeproperties become the operator which can set state.
    __children?:{[key:string]:GraphNodeProperties}, //child nodes belonging to this node, e.g. for propagating results
    __listeners?:{[key:string]:((result)=>void)|{callback:(result)=>void,subInput?:boolean,[key:string]:any}}, //subscribe by tag to nodes or their specific properties and method outputs
    __onconnected?:((node)=>void|((node)=>void)[]), //what happens once the node is created?
    __ondisconnected?:((node)=>void|((node)=>void)[]), //what happens when the node is deleted?
    __node?:{ //node specific properties, can contain a lot more things
        tag?:string,
        state?:EventHandler, //by default has a global shared state
        inputState?:boolean //we can track inputs on a node, subscribe to state with 'input' on the end of the tag or 'tag.prop' 
        [key:string]:any
    },
    [key:string]:any
}


export type GraphOptions = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:(
        node:GraphNode,
        parent:Graph|GraphNode,
        graph:Graph,
        tree:any,
        properties:GraphNodeProperties,
        key:string
    )=>void},
    state?:EventHandler,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}

//this is a scope
export class GraphNode {

    __node:{
        [key:string]:any
    } = { //GraphNode-specific properties 
        tag:`node${Math.floor(Math.random()*1000000000000000)}`,
        unique:`${Math.random()}`,
        state,
        // operator: undefined as any,
        // graph: undefined as any,
        // children: undefined as any,
        // localState: undefined as any,
        // oncreate:undefined as any, //function or array of functions
        // ondelete:undefined as any, //function or array of functions
        // listeners:undefined as any, //e.g. { 'nodeA.x':(newX)=>{console.log('nodeA.x changed:',x)}  }
        // source:undefined as any// source graph if a graph is passed as properties
    }

    __children?;
    __operator?;
    __listeners?;
    __props?;

    [key:string]:any
    
    //pass GraphNodeProperties, functions, or tags of other nodes
    constructor(properties:any, parent?:{[key:string]:any}, graph?:Graph) {

        let orig = properties;
        if(typeof properties === 'function') {
            properties = {
                __operator:properties,
                __node:{
                    forward:true, //propagate operator results to children
                    tag:properties.name
                }
            };
        } else if (typeof properties === 'string') {
            if(graph?.get(properties)) {
                properties = graph.get(properties);
            }
        }
        if(!properties.__node.initial) properties.__node.initial = orig; //original object or function

        if(typeof properties === 'object') {
            if(properties.__props) { //e.g. some generic javascript object or class constructor that we want to proxy. Functions passed here are treated as constructors. E.g. pass an HTML canvas element for the node then set this.width on the node to set the canvas width  
                if (typeof properties.__props === 'function') properties.__props = new properties.__props();
                if (typeof properties.__props === 'object') {
                    this.__proxyObject(properties.__props);
                }
            }

            if (typeof properties.__node === 'string') {
                //copy
                if(graph?.get(properties.__node.tag)) {
                    properties = graph.get(properties.__node.tag);
                } else properties.__node = {}
            } else if(!properties.__node) properties.__node = {};

            if(!properties.__parent && parent) properties.__parent = parent;
            if(graph) {
                properties.__node.graph = graph;
            }

            if(properties.__operator) {
                if (typeof properties.__operator === 'string') {
                    if(graph) {
                        let n = graph.get(properties.__operator);
                        if(n) properties.__operator = n.__operator;
                        if(!properties.__node.tag && (properties.__operator as Function).name) 
                            properties.__node.tag = (properties.__operator as Function).name;
                    }
                }
                if(typeof properties.__operator === 'function') 
                    properties.__operator = this.__setOperator(properties.__operator);
                
            }

            if(!properties.__node.tag) {
                if(properties.__operator?.name)
                    properties.__node.tag = properties.__operator.name;
                else 
                    properties.__node.tag = `node${Math.floor(Math.random()*1000000000000000)}`;
            }

            //nested graphs or 2nd level+ nodes get their parents as a tag
            if(parent?.__node && (!(parent instanceof Graph || properties instanceof Graph))) properties.__node.tag = parent.__node.tag + '.' + properties.__node.tag; //load parents first
            
            if(parent instanceof Graph && properties instanceof Graph) {

                if(properties.__node.loaders) Object.assign(parent.__node.loaders ? parent.__node.loaders : {}, properties.__node.loaders); //let the parent graph adopt the child graph's loaders

                if(parent.__node.mapGraphs) {
                    //do we still want to register the child graph's nodes on the parent graph with unique tags for navigation? Need to add cleanup in this case
                    properties.__node.nodes.forEach((n) => {parent.set(properties.__node.tag+'.'+n.__node.tag,n)});

                    let ondelete = () => { properties.__node.nodes.forEach((n) => {parent.__node.nodes.delete(properties.__node.tag+'.'+n.__node.tag)}); }
                    this.__addOndisconnected(ondelete);

                }
            }

            properties.__node = Object.assign(this.__node,properties.__node);
            
            let keys = Object.getOwnPropertyNames(properties);
            for(const key of keys) { this[key] = properties[key]; }

            
            if (typeof properties.default === 'function' && !properties.__operator) { //make it so the node is subscribable
                let fn = properties.default.bind(this);
                this.default = (...args) => {
                    if(this.__node.inputState) this.__node.state.setValue(this.__node.unique+'input',args);
                    let result = fn(...args);
                    if(typeof result?.then === 'function') {
                        result.then((res)=>{ if(res !== undefined) this.__node.state.setValue( this.__node.unique,res ) }).catch(console.error);
                    } else if(result !== undefined) this.__node.state.setValue(this.__node.unique,result);
                    return result;
                } 

                properties.default = this.default;
            }
            
            if(properties instanceof Graph) this.__node.source = properties; //keep tabs on source graphs passed to make nodes

            
        }
    }

    //subscribe an output or input with an arbitrary callback
    __subscribe = (callback:string|GraphNode|((res)=>void), key?:string, subInput?:boolean, bound?:string, target?:string) => {

        const subscribeToFunction = (k, setTarget = (callback, target?) => callback, triggerCallback=callback) => {
            let sub = this.__node.state.subscribeTrigger(k, triggerCallback);

            // Add details to trigger
            let trigger = this.__node.state.getTrigger(k,sub);
            trigger.source = this.__node.tag;
            if(key) trigger.key = key;
            trigger.target = setTarget(callback) // Non-string value
            if(bound) trigger.bound = bound;

            return sub
        }

        const subscribeToGraph = (callback) => {
            let fn = this.__node.graph.get(callback);
            if(!fn && callback.includes('.')) {
                let n = this.__node.graph.get(callback.substring(0,callback.lastIndexOf('.')))
                let key = callback.substring(callback.lastIndexOf('.')+1);
                if(n && typeof n[key] === 'function') callback = (...args) => { return n[key](...args); };
                //console.log(n, fn);
            }
        }

        if(key) {
           // console.log(key,this.__node.tag, 'callback:', callback);
            if(!this.__node.localState) {
                this.__addLocalState(this);
            }
             
            if(typeof callback === 'string') {
                if(typeof this[callback] === 'function') callback = this[callback];
                else if(this.__node.graph) subscribeToGraph(callback)
            }
            let sub;
            
            let k = subInput ? this.__node.unique+'.'+key+'input' : this.__node.unique+'.'+key;

            if(typeof callback === 'function') sub = subscribeToFunction(k)
            else if((callback as GraphNode)?.__node) sub = subscribeToFunction(k, 
                (callback, target) => target ? target : (callback as GraphNode).__node.unique,
                (state:any)=>{ if((callback as any).__operator) (callback as any).__operator(state); }
            )

            return sub;
        }
        else {

            // Get node based on the graph
            if(typeof callback === 'string') {
                if(this.__node.graph) callback = this.__node.graph.get(callback);
                else callback = this.__node.graph.nodes.get(callback);
            }

            let sub;
            let k = subInput ? this.__node.unique+'input' : this.__node.unique;
            if(typeof callback === 'function') sub = subscribeToFunction(k)
            else if((callback as GraphNode)?.__node) sub = subscribeToFunction(k, 
                (callback, target) => target ? target : (callback as GraphNode).__node.unique,
                (state:any)=>{ if((callback as any).__operator) (callback as any).__operator(state); }
            )

            return sub;
        }
    }
    
    //unsub the callback
    __unsubscribe = (sub?:number, key?:string, subInput?:boolean) => {

        if(key) {
            return this.__node.state.unsubscribeTrigger(subInput ? this.__node.unique+'.'+key+'input' : this.__node.unique+'.'+key, sub);
        }
        else return this.__node.state.unsubscribeTrigger(subInput ? this.__node.unique+'input' : this.__node.unique, sub);
        
    }

    __setOperator = (fn:(...args:any[])=>any) => {
        fn = fn.bind(this);
        this.__operator = (...args) => {
            if(this.__node.inputState) this.__node.state.setValue(this.__node.unique+'input',args);
            let result = fn(...args);
            if(this.__node.state.triggers[this.__node.unique]) { //don't set state (i.e. copy the result) if no subscriptions
                if(typeof result?.then === 'function') {
                    result.then((res)=>{ if(res !== undefined) this.__node.state.setValue( this.__node.unique,res ) }).catch(console.error);
                } else if(result !== undefined) this.__node.state.setValue(this.__node.unique,result);
            }
            return result;
        } 

        if(!this.__subscribedToParent) {
            if(this.__parent instanceof GraphNode && this.__parent.__operator) {
                let sub = this.__parent.__subscribe(this);
                let ondelete = () => { this.__parent?.__unsubscribe(sub);}
                this.__addOndisconnected(ondelete);
                this.__subscribedToParent = true;
            }
        }

        return this.__operator;
    }

    __addLocalState(props?:{[key:string]:any}) {
        if(!props) return;
        if(!this.__node.localState) {
            this.__node.localState = {};
        }
        let localState = this.__node.localState;
        for (let k in props) {
            if(this.__props && this.__props[k]) continue; //already given a local state, continue
            if(typeof props[k] === 'function') {
                if(!k.startsWith('_')) {
                    let fn = props[k].bind(this) as Function;
                    props[k] = (...args) => { //all functions get state functionality when called, incl resolving async results for you
                        if(this.__node.inputState) this.__node.state.setValue(this.__node.unique+'.'+k+'input',args);
                        let result = fn(...args);
                        if(typeof result?.then === 'function') {
                            if(this.__node.state.triggers[this.__node.unique+'.'+k]) result.then((res)=>{ this.__node.state.setValue( this.__node.unique+'.'+k, res ) }).catch(console.error);
                        } else if(this.__node.state.triggers[this.__node.unique+'.'+k]) this.__node.state.setValue(this.__node.unique+'.'+k,result);
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
                        localState[k] = v;
                        if(this.__node.state.triggers[this.__node.unique+'.'+k]) this.__node.state.setValue(this.__node.unique+'.'+k,v); //this will update localState and trigger local key subscriptions
                    },
                    enumerable: true,
                    configurable: true
                } as any;

                Object.defineProperty(this, k, definition);
                
                if(typeof this.__node.initial === 'object') {
                    let dec = Object.getOwnPropertyDescriptor(this.__node.initial,k);
                    if(dec === undefined || dec?.configurable) {
                        Object.defineProperty(this.__node.initial, k, definition);
                    }
                }
            }
        }
    }

    //we can proxy an original object and function outputs on the node
    __proxyObject = (obj) => {
        
        let allProps = getAllProperties(obj);

        for(const k of allProps) {
            if(typeof this[k] === 'undefined') {
                if(typeof obj[k] === 'function') {
                    this[k] = (...args) => { //all functions get state functionality when called, incl resolving async results for you
                        if(this.__node.inputState) this.__node.state.setValue(this.__node.unique+'.'+k+'input',args);
                        let result = obj[k](...args);
                        if(this.__node.state.triggers[this.__node.unique+'.'+k]) {
                            if(typeof result?.then === 'function') {
                                result.then((res)=>{ this.__node.state.setValue( this.__node.unique+'.'+k, res ) }).catch(console.error);
                            } else this.__node.state.setValue(this.__node.unique+'.'+k,result);
                        }
                        return result;
                    }
                } else {

                    let definition = {
                        get:()=>{return obj[k]},
                        set:(value) => { 
                            obj[k] = value;
                            if(this.__node.state.triggers[this.__node.unique+'.'+k]) this.__node.state.setValue(this.__node.unique+'.'+k,value);
                        },
                        enumerable: true,
                        configurable: true
                    }

                    Object.defineProperty(this, k, definition);
                }
            }  
        }
    }

    __addOnconnected(callback:(node)=>void) {
        if(Array.isArray(this.__ondisconnected)) { this.__onconnected.push(callback); }
        else if (typeof this.__onconnected === 'function') { this.__onconnected = [callback,this.__onconnected] }
        else this.__onconnected = callback;
    }

    __addOndisconnected(callback:(node)=>void) {
        if(Array.isArray(this.__ondisconnected)) { this.__ondisconnected.push(callback); }
        else if (typeof this.__ondisconnected === 'function') { this.__ondisconnected = [callback,this.__ondisconnected] }
        else this.__ondisconnected = callback;
    }

    __callConnected(node=this) {
        if(typeof this.__onconnected === 'function') { this.__onconnected(this); }
        else if (Array.isArray(this.__onconnected)) { this.__onconnected.forEach((o:Function) => { o(this); }) }
    }

    __callDisconnected(node=this) {
        if(typeof this.__ondisconnected === 'function') this.__ondisconnected(this);
        else if (Array.isArray(this.__ondisconnected)) { this.__ondisconnected.forEach((o:Function) => {o(this)}); }
    }

}

export class Graph {

    [key:string]:any;

    __node:{
        tag:string,
        state:EventHandler,
        nodes:Map<string,GraphNode|any>
        [key:string]:any
    } = {
        tag:`graph${Math.floor(Math.random()*1000000000000000)}`,
        nodes:new Map(),
        state,
        // addState:true //apply the addLocalState on node init 
        // mapGraphs:false //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
        // tree:undefined as any,
        // loaders:undefined as any,
    }


    constructor(
        options?:GraphOptions
    ) {
        this.init(options);
    }

    init = (options:GraphOptions) => {
        if(options) {
            recursivelyAssign(this.__node, options); //assign loaders etc
            if(options.tree) this.setTree(options.tree);
        }
    }

    setTree = (tree:{[key:string]:any}) => {

        this.__node.tree = Object.assign(this.__node.tree ? this.__node.tree : {}, tree);

        let cpy = Object.assign({},tree);
        if(cpy.__node) delete cpy.__node; //we can specify __node behaviors on the tree too to specify listeners

        let listeners = this.recursiveSet(cpy,this,undefined,tree);

        //make the tree a node 
        if(tree.__node) {
            if(!tree.__node.tag) tree.__node._tag = `tree${Math.floor(Math.random()*1000000000000000)}`
            else if (!this.get(tree.__node.tag)) {
                let node = new GraphNode(tree,this,this); //blank node essentially for creating listeners
                this.set(node.__node.tag,node);
                for(const l in this.__node.loaders) { this.__node.loaders[l](node,this,this,tree,tree,tree.__node.tag); } //run any passes on the nodes to set things up further
                if(node.__listeners) {
                    listeners[node.__node.tag] = node.__listeners;
                } //now the tree can specify nodes
            }
        }

        //now setup event listeners
        this.setListeners(listeners);

        return cpy; //should be the node tree

    }

    setLoaders = (loaders:{[key:string]:(node:GraphNode,parent:Graph|GraphNode,graph:Graph,tree:any,props:any,key:string)=>void}, replace?:boolean) => {
        if(replace)  this.__node.loaders = loaders;
        else Object.assign(this.__node.loaders,loaders);

        return this.__node.loaders;
    }

    add = (properties:any, parent?:GraphNode|string) => {

        let listeners = {}; //collect listener props declared
        if(typeof parent === 'string') parent = this.get(parent);
        if(typeof properties === 'function') properties = { __operator:properties }; 
        else if (typeof properties === 'string') properties = this.__node.tree[properties];
        let p = Object.assign({},properties); //make sure we don't mutate the original object
        if(!p.__node) p.__node = {};
        p.__node.initial = properties;

        if(typeof properties === 'object' && (!p?.__node?.tag || !this.get(p.__node.tag))) {
            let node = new GraphNode(p, parent as GraphNode, this);
            this.set(node.__node.tag,node);
            for(const l in this.__node.loaders) { this.__node.loaders[l](node,parent,this,this.__node.tree,properties); } //run any passes on the nodes to set things up further
            this.__node.tree[node.__node.tag] = properties; //reference the original props by tag in the tree for children
            //console.log('old:',properties.__node,'new:',node.__node);
            
            if(node.__listeners) {
                listeners[node.__node.tag] = node.__listeners;
            }
    
            if(node.__children) {
                node.__children = Object.assign({},node.__children);
                this.recursiveSet(node.__children, node, listeners,node.__children);
            }
    
            //now setup event listeners
            this.setListeners(listeners);
    
            node.__callConnected();

            return node;

        }

        return;
    }

    recursiveSet = (t,parent,listeners={},origin) =>  {
        let keys = Object.getOwnPropertyNames(origin);
        for(const key of keys) {
            if(key.includes('__')) continue;
            let p = origin[key];
            if(Array.isArray(p)) continue;
            if(typeof p === 'function') p = { __operator:p }; 
            else if (typeof p === 'string') p = this.__node.tree[p];
            else if (typeof p === 'boolean') p = this.__node.tree[key];
            if(typeof p === 'object') {
                p = Object.assign({},p); //make sure we don't mutate the original object
                if(!p.__node) p.__node = {};
                if(!p.__node.tag) p.__node.tag = key;
                p.__node.initial = t[key];
                if((this.get(p.__node.tag) && !(parent?.__node && this.get(parent.__node.tag + '.' + p.__node.tag))) || (parent?.__node && this.get(parent.__node.tag + '.' + p.__node.tag))) continue; //don't duplicate a node we already have in the graph by tag
                let node = new GraphNode(p,parent,this);
                this.set(node.__node.tag,node);
                for(const l in this.__node.loaders) { this.__node.loaders[l](node,parent,this,t,t[key],key); } //run any passes on the nodes to set things up further
                t[key] = node; //replace child with a graphnode
                this.__node.tree[node.__node.tag] = p; //reference the original props by tag in the tree for children
                if(node.__listeners) {
                    listeners[node.__node.tag] = node.__listeners;
                }
                if(node.__children) {
                    node.__children = Object.assign({},node.__children);
                    this.recursiveSet(node.__children, node, listeners,node.__children);
                }

                node.__callConnected();
            }
        } 
        return listeners;
    }

    remove = (node:GraphNode|string, clearListeners:boolean=true) => {
        this.unsubscribe(node);

        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            this.delete(node.__node.tag);
            delete this.__node.tree[node.__node.tag];

            if(clearListeners) {
                this.clearListeners(node);
            }

            node.__callDisconnected();
 
            const recursiveRemove = (t) => {
                for(const key in t) {
                    this.unsubscribe(t[key]);
                    this.delete(t[key].__node.tag);
                    delete this.__node.tree[t[key].__node.tag]
                    this.delete(key);
                    delete this.__node.tree[key]

                    //console.log(key, 'removing child',t[key]);
                    t[key].__node.tag = t[key].__node.tag.substring(t[key].__node.tag.lastIndexOf('.')+1);

                    if(clearListeners) {
                        this.clearListeners(t[key]);
                    }

                    t[key].__callDisconnected();
                   
                    if(t[key].__children) {
                        recursiveRemove(t[key].__children);
                    }

                   // console.log('removed!', t[key])
                } 
            }

            if(node.__children) {
                recursiveRemove(node.__children);
            }
        }

        if((node as any)?.__node.tag && (node as any)?.__parent) {
            delete (node as any)?.__parent;
            (node as any).__node.tag = (node as any).__node.tag.substring((node as any).__node.tag.indexOf('.')+1);
        }

        return node;
    }

    run = (node:string|GraphNode, ...args:any[]) => {
        if(typeof node === 'string') {
            let nd = this.get(node);
            if(!nd && node.includes('.')) {
                nd = this.get(node.substring(0,node.lastIndexOf('.')));
                if(typeof nd?.[node.substring(node.lastIndexOf('.')+1)] === 'function') return nd[node.substring(node.lastIndexOf('.')+1)](...args);
            } else if(nd?.__operator) return nd.__operator(...args);
        }
        if((node as GraphNode)?.__operator) {
            return (node as GraphNode)?.__operator(...args);
        }
    }

    setListeners = (listeners:{[key:string]:{[key:string]:any}}) => {
        //now setup event listeners
        for(const key in listeners) {
            let node = this.get(key);
            if(typeof listeners[key] === 'object') {
                for(const k in listeners[key]) {
                    let n = this.get(k);
                    let sub;
                    if( typeof listeners[key][k] !== 'object' ) listeners[key][k] = { callback:listeners[key][k] };
                    if( typeof listeners[key][k].callback === 'function') listeners[key][k].callback = listeners[key][k].callback.bind(node);
                    if(typeof node.__listeners !== 'object') node.__listeners = {}; //if we want to subscribe a node with listeners that doesn't predeclare them
                    if(!n) {
                        let tag = k.substring(0,k.lastIndexOf('.'));
                        n = this.get(tag);
                        if(n) {
                            sub = this.subscribe(n,  listeners[key][k].callback, k.substring(k.lastIndexOf('.')+1), listeners[key][k].inputState, key, k);
                            if(typeof node.__listeners[k] !== 'object') node.__listeners[k] = { callback: listeners[key][k].callback, inputState:listeners[key][k]?.inputState };
                            node.__listeners[k].sub = sub;
                        }
                    } else {
                        sub = this.subscribe(n, listeners[key][k].callback, undefined, listeners[key][k].inputState, key, k);
                        if(typeof node.__listeners[k] !== 'object') node.__listeners[k] = { callback: listeners[key][k].callback, inputState: listeners[key][k]?.inputState };
                        node.__listeners[k].sub = sub;
                    }
                    //console.log(sub);
                }
            }
        }
    }

    clearListeners = (node:GraphNode|string,listener?:string) => {
        if(typeof node === 'string') node = this.get(node) as GraphNode;
        if(node?.__listeners) {
            //console.log(node?.__listeners);
            //console.log(node.__listeners);
            for(const key in node.__listeners) {
                if(listener && key !== listener) continue; 
                if(typeof node.__listeners[key].sub !== 'number') continue;
                let n = this.get(key);
                if(!n) {
                    n = this.get(key.substring(0,key.lastIndexOf('.')));
                    //console.log(key.substring(0,key.lastIndexOf('.')),key,n,node.__listeners[key]);
                    if(n) this.unsubscribe(n,node.__listeners[key].sub, key.substring(key.lastIndexOf('.')+1), node.__listeners[key].inputState);
                } else {
                    this.unsubscribe(n,node.__listeners[key].sub, undefined, node.__listeners[key].inputState);
                }

                //console.log('unsubscribed', key)
                delete node.__listeners[key];
            }
        }
    }

    get = (tag:string) => { return this.__node.nodes.get(tag); };
    set = (tag:string,node:GraphNode) => { return this.__node.nodes.set(tag,node); };
    delete = (tag:string) => { return this.__node.nodes.delete(tag); }

    getProps = (node:GraphNode|string, getInitial?:boolean) => {
        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            
            let cpy;
            if(getInitial) cpy = Object.assign({}, this.__node.tree[node.__node.tag]);
            else {
                cpy = Object.assign({},node) as any;
                //remove graphnode methods to return the arbitrary props
                delete cpy.__unsubscribe;
                delete cpy.__setOperator;
                delete cpy.__node;
                delete cpy.__subscribeState;
                delete cpy.__subscribe;
            }
        }
    }

    subscribe = (
        node:GraphNode|string, callback:string|GraphNode|((res:any)=>void), key?:string|undefined, subInput?:boolean, target?:string, bound?:string
    ) => {

        let nd = node;
        if(!(node instanceof GraphNode)) nd = this.get(node);

        let sub;

        if(typeof callback === 'string') {

            //console.log(node, callback, this.__node.nodes.keys());

            if(target) {
                let method = this.get(target)?.[callback];
                if(typeof method === 'function') callback = method;
            } else callback = this.get(callback)?.__operator;
        } 

        if(nd instanceof GraphNode) {
            sub = nd.__subscribe(callback,key,subInput,target,bound);
           
            let ondelete = () => {
                (nd as GraphNode).__unsubscribe(sub,key,subInput);
            }

            nd.__addOndisconnected(ondelete);
        } else if (typeof node === 'string') {
            if(this.get(node)) {
                if(callback instanceof GraphNode && callback.__operator) {
                    sub = (this.get(node) as GraphNode).__subscribe(callback.__operator,key,subInput,target,bound); 
                    let ondelete = () => {
                        this.get(node).__unsubscribe(sub)
                        //console.log('unsubscribed', key)
                    }
        
                    callback.__addOndisconnected(ondelete);
                }
                else if (typeof callback === 'function' || typeof callback === 'string') {
                    sub = (this.get(node) as GraphNode).__subscribe(callback,key,subInput,target,bound); 
                    
                    this.__node.state.getTrigger(this.get(node).__node.unique,sub).source = node;
                }
            } else {
                if(typeof callback === 'string') callback = this.__node.nodes.get(callback).__operator; 
                if(typeof callback === 'function') sub = this.__node.state.subscribeTrigger(node, callback);
            }
        }
        return sub;
    }

    unsubscribe = ( node:GraphNode|string, sub?:number, key?:string, subInput?:boolean) => {
        if(node instanceof GraphNode) {
            return node.__unsubscribe(sub,key,subInput);
        }
        else return this.get(node)?.__unsubscribe(sub,key,subInput);
    }

    setState = (update:{[key:string]:any}) => {
        this.__node.state.setState(update);
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
            //if(typeof target[key] === 'function') target[key] = target[key].bind(this);
        }
    }

    return target;
}


export function getAllProperties(obj){ //https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
    var allProps = [], curr = obj
    do{
        var props = Object.getOwnPropertyNames(curr)
        props.forEach(function(prop){
            if (allProps.indexOf(prop) === -1)
                allProps.push(prop)
        })
    }while(curr = Object.getPrototypeOf(curr))
    return allProps;
}

export function instanceObject(obj) {
    let props = getAllProperties(obj); //e.g. Math
    let instance = {};
    for(const key of props) {
        instance[key] = obj[key];
    }

    return instance;
    //simply copies methods, nested objects will not be instanced to limit recursion
}