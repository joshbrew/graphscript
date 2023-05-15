import {parseFunctionFromText} from '../services/utils'

export function methodstrings (node) {
    if(typeof node.__methods === 'object') {
        for(const key in node.__methods) {
            let fstr = node.__methods[key];
            let fn = typeof fstr === 'function' ? fstr : parseFunctionFromText(fstr);
            if(key === '__operator') {
                node.__setOperator(fn as any);
            }
            else {
                node[key] = fn.bind(node);
            }
        }
    }
}