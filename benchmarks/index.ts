import * as core from './core.benchmark'

globalThis.escodeDemoLog = false

let results = {
    other: {},
    graphscript: {}
} as any

const decimals = 4

const message = (res, msg) => {
    console.log(`Time to ${msg}: ${res.toFixed(decimals)}ms`)
    return res
}

const run = async (config) => {
    return {
        instantiate: await config.instantiate(), //.then((res) => message(res, 'Instantiate')),
        listen: await config.listen()//.then((res) => message(res, 'Listen')),
    }
}

const runGraphScript = async () => {
    // console.log(`\n--------------- GraphScript ---------------`)
    const res = await run(core)
    results.graphscript = res
}

const showResults = () => {
    // console.log('Ratio:', (results.graphscript.instantiate / results.graphscript.listen).toFixed(decimals))
    console.log('Time to Instantiation:', `${(results.graphscript.instantiate).toFixed(decimals)}ms`)
    console.log('Time to Listen:', `${(results.graphscript.listen).toFixed(decimals)}ms`)
}

// Run the demos
// runESCode().then(runGraphScript).then(showResults)
runGraphScript()
.then(showResults)