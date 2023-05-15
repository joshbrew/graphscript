import {Graph, GraphNode, wchtmlloader} from '../../../index'
import { NodeHTML } from './components/node/node';

new Graph({
    roots:{
        draggable: NodeHTML,
        other: NodeHTML
    },
    loaders:{
        wchtmlloader
    }
});