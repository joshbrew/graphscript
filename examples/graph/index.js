
// import { Graph } from "../../core/Graph";
import { Graph } from "../../core/Graph2";
import { loaders } from "../../core/loaders";
import tree from './tree'

const nodeAInstance = tree.nodeA

const deepCopy = (obj) => {

    const copy = {}
    for (let key in obj) {
        const val = obj[key]
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            copy[key] = deepCopy(val)
        } else copy[key] = val

    }

    return copy
    
}

let graph = new Graph({
    tree,
    loaders:{
        ...loaders
    }
});

console.log('graph',graph);

graph.run('nodeG');

nodeAInstance.x = 1; //should trigger nodeA.x listener on nodeC
graph.get('nodeA').x = 2; //same thing

graph.get('nodeB').x += 1; //should trigger nodeA listener jump()

graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

graph.get('nodeB.nodeC').z += 1;

graph.get('nodeA').jump(); //should trigger nodeC listener
graph.run('nodeA.jump'); //same


const flow = graph.__node.ref.__node.flow
console.log('Active Listeners', deepCopy(flow.globals.active));

console.log('graph1',graph);

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

let popped = graph.remove('nodeB');

console.log('Active Listeners', deepCopy(flow.globals.active)); //should be no triggers left

console.log(popped.__node.tag, 'popped')

graph.get('nodeA').jump(); //should trigger nodeC listener

graph2.add(popped); //reparent nodeB to the parent graph

console.log('nodeB reparented to graph2',popped,graph2);

popped.x += 1; //should no longer trigger nodeA.x listener on nodeC, but will still trigger the nodeB.x listener on nodeA

popped.__children.nodeC.__operator(1);

graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ graph.remove('nodeE'); console.log('nodeE popped!') },5500)
// console.log('graph2',graph2);