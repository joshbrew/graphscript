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

const routes = {
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
