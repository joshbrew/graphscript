
import { Graph } from "../../js/packages/core/Graph";
import tree from './tree'

const deepCopy = (obj, seen=[]) => {

    const copy = {}
    for (let key in obj) {
        const val = obj[key]
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            if (seen.includes(val)) continue
            seen.push(val)
            copy[key] = deepCopy(val, seen)
        } else copy[key] = val

    }

    return copy
}

const checkPerformance = async (callback, times = 1, cleanupCallback) => {
    const callbacks = Array.from({length: times}).map(() => callback)

    const timesArr = []
    let count = 0
    for await (callback of callbacks) {
        const start = performance.now()
        const res = await callback(count)
        const end = performance.now()
        if (cleanupCallback) cleanupCallback(res)
        const time = end - start
        timesArr.push(time)
        count++
    }
    
   return timesArr.reduce((acc, item) => acc + item, 0) / timesArr.length

}

const nTimes = 100
const trees = Array.from({length: nTimes}).map(() => deepCopy(tree)) // Pre-generate trees to avoid performance hit of generating them

const checkInstantiationTime = async () => {
    return checkPerformance((i) => {
        let graph = new Graph({
            roots: trees[i],
        });
        return graph
    }, nTimes).then(averageTime => {
        console.log(`Time to Construct Graphs:`, averageTime)
    })
}


const listenerTree = deepCopy(tree)
const checkListenerTime = async () => {
    let graph = new Graph({
        roots: listenerTree,
    });

    return checkPerformance(async () => {
        const res = graph.get('nodeA').jump();
        // console.warn('Got', res)
    }, nTimes).then(averageTime => {
        console.log(`Time to Jump:`, averageTime)
    })
}


// Run Benchmarks
checkInstantiationTime()
.then(checkListenerTime)