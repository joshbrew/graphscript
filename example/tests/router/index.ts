import { Router } from "../../../routers/Router"
import * as treeInfo from "../tree"


const input = 3

const router = new Router()
console.log('tree', treeInfo.tree)
router.load(treeInfo.tree)
console.log('Router', router)

router.subscribe('multiply', (res) => {
    document.body.innerHTML = `
    <h2>Router</h2>
    <p><b>Result:</b> ${res}</p>
    <p><b>Expected:</b> ${treeInfo.expected([input])}</p>
    <p><b>Test Passed:</b> ${ res == treeInfo.expected([input])}</p>
`
})

router.run('add', input)

