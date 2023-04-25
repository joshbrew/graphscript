import {Graph, GraphNode, GraphNodeProperties, wchtmlloader} from '../../index'

import { LiteGraph, LGraph, LGraphCanvas, LGraphNode} from 'litegraph.js'

import './styles.css'


export type LGraphNodeProps = {
  __renderHTML?:boolean, //do we want to visualize elements inside the node or on a blank page area (like a typical document vs in-editor) Make this toggle between where it renders in the page/editor
  __widget?:{
    //we can use the built-in widgets and/or we can renderHtml, just figure out how to access the html to set them next to each other somehow
  }
  __position?:{
    //will be set by default otherwise based on proximity to connections
  }
} & GraphNodeProperties;

(Math as any).multiply = (a,b) => { return a*b };

//this will be existing logic that we'll simply represent on the LiteGraph plugin
const roots = {

    //these will be what are made accessible on the LiteGraph
    Math,

    Button:{
      __element:'button',
    },

    NumberInput:{
      __element:'input',
      value:1,
      type:'number'
    },

    NumberOutput:{
      __element:'div',
      innerHTML:'Press the button'
    },

    //the __listeners are really what we're visualizing on the LiteGraph, while the node are what are available to visualize and create/set listeners for
    __listeners:{
      'NumberOutput':{ //listener block relevant to this node
        'Button.onclick':{  //Wire from Button.onclick method execution pin
          __callback:'NumberOutput.innerHTML', //Wire to NumberOutput.innerHtml setter execution
          __args:[ //input to NumberOutput.innerHTML setter
              { //argument input 
                __input:'Math.multiply', //Multiply the following argument
                __args:[ //secondary inputs
                  {
                    __input:'Math.cos', //Math.cos method
                    __args:['NumberInput.value'] //This value inputted
                  },
                  {
                    __input:'Math.cos',
                    __args:['NumberInput.value'] //This value inputted
                  } 
              ]
              }
          ]
        }
      }
    }
}; 

const graph = new Graph({
  roots,
  loaders:{
    wchtmlloader
  }
});

const canvas = document.createElement('canvas');
setTimeout(() => {
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
}, 
1);

document.body.appendChild(canvas)

const editor = new LGraph();
new LGraphCanvas(canvas, editor);
editor.start();


function CreateLiteGraphNodes(roots:{[key:string]:any}, x0=100, y0=100) {

  let x = x0; let y = y0;

  function recursiveCreate(node) {
    if(node.__children) {
      for(const key in node.__children) {
        recursiveCreate(node.__children[key]);
      }
    }
  }

  for(const key in roots) {
    recursiveCreate(roots[key]);
  }

}

//
function registerNode(
  properties:GraphNode|GraphNodeProperties|Function|string, //register an existing node or new node
  graph:Graph, //NOT LGRAPH
  method?:string, //specific method on the node we want to make a node for? e.g. Button.innerHTML
  tag?:string
) {

  let node:GraphNode = undefined as any;
  let nodeMethod;

  if(typeof properties === 'function') {
    node = graph.add(properties) as GraphNode;
  } else if (typeof properties === 'object') {
    if(!(properties instanceof GraphNode)) {
      node = graph.add(properties) as GraphNode;
    }
  } else if (typeof properties === 'string') {
    node = graph.get(properties);
    if(!node && properties.includes('.')) {
      let substr = properties.substring(0,properties.lastIndexOf('.'));
      node = graph.get(substr);
      if(node) 
        method = properties.substring(properties.lastIndexOf('.')+1);
    }
  }


  if(!node) return false;

  if(method) {
    nodeMethod = node[method];
  }

  if(!tag) {
    tag = node.__node.tag;
    if(method) tag += '.' + method;
  }

  const NewNode = function() {
    let self = this as LGraphNode;
    self.title = tag as string;

    let subscriptions = {};

    self.onExecute = function() {
      //this can trigger the node operator here or the method of a node to cause downstream effects
    }

    self.onAdded = function(graph:LGraph) {
      //
    }

    self.onRemoved = function() {
      //graph.unsubscribe
    }

    self.onConnectInput = function(inputIndex, outputType, outputSlot, outputNode, outputIndex) {
      //graph.subscribe()
      return true;
    }

    self.onConnectOutput = function(outputIndex, inputType, inputSlot, inputNode, inputIndex) {
      //graph.subscribe();
      return true;
    }

    self.onConnectionsChange = function(type, slotIndex, isConnected, link, ioSlot) {
      if(!isConnected) {
        //graph.unsubscribe();
      }
    }

    if(node.__listeners) for(const key in node.__listeners) {
      //add outputs
    }

    if(node.__args) for(const key in node.__args) {
      //adds inputs
    }

    //self.addWidget('slider',...); //todo

    if(node.__element && node.__renderHTML) {
      //we should be able to render the element over the node. The editor is in a canvas so we need to use the 
      //  position X and Y of the canvas element (relative to the pageX and pageY), 
      // then set the HTML over the top of it and account for the size in the canvas elmeent using the html bounding box
    }

  } as any as (new () => LGraphNode);

  LiteGraph.registerNodeType(tag, NewNode); //now registered in system

}

//visualize an exisitng node from the graph
function visualizeNode(
  node, 
  graph:Graph
) {

}

//instantiate a node in the visualization and associate graphscript stuff properly
//two situations we instantiate nodes:
// 1. instantiating a node for the execution flow
// 2. Instantiating an Arg Input that does not directly fall in the execution flow but is implicitly called as an argument or in a chain to create an argument.
function instantiateNode(
  tag, 
  graph:Graph
) {

}
