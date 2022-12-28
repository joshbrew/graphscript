import { Graph } from "../../Graph";

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
        }
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