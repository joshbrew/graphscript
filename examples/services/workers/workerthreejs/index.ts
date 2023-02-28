import {
    Router,
    WorkerService,
    workerCanvasRoutes,
    WorkerCanvas,
    WorkerCanvasControls,
    htmlloader,
    HTMLNodeProperties
} from '../../../../index'//'graphscript'

import gsworker from './worker'

const workers = new WorkerService();

const router = new Router({
    services:{
        workers,
        workerCanvasRoutes
    },
    loaders:{
        htmlloader
    }
});

console.log(router)

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
                __onrender:function(elm){
                    const renderer = workers.addWorker({url:gsworker});
                    this.worker = renderer;

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

                                    //these are installed to the 'self' reference
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
                            'receiveThreeCanvas'
                        );
                    }
                },
                __onremove:function(elm){
                    workers.terminate(this.worker._id);
                }        
            } as HTMLNodeProperties      
        } 
    } as HTMLNodeProperties
});

//console.log(ret)