import {Graph} from '../../src/core/Graph'
import { htmlloader } from '../../src/loaders/html/html.loader';

let graph = new Graph({
    loaders:{
        htmlloader
    },
    roots:{
        
        nodeA:{
            __operator:function add(a,b) {
                console.log('run nodeA', a, b);
                return a+b;
            },
            toAdd:2
        },

        nodeB:{
            __operator:function multiply(a,b) {
                console.log('run nodeB', a, b);
                return a*b;
            }
        },

        nodeC:{
            __operator:function exponent(a,b) {
                console.log('run nodeC', a, b);
                return Math.pow(a,b);
            }
        },

        nodeD:{
            __operator:function divide(a,b) {
                console.log('run nodeD', a, b);
                console.log('output:',a/b);
                return a/b;
            },
            log10:function (a) {
                console.log('run nodeD.log10', a);
                return Math.log10(a);
            },
            __children:{
                output: {
                    __element:'div',
                    innerHTML:'operator output',
                    __operator:function(outp) {
                        console.log('child node received: ', outp);
                        this.innerHTML = outp;
                    }
                }
            }
        },

        Math

    }
});

console.log(graph.__node.nodes);

let nodeAInternalSub = graph.subscribe(
    'nodeA',
    'nodeA.toAdd'
);

let nodeBSub = graph.subscribe(
    'nodeA',
    'nodeB',
    ['__output','nodeA.toAdd'],
);

let nodeCSub = graph.subscribe(
    'nodeB',
    'nodeC',
    ['__output', {
        __input:'Math.cos',
        __output:{
            __input:'Math.pow',
            __args:['__output', 4]
        }
    }]
);

let nodeDSub = graph.subscribe(
    'nodeC',
    'nodeD.log10'
);

let nodeDInternalSub = graph.subscribe(
    'nodeD.log10',
    'nodeD',
    ['__output', 3]
);

graph.run('nodeA', 3,4);

graph.unsubscribe('nodeB',nodeCSub);

graph.run('nodeA', 4,5) //should only call nodeB now
