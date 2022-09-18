export function parseFunctionFromText(method='') {
    //Get the text inside of a function (regular or arrow);
    let getFunctionBody = (methodString) => {
        return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, '$2$3$4');
    }

    let getFunctionHead = (methodString) => {
        let startindex = methodString.indexOf('=>')+1;
        if(startindex <= 0) {
            startindex = methodString.indexOf('){');
        }
        if(startindex <= 0) {
            startindex = methodString.indexOf(') {');
        }
        return methodString.slice(0, methodString.indexOf('{',startindex) + 1);
    }

    let newFuncHead = getFunctionHead(method);
    let newFuncBody = getFunctionBody(method);


    let newFunc;
    if (newFuncHead.includes('function')) {
        let varName = newFuncHead.split('(')[1].split(')')[0]
        newFunc = new Function(varName, newFuncBody);
    } else {
        if(newFuncHead.substring(0,6) === newFuncBody.substring(0,6)) {
        //newFuncBody = newFuncBody.substring(newFuncHead.length);
        let varName = newFuncHead.split('(')[1].split(')')[0]
        //console.log(varName, newFuncHead ,newFuncBody);
        newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf('{')+1,newFuncBody.length-1));
        }
        else {
        try {newFunc = (0,eval)(newFuncHead + newFuncBody + "}");} catch {}
        }
    }

    return newFunc;

}

//just a more typical hierarchical graph tree with back and forward prop and arbitrary 
// go-here-do-that utilities. Create an object node tree and make it do... things 
// same setup as sequencer but object/array/tag only (no functions), and can add arbitrary properties to mutate on objects
// or propagate to children/parents with utility calls that get added to the objects
//Joshua Brewster and Garrett Flynn AGPLv3.0

export type OperatorType = ( //can be async
    ...args:any //input arguments, e.g. output from another node
)=>any|void

export type Tree = {
    [key:string]: //the key becomes the node tag on the graph
        GraphNode |
        Graph | //for graphs, pass an input object to the operator like so: e.g. to run a node in the graph: node.run({run:[arg1,arg2]})
        GraphNodeProperties |
        OperatorType |
        ((...args)=>any|void) |
        { aliases:string[] } & GraphNodeProperties
}

//properties input on GraphNode or add, or for children
export type GraphNodeProperties = {
    tag?:string, //generated if not specified, or use to get another node by tag instead of generating a new one
    operator?:OperatorType|((...args)=>any|void), //Operator to handle I/O on this node. Returned inputs can propagate according to below settings
    forward?:boolean, //pass output to child nodes
    backward?:boolean, //pass output to parent node
    children?:{[key:string]:string|boolean|undefined|GraphNodeProperties|GraphNode|Graph}//string|GraphNodeProperties|GraphNode|(GraphNodeProperties|GraphNode|string)[], //child node(s), can be tags of other nodes, properties objects like this, or GraphNodes, or null
    parent?:GraphNode|Graph|string, //parent graph node
    branch?:{ //based on the operator result, automatically do something
        [label:string]:{ //apply any label for your own indexing
            if:any|((output:any)=>boolean), //if this value, or pass a callback that returns true/false
            then:string|((...operator_result:any[])=>any)|GraphNode //then do this, e.g. use a node tag, a GraphNode, or supply any function
        } //it still returns afterward but is treated like an additional flow statement :D. GraphNodes being run will contain the origin node (who had the branch)
    },
    tree?:Tree, //can also declare independent node maps on a node for referencing
    delay?:false|number, //ms delay to fire the node
    repeat?:false|number, // set repeat as an integer to repeat the input n times, cmd will be the number of times the operation has been repeated
    recursive?:false|number, //or set recursive with an integer to pass the output back in as the next input n times, cmd will be the number of times the operation has been repeated
    reactive?:boolean|((_state:{[key:string]:any})=>void), //use a local state object to trigger state subscriptions, using the node's _unique tag to subscribe
    frame?:boolean, //true or false. If repeating or recursing, execute on requestAnimationFrame? Careful mixing this with animate:true
    animate?:boolean, //true or false, run the operation on an animationFrame loop?
    loop?:false|number, //milliseconds or false, run the operation on a loop?
    animation?: OperatorType, //if it outputs something not undefined it will trigger parent/child operators
    looper?: OperatorType, //if it outputs something not undefined it will trigger parent/child operators
    oncreate?:(self:GraphNode|any,...args:any[])=>void, //do something after _initializing the node, if loaded in a graph it only runs after setTree
    ondelete?:(self:GraphNode|any,...args:any[])=>void, //do something after deleting the node
    DEBUGNODE?:boolean, // print a console.time and the result for a node by tag, run DEBUGNODES on a GraphNode or Graph to toggle debug on all attached nodes.
    [key:string]:any //add whatever variables and utilities
}; //can specify properties of the element which can be subscribed to for changes.



//TODO: try to reduce the async stack a bit for better optimization, though in general it is advantageous matter as long as node propagation isn't 
//   relied on for absolute maximal performance concerns, those generally require custom solutions e.g. matrix math or clever indexing, but this can be used as a step toward that.

//a graph representing a callstack of nodes which can be arranged arbitrarily with forward and backprop or propagation to wherever
export class EventHandler {

    pushToState={}
    data={}
    triggers={}

    constructor() {}

    setState = (updateObj:{[key:string]:any}) => {
        Object.assign(this.data, updateObj);
        for (const prop of Object.getOwnPropertyNames(updateObj)) {
            if (this.triggers[prop]) this.triggers[prop].forEach((obj) => obj.onchange(this.data[prop]));
        }
        return this.data;
    }
    subscribeTrigger = (key:string,onchange:(res:any)=>void) => {
        if(key) {
            if(!this.triggers[key]) {
                this.triggers[key] = [];
            }
            let l = this.triggers[key].length;

            this.triggers[key].push({idx:l, onchange});
            return this.triggers[key].length-1;
        } else return undefined;
    }
    unsubscribeTrigger = (key:string,sub?:number) => {
        let triggers = this.triggers[key]
        if (triggers){
            if(!sub) delete this.triggers[key];
            else {
                let idx = undefined;
                let obj = triggers.find((o,i)=>{
                    if(o.idx===sub) {
                        idx = i;
                        return true;
                    }
                });
                if(obj) triggers.splice(idx,1);
                return true;
            }
        }
    }
    subscribeTriggerOnce = (key:string,onchange:(res:any)=>void) => {
        let sub;
        
        let changed = (value) => {
            onchange(value);
            this.unsubscribeTrigger(key,sub);
        }
        sub = this.subscribeTrigger(key,changed);
    }

}

export const state = new EventHandler();


  /**
   * Creates new instance of a GraphNode
   * The methods of this class can be referenced in the operator after setup for more complex functionality
   * 
   * ```typescript
   * const graph = new GraphNode({custom: 1, operator: (input) => console.log(input, self.custom)});
   * ```
   */


// //set the node's props as this
//const restrictedKeys = ['_state', 'graph']

// added to GraphNode and Graph
function addLocalState(props) {
    if(!this._state) this._state = {};
    for (let k in props) {
      if (k === '_state' || k === 'graph') continue;
    //   else if (!(k in this._initial)) continue
      else {
        this._state[k] = props[k];
        if (k in this) this[k] = props[k];
        else Object.defineProperty(this, k, {
            get: () => {
                this._state[k];
            },
            set: (v) => {
                this._state[k] = v;
                if(this.state.triggers[this._unique]) this.setState({[this._unique]:this._state}); //trigger subscriptions, if any
            },
            enumerable: true,
            configurable: true
        });
      }
    }
  }



export class GraphNode {

    nodes:Map<any,any> = new Map()
    _initial:{[key:string]:any} = {}; //keep track of custom _initial properties added that aren't default on the current class object
    //_state:{[key:string]:any} = {}; //keep track of custom properties added that aren't default on the current class object, subscribe by the _unique tag to get state updates whenever props are set 
    _unique=`${Math.random()}`; //mostly-guaranteed unique id

    tag:string;
    parent:GraphNode|Graph;
    children:any;
    graph:Graph;
    state = state; //shared trigger state
    isLooping = false;
    isAnimating = false;
    looper = undefined; //loop function, uses operator if undefined (with cmd 'loop');
    animation = undefined; //animation function, uses operator if undefined (with cmd 'animate')
    forward:boolean = true; /// propagate outputs to children?
    backward:boolean = false; //propagate outputs to parents?
    reactive: boolean|((_state:{[key:string]:any})=>void) = false; //does the node proxy custom props through a local _state? Subscribe by the _unique id or pass a callback in GraphNodeProperties 
    runSync:boolean = false;
    firstRun:boolean = true;
    DEBUGNODE:boolean = false; //prints a console.time and console.timeEnd on each runOp call
    source:Graph|GraphNode; //if we pass a graph in as properties it will go here so as to not compete with the graphnode overlapping commands
    tree:Tree;

    [key:string]: any; // any additional attribute

    constructor(
        properties:GraphNodeProperties|Graph|OperatorType|((...args:any[])=>any|void)={}, 
        parent?:GraphNode|Graph|string, 
        graph?:Graph
    ) {    


        if(typeof properties === 'function') { //pass a function instead of properties to set up a functional graph quickly
            properties = { operator:properties as any };
        }

        if(typeof properties === 'object') {
            

            //can pass graphs and wrap Graphs with GraphNodes to enable nesting in trees
            if(properties instanceof GraphNode && properties._initial) Object.assign(properties, properties._initial);
            if(properties instanceof Graph) {
                let source = properties;

                properties = {
                    source,
                    operator:(input?:{[key:string]:any}) => {
                        if(typeof input === 'object') {
                            let result = {};
                            for(const key in input) {
                                if(typeof source[key] === 'function')
                                    { //attempt to execute a function with arguments
                                        if(Array.isArray(input[key]))
                                            result[key] = (source[key](...input[key]));
                                        else result[key] = source[key](input[key]);
                                    } 
                                else {source[key] = input[key]; result[key] = source[key]}
                            }
                            return result;
                        }
                        return source;
                    }
                };

                //in case any stuff was added to the graph to indicate flow logic
                if(source.operator) properties.operator = source.operator;
                if(source.children) properties.children = source.children;
                if(source.forward) properties.forward = source.forward;
                if(source.backward) properties.backward = source.backward;
                if(source.repeat) properties.repeat = source.repeat;
                if(source.recursive) properties.recursive = source.recursive;
                if(source.loop) properties.loop = source.loop;
                if(source.animate) properties.animate = source.animate;
                if(source.looper) properties.looper = source.looper;
                if(source.animation) properties.animation = source.animation;
                if(source.delay) properties.delay = source.delay;
                if(source.oncreate) properties.oncreate = source.oncreate;
                if(source.node) if(source.node._initial) Object.assign(properties,source.node._initial);
                if(source._initial) Object.assign(properties,source._initial);
                if(source.tag) properties.tag = source.tag; // ensure tag swap

                this.nodes = source.nodes;
                source.node = this;
                
                if(graph) {
                    source.nodes.forEach((n) => {
                        if(!graph.nodes.get(n.tag)) {
                            graph.nodes.set(n.tag,n);
                            graph.nNodes++;
                        }
                    });
                } //make sure node references get passed around correctly
            }

            if( typeof parent === 'string') {
                if(graph) parent = graph.nodes.get(parent);
                else parent = undefined;
            }
            

            if(properties.tag && (graph || parent)) {
                let hasnode;
                if(graph?.nodes) {
                    hasnode = graph.nodes.get(properties.tag);
                    // if(hasnode) if(hasnode.source instanceof Graph) { //duplicate the graph
                    //     hasnode = new Graph(hasnode.source.tree,`${hasnode.tag}${graph.nNodes+1}`, properties);
                    // }
                }
                if(!hasnode && (parent as any)?.nodes) {
                    hasnode = (parent as any).nodes.get(properties.tag);
                    //if(hasnode) return hasnode; 
                } //return a different node if it already exists (implying we're chaining it in a flow graph using objects)
                if(hasnode) {
                    //this.merge(hasnode)
                    if(this.reactive) {
                        this.addLocalState(hasnode);
                    }

                    if(!this.source) this.source = hasnode;

                    let props = hasnode.getProps();
                    delete props.graph;
                    delete props.parent;

                    for (let k in props) {
                        const desc = Object.getOwnPropertyDescriptor(properties, k)
                        if (desc && desc.get && !desc.set) properties = Object.assign({}, properties) // Support ESM Modules: Only make a copy if a problem
                        else properties[k] = props[k];
                    }
                }
            }

            if(properties?.operator) {
                properties.operator = this.setOperator(properties.operator); //updates an arbitrary function if not fitting our operator format
            }
    
            if(!properties.tag && graph) {
                properties.tag = `node${graph.nNodes}`; //add a sequential id to find the node in the tree 
            }
            else if(!properties.tag) {
                properties.tag = `node${Math.floor(Math.random()*10000000000)}`; //add a random id for the top index if none supplied
            }    

            // for(const prop in properties) {
            //     if(!(prop in this)) {
            //         Object.defineProperty(this, prop,
            //         {
            //             enumerable : true, 
            //             configurable : true, 
            //             set: function(v) {
            //                 this.firstRun = true; this[prop] = v; 
            //             } //reset firstrun if graph properties are changed so it can update flow logic potentially
            //         });
            //         this[prop] = properties[prop];
            //     }
            //     else this[prop] = properties[prop];
            // }

            let keys = Object.getOwnPropertyNames(this); 
            for(const key in properties) {
                if(!keys.includes(key)) this._initial[key] = properties[key]; //get custom _initial values 
            }
            if(properties.children) this._initial.children = Object.assign({},properties.children); //preserve the prototypes
            
            Object.assign(this, properties);


            if(!this.tag) {
                if(graph) {
                    this.tag = `node${graph.nNodes}`;
                } else {
                    this.tag = `node${Math.floor(Math.random()*10000000000)}`;
                }
            }      

            if(graph) {
                this.graph=graph;
                if(graph.nodes.get(this.tag)) {
                    this.tag = `${this.tag}${graph.nNodes+1}` //make sure the tags are unique
                }
                graph.nodes.set(this.tag,this);
                graph.nNodes++;
                this.state = graph.state; //use the parent graph's unique state object to prevent overlap on common node names
            }


            if(this.reactive) {
                addLocalState(properties);
                if(typeof this.reactive === 'function') {
                    this.state.subscribeTrigger(this._unique,this.reactive);
                }
            }

            if(typeof parent === 'object') {
                this.parent=parent;
                if(parent instanceof GraphNode || parent instanceof Graph) parent.nodes.set(this.tag,this); //parentNode should get a mapped version with the original tag still
            }
            
            if(typeof properties.tree === 'object') { //can generate node maps from trees in nodes that will be available for use in the main graph, and the main graph will index them by tag
                for(const key in properties.tree) {
                    if(typeof properties.tree[key] === 'object') if((!properties.tree[key] as any).tag) {
                        (properties.tree[key] as any).tag = key;
                    }
                    let node = new GraphNode(properties.tree[key],this,graph);
                    this.nodes.set(node.tag,node);
                }
            }
        
            if(this.children) this.convertChildrenToNodes(this);
    
            if(this.parent instanceof GraphNode || this.parent instanceof Graph) this.checkNodesHaveChildMapped(this.parent, this);
        
            if(typeof this.oncreate === 'function') this.oncreate(this);
            if(!this.firstRun) this.firstRun = true; 
            if(this.animation && !this.animate) this.animate = true;
        }
        else return properties;
      
    }

    addLocalState = addLocalState;
    
    // I/O scheme for this node in the graph
    operator:OperatorType = (...args:any[]) => {
        return args as any;
    }
    
    //run the operator
    runOp = (
        ...args:any[]
    ) => {
        if(this.DEBUGNODE) console.time(this.tag);
        let result = this.operator(...args);
        if(result instanceof Promise) {
            result.then((res) => {
                if(res !== undefined) this.setState({[this.tag]:res}) //return null at minimum to setState
                if(this.DEBUGNODE) {console.timeEnd(this.tag); if(result !== undefined) console.log(`${this.tag} result:`, result)};
                return res;
            })
        }
        else {
            if(result !== undefined) this.setState({[this.tag]:result}); //return null at minimum to setState
            if(this.DEBUGNODE) {console.timeEnd(this.tag); if(result !== undefined) console.log(`${this.tag} result:`, result)};
        }
        
        return result;
    }

    //set an operator using our operator types or any arbitrary function :D    //this is the i/o handler, or the 'main' function for this node to propagate results. The origin is the node the data was propagated from 
    setOperator = (operator:OperatorType) => {
        if(typeof operator !== 'function') return operator;
        this.operator = operator.bind(this); // operator is always bound to this class instance
        return operator;
    }

    /**
     * Runs the graph node and passes output to connected nodes
     *
     * ```typescript
     * const res = await node.run(arg1, arg2, arg3);
     * ```
     */   
    
    runAsync = (...args:any[]) => {
        return new Promise((res,rej) => {res(this.run(...args))}); //will be a promise
    }

    transformArgs: (args:any[], self?:GraphNode) => any[] = (args=[]) => args

    isRunSync = () => {
        return !(this.children && this.forward || this.parent && this.backward || this.repeat || this.delay || this.frame || this.recursive || this.branch);
    };

    run = (...args:any[]) => {

        if (typeof this.transformArgs === 'function') args = this.transformArgs(args, this)
        
        //console.log('running node ', node.tag, 'children: ', node.children);
            
        //can add an animationFrame coroutine, one per node //because why not
        if(this.firstRun) {
            this.firstRun = false;
            this.runSync = this.isRunSync()

            if(this.animate && !this.isAnimating) {
                this.runAnimation(this.animation,args);
            }

            //can add an infinite loop coroutine, one per node, e.g. an internal subroutine
            if(this.loop && typeof this.loop === 'number' && !this.isLooping) {
                this.runLoop(this.looper,args);
            }

            if(this.loop || this.animate) return;

        }
    
        //no async/flow logic so just run and return the operator result (which could still be a promise if the operator is async)
        if(this.runSync){
            let res = this.runOp(...args); //repeat/recurse before moving on to the parent/child
            return res;
        }

        return new Promise(async (resolve) => {
            if(this) {
                let run = (node, tick=0, ...input):Promise<any> => {
                    return new Promise (async (r) => {
                        tick++;
                        let res = await node.runOp(...input); //executes the operator on the node in the flow logic
                        if(node.repeat) {
                            while(tick < node.repeat) {
                                if(node.delay) {
                                    setTimeout(async ()=>{
                                        r(await run(node,tick, ...input));
                                    },node.delay);
                                    break;
                                } else if (node.frame && window?.requestAnimationFrame as any) {
                                    requestAnimationFrame(async ()=>{
                                        r(await run(node,tick, ...input));
                                    });
                                    break;
                                }
                                else res = await node.runOp(...input);
                                tick++;
                            }
                            if(tick === node.repeat) {
                                r(res);
                                return;
                            }
                        } else if(node.recursive) {
                            
                            while(tick < node.recursive) {
                                if(node.delay) {
                                    setTimeout(async ()=>{
                                        r(await run(node,tick, ...res));
                                    },node.delay);
                                    break;
                                } else if (node.frame && window?.requestAnimationFrame as any) {
                                    requestAnimationFrame(async ()=>{
                                        r(await run(node,tick, ...res));
                                    });
                                    break;
                                }
                                else res = await node.runOp(...res);
                                tick++;
                            }
                            if(tick === node.recursive) {
                                r(res);
                                return;
                            }
                        } else {
                            r(res);
                            return;
                        }
                    });
                }
    
                let runnode = async () => {
    
                    let res = await run(this, undefined, ...args); //repeat/recurse before moving on to the parent/child
    
                    if(res !== undefined) { //if returning void let's not run the additional flow logic
                        if(this.backward && this.parent instanceof GraphNode) {
                            if(Array.isArray(res)) await this.runParent(this,...res);
                            else await this.runParent(this,res);
                        }
                        if(this.children && this.forward) {
                            if(Array.isArray(res)) await this.runChildren(this,...res);
                            else await this.runChildren(this,res);
                        }
                        if(this.branch) {
                            this.runBranch(this,res);
                        }
                    }
    
                    return res;
                }
    
                if(this.delay) {
                    setTimeout(async ()=>{
                        resolve(await runnode());
                    },this.delay);
                } else if (this.frame && window?.requestAnimationFrame as any) {
                    requestAnimationFrame(async ()=>{
                        resolve(await runnode());
                    });
                } else {
                    resolve(await runnode());
                }
                
            }
            else resolve(undefined);
        });
    }

    runParent = async (n:GraphNode, ...args) => {
        if(n.backward && n.parent) {
            if(typeof n.parent === 'string') {
                if(n.graph && n.graph?.get(n.parent)) {
                    n.parent = n.graph;
                    if(n.parent) this.nodes.set(n.parent.tag, n.parent);
                }
                else n.parent = this.nodes.get(n.parent);
            }
            
            if(n.parent instanceof GraphNode) await n.parent.run(...args);
        }
    }

    runChildren = async (n:GraphNode, ...args) => {

        if(typeof n.children === 'object') {
            for(const key in n.children) {
                if (typeof n.children[key] === 'string') {
                    if(n.graph && n.graph?.get(n.children[key])) {
                        n.children[key] = n.graph.get(n.children[key]); //try graph scope
                        if(!n.nodes.get(n.children[key].tag)) n.nodes.set(n.children[key].tag,n.children[key]);
                    }
                    if(!n.children[key] && n.nodes.get(n.children[key])) n.children[key] = n.nodes.get(n.children[key]); //try local scope
                } else if (typeof n.children[key] === 'undefined' || n.children[key] === true) {
                    if(n.graph && n.graph?.get(key)) {
                        n.children[key] = n.graph.get(key); //try graph scope
                        if(!n.nodes.get(n.children[key].tag)) n.nodes.set(n.children[key].tag,n.children[key]);
                    }
                    if(!n.children[key] && n.nodes.get(key)) n.children[key] = n.nodes.get(key); //try local scope
                }
                if(n.children[key]?.runOp)
                    await n.children[key].run( ...args);
            }
        }
    }

    runBranch = async (n:GraphNode, output:any) => {
        if(n.branch) {
            let keys = Object.keys(n.branch);
            await Promise.all(keys.map(async (k) => {
                    if(typeof n.branch[k].if === 'object') n.branch[k].if = stringifyFast(n.branch[k].if); //stringify object outputs, stringifyFast saves a TON of overhead
                    let pass = false;
                    if(typeof n.branch[k].if === 'function') {
                        pass = n.branch[k].if(output); //don't use async here, it's not a promise
                    }
                    else {
                        if(typeof output === 'object') {if(stringifyFast(output) === n.branch[k].if) pass = true;}
                        else if (output === n.branch[k].if) pass = true;
                    }
                    if(pass) {
                        if((n.branch[k].then as GraphNode).run) {
                            if(Array.isArray(output))  await n.branch[k].then.run(...output);
                            else await n.branch[k].then.run(...output);
                        }
                        else if (typeof n.branch[k].then === 'function') {
                            if(Array.isArray(output)) await n.branch[k].then(...output)
                            else await n.branch[k].then(output);
                        } 
                        else if (typeof n.branch[k].then === 'string') {
                            if(n.graph) n.branch[k].then = n.graph.nodes.get(n.branch[k].then);
                            else n.branch[k].then = n.nodes.get(n.branch[k].then);

                            if((n.branch[k].then as GraphNode).run) {
                                if(Array.isArray(output))  await n.branch[k].then.run(...output);
                                else await n.branch[k].then.run(...output);
                            } 
                        }
                    }
                    return pass;
            }))
        }
    }
    
    runAnimation = (
        animation:OperatorType=this.animation as any, 
        args:any[]=[], 
    ) => {
        //can add an animationFrame coroutine, one per node //because why not
        this.animation = animation as any;
        if(!animation) this.animation = this.operator as any;
        if(this.animate && !this.isAnimating && 'requestAnimationFrame' in window) {
            this.isAnimating = true;
            let anim = async () => {
                //console.log('anim')
                if(this.isAnimating) {
                    if(this.DEBUGNODE) console.time(this.tag);
                    let result = (this.animation  as any).call(this, ...args);
                    if(result instanceof Promise) {
                        result = await result;
                    }
                    if(this.DEBUGNODE) {console.timeEnd(this.tag); if(result !== undefined) console.log(`${this.tag} result:`, result)};
                    if(result !== undefined) {
                        if(this.tag) this.setState({[this.tag]:result}); //if the anim returns it can trigger state
                        if(this.backward && this.parent?.run) {
                            if(Array.isArray(result)) await this.runParent(this,...result);
                            else await this.runParent(this,result);
                        }
                        if(this.children && this.forward) {
                            if(Array.isArray(result)) await this.runChildren(this,...result);
                            else await this.runChildren(this,result);
                        }
                        if(this.branch) {
                            this.runBranch(this,result);
                        }
                        this.setState({[this.tag]:result});
                    }
                    requestAnimationFrame(anim);
                }
            }
            requestAnimationFrame(anim);
        }
    }
    
    runLoop = (
        loop:OperatorType=this.looper as any, 
        args:any[]=[], 
        timeout:number=this.loop
    ) => {
        //can add an infinite loop coroutine, one per node, e.g. an internal subroutine
        this.looper = loop;
        if(!loop) this.looper = this.operator;
        if(typeof timeout === 'number' && !this.isLooping) {
            this.isLooping = true;
            let looping = async () => {
                if(this.isLooping)  {
                    if(this.DEBUGNODE) console.time(this.tag);
                    let result = this.looper.call(this, ...args);
                    if(result instanceof Promise) {
                        result = await result;
                    }
                    if(this.DEBUGNODE) {console.timeEnd(this.tag); if(result !== undefined) console.log(`${this.tag} result:`, result)};
                    if(result !== undefined) {
                        if(this.tag) this.setState({[this.tag]:result}); //if the loop returns it can trigger state
                        if(this.backward && this.parent?.run) {
                            if(Array.isArray(result)) await this.runParent(this,...result);
                            else await this.runParent(this,result);
                        }
                        if(this.children && this.forward) {
                            if(Array.isArray(result)) await this.runChildren(this,...result);
                            else await this.runChildren(this,result);
                        }
                        if(this.branch) {
                            this.runBranch(this,result);
                        }
                        this.setState({[this.tag]:result});
                    }
                    setTimeout(async ()=>{ await looping(); }, timeout);
                }
            }
            looping(); // -.-
            //console.log('looping',timeout, loop, node.operator)
        }
    }
    
   
    // Set GraphNode parent
    setParent = (parent:GraphNode) => { 
        this.parent = parent;
        if(this.backward) this.runSync = false;
    }
    
    // Set GraphNode children
    setChildren = (children:GraphNode|GraphNode[]) => {
        this.children = children;
        if(this.forward) this.runSync = false;
    }
    
    //converts all children nodes and tag references to GraphNodes also
    add = (n:GraphNodeProperties|OperatorType|((...args)=>any|void)={}) => {
        if(typeof n === 'function') n = { operator:n as any};

        if (n?.node instanceof GraphNode) n = n.node
        if(!(n instanceof GraphNode)) n = new GraphNode(n.node ?? n,this,this.graph); 
        this.nodes.set(n.tag,n);
        if(this.graph) {
            this.graph.nodes.set(n.tag,n);
            this.graph.nNodes = this.graph.nodes.size;
        }
        return n;
    }
    
    remove = (n:string|GraphNode) => {
        if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.tag) {
            this.nodes.delete((n as GraphNode).tag);
            if(this.children[(n as GraphNode).tag]) delete this.children[(n as GraphNode).tag];
            if(this.graph) {
                this.graph.nodes.delete((n as GraphNode).tag);
                this.graph.nNodes = this.graph.nodes.size;
            }
            this.nodes.forEach((n:GraphNode) => {
                if(n.nodes.get((n as GraphNode).tag)) {
                    n.nodes.delete((n as GraphNode).tag);
                    if(n.children[(n as GraphNode).tag]) delete n.children[(n as GraphNode).tag];
                    if(n.parent?.tag === (n as GraphNode).tag) delete n.parent;
                }
            }); 
            
            if((n as GraphNode).ondelete) (n as GraphNode).ondelete(n);
        }

        if(typeof this._state === 'object') {
            this.state.unsubscribeTrigger(this._unique);
        }
    }
    
    //append a node as a child to a parent node (this by default)
    append = (n:string|GraphNode, parentNode=this) => {
        if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.nodes)  {
            parentNode.addChildren((n as GraphNode));
            if((n as GraphNode).forward) (n as GraphNode).runSync = false;
        }
    }      
            
    //subscribe an output with an arbitrary callback
    subscribe = (callback:string|GraphNode|((res)=>void),tag:string=this.tag) => {
        if(typeof callback === 'string') {
            if(this.graph) callback = this.graph.get(callback);
            else callback = this.nodes.get(callback);
        }
        if(typeof callback === 'function') {
            return this.state.subscribeTrigger(tag, callback);
        } else if(callback) return this.state.subscribeTrigger(tag, (res:any)=>{ (callback as any).run(res); })
    }
    
    //unsub the callback
    unsubscribe = (sub?:number,tag=this.tag) => {
        return this.state.unsubscribeTrigger(tag,sub);
    }

    subscribeState = (callback:string|GraphNode|((res)=>void)) => {
        if(!this.reactive) {
            return undefined;
        }
        else {
            if(typeof callback === 'string') {
                if(this.graph) callback = this.graph.get(callback);
                else callback = this.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this.state.subscribeTrigger(this._unique, callback);
            } else if(callback) return this.state.subscribeTrigger(this._unique, (_state:any)=>{ (callback as any).run(_state); })
        }
    }

    //append child
    addChildren = (children:{
        [key:string]:string|boolean|undefined|GraphNode|Graph|GraphNodeProperties
    }) => {
        if(!this.children) this.children = {};
        if(typeof children === 'object') {
            Object.assign(this.children,children);
        }
        this.convertChildrenToNodes();
        if(this.forward) this.runSync = false;
    }

    
    //Call parent node operator directly (.run calls the flow logic)
    callParent = (...args) => {
        if(typeof this.parent === 'string') {
            if(this.graph && this.graph?.get(this.parent)) {
                this.parent = this.graph;
                if(this.parent) this.nodes.set(this.parent.tag, this.parent);
            }
            else this.parent = this.nodes.get(this.parent);
        }
        if(typeof this.parent?.operator === 'function') return this.parent.runOp(...args);
    }
    
    //call children operators directly (.run calls the flow logic)
    callChildren = (...args) => {
        let result;
        if(typeof this.children === 'object') {
            for(const key in this.children) {
                if(this.children[key]?.runOp) this.children[key].runOp(...args);
            }
        }
        return result;
    }

    getProps = (n=this, getInitial:boolean=true) => {
        let baseprops = {
            tag:n.tag,
            operator:n.operator,
            graph:n.graph,
            children:n.children, //will return the original prototypes kept in this._initial if they exist
            parent:n.parent,
            forward:n.forward,
            backward:n.bacward,
            loop:n.loop,
            animate:n.animate,
            frame:n.frame,
            delay:n.delay,
            recursive:n.recursive,
            repeat:n.repeat,
            branch:n.branch,
            oncreate:n.oncreate,
            reactive:n.reactive,
            DEBUGNODE:n.DEBUGNODE
        }
       if(!getInitial) { //get current props
            let uniqueprops = {};
            for(const key in this._initial) {
                uniqueprops[key] = this[key];
            }
            return Object.assign(baseprops,uniqueprops)
       }
       else 
        return {
            tag:n.tag,
            operator:n.operator,
            graph:n.graph,
            children:n.children, //will return the original prototypes kept in this._initial if they exist
            parent:n.parent,
            forward:n.forward,
            backward:n.bacward,
            loop:n.loop,
            animate:n.animate,
            frame:n.frame,
            delay:n.delay,
            recursive:n.recursive,
            repeat:n.repeat,
            branch:n.branch,
            oncreate:n.oncreate,
            reactive:n.reactive,
            DEBUGNODE:n.DEBUGNODE,
            ...this._initial
       };
    }
    
    setProps = (props:GraphNodeProperties={}) => {
        let tmp = Object.assign({},props);
        if(tmp.children) {
            this.addChildren(props.children);
            delete tmp.children;
        }
        if(tmp.operator) {
            this.setOperator(props.operator);
            delete tmp.operator;
        }

        Object.assign(tmp,props);
        this.runSync = this.isRunSync()

    }

    removeTree = (n:GraphNode|string) => { //stop and dereference nodes to garbage collect them
        if(n)if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.nodes) {
            let checked = {};
            const recursivelyRemove = (node) => {
                if(typeof node.children === 'object' && !checked[node.tag]) {
                    checked[node.tag] = true;
                    for(const key in node.children) {
                        if(node.children[key].stopNode) 
                            node.children[key].stopNode();
                            
                        if(node.children[key].tag) {
                            if(this.nodes.get(node.children[key].tag)) 
                                this.nodes.delete(node.children[key].tag);

                            this.nodes.forEach((n) => {
                                if(n.nodes.get(node.children[key].tag)) 
                                    n.nodes.delete(node.children[key].tag);
                                if(n.children?.[key] instanceof GraphNode) 
                                    delete n.children[key];
                            });

                            
                            if((node.children[key] as GraphNode).ondelete && !this.graph) //the graph removeTree will call this 
                                (node.children[key] as GraphNode).ondelete(node.children[key]);

                            recursivelyRemove(node.children[key]);
                        }
                    }
                }
            }
            if((n as GraphNode).stopNode) 
                (n as GraphNode).stopNode();
            if((n as GraphNode).tag) {
                this.nodes.delete((n as GraphNode).tag);
                if(this.children?.[(n as GraphNode).tag]) 
                    delete this.children[(n as GraphNode).tag];
                if(this.parent?.tag === (n as GraphNode).tag) 
                    delete this.parent;
                if(this[(n as GraphNode).tag] instanceof GraphNode) 
                    delete this[(n as GraphNode).tag];
                this.nodes.forEach((n) => {
                    if((n as GraphNode)?.tag) {
                        if(n.nodes.get((n as GraphNode).tag)) n.nodes.delete((n as GraphNode).tag);
                        if(n.children?.[(n as GraphNode).tag] instanceof GraphNode) 
                            delete n.children[(n as GraphNode).tag];
                    }
                });
                recursivelyRemove(n);
                if(this.graph) 
                    this.graph.removeTree(n, checked); //remove from parent graph too 
                else if((n as GraphNode).ondelete) 
                    (n as GraphNode).ondelete(n);
            }
        }
    }

    checkNodesHaveChildMapped = (n:GraphNode|Graph, child:GraphNode, checked={}) => { //crawling around node/graph maps 
        let tag = n.tag;
        if(!tag) tag = n.name;

        if(!checked[tag]) {
            checked[tag] = true;
            if(n.children) {
                if(child.tag in n.children) {
                    if((n.children[child.tag] instanceof GraphNode)) {
                        if(!n.nodes.get(child.tag)) n.nodes.set(child.tag,child);
                        n.children[child.tag] = child;
                        if(!n.firstRun) n.firstRun = true; 
                    }
                }
            }
            if(n.parent instanceof GraphNode) {
                if(n.nodes.get(child.tag)) 
                    n.parent.nodes.set(child.tag,child);
                if(n.parent.children) {
                    this.checkNodesHaveChildMapped(n.parent,child,checked);
                } else if(n.nodes) {
                    n.nodes.forEach((n) => {
                        if(!checked[n.tag]) {
                            this.checkNodesHaveChildMapped(n,child,checked);
                        }
                    });
                }
            } 
            if(n.graph) {
                if(n.parent && (n.parent.name !== n.graph.name)) {
                    n.graph.nodes.forEach((n) => {
                        if(!checked[n.tag]) {
                            this.checkNodesHaveChildMapped(n,child,checked);
                        }
                    });
                }
            }
        }
    }
         
    convertChildrenToNodes = (n:GraphNode=this) => {
        if(n?.children) {
            for(const key in n.children) { //object syntax instead of setting single nodes etc.
                if(!(n.children[key] instanceof GraphNode)) {
                    if (typeof n.children[key] === 'object') {
                        if(!n.children[key].tag) n.children[key].tag = key;
                        //console.log(key,n.tag,(n.graph.nodes.get(n.children[key].tag)?.parent.tag),n.graph.tag)
                        if(!n.nodes.get(n.children[key].tag)) {
                            //console.log(n.children[key], n.nodes.size);
                            n.children[key] = new GraphNode(n.children[key],n,n.graph); //make a brand new graphnode based on the object spec
                            this.checkNodesHaveChildMapped(n,n.children[key]); //then climb up the tree to make sure each enclosing layer has node references for these children
                            //console.log(n.children[key], n.nodes.size);
                        }
                    }
                    else {
                        if(typeof n.children[key] === 'undefined' || n.children[key] == true) {
                            n.children[key] = n.graph.get(key); //try graph scope
                            if(!n.children[key]) n.children[key] = n.nodes.get(key);
                        }
                        else if(typeof n.children[key] === 'string') {
                            let k = n.children[key];
                            n.children[key] = n.graph.get(k); //try graph scope
                            if(!n.children[key]) n.children[key] = n.nodes.get(key);
                        } 
                        if(n.children[key] instanceof GraphNode) {
                            n.nodes.set(n.children[key].tag, n.children[key]);
                            this.checkNodesHaveChildMapped(n, n.children[key]); 
                            if(!(n.children[key].tag in n)) n[n.children[key].tag] = n.children[key]; //set it as a property by name too as an additional easy accessor; 
                        }
                    }
                }
            }
        }
        return n.children;
    }
    
    //stop any loops
    stopLooping = (n:GraphNode=this) => {
        n.isLooping = false;
    }
    
    stopAnimating = (n:GraphNode=this) => {
        n.isAnimating = false;
    }
    
    stopNode = (n:GraphNode=this) => {
        n.stopAnimating(n);
        n.stopLooping(n);
    }

    
    //subscribe a node (that isn't a forward-passed child of this node) to run after this node 
    subscribeNode = (n:GraphNode|string) => {
        if(typeof n === 'string') n = this.nodes.get(n) as GraphNode;
        if(n.tag) this.nodes.set(n.tag,n); //register the node on this node
        if(n) return this.state.subscribeTrigger(this.tag,
            (res)=>{
                if(Array.isArray(res)) (n as GraphNode).run(...res);
                else (n as GraphNode).run(res);
            })
    }
    
    //recursively print a snapshot reconstructible json hierarchy of the node and the children. 
    // Start at the top/_initially called nodes to print the whole hierarchy in one go
    print = (n:string|GraphNode=this,printChildren=true,nodesPrinted:any[]=[]) => {
    
        let dummyNode = new GraphNode(); //test against this for adding props
    
        if(typeof n === 'string') n = this.nodes.get(n);
        if(n instanceof GraphNode) {
            
            nodesPrinted.push(n.tag);
        
            let jsonToPrint:any = {
                tag:n.tag,
                operator:n.operator.toString()
            };
        
            if(n.parent) jsonToPrint.parent = n.parent.tag;
            //step through the children
            if(typeof n.children === 'object') {
                for(const key in n.children) {
                    if(typeof n.children[key] === 'string') return n.children[key];
                    if(nodesPrinted.includes(n.children[key].tag)) return n.children[key].tag;   
                    else if(!printChildren) {
                        return n.children[key].tag;
                    }
                    else return n.children[key].print(n.children[key],printChildren,nodesPrinted);
                }
            }
        
            for(const prop in n) {
                if(prop === 'parent' || prop === 'children') continue; //skip these as they are dealt with as special cases
                if(typeof (dummyNode as any)[prop] === 'undefined') {
                    if(typeof n[prop] === 'function') {
                        jsonToPrint[prop] = n[prop].toString()
                    } else if (typeof n[prop] === 'object') {
                        jsonToPrint[prop] = (JSON as any).stringifyWithCircularRefs(n[prop]); //circular references won't work, nested nodes already printed elsewhere in the tree will be kept as their tags
                    } 
                    else {
                        jsonToPrint[prop] = n[prop];
                    }
                }
            }
        
            return JSON.stringify(jsonToPrint);
            
        }
        
    }
    
    //reconstruct a node hierarchy (incl. stringified functions) into a GraphNode set
    reconstruct = (json:string|{[x:string]: any}) => {
        let parsed = reconstructObject(json);
        if(parsed) return this.add(parsed);
    }

    setState = (data:{[key:string]:any}) => { this.state.setState(data); };

    DEBUGNODES = (debugging:boolean=true) => {
        this.DEBUGNODE = debugging;
        this.nodes.forEach((n:GraphNode) => {
            if(debugging) n.DEBUGNODE = true;
            else n.DEBUGNODE = false;
        });
    }
}


// Macro set for GraphNodes
export class Graph {

    nNodes = 0
    tag:string;
    nodes:Map<any,any> = new Map();
    state=new EventHandler();
    reactive:boolean|((_state:{[key:string]:any})=>void)
    _initial:any;
    //_state: any = {};
    _unique=`${Math.random()}`; //mostly-guaranteed unique id

    //can create preset node trees on the graph
    tree:Tree = {};

    [key:string]:any;

    constructor( tree?:Tree, tag?:string, props?:{[key:string]:any} ) {
        this.tag = tag ? tag : `graph${Math.floor(Math.random()*100000000000)}`;

        if(props) {

            console.log(props, props.constructor.name)

            if(props.reactive) {
                this.addLocalState(props);
            } else Object.assign(this,props);

            this._initial = props;
        }
        if(tree || Object.keys(this.tree).length > 0) this.setTree(tree);
    }

    addLocalState = addLocalState;

    //converts all children nodes and tag references to GraphNodes also
    add = (n:GraphNode|GraphNodeProperties|OperatorType|((...args)=>any|void)={}) => {
        
        if ((n as GraphNode)?.node instanceof GraphNode) n = (n as GraphNode).node

        let props = n;

        if(!(n instanceof GraphNode)) n = new GraphNode((props as GraphNode)?.node ?? props,this,this); 
        else {
            this.nNodes = this.nodes.size;
            if(n.tag) {
                this.tree[n.tag] = props; //set the head node prototype in the tree object
                this.nodes.set(n.tag,n);
            }
        }

        return n;
    }

    setTree = (tree:Tree = this.tree) => {

        if(!tree) return;

        for(const node in tree) { //add any nodes not added yet, assuming we aren't overwriting the same tags to the tree.
            const n = this.nodes.get(node)
            if(!n) {

                if(typeof tree[node] === 'function') {
                    this.add({tag:node, operator:tree[node] as OperatorType|((...args)=>any|void)});
                }
                else if (typeof tree[node] === 'object' && !Array.isArray(tree[node])) {
                    if(!(tree[node] as any).tag) (tree[node] as any).tag = node;
                    let newNode = this.add(tree[node]);
                    if((tree[node] as GraphNodeProperties).aliases) {
                        (tree[node] as GraphNodeProperties).aliases.forEach((a) => {
                            this.nodes.set(a,newNode); 
                        });
                    }
                } else {
                    //we are trying to load something like a number or array in this case so lets make it a node that just returns the value
                    this.add({tag:node,operator:(...args) => {return tree[node];}});
                }
            } else {
                if (typeof tree[node] === 'function') {
                    n.setOperator(tree[node]);
                }
                else if(typeof tree[node] === 'object') {
                    if(tree[node] instanceof GraphNode) {
                        this.add(tree[node]);
                    } else if(tree[node] instanceof Graph) {
                        //in case any stuff was added to the graph to indicate flow logic
                        let source = tree[node] as any;
                        let properties = {} as any;
                        if(source.operator) properties.operator = source.operator;
                        if(source.children) properties.children = source.children;
                        if(source.forward) properties.forward = source.forward;
                        if(source.backward) properties.backward = source.backward;
                        if(source.repeat) properties.repeat = source.repeat;
                        if(source.recursive) properties.recursive = source.recursive;
                        if(source.loop) properties.loop = source.loop;
                        if(source.animate) properties.animate = source.animate;
                        if(source.looper) properties.looper = source.looper;
                        if(source.animation) properties.animation = source.animation;
                        if(source.delay) properties.delay = source.delay;
                        if(source.tag) properties.tag = source.tag;
                        if(source.oncreate) properties.oncreate = source.oncreate;
                        if(source.node?._initial) Object.assign(properties,source.node._initial);
                        properties.nodes = source.nodes;
                        properties.source = source;
                        n.setProps(properties);
                    } else {
                        n.setProps(tree[node]);
                    }
                }
            }
        }

        this.nodes.forEach((node:GraphNode) => { //swap any child strings out for the proper nodes

            if(typeof node.children === 'object') {
                for(const key in node.children) {
                    if(typeof node.children[key] === 'string') {
                        if(this.nodes.get(node.children[key])) {
                            node.children[key] = this.nodes.get(node.children[key]);
                        }
                    } else if (node.children[key] === true || typeof node.children[key] === 'undefined') {
                        if(this.nodes.get(key)) {
                            node.children[key] = this.nodes.get(key);
                        }
                    }
                    if(node.children[key] instanceof GraphNode) {
                        node.checkNodesHaveChildMapped(node,node.children[key]);
                    }
                }
            }
            
            if(typeof node.parent === 'string') {
                if(this.nodes.get(node.parent)) {
                    node.parent = this.nodes.get(node.parent);
                    node.nodes.set(node.parent.tag,node.parent);
                }
            }
        });

    }

    get = (tag:string) => {
        return this.nodes.get(tag);
    }

    set = (n:GraphNode) => {
        return this.nodes.set(n.tag,n);
    }

    //Should create a sync version with no promises (will block but be faster)
    run = (n:string|GraphNode,...args) => {
        if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.run)
            return (n as GraphNode).run(...args)
        else return undefined;
    }
    
    runAsync = (n:string|GraphNode,...args) => {
        if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.run)
            return new Promise((res,rej) => {res((n as GraphNode).run(...args))})
        else return new Promise((res,rej) => {res(undefined)});
    }

    removeTree = (n:string|GraphNode, checked?:any) => {
        if(n)if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.nodes) {
            let checked = {};
            const recursivelyRemove = (node) => {
                if(typeof node.children === 'object' && !checked[node.tag]) {
                    checked[node.tag] = true;
                    for(const key in node.children) {
                        if(node.children[key]?.stopNode) 
                            node.children[key].stopNode();
                        if(node.children[key]?.tag) {
                            if(this.nodes.get(node.children[key].tag)) 
                                this.nodes.delete(node.children[key].tag);

                            this.nodes.forEach((n) => {
                                if(n.nodes.get(node.children[key].tag)) 
                                    n.nodes.delete(node.children[key].tag);
                                if(n.children?.[key] instanceof GraphNode) 
                                    delete n.children[key];
                            });

                            if((node.children[key] as GraphNode).ondelete) 
                                (node.children[key] as GraphNode).ondelete(node.children[key]);

                            recursivelyRemove(node.children[key]);
                        }
                    }
                }
            }
            if((n as GraphNode).stopNode) 
                (n as GraphNode).stopNode();
            if((n as GraphNode).tag) {
                this.nodes.delete((n as GraphNode).tag);
                if(this.parent?.tag === (n as GraphNode).tag) 
                    delete this.parent;
                if(this[(n as GraphNode).tag] instanceof GraphNode) 
                    delete this[(n as GraphNode).tag];
                this.nodes.forEach((n) => {
                    if((n as GraphNode)?.tag) {
                        if(n.nodes.get((n as GraphNode).tag)) n.nodes.delete((n as GraphNode).tag);
                        if(n.children?.[(n as GraphNode).tag] instanceof GraphNode) 
                            delete n.children[(n as GraphNode).tag];
                    }
                });
                recursivelyRemove(n);
                if((n as GraphNode).ondelete) 
                    (n as GraphNode).ondelete(n);
            }
        }
    }

    remove = (n:string|GraphNode) => {
        if(typeof n === 'string') n = this.nodes.get(n);
        if((n as GraphNode)?.nodes) {
            if((n as GraphNode).stopNode) (n as GraphNode).stopNode();
            if((n as GraphNode)?.tag) {
                if(this.nodes.get((n as GraphNode).tag)) 
                {
                    this.nodes.delete((n as GraphNode).tag);
                    //if(this.graph) this.graph.nodes.delete(node.tag);
                    this.nodes.forEach((n) => {
                        if(n.nodes.get((n as GraphNode).tag)) n.nodes.delete((n as GraphNode).tag);
                    });
                }
            }
            if((n as GraphNode).ondelete) (n as GraphNode).ondelete(n);
        }
        return n;
    }

    append = (n:GraphNode, parentNode:GraphNode) => {
        parentNode.addChildren(n);
    }

    callParent = async (n:GraphNode, ...args ) => {
        if(n?.parent) {
            return await n.callParent(...args);
        }
    }

    callChildren = async (n:GraphNode, ...args) => {
        if(n?.children) {
            return await n.callChildren(...args);
        }
    }

    subscribe = (
        n:string|GraphNode,
        callback:GraphNode|string|((res:any)=>void) //subscribe a callback or another node (pass a node or string in this case)
    ) => {
        if(!callback) return;
        if((n as GraphNode)?.subscribe && typeof callback === 'function') {
            return (n as GraphNode).subscribe(callback);
        }
        else if(callback instanceof GraphNode || typeof callback === 'string')
            return this.subscribeNode(n,callback)
        else if(typeof n == 'string') {
            return this.state.subscribeTrigger(n,callback);
        }
    }

    unsubscribe = (tag:string,sub?:number) => {
        return this.state.unsubscribeTrigger(tag,sub);
    }

    subscribeState = (callback:string|GraphNode|((res)=>void)) => {
        if(!this.reactive) {
            return undefined;
        }
        else {
            if(typeof callback === 'string') {
                if(this.graph) callback = this.graph.get(callback);
                else callback = this.nodes.get(callback);
            }
            if(typeof callback === 'function') {
                return this.state.subscribeTrigger(this._unique, callback);
            } else if(callback) return this.state.subscribeTrigger(this._unique, (_state:any)=>{ (callback as any).run(_state); })
        }
    }

    //subscribe a node to this node that isn't a child of this node
    subscribeNode = (inputNode:string|GraphNode, outputNode:GraphNode|string) => {
        let tag;
        if((inputNode as GraphNode)?.tag) tag = (inputNode as GraphNode).tag;
        else if (typeof inputNode === 'string') tag = inputNode;
        if(typeof outputNode === 'string') outputNode = this.nodes.get(outputNode);
        //console.log(outputNode, inputNode);
        if(inputNode && outputNode) {
            let sub = this.state.subscribeTrigger(tag,(res)=>{ 
                if(Array.isArray(res)) (outputNode as GraphNode).run(...res);
                else (outputNode as GraphNode).run(res);
            }); // TODO: Check if correct node
            //console.log(this.state,tag);
            return sub;
        } 
    }

    stopNode = (n:string|GraphNode) => {
        if(typeof n === 'string') {
            n = this.nodes.get(n);
        }
        if((n as GraphNode)?.stopNode) {
            (n as GraphNode).stopNode(); //just sets node.isAnimating and node.isLooping to false
        }
    }

    print = (n?:GraphNode,printChildren=true) => {
        if((n as GraphNode)?.print) return n.print(n,printChildren);
        else {
            let printed = `{`;
            this.nodes.forEach((n) => { //print all nodes if none specified
                printed+=`\n"${n.tag}:${n.print(n,printChildren)}"`  
            });
            return printed;
        }
    }

    //reconstruct a node hierarchy (incl. stringified functions) into a GraphNode set
    reconstruct = (json:string|{[x:string]: any}) => {
        let parsed = reconstructObject(json);
        if(parsed) return this.add(parsed);
    }

    create = (operator:OperatorType,parentNode:GraphNode,props:GraphNodeProperties) => {
        return createNode(operator,parentNode,props,this);
    }

    setState = (data:{[key:string]:any}) => { this.state.setState(data); };

    DEBUGNODES = (debugging:boolean=true) => {
        this.nodes.forEach((n:GraphNode) => {
            if(debugging) n.DEBUGNODE = true;
            else n.DEBUGNODE = false;
        });
    }

}


//macro
export function reconstructNode(json:string|{[x:string]: any},parentNode,graph) {
    let reconstructed = reconstructObject(json);
    if(reconstructed) return new GraphNode(reconstructed,parentNode,graph);
    else return undefined;
}

// exports.Graph = Graph;
// exports.GraphNode = GraphNode;

//parse stringified object with stringified functions
export function reconstructObject(json:string|{[x:string]: any}='{}') {
    try{

        // Allow raw object
        let parsed = (typeof json === 'string') ? JSON.parse(json) : json

        const parseObj = (obj) => {
            for(const prop in obj) {
                if(typeof obj[prop] === 'string') {
                    let funcParsed = parseFunctionFromText(obj[prop]);
                    if(typeof funcParsed === 'function') {
                        obj[prop] = funcParsed;
                    }
                } else if (typeof obj[prop] === 'object') {
                    parseObj(obj[prop]);
                }
            }
            return obj;
        }

        return parseObj(parsed);
    } catch(err) {console.error(err); return undefined;}

}

export const stringifyWithCircularRefs = (function() {
    const refs = new Map();
    const parents:any[] = [];
    const path = ["this"];

    function clear() {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    }

    function updateParents(key, value) {
        var idx = parents.length - 1;
        var prev = parents[idx];
        if(typeof prev === 'object') {
            if (prev[key] === value || idx === 0) {
                path.push(key);
                parents.push(value.pushed);
            } else {
                while (idx-- >= 0) {
                    prev = parents[idx];
                    if(typeof prev === 'object') {
                        if (prev[key] === value) {
                            idx += 2;
                            parents.length = idx;
                            path.length = idx;
                            --idx;
                            parents[idx] = value;
                            path[idx] = key;
                            break;
                        }
                    }
                    idx--;
                }
            }
        }
    }

    function checkCircular(key, value) {
    if (value != null) {
        if (typeof value === "object") {
        if (key) { updateParents(key, value); }

        let other = refs.get(value);
        if (other) {
            return '[Circular Reference]' + other;
        } else {
            refs.set(value, path.join('.'));
        }
        }
    }
    return value;
    }

    return function stringifyWithCircularRefs(obj, space?) {
    try {
        parents.push(obj);
        return JSON.stringify(obj, checkCircular, space);
    } finally {
        clear();
    }
    }
})();

if((JSON as any).stringifyWithCircularRefs === undefined) {
    //Workaround for objects containing DOM nodes, which can't be stringified with JSON. From: https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    (JSON as any).stringifyWithCircularRefs = stringifyWithCircularRefs;
}

//partial stringification for objects and removing circular references. This allows MUCH faster object equivalency comparison with three-tier depth checking
export const stringifyFast = (function() {
    const refs = new Map();
    const parents:any = [];
    const path = ["this"];

    function clear() {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    }

    function updateParents(key, value) {
        var idx = parents.length - 1;
        //console.log(idx, parents[idx])
        if(parents[idx]){
            var prev = parents[idx];
            //console.log(value); 
            if(typeof prev === 'object') {
                if (prev[key] === value || idx === 0) {
                    path.push(key);
                    parents.push(value.pushed);
                } else {
                    while (idx-- >= 0) {
                        prev = parents[idx];
                        if(typeof prev === 'object') {
                            if (prev[key] === value) {
                                idx += 2;
                                parents.length = idx;
                                path.length = idx;
                                --idx;
                                parents[idx] = value;
                                path[idx] = key;
                                break;
                            }
                        }
                        idx++;
                    }
                }
            }
        }
    }

    function checkValues(key, value) {
        let val;
        if (value != null) {
            if (typeof value === "object") {
                //if (key) { updateParents(key, value); }
                let c = value.constructor.name;
                if (key && c === 'Object') {updateParents(key, value); }

                let other = refs.get(value);
                if (other) {
                    return '[Circular Reference]' + other;
                } else {
                    refs.set(value, path.join('.'));
                }
                if(c === "Array") { //Cut arrays down to 100 samples for referencing
                    if(value.length > 20) {
                        val = value.slice(value.length-20);
                    } else val = value;
                   // refs.set(val, path.join('.'));
                }  
                else if (c.includes("Set")) {
                    val = Array.from(value)
                }  
                else if (c !== "Object" && c !== "Number" && c !== "String" && c !== "Boolean") { //simplify classes, objects, and functions, point to nested objects for the state manager to monitor those properly
                    val = "instanceof_"+c;
                }
                else if (c === 'Object') {
                    let obj = {};
                    for(const prop in value) {
                        if (value[prop] == null){
                            obj[prop] = value[prop]; 
                        }
                        else if(Array.isArray(value[prop])) { 
                            if(value[prop].length>20)
                                obj[prop] = value[prop].slice(value[prop].length-20); 
                            else obj[prop] = value[prop];
                        } //deal with arrays in nested objects (e.g. means, slices)
                        else if (value[prop].constructor.name === 'Object') { //additional layer of recursion for 3 object-deep array checks
                            obj[prop] = {};
                            for(const p in value[prop]) {
                                if(Array.isArray(value[prop][p])) {
                                    if(value[prop][p].length>20)
                                        obj[prop][p] = value[prop][p].slice(value[prop][p].length-20); 
                                    else obj[prop][p] = value[prop][p];
                                }
                                else { 
                                    if (value[prop][p] != null){
                                        let con = value[prop][p].constructor.name;
                                        if (con.includes("Set")) {
                                            obj[prop][p] = Array.from(value[prop][p])
                                        } else if(con !== "Number" && con !== "String" && con !== "Boolean") {
                                            obj[prop][p] = "instanceof_"+con; //3-deep nested objects are cut off
                                        }  else {
                                            obj[prop][p] = value[prop][p]; 
                                        }
                                    } else {
                                        obj[prop][p] = value[prop][p]; 
                                    }
                                }
                            }
                        }
                        else { 
                            let con = value[prop].constructor.name;
                            if (con.includes("Set")) {
                                obj[prop] = Array.from(value[prop])
                            } else if(con !== "Number" && con !== "String" && con !== "Boolean") {
                                obj[prop] = "instanceof_"+con;
                            } else {
                                obj[prop] = value[prop]; 
                            }
                        }
                    }
                    //console.log(obj, value)
                    val = obj;
                    //refs.set(val, path.join('.'));
                }
                else {
                    val = value;
                }
            } else {
                val = value;
            }
        }
        //console.log(value, val)
        return val;
    }

    return function stringifyFast(obj, space?) {
        parents.push(obj);
        let res = JSON.stringify(obj, checkValues, space);
        clear();
        return res;
    }
})();

if((JSON as any).stringifyFast === undefined) {
    //Workaround for objects containing DOM nodes, which can't be stringified with JSON. From: https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    (JSON as any).stringifyFast = stringifyFast;
}

export function createNode(operator:OperatorType,parentNode:GraphNode,props:GraphNodeProperties,graph:Graph) {
    if(typeof props === 'object') {
        (props.operator as any) = operator;
        return new GraphNode(props,parentNode,graph);
    }
    return new GraphNode({operator:operator},parentNode,graph);
}
