import { Graph } from "../../Graph"
import { DOMService } from "../../services/dom/DOM.service"

export const operators = {
    add:  (a, b=1) => {
        return a + b
    },
    subtract: (a, b=1) => {
        return a - b
    },
    multiply: (a, b=100) => {
        return a*b
    }
}

const tag = 'config_1'

const deep = new Graph({}, tag, {
    tag,
    arbitrary: {
        hello: 'world'
    },
    operator: (node, arg1) => {
        console.log('arbitrary property ( incorrect )', node.arbitrary, node.source.arbitrary)
        return arg1
    }
})

const correctTag = tag + '_correct'
const deep2 = new Graph({
    [correctTag]: {
        arbitrary: {
            hello: 'world'
        },
        operator: (node, arg1) => {
            console.log('node', node)
            console.log('arbitrary property ( correct )', node.arbitrary, node, node.initial)
            return arg1
        }
    }
})

const routes = {
    deep,
    deep2,
    add: {
        children: {
            'subtract': true
        },
        operator: operators.add,
    },
    multiply: {
        children: {
            [tag]: true,
            [correctTag]: true
        },
        operator: operators.multiply,
    },
}

export const tree = {
    subtract: {
        operator: operators.subtract,
        children: {
            'multiply': true        
        },
    },
    nested: new DOMService({
        name: 'nested',
        routes,
    })
}

export const expected = (input:any[]=[]) =>  operators.multiply(operators.subtract(operators.add(input[0], input[1])))
