import {Graph} from '../../src/core/Graph'
import { htmlloader } from '../../src/loaders/html/html.loader';

let graph = new Graph({
    loaders:{
        htmlloader
    },
    roots:{
        
        nodeA:{
            __operator:function add(a,b) {
                console.log('run nodeA');
                return a+b;
            }
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
        }

    }
});

let nodeBSub = graph.subscribe(
    'nodeA',
    'nodeB',
    undefined,
    ['__output',2],
);

let nodeCSub = graph.subscribe(
    'nodeB',
    'nodeC',
    undefined,
    ['__output',4]
);

let nodeDSub = graph.subscribe(
    'nodeC',
    'log10',
    undefined,
    undefined,
    undefined,
    'nodeD'
);

let nodeDInternalSub = graph.subscribe(
    'nodeD',
    'nodeD',
    'log10',
    ['__output', 3]
);

graph.run('nodeA', 3,4);

graph.unsubscribe('nodeB',nodeCSub);

graph.run('nodeA', 4,5) //should only call nodeB now
