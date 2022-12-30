
export const isNode = typeof process === 'object'

const elId = `escomposeOperationsManagerLog`

const document = globalThis.document

globalThis.escodeDemoLog = true

if (!isNode) {
    const ol = document.createElement('ol')
    ol.id = elId
    document.body.appendChild(ol)

    const style = document.createElement('style')
    style.innerText = `
        ol {
            position: absolute;
            top: 0;
            right: 0;
            font-size: small;
            margin: 0;
            padding: 0;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 10px;
            overflow: scroll;
            height: 100vh;
        }

        li {
            margin-left: 25px;
        }
    `
    document.body.appendChild(style)
}

// Maintain a list of the active states
export const log = {
    element: (isNode) ? undefined : document.getElementById(elId),
    add: function (message) {
        if (this.element) {
            var li = document.createElement('li');
            li.innerText = message;
            this.element.appendChild(li);
        } else if (globalThis.escodeDemoLog) console.log(message)
    },
    addCommand: function (message) {

        if (globalThis.escodeDemoLog) console.log(`--------- ${message} ---------`)
        if (this.element) {
            var li = document.createElement('div');
            li.innerText = message;
            li.style.fontWeight = 'bold';
            this.element.appendChild(li);
        }
    },
    addHeader: function (message) {
        if (globalThis.escodeDemoLog) console.log(`********* ${message} *********`)
        if (this.element) {
            var li = document.createElement('h3');
            li.innerText = message;
            this.element.appendChild(li);
        }
    },
}


export type OperationsType = (Function | {
    function: Function,
    name?: string,
    header?: string,
    ignore?: boolean
})[]

export type OperationsStart = Function


export type OperationsConfig = {
    operations?: OperationsType,
    start?: OperationsStart
}


export class OperationsManager {

    operations: OperationsType = []

    log = log
    
    step = 0
    #iterations = 0
    get iterations () {
        return this.#iterations
    }

    set iterations (val) {
        this.#iterations = val
        this.step = this.#iterations % this.operations.length
    }
    
    startFunction?: OperationsStart
    started = false

    returned: any = {}

    constructor(config: OperationsConfig = {}){
        this.set(config)
        // globalThis.onkeydown = (ev) => {
        //     const key = ev.key
        //     if (key === 'Enter') this.next()
        //     else if (key === ' ') this.runAll()
        // }
    }

    set(config: OperationsConfig = {}){
        if (Array.isArray(config)) this.setOperations(config)
        else {
            if ('start' in config) this.setStart(config.start)
            if ('operations' in config) this.setOperations(config.operations)
        }
    }


    start = (...args) => {
        if (this.started) {
            console.warn('Already started...')
            return this.returned
        } else {
            this.started = true
            if (this.startFunction)  {
                this.returned = this.startFunction.call(this, ...args)
                return this.returned
            }
        }
    }

    setStart(start){
        this.started = false
        this.startFunction = start
    }

    setOperations(operations: OperationsType = []) {
        this.operations = operations
    }


    runAll = () => {
        if (this.step === 0) this.next()

        let count = 0
        while (this.step > 0) {
            count++
            this.next()
        }
    }

    run = (command) => {
        if (!this.started) this.start()

        if (typeof command === 'function') command = {
            function: command,
            name: command.name
        }

        if (command) {
            if (command.ignore) return
            else {
                if (command.header) log.addHeader(command.header)
                if (command.name) log.addCommand(command.name)
                return command.function.call(this)
            }
        }
    }

    next = () => {
        const res = this.run(this.operations[this.step])
        this.iterations++
        return res
    }
}