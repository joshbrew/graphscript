import WebComponent from "../../../WebComponent";
import { Node } from "../Node";
export const isListenerPort = (key) => !!key.match(/\[Function_[[0-9]+]/) // TODO: Register in standards somewhere...

import style from './styles.css'

export const isPrivate = (key) => key[0] === '_' // NOTE: Is redeclared from common/standards.js

export type PortProps = {
  // tree: {[x:string]: any}
  // plot?: Function[],
  // onPlot?: Function
  // preprocess?: Function,
  tag: string
  node: Node,
  value?: any,
  type?: 'properties' | 'children' | 'default'
}


export class Port extends WebComponent {


  node: PortProps['node']
  tag: PortProps['tag']
  type: PortProps['type']
  value: PortProps['value']

  element: HTMLDivElement
  output: HTMLDivElement
  input: HTMLDivElement


  resolving: boolean = false
  edges: Map<string, any> = new Map()

    constructor(port: PortProps, parentNode?: HTMLElement) {

        const tag = port.tag

        const html = `
          <div>
            <div id="input" class="port${isListenerPort(tag) ? ' hidden' : ''}"></div>
            ${tag}
            <div id="output" class="port"></div>
          </div>
          `
        
        super({
            __element: 'escode-port',
            __template: html,
            __css: style,
            parentNode
        })

        this.node = port.node
        this.tag = tag
        this.value = port.value
        this.type = port.type ?? 'properties'

        this.connect(
          this, 
          // this.node.editor.graph
        )
    }

    // updated(changedProperties) {
    //   this.element = this.shadowRoot.querySelector("div")
    //   if (!this.node) this.node = (this.parentNode.parentNode.parentNode as any).host
    // }

    setEdge = (edge) => {
      this.edges.set(edge.id, edge)
      this.node.setEdge(edge) // Nodify node
    }

    deleteEdge = (id) => {
      this.edges.delete(id)
      this.node.deleteEdge(id) // Nodify node
    }

    resolveEdge = async (ev) => { 
        if (!this.resolving){
          this.resolving = true
          const type = (ev.path[0].classList.contains('input')) ? 'input' : 'output'
          if (this.node.workspace) await this.node.workspace.resolveEdge({[type]: this}).catch(e => console.warn(`[escode]: ${e}`))
          this.resolving = false
        }
    }

    onmousedown = this.resolveEdge

    onmouseup = (ev) => {
      const maybeEdge = this.node.workspace.editing
      if (
        'node' in maybeEdge 
        && 'box' in maybeEdge 
        && 'svgInfo' in maybeEdge
      ) this.resolveEdge(ev)
    }
    

}