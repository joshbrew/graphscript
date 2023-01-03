import {Graph} from '../../src/core/Graph'
import { htmlloader } from '../../src/loaders/html/html.loader';
import Editor from './Editor';
const ui = document.getElementById('ui')

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
            toAdd:2,
            __listeners:{
                'nodeA':'toAdd'
            }
        },

        nodeB:{
            __operator:function multiply(a,b) {
                console.log('run nodeB', a, b);
                return a*b;
            },
            __listeners:{
                'nodeA':{ __callback:true, __args:['__output', 'nodeA.toAdd'] }
            }
        },

        nodeC:{
            __operator:function exponent(a,b) {
                console.log('run nodeC', a, b);
                return Math.pow(a,b);
            },
            __listeners:{
                'nodeB':{ __callback:true, __args: ['__output',{
                    __input:'Math.cos',
                    __output:{
                        __input:'Math.pow', //this returns the final output for the argument list
                        //__output:(inp)=>{ return inp; } //function or object, etc
                        __args:['__output', 4]
                    }
                }] }
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
                    parentNode: ui,
                    __operator:function(outp) {
                        console.log('child node received: ', outp);
                        this.innerHTML = outp;
                    }
                }
            },
            __listeners:{
                'nodeC':'log10',
                'nodeD.log10':{ __callback:true, __args:['__output', 3] }
            }
        },

        Math

    }
});


const list = document.querySelector('#editor');
const editor = new Editor(graph);
if (list) editor.setUI(list)
console.log('Editor', editor)

// let nodeAInternalSub = graph.subscribe(
//     'nodeA',
//     'nodeA.toAdd'
// );

// let nodeBSub = graph.subscribe(
//     'nodeA',
//     'nodeB',
//     ['__output','nodeA.toAdd'],
// );

// let nodeCSub = graph.subscribe(
//     'nodeB',
//     'nodeC',
//     ['__output', {
//         __input:'Math.cos',
//         __output:{
//             __input:'Math.pow', //this returns the final output for the argument list
//             __args:['__output', 4]
//         }
//     }]
// );

// let nodeDSub = graph.subscribe(
//     'nodeC',
//     'nodeD.log10'
// );

// let nodeDInternalSub = graph.subscribe(
//     'nodeD.log10',
//     'nodeD',
//     ['__output', 3]
// );

graph.run('nodeA', 3,4);

graph.clearListeners('nodeC','nodeB'); 

graph.run('nodeA', 4,5) //should only call nodeB now


// const animate = () => {
//     graph.run('nodeA', 3,4) //should only call nodeB now
//     setTimeout(animate, 100);
// }

// animate()