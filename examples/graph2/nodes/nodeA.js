export const x = 1
export const y = 2
export const jump = ()=>{console.log('jump!'); return 'jumped!'; }
export const __node = {
    listeners:{
        'nodeB.x':'jump', //listeners in a scope are bound to 'this' node
        'nodeB.nodeC':function(op_result){console.log('nodeC operator returned:', op_result, this)},
        'nodeB.nodeC.z':function(newZ){console.log('nodeC z prop changed:', newZ, this)}
    }
}