//for all the extra services we want to export but are too bulky for the core

export * from './services/gpu/GPU.service' //~500kb

//e.g. babylonjs service, threejs service

import gsworker from './services/worker/Worker' //compiles the worker in the dist
export {gsworker}
