
import { Graph } from "../../Graph";
import { loaders } from "../../Loaders";
import * as nodeA from './nodes/nodeA.js'

const nodeAInstance = Object.assign({}, nodeA)

let tree = {

    nodeA: {
        x:5,
        y:2,
        jump:()=>{console.log('jump!'); return 'jumped!'; },
        __listeners:{
            'nodeB.x':'jump', //string listeners in a scope are methods bound to 'this' node
            'nodeB.nodeC':function(op_result){console.log('nodeA listener: nodeC operator returned:', op_result, this)},
            'nodeB.nodeC.z':function(newZ){console.log('nodeA listener: nodeC z prop changed:', newZ, this)},
            'nodeE': 'jump'
        }
    },

    nodeB:{
        x:3,
        y:4,
        __children:{
                nodeC:{
                    z:4,
                    __operator:function(a) { this.z += a; console.log('nodeC operator: nodeC z prop added to',this); return this.z; },
                    __listeners:{
                        'nodeA.x':function(newX) { console.log('nodeC listener: nodeA x prop updated', newX);},
                        'nodeA.jump':function(jump) { 
                            console.log('nodeC listener: nodeA ', jump);
                        }
                    }
                }
            }
        
    },

    nodeD:(a,b,c)=>{ return a+b+c; }, //becomes the .__operator prop and calling triggers setState for this tag (or nested tag if a child)

    nodeE:{
        __operator:()=>{console.log('looped!'); return true;},
        __node:{
            loop:1000,
            looping:true
        }
    },

    nodeF:{
        __props:document.createElement('div'), //properties on the '__props' object will be proxied and mutatable as 'this' on the node. E.g. for representing HTML elements
        __onconnected:function (node) { 
            this.innerHTML = 'Test';
            this.style.backgroundColor = 'green'; 
            document.body.appendChild(this.__props); 
            console.log(this,this.__props);
        },
        __ondisconnected:function(node) {
            document.body.removeChild(this.__props);
        }
        
    }

};

let graph = new Graph({
    tree,
    loaders:{
        ...loaders
    }
});

nodeAInstance.x = 1; //should trigger nodeA.x listener on nodeC
graph.get('nodeA').x = 2; //same thing

graph.get('nodeB').x += 1; //should trigger nodeA listener jump()

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

graph.get('nodeB.nodeC').z += 1;

graph.get('nodeA').jump(); //should trigger nodeC listener
graph.run('nodeA.jump'); //same

console.log(JSON.stringify(graph.__node.state.triggers));

console.log('graph1',graph);

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

let popped = graph.remove('nodeB');

console.log(JSON.stringify(graph.__node.state.triggers)); //should be no triggers left

console.log(popped.__node.tag, 'popped')

graph.get('nodeA').jump(); //should trigger nodeC listener

graph2.add(popped); //reparent nodeB to the parent graph

console.log('nodeB reparented to graph2',popped,graph2);

popped.x += 1; //should no longer trigger nodeA.x listener on nodeC, but will still trigger the nodeB.x listener on nodeA

popped.__children.nodeC.__operator(1);

graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ graph.remove('nodeE'); console.log('nodeE popped!') },5500)
// console.log('graph2',graph2);