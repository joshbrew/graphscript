import { Graph, GraphNode, GraphNodeProperties } from "../../Graph2"

export default (
    node:GraphNode,
) => {
    if (node.__properties.__props) node.____apply(node.__properties.__props, true)
}