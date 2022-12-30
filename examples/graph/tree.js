import * as nodeA from './nodes/nodeA.js'
import { isNode, log } from '../../tests/utils/index'

class nodeClass { //treated as a class to instance rather than a function to set as __operator
    __operator = () => {
        const message = 'class instanced node called!'
        log.add(message)
        return true
    }
}

let tree = {

    nodeA: Object.assign({}, nodeA), // Avoid issues with ESM

    nodeB:{
        x:3,
        y:4,
        __children:{
                nodeC:{
                    z:4,
                    listenerUpdates: {
                        'nodeA.jump': undefined,
                        'nodeA.x': undefined
                    },
                    __operator:function(a) { 
                        this.z += a; 
                        const message = 'nodeC operator: nodeC z prop added to'
                        log.add(message)
                        return this.z; 
                    },
                    __listeners:{
                        'nodeA.x':function(newX) { 
                            const message = 'nodeC listener: nodeA x prop updated'
                            log.add(message)
                            this.listenerUpdates['nodeA.x'] = newX
                        },
                        'nodeA.jump':function(jump) { 
                            const message = 'nodeC listener: nodeA '
                            log.add(message)
                            this.listenerUpdates['nodeA.jump'] = jump
                        }
                    }
                }
            }
        
    },

    nodeD:(a,b,c)=>{ return a+b+c; }, //becomes the .__operator prop and calling triggers setState for this tag (or nested tag if a child)


    nodeE:{
        __operator:function (){
            const message = 'looped'
            log.add(message)
            return true;
        },
        __node:{
            loop:1000,
            looping:true
        }
    },

    nodeG: nodeClass

};


if (!isNode) {
    tree.nodeF = {
        __props:document.createElement('div'), //properties on the '__props' object will be proxied and mutatable as 'this' on the node. E.g. for representing HTML elements
        __onconnected:function (node) { 
            this.innerHTML = 'Test';
            this.style.backgroundColor = 'green'; 
            // document.body.appendChild(this.__props); 
            // console.log(this,this.__props);
        },
        __ondisconnected:function(node) {
            document.body.removeChild(this.__props);
        }
        
    }
}

export default tree