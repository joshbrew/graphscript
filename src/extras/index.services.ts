//for all the extra services we want to export but are too bulky for the core

//e.g. babylonjs service, threejs service

export * from './struct/Struct.frontend'
export * from './struct/Struct.backend'

export * from './ecs/ECS.systems'

export * from './webgl-plot/webglplot.routes'

import gsworker from '../services/worker/Worker' //compiles the worker in the dist

export { algorithms } from './algorithms/index'; //modified algorithms object with presets 

export { gsworker } //available as a dataurl