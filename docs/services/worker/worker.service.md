## WorkerService

The Worker Service makes it very easy to create multithreaded applications with a generic communication format, and construct arbitrary function graphs.

This includes custom route definitions that allow you to chain workers (incl through message ports for worker -> worker parent-child relationships) and node callbacks seamlessly. 

The custom route:
```ts
type WorkerRoute = {
    worker?:WorkerInfo
    workerUrl?: string|URL|Blob,
    workerId?: string,
    transferFunctions?:{[key:string]:Function},
    transferClasses?:{[key:string]:Function},
    parentRoute?:string, //if a child of a worker node, subscribe to a route on a parent worker?
    callback?:string //Run this route on the worker when the operator is called. If this route is a child of another node, run this node on the child worker when it receives a message. 
} & GraphNodeProperties & WorkerProps

```


To use the worker service:
```ts

import {WorkerService, canvasWorkerRoutes} from 'graphscript' 

import gsworker from 'graphscript/dist/Worker' //This is the default worker which is set up with a worker service to send/receive messages, plus unsafeservice to write data and functions arbitrarily to build single file pipelines

type WorkerProps = {
    worker:WorkerInfo,
    workerUrl?: string|URL|Blob,
    url?:URL|string|Blob,
    _id?:string,
    port?:MessagePort, //message channel for this instance
    onmessage?:(ev)=>void,
    onerror?:(ev)=>void
} 

type WorkerInfo = {
    worker:Worker,
    send:(message:any,transfer?:any)=>void,
    request:(message:any, transfer?:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any, transfer?:any)=>void,
    run:(route:any, args?:any, transfer?:any, method?:string)=>Promise<any>
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>
} & WorkerProps & WorkerRoute



//import worker from 'graphscript' //default worker
import worker from './worker.ts' //this will compile with tinybuild

const workers = new WorkerService({routes:[canvasWorkerRoutes]});

let worker1 = workers.addWorker({url:worker});
let worker2 = workers.addWorker({url:worker});

const portId = workers.establishMessageChannel(worker1.worker,worker2.worker)

//if unsafeService is enabled on the worker you can quickly write in functions from the main thread
workers.transferFunction(
    worker1,
    function add1(input) {
        return input + 1;
    }
) //creates a node called 'add' on this worker using the function definition

workers.transferFunction(
    worker2,
    function log(input) {
        console.log('worker logged: ',input);
        return true;
    }
);

worker2.post('subscribeToWorker',['add1',portId,'log']);

worker2.subscribe('log',(res)=>{console.log('returned from worker2: ',res);}) //should grab the 'true' result from worker2 back on the main thread.

worker1.post('add1',3);


//check console, worker2 should log the result!

```

You can use `workers.transferClass` to transfer class methods, but note that if it is extending another class it will error unless the extended class already exists on the receiving thread.

This is an incredibly powerful feature set, use threads for any and all heavy computations, they can even run fetch and server APIs on independent scopes, but note that the memory pool is shared with the main thread unlike child processes in node.



## Canvas Threading Example

OffscreenCanvases allow multithreaded draw calls, this easily extends to libraries like ThreeJS or BabylonJS. We even included a nifty proxy event listener for mouse events, which you can extend to support more if you see the `eventHandlers` import that lists supported key events. It automaticall detects resize events as well and sends the new clientHeight/clientWidth, which you can fix or make stretch using CSS rules (shown below);

Main
```ts
import {
    Router,
    WorkerService,
    DOMService,
    workerCanvasRoutes,
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
                    const renderer = workers.addWorker({url:gsworker});
                    info.worker = renderer;

                    //console.log(renderer);

                    if(renderer)
                        router.run(
                            'transferCanvas', 
                            renderer.worker, 
                            {
                                canvas:elm,
                                context:'2d',
                                _id:elm.id,
                                init:(self,canvas,context)=>{
                                    canvas.addEventListener('mousedown',(ev)=>{
                                        console.log('clicked!', ev, canvas);
                                    })
                                },
                                draw:(self:any,canvas:any,context:CanvasRenderingContext2D)=>{
                                    context.clearRect(0,0,canvas.width, canvas.height);
                                    
                                    context.fillStyle = `rgb(0,${Math.sin(Date.now()*0.001)*255},${Math.cos(Date.now()*0.001)*255})`;
                                    context.fillRect(0,0,canvas.width,canvas.height);
                                }
                                //clear
                                //update //e.g. update props between draw calls or call drawFrame manually
                                //animating:false //can manually start the animation later
                            }
                        );
                },
                onremove:(elm,info)=>{
                    workers.terminate(info.worker._id);
                }        
            } as ElementProps      
        } 
    } as ElementProps
});

//console.log(ret)
```

Worker:
```ts
import { 
    WorkerService, 
    unsafeRoutes, 
    workerCanvasRoutes,
     //GPUService 
} from '../../index'/////"../../GraphServiceRouter/index";//from 'graphscript'


declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    const worker = new WorkerService({
        routes:[
            //GPUService as any,
            workerCanvasRoutes,
            unsafeRoutes //allows dynamic route loading
        ],
        includeClassName:false
    });

    console.log(worker)
}

export default self as any;

```