import {
    Router,
    WorkerService,
    DOMService,
    workerCanvasRoutes,
    WorkerCanvas,
    WorkerCanvasControls,
} from '../../index'//'graphscript'
import { ElementProps } from '../../services/dom/types/element';

import gsworker from './worker'

const workers = new WorkerService();

const router = new Router({
    services:{
        DOMService,
        workers,
        workerCanvasRoutes
    }
});

console.log(router);

let ret = router.setTree({
    'main':{
        tagName:'div',
        __children:{
            'div':{
                tagName:'div',
                innerText:'Multithreaded canvases!'
            } as ElementProps,
            'canvas':{
                tagName:'canvas',
                style:{width:'100%',height:'100%'},
                onrender:(elm,info)=>{
                    const renderer = workers.addWorker({url:gsworker});
                    info.worker = renderer;

                    //console.log(renderer);

                    if(renderer) {
                        console.log('renderer', renderer)
                        const controls:WorkerCanvasControls = router.run(
                            'transferCanvas', 
                            renderer.worker, 
                            {
                                canvas:elm,
                                context:'2d',
                                _id:elm.id,
                                init:(self:WorkerCanvas,canvas,context)=>{ //init called automatically before first draw
                                    console.log('canvas', canvas)
                                    canvas.addEventListener('mousedown',(ev)=>{
                                        console.log('clicked!', ev, canvas);
                                    })
                                },
                                draw:(self:WorkerCanvas,canvas:any,context:CanvasRenderingContext2D)=>{ //render loop starts automatically
                                    context.clearRect(0,0,canvas.width, canvas.height);
                                    
                                    context.fillStyle = `rgb(0,${Math.sin(Date.now()*0.001)*255},${Math.cos(Date.now()*0.001)*255})`;
                                    context.fillRect(0,0,canvas.width,canvas.height);
                                }
                            }
                        );
                    }
                },
                onremove:(elm,info)=>{
                    workers.terminate(info.worker._id);
                }        
            } as ElementProps      
        } 
    } as ElementProps
});

//console.log(ret)