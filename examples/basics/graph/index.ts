import { Graph, GraphNodeProperties, Roots } from "../../../src/core/Graph";

//here is a very basic graph example demonstrating different syntaxes

let roots = {

    //load generic functions
    add:function (...numbers) {
        return numbers.reduce((a,b) => a + b )
    },
    
    //load objects via node definitions
    multiply:{
        __operator:function (...numbers) {
            return numbers.reduce((a,b) => a * b )
        }
    } as GraphNodeProperties,

    //calling as graphnodes using the GraphNode bindings
    nodeSyntax:function (...numbers) {
        let added = this.__node.graph.run('add', ...numbers);
        let multiplied = this.__node.graph.run('multiply', added, 5);
        return multiplied;
    },

    //normal js
    nativeJSSyntax:function (...numbers) {
        //this won't call nodes unless we wrap the js in objects
        let added = roots.add(...numbers);
        let multiplied = roots.multiply.__operator(added, 5); //this will not trigger the node because it's on the prototype
        return multiplied;
    },

    graphSequence:{ 
        __operator:'add',
        __children:{
            result:{
                __operator:'multiply',
                __args:['__input',5] //structure inputs for the operator on this level, '__input' or '__output' will place the input argument here
            } as GraphNodeProperties
        },
    } as GraphNodeProperties,

    verboseGraphSequence:{ //same as graphSequence using functions
        __operator:function (...numbers) {
            return numbers.reduce((a,b) => a + b )
        },
        __children:{
            result:{
                __operator:function (...numbers) {
                    return numbers.reduce((a,b) => a * b )
                },
                __args:['__input',5]
            } 
        },
        __callable:true
    } as GraphNodeProperties,

    //let's make a node that listens to the output of other nodes
    listenerNode:{
        __listeners:{
            'multiply':function (outp) { 
                console.log('multiply node called! Output:', outp); 
            }
        }
    } as GraphNodeProperties

} as Roots;




let graph = new Graph({
    roots
});

console.log('Graph instance:', graph);



let args = [1,2,3,4,5];

let result1 = new Promise((res) => {
    let sub = graph.subscribe('graphSequence.result', (output)=>{ 
        graph.unsubscribe('graphSequence.result', sub);
        res(output);
    });
}); 

graph.run('graphSequence', ...args);




let result3 = graph.run('nodeSyntax', ...args);
let result2 = graph.run('nativeJSSyntax', ...args);
//lets remove a node and then try to run it on the graph again
let removed = graph.remove('nativeJSSyntax');
let result_undefined = graph.run('nativeJSSyntax', ...args);
console.log('result after removal should be undefined:', result_undefined);


let node = graph.get('verboseGraphSequence');

let result4 = new Promise((res) => {
    let sub = graph.subscribe('verboseGraphSequence.result', (output)=>{ 
        graph.unsubscribe('verboseGraphSequence.result', sub);
        res(output);
    });
}); 

node(...args); //this sequences is callable


Promise.all([result1,result4]).then((results) => {
    document.body.insertAdjacentHTML('afterbegin', `
        <div>
            Node Run Results should match:
            <div style='margin-left:10px'>
                Graph Node Syntax: ${result3}<br/>
                Native JS Syntax: ${result2}<br/>
                Graph Sequence Syntax: ${results[0]}<br/>
                Callable Syntax: ${results[1]}<br/>
            </div>
        </div>
    `);
})





