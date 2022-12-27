//for all the extra services we want to export but are too bulky for the core

export * from './gpu/GPU.service' //~500kb
export { gpualgorithms } from './algorithms/index.gpu'; //modified algorithms object with presets 