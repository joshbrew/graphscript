
import { Graph, GraphNode } from "../../src/core/Graph";
import model from './tree'

import { loaders as includedLoaders } from "../../src/loaders";
import htmlLoader from '../../src/loaders/html/html.loader'
import { isNode, log } from '../../tests/utils/index'

type GlobalType = {
    graph: Graph,
    nodeAInstance: any,
    graph2: Graph,
    popped: GraphNode
}

export let globals: GlobalType

export const start = () => {

    const loaders = {
        ...includedLoaders
    } as any

    if (!isNode) loaders.html = htmlLoader;
    const graph = new Graph({
        roots: model,
        loaders
    });

    log.addHeader('Graph constructed')

    globals = {
        graph: graph,
        nodeAInstance: model.nodeA,
    } as GlobalType

    return graph;
}

export const stop = () => {
    return globals.graph.remove('nodeE')
}

export const operations = [
    {
        name: "graph.run('nodeG')",
        function: () => globals.graph.run('nodeG')
    },
    {
        name: "nodeAInstance.x = 1",
        function: () => {
            globals.nodeAInstance.x = 1; //should trigger nodeA.x listener on nodeC
            return globals.nodeAInstance.x;
        }
    },
    {
        name: "graph.get('nodeA').x = 2",
        function: () => {
            const nodeA = globals.graph.get('nodeA');
            nodeA.x = 2; //same thing
            return nodeA.x;
        }
    },
    {
        name: "graph.get('nodeB').x += 1",
        function: () => {
            const nodeB = globals.graph.get('nodeB');
            nodeB.x += 1; //should trigger nodeA listener jump()
            return nodeB.x;
        }
    },
    {
        name: "graph.run('nodeB.nodeC', 4)",
        function: () => globals.graph.run('nodeB.nodeC', 4) //should trigger nodeA listener
    },
    {
        name: "graph.get('nodeB.nodeC').z += 1",
        function: () => {
            const nodeC = globals.graph.get('nodeB.nodeC')
            nodeC.z += 1;
            return nodeC.z;
        }
    },
    {
        name: "graph.get('nodeA').jump()",
        function: () => {
            const nodeA = globals.graph.get('nodeA');
            return nodeA.jump(); //should trigger nodeC listener
        }
    },
    {
        name: "graph.run('nodeA.jump')",
        function: () => globals.graph.run('nodeA.jump') //same
    },
    {
        header: "graph2 constructed",
        function: () => {
            globals.graph2 = new Graph({roots: { graph: globals.graph }});
            return globals.graph2;
        }
    },
    {
        header: "nodeB removed!",
        function: () => {
            globals.popped = globals.graph.remove('nodeB');
            console.log(globals.popped.__node.tag, 'popped')
            return globals.popped;
        }
    },
    {
        name: "graph.get('nodeA').jump()",
        function: () => {
            const nodeA = globals.graph.get('nodeA');
            return nodeA.jump(); //should NOT trigger nodeC listener
        }
    },
    {
        header: "nodeB reparented to graph2",
        function: () => {
            globals.graph2.add(globals.popped); //reparent nodeB to the parent graph
            console.log(JSON.stringify(globals.graph.__node.state.triggers)); //should be no triggers left
            return globals.popped
        }
    },
    {
        name: "popped.x += 1",
        function: () => {
            globals.popped.x += 1; //should no longer trigger nodeA.x listener on nodeC
            return globals.popped.x;
        }
    },
    {
        name: "popped.__children.nodeC.__operator(1)",
        function: () => {
            const children = globals.popped.__children as any
            children.nodeC.__operator(1)
        }
    },
    {
        name: "graph.get('nodeA').jump()",
        function: () => globals.graph.get('nodeA').jump() //this should not trigger the nodeA.jump listener on nodeC now
    },
    {
        header: 'Remove nodeE after next update',
        function: () => {
            return new Promise((resolve) => {
                setTimeout(()=>{
                    const nodeE = stop()
                    resolve(nodeE)
                } , 1000)
            })
        }
    }
]


export default operations