import { GraphNode, Graph, GraphNodeProperties } from "./Graph";
/**
 * setting nodeA._node.backward:true propagates operator results to parent
 */
export declare const backprop: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
/**
 *
 * Specify a timer loop, will stop when node is popped or nodeA._node.isLooping is set false
 * nodeA._node.loop = 100 will loop the operator every 100 milliseconds
 *
 * Or
 * nodeA._node.delay will delay the operator by specified millisecond number and resolve the result as a promise
 * nodeA._node.frame will use requestAnimationFrame to call the function and resolve the result as a promise
 *
 * Use in combination with:
 * nodeA._node.repeat will repeat the operator the specified number of times
 * nodeA._node.recursive will do the same as repeat but will pass in the previous operator call's results
 *
 *
 */
export declare const loop: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
/** Animations
 *
 * nodeA._node.animate = true | () => void, to run the operator or a specified animation function on loop
 *
 */
export declare const animate: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
/** Branching operations
 *
 * nodeA._node.branch = {[key:string]:{if:Function|any, then:Function|any|GraphNode}}
 *
 * nodeA._node.listeners['nodeB.x'] = {
 *  callback:(result)=>void,
 *  branch:{if:Function|any, then:Function|any|GraphNode}
 * }
 *
 */
export declare const branching: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
/** Trigger listeners oncreate with specific arguments
 *
 *  nodeA._node.listeners['nodeB.x'] = { callback:(result)=>void, oncreate:any }
 *
 */
export declare const triggerListenerOncreate: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
/** Trigger listeners oncreate with specific arguments
 *
 *  nodeA._node.listeners['nodeB.x'] = { callback:(result)=>void, binding:{any} }
 *
 */
export declare const bindListener: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
/**
 *
 *  nodeA._node.listeners['nodeB.x'] = { callback:(result)=>void, transform:(result)=>any }
 *
 */
export declare const transformListenerResult: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
export declare const substitute_operator: (node: GraphNode & GraphNodeProperties, parent: GraphNode | Graph, graph: Graph) => void;
export declare const loaders: {
    backprop: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    loop: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    animate: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    branching: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    triggerListenerOncreate: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    bindListener: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    transformListenerResult: (node: GraphNode, parent: GraphNode | Graph, graph: Graph) => void;
    substitute_operator: (node: GraphNode & GraphNodeProperties, parent: GraphNode | Graph, graph: Graph) => void;
};
