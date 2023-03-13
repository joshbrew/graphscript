import { Graph, GraphNode, GraphNodeProperties } from "../../../src/core/Graph"
import { WebComponent } from "../WebComponent";
import style from './styles.css'
import html from './index.html'
import context from "./context";
import { Node, NodeProps } from "./node/Node";
import { Listener } from "./listener/Listener";
import drag from './utils/drag'

export default class Editor extends WebComponent {



    // GraphScript Behaviors
    __onrender = (el) => {

        // ------------------------- Track Elements from the Template -------------------------
        const grid = el.shadowRoot.querySelector('#grid')
        console.error('HAS RENDERED', grid)

        this.elements = { grid }

        // ------------------------- Handle Events -------------------------
        el.addEventListener('mousedown', e => { 
            this.context.start = { x: e.clientX - this.context.point.x, y: e.clientY - this.context.point.y };
            this.mouseDown = true
        })

        window.addEventListener('mouseup', e => { this.mouseDown = false} )
        el.addEventListener('wheel', this.scale)
        el.addEventListener('mousemove', this.pan)

        const rect = grid.getBoundingClientRect()

        this.middle = {
          x: rect.width / 2,
          y: rect.height / 2
        }
  
    }

    // UI Editing
    context: {
        zoom: number,

        minZoom: number,
        maxZoom: number,

        start: {
            x: number,
            y: number
        },
        point: {
            x: number,
            y: number
        }
    } = {
        zoom: 1,
        minZoom: 0.6 / window.devicePixelRatio,
        maxZoom: 3.0,
        start: {x: 0, y: 0},
        point: {x: 0, y: 0}

    }
    editing: HTMLElement | null = null
    mouseDown:boolean = false
    #loaded: boolean = false

    nodes: Map<string, Node> = new Map()
    listeners: Map<string, Listener> = new Map()
    toResolve: Function[] = []

    // GraphScript Management
    graphs: {
        context: Graph
        active: Graph | GraphNode
    }

    // listeners: any = {}
    ui?: Element

    #selectElements: any = []

    propertiesToSubscribe: Set<string> = new Set()
    nodePaths: Set<string> = new Set()

    #fIter = 0

    elements: {
        context?: Element,
        create?: Element,
        grid: HTMLElement
    }

    constructor (graph, parentNode?: GraphNodeProperties['parentNode']) {

        // -------------- Create a Hidden Internal Graph --------------
        super({
            __element: 'escode-editor',
            __template: html,
            __css: style,
            parentNode
        })

        // this.graph = new Graph({ root: this })

        this.connect(this)

        // -------------- Setup Keyboard Shortcuts --------------
        document.onkeydown = (e) => {
            if (e.ctrlKey && e.code == 'KeyS') {
                e.preventDefault()
                console.error('Save not defined...')
                // app.save() // Global save.
            }
        };

         // Set graphs blank if not defined
         const contextGraph = new Graph()
         this.graphs = { context: contextGraph, active: contextGraph }
        // -------------- Set Context Graph --------------
        this.set(graph ?? contextGraph)

        this.createContextMenu()
    }

    createContextMenu = () => {
                    // ---------------------------------------------------------------------------------------------------------
            // ------------------------------------- Setting Context Menu Response -------------------------------------
            // ---------------------------------------------------------------------------------------------------------

            if (!context.parentNode) document.body.appendChild(context.__props)

            // Setting Context Menu Responses
            context.set(`escode-graph-editor_nodes_${Math.random()}`, {
              condition: (path) => {
                  let returned: any = false
                  this.nodes.forEach(n => {
                    if (path.includes(n.__props)) returned = n
                  })
                  return returned
                },
              contents: () => {
                return [
                  {
                    text: 'Delete',
                    onclick: (_, node) => {
                      this.removeNode(node)
                  }
                }
                ]
                
              }
            })


            context.set(`escode-graph-editor_${Math.random()}`, {
              condition: (path) => path.includes(this.__props),
              contents: (ev) => {
                return [
                  {
                    text: 'Add Component',
                    onclick: async () => {

                    const grid = this.elements.grid
                    if (grid) {
                      var rect = grid.getBoundingClientRect();
                      var x = ev.clientX - rect.left; //x position within the element.
                      var y = ev.clientY - rect.top;  //y position within the element.
                      

                      console.error('Cannot add a component!')
                    //   // Blur the Background
                    //   const overlay = new Overlay()

                    //   // Create a Modal
                    //   const modal = new Modal({open: true, header: 'Components', footer: '<small>All ES Components can be found on the <a href="https://github.com/brainsatplay/escode/blob/main/components">ESCode</a> repository.</small>'})
                    //   overlay.appendChild(modal)

                    //   modal.onClose = () => {
                    //     overlay.open = false
                    //   }

                    //   // Show Node Options in a List
                    //   const result = await new Promise((resolve) => {

                    //     const list = new Tree({
                    //       target: this.plugins,
                    //       conditions: {
                    //         value: (o) => !!o.__ // Check if a component
                    //       },
                    //       onClick: (tag, thing:any) => {
                    //         resolve({tag, info: Object.assign({}, thing)}) // Copying thing so that it doesn't get modified globally
                    //        } // pass a shallow copy onwards
                    //     })
                    //     modal.appendChild(list)
                    //     document.body.appendChild(overlay)
                    //     // this.workspace.parentNode.appendChild(overlay)
                    //     overlay.open = true
                        
                    //   }) as any // TODO: Add ES Component types...

                    //   // Add essential info
                    //   const info = result.info

                    //   const tag = `${result.tag}_${Math.floor(1000*Math.random())}` // generate tag from plugin

                    //   // extend info for escode
                    //   delete info?.__escode // delete existing instance-specific info

                    //   this.workspace.addNode({ tag, info, x, y })
                    //   modal.open = false
                    //   overlay.open = false
                    }
                  },
                },
                //    {
                //     text: 'Do another thing',
                //     onclick: () => {
                //       console.warn('MUST DO SOMETHING')
                //   }
                // }
                ]
              }
            })
    }


    // Set Graph on the Editor and React to Listeners 
    set = (graph: Editor['graphs']['context']) => {
        if (graph) {
            
            this.graphs.context = graph
            this.setActive(graph)

            const nodes = Array.from(graph.__node.nodes.values())

            this.nodePaths = new Set(nodes.map(o => o.__node.tag))
            this.propertiesToSubscribe = new Set(this.nodePaths)

            nodes.forEach(o => {
                const listeners = o.__listeners
                if (listeners) {
                    for (let key in listeners) this.#onListenerAdded(key, listeners[key], o)
                }
            })
        } else {
            this.listeners = new Map()
        }
    } 

    setActive = (node: Editor['graphs']['active']) => {
        this.#loaded = false
        const active = this.graphs.active = node
        const nodes = active.__node.nodes as Editor['graphs']['active']['__node']['nodes']

        nodes.forEach((n,key) => {
            let gN = this.nodes.get(n.__node.tag);

            if (!gN){
              gN = this.addNode({
                tag: key,
                info: n,
                editor: this
              })
            }
        })

    //     for (let key in this.graph.edges) {
          
    //       let nodeEdges = this.graph.edges[key]

    //       // String shortcut
    //       if (typeof nodeEdges === 'string') nodeEdges = {[nodeEdges]: true}

    //       for (let targetKey in nodeEdges) {
    //         const info = nodeEdges[targetKey]
    //         const output = (this.edgeMode === 'from') ? this.match(key) : this.match(targetKey, info)
    //         const input = (this.edgeMode === 'from') ? this.match(targetKey, info) : this.match(key)

    //       const edges = {}

    //       // Don't duplicate on construction
    //       const outTag = output.port.tag
    //       if (!edges[outTag]) edges[outTag] = []
    //       if (!edges[outTag].includes(input.port.tag)){

    //         await this.resolveEdge({
    //           info,
    //           input: input.port,
    //           output: output.port
    //         });    

    //         edges[outTag].push(input.port.tag)
    //       }   

    //     }
    //   }
          //   } 
          



            // ---------------------- Auto Layout New Nodes ---------------------- //
            let notMoved: any[] = []
            this.nodes.forEach((node) => {
                if (node.info.__escode) {
                    const info = node.info.__escode;
                    if (info.x === 0 && info.y === 0) notMoved.push(node); 
                    else notMoved.push(node);
                }
            });

            console.log('Layouting...', this.nodes,notMoved)
            this.autolayout(notMoved)
            this.#transform() // Move to center
            this.#loaded = true
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

            // Show context Listeners
            const context = document.createElement('div')
            context.id = 'context'
            const contextHeader = document.createElement('h3')
            contextHeader.innerText = 'context Listeners'
            context.appendChild(contextHeader)
            this.ui.appendChild(context)
            this.elements.context = context

            // Add all listeners to the UI
            for (let bound in this.listeners) {
                for (let key in this.listeners[bound]) this.listeners[bound][key].forEach(value => this.#addListenerToUI(key, value, bound))
            }
        }
    }

    // -------------- Internal Event Managers --------------
    #onListenerAdded = (key, value, bound) => {

        bound = (typeof bound !== 'string') ? bound.__node.tag : bound
        if (!this.listeners[bound]) this.listeners[bound] = {}
        if (!this.listeners[bound][key]) this.listeners[bound][key] = []
        this.listeners[bound][key].push(value)     
        
        if (this.ui) this.#addListenerToUI(key, value, bound)
    }

    #onListenerRemoved = (key, value, bound) => {
        console.error('Remove Listener from UI' , key, value, bound)
    }
    


    // ----------------------------------------------------------- //
    // ----------------- Ugly UI Management Code ----------------- //
    // ----------------------------------------------------------- //

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

        button.style.position = 'absolute'
        button.style.top = '0'
        button.style.right = '0'

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

        this.elements.context?.appendChild(info.element)
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
        const node = this.graphs.active.__node.nodes.get(states.from)
            if (node) {
            const unique =node.__node.unique
            const triggers = this.graphs.active.__node.state.triggers[unique]
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
        const el = info.el as HTMLSelectElement
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


    // // Events
    // onedgeadded?: (edge:GraphEdge) => void = () => {}
    // onedgeremoved?: (edge:GraphEdge) => void = () => {}
    // onnodeadded?: (node:GraphNode) => void = () => {}
    // onnoderemoved?: (node:GraphNode) => void = () => {}

    drag = (item: GraphNode | any) => {
        // add drag handler
        drag(this, item, () => {
            this.resize([item])
        }, () => { 
            if (!this.editing) this.editing = item
        }, () => {
            if (this.editing instanceof Node) this.editing = null
        })
    }

    resize = (nodes = Array.from(this.nodes.values())) => {
        nodes.forEach(node => node.edges.forEach(e => e.resize()))
    }

// Currently laying out nodes in a rough square with more nodes in the columns
autolayout = (nodes: Map<string, Node> | Node[] = this.nodes) => {
    let offset = 50

    nodes = (nodes instanceof Map ? Array.from(nodes.values()) : nodes) as Node[]

    let nPerRow = Math.floor(Math.sqrt(nodes.length))

    let rowSizes: any[] = []
    let colSizes: any[] = []
    let info: any[] = []

    nodes.forEach((n, i) => {

        const col = i % nPerRow
        const row = Math.floor(i/nPerRow)

        const dimensions = [
        {
            value: col,
            sizes: colSizes,
            dimension: 'height'
        },
        {
            value: row,
            sizes: rowSizes,
            dimension: 'width'
        }
        ]

        console.warn('Get', n, n.__props)
        const rect = n.__props.getBoundingClientRect()
        info.push({
            rect,
            col,
            row
        })

        dimensions.forEach(o => {
            let isNew = false
            if (o.sizes[o.value] === undefined) {
                isNew = true
                o.sizes[o.value] = 0
            }

            o.sizes[o.value] += rect[o.dimension]
            if (!isNew) o.sizes[o.value] += offset
        })

    })

    // Set top-left viewport location
    const width = this.context.point.x = rowSizes.length ? Math.max(...rowSizes) : 0
    const height = this.context.point.y = colSizes.length ?  Math.max(...colSizes) : 0

    // Actually move nodes
    let rowAcc: any[] = []
    let colAcc: any[] = []
    nodes.forEach((n, i) => {
        const nInfo = info[i]

        if (colAcc[nInfo.col] === undefined) colAcc[nInfo.col] = 0
        else colAcc[nInfo.col] += offset
        
        if (rowAcc[nInfo.row] === undefined) rowAcc[nInfo.row] = 0
        else rowAcc[nInfo.row] += offset

        const x = this.middle.x  + colAcc[nInfo.col] - width // Set Column
        const y = this.middle.y  + rowAcc[nInfo.row] - height // Set Row
        n.updatePosition(x, y)
        
        // Update with Shift
        rowAcc[nInfo.row] += nInfo.rect.height
        colAcc[nInfo.col] += nInfo.rect.width
    })


    }

    // Behavior
    scale = (e) => {
      e.preventDefault()
      let xs = (e.clientX - this.context.point.x) / this.context.zoom;
      let ys = (e.clientY - this.context.point.y) / this.context.zoom;
      let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
      this.context.zoom = (delta > 0) ? (this.context.zoom * 1.2) : (this.context.zoom / 1.2);
      if (this.context.zoom < this.context.minZoom) this.context.zoom = this.context.minZoom // clamp
      if (this.context.zoom > this.context.maxZoom) this.context.zoom = this.context.maxZoom // clamp


      this.context.point.x = e.clientX - xs * this.context.zoom;
      this.context.point.y = e.clientY - ys * this.context.zoom;

      this.#transform()
  }

    #transform = () => {
      const grid = this.elements.grid
      if (grid) grid.style['transform'] = `translate(calc(-50% + ${this.context.point.x}px), calc(-50% + ${this.context.point.y}px)) scale(${this.context.zoom*100}%)`
    }
    


    pan = (e) => {

      // e.preventDefault();

      if (!this.editing){

        if (e.target.parentNode){

            // Transform relative to Parent
            let rectParent = e.target.parentNode.getBoundingClientRect();
            let curXParent = (e.clientX - rectParent.left)/rectParent.width; //x position within the element.
            let curYParent = (e.clientY - rectParent.top)/rectParent.height;  //y position within the element.
        
            if (this.mouseDown){

                this.context.point.x = (e.clientX - this.context.start.x);
                this.context.point.y = (e.clientY - this.context.start.y);
                this.#transform()
            } 
            this.relXParent = curXParent
            this.relYParent = curYParent
          }
        }
    }


    // ---------------------- Add Nodes and Listeners ---------------------- //
    removeNode = (node: string | Node) => {
        node = ((typeof node === 'string') ? this.nodes.get(node) : node) as Node
  
        if (
          this.onnoderemoved instanceof Function // callback is a function
          ) this.onnoderemoved(node)
  
  
        // update ui
        node.deinit(false)
        this.nodes.delete(node.tag)
  
      }
  
      addNode = (props: NodeProps) => {
  
        if (!props.editor) props.editor = this
   
        // shift position to the middle
        if (props.info?.__escode?.x) props.x = props.info.__escode.x
        if (props.info?.__escode?.y) props.y = props.info.__escode.y

        console.log('This', this.elements, this.elements?.grid, this)
        // Only run autolayout after UI has rendered
        const gN = new Node(props, this.elements.grid)

        this.nodes.set(gN.tag, gN)

        if (this.onnodeadded instanceof Function) this.onnodeadded(gN)
        console.log('done...', gN.tag)
        
        return gN
      }

    resolveEdge = async (info, willAwait=true) => {

        if (this.editing?.tagName === 'escode-listener') {
            const component = this.editing as any as Listener // TODO: Fix this
            await component.link(info)
            return component
        } else {
  
          const tempId = `${Math.round( 10000 * Math.random())}`
          const edge = new Listener({editor: this, ...info}, this.elements.grid)
          this.editing = edge.graph.__props
  
          this.edges.set(tempId, edge) // Place temp into DOM to trigger edge.rendered
    
          edge.ready.then(res => {
            if (res){
              this.edges.delete(tempId)
              this.edges.set(edge.id, edge)
              edge.resize()
            }
          }).catch(() => {})
  
          if (willAwait) await edge.ready // Wait until the edge is complete
  
          this.editing = null
          return edge
        } 
      }


   match = (route:string, edgeInfo: any = {}) => {

    let tags = route.split('.')
    let match = this.nodes.get(tags[0]);

    if (!match) throw new Error('Node not found: ' + route)

    // If no port name, choose between operator and default
    const portName = (tags.length === 1) ? (match.info.__operator ? '__operator' : 'default') : tags.slice(1).join('.'); // fallback to default port

    tags.forEach(t => {
      const temp = this.nodes.get(t)
      if (temp) match = temp
    })

    let port;
    try {
      port = match.ports.get(portName);
      if (!port) {
        // alert('Port not found: ' + route)
        port = match.addPort({tag: portName, node: match, value: edgeInfo.target})
      }
    } catch (e) {
      console.error('failed to get port', e, route, this.nodes)
    }
    
    return {
      port,
      match
    }
}
  
}