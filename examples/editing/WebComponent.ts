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

    connect = (properties: GraphNodeProperties, graph?: Graph) => {

        if (graph) {
            this.node = new GraphNode(properties, graph)
            this.__props = this.node.__props
        } else {
            const name =  properties.tag ?? properties.__node?.tag ?? 'escode-root'
            this.graph = new Graph({
                roots: { [name]: properties },
                loaders: { wchtmlloader }
            })
    
    
            const rootNode = this.graph.get(name)
            this.__props = rootNode.__props
    
        }

        return this.node
    }

}

export default WebComponent