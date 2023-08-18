import {Graph, WorkerService, GraphNode, GraphNodeProperties, getAllProperties, isNativeClass, parseFunctionFromText, wchtmlloader} from '../../index'

import { LiteGraph, LGraph, LGraphCanvas, LGraphNode} from './litegraph.js'
import { registerLGraphNodesFromGraph, renderLGraphFromExistingEvents } from './litegraphScripts';
import { makeNodeEditorMenu, makeNodePropsCreator, makeProxyMenu } from './proxyMenu';

import './styles.css'

import worker1 from './worker'


(Math as any).multiply = (a,b) => { return a*b; };


let objProps = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
let keys = Object.getOwnPropertyNames(globalThis);
let nonArrowFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(globalThis)).filter((v) => !objProps.includes(v));
keys.push(...nonArrowFunctions); //this is weird but it works 

let globalThisProxy = {} as any;
let proxyable = {} as any; //class constructors we can allow for node creation

keys.forEach((k) => {
  if((typeof globalThis[k] === 'function' && !isNativeClass(globalThis[k])) || typeof globalThis[k] === 'object')
    {
      if(k !== 'globalThis' && k !== 'window' && k !== 'self' && k !== 'frames' && k !== 'top'  && k !== 'parent') {
        globalThisProxy[k] = globalThis[k];
      }
    } else if(isNativeClass(globalThis[k])) { //Symbol is a no-go
      let pass = false;
      try{ new globalThis[k](); pass=true; } catch {}
      if(pass) proxyable[k] = globalThis[k];
    }
});

proxyable.HTMLElement = class HTML {
  constructor(tagName:string) {
    return document.createElement(tagName);
  }
}

proxyable = Object.keys(proxyable).sort().reduce(
  (obj, key) => { 
    obj[key] = proxyable[key]; 
    return obj;
  }, 
  {}
);

//this will be existing logic that we'll simply represent on the LiteGraph plugin
const roots = {

    //these will be what are made accessible on the LiteGraph

    ...globalThisProxy,

    Button:{
      __element:'button',
      innerHTML: 'Click me',
      onclick:function(ev){
        console.log('clicked!');
      }
    },

    NumberInput:{
      __element:'input',
      value:1,
      type:'number'
    },

    NumberOutput:{
      __element:'div',
      innerHTML:'Press the button',
      multiplier:2
    },


    //the __listeners are really what we're visualizing on the LiteGraph, while the node are what are available to visualize and create/set listeners for
    __listeners:{
      'NumberOutput':{ //listener block relevant to this node. If the name is a node, then arbitrary callbacks specified will be bound to that node, or use "true" for that node's operator 
        'Button.onclick': {  //Wire from Button.onclick method execution pin. Name is not arbitrary.
          __callback:'NumberOutput.innerHTML', //Wire to NumberOutput.innerHtml setter execution
          __args:[ //input to NumberOutput.innerHTML setter, default arg otherwise is the output from the thing being listened to
              { //argument input 
                __callback:'Math.multiply', //Multiply the following argument
                __args:[ //secondary inputs
                  {
                    __callback:'Math.cos', //Math.cos method
                    __args:['NumberInput.value'] //This value inputted
                  },
                  {
                    __callback:'Math.cos',
                    __args:[{
                      __callback:'Math.multiply',
                      __args:['NumberInput.value','NumberOutput.multiplier']
                    }] //This value inputted
                  } 
              ]
              }
          ]
        },
      },

      'console':{
        'NumberOutput.innerHTML': {
          __callback:'console.log',
        }
      }
    }
}; 

// Instantiate GraphScript Graph
// const graph = new Graph({
//   roots,
//   loaders:{
//     wchtmlloader
//   }
// });

const graph = new WorkerService({
  roots,
  loaders:{
    wchtmlloader
  }
});

const worker = graph.addWorker({url:worker1});

worker?.run('makeRootTransferrable').then(console.log);

//  Create Canvas
const canvas = document.createElement('canvas');
setTimeout(() => {
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
}, 
1);



// Start LiteGraph
const editor = new LGraph();
new LGraphCanvas(canvas, editor);
editor.start();

registerLGraphNodesFromGraph(graph, editor);
renderLGraphFromExistingEvents(graph.__node.state.triggers, editor);

document.body.appendChild(canvas);

let menuContainer = document.createElement('div');
let mode = document.createElement('select');
mode.insertAdjacentHTML('beforeend', `<option value="0" selected>Class Proxy</option>`);
mode.insertAdjacentHTML('beforeend', `<option value="1">Node Creator</option>`);
mode.insertAdjacentHTML('beforeend', `<option value="2">Node Editor</option>`);
let c1 = makeProxyMenu(proxyable,graph,editor);
let c2 = makeNodePropsCreator(graph,editor);
c2.style.display = 'none';
menuContainer.appendChild(mode);
menuContainer.appendChild(c1);
menuContainer.appendChild(c2);

let c3:HTMLElement|undefined;

mode.onchange = () => {
  if(mode.value === "0") {
    if(c3) {
      c3.remove();
      c3 = undefined
    }
    c2.style.display = "none";
    c1.style.display = "";
  } else if (mode.value === "1") {
    if(c3) {
      c3.remove();
      c3 = undefined
    }
    c1.style.display = "none";
    c2.style.display = "";
  } else if (mode.value === "2") {
    c1.style.display = "none";
    c2.style.display = "none";
    if(!c3) {
      c3 = makeNodeEditorMenu(graph,editor);
      menuContainer.appendChild(c3);
    }
  }
}

document.body.appendChild(menuContainer);

const triggers = graph.__node.state.triggers
console.warn('Triggers', triggers)

// const stringifyTriggers = (triggers) => {
//   const entries = Object.entries(triggers).map(([key, arr]) => {
//     const [unique, property] = key.split('.');
//     //@ts-ignore
//     return [`${property}.${arr[0].source}`, arr.map(o => `${o.target}.${o.tkey}`)]
//   })
//   return JSON.stringify(entries.reduce((acc, [key, value]) => {
//     acc[key] = value
//     return acc
//   }, {}))
// }

// const striggers = stringifyTriggers(triggers)
// console.warn('Stringified Triggers', striggers)

// const stringifyRoot = (root) => {
//   const entries = Object.entries(root).map(([key, node]) => {
//     const [unique, property] = key.split('.')
//     return [key, node]
//   })
  
//   return JSON.stringify(entries.reduce((acc, [key, value]) => {
//     console.log(acc);
//     //@ts-ignore
//     acc[key] = value
//     return acc
//   }, {}))
// }


// const sroot = stringifyRoot(graph.__node.roots)
// console.warn('Stringified Roots', sroot)
