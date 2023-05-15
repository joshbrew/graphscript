import {Graph, GraphNodeProperties, Roots} from '../../../src/core/Graph';

//graphscript lets us not need to differentiate sync and async results via listeners. 
//  Running operators however still does.
let roots = {
    
    sync:function () {
        return 'sync run!';
    },

    async:async function() {
        return 'async run!'
    },

    listenerNode:{
        __listeners:{
            'sync':function(outp) { 
                console.log(outp); 
                document.body.insertAdjacentHTML('beforeend',`<div>${outp}</div>`);
            },
            'async':function(outp) { 
                //the state output is automatically awaited for us so we don't 
                // need to think too hard
                console.log(outp); 
                document.body.insertAdjacentHTML('beforeend',`<div>${outp}</div>`);
            }
        }
    }

} as Roots;

const graph = new Graph({
    roots
});

function logResult (res) { console.log('subscription result:',res) } 

graph.subscribe('async', logResult); //subscription output is already evaluated for us
graph.subscribe('sync', logResult);

console.log(
    'this is a promise:', 
    graph.run('async').then((res) => {console.log('this is the promise result:', res);})
); //should show up second

console.log(
    'this is not a promise:', 
    graph.run('sync')
);
