
import { Graph } from "../../Graph2";


let tree = {

    nodeA:{
        x:1,
        y:2,
        _node:{
            listeners:{
                'nodeB.x':function(newX){ console.log('nodeB x prop changed:',newX, this); this.x = newX; }, //listeners in a scope are bound to 'this' node
                'nodeB.nodeC':function(op_result){console.log('nodeC operator returned:', op_result, this)},
                'nodeB.nodeC.z':function(newZ){console.log('nodeC z prop changed:', newZ, this)}
            }
        }
    },

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
                            'nodeA.x':function(newX) { console.log('nodeA x prop updated', newX);}
                        }
                    }
                }
            }
        }
    },


    nodeC:(a,b,c)=>{ return a+b+c; }, //becomes the ._node.operator prop and calling triggers setState for this tag (or nested tag if a child)

};

let graph = new Graph({
    tree
});

graph.get('nodeB').x += 1; //should trigger nodeA listener

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

console.log('graph1',graph);

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

let popped = graph.remove('nodeB');

console.log(popped._node.tag, 'popped')

graph2.add(popped); //reparent nodeB to the parent graph

console.log('nodeB reparented to graph2',popped,graph2);


popped.x += 1; //should no longer trigger nodeA.x listener on nodeC