import {Graph, GraphNode, GraphNodeProperties, Roots } from '../../../src/core/Graph'


const roots:Roots = {

    actionNode:{
        __operator:function() {
            this.ctr++;
            return true;
        },
        ctr:0,
        // __children:{
        //     childAction:{
        //         x:0,
        //         __operator:function(inp) {
        //             this.x = inp;  //e.g. update this node based on the parent node
        //         }
        //     }
        // }
    } as GraphNodeProperties,

    listenerNode:{
        ctr:0,
        __listeners:{
            'actionNode':function(output) {
                document.body.innerText += 'actionNode operator:'+ output + '\n'
            },
            'actionNode.ctr':function(output) {
                document.body.innerText += 'actionNode counter: ' + output + '\n';
                this.ctr = output; //e.g. update this ctr based on the listener output
            }
        }
    } as GraphNodeProperties


};


const graph = new Graph({
    roots
});

document.body.innerText += 'running actionNode\n'

graph.run('actionNode'); //should trigger listenerNode 


let removed = graph.remove('actionNode');

graph.run('actionNode'); //should not trigger listenerNode

document.body.innerText += 'removed actionNode' + `\n`;

(removed as GraphNode).__operator(); //should increment ctr but not trigger listenerNode

graph.add(removed); //readd

document.body.innerText += 'readded actionNode' + `\n`;

graph.run('actionNode'); //should trigger listenerNode again

let rm = graph.remove('listenerNode');

document.body.innerText += 'removed listenerNode' + `\n`;

graph.run('actionNode'); //should not trigger listenerNode now

graph.add(rm);

document.body.innerText += 'readded listenerNode' + `\n`;

graph.run('actionNode'); //should trigger listenerNode again

//the listenerNode should only trigger THRICE