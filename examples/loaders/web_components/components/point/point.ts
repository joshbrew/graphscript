
//@ts-ignore
import style from './point.css'; //in esbuild, set loader:{'.css':'text' }
//@ts-ignore
import html from './point.html'; //add to loader: {...'.html':'text'}

export class PointHTML {

    tagName='interactive-point';
    
    __template = html;
    __css = style;

    __onconnected = function() {
        //console.log(this);
    };

}