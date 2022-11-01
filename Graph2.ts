//graphnodes but we are going to define graph nodes as scopes and graphs as instances of scopes, 
// then the execution behaviors will be made plugins to recognize settings on the objects optionally. This is more generic

import { EventHandler } from "./services/EventHandler";

export const state = new EventHandler();



//this is a scope
export class GraphNode {

    _node = { //GraphNode-specific properties 
        tag:`node${Math.floor(Math.random()*1000000000000000)}`,
        unique:`${Math.random()}`,
        state,
        operator: undefined as any,
        graph: undefined as any,
        children: undefined as any,
        localState: undefined as any,
        events: undefined as any,
        oncreate:undefined as any,
        ondelete:undefined as any,
        initial:undefined as any,
        listeners:undefined as any //e.g. { 'nodeA.x':(newX)=>{console.log('nodeA.x changed:',x)}  }
    }


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
            } else properties._node = {};

            if(parent) properties._node.parent = parent;
            if(graph) properties._node.graph = graph;

            const recursivelyAssign = (target,obj) => {
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

            if(parent?._node) properties._node.tag = parent._node.tag + '.' + properties._node.tag; //load parents first

            if(properties._node.initial) { //set to true to capture initial conditions, making this optional so it's not all the time
                properties._node.initial = {};
                for(const key in properties) {
                    properties._node.initial = properties[key]; //shallow copy to capture initial conditions
                }
            }

            Object.assign(this,properties);

            if(typeof this._node.oncreate === 'function') {
                this._node.oncreate(this);
            }
        }
    }

    //subscribe an output with an arbitrary callback
    _subscribe = (callback:string|GraphNode|((res)=>void), key?:string) => {
        if(key) {
            if(!this._node.localState) {
                addLocalState(this);
            }
             
            if(typeof callback === 'string') {
                if(this._node.graph) callback = this._node.graph.get(callback);
                else callback = this._node.graph.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this._node.events.subscribeTrigger(key, callback);
            } else if(callback) return this._node.events.subscribeTrigger(key, (state:any)=>{ if((callback as any)._node.operator) (callback as any)._node.operator(state); })
            
        }
        else {
            if(typeof callback === 'string') {
                if(this._node.graph) callback = this._node.graph.get(callback);
                else callback = this._node.graph.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this._node.state.subscribeTrigger(this._node.tag, callback);
            } else if(callback) return this._node.state.subscribeTrigger(this._node.tag, (res:any)=>{ if((callback as any)._node.operator) (callback as any)._node.operator(res); })
        
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
        if(key && this._node.events) return this._node.events.unsubscribe(key,sub);
        else return this._node.state.unsubscribeTrigger(this._node.tag,sub);
    }

    _setOperator = (fn:(...args:any[])=>any) => {
        this._node.operator = (...args) => {
            let result = fn(...args);
            if(typeof result?.then === 'function') {
                result.then((res)=>{ this._node.state.setState( { [this._node.tag]:res } ) }).catch(console.error);
            } else this._node.state.setState({ [this._node.tag]:result });
            return result;
        } 

        return this._node.operator;
    }

}

export class Graph {

    _node = {
        tree:undefined as any,
        tag:`graph${Math.floor(Math.random()*1000000000000000)}`,
        loaders:undefined as any,
        nodes:new Map(),
        state,
        childrenKey:undefined as any
    }

    constructor(
        options?:{
            tree?:{[key:string]:any},
            loaders?:{[key:string]:(node:GraphNode,parent:Graph|GraphNode,graph:Graph)=>void},
            state?:EventHandler,
            childrenKey?:string,
            [key:string]:any
        }
    ) {
        if(options) {
            Object.assign(this._node,options);

            if(options.tree) this.setTree(options.tree);
        }


    }
_
    setTree(tree:{[key:string]:any},loaders=this._node.loaders, childrenKey:string=this._node.childrenKey) {

        this._node.tree = Object.assign(this._node.tree ? this._node.tree : {},tree);

        let listeners = {}; //collect listener props declared

        function recursiveSet(t,parent) {
            for(const key in t) {
                let p = t[key];
                if(typeof p === 'function') p = {_node:{ operator:p }} 
                else if (typeof p === 'string') p = this._node.tree[p];
                else if (typeof p === 'boolean') p = this._node.tree[key];
                if(typeof p === 'object') {
                    if(!p._node) p._node = {};
                    if(!p._node.tag) p._node.tag = key;
                    let node = new GraphNode(p,parent,this);
                    this._node.tree[node._node.tag] = p; //reference the original props by tag in the tree for children
                    for(const l in loaders) { loaders[l](node,parent,this); } //run any passes on the nodes to set things up further
                    this.set(node._node.tag,node);
                    if(node._node.listeners) {
                        listeners[node._node.tag] = node._node.listeners;
                    }
                    if(childrenKey) {
                        if(typeof node[childrenKey] === 'object') {
                            recursiveSet(node._node[childrenKey],node);
                        }
                    }
                    else if(node._node.children) {
                        recursiveSet(node._node.children, node);
                    }
                }
            } 
        }

        recursiveSet(tree,this);

        //now setup event listeners
        for(const key in listeners) {
            let node = this.get(key);
            if(typeof listeners[key] === 'object') {
                for(const k in listeners[key]) {
                    let n = this.get(k);
                    let sub;
                    let fn = listeners[key][k];
                    listeners[key][k] = ((inp) => { return fn(inp); }).bind(node); //bind 'this' for the callback to the node 
                    if(!n) {
                        n = this.get(key.substring(0,key.lastIndexOf('.')));
                        if(n) sub = this.subscribe(listeners[key][k],node,key.substring(key.lastIndexOf('.')+1));
                        n._node.listeners[k] = sub;
                    } else {
                        sub = this.subscribe(listeners[key][k],n);
                        n._node.listeners[k] = sub;
                    }
                }
            }
        }

    }

    run(node:string|GraphNode, ...args:any[]) {
        if(typeof node === 'string') node = this.get(node);
        if((node as GraphNode)?._node?.operator) {
            return (node as GraphNode)?._node?.operator(...args);
        }
    }

    add(properties:any, parent?:GraphNode|string, childrenKey:string=this._node.childrenKey) {

        
        let listeners = {}; //collect listener props declared


        if(typeof parent === 'string') parent = this.get(parent);
        let node = new GraphNode(properties, parent as GraphNode, this);
        
        if(node._node.listeners) {
            listeners[node._node.tag] = node._node.listeners;
        }

        function recursiveSet(t,parent) {
            for(const key in t) {
                let p = t[key];
                if(typeof p === 'function') p = {_node:{ operator:p }} 
                else if (typeof p === 'string') p = this._node.tree[p];
                else if (typeof p === 'boolean') p = this._node.tree[key];
                if(typeof p === 'object') {
                    if(!p._node) p._node = {};
                    if(!p._node.tag) p._node.tag = key;
                    let nd = new GraphNode(p,parent,this);
                    this._node.tree[nd._node.tag] = p; //reference the original props by tag in the tree for children
                    for(const l in this._node.loaders) { this.loaders[l](nd,parent,this); } //run any passes on the nodes to set things up further
                    this.set(nd._node.tag,nd);
                    if(nd._node.listeners) {
                        listeners[nd._node.tag] = nd._node.listeners;
                    }
                    if(childrenKey) {
                        if(typeof nd[childrenKey] === 'object') {
                            recursiveSet(nd._node[childrenKey],nd);
                        }
                    }
                    else if(nd._node.children) {
                        recursiveSet(nd._node.children, nd);
                    }
                }
            } 
        }

        if((childrenKey && typeof node[childrenKey] === 'object')) {
            recursiveSet(node[childrenKey],node);
        }
        if(node._node.children) {
            recursiveSet(node._node.children,node);
        }

        //now setup event listeners
        for(const key in listeners) {
            let node = this.get(key);
            if(typeof listeners[key] === 'object') {
                for(const k in listeners[key]) {
                    let n = this.get(k);
                    let sub;
                    let fn = listeners[key][k];
                    listeners[key][k] = ((inp) => { return fn(inp); }).bind(node); //bind 'this' for the callback to the node
                    if(!n) {
                        n = this.get(key.substring(0,key.lastIndexOf('.')));
                        if(n) sub = this.subscribe(listeners[key],node,key.substring(key.lastIndexOf('.')+1));
                        n._node.listeners[k] = sub;
                    } else {
                        sub = this.subscribe(listeners[key][k],n);
                        n._node.listeners[k] = sub;
                    }
                }
            }
        }

        return node;
    }

    remove(node:GraphNode|string, childrenKey:string=this._node.childrenKey) {
        this.unsubscribe(node);

        if(typeof node === 'string') node = this.get(node);

        if(node instanceof GraphNode) {
            this._node.nodes.delete(node._node.tag);

            if(node._node.listeners) {
                for(const key in node._node.listeners) {
                    if(typeof node._node.listeners[key] !== 'number') continue;
                    let n = this.get(key);
                    if(!n) {
                        n = this.get(key.substring(0,key.lastIndexOf('.')));
                        if(n) this.unsubscribe(n,key.substring(key.lastIndexOf('.')+1),node._node.listeners[key]);
                    } else {
                        this.unsubscribe(n,undefined,node._node.listeners[key]);
                    }
                }
            }

            if(typeof node._node.ondelete === 'function') node._node.ondelete(node);

            function recursiveRemove(t) {
                for(const key in t) {
                    this.unsubscribe(t[key]);
                    this._node.nodes.delete(key);

                    if(t[key]._node.listeners) {
                        for(const k in t[key]._node.listeners) {
                            if(typeof t[key]._node.listeners[k] !== 'number') continue;
                            let n = this.get(k);
                            if(!n) {
                                n = this.get(k.substring(0,k.lastIndexOf('.')));
                                if(n) this.unsubscribe(n,k.substring(k.lastIndexOf('.')+1),t[key]._node.listeners[k]);
                            } else {
                                this.unsubscribe(n,undefined,t[key]._node.listeners[k]);
                            }
                        }
                    }

                    if(typeof t[key]?._node?.ondelete === 'function') t[key]._node.ondelete(t[key]);

                    if(childrenKey) {
                        if(typeof t[key][childrenKey] === 'object') {
                            recursiveRemove(t[key][childrenKey]);
                        }
                    }
                    else if(t[key]._node.children) {
                        recursiveRemove(t[key]._node.children);
                    }
                } 
            }

            if((childrenKey && typeof node[childrenKey] === 'object')) {
                recursiveRemove(node[childrenKey]);
            }
            if(node._node.children) {
                recursiveRemove(node._node.children);
            }
        }
    }

    get = this._node.nodes.get;
    set = this._node.nodes.set;

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
        callback:(res:any)=>void, node:GraphNode|string, key?:string
    ) => {
        if(node instanceof GraphNode) return node._subscribe(callback,key);
        else return this.get(node)?._subscribe(callback,key);
    }

    unsubscribe = ( node:GraphNode|string, key?:string, sub?:number ) => {
        if(node instanceof GraphNode) return node._unsubscribe(sub,key);
        else return this.get(node)?._unsubscribe(sub,key);
    }

}


// added to GraphNode and Graph
function addLocalState(props?:{[key:string]:any}) {
    if(!props) props = this;
    if(!props) return;
    if(!this._node.localState) {
        this._node.localState = {};
        this._node.events = new EventHandler(this._node.localState);
    }
    for (let k in props) {
        this._node.localState[k] = props[k];
        if (k in this) delete this[k]; //replace with proxied keys
        if(typeof props[k] === 'function') {
            let fn = props[k] as Function;
            props[k] = (...args) => {
                let result = fn(...args);
                if(typeof result?.then === 'function') {
                    result.then((res)=>{ this._node.events.setState( { [k]:res } ) }).catch(console.error);
                } else this._node.events.setState({ [k]:result });
                return result;
            } 
        }
        Object.defineProperty(this, k, {
            get: () => {
                this._node.localState[k];
            },
            set: (v) => {
                if(this._node.state.triggers[this._node.unique]) 
                    this._node.state.setState({[this._node.unique]:this}); //trigger subscriptions, if any
                this._node.events.setState({[k]:v}); //this will update localState and trigger local key subscriptions
            },
            enumerable: true,
            configurable: true
        });
    }
}



/*
Usage:

let tree = {

    nodeA:{
        x:1,
        y:2,
        _node:{
            listeners:{
                'nodeB.x':(newX)=>{ console.log('nodeB x prop changed:',newX); this.x = newX; }, //listeners in a scope are bound to 'this' node
                'nodeB.nodeC':(state)=>{console.log('nodeC state changed:', state)}
            }
        }
    },

    nodeB:{
        x:3,
        y:4,
        _node:{
            children:{
                nodeC:{
                    z:4
                    _node:{
                        operator:(a) => { this.z += a; }
                    }
                }
            }
        }
    }

};

let graph = new Graph({
    tree
});

graph.get('nodeB').x += 1; //should trigger nodeA listener

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener


*/