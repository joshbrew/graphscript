//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import propsLoader from '../core/loaders/props/props.loader'


import Monitor from './libraries/esmonitor/dist/index.esm';
import FlowManager from "./libraries/edgelord/index"


function applyLoader (node: GraphNode, parent, graph=this, tree= graph.__node.tree, properties, tag=node.__node.tag, loader) {

    const args = [ node,parent,graph,tree,properties, tag ]

    if(typeof loader === 'object') { 
        if(loader.init) loader(...args);
        if(loader.connected) node.__addOnconnected(loader.connect); 
        if(loader.disconnected) node.__addOndisconnected(loader.disconnect); 
    } else if (typeof loader === 'function') loader(...args); //run any passes on the nodes to set things up further

}
function applyLoaders (node: GraphNode, parent, graph=this, tree= graph.__node.tree, properties, tag=node.__node.tag, loaders=this.__node.loaders) {
    for(const l in loaders) applyLoader(node,parent,graph,tree,properties,tag,loaders[l])
}



type AnyObj = {[key:string]:any}
type GraphSpecifier = GraphNode | string


export type GraphNodeProperties = {
    __props?:Function|GraphNodeProperties, //a class constructor function (calls 'new x()') or an object we want to proxy all of the methods on this node. E.g. an html element gains 'this' access through operators and listeners on this node.
    __operator?:((...args:any[])=>any)|string, //The 'main' function of the graph node, children will call this function if triggered by a parent. Functions passed as graphnodeproperties become the operator which can set state.
    __children?:{[key:string]:GraphNodeProperties}, //child nodes belonging to this node, e.g. for propagating results
    __listeners?:{[key:string]:true|string|((result)=>void)|{__callback:string|((result)=>void)|true,subInput?:boolean,[key:string]:any}}|{[key:string]:((result)=>void)|true|string}, //subscribe by tag to nodes or their specific properties and method outputs
    __onconnected?:((node)=>void|((node)=>void)[]), //what happens once the node is created?
    __ondisconnected?:((node)=>void|((node)=>void)[]), //what happens when the node is deleted?
    __node?:{ //node specific properties, can contain a lot more things
        tag?:string,
        [key:string]:any
    },
    [key:string]:any
}


export type Loader = (
    node:GraphNode,
    parent:Graph|GraphNode,
    graph:Graph,
    tree:any,
    properties:GraphNodeProperties,
    key:string
)=>void;


export type Loaders = Loader[] | {[key:string]:Loader};

export type GraphOptions = {
    tree?:AnyObj,
    loaders?:Loaders,
    // {
    //     [key:string]:Loader|{
    //         init?:Loader, 
    //         connected?:(node)=>void, 
    //         disconnected?:(node)=>void}
    //      },
    // }
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}


type GraphOptionsType = {
    onInit?: Function
}

//this is a scope
export class GraphNode {

    // Confirm that the object should be recognized as graph script
    __ = Symbol('graphscript')

    __node:{
        [key:string]:any,
        flow: FlowManager
        ref: GraphNode
    } = { //GraphNode-specific properties 
        tag:`node${Math.floor(Math.random()*1000000000000000)}`,
        unique:`${Math.random()}`,
        ref: this,
        flow: new FlowManager()
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

    #parent?: AnyObj;
    #graph?: Graph;

    #properties: AnyObj = {}
    get __properties() { return this.#properties }

    #options = {}
    
    //pass GraphNodeProperties, functions, or tags of other nodes
    constructor(properties?:any, parent?:AnyObj, graph?:Graph, options?: GraphOptionsType) {
            this.__init(properties, parent, graph, options)
    }

    #applied: string[] = []


    #applySetters = (properties=this.#properties, proxy: true | AnyObj =this.#properties, ignore: string[]=[]) => {

        const isProxy = proxy === true
        let keys = Object.getOwnPropertyNames(properties);

        if (isProxy) {
            proxy = properties
            keys = getAllProperties(properties)
            console.error('Applying setters to proxy', keys.includes('rotation'), this.__node.tag, properties)

        }

        for(const key of keys) { 
            if (ignore.includes(key)) continue;
            if (this.#applied.includes(key)) continue;
            this.#applied.push(key)

            if (key === '__properties') Object.defineProperty(this, key, {
                get: () => this.#properties,
                enumerable: true,
            })

            // When Props Loader is Specified...
            // TODO: Allow this to be specified by the loader itself...
            else if (key === '__props') {
                Object.defineProperty(this, key, {
                    get: () => proxy[key],
                    set: (value) => {
                        proxy[key] = value
                        this.#applySetters(value, true)
                    },
                    enumerable: true,
                    configurable: true
                })
            }

            else  {
                Object.defineProperty(this, key, {
                    get: () => proxy[key],
                    set: (value) => proxy[key] = value,
                    enumerable: true,
                    configurable: false
                })
            }
         }
    }

    ____apply = this.#applySetters // Public version


    __init = (properties, parent = this.#parent, graph = this.#graph, options: GraphOptionsType = this.#options) => {

        this.#parent = parent
        this.#graph = graph
        this.#options = options

        if (properties)  {

        let orig = properties;
        if(typeof properties === 'function') {
            if(isNativeClass(properties)) { //works on custom classes
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


        if(typeof properties === 'object') {

            // Handle Graph Properties
            if(parent instanceof Graph && properties instanceof Graph) {

                if(properties.__node.loaders) Object.assign(parent.__node.loaders ? parent.__node.loaders : {}, properties.__node.loaders); //let the parent graph adopt the child graph's loaders

                if(parent.__node.mapGraphs) {
                    //do we still want to register the child graph's nodes on the parent graph with unique tags for navigation? Need to add cleanup in this case
                    properties.__node.nodes.forEach((n) => {parent.set(properties.__node.tag+'.'+n.__node.tag,n)});

                    let ondelete = () => { properties.__node.nodes.forEach((n) => {parent.__node.nodes.delete(properties.__node.tag+'.'+n.__node.tag)}); }
                    this.__addOndisconnected(ondelete);

                }

                properties = properties.__node.tree // apply the user-specified object properties—not the graph instance

            }

            // Assign stored properties
            this.#properties = properties


            if (!properties.__node) properties.__node = {};

            // Apply original object or function to the node
            if(!properties.__node.initial) this.__node.initial = orig; //original object or function


            // Create Props Proxy
            // e.g. some generic javascript object or class constructor that we want to proxy. Functions passed here are treated as constructors. E.g. pass an HTML canvas element for the node then set this.width on the node to set the canvas width  
            if(properties.__props) { 
                if (typeof properties.__props === 'function') properties.__props = new properties.__props();
            }

            // Copy
            if (typeof properties.__node === 'string') {
                if(graph?.get(properties.__node.tag)) {
                    properties = graph.get(properties.__node.tag);
                } else properties.__node = {}
            } else if(!properties.__node) properties.__node = {};

            // Set Graph on Node Properties
            if(graph) properties.__node.graph = graph;

            // Set Operator on Properties
            if(properties.__operator) {
                if (typeof properties.__operator === 'string') {
                    if(graph) {
                        let n = graph.get(properties.__operator);
                        if(n) properties.__operator = n.__operator;
                        if(!properties.__node.tag && (properties.__operator as Function).name) 
                            properties.__node.tag = (properties.__operator as Function).name;
                    }
                }
            }

            // Create Tag
            if(!properties.__node.tag) {
                if(properties.__operator?.name) properties.__node.tag = properties.__operator.name;
                else properties.__node.tag = `node${Math.floor(Math.random()*1000000000000000)}`;
            }

            //nested graphs or 2nd level+ nodes get their parents as a tag
            if(!properties.__parent && parent) properties.__parent = parent;
            if(parent?.__node && (!(parent instanceof Graph || properties instanceof Graph))) properties.__node.tag = parent.__node.tag + '.' + properties.__node.tag; //load parents first
            

            properties.__node = Object.assign(this.__node,properties.__node);

            this.#applySetters() // Set properties on the graphnode 
            applyLoaders.call(graph, this, parent, graph, graph?.__node?.tree, properties) // Apply loaders
            this.#applySetters(undefined, undefined, ['__props']) // Proxy the new properties too
            
            if(properties instanceof Graph) this.__node.source = properties; //keep tabs on source graphs passed to make nodes



            if (typeof options.onInit === 'function') options.onInit();

            // Create flow manager for this specific node
            if (graph){
                const symbol = (graph.__node.ref ?? this).__
                const monitor = graph.monitor

                    this.__node.flow.setInitialProperties(this.__listeners, undefined, {
                        id: symbol, // Global symbol for this graph
                        instance: this, 
                        monitor,
                        graph,
                        bound: this.__node.tag,
                    })

            } else console.error('No flow manager created for ' + this.__node.tag)
        }
        }
    }
    
    __addOnconnected(callback:(node)=>void) {
        if(Array.isArray(this.__onconnected)) { this.__onconnected.push(callback); }
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
        else if (Array.isArray(this.__onconnected)) { this.__onconnected.forEach((o:Function) => { o.call(this, this); }) }
    }

    __callDisconnected(node=this) {
        if(typeof this.__ondisconnected === 'function') this.__ondisconnected(this);
        else if (Array.isArray(this.__ondisconnected)) { this.__ondisconnected.forEach((o:Function) => {o.call(this, this)}); }
    }

}

export class Graph {

    [key:string]:any;


    monitor = new Monitor({
        keySeparator: '.',
        fallbacks: ['__children']
    })

    __node:{
        tag:string,
        nodes:Map<string,GraphNode|any>,
        ref: GraphNode, // Always create a GraphNode reference
        loaders: Loaders
        initial: GraphNodeProperties,
        [key:string]:any
    } = {
        tag:`graph${Math.floor(Math.random()*1000000000000000)}`,
        nodes:new Map(),
        ref: new GraphNode(),
        loaders: [
            propsLoader
        ]
        // addState:true //apply the addLocalState on node init 
        // mapGraphs:false //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
        // tree:undefined as any,
    }



    constructor(
        options?:GraphOptions
    ) {
        this.init(options);
    }

    init = (options?:GraphOptions) => {
        if(options) {
            if (options.loaders) {
                this.setLoaders(options.loaders)
                delete options.loaders
            }
            recursivelyAssign(this.__node, options); //assign loaders etc
            if(options.tree) this.setTree(options.tree);
            // else this.#init()
        }
    }

    #init = (properties) => {
        const node = this.__node.ref
        node.__init(properties, this, this, {
            onInit: () => {
                this.monitor.set(node.__, node.__properties)
             } // Register node in graph monitor
        })
        return node
    }

    setTree = (tree:AnyObj) => {

        // --------------- Recognize node trees ----------------
        const hasGraphscriptProperties = Object.keys(tree).find(str => {
            const slice = str.slice(0,2)
            return (slice === '__' && str !== '__node')
        })

        
        if (!hasGraphscriptProperties) tree = {__children: tree}

        if (!tree.__node) tree.__node = {} // Set tree as a node (not all nodes are registered in the graph...)

        // ---------------- Preprocess tree ----------------
        this.__node.tree = Object.assign(this.__node.tree ? this.__node.tree : {}, tree);

        let cpy = Object.assign({}, tree);
        if(cpy.__node) delete cpy.__node; //we can specify __node behaviors on the tree too to specify listeners

        // Activate the tree by creating active nodes
        let listeners = this.recursiveSet(cpy,this,undefined,tree);

        // ---------------- Always Turn the tree into a node ----------------
        // Assign random tag to tree (if one is missing)
        if(!tree.__node.tag) tree.__node.tag = this.__node.tag //getRandomTag('tree')
        
        // Activate Graph GraphNode
        const node = this.#init(tree)

        // Activate all children
        const children = node.__children
        const copy = Object.assign({}, children)
        if (children) listeners = this.recursiveSet(copy, this, undefined, children) // Replace children with GraphNode children

        if(node.__listeners) listeners[node.__node.tag] = node.__listeners;
 
        // ---------------- Setup event listeners ----------------
        this.__node.nodes.forEach(n => n.__node.flow.start()) //start all node listeners

        // ---------------- "Connect" the Nodes ----------------
        node.__callConnected()


        return cpy; //should be the node tree

    }

    setLoaders = (loaders:{[key:string]:Loader} | Loader[], replace?:boolean) => {
        if(replace)  this.__node.loaders = loaders;
        else {

            // Array Loader Specification
            if (Array.isArray(this.__node.loaders)) {
                if (Array.isArray(loaders)) this.__node.loaders = [...this.__node.loaders, ...loaders]
                else this.__node.loaders = [...this.__node.loaders, ...Object.values(loaders)]
            } 
            
            // Object Loader Specification
            else Object.assign(this.__node.loaders, loaders);
        }
        return this.__node.loaders;
    }

    add = (properties:any, parent?:GraphSpecifier) => {

        let listeners = {}; //collect listener props declared
        if(typeof parent === 'string') parent = this.get(parent);

        let instanced;
        if(typeof properties === 'function') {
            if(isNativeClass(properties)) { //works on custom classes
                if(properties.prototype instanceof GraphNode) { properties = properties.prototype.constructor(properties,parent,this); instanced = true; } //reinstantiate a new node with the old node's props
                else properties = new properties(); //this is a class that returns a node definition 
            } else properties = { __operator:properties };
        }
        else if (typeof properties === 'string') properties = this.__node.tree[properties];
        
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
            this.__node.tree[node.__node.tag] = properties; //reference the original props by tag in the tree for children
            //console.log('old:',properties.__node,'new:',node.__node);
            
            if(node.__listeners) {
                listeners[node.__node.tag] = node.__listeners;
            }
    
            if(node.__children) {
                const children = node.__children
                const copy = Object.assign({}, children)
                this.recursiveSet(copy, node, listeners, children);
            }

            node.__callConnected();

            return node;

        }

        return;
    }

    recursiveSet = (t,parent,listeners={},origin = t) =>  {
        let keys = Object.getOwnPropertyNames(origin);
        for(const key of keys) {
            if(key.includes('__')) continue;
            let p = origin[key];
            if(Array.isArray(p)) continue;
            let instanced;
            if(typeof p === 'function') {
                if(isNativeClass(p)) { //works on custom classes
                    p = new p(); //this is a class that returns a node definition
                    if(p instanceof GraphNode) { p = p.prototype.constructor(p,parent,this); instanced = true; } //re-instance a new node
                } else p = { __operator:p };
            } 
            else if (typeof p === 'string') p = this.__node.tree[p];
            else if (typeof p === 'boolean') p = this.__node.tree[key];
            if(typeof p === 'object') {
                
                // Actually we do want to mutate the original object
                // if(!instanced) {
                //     p = Object.assign({},p); //make sure we don't mutate the original object
                // }

                if(!p.__node) p.__node = {};
                if(!p.__node.tag) p.__node.tag = key;
                p.__node.initial = t[key];
                if((this.get(p.__node.tag) && !(parent?.__node && this.get(parent.__node.tag + '.' + p.__node.tag))) || (parent?.__node && this.get(parent.__node.tag + '.' + p.__node.tag))) continue; //don't duplicate a node we already have in the graph by tag
                let node;
                if(instanced) node = p;
                else node = new GraphNode(p, parent as GraphNode, this);
                this.set(node.__node.tag,node);
                // for(const l in this.__node.loaders) { this.__node.loaders[l](node,parent,this,t,t[key],key); } //run any passes on the nodes to set things up further
                t[key] = node; //replace child with a graphnode
                this.__node.tree[node.__node.tag] = p; //reference the original props by tag in the tree for children
                if(node.__listeners) {
                    listeners[node.__node.tag] = node.__listeners;
                }
                if(node.__children) {
                    const children = node.__children
                    const copy = Object.assign({}, children)
                    this.recursiveSet(copy, node, listeners, children);
                }

                let parentNode = (parent instanceof Graph) ? parent.__node.ref : parent;

                parentNode.__addOnconnected(() => node.__callConnected());
            }
        } 
        return listeners;
    }

    remove = (
        node:GraphSpecifier, 
        // clearListeners:boolean=true
    ) => {

        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            this.delete(node.__node.tag);
            delete this.__node.tree[node.__node.tag];

            // if(clearListeners) 
            this.clearListeners(node);
            

            node.__callDisconnected();
 
            const recursiveRemove = (t) => {
                for(const key in t) {
                    const node = t[key].__node.ref; // Safe access method for GraphNode class

                    this.clearListeners(node)

                    this.delete(node.__node.tag);
                    delete this.__node.tree[node.__node.tag]
                    this.delete(key);
                    delete this.__node.tree[key]

                    //console.log(key, 'removing child',node);
                    node.__node.tag = node.__node.tag.substring(node.__node.tag.lastIndexOf('.')+1);

                    // if(clearListeners) 
                    this.clearListeners(node);

                    node.__callDisconnected();
                    if(node.__children) recursiveRemove(node.__children);
                } 
            }

            if(node.__children) recursiveRemove(node.__children);
        }

        if((node as any)?.__node.tag && (node as any)?.__parent) {
            (node as any).__parent = undefined;
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

    clearListeners = (node:GraphSpecifier) => {
        this.unsubscribe(node); // Clear subscriptions BOUND TO this node
        this.clear(node); // Clear subscriptions to and from this node
    }

    get = (tag:string, base?:GraphSpecifier) => { 

        if (base instanceof GraphNode) base = base.__node.tag


        // Get the node from the graph
        if (tag === this.__node.tag) return this.__node.ref

        // Get node in the graph
        if (base) {
            const relFrom = [base, tag].join('.') // Assume relative targeting first
            const got = this.get(relFrom)
            if (got) return got
        }

        return this.__node.nodes.get(tag); 
    };

    set = (tag:string,node:GraphNode) => { return this.__node.nodes.set(tag,node); };
    delete = (tag:string) => { return this.__node.nodes.delete(tag); }

    getProps = (node:GraphSpecifier, getInitial?:boolean) => {
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

    subscribe = (from: GraphSpecifier, to: GraphSpecifier | Function, value: any = true, bound: GraphSpecifier = this.__node.ref) => {
        if(typeof from !== 'string') from = from.__node.tag;
        if(typeof bound === 'string') bound = this.get(bound) as GraphNode;

        if (bound) bound.__node.flow.add(from, to, value)
    }

    // Unsubscribe subscriptions for a particular node
    unsubscribe = (node:GraphSpecifier, from?:GraphSpecifier|symbol, to?:GraphSpecifier ) => this.clear(from, to, node)

    // Clear all nodes of a certain listener (or specific) using from / to syntax
    clear = ( from?: GraphSpecifier | symbol, to?:GraphSpecifier, bound?: GraphSpecifier) => {

        const nd = (typeof bound === 'string') ? this.get(bound) : bound

        // Single Unsubscribe
        if (typeof from === 'symbol') return this.__node.flow.remove(from)

        // Unsubscribe Using Listener Identifiers
        let fromString = (from instanceof GraphNode) ? from.__node.tag : from
        let toString = (to instanceof GraphNode) ? to.__node.tag : to

        const remove = (n) => {
            const flow = n.__node.flow;
            (toString) ? flow.remove(fromString, toString) : flow.clear(fromString);
        }

        if (nd) remove(nd)
        else {
            remove(this.__node.ref)
            this.__node.nodes.forEach(remove)
        }
    }


    activate = (from, value) => this.__node.flow.activate(from, value);

    // Maintains old behavior for setState
    setState = (update:AnyObj) => {
        for (let key in update) this.activate(key, update);
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
    let allProps = [] as string[], curr = obj
    while(curr = Object.getPrototypeOf(curr)) {
        let props = Object.getOwnPropertyNames(curr)
        props.forEach((prop) => {
            if (allProps.indexOf(prop) === -1) allProps.push(prop)
        })
    }
    return allProps;
}

export function instanceObject(obj) {
    let props = getAllProperties(obj); //e.g. Math
    let instance = {} as any;
    for(const key of props) instance[key] = obj[key];
    return instance; //simply copies methods, nested objects will not be instanced to limit recursion
}

export function isNativeClass (thing) {
    return typeof thing === 'function' && thing.hasOwnProperty('prototype') && !thing.hasOwnProperty('arguments')
}