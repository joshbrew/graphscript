import { Graph, GraphNode } from "../../Graph";

export const setListeners = (listeners, graph: Graph) => {

    //now setup event listeners
    for(const key in listeners) {
        let node = graph.get(key);
        if(typeof listeners[key] === 'object') {
            for(const k in listeners[key]) {
                let n = graph.get(k);
                let sub;
                if( typeof listeners[key][k] !== 'object' ) listeners[key][k] = { __callback:listeners[key][k] };
                else if(!listeners[key][k].__callback) { //this is an object specifying multiple input
                    for(const kk in listeners[key][k]) {
                        if(typeof listeners[key][k][kk] !== 'object') {
                            listeners[key][k][kk] = {__callback: listeners[key][k][kk]}
                            if(listeners[key][k][kk].__callback === true) listeners[key][k][kk].__callback = node.__operator;
                        }
                        let nn = graph.get(kk);
                        if(nn) {
                            if(!nn) {
                                let tag = k.substring(0,k.lastIndexOf('.'));
                                nn = graph.get(tag);
                                if(nn) {
                                    sub = graph.subscribe(nn,  listeners[key][k][kk].__callback, k.substring(k.lastIndexOf('.')+1), listeners[key][k][kk].inputState, key, k);
                                    if(typeof node.__listeners[k][kk] !== 'object') node.__listeners[k][kk] = { __callback: listeners[key][k][kk].__callback, inputState:listeners[key][k][kk]?.inputState };
                                    node.__listeners[k][kk].sub = sub;
                                }
                            } else {
                                sub = graph.subscribe(nn, listeners[key][k][kk].__callback, undefined, listeners[key][k].inputState, key, k);
                                if(typeof node.__listeners[k][kk] !== 'object') node.__listeners[k][kk] = { __callback: listeners[key][k][kk].__callback, inputState: listeners[key][k][kk]?.inputState };
                                node.__listeners[k][kk].sub = sub;
                            }
                        }
                    }
                }
                if(listeners[key][k].__callback) {
                    if(listeners[key][k].__callback === true) listeners[key][k].__callback = node.__operator;
                    if( typeof listeners[key][k].__callback === 'function') listeners[key][k].__callback = listeners[key][k].__callback.bind(node);
                    if(!n) {
                        let tag = k.substring(0,k.lastIndexOf('.'));
                        n = graph.get(tag);
                        if(n) {
                            sub = graph.subscribe(n,  listeners[key][k].__callback, k.substring(k.lastIndexOf('.')+1), listeners[key][k].inputState, key, k);
                            if(typeof node.__listeners[k] !== 'object') node.__listeners[k] = { __callback: listeners[key][k].__callback, inputState:listeners[key][k]?.inputState };
                            node.__listeners[k].sub = sub;
                        }
                    } else {
                        sub = graph.subscribe(n, listeners[key][k].__callback, undefined, listeners[key][k].inputState, key, k);
                        if(typeof node.__listeners[k] !== 'object') node.__listeners[k] = { __callback: listeners[key][k].__callback, inputState: listeners[key][k]?.inputState };
                        node.__listeners[k].sub = sub;
                    }
                    //console.log(sub);
                }
            }
        }
    }
}

export default (properties) => {
    const graph = properties.__node.graph
    const listeners = properties.__listeners
    const root = properties.__node


    let queue = []
    let connected = false
    root.listeners = {
        set: (listeners) => {
            if (connected) setListeners(listeners, graph)
            else queue.push(listeners)
        },
        subscribe: subscribe.bind(properties),
        unsubscribe: unsubscribe.bind(properties),
        addLocalState: addLocalState.bind(properties),
    }

    Object.defineProperty(properties, '__listeners', {
        value: listeners ?? {},
        enumerable: false,
        writable: false,
        configurable: false,
    })

    if (listeners) root.listeners.set({ [root.tag]: listeners })

    root.addOnConnected(() =>  {
        connected = true
        queue.forEach(listeners =>  setListeners(listeners, graph))
        queue = []
    })
    return properties
}



    //subscribe an output or input with an arbitrary callback
    function subscribe (callback:string|GraphNode|((res)=>void), key?:string, subInput?:boolean, bound?:string, target?:string) {

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
            if(!this.__node.localState || !this.__node.localState[key]) this.__node.listeners.addLocalState(this.__node.properties,key);
             
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
    function unsubscribe(sub?:number, key?:string, unsubInput?:boolean) {
        if(key) return this.__node.state.unsubscribeEvent(unsubInput ? this.__node.unique+'.'+key+'input' : this.__node.unique+'.'+key, sub);
        else return this.__node.state.unsubscribeEvent(unsubInput ? this.__node.unique+'input' : this.__node.unique, sub);
    }

    function addLocalState (props?:{[key:string]:any}, key?:string) { //add easy state functionality to properties on this node using getters/setters or function wrappers
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