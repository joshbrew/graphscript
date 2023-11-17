import { GraphNode, Graph, GraphNodeProperties } from "../core/Graph";

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
export const loop = (node:GraphNode,parent:GraphNode|Graph,graph:Graph)=>{

    if(
        node.__operator 
        //&& !node.__node.looperSet //not using this allows multiple loops to run, just set looping=false and wait for all to finish otherwise
    ) {
        let loopId = Math.random();
        if(!node.__node.loops) node.__node.loops = {};
        if(typeof node.__node.delay === 'number') {
            let fn = node.__operator;
            node.__setOperator((...args:any[]) => {
                return new Promise((res,rej) => {
                    node.__node.loops[loopId] = setTimeout(async ()=>{
                        res(await fn(...args));},node.__node.delay);
                });
            });
        } else if (node.__node.frame === true) {
            let fn = node.__operator;
            node.__setOperator((...args:any[]) => {
                return new Promise((res,rej) => {
                    node.__node.loops[loopId] = requestAnimationFrame(async ()=>{res(await fn(...args));});
                });
            });
        }

        if(typeof node.__node.repeat === 'number' || typeof node.__node.recursive === 'number') {
            let fn = node.__operator;
            node.__setOperator(async (...args:any[]) => {
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
            });
        } 
               
        if(node.__node.loop && typeof node.__node.loop === 'number') {
            
            //node.__node.looperSet = true;
            let fn = node.__operator;
            let time = node.__node.loop;
            node.__setOperator((...args) => {
                if(!('looping' in node.__node)) node.__node.looping = true;
                if(node.__node.looping) {
                    let last = performance.now();
                    fn(...args);
                    node.__node.loops[loopId] = setTimeout(
                        ()=>{
                            let now = performance.now();
                            let overshoot = (now - last) - node.__node.loop;
                            if(overshoot > 0) time = node.__node.loop - overshoot; 
                            else time = node.__node.loop;
                            if(time <= 0) time = node.__node.loop;
                            node.__operator(...args);
                            //
                        }, 
                        time 
                    );
                }
            });
            if(node.__node.looping) node.__operator();
            
            let ondelete = (node) => {
                if(node.__node.looping) node.__node.looping = false;
                if(node.__node.loops[loopId]) {
                    clearTimeout(node.__node.loops[loopId]);
                    cancelAnimationFrame(node.__node.loops[loopId]);
                }
            }

            node.__addOndisconnected(ondelete);
        }
    }

}

/** Animations
 * 
 * nodeA.__node.animate = true;
 * then __operator becomes a requestAnimationFrame function
 * start with a call the __operator or by setting node.__node.animating = true;
 * 
 * or node.__animation = (...args) => {}
 * 
 */
export const animate =  (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__node.animate === true || node.__animation) {
        let fn = node.__operator;

        node.__setOperator((...args) => {
            if(!('animating' in node.__node)) node.__node.animating = true;
            if(node.__node.animating) {
                if(typeof node.__animation === 'function') node.__animation(...args);
                else fn(...args);
                node.__node.animationFrame = requestAnimationFrame(()=>{node.__operator(...args);});
            }
        });
        if(node.__node.animating || ((!('animating' in node.__node) || node.__node.animating) && node.__animation)) 
            setTimeout(()=>{
                node.__node.animationFrame = requestAnimationFrame(node.__operator)
            },10);
    

        let ondelete = (node) => {
            if(node.__node.animating) node.__node.animating = false;
            if(node.__node.animationFrame) cancelAnimationFrame(node.__node.animationFrame);
        }

        node.__addOndisconnected(ondelete);
    }
}


/** Branching operations
 * 
 * //runs a function or node if the if-conditions are satisfied, which can be a function that returns a true or false
 * nodeA.__branch = {[key:string]:{if:Function|any, then:Function|any|GraphNode}} 
 * 
 * nodeA.__listeners['nodeB.x'] = {
 *  callback:(result)=>void, 
 *  branch:{
 *      if:Function|any, //if a function using the result evaluates to true or if the value equals the if value
 *      then:Function|any|GraphNode //call a function, return a different result, or call a node
 *  }
 * }
 * 
 */
export const branching = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(typeof node.__branch === 'object' && node.__operator && !node.__branchApplied) {
        let fn = node.__operator;
        node.__branchApplied = true;
        node.__operator = ((...args:any[]) => {
            let result = fn(...args);
            for(const key in node.__branch) { //run branching operations
                let triggered = () => {
                    if(typeof node.__branch[key].then === 'function') {
                        node.__branch[key].then(result); //trigger a callback
                    } else if(node.__branch[key].then instanceof GraphNode && node.__branch[key].then.__operator) {
                        node.__branch[key].then.__operator(result); //run a node
                    } else result = node.__branch[key].then; //just replace the result in this case
                }
                if(typeof node.__branch[key].if === 'function') {
                    if(node.__branch[key].if(result) == true) {
                        triggered();
                    }
                } else if(node.__branch[key].if === result) {
                    triggered();
                } 
            }
            return result;
        });
    }
    if(node.__listeners) {
        for(const key in node.__listeners) {
            if(typeof node.__listeners[key] === 'object') {
                if(node.__listeners[key].branch && !node.__listeners[key].branchApplied) {
                    let fn = node.__listeners[key].callback;
                    
                    node.__listeners[key].branchApplied = true;
                    node.__listeners.callback = (ret) => {
                        let triggered = () => {
                            if(typeof node.__listeners[key].branch.then === 'function') {
                                ret = node.__listeners[key].branch.then(ret); //trigger a callback
                            } else if(node.__listeners[key].branch.then instanceof GraphNode && node.__listeners[key].branch.then.__operator) {
                                ret = node.__listeners[key].branch.then.__operator(ret); //run a node
                            } else ret = node.__listeners[key].branch.then; //just replace the result in this case
                        }
                        if(typeof node.__listeners[key].branch.if === 'function') {
                            if(node.__listeners[key].branch.if(ret)) {
                                triggered();
                            }
                        } else if(node.__listeners[key].branch.if === ret) {
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
 *  nodeA.__listeners['nodeB.x'] = { callback:(result)=>void, oncreate:any }
 * 
 */
export const triggerListenerOncreate = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__listeners) {
        for(const key in node.__listeners) {
            if(typeof node.__listeners[key] === 'object') {
                if(node.__listeners[key].oncreate) {
                    node.__listeners[key].callback(node.__listeners[key].oncreate);
                }
            }
        }
    }
}

/** Bind listeners to a specific object instead of the node that owns it
 * 
 *  nodeA.__listeners['nodeB.x'] = { callback:(result)=>void, binding:{[key:string]:any} }
 * 
 */
export const bindListener = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__listeners) {
        for(const key in node.__listeners) {
            if(typeof node.__listeners[key] === 'object') {
                if(typeof node.__listeners[key].binding === 'object') {
                    node.__listeners.callback = node.__listeners.callback.bind(node.__listeners[key].binding);
                }
            }
        }
    }
}


/**
 * 
 *  nodeA.__listeners['nodeB.x'] = { callback:(result)=>void, transform:(result)=>any }
 * 
 */
export const transformListenerResult = (node:GraphNode,parent:GraphNode|Graph,graph:Graph) => {
    if(node.__listeners) {
        for(const key in node.__listeners) {
            if(typeof node.__listeners[key] === 'object') {
                if(typeof node.__listeners[key].transform === 'function' && !node.__listeners[key].transformApplied) {
                    let fn = node.__listeners[key].callback;
                    node.__listeners[key].transformApplied = true;
                    node.__listeners.callback = (ret) => {
                        ret = node.__listeners[key].transform(ret)
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
    } if(!node.get && node.__operator) {
        //node.get = node.__operator;
    } if(node.aliases) {
        node.aliases.forEach((a) => {
            graph.set(a,node);
            let ondelete = (node) => {
                graph.__node.nodes.delete(a);
            }
    
            node.__addOndisconnected(ondelete);
        })
    }
    if(typeof graph.__node.roots?.[node.__node.tag] === 'object' && node.get) graph.__node.roots[node.__node.tag].get = node.get;
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