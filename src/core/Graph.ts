//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import { EventHandler } from "./EventHandler";

export const state = new EventHandler(); //default shared global state


export type GraphNodeProperties = {
    __props?:Function|{[key:string]:any}|GraphNodeProperties|GraphNode, //Proxy objects or from a class constructor function (calls 'new x()') or an object we want to proxy all of the methods on this node. E.g. an html element gains 'this' access through operators and listeners on this node.
    __operator?:((...args:any[])=>any)|string, //The 'main' function of the graph node, children will call this function if triggered by a parent. Functions passed as graphnodeproperties become the operator which can set state.
    __children?:{[key:string]:any}, //child nodes belonging to this node, e.g. for propagating results
    __listeners?:{[key:string]:true|string|((result)=>void)|{__callback:string|((result)=>void)|true, subInput?:boolean,[key:string]:any}}|{[key:string]:((result)=>void)|true|string}, //subscribe by tag to nodes or their specific properties and method outputs
    __onconnected?:((node)=>void|((node)=>void)[]), //what happens once the node is created?
    __ondisconnected?:((node)=>void|((node)=>void)[]), //what happens when the node is deleted?
    __node?:{ //node specific properties, can contain a lot more things
        tag?:string,
        state?:EventHandler, //by default has a global shared state
        [key:string]:any
    },
    __args?:any[], //can structure input arguments, include '__result' when generically calling operators for where to pass the original input in in a set of arguments
    __callable?:boolean, //we can have the graphnode return itself as a callable function with private properties
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

export type Roots = {
    [key:string]:any
} //node definitions

export type GraphOptions = {
    roots?:Roots, //node definitions
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

export type argObject = {
    __input?:string|((...args)=>any), __callback:string|((...args)=>any), //interchangeable
    __args?:any[], //can use this instead of __output in general.
    __output?:string|argObject|((...args)=>any) //another way to pass args from the input/callback results
}

export type Listener = {
    __callback?:string, //prototype callback
    __args?:(argObject|Function|string)[], //prototype arguments
    sub:number,
    node:GraphNode, //owning node (source node)
    graph:Graph,    //owning graph
    source?:string, //source node (owning node)
    key?:string,    //source key
    target?:string, //target node
    tkey?:string,    //target key
    arguments?:Function[] //wrapped arguments, hot swappable
    subInput?:boolean,
    onchange:Function //internal function called by the event handler, wrapped by graphscript
}


//Call node __operators like so: let node = graph.get('abc'); let result = node(input);
export class Callable extends Function {

    __bound:Callable;
    __call:((...args:any[])=>any);
    [key:string]:any;

    constructor() {
        super('return this.__bound.__call.apply(this.__bound, arguments)')
        this.__bound = this.bind(this)
        return this.__bound;
    }

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
        unique:`${Math.floor(Math.random()*1000000000000000)}`,
        state,
        // graph: undefined as any,
        // localState: undefined as any,
        // source:undefined as any// source graph if a graph is passed as properties
    }

    __children?:{[key:string]:GraphNode};
    __parent?:Graph|GraphNode;
    __operator?;
    __listeners?;
    __props?;
    __args:any[] //can structure input arguments, include '__result' when generically calling operators for where to pass the original input in in a set of arguments
    // __onconnected:undefined as any, //function or array of functions
    // __ondisconnected:undefined as any, //function or array of functions
    [key:string]:any
    
    //pass GraphNodeProperties, functions, or tags of other nodes
    constructor(properties:GraphNodeProperties, parent?:{[key:string]:any}, graph?:Graph) {
        //super();
        this.__setProperties(properties,parent,graph);

        // Check if the properties are a function or denote the GraphNode to be callable (but all properties private!!)
        if (typeof properties === 'function' || properties?.__callable) { //assuming operator is defined
            const callableInstance = new Callable();
            callableInstance.__call = (...args) => this.__operator(...args);

            // Create a proxy to delegate function calls to callableInstance and properties to this
            const proxy = new Proxy(callableInstance, { //experimental
                get: (target, prop, receiver) => {
                    if (Reflect.has(this, prop)) {
                        return Reflect.get(this, prop, receiver);
                    }
                    return Reflect.get(target, prop, receiver);
                },
                set: (target, prop, value, receiver) => {
                    if (Reflect.has(this, prop)) {
                        return Reflect.set(this, prop, value, receiver);
                    }
                    return Reflect.set(target, prop, value, receiver);
                }
            });
            Object.setPrototypeOf(proxy,this); //pass instanceof checks

            //@ts-ignore
            return proxy;
        }
    }

    //slightly more convenient than doing this.__node.graph
    get __graph() {
        return this.__node?.graph;
    }

    set __graph(graph) {
        this.__node.graph = graph;
    }

    __setProperties = (properties, parent, graph) => {

        let enforceProperties = () => {
            let orig = properties;
            if(typeof properties === 'function') {
                if(isNativeClass(properties)) { //works on custom classes
                    //console.log(properties);
                    properties = new properties(); //this is a class that returns a node definition
                } else properties = {
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
            if(!('__node' in properties)) properties.__node = {};
            if(!properties.__node.initial) properties.__node.initial = orig; //original object or function
        }

        enforceProperties();

        if(typeof properties === 'object') {
            
            let assignState = () => {
                if(properties.__node?.state) this.__node.state = properties.__node.state; //make sure we're subscribing to the right state if we're passing a custom one in    
                else if(graph) {
                    properties.__node.state = graph.__node.state; //make sure the node has the graph's state
                }
            }

            let setProps = () => {
                if(properties.__props) { //e.g. some generic javascript object or class constructor that we want to proxy. Functions passed here are treated as constructors. E.g. pass an HTML canvas element for the node then set this.width on the node to set the canvas width  
                    if (typeof properties.__props === 'function') properties.__props = new properties.__props();
                    if (typeof properties.__props === 'object') {
                        this.__proxyObject(properties.__props);
                    }
                }
            }

            let setTag = () => {
                if(!properties.__node.tag) {
                    if(properties.__operator?.name)
                        properties.__node.tag = properties.__operator.name;
                    else 
                        properties.__node.tag = `node${Math.floor(Math.random()*1000000000000000)}`;
                }
            }


            let setNode = () => {
                if (typeof properties.__node === 'string') {
                    //copy
                    if(graph?.get(properties.__node.tag)) {
                        properties = graph.get(properties.__node.tag);
                    } else properties.__node = {}
                } else if(!properties.__node) properties.__node = {};
                if(graph) {
                    properties.__node.graph = graph;
                }
                if(properties instanceof Graph) properties.__node.source = properties; //keep tabs on source graphs passed to make nodes
            }


            let setParent = () => {
                //child/branch nodes get their parent tags prepended in their tag
                if(!properties.__parent && parent) properties.__parent = parent;
                if(parent?.__node && (!(parent instanceof Graph || properties instanceof Graph))) 
                    properties.__node.tag = parent.__node.tag + '.' + properties.__node.tag; //load parents first
                if(parent instanceof Graph && properties instanceof Graph) {
                    if(properties.__node.loaders) Object.assign(parent.__node.loaders ? parent.__node.loaders : {}, properties.__node.loaders); //let the parent graph adopt the child graph's loaders
                    if(parent.__node.mapGraphs) {
                        //do we still want to register the child graph's nodes on the parent graph with unique tags for navigation? Need to add cleanup in this case
                        properties.__node.nodes.forEach((n) => {parent.set(properties.__node.tag+'.'+n.__node.tag,n)});
                        let ondelete = () => { properties.__node.nodes.forEach((n) => {parent.__node.nodes.delete(properties.__node.tag+'.'+n.__node.tag)}); }
                        this.__addOndisconnected(ondelete);
                    }
                }
            }

            let setOp = () => {
                if(typeof properties.default === 'function' && !properties.__operator) {
                    properties.__operator = properties.default;
                } //handle a default export treated as an operator
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
                    if(properties.default) properties.default = properties.__operator;    
                }
            }

            let assignProps = () => {
                properties.__node = Object.assign(this.__node,properties.__node);
                let keys = Object.getOwnPropertyNames(properties).filter((v)=>{if(!objProps[v]) return true;});
                for(const key of keys) { if(key in properties && key !== 'name') this[key] = properties[key]; }

            }

            let bindCallbacks = () => {
                if(this.__onconnected) {
                    if(typeof this.__onconnected === 'function') {
                        this.__onconnected = this.__onconnected.bind(this);
                    } else if (Array.isArray(this.__onconnected)) {
                        this.__onconnected = this.__onconnected.map((f) => { return f.bind(this); })
                    }
                    if(typeof this.__ondisconnected === 'function') {
                        this.__ondisconnected = this.__ondisconnected.bind(this);
                    } else if (Array.isArray(this.__ondisconnected)) {
                        this.__ondisconnected = this.__ondisconnected.map((f) => { return f.bind(this); })
                    }
                }
            }


            //specific load order!!
            assignState();
            setTag();
            setProps();
            setNode();
            setParent();
            assignProps();
            bindCallbacks();
            setOp();
            
        }
    }

    //subscribe an output or input with an arbitrary callback
    __subscribe = (callback:string|GraphNode|((res)=>void), key?:string, subInput?:boolean, target?:string, tkey?:string, args?:any[], callbackStr?:string) => {

        //console.log('subbing', this.__node.tag, key)
        const subscribeToFunction = (k, setTarget = (callback, target?) => (target ? target : callback), triggerCallback=callback as (res: any) => void) => {
            
            let wrappedArgs;
            if(args) {
                let wrapped = wrapArgs(triggerCallback, args, this.__node.graph);
                triggerCallback = wrapped.__callback;
                wrappedArgs = wrapped.__args;
            }
            let sub = this.__node.state.subscribeEvent(k, triggerCallback, this, key);

            // Add details to trigger
            let trigger = this.__node.state.getEvent(k,sub) as any as Listener;
            if(!this.__listeners) this.__listeners = {};
            this.__listeners[k] = this.__node.state.triggers[k];

    
            if(!trigger) return sub;
            trigger.source = this.__node.tag; //source being subscribed too
            if(key) trigger.key = key; //source key being subscribed to
            trigger.target = setTarget(callback, target); // target is node subscribing to source
            if(tkey) trigger.tkey = tkey; //e.g. function or variable on the target receiving the subscription output
            if(subInput) trigger.subInput = subInput;
            if(args) {
                trigger.arguments = wrappedArgs; //wrapped argument functions, hot swappable
                trigger.__args = args; //prototype args
            }
            if(callbackStr) trigger.__callback = callbackStr;

            trigger.node = this;
            trigger.graph = this.__node.graph;

            return sub;
        }

        const getCallbackFromGraph = (callback) => {
            let fn = this.__node.graph.get(callback);
            if(!fn && callback.includes('.')) {
                target = callback.substring(0,callback.lastIndexOf('.'));
                let n = this.__node.graph.get(callback.substring(0,target));
                tkey = callback.lastIndexOf('.')+1;
                if(n && typeof n[key] === 'function') callback = (...args) => { return n[tkey](...args); };
                //console.log(n, fn);
            } else if (fn.__operator) {
                callback = fn.__operator;
                tkey = '__operator';
            }
            return callback;
        }

        if(key) {
           // console.log(key,this.__node.tag, 'callback:', callback);
            if(!this.__node.localState || !this.__node.localState[key]) {
                this.__addLocalState(this, key);
            }
             
            if(typeof callback === 'string') {
                callbackStr = this.__node.tag+'.'+callback;
                tkey = callback;
                if(target) {
                    if(this.__node.graph?.get(target)) {
                        let n = this.__node.graph?.get(target);
                        if(typeof n[callback] === 'function') {
                            let fn = n[callback];
                            callback = (...inp) => { fn(...inp); };
                        } else {
                            let k = callback;
                            let setter = (inp) => {
                                n[k] = inp; //this callback is now a setter for a property on the target node
                            }
                            callback = setter;
                        }
                    }
                }
                else if(typeof this[callback] === 'function') {
                    let fn = this[callback];
                    callback = (...inp) => {fn(...inp);};
                } else if(this.__node.graph?.get(callback)) callback = getCallbackFromGraph(callback);
                if(typeof callback !== 'function') return undefined;
            }

            let sub;
            
            let k = subInput ? this.__node.unique+'.'+key+'input' : this.__node.unique+'.'+key;
            if(typeof callback === 'function' && !(callback as any)?.__node) 
                sub = subscribeToFunction(k, (callback, target) => (target ? target : callback), callback as (...res:any)=>void)
            else if((callback as GraphNode)?.__node) sub = subscribeToFunction(k, 
                (callback, target) => (target ? target : (callback as GraphNode).__node.unique),
                (...inp:any)=>{ if((callback as any).__operator) (callback as any).__operator(...inp); }
            )

            return sub;
        }
        else {

            // Get node based on the graph
            if(typeof callback === 'string') {
                callbackStr = callback;
                if(!target) target = callback as string;
                if(this.__node.graph.get(callback)) callback = this.__node.graph.get(callback);
                tkey = '__operator';
                if(typeof callback !== 'object') return undefined;
            }
            
            let sub;

            let k = subInput ? this.__node.unique+'input' : this.__node.unique;

            if(typeof callback === 'function' && !(callback as any)?.__node) sub = subscribeToFunction(k, (callback, target) => (target ? target : callback), callback as (...res:any)=>void)
            else if((callback as GraphNode)?.__node) {
                sub = subscribeToFunction(k, 
                    (callback, target) => target ? target : (callback as GraphNode).__node.unique,
                    (...inp:any)=>{ if((callback as any).__operator) (callback as any).__operator(...inp); }
                );
            }

            return sub;
        }
    }
    
    //unsub the callback
    __unsubscribe = (sub?:number, key?:string, unsubInput?:boolean) => {
        
        //console.log('unsubbing', this.__node.tag, sub, key)
        if(key) { 
            return this.__node.state.unsubscribeEvent(
                unsubInput ? this.__node.unique+'.'+key+'input' : this.__node.unique+'.'+key, 
                sub
            );
        }
        else 
            return this.__node.state.unsubscribeEvent(
                unsubInput ? this.__node.unique+'input' : this.__node.unique, sub
            );
    }

    __setOperator = (fn:(...args:any[])=>any) => {
        fn = fn.bind(this);
        if(this.__args && this.__node.graph) { fn = wrapArgs(fn, this.__args, this.__node.graph).__callback; }
        let inpstr = `${this.__node.unique}input`;
        this.__operator = (...args) => {
            if(this.__node.state.triggers[inpstr]) this.__node.state.setValue(inpstr,args);
            let result = fn(...args);
            if(this.__node.state.triggers[this.__node.unique]) { //don't set state (i.e. copy the result) if no subscriptions
                if(typeof result?.then === 'function') {
                    result.then((res)=>{ if(res !== undefined) this.__node.state.setValue( this.__node.unique,res ) }).catch(console.error);
                } else if(result !== undefined) this.__node.state.setValue(this.__node.unique, result);
            }
            return result;
        } 

        if(this.__parent instanceof GraphNode && !this.__subscribedToParent) { //for child nodes
            if(this.__parent.__operator) {
                let sub = this.__parent.__subscribe(this);
                let ondelete = () => { this.__parent?.__unsubscribe(sub); delete this.__subscribedToParent;}
                this.__addOndisconnected(ondelete);
                this.__subscribedToParent = true;
            }
        }

        return this.__operator;
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
            let get:()=>any, set:(v)=>void;
            let obj, descriptor;
            if(typeof props[k] === 'function' && k !== '__operator') {
                if(this.__props?.[k]) {
                    obj = this.__props;
                }
                else {
                    obj = localState;
                }
                
                get = () => {
                    return obj[k];
                }
                set = (fn:Function) => {
                    if(!this.__props?.[k]) fn = fn.bind(this); //make sure function remains bound to node if not for a proxy
                    obj[k] = (...args) => {
                        if(this.__node.state.triggers[inpstr]) this.__node.state.setValue(inpstr,args);
                        let result = fn(...args);
                        if(this.__node.state.triggers[str]) {
                            if(typeof result?.then === 'function') { //assume promise (faster than instanceof)
                                result.then((res)=>{ this.__node.state.triggerEvent( str, res ) }).catch(console.error);
                            } else this.__node.state.triggerEvent(str,result);
                        }
                        
                        return result;
                    }
                }

                localState[k] = props[k].bind(this) as Function;

                descriptor = {
                    get, set,
                    enumerable: true,
                    configurable: true
                };

            } else if (k !== '__graph') {
                let get:()=>any, set:(v)=>void;
                let obj;
                if(this.__props?.[k]) {
                    obj = this.__props;
                } else {
                    obj = localState;
                }

                get = () => {
                    return obj[k];
                };

                set = (v) => {
                    //if(this.__node.state.triggers[inpstr]) this.__node.state.setValue(inpstr,v);
                    obj[k] = v;
                    if(this.__node.state.triggers[str]) this.__node.state.triggerEvent(str,v); //this will update localState and trigger local key subscriptions
                };

                localState[k] = props[k]; 
                //console.log(k, localState[k]);

                descriptor = {
                    get, set,
                    enumerable: true,
                    configurable: true
                };
            }
            

            Object.defineProperty(props, k, descriptor);
                
            if(typeof this.__node.initial === 'object') {
                let dec = Object.getOwnPropertyDescriptor(this.__node.initial,k);
                if(dec === undefined || dec?.configurable) {
                    Object.defineProperty(this.__node.initial, k, descriptor);
                }
            }
        }

        if(key) initState(props,key);
        else {
            for (let k in props) {initState(props,k);}
        }
    }

    //we can proxy an original object and function outputs on the node
    __proxyObject = (obj) => {
        const allProps = getAllProperties(obj);

        for(const k of allProps) {
            //if(!(k in this)) {
            const descriptor = {
                get:()=>{return obj[k]},
                set:(value) => { 
                    obj[k] = value;
                },
                enumerable: true,
                configurable: true
            }

            Object.defineProperty(this, k, descriptor);

            if(typeof this.__node.initial === 'object') {
                let dec = Object.getOwnPropertyDescriptor(this.__node.initial,k);
                if(dec === undefined || dec?.configurable) {
                    Object.defineProperty(this.__node.initial, k, descriptor);
                }
            }
            //}  
        }
    }

    __addOnconnected(callback:(node)=>void) {
        callback = callback.bind(this);
        if(Array.isArray(this.__onconnected)) { this.__onconnected.push(callback); }
        else if (typeof this.__onconnected === 'function') { this.__onconnected = [callback,this.__onconnected] }
        else this.__onconnected = callback;
    }

    __addOndisconnected(callback:(node)=>void) {
        callback = callback.bind(this);
        if(Array.isArray(this.__ondisconnected)) { this.__ondisconnected.push(callback); }
        else if (typeof this.__ondisconnected === 'function') { this.__ondisconnected = [callback,this.__ondisconnected] }
        else this.__ondisconnected = callback;
    }

    __callConnected(node=this) {
        if(typeof this.__onconnected === 'function') { this.__onconnected(this); }
        else if (Array.isArray(this.__onconnected)) { 
            let fn = (o:Function) => { o(this); }
            this.__onconnected.forEach(fn) 
        }
    }

    __callDisconnected(node=this) {
        if(typeof this.__ondisconnected === 'function') this.__ondisconnected(this);
        else if (Array.isArray(this.__ondisconnected)) { 
            let fn = (o:Function) => {o(this)};
            this.__ondisconnected.forEach(fn); 
        }
    }

}

export class Graph {

    [key:string]:any;

    __node:{
        tag:string,
        unique:string,
        state:EventHandler,
        nodes:Map<string,GraphNode|any>,
        roots:{[key:string]:any},
        mapGraphs?:boolean,
        [key:string]:any
    } = {
        tag:`graph${Math.floor(Math.random()*1000000000000000)}`,
        unique:`${Math.random()}`,
        nodes:new Map(),
        state,
        roots:{}
        // mapGraphs:false //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
        // roots:undefined as any,
        // loaders:undefined as any,
    }


    constructor(
        options?:GraphOptions
    ) {
        this.init(options);
    }

    init = (options?:GraphOptions) => {
        if(options) {
            let cpy = Object.assign({},options);
            delete cpy.roots; //prevent overflow
            recursivelyAssign(this.__node, cpy); //assign loaders etc
            if(options.roots) this.load(options.roots);
        }
    }

    load = (roots:{[key:string]:any}, overwrite = false) => {
        function recursivelyAssignChildren (target, obj, inChildren=true, top=true) {
            if(top) {
                if(!target) target = {};
                for(const key in obj) {
                    if(!key.startsWith('__') && obj[key] && typeof obj[key] === 'object') {
                        //test for node keys
                        //if(obj[key].__operator || obj[key].__node || obj[key].__props || obj[key].__children || obj[key].__parent) {
                        target[key] = obj[key];
                        if(obj[key]?.__children) {
                            recursivelyAssignChildren({},obj[key].__children,false,false);
                        }
                        //}
                    } else if(typeof obj[key] === 'function') target[key] = obj[key]; //only copy functions for now
                }
                recursivelyAssignChildren(target,obj,true,false);
            } else {
                if(obj?.__children && !inChildren) {
                    if(obj.__children?.constructor.name === 'Object') {
                        if(target.__children?.constructor.name === 'Object') 
                            target.__children = recursivelyAssignChildren(target.__children, obj.__children, true, false);
                        else target.__children = recursivelyAssignChildren({},obj.__children, true, false); 
                    } else {
                        target.__children = obj.__children;
                        //if(typeof target[key] === 'function') target[key] = target[key].bind(this);
                    }
                } else if (inChildren) {
                    for(const key in obj) {
                        if(!key.startsWith('__') && obj[key] && typeof obj[key] === 'object') {
                            //test for node keys
                            //if(obj[key].__operator || obj[key].__node || obj[key].__props || obj[key].__children || obj[key].__parent) {                            
                            target[key] = Object.assign({}, obj[key]);
                            if(obj[key]?.__children) {
                                target[key].__children = recursivelyAssignChildren({},obj[key].__children,false,false);
                            }
                            //}
                        } else if(typeof obj[key] === 'function') target[key] = obj[key]; //only copy functions for now
                    }
                }
            }

            return target;
        }
        
        this.__node.roots = recursivelyAssignChildren(this.__node.roots ? this.__node.roots : {}, roots);
        
        //console.log('ROOTS',this.__node.roots);

        let cpy = Object.assign({}, roots);
        if(cpy.__node) delete cpy.__node; //we can specify __node behaviors on the roots too to specify listeners

        let listeners = this.recursiveSet(cpy,this,undefined,roots,overwrite);

        //make the root a node 
        if(roots.__node) {
            if(!roots.__node.tag) roots.__node._tag = `roots${Math.floor(Math.random()*1000000000000000)}`;
            else if (!this.get(roots.__node.tag)) {
                let node = new GraphNode(roots,this,this); //blank node essentially for creating listeners
                this.set(node.__node.tag,node);
                
            this.runLoaders(node,this, roots, roots.__node.tag);
            if(node.__listeners) {
                    listeners[node.__node.tag] = node.__listeners;
                } //now the roots can specify nodes
            }
        } else if (roots.__listeners) {
            this.setListeners(roots.__listeners)
        }

        //now setup event listeners
        this.setListeners(listeners);

        return cpy; //should be the node roots

    }

    setLoaders = (loaders:{[key:string]:(node:GraphNode,parent:Graph|GraphNode,graph:Graph,roots:any,props:any,key:string)=>void}, replace?:boolean) => {
        if(replace)  this.__node.loaders = loaders;
        else Object.assign(this.__node.loaders,loaders);

        return this.__node.loaders;
    }

    runLoaders = (node, parent, properties, key) => {
        for(const l in this.__node.loaders) { 
            if(typeof this.__node.loaders[l] === 'object') { 
                if(this.__node.loaders[l].init) this.__node.loaders[l](node, parent, this,this.__node.roots,properties, key);
                if(this.__node.loaders[l].connected) node.__addOnconnected(this.__node.loaders[l].connect); 
                if(this.__node.loaders[l].disconnected) node.__addOndisconnected(this.__node.loaders[l].disconnect); 
        } else if (typeof this.__node.loaders[l] === 'function') this.__node.loaders[l](node, parent, this, this.__node.roots, properties, key); } //run any passes on the nodes to set things up further 
    }

    add = (properties:any, parent?:GraphNode|string, overwrite=true):GraphNode => {

        let listeners = {}; //collect listener props declared
        if(typeof parent === 'string') parent = this.get(parent);

        let instanced;
        if(typeof properties === 'function') {
            if(isNativeClass(properties)) { //works on custom classes
                if(properties.prototype instanceof GraphNode) { properties = properties.prototype.constructor(properties,parent,this); instanced = true; } //reinstantiate a new node with the old node's props
                else properties = new properties(); //this is a class that returns a node definition 
            } else properties = { __operator:properties, __callable:true };
        }
        else if (typeof properties === 'string') {
            properties = this.__node.roots[properties];
        }
        if(!properties) return;
        
        if(!instanced) {
            let keys = Object.getOwnPropertyNames(properties); //lets us copy e.g. Math
            let nonArrowFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(properties));
            keys.push(...nonArrowFunctions);
            keys = keys.filter(v => !objProps.includes(v) );
            let cpy = {};
            for(const key of keys) { cpy[key] = properties[key]; } //make sure we don't mutate the original object
            properties = cpy;
        }

        if(!properties.__node) properties.__node = {};
        properties.__node.initial = properties; 
    
        if(typeof properties === 'object' && this.get(properties.__node.tag)) {
            if(overwrite) this.remove(properties.__node.tag, true); //clear the previous node and the subscriptions
            else return;
        } else if(properties.__node.tag && this.get(properties.__node.tag)) return this.get(properties.__node.tag);
        
        let node;
        let root = recursivelyAssign({},properties,2);
        if(instanced) node = properties;
        else node = new GraphNode(properties, parent as GraphNode, this);
        this.set(node.__node.tag,node);
        this.runLoaders(node, parent, properties, node.__node.tag);
        this.__node.roots[node.__node.tag] = root; //reference the original props by tag in the roots for children
        //console.log('old:',properties.__node,'new:',node.__node);

        if(node.__children) {
            node.__children = Object.assign({},node.__children);
            this.recursiveSet(node.__children, node, listeners,node.__children);
        }
                    
        if(node.__listeners) {
            listeners[node.__node.tag] = Object.assign({},node.__listeners);
            for(const key in node.__listeners) {
                let listener = node.__listeners[key];
                if(node[key]) { //subscribe to a key on the node
                    delete listeners[node.__node.tag][key];
                    listeners[node.__node.tag][node.__node.tag+'.'+key] = listener;
                } 
                if (typeof listener === 'string') {
                    if(node.__children?.[listener]) {
                        listeners[node.__node.tag][key] = node.__node.tag+'.'+listener;
                    } else if (parent instanceof GraphNode && (parent.__node.tag === listener || (parent.__node.tag.includes('.') && parent.__node.tag.split('.').pop() === listener))) {
                        listeners[node.__node.tag][key] = parent.__node.tag;
                    }
                }
                
            }
        }

        //now setup event listeners
        this.setListeners(listeners);

        node.__callConnected();
        return node;

    }

    recursiveSet = (originCpy, parent, listeners:any={}, origin, overwrite=false) =>  {
        let keys = Object.getOwnPropertyNames(origin).filter((v) => !objProps.includes(v));
        let nonArrowFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(origin)).filter((v) => !objProps.includes(v));
        keys.push(...nonArrowFunctions); //this is weird but it works 

        for(const key of keys) {
            if(key.includes('__')) continue;
            let p = origin[key];
            if(Array.isArray(p)) continue;
            let instanced;
            if(typeof p === 'function') {
                if(isNativeClass(p)) { //works on custom classes
                    p = new p(); //this is a class that returns a node definition
                    if(p instanceof GraphNode) { p = p.prototype.constructor(p,parent,this); instanced = true; } //re-instance a new node    
                } else p = { __operator:p, __callable:true };
            } else if (typeof p === 'string') {
                if(this.__node.nodes.get(p)) p = this.__node.nodes.get(p);
                else p = this.__node.roots[p];
            } else if (typeof p === 'boolean') {
                if(this.__node.nodes.get(key)) p = this.__node.nodes.get(key);
                else p = this.__node.roots[key];
            } 

            if(p && typeof p === 'object') {
                if(!instanced && !(p instanceof GraphNode)) {
                    let ks = Object.getOwnPropertyNames(p).filter((v) => !objProps.includes(v)); //lets us copy e.g. Math
                    let nonArrowFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(p)).filter((v) => !objProps.includes(v));
                    nonArrowFunctions.splice(nonArrowFunctions.indexOf('constructor'),1);
                    ks.push(...nonArrowFunctions);
                    let cpy = {};
                    for(const key of ks) { cpy[key] = p[key]; } //make sure we don't mutate the original object
                    p = cpy;
                }
                if(!p.__node) p.__node = {};
                if(!p.__node.tag) p.__node.tag = key;
                if(!p.__node.initial) p.__node.initial = originCpy[key];
                if(overwrite && this.get(p.__node.tag)) {
                    this.remove(p.__node.tag, true); //clear the previous node
                }
                else if((
                    (
                        this.get(p.__node.tag) && 
                        !(!(parent instanceof Graph) && 
                        parent?.__node)
                    ) || 
                    (
                        parent?.__node && 
                        this.get(parent.__node.tag + '.' + p.__node.tag)
                    )
                )) continue; //don't duplicate a node we already have in the graph by tag, todo: maybe rethink this a little bit
    
                let node: GraphNode;
                let newnode = false;
                let root = recursivelyAssign({},p,2); //preserve an unwrapped prototype, as the initial props will gain the getters/setters of the node if possible
                if(instanced || p instanceof GraphNode) {
                    node = p;
                } else {
                    node = new GraphNode(p, parent as GraphNode, this); 
                    newnode = true;
                }
                if(!newnode && p instanceof GraphNode && !instanced && parent instanceof GraphNode) { //make sure this node is subscribed to the parent, can use this to subscribe a node multiple times as a child
                    let sub = this.subscribe(parent.__node.tag, node.__node.tag);
                    let ondelete = (node) => {this.unsubscribe(parent.__node.tag, sub);}
                    node.__addOndisconnected(ondelete); //cleanup sub
                } else if(node) { //fresh node, run loaders etc.
                    //console.log(node, instanced, newnode);
                    this.set(node.__node.tag,node);
                    this.runLoaders(node, parent, originCpy[key], key); //run any passes on the nodes to set things up further
                    originCpy[key] = node; //replace child with a graphnode
                    this.__node.roots[node.__node.tag] = root; //reference the original node props by tag in the root
                    
                    if(node.__children) {
                        node.__children = Object.assign({}, node.__children);
                        this.recursiveSet(node.__children, node, listeners,node.__children);
                    }

                    if(node.__listeners) {
                        listeners[node.__node.tag] = Object.assign({},node.__listeners);
                        for(const key in node.__listeners) {
                            let listener = node.__listeners[key];
                            let k = key;
                            if(node[key]) { //subscribe to a key on the node
                                delete listeners[node.__node.tag][key];
                                k = node.__node.tag+'.'+key;
                                listeners[node.__node.tag][k] = listener;
                            } 
                            if (typeof listener === 'string') {
                                if(node.__children?.[listener]) {
                                    listeners[node.__node.tag][k] = node.__node.tag+'.'+listener;
                                } else if (parent instanceof GraphNode && (parent.__node.tag === listener || (parent.__node.tag.includes('.') && parent.__node.tag.split('.').pop() === listener))) {
                                    listeners[node.__node.tag][k] = parent.__node.tag;
                                }
                            }
                        }
                    }
                    
                    node.__callConnected();
                }
            }
        } 
        return listeners;
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

            node.__callDisconnected();
 
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

                    //console.log(key,t[key].__listeners);

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

        if((node as GraphNode)?.__node.tag && (node as GraphNode)?.__parent) {
            delete (node as GraphNode)?.__parent;
            (node as GraphNode).__node.tag = (node as GraphNode).__node.tag.substring((node as GraphNode).__node.tag.indexOf('.')+1);
        }

        if((node as GraphNode)?.__node.graph) (node as GraphNode).__node.graph = undefined;

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


/**
 * 
 * Listeners are an object where each key is a node tag, and each value is an object specifying callbacks or multiple callback for events on the graph, e.g. function outputs or variable changes.
 * {
 *   [node.__node.tag (or arbitrary)]:{
 *      [node.key (key optional)]:{__callback:string|Function, __args?:[], subInput?:boolean} | Function (bound to main node tag if specified) | string
 *   }
 * }
 * 
 * __args can be strings referencing other nodes/methods or values to pass correct inputs into the callback if more than one is required, else the output of the thing listened to is used by default
 */
    setListeners = (listeners:{[key:string]:{[key:string]:any}}) => {

        /**
         * type Listener = {
         *    source: the source node (if any)
         *    key: the source key listened to (if any)
         *    target: the target node (if any),
         *    tkey: the target method key (if any)
         *    sub: the number for the subscription in state
         *    __callback:Function,
         *    __args:Function[], wrapped argument functions that get iterated over when a trigger is called
         *    arguments:any[] //the original arguments 
         * }
         */

        //now setup event listeners
        for(const key in listeners) {
            let node = this.get(key);
            if(typeof listeners[key] === 'object') {
                for(const k in listeners[key]) {
                    let n = this.get(k);
                    let sub;
                    if( typeof listeners[key][k] !== 'object' ) 
                        listeners[key][k] = { __callback:listeners[key][k] };
                    else if(!listeners[key][k].__callback) {
                        for(const kk in listeners[key][k]) {
                            if(typeof listeners[key][k][kk] !== 'object') {
                                listeners[key][k][kk] = {__callback: listeners[key][k][kk]}
                                if(node.__operator && 
                                    (listeners[key][k][kk].__callback === true || 
                                        typeof listeners[key][k][kk].__callback === 'undefined')
                                ) 
                                    listeners[key][k][kk].__callback = node.__operator;
                            }
                            let nn = this.get(kk);

                            if(!nn) {
                                let tag = k.substring(0,k.lastIndexOf('.'));
                                nn = this.get(tag);
                                if(nn) {
                                    let prop = k.substring(k.lastIndexOf('.')+1);
                                    sub = this.subscribe(
                                        nn,  
                                        listeners[key][k][kk].__callback, 
                                        listeners[key][k][kk].__args, 
                                        prop, 
                                        listeners[key][k][kk].subInput,
                                        key //if the key as the target is a node tag, this lets you specify callbacks as keys of that node so e.g. {console:{'Button.onclick':'log'}}
                                    );
                                }
                            } else {
                                sub = this.subscribe(
                                    nn, 
                                    listeners[key][k][kk].__callback, 
                                    listeners[key][k][kk].__args, 
                                    undefined, 
                                    listeners[key][k][kk].subInput,
                                    key
                                );
                                
                            }
                        }
                    }
                    if('__callback' in listeners[key][k]) {
                        if(node){
                            if(listeners[key][k].__callback === true || typeof listeners[key][k].__callback === 'undefined') listeners[key][k].__callback = node.__operator;
                            if( typeof listeners[key][k].__callback === 'function') listeners[key][k].__callback = listeners[key][k].__callback.bind(node);
                        }
                        if(!n) {
                            let tag = k.substring(0,k.lastIndexOf('.'));
                            n = this.get(tag);
                            if(n) {
                                sub = this.subscribe(
                                    n,  
                                    listeners[key][k].__callback, 
                                    listeners[key][k].__args, 
                                    k.substring(k.lastIndexOf('.')+1), 
                                    listeners[key][k].subInput,
                                    key
                                );
                                
                            }
                        } else {
                            sub = this.subscribe(
                                n, 
                                listeners[key][k].__callback, 
                                listeners[key][k].__args,  
                                undefined, 
                                listeners[key][k].subInput,
                                key
                            );
                            
                        }
                    }
                }
            }
        }
    }

    clearListeners = (node:GraphNode|string, listener?:string) => {
        if(typeof node === 'string') node = this.get(node) as GraphNode;
        if(node?.__listeners) {
            //console.log(node?.__listeners);
            for(const key in node.__listeners) {
                if(listener && key !== listener) continue; 
                if(typeof node.__listeners[key]?.sub !== 'number') continue;
                let n = this.get(key);
                if(!n) {
                    n = this.get(key.substring(0,key.lastIndexOf('.')));
                    //console.log(key.substring(0,key.lastIndexOf('.')),key,n,node.__listeners[key]);
                    if(n) {
                        if(typeof node.__listeners[key] === 'object' && !node.__listeners[key]?.__callback) {
                            for(const k in node.__listeners[key]) {
                                if(typeof node.__listeners[key][k]?.sub === 'number') {
                                    this.unsubscribe(n,node.__listeners[key][k].sub, key.substring(key.lastIndexOf('.')+1), node.__listeners[key][k].subInput);
                                    node.__listeners[key][k].sub = undefined;
                                }
                            }
                        } else if(typeof node.__listeners[key]?.sub  === 'number') {
                            this.unsubscribe(n,node.__listeners[key].sub, key.substring(key.lastIndexOf('.')+1), node.__listeners[key].subInput);
                            node.__listeners[key].sub = undefined;
                        }
                    }
                } else {
                    if(typeof !node.__listeners[key]?.__callback === 'number') {
                        for(const k in node.__listeners[key]) {
                            if(node.__listeners[key][k]?.sub) {
                                this.unsubscribe(n,node.__listeners[key][k].sub, undefined, node.__listeners[key][k].subInput);
                                node.__listeners[key][k].sub = undefined;
                            }
                        }
                    } else if(typeof node.__listeners[key]?.sub === 'number') {
                        this.unsubscribe(n,node.__listeners[key].sub, undefined, node.__listeners[key].subInput);
                        node.__listeners[key].sub = undefined;
                    }
                }
            }
        }
    }

    get = (tag:string) => { return this.__node.nodes.get(tag); };
    getByUnique = (unique:string) => { return Array.from(this.__node.nodes.values()).find((node) => { if(node.__node.unique === unique) return true; })} //just in case we want to source a node by state keys
    set = (tag:string,node:GraphNode) => { return this.__node.nodes.set(tag, node); };
    delete = (tag:string) => { return this.__node.nodes.delete(tag); }
    list = () => { return Array.from(this.__node.nodes.keys()); } //list loaded nodes
    getListener = (nodeTag:string,key?:string,sub?:number) => {
        let node = this.get(nodeTag);
        if(node) {
            let k = node.__node.unique;
            if(key) { k += '.'+key }
            return this.__node.state.getEvent(k,sub) as any as Listener;
        }
    }

    getProps = (node:GraphNode|string, getInitial?:boolean) => {
        if(typeof node === 'string') node = this.get(node);
        if(node instanceof GraphNode) {
            let cpy;
            if(getInitial) cpy = Object.assign({}, this.__node.roots[node.__node.tag]);
            else {
                cpy = Object.assign({},node) as any;
                //remove graphnode methods to return the arbitrary props
                for(const key in cpy) {
                    if(key.includes('__')) delete cpy[key]; //remove node methods
                }
            }
        }
    }

    subscribe = (
        nodeEvent:GraphNode|string, 
        onEvent:string|GraphNode|((...res:any)=>void), 
        args?:any[],
        key?:string|undefined, 
        subInput?:boolean, 
        target?:string|GraphNode,
        tkey?:string
    ) => {

        let nd = nodeEvent;
        if(typeof nodeEvent === 'string') {
            nd = this.get(nodeEvent);
            if(!nd && nodeEvent.includes('.')) {
                nd = this.get(nodeEvent.substring(0,nodeEvent.lastIndexOf('.')))
                key = nodeEvent.substring(nodeEvent.lastIndexOf('.')+1);
            }
        }

        if(target instanceof GraphNode) target = target.__node.tag;

        let callbackStr;
        if(typeof onEvent === 'string') {
            //console.log(node, callback, this.__node.nodes.keys());
            callbackStr = onEvent;
            let setOnEventFromString = (onEvent:any) => {
                if(this.get(onEvent)?.__operator) {
                    let node = this.get(onEvent);
                    target = onEvent;
                    onEvent = function(...inp) { return node.__operator(...inp); };
                } else if(onEvent.includes('.')) {
                    target = onEvent.substring(0,onEvent.lastIndexOf('.'));
                    let n = this.get(target as string);
                    let k = onEvent.substring(onEvent.lastIndexOf('.')+1);
                    tkey = k;
                    if(typeof n[k] === 'function') {
                        if(n[k] instanceof GraphNode) onEvent = n[k];
                        else onEvent = function(...inp) { return n[k](...inp); };
                    } else {
                        onEvent = function(inp) { n[k] = inp; return n[k]; }; //setter
                    }
                    //console.log(n, fn);
                } 
                return onEvent;
            }

            if(target) {
                let node = this.get(target);
                if(typeof node?.[onEvent] === 'function') {
                    tkey = onEvent;
                    onEvent = function(...inp) { return node[key](...inp)};
                } else if(node?.[key]) {
                    tkey = key;
                    if(node[key] instanceof GraphNode) onEvent = node[key];
                    else onEvent = function(inp) { node[key] = inp; return node[key]; } //setter
                } else {
                    onEvent = setOnEventFromString(onEvent);
                }
            } else {
                onEvent = setOnEventFromString(onEvent);
            }
        } 

        let sub:number;

        //TODO: clean up all this samey stuff

        if(nd instanceof GraphNode) {
            const doSub = () => {
                sub = (nd as GraphNode).__subscribe(onEvent, key, subInput, target as string, tkey, args, callbackStr);
                
                let ondelete = () => {
                    if(sub !== undefined) (nd as GraphNode).__unsubscribe(sub, key, subInput);
                    sub = undefined;
                }
    
                (nd as GraphNode).__addOndisconnected(()=>{
                    ondelete();
                    (nd as GraphNode).__addOnconnected(() => { //need to update the listener object on the listening node
                        if(sub === undefined && (nd as GraphNode).__node.graph.__node.tag === this.__node.tag) doSub();
                                
                        //console.log(key,bound,this.get(target as string).__listeners[bound]);
                    })   
                });

                if(typeof onEvent === 'string' && this.get(onEvent)) onEvent = this.get(onEvent);
                if(onEvent instanceof GraphNode) {
                    onEvent.__addOndisconnected(() => {
                        ondelete(); 
                    });
                }
            } 

            doSub();

        } else if (typeof nodeEvent === 'string') {
            let node = this.get(nodeEvent) as GraphNode;
            if(node) {
                if(onEvent instanceof GraphNode && onEvent.__operator) {
                    const doSub = () => {
                        sub = node.__subscribe((onEvent as GraphNode).__operator, key, subInput, target as string, tkey, args, callbackStr); 
                       
                        let ondelete = () => {
                            if(sub !== undefined) node.__unsubscribe(sub, key, subInput);  
                        }
            
                        node.__addOndisconnected(()=>{
                            ondelete();
                            (node as GraphNode).__addOnconnected(() => { //if reconnected
                                if(sub === undefined && node.__node.graph.__node.tag === this.__node.tag) doSub();
                            });
                        });

                        (onEvent as GraphNode).__addOndisconnected(ondelete);
                    }
                    
                    doSub();
                }
                else if (typeof onEvent === 'function' || typeof onEvent === 'string') {
                    const doSub = () => {
                        sub = node.__subscribe(onEvent, key, subInput, target as string, tkey, args, callbackStr); 

                        let ondelete = () => {
                            if(sub !== undefined) node.__unsubscribe(sub, key, subInput);
                            sub = undefined;
                        }

                        node.__addOndisconnected(()=>{
                            ondelete();
                            //console.log('unsubscribed', key)
                            (node as GraphNode).__addOnconnected(() => { //if reconnected
                                if(sub === undefined && node.__node.graph.__node.tag === this.__node.tag) doSub();
                            });
                        });
                            
                        if(typeof onEvent === 'string' && this.get(onEvent)) this.get(onEvent).__addOndisconnected(ondelete);

                    } 

                    doSub();
                }
            } else {
                if(typeof onEvent === 'string') onEvent = this.__node.nodes.get(onEvent).__operator; 
                if(typeof onEvent === 'function' && !(onEvent as any)?.__node) sub = this.__node.state.subscribeEvent(nodeEvent, onEvent as (...res:any)=>void);
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


function recursivelyAssign (target,obj, maxDepth=Infinity,curDepth=0) {
    for(const key in obj) {
        if(obj[key]?.constructor.name === 'Object' && curDepth < maxDepth) {
            curDepth++;
            if(target[key]?.constructor.name === 'Object') 
                recursivelyAssign(target[key], obj[key], maxDepth, curDepth);
            else target[key] = recursivelyAssign({},obj[key],maxDepth, curDepth); 
        } else {
            target[key] = obj[key];
            //if(typeof target[key] === 'function') target[key] = target[key].bind(this);
        }
    }

    return target;
}


export function getAllProperties(obj){ //https://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
    var allProps = [] as any[], curr = obj
    do{
        var props = Object.getOwnPropertyNames(curr);
        let fn = function(prop){
            if (allProps.indexOf(prop) === -1)
                allProps.push(prop)
        }
        props.forEach(fn)
    } while(curr = Object.getPrototypeOf(curr))
    return allProps;
}

export function instanceObject(obj) {
    let props = getAllProperties(obj); //e.g. Math
    let instance = {} as any;
    for(const key of props) {
        instance[key] = obj[key];
    }

    return instance;
    //simply copies methods, nested objects will not be instanced to limit recursion, unless someone wants to add circular reference detection >___> ... <___< 
}

export function isNativeClass (thing: any) {
    return isFunction(thing) === 'class'
}

export function isFunction(x: any) {
    const res = typeof x === 'function'
        ? x.prototype
            ? Object.getOwnPropertyDescriptor(x, 'prototype')?.writable
                ? 'function'
                : 'class'
        : x.constructor.name === 'AsyncFunction'
        ? 'async'
        : 'arrow'
    : '';

    return res
}

// export default Graph

//we can provide an argument list to structure inputs into a function from a set of getters for other node properties and functions etc.
//e.g. argOrder = ['__output','nodeA.x','nodeB.z']


export let getCallbackFromString = (a, graph) => {
    if(graph.get(a)?.__operator) {
        let node = graph.get(a);
        return (...inp) => { node.__operator(...inp); };
    } else if(a.includes('.')) {
        let split = a.split('.');
        let popped = split.pop() as any;
        let joined = split.join('.');
        let node = graph.get(joined);
        if(typeof graph.get(joined)?.[popped] === 'function') {
            return (...inp) => { return node[popped](...inp); };
        } else return () => { return node[popped]; };
    } else if (graph.get(a)) { //return the node itself (pass by reference :D)
        let node = graph.get(a);
        return () => { return node; };
    } else {
        let arg = a;
        return () => { return arg; }; 
    }
}

export const wrapArgs = (callback,argOrder,graph) => {
    let args = [] as any[];
    //set up getters 


    let forArg = (a,i) => {
        if(a === '__output' || a === '__input' || a === '__callback') {
            args[i] = {__callback:(inp) => { return inp; }, __args:undefined, idx:i}; 
        } else if(typeof a === 'string') {
            args[i] = {__callback:getCallbackFromString(a, graph), __args:undefined, idx:i};
        } else if (typeof a === 'function') {
            let fn = a;
            args[i] = {__callback:(...inp) => { return fn(...inp); }, __args:undefined, idx:i}
        } else if (typeof a === 'object' && (a.__input || a.__callback)) {
            //wrap i/o functions and get methods from nodes, 
            // recursively set arguments and the last nested 
            //  input will resolve a value
            function recursivelyCreateCallback (c:argObject) {
                let input = c.__input ? c.__input : c.__callback as any;
                if(typeof c.__input === 'string') {
                    input = {__callback:getCallbackFromString(c.__input, graph), __args:undefined, idx:i};
                    //console.log('input',input);
                }
                if(c.__args) {
                    let wrapped = wrapArgs(input, c.__args, graph);
                    input = {__callback:wrapped.__callback, __args:wrapped.__args, idx:i};
                } else {
                    input = {__callback:input, __args:undefined, idx:i};
                }
                if(c.__output) {
                    let output = c.__output as any;
                    if(typeof c.__output === 'string') {
                        output = {__callback:getCallbackFromString(output, graph), __args:undefined, idx:i};
                    } else if (typeof a.__output === 'object') {
                        output = recursivelyCreateCallback(output as argObject);
                    }
                    if(typeof output?.__callback === 'function') {
                        let fn = input.__callback;
                        let callback = output.__callback;
                        input = {__callback:(...inp) => { return (callback as Function)((fn as Function)(...inp));}, __args:output.__args, idx:i}
                    }
                }
                return input;
            }
            args[i] = recursivelyCreateCallback(a);
        } else {
            let arg = a;
            args[i] = {__callback:() => { return arg; }, __args: undefined, idx:i};
        }
    }

    argOrder.forEach(forArg);

    if(typeof callback === 'string') callback = {__callback:getCallbackFromString(callback,graph), __args:undefined};   

    let fn = typeof callback === 'function' ? callback : callback.__callback;   
    callback = function (...inp) {
        let mapArg = (arg) => { 
            return arg.__callback(...inp); 
        };
        const result = fn(...args.map(mapArg));
        return result;
    } 

    return {__callback:callback, __args:args}; //args enable hot-swapping nested function calls
    
}

let objProps = Object.getOwnPropertyNames(Object.getPrototypeOf({}));




  
//   class AnotherCallable extends Callable {
//     constructor() {
//       super()
//       this.person = 'Dean'
//     }
  
//     suffix(arg) {
//       return `${this.person} ${arg || ''}`
//     }
  
//     _call(arg) {
//       return `${this.person} ${arg || ''}`
//     }
//   }
  
  
//   var obj1 = new AnotherCallable()
  
//   // Method and prop access is maintained.
//   console.log('Method and prop access is maintained:')
//   console.log(obj1.person, obj1.suffix('Venture'), obj1('Venture'))
  
//   // Inheritance is correctly maintained.
//   console.log('\nInheritance is maintained:')
//   console.log(obj1 instanceof Function)  // true
//   console.log(obj1 instanceof Callable)  // true
//   console.log(obj1 instanceof AnotherCallable)  // true
  