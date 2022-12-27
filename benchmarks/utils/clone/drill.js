import { esm } from './check.js'

export const abortSymbol = Symbol('abort')


const getObjectInfo = (obj, path = []) => {
    return {
        typeof: typeof obj,
        name: obj?.constructor?.name,
        simple: true,
        object: obj && typeof obj === 'object',
        path
    }
}

export const drillSimple = (obj, callback, options = {}) => {

    let accumulator = options.accumulator
    if (!accumulator) accumulator = options.accumulator = {}

    const ignore = options.ignore || []
    const path = options.path || []
    const condition = options.condition ||  true

    const seen = []
    const fromSeen = []
    
    let drill = (obj, acc={}, globalInfo) => {


        const path = globalInfo.path
        if (path.length === 0) {
            const toPass = condition instanceof Function ? condition(undefined, obj, { ...getObjectInfo(obj, path) }) : condition
            if (!toPass) return obj // Allow skipping top-level objects too
        }

        for (let key in obj) {
            if (options.abort) return
            if (ignore.includes(key)) continue

            const val = obj[key]
            const newPath = [...path, key]

            const info = getObjectInfo(val, newPath)

            if (info.object) {
                const name = info.name

                const isESM = esm(val) // make sure to catch ESM

                if (isESM || name === 'Object' || name === 'Array') {
                    info.simple = true
                    const idx = seen.indexOf(val)
                    if (idx !== -1) acc[key] =fromSeen[idx]
                    else {
                        seen.push(val)

                        const pass = condition instanceof Function ? condition(key, val, info) : condition
                        info.pass = pass
                        
                        const res = callback(key, val, info)
                        if (res === abortSymbol) return abortSymbol
                        acc[key] = res

                        if (pass) {
                            fromSeen.push(acc[key])
                            const res = drill(val, acc[key], {...globalInfo, path: newPath}) // Drill simple objects
                            if (res === abortSymbol) return abortSymbol
                            acc[key] = res
                        }
                    }
                } 
                else {
                    info.simple = false
                    const res =  callback(key, val, info)
                    if (res === abortSymbol) return abortSymbol
                    acc[key] = res
                }
            } else {
                const res =  callback(key, val, info)
                if (res === abortSymbol) return abortSymbol
                acc[key] = res
            }


        } 

        return acc
    }

    return drill(obj, accumulator, { path })
}