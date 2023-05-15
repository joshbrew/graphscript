// Benchmark Performance on Graph Construction
import {performance } from 'perf_hooks';

export const checkPerformance = async (callback, times = 1, cleanupCallback?) => {
    const callbacks = Array.from({length: times}).map(() => callback)

    const timesArr: number[] = []
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