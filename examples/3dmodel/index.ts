import * as BABYLON from 'babylonjs'
import { Vector3 } from 'babylonjs';
import { Graph, htmlloader } from '../../index';

let canvas = document.createElement('canvas');

let engine = new BABYLON.Engine(canvas);

let scene = new BABYLON.Scene(engine);

let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-20, 10, 0), scene);

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
        __props:camera
    },

    light: {
        __props: new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene)
    },

    snowman:{
        __props:BABYLON.MeshBuilder.CreateSphere("sphere1",{diameter: 5, segments: 32},scene),
        position:new BABYLON.Vector3(0,2.5,0),
        __onconnected:function(node) {
            camera.setTarget(this.position);
        },
        __children:{
            snowball2:{
                __props:BABYLON.MeshBuilder.CreateSphere("sphere2",{diameter: 3, segments: 32},scene),
                position:new BABYLON.Vector3(0,3,0), //local position, offset by parent(s)
                __children:{
                    snowball3:{
                        __props:BABYLON.MeshBuilder.CreateSphere("sphere3",{diameter: 2, segments: 32},scene),
                        position:new BABYLON.Vector3(0,2,0) //local position, offset by parent(s)
                    }
                }
            }
        }
    }
}

let modelLoader = (node, parent, graph) => {
    if(node.__props instanceof BABYLON.Mesh) {
        if(parent.__props instanceof BABYLON.Mesh) {
            if(parent.position) {
                node.__localPosition = (node.position as BABYLON.Vector3).clone();
                node.position = (node.position as BABYLON.Vector3).add(parent.position);
            }
            if(parent.rotation) {
                node.__localRotation = (node.rotation as BABYLON.Vector3).clone();
                node.rotation = (node.rotation as BABYLON.Vector3).add(parent.rotation);
            }

            graph.setListeners({
                [node.__node.tag]:{
                    [parent.__node.tag+'.position']:function(newP) {node.position = (node.__localPosition as BABYLON.Vector3).add(newP);},
                    [parent.__node.tag+'.rotation']:function(newR) {node.rotation = (node.__localRotation as BABYLON.Vector3).add(newR);},
                }
            });
        }
    }
}

let graph = new Graph({
    tree:model,
    loaders:{
        htmlloader,
        modelLoader
    }
});

engine.runRenderLoop(function(){
    scene.render();
    graph.get('snowman').position = new Vector3(0, Math.sin(performance.now()*0.001)*5, 0);

});
// the canvas/window resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});

setTimeout(()=>{engine.resize();},0.1)
