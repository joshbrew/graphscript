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

// const deepGraph = new Graph({
//     button: {
//         tagName: 'button', 
//         innerHTML: 'Click me',
//         children: {
//             'add': true
//         },
//         operator: (input) => {
//             console.log('Running', input)
//             return input
//         },
//         oncreate: (self, props) => {
//             console.log('created function', self,  props)
//             self.onclick = () => {
//                 props.node.run(true)
//             }
//         }
//     },
// })

const routes = {
    // button: deepGraph,
    add: {
        children: {
            'subtract': true
        },
        operator: operators.add,
    },
    multiply: {
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
