//for all the extra services we want to export but are too bulky for the core

//e.g. babylonjs service, threejs service

export * from './struct/Struct.frontend'
export * from './struct/Struct.backend'

export * from './storage/csv'
export * from './storage/BFSUtils'
export * from './storage/BFS_CSV'

export * from './ecs/ECS.systems'

import gsworker from '../services/worker/Worker' //compiles the worker in the dist

export { algorithms } from './algorithms/index'; //modified algorithms object with presets 

export { gsworker } //available as a dataurl