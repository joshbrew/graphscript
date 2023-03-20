import { GraphNode, GraphNodeProperties } from "../../../../src/core/Graph";
import WebComponent from "../../WebComponent";
import Editor from "../Editor";
import { Listener } from "../listener/Listener";
import { PortProps, Port } from "./port/Port";

import style from './styles.css'

export const isPrivate = (key) => key[0] === '_' // NOTE: Is redeclared from common/standards.js

  export type NodeProps = {
    editor: Editor
    x?: number;
    y?: number;
    tag?: string,
    info: GraphNode; // Add ES Component types...

    __onrender?: GraphNodeProperties['__onrender']
  }
  
  

export class Node extends WebComponent {

    // workspace: GraphNodeProps['workspace'];
    tag: string;
    x: number = 0;
    y: number = 0;
    info: NodeProps['info'];
    edges: Map<string, Listener> = new Map()
    ports: Map<string, Port> = new Map()
    portCategories: {
      properties: Map<string, Port>,
      components: Map<string, Port>,
      default: Map<string, Port>,
    } = {
      properties: new Map(),
      components: new Map(),
      default: new Map(),
    }

    editor: Editor
    portOrder = ['default', 'components', 'properties']

    elements: {
        main: HTMLDivElement
    }


    __onrender(el) {
        this.elements = { main: (el.shadowRoot ?? el).shadowRoot.querySelector('#ports') }
        if (this.info) this.updatePorts()

        // if (!this.editor) this.editor = (this.parentNode.parentNode as any).host
  
        // add drag handler
        this.editor.drag(this)
  
        this.edges.forEach(e => e.resize()) // resize all edges after
    }

    constructor(node: NodeProps, parentNode?: HTMLElement) {

        const html = `
            <div>
                <div id="header">
                    ${node.tag}
                </div>
                <div id="ports"></div>
            </div>
        `
        
        super({
            __element: 'escode-node',
            __template: html,
            __css: style,
            // useShadow: true,
            parentNode
        })

        // if (node.__onrender) {
        //     const onrender = this.__onrender
        //     this.__onrender = (el) => {
        //         onrender(el) // Old onrender
        //         node.__onrender(el)
        //     }
        // }


        this.editor = node.editor
        this.info = node.info
        if (!this.info.__escode) this.info.__escode = { x: 0, y:0 } // Save ESCode Properties

        this.tag = this.info.__node.tag
        this.id = this.info.__node.unique

        this.info.__escode.x = this.x = node.x ?? this.info.__escode.x ?? 0
        this.info.__escode.y = this.y = node.y ?? this.info.__escode.y ?? 0

        this.connect(
            this, 
            this.editor.graph
        )

    }

    updatePosition (x, y) {
        if (x !== undefined) this.x = x
        if (y !== undefined) this.y = y
        this.__props.style.transform = `translate(${this.x}px, ${this.y}px)`
    }
    
    setNode (info) {
        this.info = info
        this.updatePorts(info)
    }
  
      async updatePorts(info=this.info) {
  
        const notify = (tag, value, type) => {
          const got = this.portCategories[type].get(tag)
  
            if (got === value) console.warn('Redeclared port: ', `${this.tag}.${tag}`)
            else {
              console.error('Port conflict: ', `${this.tag}.${tag}`)
            }
        }
        
        const type = 'properties'
        Object.keys(info).forEach(tag => {
          if (tag.slice(0,2) === '__') return // no __ special properties
          if (isPrivate(tag)) return // no underscore (pseudo-private) properties
  
          let thisType = type
          if (tag === 'default' || tag === '__operator') thisType = 'default'
          if (this.portCategories[thisType].has(tag)) {
            notify(tag, this.ports.get(tag), thisType)
            return
          }
          this.addPort({ tag, node: this, type: thisType as 'properties' || 'default'})
        })
  
        // Add Port for Each Active ES Component instance (i.e. the internal graph)
        const components = info.__children as {[x:string]: GraphNode}
        if (components) {
            const type = 'children'
            Object.keys(components).forEach((tag) => {
            if (this.portCategories[type].has(tag)) {
              notify(tag, this.ports.get(tag), type)
              return
            }
            this.addPort({ tag, type, node: this })
          })
        }
  
      }
  
      willUpdate (updatedProps) {
  
        if ((updatedProps.has('x') || updatedProps.has('y')) && this.info.__escode){
          this.info.__escode.x = this.x        // brainsatplay extension
          this.info._escode.y = this.y       // brainsatplay extension
        }
  
        if (updatedProps.has('info')) this.updatePorts()
      }
  
  
      setEdge (edge) { this.edges.set(edge.id, edge) }
  
      deleteEdge(id) {
        this.edges.delete(id)
      }
  
      addPort (info: PortProps) {

        const type = info.type ?? 'default'

        let ports = this.elements[type]
  
        if (!ports) {
          this.elements[type] = ports = document.createElement('div')
          ports.id = `${info.type}Ports`
  
          const idx = this.portOrder.findIndex(str => str === info.type)
          const beforeChild = this.elements.main.children[idx]
          if (beforeChild) this.elements.main.insertBefore(ports, beforeChild);
          else this.elements.main.appendChild(ports)
        }

        const category = this.portCategories[type] ?? this.portCategories.default // Set in type-specific registry

        const port = new Port({ ...info, node: this}, ports)
        this.ports.set(port.tag, port)
        category.set(port.tag, port)
  
          
        return port
      }
  
      deinit (triggerInWorkspace = true) {
        if (triggerInWorkspace) this.editor.removeNode(this)
        this.edges.forEach(e => e.deinit()) // Remove edges
        this.remove()
      }

}