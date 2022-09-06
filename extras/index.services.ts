//for all the extra services we want to export but are too bulky for the core

export * from './gpu/GPU.service' //~500kb

//e.g. babylonjs service, threejs service

export * from './struct/Struct.frontend'
export * from './struct/Struct.backend'

export * from './storage/csv'
export * from './storage/BFSUtils'
export * from './storage/BFS_CSV'


import gsworker from '../services/worker/Worker' //compiles the worker in the dist

export { algorithms } from './algorithms/index'; //modified algorithms object with presets 

export { gsworker } //available as a dataurl