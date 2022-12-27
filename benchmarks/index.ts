import * as core from './core.benchmark'

globalThis.escodeDemoLog = false

// let results = {
//     escode: {},
//     graphscript: {}
// } as any

const decimals = 4

const message = (res, msg) => {
    console.log(`Time to ${msg}: ${res.toFixed(decimals)}ms`)
    return res
}

const run = async (config) => {
    return {
        instantiate: await config.instantiate().then((res) => message(res, 'Instantiate')),
        listen: await config.listen().then((res) => message(res, 'Listen')),
    }
}

const runGraphScript = async () => {
    // console.log(`\n--------------- GraphScript ---------------`)
    const res = await run(core)
    // results.graphscript = res
}

// const showResults = () => {
//     console.log(`\n--------------- Results ---------------`)
//     console.log('Time to Instantiation:', `${(results.escode.instantiate / results.graphscript.instantiate).toFixed(decimals)}x`)
//     console.log('Time to Listen:', `${(results.escode.listen / results.graphscript.listen).toFixed(decimals)}x`)
// }

// Run the demos
// runESCode().then(runGraphScript).then(showResults)
runGraphScript()
// .then(showResults)