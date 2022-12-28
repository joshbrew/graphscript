//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import { isClass } from "@babel/types";
import { EventHandler } from "./EventHandler";
import * as loaders from "./loaders";
import { recursiveSet } from "./loaders/graphscript-children-loader";
import { setListeners } from "./loaders/graphscript-listeners-loader";
import * as parsers from "./parsers";
import { isNativeClass } from "./parsers/function";
// import rootLoader from './loaders/graphscript-root-loader/index'

// const defaultLoaders = Object.values(loaders)

export const state = new EventHandler(); //default shared global state

export type GraphNodeProperties = {
    __props?:Function|GraphNodeProperties, //a class constructor function (calls 'new x()') or an object we want to proxy all of the methods on this node. E.g. an html element gains 'this' access through operators and listeners on this node.
    __operator?:((...args:any[])=>any)|string, //The 'main' function of the graph node, children will call this function if triggered by a parent. Functions passed as graphnodeproperties become the operator which can set state.
    __children?:{[key:string]:GraphNodeProperties}, //child nodes belonging to this node, e.g. for propagating results
    __listeners?:{[key:string]:true|string|((result)=>void)|{__callback:string|((result)=>void)|true,subInput?:boolean,[key:string]:any}}|{[key:string]:((result)=>void)|true|string}, //subscribe by tag to nodes or their specific properties and method outputs
    __onconnected?:((node)=>void|((node)=>void)[]), //what happens once the node is created?
    __ondisconnected?:((node)=>void|((node)=>void)[]), //what happens when the node is deleted?
    __node?:{ //node specific properties, can contain a lot more things
        tag?:string,
        state?:EventHandler, //by default has a global shared state
        [key:string]:any
    },
    [key:string]:any
}


export type Loader = (
    node:GraphNode,
    parent:Graph|GraphNode,
    graph:Graph,
    roots:any,
    properties:GraphNodeProperties,
    key:string
)=>void;

export type Loaders = {[x: string]: Loader} | Loader[]

export type GraphOptions = {
    roots?:{[key:string]:any}, //node definitions
    loaders?:{
        [key:string]:Loader|{
            init?:Loader, 
            connected?:(node)=>void, 
            disconnected?:(node)=>void}
        },
    state?:EventHandler,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}

//this is a scope
export class GraphNode {

    __node:{
        tag:string,
        unique:string,
        state:EventHandler,
        [key:string]:any
    } = { //GraphNode-specific properties 
        tag:`node${Math.floor(Math.random()*1000000000000000)}`,
        unique: `${Math.random()}`,
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

    __children?:{[key:string]:GraphNode};
    __parent?:Graph|GraphNode;
    __operator?;
    __listeners?;
    __props?;

    [key:string]:any
    
    //pass GraphNodeProperties, functions, or tags of other nodes
    constructor(properties:any, parent?:{[key:string]:any}, graph?:Graph) {

        let original = properties;
        if (typeof properties === 'function') properties = parsers.functions(properties)
        else if (typeof properties === 'string') properties = parsers.string(properties, graph)

        if (typeof properties === 'object') {
            
            // ---------- Set Root Property (uniquely needs graph and this) ----------
            properties = loaders.root.call(this, properties, original, graph)

            // ---------- Load Parent Property (uniquely needs parent) ----------
            properties = loaders.parent(properties, parent)

            // ---------- Use Other Default Loaders (properties argument only) ----------
            properties = loaders.props(properties)
            properties = loaders.operator(properties)
            properties = loaders.defaultFunction(properties)
            if (properties.default) properties.default = properties.default.bind(this) // TODO: Handle this generically for all functions somewhere else...

            properties = loaders.listeners(properties)

            // ---------- Proxy properties object with the GraphNode class ----------
            let keys = Object.getOwnPropertyNames(properties);
            for (const key of keys) {

                // Redefine graphscript properties as non-enumerable
                const isGraphScriptProperty = key.includes('__')
                if (isGraphScriptProperty) {
                    const desc = Object.getOwnPropertyDescriptor(properties, key)
                    if (desc.enumerable !== false) Object.defineProperty(properties, key, Object.assign(desc, {enumerable: false}))
                }

                // Proxy properties with getters and setters
                Object.defineProperty(this, key, {
                    get: () => properties[key],
                    set: (val) => properties[key] = val,
                    enumerable: key.includes('__') ? false : true, // hide graphscript properties
                })
            }

            // ---------- Track source graphs passed to make nodes ----------
            if (properties instanceof Graph) this.__node.source = properties;


            // ---------- Load Children as the Absolute Last Step----------
            properties = loaders.children(properties)
        }
    }

    //subscribe an output or input with an arbitrary callback
    __subscribe = (callback:string|GraphNode|((res)=>void), key?:string, subInput?:boolean, bound?:string, target?:string) => {

        const subscribeToFunction = (k, setTarget = (callback, target?) => callback, triggerCallback=callback as (res: any) => void) => {
            let sub = this.__node.state.subscribeEvent(k, triggerCallback, this, key);

            // Add details to trigger
            let trigger = this.__node.state.getEvent(k,sub);
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
            if(!this.__node.localState || !this.__node.localState[key]) this.__addLocalState(this.__node.properties,key);
             
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
    __unsubscribe = (sub?:number, key?:string, unsubInput?:boolean) => {
        if(key) return this.__node.state.unsubscribeEvent(unsubInput ? this.__node.unique+'.'+key+'input' : this.__node.unique+'.'+key, sub);
        else return this.__node.state.unsubscribeEvent(unsubInput ? this.__node.unique+'input' : this.__node.unique, sub);
    }

    __addLocalState = (props?:{[key:string]:any}, key?:string) => { //add easy state functionality to properties on this node using getters/setters or function wrappers
        if(!props) return;
        if(!this.__node.localState) {
            this.__node.localState = {};
        }
        const localState = this.__node.localState;
        const initState = (props,k) => {
            let str = this.__node.unique+'.'+k;
            let inpstr = `${str}input`; //for input tracking
            if(typeof props[k] === 'function' && k !== '__operator') {
                let fn = props[k].bind(this) as Function;
                props[k] = (...args) => { //all functions get state functionality when called, incl resolving async results for you
                    if(this.__node.state.triggers[inpstr]) this.__node.state.setValue(inpstr,args);
                    let result = fn(...args);
                    if(this.__node.state.triggers[str]) {
                        if(typeof result?.then === 'function') { //assume promise (faster than instanceof)
                            result.then((res)=>{ this.__node.state.triggerEvent( str, res ) }).catch(console.error);
                        } else this.__node.state.triggerEvent(str,result);
                    }
                    
                    return result;
                }
            } else {
                let get:()=>any, set:(v)=>void;
                if(this.__props?.[k]) {
                    get = () => {return this.__props[k];};
                    set = (v) => {
                        //if(this.__node.state.triggers[inpstr]) this.__node.state.setValue(inpstr,v);
                        this.__props[k] = v;
                        if(this.__node.state.triggers[str]) this.__node.state.triggerEvent(str,v); //this will update localState and trigger local key subscriptions
                    };
                } else {
                    localState[k] = props[k]; 
                    get = () => {return localState[k];};
                    set = (v) => {
                        //if(this.__node.state.triggers[inpstr]) this.__node.state.setValue(inpstr,v);
                        localState[k] = v;
                        if(this.__node.state.triggers[str]) this.__node.state.triggerEvent(str,v); //this will update localState and trigger local key subscriptions
                    };
                }
                //console.log(k, localState[k]);

                const descriptor = {
                    get, set,
                    enumerable: true,
                    configurable: true
                };

                Object.defineProperty(props, k, descriptor);
                
                if(typeof this.__node.initial === 'object') {
                    let dec = Object.getOwnPropertyDescriptor(this.__node.initial,k);
                    if(dec === undefined || dec?.configurable) {
                        Object.defineProperty(this.__node.initial, k, descriptor);
                    }
                }
            }
        }

        if(key) initState(props,key);
        else {for (let k in props) {initState(props,k);}}
    }
}

export class Graph {

    [key:string]:any;

    __node:{
        tag:string,
        unique:string,
        state:EventHandler,
        nodes:Map<string,GraphNode|any>,
        roots?:{[key:string]:any}
        mapGraphs?:boolean,
        loaders: Loaders,
        [key:string]:any
    } = {
        tag:`graph${Math.floor(Math.random()*1000000000000000)}`,
        unique:`${Math.random()}`,
        nodes:new Map(),
        state,
        loaders: {},
        // mapGraphs:false //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
        // roots:undefined as any,
        // loaders:undefined as any,
    }


    constructor(
        options?:GraphOptions
    ) {
        this.init(options);
    }

    init = (options:GraphOptions) => {
        if(options) {
            // if (options.loaders) options.loaders = Object.assign(options.loaders, defaultLoaders); // Merge loaders
            recursivelyAssign(this.__node, options); //assign loaders etc
            if(options.roots) this.load(options.roots);
        }
    }

    load = (roots:{[key:string]:any}) => {

        this.__node.roots = Object.assign(this.__node.roots ? this.__node.roots : {}, roots);

        let cpy = Object.assign({},roots);
        if(cpy.__node) delete cpy.__node; //we can specify __node behaviors on the roots too to specify listeners

        recursiveSet(cpy,this,roots, this);

        //make the roots a node (TODO: Make this the default behavior)
        if(roots.__node) {
            if(!roots.__node.tag) roots.__node._tag = `roots${Math.floor(Math.random()*1000000000000000)}`
            else if (!this.get(roots.__node.tag)) {
                let node = new GraphNode(roots,this,this); //blank node essentially for creating listeners
                this.set(node.__node.tag,node);     
                this.runLoaders(node);
            }
        } else if (roots.__listeners) setListeners(roots.__listeners, this)

        for (let key in roots) {
            if (!key.includes('__')) {
                const node = this.get(key)
                if (node) node.__node.callConnected()
            }
        }

        return cpy; //should be the node roots

    }

    setLoaders = (loaders:Loaders, replace?:boolean) => {
        if(replace) this.__node.loaders = loaders;
        else Object.assign(this.__node.loaders,loaders);

        return this.__node.loaders;
    }

    runLoaders = ( node ) => {
        for(const name in this.__node.loaders) { 
            const loader = this.__node.loaders[name];
            const root = node.__node
            if(typeof loader === 'object') { 
                if(loader.init) loader(root.properties);
                if(loader.connected) root.addOnConnected(loader.connect); 
                if(loader.disconnected) root.addOnDisconnected(loader.disconnect); 
            } else if (typeof loader === 'function') loader(root.properties); } //run any passes on the nodes to set things up further 
    }

    add = (properties:any, parent?:GraphNode|string) => {

        if(typeof parent === 'string') parent = this.get(parent);

        let instanced;
        if(typeof properties === 'function') {
            if(isNativeClass(properties)) { //works on custom classes
                if(properties.prototype instanceof GraphNode) { properties = properties.prototype.constructor(properties,parent,this); instanced = true; } //reinstantiate a new node with the old node's props
                else properties = new properties(); //this is a class that returns a node definition 
            } else properties = { __operator:properties };
        }
        else if (typeof properties === 'string') properties = this.__node.roots[properties];
        
        if(!instanced) {
            properties = Object.assign({},properties); //make sure we don't mutate the original object   
        }
        if(!properties.__node) properties.__node = {};
        properties.__node.initial = properties; 

        if(typeof properties === 'object' && (!properties?.__node?.tag || !this.get(properties.__node.tag))) {
            let node;
            if(instanced) node = properties;
            else node = new GraphNode(properties, parent as GraphNode, this);
            this.set(node.__node.tag,node);
            this.runLoaders(node);
            this.__node.roots[node.__node.tag] = properties; //reference the original props by tag in the roots for children
            //console.log('old:',properties.__node,'new:',node.__node);
    
            node.__node.callConnected(); // Ensure this node is initialized at the right time

            return node;

        }

        return;
    }

    remove = (node:GraphNode|string, clearListeners:boolean=true) => {
        this.unsubscribe(node);

        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            this.delete(node.__node.tag);
            delete this.__node.roots[node.__node.tag];

            if(clearListeners) {
                this.clearListeners(node);
            }

            node.__node.callDisconnected();
 
            const recursiveRemove = (t) => {
                for(const key in t) {
                    this.unsubscribe(t[key]);
                    this.delete(t[key].__node.tag);
                    delete this.__node.roots[t[key].__node.tag]
                    this.delete(key);
                    delete this.__node.roots[key]

                    //console.log(key, 'removing child',t[key]);
                    t[key].__node.tag = t[key].__node.tag.substring(t[key].__node.tag.lastIndexOf('.')+1);

                    if(clearListeners) {
                        this.clearListeners(t[key]);
                    }

                    t[key].__node.callDisconnected();
                   
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
            (node as any).__parent = null;
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
                    if(n) {
                        if(!node.__listeners[key].__callback) {
                            for(const k in node.__listeners[key]) {
                                this.unsubscribe(n,node.__listeners[key][k].sub, key.substring(key.lastIndexOf('.')+1), node.__listeners[key][k].inputState);
                            }
                        } else this.unsubscribe(n,node.__listeners[key].sub, key.substring(key.lastIndexOf('.')+1), node.__listeners[key].inputState);
                    }
                } else {
                    if(!node.__listeners[key].__callback) {
                        for(const k in node.__listeners[key]) {
                            this.unsubscribe(n,node.__listeners[key][k].sub, undefined, node.__listeners[key][k].inputState);
                        }
                    } else this.unsubscribe(n,node.__listeners[key].sub, undefined, node.__listeners[key].inputState);
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
            if(getInitial) cpy = Object.assign({}, this.__node.roots[node.__node.tag]);
            else {
                cpy = Object.assign({},node) as any;
                //remove graphnode methods to return the arbitrary props
                delete cpy.__unsubscribe;
                // delete cpy.__setOperator;
                delete cpy.__node;
                delete cpy.__subscribeState;
                delete cpy.__subscribe;
            }
        }
    }

    subscribe = (
        node:GraphNode|string, 
        callback:string|GraphNode|((res:any)=>void), 
        key?:string|undefined, 
        subInput?:boolean, 
        target?:string, bound?:string
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

            const root = nd.__node
            root.addOnDisconnected(ondelete);
        } else if (typeof node === 'string') {
            if(this.get(node)) {
                if(callback instanceof GraphNode && callback.__operator) {
                    sub = (this.get(node) as GraphNode).__subscribe(callback.__operator,key,subInput,target,bound); 
                    let ondelete = () => {
                        this.get(node).__unsubscribe(sub)
                        //console.log('unsubscribed', key)
                    }

                    const root = callback.__node
                    root.addOnDisconnected(ondelete);
                }
                else if (typeof callback === 'function' || typeof callback === 'string') {
                    sub = (this.get(node) as GraphNode).__subscribe(callback,key,subInput,target,bound); 
                    
                    this.__node.state.getEvent(this.get(node).__node.unique,sub).source = node;
                }
            } else {
                if(typeof callback === 'string') callback = this.__node.nodes.get(callback).__operator; 
                if(typeof callback === 'function') sub = this.__node.state.subscribeEvent(node, callback);
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
            if(target[key]?.constructor.name === 'Object' && !Array.isArray(target[key])) recursivelyAssign(target[key], obj[key]);
            else target[key] = recursivelyAssign({},obj[key]); 
        } else target[key] = obj[key];
    }

    return target;
}


// export function getAllProperties(obj){ //https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
//     var allProps = [], curr = obj
//     do{
//         var props = Object.getOwnPropertyNames(curr)
//         props.forEach(function(prop){
//             if (allProps.indexOf(prop) === -1)
//                 allProps.push(prop)
//         })
//     }while(curr = Object.getPrototypeOf(curr))
//     return allProps;
// }


const rawProperties = {}
const globalObjects = ['Object', 'Array', 'Map', 'Set']

export function getAllProperties( obj: any ) {

    var props: string[] = [];
    if (obj) {
        do {

            const name = obj.constructor?.name 
            const isGlobalObject = globalObjects.includes(name)
            if (globalObjects.includes(name)) {
                if (!rawProperties[name]) rawProperties[name] = [...Object.getOwnPropertyNames(globalThis[name].prototype)]
            }

            Object.getOwnPropertyNames( obj ).forEach(function ( prop ) {
                const ignore = isGlobalObject && rawProperties[name].includes(prop)
                if (isGlobalObject && rawProperties[name].includes(prop)) return; // Skip inbuilt class prototypes
                else if (obj.constructor?.name && prop === 'constructor') return; // Skip constructor
                if ( props.indexOf( prop ) === -1 ) props.push( prop )
            });
        } while ( obj = Object.getPrototypeOf( obj ));
    }

    return props;
}

export function instanceObject(obj) {
    let props = getAllProperties(obj); //e.g. Math
    let instance = {};
    for(const key of props) instance[key] = obj[key];
    return instance;
    //simply copies methods, nested objects will not be instanced to limit recursion, unless someone wants to add circular reference detection >___> ... <___< 
}

// export default Graph