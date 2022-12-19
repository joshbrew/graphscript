import { Graph } from "../../Graph2"


// Special Key Definition
const defaultPath = 'default'
const operatorPath = '__operator'
const specialKeys = {
    path: '__path',
    isGraphScript: '__',
    listeners: {
        value: '__listeners',
        branch: '__branch',
        bind: '__bind',
        trigger: '__trigger',
        format: '__format',
    },
}

// Symbols to Recognize
const listenerObject = Symbol('listenerObject')
const toSet = Symbol('toSet')
const subscriptionKey = Symbol('subscriptionKey')
const configKey = Symbol('configKey')
const toResolveWithKey = Symbol('toResolveWithKey')

// Configuration Options
const isConfigObject = (o) => specialKeys.listeners.format in o || specialKeys.listeners.branch in o || specialKeys.listeners.trigger in o || specialKeys.listeners.bind in o

// Status Definitions
const initializedStatus = 'INITIALIZED'
const registeredStatus = 'REGISTERED'

// Global References
const globalFrom = {} as any
const globalTo = {} as any
const globalActive = {}

class Edgelord {

    original = {};
    active = {}
    globals: any = {}
    context: any = {
        options: {},
    }
    rootPath: string = ''
    status = ''

    graph: Graph
    
    #triggers: any[] = []
    #queue: any[] = []
    #toResolveWith: Edgelord

    constructor (listeners?, root?, context?) {
        if (listeners || root || context) this.setInitialProperties(listeners, root, context)
    }

    setInitialProperties = (listeners = {}, root, context={}) => {

        Object.assign(this.context, context)
        if (root) this.rootPath = root

        if (!this.context.options.keySeparator) this.context.options.keySeparator = this.context.monitor.options.keySeparator
        
        this.original = listeners

        const globals = [{name: 'active', ref: globalActive}, {name: 'from', ref: globalFrom}, {name: 'to', ref: globalTo}]
        globals.forEach((o) => {
            if (!o.ref[this.context.id]) o.ref[this.context.id] = {}
            this.globals[o.name] = o.ref[this.context.id]
        })

        this.#toResolveWith = this.getManager()
        this.runEachListener(listeners, this.addToGlobalLog)
    }

    getManager = (mode ='from') => {
        
            // Check if a higher-level listener is sending information from this root context
            let target = (mode === 'to') ? this.globals.to : this.globals.from
            this.rootPath.split(this.context.options.keySeparator).forEach((key) => {
                if (!target[key]) target[key] = {}
                target = target[key]
            })

            // if (Object.keys(target).length) this.#sendsToExternalGraph = true
            return target[toResolveWithKey] ?? this
    }

    onStart = (f) => {
        const res = this.#toResolveWith
        const isSame = res === this
        if (isSame) {
            if (this.status === initializedStatus) f()
            else this.#queue.push(f)
        } else res.onStart(f)
    }

    runEachListener = (listeners, callback) => {
        if (!callback) return
        for (const first in listeners) {
            const second = listeners[first]

            if (!second) {
                console.warn('Skipping empty listener:', first)
                continue;
            }

            // NOTE: Listener sheets are to / from
            if (second && typeof second === 'object') {
                const from = second
                const to = first
                for (let fromPath in from) {
                    callback(
                        fromPath,  // From Path
                        to, // To Path
                        from[fromPath] // Value
                    )
                }
            } 
            
            // Immediate Absolute Paths Only
            // NOTE: Direct listeners are from / to
            else {
                const from = first
                const to = second

                const typeOf = typeof to
                if (typeOf === 'function') callback(from, '', to)
                else if (typeOf === 'string') callback(from, to, to)
                else console.error('Improperly Formatted Listener', to)
            }
        }

    }

    register = (listeners = this.original) =>  {

        this.runEachListener(listeners, this.add)
        this.status = registeredStatus
    }

    #initialize = (o) => {
        const res = this.context.monitor.get(o.path, 'info')
        if (typeof res.value === 'function') {
            const args = (Array.isArray(o.args)) ? o.args : [o.args]
            res.value(...args)
        }
        else console.error('Cannot yet trigger values...', o)
    }

    initialize = (o?) => {
        if (!this.status) this.#triggers.push(o)
        else if (this.status === registeredStatus) {
            this.status = initializedStatus
            this.#triggers.forEach(this.#initialize)
            this.#queue.forEach(f => f())
            this.#queue = []
            this.#triggers = []
        } else this.#initialize(o)
    }

    start = () => {
        this.register()
        this.initialize()
    }

    #getAbsolutePath = (name) => {
        const sep = this.context.monitor.options.keySeparator
        return (
            !name 
            || !this.rootPath 
            || (this.rootPath === name.slice(0, this.rootPath.length) && name[this.rootPath.length] === sep)
        ) ? name : [this.rootPath, name].join(sep)
    }

    #getPathInfo = (path) => {

        const output = {
            absolute: {},
            relative: {}
        } as any

        // Transform name to absolute 
        path =  this.#getAbsolutePath(path)
        let rel = this.rootPath ? path.replace(`${this.rootPath}.`, '') : path
        const baseArr = path.split(this.context.options.keySeparator)
        output.absolute.array = [this.context.id, ...baseArr]
        output.relative.array = rel.split(this.context.options.keySeparator)

        let obj = this.context.monitor.get(output.relative.array, undefined, this.context.instance, false) // Allow for getting properties
        
        // Fallback to direct graph reference
        if (this.context.graph) {

            // Correct for paths that are relative to the bound object
            if (obj && this.context.bound) {
                output.absolute.array = [this.context.id, this.context.bound, ...output.absolute.array.slice(1)]
                output.relative.array.unshift(this.context.bound)
            } 
            
            // Assume you are targeting the global graph
            else if (!obj) {
                const rel = output.relative.array.join(this.context.options.keySeparator)
                obj = this.context.graph.get(rel)
            }
        }
        
        const isGraphScript = obj && typeof obj === 'object' && specialKeys.isGraphScript in obj

        // Updates based on default / operators
        if (isGraphScript) {

            // Fallback to operator updates
            if (obj[operatorPath]){
                output.absolute.array.push(operatorPath)
                output.relative.array.push(operatorPath)
            } 
            
            // Fallback to default updates
            else if (obj[defaultPath]){
                output.absolute.array.push(defaultPath)
                output.relative.array.push(defaultPath)
            } 
        }

        output.absolute.value = output.absolute.array.slice(1).join(this.context.options.keySeparator) // update path
        output.relative.value = output.relative.array.join(this.context.options.keySeparator) // update path
        
        return output
    }

    add = (from, to, value: any = true, subscription?) => {

        if (typeof to == 'function') {
            value = to
            to = '' // Actually to a function
        } else if (typeof to !== 'string') {
            console.error('Improperly Formatted Listener', from, to, value)
            return
        }

        if (!value) return // Any non-truthy value is not accepted

        const fromInfo = this.#getPathInfo(from)
        const toInfo = this.#getPathInfo(to)

        // Check global for subscription
        const absPath = fromInfo.absolute.value
        if (!subscription) subscription = this.globals.active[absPath]?.[subscriptionKey]

        // Only subscribe once
        if (!subscription) {
            subscription =this.context.monitor.on(fromInfo.absolute.array, (path, _, update) => this.activate(path, update), {
                ref: this.context.instance,
                path: fromInfo.relative.array
            })
            // console.log('Subscribing', fromInfo.absolute.array, subscription)
        }

        // Use updated string value if modified
        if (typeof value == 'string') value = toInfo.absolute.array.slice(1).join(this.context.options.keySeparator)

        const info = {
            value,
            [listenerObject]: true
        }

        const refs = [this.active, this.globals.active]

        refs.forEach(ref => {
            if(!ref[absPath]) ref[absPath] = {}
            const base = ref[absPath]
            if (!base[subscriptionKey]) {
                Object.defineProperty(base, subscriptionKey, {
                    value: subscription,
                    configurable: true
                })
            }
            base[toInfo.absolute.value] = info
        })

        // // Update Original
        // let base = this.original[toInfo.relative.value]
        // if (!base) base = this.original[toInfo.relative.value] = {}
        // if (typeof base !== 'object') {
        //     if (typeof base === 'function') base = this.original[toInfo.relative.value] = {[Symbol('function listener')]: base} // Move function to arbitrary key
        //     else base = this.original[toInfo.relative.value] = {[base]: true} // Move string to  a complex listener
        // }
        // base[fromInfo.relative.value] = value // complex listener

        // Initalize triggers (possible on higherl-level manager)
        const args = value[specialKeys.listeners.trigger]
        if (args) this.#toResolveWith.initialize({
            path: fromInfo.absolute.array,
            args
        })

        this.addToGlobalLog(absPath)


        return info
    }

    addToGlobalLog = (path, mode = 'from') => {

        const absolutePath = this.#getAbsolutePath(path)

        // Register in global registry
        let target = (mode === 'to') ? this.globals.to : this.globals.from
        const globalPath = absolutePath.split(this.context.options.keySeparator)
        globalPath.forEach((key) => {
            if (!target[key]) target[key] = {}
            target = target[key]
            if (!(target[toResolveWithKey])) target[toResolveWithKey] = this // Always set with the lowest
        })

    }

    // Local removal
    remove = (from, to) => {
        const fromInfo = this.#getPathInfo(from)
        const toInfo = this.#getPathInfo(to)

        const path = [fromInfo.absolute.value, toInfo.absolute.value]
        const toRemove = [
            { ref: this.active, path },
            { ref: this.globals.active, path, unlisten: true }, // Remove subscription if required
            // { ref: this.original, path: [toInfo.relative.value, fromInfo.relative.value] }, // Just removing from the list
        ]


        toRemove.forEach(o => {
            const { ref, path, unlisten } = o

            let base = ref[path[0]]

            if (typeof base === 'object') {
                delete base[path[1]] // complex listener
                if (Object.keys(base).length === 0) {
                    delete ref[path[0]]
                    const sub = base[subscriptionKey]
                    if (unlisten && sub) {
                        this.context.monitor.remove(sub) // Cleaning up subscriptions (active only)
                    }
                    delete base[subscriptionKey]
                }

            } else delete ref[path[0]] // simple listener

        })

    }

    // Local clearing
    clear = (name) => {
        const value = this.#getAbsolutePath(name)

        Object.keys(this.active).forEach(from => {
            Object.keys(this.active[from]).forEach(to => {
                if (
                    !value
                    || from.slice(0, value.length) === value // Matches from
                    || to.slice(0, value.length) === value // Matches to
                ) this.remove(from, to)
            })
        })
    }

    has = (from, ref=this.active) => !!ref[from]

    get = (from, ref=this.active) => ref[from]



    // ----------------- Global Flow Activation Management -----------------
    activate = (from, update) => {

    const listenerGroups = [{
        info: this.get(from, this.globals.active),
        name: from
    }]

    listenerGroups.forEach(group => {

        const info = group.info

        if (info) {

            if (info[listenerObject]) {

                this.pass(from, {
                    value: info.value,
                    parent: this.active,
                    key: group.name,
                    subscription: info.subscription,
                    __value: true
                }, update)
            } else if (typeof info === 'object') {
                for (let key in info) {
                    this.pass(from, {
                        parent: info,
                        key,
                        subscription: info[key].subscription,
                        value: info[key].value,
                    }, update)
                }
            } else console.error('Improperly Formatted Listener', info)
        }
    })
}

pass = (from, target, update) => {

    const id = this.context.id
    const isValue = target?.__value
    let parent = target.parent
    let to = target.key


    // const rootArr = root.split(this.context.options.keySeparator)
    const info = target.parent[to]
    target = info.value

    let config = info?.[configKey] // Grab config

    let ogValue = target
    const type = typeof target

    const checkIfSetter = (path, willSet) => {

        const info = this.context.monitor.get(path, 'info')
        if (info.exists) {
            const val = info.value
            const noDefault = typeof val !== 'function' && !val?.default
            const value = (noDefault) ? toSet : val

            const res = { value }

            if (willSet) {
                target = res.value
                parent[to] = res
            }

            return res
        } else return { value: undefined } //, root: undefined }

    }

    const transform = (willSet?) => {
        const fullPath = [id]
        // if (root) fullPath.push(...rootArr) // correcting for relative string
        fullPath.push(...to.split(this.context.options.keySeparator))
        return checkIfSetter(fullPath, willSet)
    }

    // ------------------ Grab Correct Target to Listen To ------------------


    const getPathArray = (latest) => {
        const path = [id]
        const topPath: any[] = []
        if (this.rootPath) topPath.push(...this.rootPath.split(this.context.options.keySeparator)) // correcting for relative string
        topPath.push(...latest.split(this.context.options.keySeparator))
        path.push(...topPath)
        return path
    }

    // Confirmation of the target
    if (typeof target === 'boolean') {
        if (!isValue) transform(true)
        else console.error(`Cannot use a boolean for ${specialKeys.listeners.value}...`)
    }

    // Name of the target
    else if (type === 'string') {
        const path = getPathArray(ogValue)
        checkIfSetter(path, true)

        if (isValue) {
            parent[to] = { [ogValue]: parent[to] }
            to = ogValue
        }
    }

    else if (target && type === 'object') {

        // Check if configuration object
        const isConfig = isConfigObject(ogValue)

        if (isConfig) {

            if ('value' in ogValue) {
                if (isValue) {
                    target = parent[to] = ogValue.value // setting value
                } else {
                    target = parent[to].value = ogValue.value // setting value
                }
            } else transform(true)

            if (ogValue){
                if (ogValue) config = ogValue
            }

            Object.defineProperty(parent[to], configKey, { value: config })
        }

    }

    // ------------------ Special Keywords ------------------
    let isValidInput = true

    if (config) {

        
        const bindKey = specialKeys.listeners.value
        if (bindKey in config) {

            // (de)Register listeners at runtime...
            const path = getPathArray(config[bindKey].original ?? config[bindKey])
            if (typeof config[bindKey] === 'string') {
                const res = this.context.monitor.get(path)
                if (!res)  target = `because ${path.slice(1).join(this.context.options.keySeparator)} does not point correctly to an existing component.`
                else {
                    config[bindKey] = {
                        value: res,
                        original: config[bindKey]
                    }
                }
            } else if (!config[bindKey].value.__parent) {
                target = `because ${config[bindKey].original ?? id.toString()} has become unparented.`
            }

        } 
        
        else {

            const branchKey = specialKeys.listeners.branch
            const formatKey = specialKeys.listeners.format

            if (branchKey in config) {

                const isValid = config[branchKey].find(o => {

                    let localValid: boolean[] = []
                    if ('if' in o) localValid.push(o.if(update)) // Condition Function
                    if ('is' in o) localValid.push(o.is === update) // Equality Check
                    const isValidLocal = localValid.length > 0 && localValid.reduce((a, b) => a && b, true)

                    if (isValidLocal) {
                        if ('value' in o)  update = o.value // set first argument to branch value
                    }

                    return isValidLocal
                })

                if (!isValid) isValidInput = false
            }


            
            // NOTE: May turn into an array here
            if (formatKey in config) {
                try {
                    update = config[formatKey](update)
                    if (update === undefined) isValidInput = false
                } catch (e) { console.error('Failed to format arguments', e) }
            }

        }
    }

    // ------------------ Handle Target ------------------

    // console.log('target', target, isValidInput, update)
    if (
        isValidInput // Ensure input is valid
        && update !== undefined // Ensure input is not exactly undefined (though null is fine)
    ) {

        const arrayUpdate = Array.isArray(update) ? update : [update]


        // Set New Value on Parent
        if (target === toSet) {
            const parentPath = [id]
            // if (root) parentPath.push(...rootArr) // TODO: Check if this needs fixing
            parentPath.push(...to.split(this.context.options.keySeparator))
            const idx = parentPath.pop()
            const info = this.context.monitor.get(parentPath, 'info')
            if (info.value) info.value[idx] = update
            else console.error(`Cannot set value on ${parentPath.filter(str => typeof str !== 'symbol').join(this.context.options.keySeparator)} from ${from}`)
        }

        // Direct Object with Default Function
        else if (target?.default) target.default.call(target, ...arrayUpdate) // Call with parent context

        // Direct Function
        else if (typeof target === 'function') {
            const noContext = parent[to][listenerObject]
            if (noContext) target.call(config?.[specialKeys.listeners.bind]?.value ?? this.context.instance, ...arrayUpdate) // Call with top-level context
            else target(...arrayUpdate) // Call with default context
        }

        // Failed
        else {

            let baseMessage = (to) ? `listener: ${from} —> ${to}` : `listener from ${from}`
            if (parent) {
                console.warn(`Deleting ${baseMessage}`, target)
                delete parent[to]
            } else console.error(`Failed to add ${baseMessage}`, target)
        }
    }
}


}

export default Edgelord