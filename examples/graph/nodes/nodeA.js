import list from '../list'


export const x = 5
export const y = 2

export const jump = ()=>{
    const message = `jump!`
    list.add(message)
    console.log(message); 
    return 'jumped!'; 
}

//listeners in a scope are bound to 'this' node
export const __listeners = {
    'nodeB.nodeC':function(op_result){
        const message = 'nodeA listener: nodeC operator returned:'
        list.add(message)
        console.log(message, op_result, this.__node.tag)
    },
    'nodeB.nodeC.z':function(newZ){
        const message = 'nodeA listener: nodeC z prop changed:'
        list.add(message)
        console.log(message,  newZ, this.__node.tag)
    },

    // ---------- Equivalent Decarations ----------
    // From —> To
    // 'nodeB.x':'jump',
    // 'nodeE': 'jump',

    // To —> From
    'jump': {
        'nodeE': true,
        'nodeB.x': true
    }
}