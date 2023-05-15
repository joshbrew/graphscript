import {Graph, Loader, GraphNodeProperties, Roots } from '../../../src/core/Graph'
import { loop } from '../../../src/loaders/index'


const roots = {
    
    loopNode:{
        __element:'div',
        innerHTML:`<div>Hello world!</div>`,
        __operator:function (){
            const message = `looped: ${performance.now().toFixed(1)}ms`;
            this.insertAdjacentHTML('beforeend',`<div>${message}</div>`)
            console.log(message);
            
            return true;
        },
        __node:{
            loop:1000, //note this doesn't result in perfect 1000ms loops due to how javascript prioritizes stuff, so it's only relative
            looping:true
        }
    } as GraphNodeProperties

} as Roots

let customHTMLLoader:Loader = (
    node,
) => {
    if(typeof node.__element == 'string') {
        node.__props = document.createElement(node.__element);
        if(node.__props instanceof HTMLElement) {
            for(const key in node) {
                node.__props[key] = node[key];
            }
            node.__proxyObject(node.__props);

            document.body.insertAdjacentElement('beforeend',node.__props)
        }
    }
}

const graph = new Graph({
    roots,
    loaders:{
        customHTMLLoader,
        loop //load order can matter depending on expected proxies etc like in this case
    }
});

