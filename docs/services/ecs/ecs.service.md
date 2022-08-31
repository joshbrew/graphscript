


```ts


export type EntityProps = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & RouteProp | GraphNode

export type SystemProps = (RouteProp & { 
    operator:(entities:{[key:string]:Entity})=>any,
    setupEntities:(entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(entity:Entity)=>Entity
})|GraphNode

export type Entity = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & GraphNode

export type System = {
    operator:(entities:{[key:string]:Entity})=>any,
    setupEntities:(entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(entity:Entity)=>Entity,
    remove?:(entity:Entity,entitities:{[key:string]:Entity})=>Entity,
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