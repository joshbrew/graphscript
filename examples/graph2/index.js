
import { Graph } from "../../Graph2";


let tree = {

    nodeA:{
        x:1,
        y:2,
        jump:()=>{console.log('jump!'); return 'jumped!'; },
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
        'looper':(props,parent,graph)=>{ //badabadabadabooop

            if(props._node.loop && typeof node._node.loop === 'number') {
                let oncreate = (node) => {
                    if(node._node.loop && typeof node._node.loop === 'number') {
                        node._node.isLooping = true
                        if(!node._node.looper) {
                            node._node.looper = () => {
                                if(node._node.isLooping) {
                                    node._node.operator();
                                    setTimeout(node._node.looper,node._node.loop);
                                }
                            }
                            node._node.looper();
                        }
                    }
                }
    
                if(typeof props._node.oncreate === 'undefined') props._node.oncreate = [oncreate];
                else if (typeof props._node.oncreate === 'function') props._node.oncreate = [oncreate,props._node.oncreate];
                else if (Array.isArray(props._node.oncreate)) props._node.oncreate.unshift(oncreate);
    
                let ondelete = (node) => {
                    if(node._node.isLooping) node._node.isLooping = false;
                }
    
                if(typeof props._node.ondelete === 'undefined') props._node.ondelete = [ondelete];
                else if (typeof props._node.ondelete === 'function') props._node.ondelete = [ondelete,props._node.ondelete];
                else if (Array.isArray(props._node.ondelete)) props._node.ondelete.unshift(ondelete);
            }
            
        }
    }
});

graph.get('nodeB').x += 1; //should trigger nodeA listener

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

graph.get('nodeA').jump();

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

graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ graph.remove('nodeE'); console.log('nodeE popped!') },5500)