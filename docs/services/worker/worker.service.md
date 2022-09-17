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
    onerror?:(ev)=>void,
    onclose?:(worker:Worker|MessagePort)=>void
} 

type WorkerInfo = {
    worker:Worker|MessagePort,
    send:(message:any,transfer?:any)=>void,
    request:(message:any, transfer?:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any, transfer?:any)=>void,
    run:(route:any, args?:any, transfer?:any, method?:string)=>Promise<any>
    subscribe:(route:any, callback?:((res:any)=>void)|string, blocking?:boolean)=>Promise<any>,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    start:(route?:any, portId?:string, callback?:((res:any)=>void)|string, blocking?:boolean)=>Promise<boolean>, //subscribe the worker to another worker via a message port (or undefined to subscribe the worker to a main thread process) or start existing subscriptions again
    stop:(route?:string, portId?:string)=>Promise<boolean>, //unsubscribe the worker to the other worker (or main thread)
    workerSubs:{[key:string]:{sub:number|false, route:string, portId:string, callback?:((res:any)=>void)|string, blocking?:boolean}},
    terminate:()=>boolean,
    graph:WorkerService,
    _id:string
} & WorkerProps & WorkerRoute

//and also a custom route you can load with properties for quick setup within the node tree
type WorkerRoute = {
    worker?:WorkerInfo
    workerUrl?: string|URL|Blob,
    workerId?: string,
    transferFunctions?:{[key:string]:Function},
    transferClasses?:{[key:string]:Function},
    parentRoute?:string, //if a child of a worker node, subscribe to a route on a parent worker?
    portId?:string, //port to subscribe to for the parent route? will establish new one if parent has a worker defined, there is no limit on MessagePorts so they can be useful for organizing 
    callback?:string, //Run this route on the worker when the operator is called. If this route is a child of another node, run this node on the child worker when it receives a message. 
    stopped?:boolean, // Don't run the callback until we call the thread to start? E.g. for recording data periodically.
    blocking?:boolean, //should the subscribed worker wait for the subscriber to resolve before sending a new result? Prevents backup and makes async processing easier
    init?:string, //run a callback on the worker on worker init?
    initArgs?:any[] //arguments to go with the worker init?
    initTransfer?:any[] //transferrable stuff with the init?
} & GraphNodeProperties & WorkerProps



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
    WorkerCanvas,
    WorkerCanvasControls,
} from 'graphscript'
import { ElementProps } from 'graphscript/dist/services/dom/types/element';

import gsworker from './worker'

const workers = new WorkerService();

const router = new Router({
    routes:[
        DOMService,
        workers,
        workerCanvasRoutes
    ]
});

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
```

Worker:
```ts
import { 
    WorkerService, 
    unsafeRoutes, 
    workerCanvasRoutes,
     //GPUService 
} from 'graphscript'/////"../../GraphServiceRouter/index";//from 'graphscript'


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



## ThreeJS Worker Example
We ripped this example from a threejsfundamentals tutorial just to show how easy it is to load up a rendering solution like ThreeJS into our system.

```ts

import {
    Router,
    WorkerService,
    DOMService,
    workerCanvasRoutes,
    WorkerCanvas,
    WorkerCanvasControls
} from 'graphscript'
import { ElementProps } from 'graphscript/dist/services/dom/types/element';

import gsworker from './worker'

const workers = new WorkerService();

const router = new Router({
    routes:[
        DOMService,
        workers,
        workerCanvasRoutes
    ]
});

console.log(router)

document.body.style.height = '100vh'

//a service that loads aother service gains access to the customChildren and customRoutes e.g. the DOMService's awareness of certain tags to transform nodes to include HTML elements or web components
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

                    if(renderer) {
                        const controls:WorkerCanvasControls = router.run(
                            'transferCanvas', 
                            renderer.worker, 
                            {
                                canvas:elm,
                                context:undefined, //Threejs sets the context
                                _id:elm.id,
                                init:(self:WorkerCanvas,canvas,context)=>{

                                    //these are installed to the 'self' reference using our modified 
                                    const THREE = self.THREE;
                                    const OrbitControls = self.OrbitControls;
                                    const PickHelper = self.PickHelper;
                                    
                                    const renderer = new THREE.WebGLRenderer({canvas});
                                    let time = 0;
                                    let lastFrame = Date.now();

                                    const fov = 75;
                                    const aspect = 2;
                                    const near = 0.1;
                                    const far = 100;
                                    
                                    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                                    camera.position.z = 4;

                                    renderer.setSize(canvas.width, canvas.height, false);
                                        if(camera) {
                                            camera.aspect = canvas.clientWidth / canvas.clientHeight;
                                            camera.updateProjectionMatrix();
                                        }

                                    const controls = new OrbitControls(camera, canvas);
                                    controls.target.set(0,0,0);
                                    controls.update();

                                    const scene = new THREE.Scene();

                                    {
                                        const color = 0xFFFFFF;
                                        const intensity = 1;
                                        const light = new THREE.DirectionalLight(color, intensity);
                                        light.position.set(-1, 2, 4);
                                        scene.add(light);
                                    }
                                
                                    const boxWidth = 1;
                                    const boxHeight = 1;
                                    const boxDepth = 1;
                                    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
                                
                                    const makeInstance = (geometry, color, x) => {
                                        const material = new THREE.MeshPhongMaterial({
                                            color,
                                        });
                                    
                                        const cube = new THREE.Mesh(geometry, material);
                                        scene.add(cube);
                                    
                                        cube.position.x = x;
                                    
                                        return cube;
                                    }
                                
                                    const cubes = [
                                        makeInstance(geometry, 0x44aa88, 0),
                                        makeInstance(geometry, 0x8844aa, -2),
                                        makeInstance(geometry, 0xaa8844, 2),
                                    ];
                            
                                    let getCanvasRelativePosition = (event) => {
                                        const rect = canvas.getBoundingClientRect();
                                        return {
                                            x: event.clientX - rect.left,
                                            y: event.clientY - rect.top,
                                        };
                                    }
                                
                                    const pickPosition = {x: -2, y: -2};
                                    const pickHelper = new PickHelper();

                                    let setPickPosition = (event) => {
                                        const pos = getCanvasRelativePosition(event);
                                        pickPosition.x = (pos.x / canvas.clientWidth ) *  2 - 1;
                                        pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y
                                    }
                                
                                    let clearPickPosition = () => {
                                        // unlike the mouse which always has a position
                                        // if the user stops touching the screen we want
                                        // to stop picking. For now we just pick a value
                                        // unlikely to pick something
                                        pickPosition.x = -100000;
                                        pickPosition.y = -100000;
                                    }
                                    
                                    canvas.addEventListener('mousemove', setPickPosition);
                                    canvas.addEventListener('mouseout', clearPickPosition);
                                    canvas.addEventListener('mouseleave', clearPickPosition);
                                
                                    canvas.addEventListener('touchstart', (event) => {
                                        // prevent the window from scrolling
                                        event.preventDefault();
                                        setPickPosition(event.touches[0]);
                                    }, {passive: false});
                                
                                    canvas.addEventListener('touchmove', (event) => {
                                        setPickPosition(event.touches[0]);
                                    });
                                
                                    canvas.addEventListener('touchend', clearPickPosition);

                                    canvas.addEventListener('resize', (ev) => {
                                        renderer.setSize(canvas.width, canvas.height, false);
                                        if(camera) {
                                            camera.aspect = canvas.clientWidth / canvas.clientHeight;
                                            camera.updateProjectionMatrix();
                                        }
                                    });

                                    Object.assign(self, {
                                        renderer,
                                        camera,
                                        controls,
                                        scene,
                                        cubes,
                                        time,
                                        lastFrame,
                                        pickPosition,
                                        pickHelper
                                    }); //assign these to self for the draw function
                            
                                    clearPickPosition();
                                    //this.renderer.setAnimationLoop(this.draw);


                                },
                                draw:(self:WorkerCanvas,canvas:any,context:any)=>{
                                    let now = Date.now();
                                    self.time += (now - self.lastFrame) * 0.001;
                                    self.lastFrame = now;

                                    self.cubes.forEach((cube, ndx) => {
                                        const speed = 1 + ndx * .1;
                                        const rot = self.time * speed;
                                        cube.rotation.x = rot;
                                        cube.rotation.y = rot;
                                      });
                                  
                                      
                                      self.pickHelper.pick(self.pickPosition, self.scene, self.camera, self.time);
                                      //console.log(this.pickPosition);
                                      self.renderer.render(self.scene, self.camera);
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
                            'receiveThreeCanvas' //we cam reroute the transferred functions and canvases in this function
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

```


And to set up the worker, we add an intermediate function to the worker's `receiveCanvas`function using the `workerCanvasRoutes` we provided. This simply adds references to desirable ThreeJS modules to the canvas properties that you can reference in the functions you write from the main thread.

```ts

import { 
    WorkerService, 
    unsafeRoutes, 
    workerCanvasRoutes,
    ECSService,
    Systems
     //GPUService 
} from 'graphscript'/////"../../GraphServiceRouter/index";//from 'graphscript'
import { WorkerCanvasReceiveProps } from 'graphscript/services/worker/WorkerCanvas';

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { PickHelper } from './PickHelper'

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    const worker = new WorkerService({
        routes:[
            //GPUService,
            ECSService,
            unsafeRoutes, //allows dynamic route loading
            {
                ...workerCanvasRoutes,
                receiveThreeCanvas:function(options:WorkerCanvasReceiveProps){ //modified canvas receiver that installs desired threejs modules
                    const ThreeProps = { //e.g. install these systems to 'self', which is the worker canvas
                        THREE,
                        OrbitControls,
                        EffectComposer,
                        RenderPass,
                        SMAAPass,
                        UnrealBloomPass,
                        PickHelper
                    }

                    Object.assign(options, ThreeProps); //install desired props to our canvas's 'self' reference

                    let renderId = this.graph.run('receiveCanvas', options); //the the base canvas tools do the rest, all ThreeJS tools are on self, for self contained ThreeJS renders
                    //you can use the canvas render loop by default, or don't provide a draw function and just use the init and the Three animate() callback

                    //let canvasopts = this.graph.CANVASES[renderId] as WorkerCanvas;

                    return renderId;
                }
            }
        ],
        includeClassName:false,
        loadDefaultRoutes:true //to get subscribe and subscribeNode routes
    });

//we can create particle systems that threads handle computations for. Even our rough cut systems here perform well enough for most games (see the workerECS example)
    worker.run(
        'addSystems', 
        Systems, 
        ['boid','nbody','collision','collider','movement']
    ); //register desired entity component systems

    console.log(worker)
}

export default self as any;

```


For another interesting example, see `examples/audiofeedback` which includes a multithreaded USB and BLE driver system to use HEGs for audiofeedback, implemented in less than 400 lines of code via the frontend DOMService.