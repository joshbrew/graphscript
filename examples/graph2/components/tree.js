import * as nodeA from './nodeA.js'
import * as nodeB from './nodeB.js'
import * as nodeC from './nodeC.js'
import * as nodeD from './nodeD.js'

export const esDOM = {
    nodeA,
    nodeB: {
        esCompose: nodeB,
        esDOM: {
            nodeC: {
                esCompose: nodeC,
                default: function(a) { this.z += a; console.log('nodeC z prop added to',this); return this.z; }
            }
        }
    },

    nodeD,

    nodeE: {
        esAnimate: 1,
        default: () => {console.log('looped!');}
    }
}

export const esListeners = {
    '': {
        'nodeA.x':function(newX) { console.log('nodeA x prop updated', newX);},
        'nodeA.jump':function(jump) { 
            console.log('nodeA ', jump);
        }
    }
}