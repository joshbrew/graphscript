import { GraphNode, Graph } from "./Graph2";

//loaders are triggered just after graphnode creation, after oncreate() is called

/**
 * setting backward:true propagates operator results to parent
 */
export const backprop = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    
    if(node._node.backward && parent instanceof GraphNode) {

        graph.setListeners({
            [parent._node.tag]:{
                [node._node.tag]:parent
            }
        })
    }

    
}

/**
 * 
 * Specify a timer loop, will stop when node is popped or this._node.isLooping is set false
 * nodeA._node.loop = 100 will loop the operator every 100 milliseconds
 * 
 * Or 
 * nodeA._node.delay will delay the operator by specified millisecond number and resolve the result as a promise
 * nodeA._node.frame will use requestAnimationFrame to call the function and resolve the result as a promise
 * 
 * Use in combination with:
 * nodeA._node.repeat will repeat the operator the specified number of times
 * nodeA._node.recursive will do the same as repeat but will pass in the previous operator call's results 
 * 
 * 
 */
export const loop = (node:GraphNode,parent:GraphNode|Graph,graph:Graph)=>{ //badabadabadabooop

    if(node._node.operator && !node._node.looperSet) {
        node._node.looperSet = true;
        if(typeof node._node.delay === 'number') {
            let fn = node._node.operator;
            node._node.operator = (...args:any[]) => {
                return new Promise((res,rej) => {
                    setTimeout(async ()=>{res(await fn(...args));},node._node.delay);
                });
            }
        } else if (node._node.frame === true) {
            let fn = node._node.operator;
            node._node.operator = (...args:any[]) => {
                return new Promise((res,rej) => {
                    requestAnimationFrame(async ()=>{res(await fn(...args));});
                });
            }
        }

        if(typeof node._node.repeat === 'number' || typeof node._node.recursive === 'number') {
            let fn = node._node.operator;
            node._node.operator = async (...args:any[]) => {
                let i = node._node.repeat ? node._node.repeat : node._node.recursive; 
                let result;
                let repeater = async (tick,...inp:any[]) => {
                    while(tick > 0) {
                        if(node._node.delay || node._node.frame) {
                            fn(...inp).then(async (res) => {
                                if(node._node.recursive) { 
                                    await repeater(tick,res);
                                }
                                else await repeater(tick,...inp);
                            })
                            break;
                        }
                        else result = await fn(...args);
                        tick--;
                    }
                }
                await repeater(i,...args);
                return result;
            }
        } 
               
        if(node._node.loop && typeof node._node.loop === 'number') {
            
            node._node.isLooping = true
            node._node.looper = () => {
                if(node._node.isLooping) {
                    node._node.operator();
                    setTimeout(node._node.looper,node._node.loop);
                }
            }
            node._node.looper();
            
            let ondelete = (node) => {
                if(node._node.isLooping) node._node.isLooping = false;
            }

            if(typeof node._node.ondelete === 'undefined') node._node.ondelete = [ondelete];
            else if (typeof node._node.ondelete === 'function') node._node.ondelete = [ondelete,node._node.ondelete];
            else if (Array.isArray(node._node.ondelete)) node._node.ondelete.unshift(ondelete);
        }
    }

}

/** Animations
 * 
 * nodeA._node.animate = true | () => void, to run the operator or a specified animation function on loop
 * 
 */
export const animate =  (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node._node.animate) {
        if(typeof node._node.animate === 'function') node._node.animate = node._node.animate.bind(node);
        let anim = (node) => {
            if(node._node.animate) {
                node._node.isAnimating = true
                if(!node._node.animation) {
                    node._node.animation = () => {
                        if(node._node.isAnimating) {
                            if(typeof node._node.animate === 'function') node._node.animate();
                            else node._node.operator();
                            requestAnimationFrame(node._node.animation);
                        }
                    }
                    requestAnimationFrame(node._node.animation);
                    node._node.animation();
                }
            }
        }
        requestAnimationFrame(anim);

        let ondelete = (node) => {
            if(node._node.isAnimating) node._node.isAnimating = false;
        }

        if(typeof node._node.ondelete === 'undefined') node._node.ondelete = [ondelete];
        else if (typeof node._node.ondelete === 'function') node._node.ondelete = [ondelete,node._node.ondelete];
        else if (Array.isArray(node._node.ondelete)) node._node.ondelete.unshift(ondelete);
    }
}


/** Branching operations
 * 
 * nodeA._node.branch = {[key:string]:{if:Function|any, then:Function|any|GraphNode}}
 * 
 * nodeA._node.listeners['nodeB.x'] = {
 *  callback:(result)=>void, 
 *  branch:{if:Function|any, then:Function|any|GraphNode}
 * }
 * 
 */
export const branching = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(typeof node._node.branch === 'object' && node._node.operator && !node._node.branchApplied) {
        let fn = node._node.operator;
        node._node.branchApplied = true;
        node._node.operator = ((...args:any[]) => {
            let result = fn(...args);
            for(const key in node._node.branch) { //run branching operations
                let triggered = () => {
                    if(typeof node._node.branch[key].then === 'function') {
                        node._node.branch[key].then(result); //trigger a callback
                    } else if(node._node.branch[key].then instanceof GraphNode && node._node.branch[key].then._node.operator) {
                        node._node.branch[key].then._node.operator(result); //run a node
                    } else result = node._node.branch[key].then; //just replace the result in this case
                }
                if(typeof node._node.branch[key].if === 'function') {
                    if(node._node.branch[key].if(result)) {
                        triggered();
                    }
                } else if(node._node.branch[key].if === result) {
                    triggered();
                } 
            }
            return result;
        });
    }
    if(node._node.listeners) {
        for(const key in node._node.listeners) {
            if(typeof node._node.listeners[key] === 'object') {
                if(node._node.listeners[key].branch && !node._node.listeners[key].branchApplied) {
                    let fn = node._node.listeners[key].callback;
                    
                    node._node.listeners[key].branchApplied = true;
                    node._node.listeners.callback = (ret) => {
                        let triggered = () => {
                            if(typeof node._node.listeners[key].branch.then === 'function') {
                                node._node.listeners[key].branch.then(ret); //trigger a callback
                            } else if(node._node.listeners[key].branch.then instanceof GraphNode && node._node.listeners[key].branch.then._node.operator) {
                                node._node.listeners[key].branch.then._node.operator(ret); //run a node
                            } else ret = node._node.listeners[key].branch.then; //just replace the result in this case
                        }
                        if(typeof node._node.listeners[key].branch.if === 'function') {
                            if(node._node.listeners[key].branch.if(ret)) {
                                triggered();
                            }
                        } else if(node._node.listeners[key].branch.if === ret) {
                            triggered();
                        } 
                        return fn(ret);
                    }
                }
            }
        }
    }
}

/** Trigger listeners oncreate with specific arguments
 * 
 *  nodeA._node.listeners['nodeB.x'] = { callback:(result)=>void, oncreate:any }
 * 
 */
export const triggerListenerOncreate = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node._node.listeners) {
        for(const key in node._node.listeners) {
            if(typeof node._node.listeners[key] === 'object') {
                if(node._node.listeners[key].oncreate) {
                    node._node.listeners[key].callback(node._node.listeners[key].oncreate);
                }
            }
        }
    }
}

/** Trigger listeners oncreate with specific arguments
 * 
 *  nodeA._node.listeners['nodeB.x'] = { callback:(result)=>void, binding:{any} }
 * 
 */
export const bindListener = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node._node.listeners) {
        for(const key in node._node.listeners) {
            if(typeof node._node.listeners[key] === 'object') {
                if(typeof node._node.listeners[key].binding === 'object') {
                    node._node.listeners.callback = node._node.listeners.callback.bind(node._node.listeners[key].binding);
                }
            }
        }
    }
}


/**
 * 
 *  nodeA._node.listeners['nodeB.x'] = { callback:(result)=>void, transform:(result)=>any }
 * 
 */
export const transformListenerResult = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node._node.listeners) {
        for(const key in node._node.listeners) {
            if(typeof node._node.listeners[key] === 'object') {
                if(typeof node._node.listeners[key].transform === 'function' && !node._node.listeners[key].transformApplied) {
                    let fn = node._node.listeners[key].callback;
                    node._node.listeners[key].transformApplied = true;
                    node._node.listeners.callback = (ret) => {
                        ret = node._node.listeners[key].transform(ret)
                        return fn(ret);
                    }
                }
            }
        }
    }
}


export const loaders = {
    backprop,
    loop,
    animate,
    branching,
    triggerListenerOncreate,
    bindListener,
    transformListenerResult
}