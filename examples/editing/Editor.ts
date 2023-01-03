import { Graph } from "../../src/core/Graph"

export default class Editor {

    graph: Graph
    listeners: any = {}
    ui?: Element

    #selectElements: any = []

    propertiesToSubscribe: Set<string> = new Set()
    nodePaths: Set<string> = new Set()

    #fIter = 0

    elements: {
        active?: Element,
        create?: Element,
    } = {}

    constructor (graph) {
        this.set(graph)
    }

    // Set Graph on the Editor and React to Listeners 
    set = (graph) => {
        this.graph = graph

        if (this.graph) {
            const nodes = Array.from(this.graph.__node.nodes.values())

            this.nodePaths = new Set(nodes.map(o => o.__node.tag))
            this.propertiesToSubscribe = new Set(this.nodePaths)

            nodes.forEach(o => {
                const listeners = o.__listeners
                if (listeners) {
                    for (let key in listeners) this.#onListenerAdded(key, listeners[key], o)
                }
            })
        } else {
            this.listeners = {}
        }
    } 

    // Exposed method for removing a listener
    removeListener = (key, value, bound) => {
        console.error('Remove Listener to the graph here...')
        this.#onListenerRemoved(key, value, bound)
    }

    // Exposed method for adding a listener
    addListener = (from, to, bound) => {
        console.error('Add Listener to the graph here...')
        this.#onListenerAdded(from, to, bound)
    }

    // InitializE the editor UI when the UI is ready
    setUI = (ui: Element=document.body) => {
        if (this.ui) Array.from(this.ui.children).forEach(c => c.remove())
        this.ui = ui

        if (this.ui) {

            const createListenerInfo = this.#createListenerUI()
            // Create Listener UI
            const create = document.createElement('div')
            create.appendChild(createListenerInfo.element)
            this.ui.appendChild(create)
            this.elements.create = create

            // Show Active Listeners
            const active = document.createElement('div')
            active.id = 'active'
            const activeHeader = document.createElement('h3')
            activeHeader.innerText = 'Active Listeners'
            active.appendChild(activeHeader)
            this.ui.appendChild(active)
            this.elements.active = active

            // Add all listeners to the UI
            for (let bound in this.listeners) {
                for (let key in this.listeners[bound]) this.listeners[bound][key].forEach(value => this.addListenerToUI(key, value, bound))
            }
        }
    }

    // -------------- Internal Event Managers --------------
    #onListenerAdded = (key, value, bound) => {

        bound = (typeof bound !== 'string') ? bound.__node.tag : bound
        if (!this.listeners[bound]) this.listeners[bound] = {}
        if (!this.listeners[bound][key]) this.listeners[bound][key] = []
        this.listeners[bound][key].push(value)     
        
        if (this.ui) this.addListenerToUI(key, value, bound)
    }

    #onListenerRemoved = (key, value, bound) => {
        console.error('Remove Listener from UI' , key, value, bound)
    }
    


    // ----------------------------------------------------------- //
    // ----------------- Ugly UI Management Code ----------------- //
    // ----------------------------------------------------------- //

    addListenerToUI = (key, value, bound) => this.#addListenerToUI(key, value, bound)

    #createListenerUI = (from?, value: any = {}, bound?) => {
        const noArgs = !from && Object.keys(value).length === 0 && !bound
        
        const options = this.propertiesToSubscribe
        let to = typeof value === 'string' ? value : undefined //value.__output
        
        const ogOptionsSize = options.size

        // Resolve Callback
        const resolvePath = (path) => {
            if (!this.nodePaths.has(path)) {
                if (typeof path === 'string' && path.includes('FUNCTION_')) path = `${bound}.${path}`
            }
            return path
        }

        const isValid = (path) => typeof path !== 'function' && typeof path !== 'boolean' && typeof path !== 'object'

        const addPathToOptions = (path) => {
            if (path && !options.has(path) && isValid(path)) {
                path = resolvePath(path)
                options.add(path) // Ignore Function or Boolean Callbacks
            }
        }

        let callback = value.__callback

        if (callback && typeof callback === 'function') {
            callback.gsEditorId = this.#fIter
            callback = `FUNCTION_${this.#fIter}` // NOTE: These functions are all the same!
            this.#fIter++
        }
        else if (typeof callback === 'boolean') callback = bound

        // Assign To and Callback
        if (callback && to) console.error('Has Both', callback && to)
        if (!to) to = callback
        addPathToOptions(to)

        const states = {from, to, bound, value}

        const div = document.createElement('div')
        div.style.border = '1px solid black'
        div.style.padding = '10px'
        div.style.position = 'relative'

        let button = document.createElement('button')
        if (noArgs) {
            button.innerText = 'Create'
            button.onclick = () => {
                const {from, to, bound, value} = states
                if (bound && from) {
                    console.error('Actually subscribe to the listener here', states)
                    this.#onListenerAdded(from, value, bound)
                }
            }

        } else {
            button.innerText = 'Remove'
            button.onclick = () => {
                div.remove()
                this.removeListener(from, to, bound)
            }
        } 

        button.style = `position: absolute; top: 0; right: 0;`
        div.appendChild(button)


        const fromContainer = document.createElement('div')
        const fromLabel = document.createElement('label')
        fromLabel.innerText = 'From'
        const fromSelect = document.createElement('select')
        fromSelect.id = 'from'
        fromContainer.appendChild(fromLabel)
        fromContainer.appendChild(fromSelect)

        const boundContainer = document.createElement('div')
        const boundLabel = document.createElement('label')
        boundLabel.innerText = 'Bound To'
        const boundSelect = document.createElement('select')
        boundSelect.id = 'bound'
        boundContainer.appendChild(boundLabel)
        boundContainer.appendChild(boundSelect)

        const toContainer = document.createElement('div')
        const toLabel = document.createElement('label')
        toLabel.innerText = 'To'
        const toSelect = document.createElement('select')
        toSelect.id = 'to'
        toContainer.appendChild(toLabel)
        toContainer.appendChild(toSelect)

        const createIO = (value) => {

            const ioStates = {}
            const inputContainer = document.createElement('div')
            const inputHeader =  document.createElement('h4')
            inputHeader.innerText = 'Input'
            inputContainer.appendChild(inputHeader)
            const inputSelect = document.createElement('select')
            inputSelect.id = 'input'
            inputContainer.appendChild(inputSelect)

            this.#addSelectElement(inputSelect, {
                value: value.__input,
                onchange: (ev) => {
                    const value = ev.target.value
                    this.#onSelectChange(ev, states)
                    console.log('Input Changed', value)
                    states.value.__input = value

                }
            }, this.propertiesToSubscribe, true)


            // array[ind] = output(input(args))
            const argsContainer = document.createElement('div')
            const argsHeader =  document.createElement('h4')
            argsHeader.innerText = 'Arguments'
            argsContainer.appendChild(argsHeader)
            const argsContained = document.createElement('div')
            argsContainer.appendChild(argsContained)
            argsContained.style.display = 'flex'

            const createArgs = (args) => {
                args.forEach((arg, i) => {
                    if (typeof arg === 'object') {
                        const io = createIO(arg)
                        states.value.__args[i] = io.states
                        argsContained.appendChild(io.element)
                    } else {
                        const argContainer = document.createElement('div')
                        const argSelect = document.createElement('select')
                        argContainer.appendChild(argSelect)
                        argsContained.appendChild(argContainer)
                        addPathToOptions(arg)
                        this.#addSelectElement(argSelect, {
                            value: arg,
                            onchange: (ev) => {
                                const value = ev.target.value
                                this.#onSelectChange(ev, states)
                                if (!states.value.__args) states.value.__args = []
                                states.value.__args[i] = value
                            }
                        }, this.propertiesToSubscribe, true)
                    }
                })
            }
            
            if (value.__args) createArgs(value.__args)
            else createArgs([undefined])

            const output = value.__output
            const isSimple = !(output && typeof output === 'object')

            const outputContainer = document.createElement('div') 
            const outputHeader =  document.createElement('h4')
            outputHeader.innerText = 'Output'
            outputContainer.appendChild(outputHeader)

            let outputValue;
            if (isSimple) outputValue = document.createElement('div')
            else {
                const ioInfo = createIO(output)
                outputValue = ioInfo.element
                states.value.__output = ioInfo.states
            }

            outputContainer.appendChild(outputValue)
            if (isSimple) {

                const select = document.createElement('select')
                select.id = 'output'
                outputContainer.appendChild(select)
    
                this.#addSelectElement(select, {
                    value: output,
                    onchange: (ev) => {
                        const value = ev.target.value
                        this.#onSelectChange(ev, states)
                        states.value.__output = value
                    }
                }, this.propertiesToSubscribe, true)
    
                // if (hasOutput) outputValue.innerText = output
                // else outputValue.innerText = 'N/A'
            } else {
                states.value.__output
            }
            

            const ioContainer = document.createElement('div')
            ioContainer.appendChild(inputContainer)
            ioContainer.appendChild(argsContainer)
            ioContainer.appendChild(outputContainer)
            return {
                element: ioContainer,
                states: ioStates
            }
        }

        const io = createIO(value)


        div.appendChild(fromContainer)
        div.appendChild(boundContainer)
        div.appendChild(toContainer)
        div.appendChild(io.element)

        if (ogOptionsSize !== options.size) this.#updateSelectElements()

        this.#addSelectElement(fromSelect, {
            value: from,
            onchange: (ev) => this.#onSelectChange(ev, states, 'from')
        })
        
        this.#addSelectElement(toSelect, {
            value: to,
            onchange: (ev) => this.#onSelectChange(ev, states, 'to')
        })

        this.#addSelectElement(boundSelect,{
            value: bound,
            onchange: (ev) => this.#onSelectChange(ev, states, 'bound')
        }, this.nodePaths)

        return {
            element: div,
            states
        }
    }

    #addListenerToUI = (from, value, bound) => {

        const info = this.#createListenerUI(from, value, bound)

        this.elements.active?.appendChild(info.element)
    }

    #addSelectElement = (el, configuration, options=this.propertiesToSubscribe, includeOutput = false) => {

        if (typeof configuration !== 'object') configuration = {value: configuration}

        const info = {
            el,
            configuration,
            options,
            includeOutput
        }
        this.#selectElements.push(info)
        this.#updateSelectElement(info)
    }

    #updateSelectElements = () => this.#selectElements.forEach(o => this.#updateSelectElement(o))

    #onSelectChange = (ev, states, key?) => {
        const value =  ev.target.value
        const node = this.graph.__node.nodes.get(states.from)
            if (node) {
            const unique =node.__node.unique
            const triggers = this.graph.__node.state.triggers[unique]
            if (states.value.sub !== undefined) {
                const trigger = triggers[states.value.sub]
                console.error('To Update Trigger', value, trigger)
            }
        } else {
            console.error('No Node Found', states)
        }

        if (key) states[key] = value

    }

    #updateSelectElement = (info) => {

        const configuration = info.configuration
        const value = configuration.value
        const el = info.el
        if (el.children.length) Array.from(el.children).forEach(c => c.remove())

        // Create grayed out selection
        const option = document.createElement('option')
        option.value = ''
        option.innerText = 'N/A'
        option.selected = true
        option.disabled = true
        el.appendChild(option)

        const opts = [...info.options]
        if (info.includeOutput) opts.unshift('__output')



        opts.forEach(key => {
            const option = document.createElement('option')
            if (key === value) option.selected = true
            option.value = key
            option.innerText = key
            el.appendChild(option)
        })

        if (configuration.onchange) el.onchange = configuration.onchange

    }
}