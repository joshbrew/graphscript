
// import { Graph } from "../../core/Graph";
import { Graph } from "../../core/Graph2";
import { loaders } from "../../core/loaders";
import list from "./list";
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

list.addHeader('Graph constructor finished')
console.log('graph',graph);

list.addCommand(`graph.run('nodeG')`)
graph.run('nodeG');

list.addCommand('nodeAInstance.x = 1')
nodeAInstance.x = 1; //should trigger nodeA.x listener on nodeC

list.addCommand(`graph.get('nodeA').x = 2`)
graph.get('nodeA').x = 2; //same thing

list.addCommand(`graph.get('nodeB').x += 1`)
graph.get('nodeB').x += 1; //should trigger nodeA listener jump()

list.addCommand(`graph.run('nodeB.nodeC', 4)`)
graph.run('nodeB.nodeC', 4); //should trigger nodeA listener

list.addCommand(`graph.get('nodeB.nodeC').z += 1`)
graph.get('nodeB.nodeC').z += 1;

list.addCommand(`graph.get('nodeA').jump()`)
graph.get('nodeA').jump(); //should trigger nodeC listener

list.addCommand(`graph.run('nodeA.jump')`)
graph.run('nodeA.jump'); //same


const flow = graph.__node.ref.__node.flow
console.log('Active Listeners (1)', deepCopy(flow.globals.active));


let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

// ---------------- ISSUES START HERE ----------------
// 1. Still using nodeA listeners to NodeC

list.addHeader('nodeB removed!')
let popped = graph.remove('nodeB');
// let popped = graph.get('nodeB');
console.log('Active Listeners (1)', deepCopy(flow.globals.active)); //should be no triggers left
console.log(popped.__node.tag, 'popped')

// INCORRECT (as defined)
list.addCommand(`graph.get('nodeA').jump()`)
graph.get('nodeA').jump(); //should trigger nodeC listener // NOTE: SHOULD IT? I THINK IT SHOULD BE REMOVED FROM THE LISTENERS


// // INCORRECT (reparenting does not reinstate any new behaviors)
// graph2.add(popped); //reparent nodeB to the parent graph
// const secondMessage = 'nodeB reparented to graph2'
// list.addCommand(secondMessage)
// console.log(secondMessage,popped,graph2);

const secondFlow = graph2.__node.ref.__node.flow
console.log('Active Listeners (1)', deepCopy(flow.globals.active)); //should be no triggers left
console.log('Active Listeners (2)', deepCopy(secondFlow.globals.active)); //should be no triggers left

// CORRECT (as defined)
list.addCommand(`popped.x += 1`)
popped.x += 1; //should no longer trigger nodeA.x listener on nodeC, but will still trigger the nodeB.x listener on nodeA

// INCORRECT (as defined) // Triggers the nodeA listener
list.addCommand(`popped.__children.nodeC.__operator(1)`)
popped.__children.nodeC.__operator(1);

// CORRECT (as defined)
list.addCommand(`graph.get('nodeA').jump()`)
graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ 
    graph.remove('nodeE'); 
    list.addCommand('nodeE removed!')
},5500)
// console.log('graph2',graph2);