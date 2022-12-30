import { log } from '../../../tests/utils/index'


export const x = 5
export const y = 2

export const jump = ()=>{
    const message = 'jump!'
    log.add(message)
    return 'jumped!'; 
}

export const __listeners = {
    'nodeB.x':'jump', //listeners in a scope are bound to 'this' node
    'nodeB.nodeC':function(){
        const message = 'nodeA listener: nodeC operator returned:'
        log.add(message)
    },
    'nodeB.nodeC.z':function(){
        const message = 'nodeA listener: nodeC z prop changed:'
        log.add(message)
    },
    'nodeE': 'jump'
}