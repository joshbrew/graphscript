import { checkPerformance } from './utils/index'
import { Graph } from "../src/core/Graph";
import tree from '../examples/graph/tree'
import { nTimes } from './global';
import { deep } from './utils/clone/index';

const trees = Array.from({length: nTimes}).map(() => deep(tree)) // Pre-generate trees to avoid performance hit of generating them

export const instantiate = async () => {
    return checkPerformance((i) => {
        let graph = new Graph({
            roots: trees[i],
        });
        return graph
    }, nTimes, (graph) => {
        graph.clearListeners()
    })
}


const listenerTree = deep(tree)
export const listen = async () => {
    let graph = new Graph({
        roots: listenerTree,
    });

    return checkPerformance(async () => {
        const res = graph.get('nodeA').jump();
        // console.warn('Got', res)
    }, nTimes)
}