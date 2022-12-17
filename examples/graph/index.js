
// import { Graph } from "../../core/Graph";
import { Graph } from "../../core/Graph2";
import { loaders } from "../../core/loaders";
import list from "./list";
import tree from './tree'

const nodeAInstance = tree.nodeA

let graph = new Graph({
    tree,
    loaders:{
        ...loaders
    }
});


const commands = [
    {
        name: 'graph.run("nodeG")',
        function: () => {
            graph.run('nodeG');
        },
    },
    {
        name: 'nodeAInstance.x = 1',
        function: () => {
            nodeAInstance.x = 1; //should trigger nodeA.x listener on nodeC
        },
    },
    {
        name: `graph.get('nodeA').x = 2`,
        function: () => {
            graph.get('nodeA').x = 2; //same thing
        },
    },
    {
        name: `graph.get('nodeB').x += 1`,
        function: () => {
            graph.get('nodeB').x += 1; //should trigger nodeA listener jump()

        },
    },
    {
        header: `Clear All Listeners`,
        ignore: true,
        function: () => {
            graph.clear() // NEW FEATURE: Clear all listeners
        }
    },
    {
        name: `graph.run('nodeB.nodeC', 4)`,
        function: () => {
            graph.run('nodeB.nodeC', 4);
        },
    },
    {
        name: `graph.get('nodeB.nodeC').z += 1`,
        function: () => {
            graph.get('nodeB.nodeC').z += 1;
        },
    }, 
    {
        name: `graph.get('nodeA').jump()`,
        function: () => {
            graph.get('nodeA').jump(); //should trigger nodeC listener
        }, 
    },
    {
        header: `Unsubscribe nodeB.nodeC from nodeA.jump`,
        ignore: true,
        function: () => {
            // NEW FEATURE: Clearing nodeC listener from nodeA.jump
            graph.unsubscribe('nodeB.nodeC', 'nodeA.jump')
            // graph.clear('nodeA.jump') // Equivalent   
        }
    },

    {
        name: `graph.run('nodeA.jump')`,
        function: () => {
            graph.run('nodeA.jump'); //same 
        }
    },
    {
        header: 'Use Graph2 (commented)',
        function: () => {


            let tree2 = {
                graph
            };

            let graph2 = new Graph({tree:tree2});
            console.log('Got Graph 2', graph2)

            list.addHeader('Remove nodeB')
            let popped = graph.remove('nodeB');
            // let popped = graph.get('nodeB');
            console.log(popped.__node.tag, 'popped')

            list.addCommand(`graph.get('nodeA').jump()`)
            graph.get('nodeA').jump(); //should not trigger nodeC listener

            // // NOTE: Does nothing for now...
            // graph2.add(popped); //reparent nodeB to the parent graph
            // const secondMessage = 'nodeB + graph2'
            // list.addHeader(secondMessage)
            // console.log(secondMessage,popped,graph2);

            list.addCommand(`popped.x += 1`)
            popped.x += 1; //should no longer trigger nodeA.x listener on nodeC NOR the nodeB.x listener on nodeA

            list.addCommand(`popped.__children.nodeC.__operator(1)`)
            popped.__children.nodeC.__operator(1);

            list.addCommand(`graph.get('nodeA').jump()`)
            graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now


        }
    }
]

list.addHeader('Got Graph1')
console.log('graph',graph);

const runCommand = (command = commands.shift()) => {
    if (command) {
        if (command.ignore) return runCommand()
        else {
            if (command.header) list.addHeader(command.header)
            if (command.name) list.addCommand(command.name)
            command.function()
        }
    }
}

const runAll = () => {
    const copy = [...commands]
    copy.forEach(() => runCommand())
}

window.onkeydown = (ev) => {
    const key = ev.key
    if (key === 'Enter') runCommand()
    else if (key === ' ') runAll()
}

// Automatically run everything
runAll()

// Stop animating after a few seconds
setTimeout(()=>{ 
    graph.remove('nodeE'); 
    list.addCommand('nodeE removed!')
},5500)
