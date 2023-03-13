import {Graph, wchtmlloader} from '../../../../index'
import { NodeHTML } from './components/node/node';

new Graph({
    roots:{
        draggable:NodeHTML
    },
    loaders:{
        wchtmlloader
    }
});