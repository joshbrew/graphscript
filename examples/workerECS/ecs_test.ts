//this example is for OPTIMIZING graphscript, we got 60fps before no problem with 30,000 boids so let's get the same performance here before we are satisfied


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

                    if(renderer) {

                        let entitySettings = {
                            0:{
                                prototype:{
                                    tag:'particle',
                                    boundingBox:{
                                        bot:0,
                                        top:300,
                                        left:0,
                                        right:300,
                                        front:0,
                                        back:300  
                                    },
                                    maxSpeed:30
                                },
                                components:{ //set which active systems to use for each entity
                                    boid:true, //boid computation, disables collisions other than bounding box by default
                                    collision:false, //detect overlaps with sphere or box (todo: capsules)
                                    collider:true, //bounding box and collision system resolving,
                                    nbody:false, //gravitational math
                                    movement:true, //force -> accel -> velocity -> position updates
                                },
                                ct: 1000
                            }
                        }
    
                        const portId = workers.establishMessageChannel(renderer.worker,entities.worker);
    
                        info.renderer = renderer;
                        info.entities = entities;
    
                        //console.log(renderer);
    
                        renderer.post('setValue',['entitySettings',entitySettings]);

                        const controls:WorkerCanvasControls = router.run(
                            'transferCanvas', 
                            renderer.worker, 
                            {
                                canvas:elm,
                                context:undefined, //Threejs sets the context
                                _id:elm.id,
                                init:(self:WorkerCanvas,canvas,context)=>{
                                    let entityCt = 0;
                                    for(const key in self.graph.entitySettings) {
                                        entityCt += self.graph.entitySettings[key].ct;
                                    }
                                    
                                    self.positions = new Float32Array(entityCt*3); //x,y,z buffer, idx*3 = entity[idx]

                                    //----------- basic threejs scene setup ------------
                                    const THREE = self.THREE;
                                    const OrbitControls = self.OrbitControls;

                                    const renderer = new THREE.WebGLRenderer({canvas});
                                    renderer.setPixelRatio(Math.min(canvas.clientWidth/canvas.clientHeight,2));

                                    const fov = 75;
                                    const aspect = 2;
                                    const near = 0.01;
                                    const far = 1000;

                                    let time = 0;
                                    let lastFrame = Date.now();
                                    
                                    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
                                    camera.position.z = 10;

                                    camera.lookAt(0,0,1000);

                                    const controls = new OrbitControls(camera, canvas);
                                    controls.enablePan = true;
                                    controls.enableDamping = true;
                                    controls.update();

                                    const scene = new THREE.Scene();

                                    
                                    canvas.addEventListener('resize', (ev) => {
                                        renderer.setSize(canvas.width, canvas.height, false);
                                        if(camera) {
                                            camera.aspect = canvas.clientWidth / canvas.clientHeight;
                                            camera.updateProjectionMatrix();
                                        }
                                    });

                                    
                                    let nBoids = entityCt;

                                    let colors:any = [];
                                    let color = new THREE.Color();
                                    let i = 0;

                                    for(const key in self.graph.entitySettings) {
                                        for(let j = 0; j < self.graph.entitySettings[key].ct; j++) {
                                            let roll = Math.random();
                                            if(i==0){
                                                if(roll <= 0.3){
                                                    color.set('lightseagreen');
                                                } else if (roll <= 0.85){
                                                    color.set('blue');
                                                } else {
                                                    color.set('turquoise');
                                                }
                                                colors.push(color.r,color.g,color.b);
                                            }
                                            else if (i==1) {
                                                if(roll <= 0.3){
                                                    color.set('pink');
                                                } else if (roll <= 0.85){
                                                    color.set('red');
                                                } else {
                                                    color.set('orange');
                                                }
                                                colors.push(color.r,color.g,color.b);
                                            }
                                            else {
                                                color.setRGB(Math.random(),Math.random(),Math.random());
                                                colors.push(color.r,color.g,color.b);
                                            }
                                        }
                                        i++;
                                    }

                                    const boids = new Array(nBoids);

                                    let geometry = new THREE.BufferGeometry();
                                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(self.positions, 3) )
                                    geometry.setAttribute('color', new THREE.Float32BufferAttribute( colors, 3 ));

                                    let pointmat = new THREE.PointsMaterial(
                                        {
                                            vertexColors: true,
                                            opacity:0.99
                                        }
                                    )

                                    const points = new THREE.Points(geometry, pointmat);
                                    points.frustumCulled = false;

                                    points.position.x -= 150;
                                    points.position.y -= 150;
                                    points.position.z -= 150;

                                    scene.add(points);

                                    console.log(points);

                                    Object.assign(self, {
                                        renderer,
                                        time,
                                        lastFrame,
                                        camera,
                                        controls,
                                        scene,
                                        boids,
                                        points
                                    }); //assign these to self for the draw function
                            
                                },
                                draw:(self:WorkerCanvas,canvas:any,context:any)=>{
                                    let now = Date.now();
                                    self.time += (now - self.lastFrame) * 0.001;
                                    self.lastFrame = now;

                                    self.controls.update();
                                    self.renderer.render(self.scene, self.camera);
                                },
                                update:(self:WorkerCanvas,canvas,context,data:{
                                    entityId:number,
                                    positions:Float32Array
                                })=>{
                                    //update positions of particles based on input buffer, begin at start index if specified
                                    if(data?.positions) {
                                        let offset = 0;
                                        if(data.entityId > 0) {
                                            let n = 0;
                                            while(n !== data.entityId) {
                                                offset += globalThis.entitySettings[n].ct;
                                                n++;
                                            }
                                        }

                                        (self.positions as Float32Array).set(data.positions, offset);
                                    
                                        self.points.geometry.attributes.position.array.set(self.positions);
                                        self.points.geometry.attributes.position.needsUpdate = true;

                                        //console.log(self.points.geometry.attributes.position.array);
                                    }

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



                        workers.transferFunction(
                            entities, 
                            function bufferPositions(entities) { // SCOPE REFACTOR: Might actually need to pass self and origin...

                                let positionBuffer = this.graph.run(
                                    'bufferValues',
                                    entities,
                                    'position',
                                    ['x','y','z'] //or for arrays could be the array values
                                );

                                return {
                                    entityId:this.graph.entityId, 
                                    positions:positionBuffer
                                }; //typedarrays are automatically transferred
                            },
                            'bufferPositions'
                        );

                        entities.post('subscribe',[
                            'movement',
                            'bufferPositions'
                        ]); //i/o subscription

                        renderer.post('subscribeToWorker',[
                            'bufferPositions',
                            portId,
                            'updateCanvas'
                        ]);

                            
                        entities.run('addEntities',[
                            entitySettings[0].prototype,
                            entitySettings[0].components,
                            entitySettings[0].ct
                        ]).then((r) => {
                            //e.g. for each entity group, set up a thread to handle its component updates
                            entities.post('setValue',['entityId',0]);
                            entities.post('animateEntities');
                        });

                    }
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