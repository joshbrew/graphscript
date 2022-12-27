import { drillSimple } from "./drill"
import { all } from "./properties"

export const shallow = (obj, opts={}) => {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            obj = [...obj] // Clone the orignal object
            opts.accumulator = []
        } else {
            const keys = all(obj)
            const newObj = {}
            for (let key of keys)  newObj[key] = obj[key] // Clone the orignal object
            obj = newObj
            opts.accumulator =  {}
        }
    }

    return obj
}

export const deep = (obj, opts={}) => {
    if (typeof obj !== 'object') return obj
    obj = shallow(obj, opts)

    drillSimple(obj, (key, val, info) => {
        if (info.simple && info.object) return Array.isArray(val) ? [] : {} // Create new references
        // else if (info.typeof === 'function') return val.bind({}) // Clone Functions
        else return val
    }, opts)

    return opts.accumulator
}