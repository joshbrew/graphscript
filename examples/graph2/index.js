
import { Graph } from "../../Graph";
import { loaders } from "../../Loaders";
import * as nodeA from './nodes/nodeA.js'

const nodeAInstance = Object.assign({}, nodeA)

let tree = {

    nodeA: nodeAInstance,

    nodeB:{
        x:3,
        y:4,
        __children:{
                nodeC:{
                    z:4,
                    __operator:function(a) { this.z += a; console.log('nodeC z prop added to',this); return this.z; },
                    __listeners:{
                        'nodeA.x':function(newX) { console.log('nodeA x prop updated', newX);},
                        'nodeA.jump':function(jump) { 
                            console.log('nodeA ', jump);
                        }
                    }
                }
            }
        
    },

    nodeD:(a,b,c)=>{ return a+b+c; }, //becomes the .__operator prop and calling triggers setState for this tag (or nested tag if a child)

    nodeE:{
        __operator:()=>{console.log('looped!');},
        __node:{
            loop:1000,
        }
    }

};

let graph = new Graph({
    tree,
    loaders:{
        'escompose': (node,parent,graph) =>{
            console.log('escompose loader', node, parent, graph);
        },
        ...loaders
    }
});

nodeAInstance.x = 1;

graph.get('nodeB').x += 1; //should trigger nodeA listener

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

graph.get('nodeA').jump(); //should trigger nodeC listener

console.log('graph1',graph);

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

let popped = graph.remove('nodeB');

console.log(popped.__node.tag, 'popped')
graph.get('nodeA').jump(); //should trigger nodeC listener

graph2.add(popped); //reparent nodeB to the parent graph

console.log('nodeB reparented to graph2',popped,graph2);

popped.x += 1; //should no longer trigger nodeA.x listener on nodeC, but will still trigger the nodeB.x listener on nodeA

popped.__children.nodeC.__operator(1);

graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ graph.remove('nodeE'); console.log('nodeE popped!') },5500)
console.log('graph2',graph2);