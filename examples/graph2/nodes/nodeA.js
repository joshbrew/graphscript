export const x = 5
export const y = 2
export const jump = ()=>{console.log('jump!'); return 'jumped!'; }
export const __listeners = {
    'nodeB.x':'jump', //listeners in a scope are bound to 'this' node
    'nodeB.nodeC':function(op_result){console.log('nodeA listener: nodeC operator returned:', op_result, this)},
    'nodeB.nodeC.z':function(newZ){console.log('nodeA listener: nodeC z prop changed:', newZ, this)},
    'nodeE': 'jump'
}
