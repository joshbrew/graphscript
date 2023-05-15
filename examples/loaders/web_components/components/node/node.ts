import { makeDraggable } from "../draggable";
import { PointHTML } from "../point/point";

//@ts-ignore
import style from './node.css'; //in esbuild, set loader:{'.css':'text' }
//@ts-ignore
import html from './node.html'; //add to loader: {...'.html':'text'}

export class NodeHTML {

    tagName = 'graph-node';
    
    __template = '' // = html;
    __css = style;
    __components = {
        'custom-point-name': PointHTML
    }

    draggable=true;

    style = {
        position:'absolute',
        padding:'10px',
        display:'flex',
        borderRadius:'10%',
        backgroundColor:'lightblue',
        cursor:'pointer'
    };

    __onrender = function() {
        this.insertAdjacentHTML('beforeend', `
            <div>
                <div class="nodeheader">Drag ${this.__node.tag ?? 'Me'}!</div>
                <hr/>
                <div style="display:flex;">
                    <span style="width:12.5%"></span>
                    <span style="width:75%"></span>
                    <span style="width:12.5%">
                        <custom-point-name></custom-point-name>
                        <custom-point-name></custom-point-name>
                    </span>
                </div>
            </div>
        `)
    }

    __onconnected = function() {
        makeDraggable(this); //the htmlElement properties are bound to 'this' as well as 'this.__props' so you can manipulate the node directly
    };

    // __children={
    //     container:{
    //         __element:'div',
    //         __children:{
    //             header:{
    //                 __element:'div',
    //                 innerHTML:'Drag Me!',
    //                 className:'nodeheader'
    //             },
    //             ln:{__template:'<hr/>'},
    //             body:{
    //                 __element:'div',
    //                 style:{
    //                     display:'flex'
    //                 },
    //                 __children:{
    //                     inputs:{
    //                         __element:'span',
    //                         style:{
    //                             width:'12.5%'
    //                         }
    //                     },
    //                     content:{
    //                         __element:'span',
    //                         style:{
    //                             width:'75%'
    //                         }
    //                     },
    //                     outputs:{
    //                         __element:'span',
    //                         style:{
    //                             width:'12.5%'
    //                         },
    //                         __children:{
    //                             point:PointHTML,
    //                             point2:PointHTML
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // };

}