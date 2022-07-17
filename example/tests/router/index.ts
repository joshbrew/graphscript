import { Router } from "../../../routers/Router"
import * as treeInfo from "../tree"


const input = 3

const router = new Router([treeInfo.tree],{loadDefaultRoutes:false})
console.log('Router', router)

router.subscribe('subtract', (res) => {
    console.log('subscription output', res)
    document.body.innerHTML = `
    <h2>Router</h2>
    <p><b>Result:</b> ${res}</p>
    <p><b>Expected:</b> ${treeInfo.expected([input])}</p>
    <p><b>Test Passed:</b> ${ res == treeInfo.expected([input])}</p>
`
})

router.run('add', input)

