
import { Graph } from "../../Graph";
import { loaders } from "../../loaders";
import list from "./list";
import tree from './tree'

// import './benchmark'

const nodeAInstance = tree.nodeA

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

let tree2 = {
    graph
};

let graph2 = new Graph({tree:tree2});

list.addHeader('nodeB removed!')
let popped = graph.remove('nodeB');
console.log(popped.__node.tag, 'popped')

list.addCommand(`graph.get('nodeA').jump()`)
graph.get('nodeA').jump(); //should NOT trigger nodeC listener


// NOTE: Reparenting does not change behaviors?
graph2.add(popped); //reparent nodeB to the parent graph
const secondMessage = 'nodeB reparented to graph2'
list.addCommand(secondMessage)
console.log(secondMessage,popped,graph2);
console.log(JSON.stringify(graph.__node.state.triggers)); //should be no triggers left

// INCORRECT ON ORIGINAL. DOES NOT HAVE ANY BEHAVIORS
list.addCommand(`popped.x += 1`)
popped.x += 1; //should no longer trigger nodeA.x listener on nodeC, but will still trigger the nodeB.x listener on nodeA

list.addCommand(`popped.__children.nodeC.__operator(1)`)
popped.__children.nodeC.__operator(1);

// INCORRECT ON ORIGINAL
list.addCommand(`graph.get('nodeA').jump()`)
graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now

setTimeout(()=>{ 
    graph.remove('nodeE'); 
    list.addCommand('nodeE removed!')
},5500)
// console.log('graph2',graph2);