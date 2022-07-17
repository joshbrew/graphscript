import { DOMService } from "../../services/dom/DOM.service"

export const operators = {
    add:  (a, b=1) => {
        console.log('add', a, b)
        return a + b
    },
    subtract: (a, b=1) => {
        console.log('sub', a, b)
        return a - b
    }
}

const routes = {
    subtract: {
        operator: operators.subtract
    }
}

export const tree = {
    add: {
        children: {
            'subtract': true
        },
        operator: operators.add,
        
    },
    nested: new DOMService({
        name: 'nested',
        routes,
        loadDefaultRoutes: false
    })
}

export const expected = (input:any[]=[]) => operators.subtract(operators.add(input[0], input[1]))
