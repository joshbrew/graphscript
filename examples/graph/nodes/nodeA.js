import { log } from '../../../tests/utils/index'


export const x = 5
export const y = 2

export const jump = (input)=>{
    const message = 'jump!'
    log.add(message)

    let output = 'jumped'
    if (input) output = output + input
    return output
}

export const listenerUpdates = {
    'nodeB.nodeC': undefined,
    'nodeB.nodeC.z': undefined
}

export const __listeners = {
    'nodeB.x':'jump', //listeners in a scope are bound to 'this' node
    'nodeB.nodeC':function(input){
        const message = 'nodeA listener: nodeC operator returned:'
        log.add(message)
        listenerUpdates['nodeB.nodeC'] = input
    },
    'nodeB.nodeC.z':function(input){
        const message = 'nodeA listener: nodeC z prop changed:'
        log.add(message)
        listenerUpdates['nodeB.nodeC.z'] = input
    },
    'nodeE': 'jump'
}