
import { Graph } from "../../Graph2";
import { loaders } from "../../Loaders";
import * as nodeA from './nodes/nodeA.js'

const nodeAInstance = Object.assign({}, nodeA)

let tree = {

    nodeA: nodeAInstance,

    nodeB:{
        x:3,
        y:4,
        _node:{
            children:{
                nodeC:{
                    z:4,
                    _node:{
                        operator:function(a) { this.z += a; console.log('nodeC z prop added to',this); return this.z; },
                        listeners:{
                            'nodeA.x':function(newX) { console.log('nodeA x prop updated', newX);},
                            'nodeA.jump':function(jump) { 
                                console.log('nodeA ', jump);
                            }
                        }
                    }
                }
            }
        }
    },

    nodeD:(a,b,c)=>{ return a+b+c; }, //becomes the ._node.operator prop and calling triggers setState for this tag (or nested tag if a child)

    nodeE:{
        _node:{
            loop:1000,
            operator:()=>{console.log('looped!');}
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

console.log(popped._node.tag, 'popped')

graph2.add(popped); //reparent nodeB to the parent graph

console.log('nodeB reparented to graph2',popped,graph2);

popped.x += 1; //should no longer trigger nodeA.x listener on nodeC, but will still trigger the nodeB.x listener on nodeA

popped._node.children.nodeC._node.operator(1);

graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ graph.remove('nodeE'); console.log('nodeE popped!') },5500)
console.log('graph2',graph2);