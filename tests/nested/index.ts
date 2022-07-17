import { Graph } from "../../Graph"
import { DOMService } from "../../services/dom/DOM.service"


const input = 3
const addOp = (a, b=1) => {
    console.log('add', a, b)
    return a + b
}

const subOp = (a, b=1) => {
    console.log('sub', a, b)
    return a - b
}

const routes = {
    subtract: {
        operator: subOp
    }
}

const tree = {
    add: {
        children: {
            'subtract': true
        },
        operator: addOp
    },
    nested: new DOMService({
        name: 'nested',
        routes,
        loadDefaultRoutes: false
    })
}

const graph = new Graph(tree, 'main')

const expected = subOp(addOp(input))
const addChildren = graph.nodes.get('add').children
console.log('Add Children', addChildren)


graph.run('add', input).then(res => document.body.innerHTML = `
<h2>Nested Graphs in Tree</h2>
<p><b>Result:</b> ${res}</p>
<p><b>Expected:</b> ${expected}</p>
<p><b>Test Passed:</b> ${ res == expected}</p>
`)
