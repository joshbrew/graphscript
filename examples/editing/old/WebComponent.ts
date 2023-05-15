import { Graph, GraphNode, GraphNodeProperties } from "../../src/core/Graph";
import { wchtmlloader } from '../../src/loaders/html/wc.loader';

export class WebComponent {

    [x: keyof GraphNodeProperties]: GraphNodeProperties[keyof GraphNodeProperties]

    node: GraphNode
    useShadow = true


    constructor(properties: GraphNodeProperties) {

        // ----------------- Handle Web Component Properties -----------------
        Object.assign(this, properties);
    }

    connect (properties: GraphNodeProperties, graph?: Graph, parent?: GraphNode) {

        if (graph) {
            const node = graph.add(properties, parent)
            if (node) {
                this.node = node
                this.__props = this.node.__props
            } else console.error('Could not add node to graph', properties)
        } else {
            this.graph = new Graph({
                properties,
                loaders: { wchtmlloader }
            })    

            this.node = this.graph.get(this.graph.__node.tag)
        }

        this.__props = this.node.__props

        return this.node
    }

}

export default WebComponent