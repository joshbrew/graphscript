
import { Graph } from "../../src/core/Graph";
import tree from './tree'

import { loaders } from "../../src/loaders";
import htmlLoader from '../../src/loaders/html/html.loader'

export const globals = {
    graph: undefined,
    nodeAInstance: tree.nodeA,
    graph2: undefined,
    popped: undefined
}

export const operations = [
    {
        header: "Graph constructed",
        function: () => {
            globals.graph = new Graph({
                roots:tree,
                loaders:{
                    html: htmlLoader,
                    ...loaders
                }
            });
        }
    },
    {
        name: "graph.run('nodeG')",
        function: () => {
            globals.graph.run('nodeG');
        }
    },
    {
        name: "nodeAInstance.x = 1",
        function: () => {
            globals.nodeAInstance.x = 1; //should trigger nodeA.x listener on nodeC
        }
    },
    {
        name: "graph.get('nodeA').x = 2",
        function: () => {
            globals.graph.get('nodeA').x = 2; //same thing
        }
    },
    {
        name: "graph.get('nodeB').x += 1",
        function: () => {
            globals.graph.get('nodeB').x += 1; //should trigger nodeA listener jump()
        }
    },
    {
        name: "graph.run('nodeB.nodeC', 4)",
        function: () => {
            globals.graph.run('nodeB.nodeC', 4); //should trigger nodeA listener
        }
    },
    {
        name: "graph.get('nodeB.nodeC').z += 1",
        function: () => {
            globals.graph.get('nodeB.nodeC').z += 1;
        }
    },
    {
        name: "graph.get('nodeA').jump()",
        function: () => {
            globals.graph.get('nodeA').jump(); //should trigger nodeC listener
        }
    },
    {
        name: "graph.run('nodeA.jump')",
        function: () => {
            globals.graph.run('nodeA.jump'); //same
        }
    },
    {
        header: "graph2 constructed",
        function: () => {
            globals.graph2 = new Graph({roots: { graph: globals.graph }});
        }
    },
    {
        header: "nodeB removed!",
        function: () => {
            globals.popped = globals.graph.remove('nodeB');
            console.log(globals.popped.__node.tag, 'popped')
        }
    },
    {
        name: "graph.get('nodeA').jump()",
        function: () => {
            globals.graph.get('nodeA').jump(); //should NOT trigger nodeC listener
        }
    },
    {
        header: "nodeB reparented to graph2",
        function: () => {
            globals.graph2.add(globals.popped); //reparent nodeB to the parent graph
            console.log(JSON.stringify(globals.graph.__node.state.triggers)); //should be no triggers left
        }
    },
    {
        name: "popped.x += 1",
        function: () => {
            globals.popped.x += 1; //should no longer trigger nodeA.x listener on nodeC
        }
    },
    {
        name: "popped.__children.nodeC.__operator(1)",
        function: () => {
            globals.popped.__children.nodeC.__operator(1);
        }
    },
    {
        name: "graph.get('nodeA').jump()",
        function: () => {
            globals.graph.get('nodeA').jump(); //this should not trigger the nodeA.jump listener on nodeC now
        }
    },
    {
        header: 'Remove nodeE after next update',
        function: () => {

            setTimeout(()=>{
                globals.graph.remove('nodeE');
            } , 1000)
        }
    }
]


export default operations