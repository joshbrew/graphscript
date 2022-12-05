
WIP entity component system, define nodes with methods to be instanced as entities or systems. Systems are subscribable by name on the graph so you can trigger outputs etc. Entities will have values set up and modified by systems e.g. adding movement and mass properties and then running simple newtonian mechanics to update vector values on the entities for a particle system. 

`import {Systems} from 'graphscript-services'` for some usable test systems. We demonstrated it with a Multithreaded 3D boids and attractors example in ThreeJS in [examples/workerECS](https://github.com/brainsatplay/graphscript/blob/master/examples/workerECS)

```ts


export type EntityProps = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & GraphNodeProperties
export type Entity = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & GraphNode


export type SystemProps = (RouteProp & { 
    __operator:(entities:{[key:string]:Entity})=>any,
    setupEntities:(entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(entity:Entity)=>Entity
}) & GraphNodeProperties


export type System = {
    __operator:(entities:{[key:string]:Entity})=>any,
    setupEntities:(entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(entity:Entity)=>Entity,
    remove?:(entity:Entity,entities:{[key:string]:Entity})=>Entity,
    entities:{[key:string]:Entity}, //the entities associated with this system 
    entityKeys:string[] //keys of entities associated with this system, reduces lookup times
} & GraphNode;

export type ECSOptions = {
    entities:{
        [key:string]:EntityProps
    },
    systems:{
        [key:string]:SystemProps
    },
    order?:string[] //system order of execution by key
} & ServiceOptions


```