//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import { EventHandler } from "./services/EventHandler";

export const state = new EventHandler();


export type GraphNodeProperties = {
    __operator?:((...args:any[])=>any)|string,
    __children?:{[key:string]:GraphNodeProperties},
    __listeners?:{[key:string]:((result)=>void)|{callback:(result)=>void}},
    __node?:{
        tag?:string,
        state?:EventHandler,
        oncreate?:Function|Function[],
        ondelete?:Function|Function[],
        inputState?:boolean //we can track inputs on a node, subscribe to state with 'input' on the end of the tag or 'tag.prop' 
        [key:string]:any
    },
    [key:string]:any
}

export type GraphProperties = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:{node:GraphNode,parent:Graph|GraphNode,graph:Graph,tree:any,properties:GraphNodeProperties}},
    state?:EventHandler,
    childrenKey?:string,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}

export type GraphOptions = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:(node:GraphNode,parent:Graph|GraphNode,graph:Graph,tree:any,properties:GraphNodeProperties)=>void},
    state?:EventHandler,
    childrenKey?:string,
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
        // events: undefined as any,
        // oncreate:undefined as any, //function or array of functions
        // ondelete:undefined as any, //function or array of functions
        // listeners:undefined as any, //e.g. { 'nodeA.x':(newX)=>{console.log('nodeA.x changed:',x)}  }
        // source:undefined as any// source graph if a graph is passed as properties
    }

    __children?;
    __operator?;
    __listeners?;

    [key:string]:any
    
    //pass GraphNodeProperties, functions, or tags of other nodes
    constructor(properties:any, parent?:{[key:string]:any}, graph?:Graph) {

        if(typeof properties === 'function') {
            properties = {
                __operator:properties,
                __node:{
                    tag:properties.name
                }
            };
        } else if (typeof properties === 'string') {
            if(graph?.get(properties)) {
                properties = graph.get(properties);
            }
        }
        
        if(typeof properties === 'object') {
            if (typeof properties.__node === 'string') {
                //copy
                if(graph?.get(properties.__node)) {
                    properties = graph.get(properties.__node);
                } else properties.__node = {}
            } else if(!properties.__node) properties.__node = {};

            if(!properties.__node?.parent && parent) properties.__parent = parent;
            if(graph) properties.__node.graph = graph;

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
                    properties.__node.nodes.forEach((n) => {parent.__node.nodes.set(properties.__node.tag+'.'+n.__node.tag,n)});

                    let ondelete = () => { properties.__node.nodes.forEach((n) => {parent.__node.nodes.delete(properties.__node.tag+'.'+n.__node.tag)}); }
                    if(Array.isArray(this.__node.ondelete)) { this.__node.ondelete.push(ondelete); }
                    else if (this.__node.ondelete) { this.__node.ondelete = [ondelete,this.__node.ondelete] }
                    else this.__node.ondelete = [ondelete];

                }
            }

            properties.__node.initial = properties; //original object or function

            properties.__node = Object.assign(this.__node,properties.__node);
            Object.assign(this,properties);

            if(properties.__operator && parent instanceof GraphNode && parent.__operator) {
                let sub = parent.__subscribe(this);
                let ondelete = () => { parent?.__unsubscribe(sub);}
                if(Array.isArray(this.__node.ondelete)) { this.__node.ondelete.push(ondelete); }
                else if (this.__node.ondelete) { this.__node.ondelete = [ondelete,this.__node.ondelete] }
                else this.__node.ondelete = [ondelete];
            }
            if(properties instanceof Graph) this.__node.source = properties; //keep tabs on source graphs passed to make nodes

            if(!graph) {
                if(typeof this.__node.oncreate === 'function') { this.__node.oncreate(this); }
                else if (Array.isArray(this.__node.oncreate)) { this.__node.oncreate.forEach((o:Function) => { o(this); }) }
            }
        }
    }

    //subscribe an output or input with an arbitrary callback
    __subscribe = (callback:string|GraphNode|((res)=>void), key?:string, subInput?:boolean) => {
        if(key) {
            if(!this.__node.localState) {
                this.__addLocalState(this);
            }
             
            if(typeof callback === 'string') {
                if(this.__node.graph) callback = this.__node.graph.get(callback);
                else callback = this.__node.graph.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this.__node.events.subscribeTrigger(subInput ? key+'input' : key, callback);
            } else if((callback as GraphNode)?.__node) return this.__node.events.subscribeTrigger(subInput ? key+'input' : key, (state:any)=>{ if((callback as any).__operator) (callback as any).__operator(state); })
            
        }
        else {
            if(typeof callback === 'string') {
                if(this.__node.graph) callback = this.__node.graph.get(callback);
                else callback = this.__node.graph.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this.__node.state.subscribeTrigger(subInput ? this.__node.tag+'input' : this.__node.tag, callback);
            } else if((callback as GraphNode)?.__node) return this.__node.state.subscribeTrigger(subInput ? this.__node.tag+'input' : this.__node.tag, (res:any)=>{ if((callback as any).__operator) (callback as any).__operator(res); })
        
        }
    }

    __subscribeState = (callback:string|GraphNode|((res)=>void)) => {
        if(typeof callback === 'string') {
            if(this.__node.graph) callback = this.__node.graph.get(callback);
            else callback = this.__node.graph.nodes.get(callback);
        }
        if(typeof callback === 'function') {
            return this.__node.state.subscribeTrigger(this.__node.unique, callback);
        } else if((callback as GraphNode)?.__node) return this.__node.state.subscribeTrigger(this.__node.unique, (state:any)=>{ if((callback as any)?.__operator) (callback as any).__operator(state); })
        
    }
    
    //unsub the callback
    __unsubscribe = (sub?:number, key?:string, subInput?:boolean) => {
        if(key && this.__node.events) return this.__node.events.unsubscribeTrigger(subInput ? key+'input' : key, sub);
        else return this.__node.state.unsubscribeTrigger(subInput ? this.__node.tag+'input' : this.__node.tag, sub);
    }

    __setOperator = (fn:(...args:any[])=>any) => {
        fn = fn.bind(this);
        this.__operator = (...args) => {
            if(this.__node.inputState) this.__node.events.setValue(this.__node.tag+'input',args);
            let result = fn(...args);
            if(typeof result?.then === 'function') {
                result.then((res)=>{ if(res !== undefined) this.__node.state.setValue( this.__node.tag,res ) }).catch(console.error);
            } else if(result !== undefined) this.__node.state.setValue(this.__node.tag,result);
            return result;
        } 
        this.default = this.__operator; //for escode related stuff
        if(typeof this.__node.initial === 'object') this.__node.initial.default = this.__operator;

        return this.__operator;
    }

    
// added to GraphNode and Graph
__addLocalState(props?:{[key:string]:any}) {
    if(!props) return;
    if(!this.__node.localState) {
        this.__node.localState = {};
    }
    if(!this.__node.events) {
        this.__node.events = new EventHandler(this.__node.localState);
    }
    let localState = this.__node.localState;
    for (let k in props) {
        if(typeof props[k] === 'function') {
            if(!k.startsWith('_')) {
                let fn = props[k].bind(this) as Function;
                props[k] = (...args) => { //all functions get state functionality when called, incl resolving async results for you
                    if(this.__node.inputState) this.__node.events.setValue(k+'input',args);
                    let result = fn(...args);
                    if(typeof result?.then === 'function') {
                        result.then((res)=>{ this.__node.events.setValue( k, res ) }).catch(console.error);
                    } else this.__node.events.setValue(k,result);
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
                    if(this.__node.state.triggers[this.__node.unique]) {
                        this.__node.state.setValue(this.__node.unique,this); //trigger subscriptions, if any
                    }
                    this.__node.events.setValue(k,v); //this will update localState and trigger local key subscriptions
                },
                enumerable: true,
                configurable: true
            } as any;

            Object.defineProperty(this, k, definition);
            
            const ogProps = this.__node.initial;
            let dec = Object.getOwnPropertyDescriptor(ogProps,k);
            if(dec === undefined || dec?.configurable) Object.defineProperty(ogProps, k, definition);
        }
    }
}
}

export class Graph {

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
        // childrenKey:undefined as any
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
        delete cpy.__node; //we can specify __node behaviors on the tree too to specify listeners

        let listeners = this.recursiveSet(cpy,this);

        //make the tree a node 
        if(tree.__node) {
            if(!tree.__node.tag) tree.__node._tag = `tree${Math.floor(Math.random()*1000000000000000)}`
            else if (!this.get(tree.__node.tag)) {
                let node = new GraphNode(tree,this,this); //blank node essentially for creating listeners
                for(const l in this.__node.loaders) { this.__node.loaders[l](node,this,this,tree,tree); } //run any passes on the nodes to set things up further
                this.__node.nodes.set(node.__node.tag,node);
                if(node.__listeners) {
                    listeners[node.__node.tag] = node.__listeners;
                } //now the tree can specify nodes
            }
        }

        //now setup event listeners
        this.setListeners(listeners);

    }

    setLoaders = (loaders:{[key:string]:(node:GraphNode,parent:Graph|GraphNode,graph:Graph,tree:any,props:any)=>void}, replace?:boolean) => {
        if(replace)  this.__node.loaders = loaders;
        else Object.assign(this.__node.loaders,loaders);

        return this.__node.loaders;
    }

    add = (properties:any, parent?:GraphNode|string) => {

        let listeners = {}; //collect listener props declared

        if(typeof parent === 'string') parent = this.get(parent);
        let props = Object.assign({},properties); if(properties.__node) props.__node = Object.assign({},properties.__node);
        
        if(!props.__node?.tag || !this.get(props.__node.tag)) {
            let node = new GraphNode(props, parent as GraphNode, this);
            for(const l in this.__node.loaders) { this.__node.loaders[l](node,parent,this,this.__node.tree,properties); } //run any passes on the nodes to set things up further
            this.__node.nodes.set(node.__node.tag,node);
            this.__node.tree[node.__node.tag] = properties; //reference the original props by tag in the tree for children
            //console.log('old:',properties.__node,'new:',node.__node);
            
            if(node.__listeners) {
                listeners[node.__node.tag] = node.__listeners;
            }
    
            if(node.__children) {
                node.__children = Object.assign({},node.__children);
                this.recursiveSet(node.__children, node, listeners);
            }
    
            if(node.__node.tree) this.setTree(node.__node.tree);
    
            //now setup event listeners
            this.setListeners(listeners);
    
            if(typeof node.__node.oncreate === 'function') { node.__node.oncreate(node); }
            else if (Array.isArray(node.__node.oncreate)) { node.__node.oncreate.forEach((o:Function) => { o(node); })} 
    
            return node;

        }

        return;
    }

    recursiveSet = (t,parent,listeners={}) =>  {
        for(const key in t) {
            let p = t[key];
            if(Array.isArray(p)) continue;
            if(typeof p === 'function') p = {__node:{ operator:p }} 
            else if (typeof p === 'string') p = this.__node.tree[p];
            else if (typeof p === 'boolean') p = this.__node.tree[key];
            // else if (typeof p.default === 'function') {
            //     p.__operator = p.default;
            // } 
            if(typeof p === 'object') {
                p = Object.assign({},p); //make sure we don't mutate the original object
                if(!p.__node) p.__node = {};
                if(!p.__node.tag) p.__node.tag = key;
                if(this.get(p.__node.tag) || (parent?.__node && this.get(parent.__node.tag + '.' + p.__node.tag))) continue; //don't duplicate a node we already have in the graph by tag
                let props = Object.assign({},p); props.__node = Object.assign({},p.__node);
                let node = new GraphNode(props,parent,this);
                for(const l in this.__node.loaders) { this.__node.loaders[l](node,parent,this,t,p); } //run any passes on the nodes to set things up further
                t[key] = node; //replace child with a graphnode
                this.__node.tree[node.__node.tag] = p; //reference the original props by tag in the tree for children
                this.set(node.__node.tag,node);
                if(node.__listeners) {
                    listeners[node.__node.tag] = node.__listeners;
                }
                else if(node.__children) {
                    node.__children = Object.assign({},node.__children);
                    this.recursiveSet(node.__children, node, listeners);
                }

                if(node.__node.tree) this.setTree(node.__node.tree);

                if(typeof node.__node.oncreate === 'function') { node.__node.oncreate(node); }
                else if (Array.isArray(node.__node.oncreate)) { node.__node.oncreate.forEach((o:Function) => { o(node); }) }
            }
        } 
        return listeners;
    }

    remove = (node:GraphNode|string, clearListeners:boolean=true) => {
        this.unsubscribe(node);

        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            this.__node.nodes.delete(node.__node.tag);
            delete this.__node.tree[node.__node.tag];

            if(clearListeners) {
                this.clearListeners(node);
            }

            if(typeof node.__node.ondelete === 'function') node.__node.ondelete(node);
            else if (Array.isArray(node.__node.ondelete)) { node.__node.ondelete.forEach((o:Function) => {o(node)}); }
 
            const recursiveRemove = (t) => {
                for(const key in t) {
                    this.unsubscribe(t[key]);
                    this.__node.nodes.delete(t[key].__node.tag);
                    delete this.__node.tree[t[key].__node.tag]
                    this.__node.nodes.delete(key);
                    delete this.__node.tree[key]

                    //console.log(key, 'removing child',t[key]);
                    t[key].__node.tag = t[key].__node.tag.substring(t[key].__node.tag.lastIndexOf('.')+1);

                    if(clearListeners) {
                        this.clearListeners(t[key]);
                    }

                    if(typeof t[key]?.__node?.ondelete === 'function') t[key].__node.ondelete(t[key]);
                    else if (Array.isArray(t[key]?.__node.ondelete)) { t[key]?.__node.ondelete.forEach((o:Function) => {o(node)}); }
                   
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

    removeTree = (tree:any) => {}

    run = (node:string|GraphNode, ...args:any[]) => {
        if(typeof node === 'string') node = this.get(node);
        if((node as GraphNode)?.__operator) {
            return (node as GraphNode)?.__operator(...args);
        }
    }

    setListeners = (listeners:{[key:string]:{[key:string]:any}}) => {
        //now setup event listeners
        //console.log(listeners)
        for(const key in listeners) {
            let node = this.get(key);
            if(typeof listeners[key] === 'object') {
                for(const k in listeners[key]) {
                    let n = this.get(k);
                    let sub;
                    if(typeof listeners[key][k] === 'function') listeners[key][k] = { callback:listeners[key][k] };
                    listeners[key][k].callback = listeners[key][k].callback.bind(node);
                    if(typeof node.__listeners !== 'object') node.__listeners = {}; //if we want to subscribe a node with listeners that doesn't predeclare them
                    if(!n) {
                        let tag = k.substring(0,k.lastIndexOf('.'));
                        n = this.get(tag);
                        if(n) {
                            //console.log('found',n,k,key);
                            sub = this.subscribe(n, k.substring(k.lastIndexOf('.')+1), listeners[key][k].callback, listeners[key][k].inputState );
                            if(typeof node.__listeners[k] !== 'object') node.__listeners[k] = { callback: listeners[key][k].callback, inputState:listeners[key][k]?.inputState };
                            node.__listeners[k].sub = sub;
                        }
                    } else {
                        sub = this.subscribe(n, undefined, listeners[key][k].callback, listeners[key][k].inputState);
                        if(typeof node.__listeners[k] !== 'object') node.__listeners[k] = { callback: listeners[key][k].callback, inputState: listeners[key][k]?.inputState };
                        node.__listeners[k].sub = sub;
                    }
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
                    if(n) this.unsubscribe(n,key.substring(key.lastIndexOf('.')+1),node.__listeners[key].sub, node.__listeners[key].inputState);
                } else {
                    this.unsubscribe(n,undefined,node.__listeners[key].sub, node.__listeners[key].inputState);
                }

                //console.log('unsubscribed', key)
                delete node.__listeners[key];
            }
        }
    }

    get = (tag) => { return this.__node.nodes.get(tag); };
    set = (tag,node) => { this.__node.nodes.set(tag,node); };

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
        node:GraphNode|string, key:string|undefined, callback:string|GraphNode|((res:any)=>void), subInput?:boolean
    ) => {

        let nd = node;
        if(!(node instanceof GraphNode)) nd = this.get(node);

        let sub;

        //console.log(node,nd);

        if(nd instanceof GraphNode) {
            sub = nd.__subscribe(callback,key,subInput);

            let ondelete = () => {
                (nd as GraphNode).__unsubscribe(sub,key,subInput);
                //console.log('unsubscribed', key)
            }

            if(nd.__node.ondelete) {
                if(Array.isArray(nd.__node.ondelete)) {nd.__node.ondelete.push(ondelete);}
                else nd.__node.ondelete = [ondelete,nd.__node.ondelete];
            } else nd.__node.ondelete = [ondelete];
        } else if (typeof node === 'string') {
            if(typeof callback === 'string') callback = this.get(callback);
            if(callback instanceof GraphNode && callback.__operator) {
                sub = this.__node.state.subscribeTrigger(node as string, callback.__operator); 
                let ondelete = () => {
                    this.__node.state.unsubscribeTrigger(node as string,sub)
                    //console.log('unsubscribed', key)
                }
    
                if(callback.__node.ondelete) {
                    if(Array.isArray(callback.__node.ondelete)) {callback.__node.ondelete.push(ondelete);}
                    else callback.__node.ondelete = [ondelete,callback.__node.ondelete];
                } else callback.__node.ondelete = [ondelete];
            }
            else if (typeof callback === 'function') sub = this.__node.state.subscribeTrigger(node as string, callback); 
        }
        return sub;
    }

    unsubscribe = ( node:GraphNode|string, key?:string, sub?:number, subInput?:boolean) => {
        if(node instanceof GraphNode) {
            //console.log(node,node.__unsubscribe);
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

