import { Router } from "../../../routers/Router"
import * as treeInfo from "../tree"


const input = 3

const router = new Router({
    routes: treeInfo.tree
})

router.subscribe('subtract', (res) => document.body.innerHTML = `
    <h2>Router</h2>
    <p><b>Result:</b> ${res}</p>
    <p><b>Expected:</b> ${treeInfo.expected([input])}</p>
    <p><b>Test Passed:</b> ${ res == treeInfo.expected([input])}</p>
`)

console.log('Router', router)

const res = router.run('add', input)
console.log('Router res', res)

