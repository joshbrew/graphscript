import { Graph } from "../../../Graph"
import { Router } from "../../../routers/Router"
import * as treeInfo from "../tree"


const input = 3


const graph = new Graph(treeInfo.tree, 'main')

console.log('main graph:',graph);
console.log('nested map:',graph.nodes.get('nested').nodes)
const addChildren = graph.nodes.get('add').children
console.log('add node children:', addChildren)

graph.subscribe('subtract', (res) => document.body.innerHTML = `
<h2>Nested Graphs in Tree</h2>
<p><b>Result:</b> ${res}</p>
<p><b>Expected:</b> ${treeInfo.expected([input])}</p>
<p><b>Test Passed:</b> ${ res == treeInfo.expected([input])}</p>
`)

graph.run('add', input);