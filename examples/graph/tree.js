import * as nodeA from './nodes/nodeA.js'
import list from './list'

export const isNode = typeof process === 'object'

const nodeAInstance = Object.assign({}, nodeA)

class nodeClass { //treated as a class to instance rather than a function to set as __operator
    __operator = () => {
        const message = 'class instanced node called!'
        list.add(message)
    }
}

let tree = {

    // NOTE: This is a dummy case where the operators no longer flow because of the proxying
    top: {
        __element: 'div',
        innerText: 'Broken Operator Chain',
        __children: {
            test: {
                __element:'div',
                __children: {
                    testChild: {
                        __element:'div',
                        __children: {
                            testChild2: {
                                __element:'div',
                                __operator: (data) => {
                                    console.log('Third level!', data)
                                    return data
                                }
                            }
                        },

                        __operator: (data) => {
                            console.log('Second level!', data)
                            return data
                        }
                    }
                },
        
                __onconnected: function() {
                    const animate =  () => {
                        // this.latest = Date.now()
                        this.__operator(Date.now())
                        // workers.default.run('top.test', this.latest)
                        setTimeout(animate, 1000)
                    }
        
                    animate()
                },
        
                latest: Date.now(),
                __operator: function (data) {
                    this.latest = data
                    console.log('First level!',data )
                    return data
                },

                __listeners: {
                    // 'latest': 'top.test.testChild',
                    // 'top.test.latest': 'top.test.testChild'
                    // 'top.test.latest': 'testChild'
                    'latest': 'testChild'
                },
            },
        },
    },         

    nodeA: nodeAInstance,

    nodeB:{
        x:3,
        y:4,
        __children:{
                nodeC:{
                    z:4,
                    __operator:function(a) { 
                        this.z += a; 
                        const message = 'nodeC operator: nodeC z prop added to'
                        list.add(message)
                        return this.z; 
                    },
                    __listeners:{
                        'nodeA.x':function(newX) { 
                            const message = 'nodeC listener: nodeA x prop updated'
                            list.add(message)
                        },
                        'nodeA.jump':function(jump) { 
                            const message = 'nodeC listener: nodeA '
                            list.add(message)
                        }
                    }
                }
            }
        
    },

    nodeD:(a,b,c)=>{ return a+b+c; }, //becomes the .__operator prop and calling triggers setState for this tag (or nested tag if a child)


    nodeE:{
        __operator:function (){
            console.log('looped')
            const message = 'looped'
            list.add(message)
            console.log(message);
            
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