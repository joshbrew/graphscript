import { checkPerformance } from '../utils/index'
import { clone } from '../../../js/packages/core/index'
import { Graph } from "../../../../graphscript/Graph";
import tree from '../../../../graphscript/examples/graph/tree'
import { nTimes } from '../global';

const trees = Array.from({length: nTimes}).map(() => clone(tree)) // Pre-generate trees to avoid performance hit of generating them

export const instantiate = async () => {
    return checkPerformance((i) => {
        let graph = new Graph({
            roots: trees[i],
        });
        return graph
    }, nTimes)
}


const listenerTree = clone(tree)
export const listen = async () => {
    let graph = new Graph({
        roots: listenerTree,
    });

    return checkPerformance(async () => {
        const res = graph.get('nodeA').jump();
        // console.warn('Got', res)
    }, nTimes)
}