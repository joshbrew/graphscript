import { Graph, GraphNodeProperties, Roots } from "../../../src/core/Graph";
import { dragElement } from "./draggable";

//this example demonstrates using nodes as a proxy
let roots = {

    htmlNode:{
        __props:document.createElement('div'), //proxy this object

        draggable:true,
        innerHTML:`
        <div style=" text-align:center; position: absolute; left: 50%; width:100%; top: 50%; transform: translate(-50%, -50%);">
            Drag Me!
        </div>`,

        __onconnected:function() {

            const element = this.__props as HTMLElement;
            const style = element.style as CSSStyleDeclaration;
            style.position = 'absolute';
            style.height = '120px'
            style.flex = 'flex';
            style.width = '120px';
            style.borderRadius = '50%';
            style.backgroundColor = 'lightblue';
            
            style.cursor='move';

            dragElement(this); //the htmlElement properties are bound to 'this' as well as 'this.__props' so you can manipulate the node directly

            document.body.appendChild(element);
        },

        __ondisconnected:function() {
            const element = this.__props as HTMLElement;
            document.body.removeChild(element);
        }

    } as GraphNodeProperties

} as Roots;


let graph = new Graph({
    roots
});

console.log('Graph instance:', graph);

//now we can play with the proxy
let node = graph.get('htmlNode');

node.style.top = '50%';
node.style.left = '50%';





