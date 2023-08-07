import {Graph, GraphNode, GraphNodeProperties, Listener, getCallbackFromString, wchtmlloader} from '../../index'
import { replaceListenerArg } from './listenerManip';

import { LiteGraph, LGraph, LGraphCanvas, LGraphNode} from './litegraph.js'

export type LGraphNodeProps = {
  __renderHTML?:boolean, //do we want to visualize elements inside the node or on a blank page area (like a typical document vs in-editor) Make this toggle between where it renders in the page/editor
  __widget?:{
    //we can use the built-in widgets and/or we can renderHtml, just figure out how to access the html to set them next to each other somehow
  }
  __position?:{
    //will be set by default otherwise based on proximity to connections
  }
} & GraphNodeProperties;

export type LGraphNodeM = LGraphNode & {
  triggers:any, 
  __node:GraphNode, 
  __graph:Graph, 
  __unique:string,//GraphNode unique Id for event lookup
  editor:LGraph, tag:string, key?:string,
  subs:{[key:string]:{ sub:number, listener:Listener }}
  __settings?:{
    mode?:'nodeMethod' //default, a node just runs a function method or a getter for a variable 
      | 'nodeInstance' //alternatively, we can break out several variables on node
      | 'subGraph', //or this is a node on a subgraph for a node, so implicitly all variable are "this", i.e. for internal listeners to states for containing logic (ala blueprints)
     
    nodeOutputs?:string[],
    [key:string]:any
  },

  firstConnect:boolean //internal
}


const execPin = '►'; //for modded litegraph

//https://stackoverflow.com/questions/9091838/get-function-parameter-names-for-interface-purposes
export function getFnParamNames(fn){
    if(typeof fn !== 'string') fn = fn.toString();
    const arrowMatch = fn.match(/\(?[^]*?\)?\s*=>/) 
    if (arrowMatch) return arrowMatch[0].replace(/[()\s]/gi,'').replace('=>','').split(',')
    const match = fn.match(/\([^]*?\)/) 
    return match ? match[0].replace(/[()\s]/gi,'').split(',') : []
}


export let registered = new Map<string, any>();
export let created = new Map<string, LGraphNodeM>();

export function addNodeToLGraph(node,graph, editor:LGraph) {
  let roots = graph.__node.roots;
  let hasNode = registered.get(node.__node.tag) as LGraphNodeM;
  if (!hasNode) {
      registerNode(node, roots[node.__node.tag],undefined,editor);
      for(const key in node) {
        if(!key.startsWith('__'))
          registerNode(node, roots[node.__node.tag], key, editor);
      }
  }
}

export function registerLGraphNodesFromGraph(graph:Graph, editor:LGraph) {
  graph.__node.nodes.forEach((node) => {
    addNodeToLGraph(node,graph, editor);
  });
}

export const updateNodePosition = (current, sourceNode) => {
  const previous =  sourceNode;
  const [ x, y ] = previous.pos;
  const [ width, height ] = previous.size;

  current.pos = [x + width + 50, y + height + 50]; // Update position at the end
}

//fix!!!
export function updateArgNodePosition (target, nodes) {

  const [ targetX ] = target.pos
  const [ targetWidth ] = target.size

  nodes.forEach((n:LGraphNodeM) => {
    const [ _, y ] = n.pos
    const [ __, height ] = n.size

    //let bb = n.getBounding(); //include bounding box?
    
    n.pos = [targetX - targetWidth - 50, y + height + 50];
  });
}

export function createNode(name:string, LGraph:LGraph, duplicate = false) {
  const got = created.get(name)
  if (!duplicate && got) return got as LGraphNodeM;
  const node = LiteGraph.createNode(name);
  created.set(name, node as LGraphNodeM)
  LGraph.add(node)
  return node as LGraphNodeM;
}




export function renderLGraphFromExistingEvents(
  graph:Graph, 
  LGraph:LGraph
) {

  let minY = 0;
  for(const key in graph.__node.state.triggers) {
    let tarr = graph.__node.state.triggers[key] as any as Listener[];
    let nodes = [] as any[];
    for(const trigger of tarr) {
      //create each node in the arg stack if exists, connect by arg position, exec pins only at listener level
      const name = trigger.tkey ? trigger.target+'.'+trigger.tkey : trigger.target as string;
      let node = createNode(name,LGraph,true);
      let srcname = trigger.key ? trigger.source+'.'+trigger.key : trigger.source as string;
    
      let hasNode = created.get(srcname);
      let srcnode = createNode(srcname, LGraph, false);


      updateNodePosition(node, srcnode);

      if(!hasNode) {
        srcnode.pos[1] = minY + 25;
      }
    
      node.pos[0] = srcnode.pos[0] + 50;
      if(minY > node.pos[1]) node.pos[1] = minY + 50;
      else node.pos[1] = srcnode.pos[1] + 50;
      minY = node.pos[1];

      //set x and y offset
      
      if(trigger.__args) {

        const iterateArg = (arg, node, i) => {
          if(typeof arg === 'object') {
            let cb = arg.__callback ? arg.__callback : arg.__input;
            if(cb) {
              let argnode = createNode(cb as string,LGraph, true);
              argnode.connect(1, node, i); //todo: several argument slots?
              if(arg.__args) {
                let argnodes = [] as any[];
                arg.__args.forEach((a,j) => {
                  argnodes.push(iterateArg(a,argnode,j+1));
                });
                if(argnodes.length > 0) {
                  updateArgNodePosition(argnode, argnodes);
                  argnodes.forEach((n) => {
                    if(minY > n.pos[1]) minY = n.pos[1];
                  });
                }  
              }
              return argnode;
            }
          } else if (typeof arg === 'string') {
            let argnode = createNode(arg, LGraph, true);
            argnode.connect(1, node, i); //todo: several argument slots?
            return argnode;
          } 
        }

        let argnodes = [] as any[];
        trigger.__args.forEach((arg,i) => {
          argnodes.push(iterateArg(arg,node,i+1)); 
        });

        if(argnodes.length > 0) {
          updateArgNodePosition(node, argnodes);
          argnodes.forEach((n) => {
            if(minY > n.pos[1]) minY = n.pos[1];
          });
        }
      }

      srcnode.connect(0,node,0);
      node.subs[Object.keys(node.subs).length] = { sub:trigger.sub, listener:trigger };
      nodes.push(node);
    }
    for(const node of nodes) {
      node.firstConnect = false; //future connections will trigger the subscription swapping
    }
  }
}

  //creates a new nested arg array from visual connections
const getArgsFromNode = (editor:LGraph,
  currentOutputNode:LGraphNodeM, args=[] as any[], previousNode?:LGraphNodeM, curDepth = 0, wasAdded = {}  //prevent circular infinite looping
) => {
  currentOutputNode.inputs.forEach((inp,i) => {
    if(i>0) { //don't use first slot, which we labeled as an exec pin
      if(inp.link) { //all arg inputs only have one link (not the case for exec links which may have .extraLinks)
        if(editor) {
          let link = editor.links[inp.link];
          let inputNodei = editor.getNodeById(link.origin_id);
          let origin = link.origin_slot;
          if(inputNodei) {
            if(inputNodei.outputs[origin].name === 'Get') {
              args[i - 1] = inputNodei.title; //the title is the node or method key
              //stop it here
            } else {
              args[i - 1] = { __callback:inputNodei.title };
              curDepth++;
              if(wasAdded[link.origin_id]) { //prevent infinite recursion
                args[i - 1].__args[i-1] = wasAdded[link.origin_id];
              } else { //go get em otherwise
                inputNodei.inputs.forEach((inpj, j) => {
                  if(j > 0) {
                    if(inpj.link) {
                      if(!args[i-1].__args) {
                        args[i-1].__args = [];
                        wasAdded[link.origin_id] = args[i - 1].__args;
                      }
                      let linkj = editor.links[inpj.link];
                      let inputNodej = editor.getNodeById(linkj.origin_id);
                      let originj = linkj.origin_slot;
                      if(inputNodej) {
                        args[i - 1].__args = getArgsFromNode(
                          editor,
                          inputNodej as LGraphNodeM, 
                          args[i - 1].__args, 
                          inputNodei as LGraphNodeM, 
                          curDepth, 
                          wasAdded
                        );
                      }
                    }
                  }
                });
              }
            }
          }
        }
      } else args[i-1] = undefined;
    }
  });

  return args;
}


const checkNodeForSubscriptionUpdate = (
  self:LGraphNodeM, editor:LGraph, inputIndex, outputType, outputSlot, outputNode, outputIndex
) => {
      
  let execChanged = false; //do we need to update subscriptions?
  
  if(
    (self.inputs[inputIndex].name === execPin && outputSlot.name !== execPin) 
      ||
    (self.inputs[inputIndex].name !== execPin && outputSlot.name === execPin) 
  ) {
    return false; //reject a non-event connection
  } else {
    //these are both exec inputs
    execChanged = true; 
  }

  //a link is updated so check if we have an exec on this node
  if(!execChanged && !(Object.keys(self.inputs).find((v) => { if(self.inputs[v].name === execPin && self.inputs[v].link) return true; }) || (self.inputs[0] as any).extraLinks))
    execChanged = true;

  if(execChanged) {
    //these are subscriptions
    //graph.subscribe()
    //and/oor modify the listener
  } else {

    /*
     *
     * 
     * On connecting to an arg input, 
     * 
     * 
     */

    let args = getArgsFromNode(editor, self as LGraphNodeM);

    const subNode = (i, sourceNode) => {
      if(self.subs[i]) {
        let listener = self.subs[i].listener;
        let sub = self.subs[i].sub;
        self.__graph.unsubscribe(listener.target as string, sub, listener.tkey, listener.subInput);
      } else {

      }
      let sub = self.__graph.subscribe(
        sourceNode.tag, self.tag, args
      );
      self.subs[i] = {
        sub,
        listener:self.__graph.__node.state.getEvent(
          sourceNode.__unique + sourceNode.key ? '.'+sourceNode.key : '', 
          sub
        ) as any as Listener
      };
    }
    
    if((self.inputs[0] as any).link) {
      let sourceNode = editor.getNodeById((self.inputs[0] as any).link.origin_id) as LGraphNodeM;
      if(sourceNode) subNode(0,sourceNode);
    }
    if((self.inputs[0] as any).extraLinks) {
      let i = 0;
      for(const key in (self.inputs[0] as any).extraLinks) { 
        i++;
        let sourceNode = editor.getNodeById(editor.links[key].origin_id) as LGraphNodeM;
        if(sourceNode) subNode(i,sourceNode);
      }
    }

    //now propagate upstream if any outputs on the outputNode continue on
    if(self.outputs) {
      let checked = {} as any;
      self.outputs.forEach((output) => {
        //rebuild/swap args in active listeners
        if(editor && output.links) {
          output.links.forEach((link) => {
            let outputNode = editor.getNodeById(editor.links[link].target_id);
            if(!checked[editor.links[link].target_id]) {
              checked[editor.links[link].target_id] = true;
              //update subs
              if(outputNode) 
                checkNodeForSubscriptionUpdate(outputNode as LGraphNodeM,editor,editor.links[link].target_slot,undefined,self.outputs[editor.links[link].origin_slot],undefined,undefined);
            }
          });
          
        }
      });
    }

  }
}



export function registerNode(
  node: GraphNode,
  root?:Function|GraphNodeProperties, 
  key?: string,
  editor?:LGraph
) {
    
  const tag = node.__node.tag;
  const name = key ? `${tag}.${key}` : tag;

  let hasNode = registered.get(name) as LGraphNodeM;
  if (hasNode) return name;


  const NewNode = function() {
    let self = this as LGraphNodeM;
    self.title = name;

    self.triggers = node.__listeners ? node.__listeners : {};
    self.__node = node;
    self.tag = tag;
    self.key = key;
    self.__unique = node.__node.unique;
    self.__graph = node.__node.graph;
    self.editor = editor as LGraph;
    self.subs = {};
    self.firstConnect = true;

    let params;

    let setOutputNameFromFunction = (fn) => {
        let str = fn.toString() as string;
        let isNative = str.indexOf('[native code]') > -1;
        if(isNative) {
          self.addInput('', 0 as any); 
          self.addOutput('', 0 as any);
          return;
        }
        let idx = str.lastIndexOf('return');
        if(idx !== str.indexOf('return')) { //multiple return statements so we can't determine which one, just use a blank output
          self.addOutput('', 0 as any);
          return;
        }
        if(idx > -1) {//if exits 
            idx+=5;
            //get output name
            let lastIndex = str.lastIndexOf(';');
            if(lastIndex === -1 && lastIndex > idx) {
                lastIndex = str.lastIndexOf('}');
            }
            let substr;
            if(lastIndex > -1 && lastIndex > idx) substr = str.substring(idx+1,lastIndex);
            if(substr) self.addOutput(substr, 0 as any); //todo: can we type this at all? else do it dynamically
            else self.addOutput('', 0 as any);
        }
    }

    self.addInput(execPin,-1); //fix to be able to add/remove contextually
    self.addOutput(execPin,-1); //fix to be able to add/remove contextually

    if(key && root?.[key]) {
        if(typeof root[key] === 'function') {
            setOutputNameFromFunction(root[key])
            params = getFnParamNames(root[key]);
        } else {
            let typ = typeof root[key] as string;
            if(typ === 'undefined') typ = 0 as any;
            self.addInput('Set', typ); 
            self.addOutput('Get', typ);
        }
    }
    if(typeof root === 'function') {
        setOutputNameFromFunction(root);
        params = getFnParamNames(root);
    } else if(root?.__operator || root?.default) {
        setOutputNameFromFunction(root.__operator ? root.__operator : root.default);
        params = getFnParamNames(root.__operator ? root.__operator : root.default);
    } 
    if(params) {
        params.forEach((p,i) => {
          if(p || params.length > 1) self.addInput(p,0 as any);
        });
    }

    // for (let key in self) this.addInput(key)

    self.onExecute = function() {
      //this can trigger the node operator here or the method of a node to cause downstream effects
    }

    self.onAdded = function(graph:LGraph) {
      //
    }

    self.onRemoved = function() {
      //graph.unsubscribe
    }

    //when an input (left side) is connected on this node from an output (right side) on another node
    self.onConnectInput = function(inputIndex, outputType, outputSlot, outputNode, outputIndex) {
      
      if(!self.firstConnect)
        checkNodeForSubscriptionUpdate(self, editor as LGraph, inputIndex, outputType, outputSlot, outputNode, outputIndex);

      console.log('onConnectInput',{inputIndex, outputType, outputSlot, outputNode, outputIndex});
      
      return true;
    }

    //when an output is connected on this node, can just use onConnectInput 
    self.onConnectOutput = function(outputIndex, inputType, inputSlot, inputNode, inputIndex) {
      //graph.subscribe();
      console.log('onConnectOutput',{outputIndex, inputType, inputSlot, inputNode, inputIndex});
      
      return true;
    }

    self.onConnectionsChange = function(type, slotIndex, isConnected, link, ioSlot) {
      console.log({type, slotIndex, isConnected, link, ioSlot});
      if(!isConnected) {
        //graph.unsubscribe();
      }
    }

    if(node?.__listeners) for(const key in node.__listeners) {
      //add outputs
    }

    if(node?.__args) for(const key in node.__args) {
      //adds inputs
    }

    //self.addWidget('slider',...); //todo

    if(node?.__element && node?.__renderHTML) {
      //we should be able to render the element over the node. The editor is in a canvas so we need to use the 
      //  position X and Y of the canvas element (relative to the pageX and pageY), 
      // then set the HTML over the top of it and account for the size in the canvas elmeent using the html bounding box
    }

  } as any as (new () => LGraphNodeM);

  LiteGraph.registerNodeType(name, NewNode); //now registered in system

  registered.set(name, NewNode);

  return name;

}