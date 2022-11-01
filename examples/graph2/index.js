
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
                        operator:function(a) { this.z += a; console.log('nodeC z prop added to',this); return this.z; }
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

console.log(graph);

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

console.log(graph2);