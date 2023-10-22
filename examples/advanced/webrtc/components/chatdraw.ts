import { OneWaySessionProps, SessionUser, SharedSessionProps } from '../../../../src/services/sessions/sessions.service'
import './canvasdraw/CanvasWithControls' //setup the canvas-with-controls component
import { CanvasWithControls } from './canvasdraw/CanvasWithControls';

//@ts-ignore
import html from './chatdraw' 

export function makeChatDrawBlock(
    parentId:string, 
    user:SessionUser, //the user doing the drawing
    session:SharedSessionProps|OneWaySessionProps //the session we are syncing the canvas over
) {
    const parent = document.getElementById(parentId) as HTMLElement;
    
    parent.insertAdjacentHTML('beforeend', html);
    /*
        when canvas draw updates, 
        set user data with updated pixels, 
        session update runs, clear updated pixels,
        when session updates, propagate updates to user's screen. 
        User inputs and server inputs are asynchronous
    */
    const drawElm = parent.getElementsByTagName('canvas-with-controls')[0] as CanvasWithControls;

    let ondraw = (
        pix:{
            x:number,
            y:number,
            color:string,
            lineWidth:number,
            //for lines
            lastX?:number, 
            lastY?:number,
            isLineDrawingMode:boolean
        }
    ) => {
        if(!user.draws) {
            user.draws = [] as any[];
        }
        user.draws.push(pix);
    } //clear user.draws in the userUpdateLoop onupdate (2nd arg when calling the loop)

    drawElm.ondraw = ondraw;

    return {
        parent,
        drawElm
    };
}
