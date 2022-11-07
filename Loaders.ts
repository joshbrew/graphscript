import { GraphNode, Graph, GraphNodeProperties } from "./Graph";

//loaders are triggered just after graphnode creation, after oncreate() is called

/**
 * setting nodeA.__node.backward:true propagates operator results to parent
 */
export const backprop = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    
    if(node.__node.backward && parent instanceof GraphNode) {

        graph.setListeners({
            [parent.__node.tag]:{
                [node.__node.tag]:parent
            }
        })
    }

    
}

/**
 * 
 * Specify a timer loop, will stop when node is popped or nodeA.__node.isLooping is set false
 * nodeA.__node.loop = 100 will loop the operator every 100 milliseconds
 * 
 * Or 
 * nodeA.__node.delay will delay the operator by specified millisecond number and resolve the result as a promise
 * nodeA.__node.frame will use requestAnimationFrame to call the function and resolve the result as a promise
 * 
 * Use in combination with:
 * nodeA.__node.repeat will repeat the operator the specified number of times
 * nodeA.__node.recursive will do the same as repeat but will pass in the previous operator call's results 
 * 
 * 
 */
export const loop = (node:GraphNode,parent:GraphNode|Graph,graph:Graph)=>{ //badabadabadabooop

    if(node.__operator && !node.__node.looperSet) {
        node.__node.looperSet = true;
        if(typeof node.__node.delay === 'number') {
            let fn = node.__operator;
            node.__operator = (...args:any[]) => {
                return new Promise((res,rej) => {
                    setTimeout(async ()=>{res(await fn(...args));},node.__node.delay);
                });
            }
        } else if (node.__node.frame === true) {
            let fn = node.__operator;
            node.__operator = (...args:any[]) => {
                return new Promise((res,rej) => {
                    requestAnimationFrame(async ()=>{res(await fn(...args));});
                });
            }
        }

        if(typeof node.__node.repeat === 'number' || typeof node.__node.recursive === 'number') {
            let fn = node.__operator;
            node.__operator = async (...args:any[]) => {
                let i = node.__node.repeat ? node.__node.repeat : node.__node.recursive; 
                let result;
                let repeater = async (tick,...inp:any[]) => {
                    while(tick > 0) {
                        if(node.__node.delay || node.__node.frame) {
                            fn(...inp).then(async (res) => {
                                if(node.__node.recursive) { 
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
               
        if(node.__node.loop && typeof node.__node.loop === 'number') {
            
            if(!('looping' in node.__node)) node.__node.looping = true
            node.__node.looper = () => {
                if(node.__node.looping) {
                    node.__operator();
                    setTimeout(node.__node.looper,node.__node.loop);
                }
            }
            if(node.__node.looping) node.__node.looper();
            
            let ondelete = (node) => {
                if(node.__node.looping) node.__node.looping = false;
            }

            if(typeof node.__node.ondelete === 'undefined') node.__node.ondelete = [ondelete];
            else if (typeof node.__node.ondelete === 'function') node.__node.ondelete = [ondelete,node.__node.ondelete];
            else if (Array.isArray(node.__node.ondelete)) node.__node.ondelete.unshift(ondelete);
        }
    }

}

/** Animations
 * 
 * nodeA.__node.animate = true | () => void, to run the operator or a specified animation function on loop
 * 
 */
export const animate =  (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__node.animate === true || node.__node.animation) {
        if(typeof node.__node.animate === 'function') node.__node.animate = node.__node.animate.bind(node);
        let anim = (node) => {
            if(!('animating' in node.__node)) node.__node.animating = true
            node.__node.animate = () => {
                if(node.__node.animating) {
                    if(typeof node.__node.animate === 'function') node.__node.animation();
                    else node.__operator();
                    requestAnimationFrame(node.__node.animation);
                }
            }
            requestAnimationFrame(node.__node.animation);
            if(node.__node.animating) node.__node.animation();
        }
        requestAnimationFrame(anim);

        let ondelete = (node) => {
            if(node.__node.animating) node.__node.animating = false;
        }

        if(typeof node.__node.ondelete === 'undefined') node.__node.ondelete = [ondelete];
        else if (typeof node.__node.ondelete === 'function') node.__node.ondelete = [ondelete,node.__node.ondelete];
        else if (Array.isArray(node.__node.ondelete)) node.__node.ondelete.unshift(ondelete);
    }
}


/** Branching operations
 * 
 * nodeA.__node.branch = {[key:string]:{if:Function|any, then:Function|any|GraphNode}}
 * 
 * nodeA.__node.listeners['nodeB.x'] = {
 *  callback:(result)=>void, 
 *  branch:{if:Function|any, then:Function|any|GraphNode}
 * }
 * 
 */
export const branching = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(typeof node.__node.branch === 'object' && node.__operator && !node.__node.branchApplied) {
        let fn = node.__operator;
        node.__node.branchApplied = true;
        node.__operator = ((...args:any[]) => {
            let result = fn(...args);
            for(const key in node.__node.branch) { //run branching operations
                let triggered = () => {
                    if(typeof node.__node.branch[key].then === 'function') {
                        node.__node.branch[key].then(result); //trigger a callback
                    } else if(node.__node.branch[key].then instanceof GraphNode && node.__node.branch[key].then.__operator) {
                        node.__node.branch[key].then.__operator(result); //run a node
                    } else result = node.__node.branch[key].then; //just replace the result in this case
                }
                if(typeof node.__node.branch[key].if === 'function') {
                    if(node.__node.branch[key].if(result)) {
                        triggered();
                    }
                } else if(node.__node.branch[key].if === result) {
                    triggered();
                } 
            }
            return result;
        });
    }
    if(node.__node.listeners) {
        for(const key in node.__node.listeners) {
            if(typeof node.__node.listeners[key] === 'object') {
                if(node.__node.listeners[key].branch && !node.__node.listeners[key].branchApplied) {
                    let fn = node.__node.listeners[key].callback;
                    
                    node.__node.listeners[key].branchApplied = true;
                    node.__node.listeners.callback = (ret) => {
                        let triggered = () => {
                            if(typeof node.__node.listeners[key].branch.then === 'function') {
                                node.__node.listeners[key].branch.then(ret); //trigger a callback
                            } else if(node.__node.listeners[key].branch.then instanceof GraphNode && node.__node.listeners[key].branch.then.__operator) {
                                node.__node.listeners[key].branch.then.__operator(ret); //run a node
                            } else ret = node.__node.listeners[key].branch.then; //just replace the result in this case
                        }
                        if(typeof node.__node.listeners[key].branch.if === 'function') {
                            if(node.__node.listeners[key].branch.if(ret)) {
                                triggered();
                            }
                        } else if(node.__node.listeners[key].branch.if === ret) {
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
 *  nodeA.__node.listeners['nodeB.x'] = { callback:(result)=>void, oncreate:any }
 * 
 */
export const triggerListenerOncreate = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__node.listeners) {
        for(const key in node.__node.listeners) {
            if(typeof node.__node.listeners[key] === 'object') {
                if(node.__node.listeners[key].oncreate) {
                    node.__node.listeners[key].callback(node.__node.listeners[key].oncreate);
                }
            }
        }
    }
}

/** Trigger listeners oncreate with specific arguments
 * 
 *  nodeA.__node.listeners['nodeB.x'] = { callback:(result)=>void, binding:{any} }
 * 
 */
export const bindListener = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__node.listeners) {
        for(const key in node.__node.listeners) {
            if(typeof node.__node.listeners[key] === 'object') {
                if(typeof node.__node.listeners[key].binding === 'object') {
                    node.__node.listeners.callback = node.__node.listeners.callback.bind(node.__node.listeners[key].binding);
                }
            }
        }
    }
}


/**
 * 
 *  nodeA.__node.listeners['nodeB.x'] = { callback:(result)=>void, transform:(result)=>any }
 * 
 */
export const transformListenerResult = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__node.listeners) {
        for(const key in node.__node.listeners) {
            if(typeof node.__node.listeners[key] === 'object') {
                if(typeof node.__node.listeners[key].transform === 'function' && !node.__node.listeners[key].transformApplied) {
                    let fn = node.__node.listeners[key].callback;
                    node.__node.listeners[key].transformApplied = true;
                    node.__node.listeners.callback = (ret) => {
                        ret = node.__node.listeners[key].transform(ret)
                        return fn(ret);
                    }
                }
            }
        }
    }
}


export const substitute__operator = (node:GraphNode & GraphNodeProperties, parent:GraphNode|Graph,graph:Graph) => {
    //console.log('route', r)
    if(node.post && !node.__operator) {
        node.__setOperator(node.post);
    } else if (!node.__operator && typeof node.get == 'function') {
        node.__setOperator(node.get);
    }
    if(node.aliases) {
        node.aliases.forEach((a) => {
            graph.__node.nodes.set(a,node);
            let ondelete = (node) => {
                graph.__node.nodes.delete(a);
            }
    
            if(typeof node.__node.ondelete === 'undefined') node.__node.ondelete = [ondelete];
            else if (typeof node.__node.ondelete === 'function') node.__node.ondelete = [ondelete,node.__node.ondelete];
            else if (Array.isArray(node.__node.ondelete)) node.__node.ondelete.unshift(ondelete);
        })
    }
}

//standard loaders with flow logic for operators and listeners
export const loaders = {
    backprop,
    loop,
    animate,
    branching,
    triggerListenerOncreate,
    bindListener,
    transformListenerResult,
    substitute__operator
}