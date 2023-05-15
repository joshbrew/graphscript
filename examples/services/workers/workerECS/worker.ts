import { 
    WorkerService, 
    remoteGraphRoutes, 
    workerCanvasRoutes,
    ECSService,
     //GPUService 
} from '../../../../index'/////"../../GraphServiceRouter/index";//from 'graphscript'

import {Systems} from '../../../../src/extras/index.services'

import { CanvasProps } from '../../../../src/services/worker/WorkerCanvas';

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
        services:{
            //GPUService,
            ECSService,
            remoteGraphRoutes, //allows dynamic route loading
        },
        roots:{
            ...workerCanvasRoutes,
            ...remoteGraphRoutes,
             receiveThreeCanvas:function(options:CanvasProps){ //modified canvas receiver that installs desired threejs modules
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
                 
                 let renderId = this.__node.graph.run('setupCanvas', options); //the the base canvas tools do the rest, all ThreeJS tools are on self, for self contained ThreeJS renders
                 //you can use the canvas render loop by default, or don't provide a draw function and just use the init and the Three animate() callback

                 //let canvasopts = this.graph.CANVASES[renderId] as WorkerCanvas;

                 return renderId;
             }
         }
    });

    worker.run(
        'addSystems', 
        Systems,
        ['boid','nbody','collision','collider','movement']
    ); //register desired entity component systems

    console.log(worker)
}



export default self as any;