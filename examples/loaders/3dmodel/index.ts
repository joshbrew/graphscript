import * as B from 'babylonjs'
import { Graph, htmlloader } from '../../../index';

let canvas = document.createElement('canvas');

let engine = new B.Engine(canvas);

let scene = new B.Scene(engine);

let camera = new B.FreeCamera('camera1', new B.Vector3(-20, 10, 0), scene);

camera.attachControl(canvas, false);



let model = {

    canvas:{
        __element:canvas,
        style:{width:'100%', height:'100%'}
    },

    engine:{
        __props:engine
    },

    scene:{
        __props:scene
    },

    camera: {
        __props:camera,
        __transition:{
            duration:3,
            position:{x:10, y:0, z:10},
            target:new B.Vector3(0,2.5,0)
        },
        __children:{
            transition2:{
                __transition:{
                    duration:3,
                    position:{x:20, y:10, z:0},
                    target:new B.Vector3(0,2.5,0)
                }
            }
        }
    },

    light: {
        __props: new B.HemisphericLight('light1', new B.Vector3(0,1,0), scene)
    },

    snowman:{
        __props:B.MeshBuilder.CreateSphere("sphere1",{diameter: 5, segments: 32},scene),
        position:new B.Vector3(0,2.5,0),
        __onconnected:function(node) {
            camera.setTarget(this.position);
        },
        __children:{
            snowball2:{
                __props:B.MeshBuilder.CreateSphere("sphere2",{diameter: 3, segments: 32},scene),
                position:new B.Vector3(0,3,0), //local position, offset by parent(s)
                __children:{
                    snowball3:{
                        __props:B.MeshBuilder.CreateSphere("sphere3",{diameter: 2, segments: 32},scene),
                        position:new B.Vector3(0,2,0) //local position, offset by parent(s)
                    }
                }
            }
        }
    },

    snowmansFren:{
        __props:B.MeshBuilder.CreateSphere("sphere1",{diameter: 3, segments: 32},scene),
        position:new B.Vector3(5,1.5,0),
        __children:{
            snowball2:{
                __props:B.MeshBuilder.CreateSphere("sphere2",{diameter: 2, segments: 32},scene),
                position:new B.Vector3(0,1.5,0), //local position, offset by parent(s)
            }
        }
    }
}

let modelLoader = (node, parent, graph) => {
    if(node.__props instanceof B.Mesh) {
        if(parent.__props instanceof B.Mesh) {
            if(parent.position) {
                node.__localPosition = (node.position as B.Vector3).clone();
                node.position = (node.position as B.Vector3).add(parent.position);
            }
            if(parent.rotation) {
                node.__localRotation = (node.rotation as B.Vector3).clone();
                node.rotation = (node.rotation as B.Vector3).add(parent.rotation);
            }


            let __listeners = {
                [parent.__node.tag+'.position']:function(newP) {node.position = (node.__localPosition as B.Vector3).add(newP);},
                [parent.__node.tag+'.rotation']:function(newR) {node.rotation = (node.__localRotation as B.Vector3).add(newR);},
                
            }; 
            if(node.__listeners) Object.assign(node.__listeners,__listeners);
            else node.__listeners = __listeners;
        }
    }
}

type __transition = {
    duration:number,
    delay?:number,
    position?:{x:number,y:number,z:number}|B.Vector3, //end position to interpolate linearly to
    rotation?:{x:number,y:number,z:number}|B.Vector3, //end rotation to interpolate linearly to
    target?:B.Vector3, //or just tell it to look at something each update
    pinterp?:(currPos, lastPos, curTime, startTime) => B.Vector3, //apply position/path modifier to replace the current coordinate
    rinterp?:(currRot, lastRot, curTime, startTime) => B.Vector3, //apply rotation path modifier
}

//very rudimentary camera tracking example. Better would be spring movement and better timing to remove judder at end of transition
let cameraLoader = (node, parent, graph) => {

    let animating = true;
    if(!node.__props && parent.__props instanceof B.FreeCamera) {node.__props = parent.__props; node.__proxyObject(node.__props); }
    if(node.__props instanceof B.FreeCamera) {
        if(node.__transition) {
            node.__setOperator(()=>{
                let lastTime = performance.now()*0.001;
                let startTime = lastTime;
                let startPos = (node.position as B.Vector3).clone();
                let startRot = (node.rotation as B.Vector3).clone();
                if(node.__transition.position && !(node.__transition.position instanceof B.Vector3)) node.__transition.position = new B.Vector3(node.__transition.position.x,node.__transition.position.y,node.__transition.position.z);
                if(node.__transition.rotation && !(node.__transition.rotation instanceof B.Vector3)) node.__transition.rotation = new B.Vector3(node.__transition.rotation.x,node.__transition.rotation.y,node.__transition.rotation.z);
                let transition = async () => {
                    if(animating === false) return undefined; //aborts
                    else if (lastTime - startTime >= node.__transition.duration) {
                        if(node.__transition.position) {
                            node.position = node.__transition.position;
                        }
                        if(node.__transition.rotation) {
                            node.rotation = node.__transition.rotation;
                        }
                        return true;
                    }

                    
                    let currTime = performance.now()*0.001;
                    let dT = (currTime - startTime) / node.__transition.duration;

                    
                    if (currTime - startTime >= node.__transition.duration) {
                        if(node.__transition.position) {
                            node.position = node.__transition.position;
                        }
                        if(node.__transition.rotation) {
                            node.rotation = node.__transition.rotation;
                        }
                    }
                    else {
                        if(node.__transition.rotation) {
                            let newRot = startRot.add((node.__transition.rotation as B.Vector3).subtract(startRot).scale(dT))
                            if(node.__transition.rinterp) newRot = node.__transition.rinterp(newRot,node.rotation,currTime,startTime);
                            node.rotation = newRot;
                        } else if (node.__transition.target) {
                            (node.__props as B.FreeCamera).setTarget(node.__transition.target);
                        }
                        if(node.__transition.position) {
                            let newP = startPos.add((node.__transition.position as B.Vector3).subtract(startPos).scale(dT))
                            if(node.__transition.pinterp) newP = node.__transition.pinterp(newP,node.position,currTime,startTime);
                            node.position = newP;
                            
                            lastTime = currTime;
                            await new Promise(async (res)=>{requestAnimationFrame(async ()=>{res(await transition())})});
                        }
                        return true;
                        
                    }
                }
                if(node.__transition.delay) {
                    return new Promise ((res) => {setTimeout(async()=>{ res(await transition()); }, node.__transition.delay);});
                } else return new Promise (async (res) => {res(await transition()); });
            });
        }
    }

    let abort = ()=>{ animating = false; window.removeEventListener('mousedown',abort); window.removeEventListener('keydown',abort); }

    window.addEventListener('mousedown', abort);
    window.addEventListener('keydown', abort);
}

let graph = new Graph({
    roots:model,
    loaders:{
        htmlloader,
        modelLoader,
        cameraLoader
    }
});

engine.runRenderLoop(function(){
    scene.render();
    graph.get('snowman').position = new B.Vector3(0, Math.sin(performance.now()*0.001)*5, 0);

});
// the canvas/window resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});

setTimeout(()=>{
    engine.resize();
    graph.run('camera');
},0.1)
