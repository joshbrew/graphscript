import { makeDraggable } from "./draggable";

//@ts-ignore
import style from './node.css'; //in esbuild, set loader:{'.css':'text' }
//@ts-ignore
import html from './node.html'; //add to loader: {...'.html':'text'}

export class NodeHTML {

    tagName='graph-node';
    
    __template = html;
    __css = style;

    draggable=true;

    style={
        position:'absolute',
        height:'60px',
        flex:'flex',
        width:'120px',
        borderRadius:'10%',
        backgroundColor:'lightblue',
        cursor:'pointer'
    };

    __onconnected = function() {
        console.log(this);
        makeDraggable(this); //the htmlElement properties are bound to 'this' as well as 'this.__props' so you can manipulate the node directly
    };

}