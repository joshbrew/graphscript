
import { Graph } from "../../Graph";
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

// const checkPerformance = (callback, times = 1, cleanupCallback) => {
//     const array = Array.from({length: times}).map(() => callback)
//     return array.map((callback, i) => {
//         const start = performance.now()
//         const res = callback(i)
//         const end = performance.now()
//         if (cleanupCallback) cleanupCallback(res)
//         return end - start
//     }).reduce((acc, item) => acc + item, 0) / array.length
// }

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

checkPerformance((i) => {
    let graph = new Graph({
        tree: trees[i],
    });
    return graph
}, nTimes).then(averageTime => {
    console.log(`Time to Construct Graphs:`, averageTime)
})