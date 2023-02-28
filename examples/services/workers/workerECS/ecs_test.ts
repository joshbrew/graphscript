//this example is for OPTIMIZING graphscript, we got 60fps before no problem with 30,000 boids so let's get the same performance here before we are satisfied


import {
    Router,
    WorkerService,
    workerCanvasRoutes,
    WorkerCanvas,
    WorkerCanvasControls,
    WorkerInfo,
    htmlloader,
    HTMLNodeProperties,
    remoteGraphRoutes
} from '../../../../index'//'graphscript'

import gsworker from './worker'

const workers = new WorkerService();

const router = new Router({ services:{ workers, workerCanvasRoutes, remoteGraphRoutes }, loaders:{htmlloader} });

console.log(router);

document.body.style.height = '100vh'

let ret = router.load({
    'main':{
        tagName:'div',
        __children:{
            'div':{
                tagName:'div',
                innerText:'Multithreaded canvases!'
            } as HTMLNodeProperties,
            'canvas':{
                tagName:'canvas',
                style:{width:'100%',height:'100%'},
                __onrender:function (elm){
                    const renderer = workers.addWorker({url:gsworker}) as WorkerInfo;
                    const entities = workers.addWorker({url:gsworker}) as WorkerInfo;
                    const entities2 = workers.addWorker({url:gsworker}) as WorkerInfo;

                    if(renderer) {

                        let entitySettings = {
                            0:{
                                prototype:{
                                    tag:'boid',
                                    boundingBox:{
                                        bot:0,
                                        top:300,
                                        left:0,
                                        right:300,
                                        front:0,
                                        back:300  
                                    },
                                    boid:{
                                        groupSize:1,
                                        searchLimit:1
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
                                ct: 2500
                            },
                            1:{
                                prototype:{
                                    gravity:0,
                                    drag:0.9,
                                    boundingBox:{
                                        bot:0,
                                        top:300,
                                        left:0,
                                        right:300,
                                        front:0,
                                        back:300  
                                    },
                                    attractorGroup:1,
                                    attractorGroupRules:{
                                        1:5000,
                                        2:{G:200, maxDist:145},
                                        3:{G:100, maxDist:45},
                                        4:{G:-10000, maxDist:30}
                                    },
                                    attractorFrameSearchMax:3,
                                    maxSpeed:30
                                },
                                components:{
                                    //boids:true
                                    //collision:true,
                                    collider:true,
                                    nbody:true,
                                    movement:true
                                },
                                ct: 500
                            },
                            2:{
                                prototype:{
                                    gravity:0,
                                    drag:0.9,
                                    boundingBox:{
                                        bot:0,
                                        top:300,
                                        left:0,
                                        right:300,
                                        front:0,
                                        back:300  
                                    },
                                    attractorGroup:2,
                                    attractorFrameSearchMax:3,
                                    attractorGroupRules:{
                                        1:{G:-100, maxDist:45},
                                        2:{G:200, maxDist:145},
                                        3:{G:-100, maxDist:100},
                                        4:{G:600, maxDist:45}
                                    },
                                    maxSpeed:20
                                },
                                components:{
                                    //boids:true
                                    //collision:true,
                                    collider:true,
                                    nbody:true,
                                    movement:true
                                },
                                ct: 100
                            },
                            3:{
                                prototype:{
                                    gravity:0,
                                    drag:0.9,
                                    boundingBox:{
                                        bot:0,
                                        top:300,
                                        left:0,
                                        right:300,
                                        front:0,
                                        back:300  
                                    },
                                    attractorGroup:3,
                                    attractorFrameSearchMax:3,
                                    attractorGroupRules:{
                                        1:1500,
                                        2:{G:-800, maxDist:60},
                                        3:{G:30, maxDist:45},
                                        4:{G:3000, maxDist:45}
                                    },
                                    maxSpeed:60
                                },
                                components:{
                                    //boids:true
                                    //collision:true,
                                    collider:true,
                                    nbody:true,
                                    movement:true
                                },
                                ct: 100
                            },
                            4:{
                                prototype:{
                                    gravity:0,
                                    drag:0.9,
                                    boundingBox:{
                                        bot:0,
                                        top:300,
                                        left:0,
                                        right:300,
                                        front:0,
                                        back:300  
                                    },
                                    attractorGroup:4,
                                    attractorGroupRules:{
                                        1:10000,
                                        2:0,
                                        3:0,
                                        4:{G:-500, maxDist:100}
                                    },
                                    attractorFrameSearchMax:3,
                                    maxSpeed:60
                                },
                                components:{
                                    //boids:true,
                                    //collision:true,
                                    collider:true,
                                    nbody:true,
                                    movement:true
                                },
                                ct: 500
                            }
                        }
    
                        const portId = workers.establishMessageChannel(renderer.worker,entities.worker);
                        const port2Id = workers.establishMessageChannel(renderer.worker,entities2.worker);
                        
                        this.renderer = renderer;
                        this.entities = entities;
                        this.entities2 = entities2;
    
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
                                    
                                    //self.positions = new Float32Array(entityCt*3); //x,y,z buffer, idx*3 = entity[idx]

                                    //----------- basic threejs scene setup ------------
                                    const THREE = self.THREE;
                                    const OrbitControls = self.OrbitControls;

                                    const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
                                    renderer.setPixelRatio(Math.min(canvas.width/canvas.height,2));

                                    const fov = 75;
                                    const aspect = canvas.clientWidth / canvas.clientHeight;
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
                                        //console.log('resizing', canvas.clientWidth, canvas.clientHeight)
                                        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
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


                                    let arr = new Float32Array(entityCt*3);
                                    arr.forEach((v,i) => { arr[i] = Math.random()*150 })

                                    let geometry = new THREE.BufferGeometry();
                                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3) )
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

                                    //console.log(points);

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
                                                offset += self.graph.entitySettings[n].ct*3;
                                                n++;
                                            }
                                        }

                                        //console.log(data);

                                        //(self.positions as Float32Array).set(data.positions, offset);
                                    
                                        self.points.geometry.attributes.position.array.set(data.positions, offset);
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


                        function bufferPositions(entities) { // SCOPE REFACTOR: Might actually need to pass self and origin...

                            let positionBuffer = this.__node.graph.run(
                                'bufferValues',
                                entities,
                                'position',
                                ['x','y','z'] //or for arrays could be the array values
                            );

                            return {
                                entityId:this.__node.graph.entityId, 
                                positions:positionBuffer
                            }; //typedarrays are automatically transferred
                        };

                        workers.run('transferFunction',
                            bufferPositions,
                            entities, 
                            'bufferPositions'
                        );
                        
                        workers.run('transferFunction',
                            bufferPositions,
                            entities2, 
                            'bufferPositions'
                        );
                    
                        entities.post('ECSService.subscribe',[
                            'movement',
                            'bufferPositions'
                        ]); //i/o subscription

                        entities2.post('ECSService.subscribe',[
                            'movement',
                            'bufferPositions'
                        ]); //i/o subscription


                        renderer.post('subscribeToWorker',[
                            'bufferPositions',
                            portId,
                            'updateCanvas'
                        ]);

                        renderer.post('subscribeToWorker',[
                            'bufferPositions',
                            port2Id,
                            'updateCanvas'
                        ]);

                        //console.log('entities',entities);
                            
                        entities.run('addEntities',[
                            entitySettings[0].prototype,
                            entitySettings[0].components,
                            entitySettings[0].ct
                        ]);

                        entities2.run('addEntities',[
                            entitySettings[1].prototype,
                            entitySettings[1].components,
                            entitySettings[1].ct
                        ]);

                        entities2.run('addEntities',[
                            entitySettings[2].prototype,
                            entitySettings[2].components,
                            entitySettings[2].ct
                        ]);

                        entities2.run('addEntities',[
                            entitySettings[3].prototype,
                            entitySettings[3].components,
                            entitySettings[3].ct
                        ]);

                        entities2.run('addEntities',[
                            entitySettings[4].prototype,
                            entitySettings[4].components,
                            entitySettings[4].ct
                        ]);

                        entities.post('setValue',['entityId',0]);
                        entities.post('animateEntities');

                        entities2.post('setValue',['entityId',1]);
                        entities2.post('animateEntities');
                    }
                },
                __onremove:function (elm){
                    workers.terminate(this.renderer._id);
                    workers.terminate(this.entities._id);
                    workers.terminate(this.entities2._id);
                }        
            } as HTMLNodeProperties      
        } 
    } as HTMLNodeProperties
});

//console.log(ret)