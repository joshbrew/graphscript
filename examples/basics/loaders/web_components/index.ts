import {Graph, wchtmlloader} from '../graphscript/index'
import { NodeHTML } from './components/node/node';

new Graph({
    roots:{
        draggable:NodeHTML
    },
    loaders:{
        wchtmlloader
    }
});