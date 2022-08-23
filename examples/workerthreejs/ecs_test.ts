import {
    Router,
    WorkerService,
    DOMService,
    workerCanvasRoutes,
    WorkerCanvas,
    WorkerCanvasControls,
    WorkerInfo
} from '../../index'//'graphscript'
import { ElementProps } from 'graphscript/dist/services/dom/types/element';

import gsworker from './worker'

const workers = new WorkerService();

const router = new Router([
    DOMService,
    workers,
    workerCanvasRoutes
]);

console.log(router)

let ret = router.load({
    'main':{
        tagName:'div',
        children:{
            'div':{
                tagName:'div',
                innerText:'Multithreaded canvases!'
            } as ElementProps,
            'canvas':{
                tagName:'canvas',
                style:{width:'100%',height:'100%'},
                onrender:(elm,info)=>{
                    const renderer = workers.addWorker({url:gsworker}) as WorkerInfo;
                    const entities = workers.addWorker({url:gsworker}) as WorkerInfo;
                    info.renderer = renderer;
                    info.entities = entities;

                    //console.log(renderer);

                    if(renderer) {
                        const controls:WorkerCanvasControls = router.run(
                            'transferCanvas', 
                            renderer.worker, 
                            {
                                canvas:elm,
                                context:undefined, //Threejs sets the context
                                _id:elm.id,
                                init:(self:WorkerCanvas,canvas,context)=>{

                                },
                                draw:(self:WorkerCanvas,canvas:any,context:any)=>{
                                    
                                },
                                clear:(self:WorkerCanvas, canvas, context) => {
                                    if(self.renderer) {
                                        self.render.domElement = null;
                                        self.renderer = null;
                                        self.composer = null;
                                        self.gui = null;
                                        self.controls = null;
                                        self.camera = null;
                                        self.scene = null;
                                    }
                                }
                            },
                            'receiveThreeCanvas'
                        );
                    }

                    entities.post('addEntities',[
                        {
                            boundingBox:{
                                bot:0,
                                top:300,
                                left:0,
                                right:300,
                                front:0,
                                back:300  
                            }
                        },
                        {
                            boid:true, //boid computation, disables collisions other than bounding box by default
                            collision:false, //detect overlaps with sphere or box (todo: capsules)
                            collider:true, //bounding box and collision system resolving,
                            nbody:false, //gravitational math
                            movement:true, //force -> accel -> velocity -> position updates
                        },
                        1000
                
                    ]);
                },
                onremove:(elm,info)=>{
                    workers.terminate(info.renderer._id);
                    workers.terminate(info.entities._id);
                }        
            } as ElementProps      
        } 
    } as ElementProps
});

//console.log(ret)