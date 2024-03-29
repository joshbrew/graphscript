import { GraphNode, GraphNodeProperties } from '../../core/Graph';
import { Service, ServiceOptions } from '../Service';

//Entity Component System Service

//e.g.  physics bodies: collision check -> gravity check -> force/acceleration/velocity/position check -> render check, with values stored on entities for each system to access
// you can filter and selectively update systems in specific orders on demand or run on animation frames, you should build varied routines e.g. on-demand or on cycle based on use case

//ECS faq https://github.com/SanderMertens/ecs-faq

export type EntityProps = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & (GraphNodeProperties | GraphNode)

export type SystemProps = (GraphNodeProperties & { 
    __operator:(entities:{[key:string]:Entity})=>any,
    setupEntities:(entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(entity:Entity)=>Entity
})|GraphNode

export type Entity = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
    [key:string]:any
} & GraphNode

export type System = {
    __operator:(entities:{[key:string]:Entity})=>any,
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
    order?:string[], //system order of execution by key
    [key:string]:any
} & ServiceOptions

export class ECSService extends Service {

    entities:{
        [key:string]:Entity
    } = {};

    systems:{
        [key:string]: System
    } = {};

    entityMap = new Map<string,{[key:string]:Entity}>(); //maps of filtered entity objects based on system tag. e.g. this.maps.get('boids')['entity3'];
    entityKeyMap = new Map<string, string[]>(); //arrays of keys of entities belonging to each system, for lookup

    order:string[]=[] //order of execution for component updates

    animating=false;

    entityCt = 0;
    systemCt = 0;

    constructor(options?:ECSOptions) {
        super(options);
        this.load(this);

        if(options?.systems)
            for(const key in options.systems) {
                this.addSystem(options.systems[key], undefined, undefined, undefined, undefined, options.order);
            }

        if(options?.entities) {
            for(const key in options.entities) {
                this.addEntity(options.entities[key],options.entities[key].components)
            }
        }

    }

    //e.g. run on requestAnimationFrame
    updateEntities = (
        order:string[] = this.order, //can only run specific systems and in specific orders
        filter?:boolean,
        debug=false as any
    ) => { //filter will only pass certain entities based on enabled components
        
        order.forEach((k) => {
            if(this.systems[k]) {
                if(filter) {
                    if(debug) debug = performance.now();
                    if(this.entityKeyMap.get(k).length > 0)
                        (this.systems[k] as GraphNode).__operator(
                            this.entityMap.get(k)
                        );
                    if(debug) 
                        console.log( 'system', k, 'took', performance.now()-debug,'ms for', Object.keys(this.entityMap.get(k)).length, 'entities');
                } else {
                    if(debug) debug = performance.now();
                    if(this.entityKeyMap.get(k).length > 0)
                        (this.systems[k] as GraphNode).__operator(
                            this.entities
                        ); //unfiltered, it's faster to handle this in the system with lots of entities
                    if(debug) 
                        console.log( 'system', k, 'took', performance.now()-debug,'ms for', Object.keys(this.entities).length, 'entities');
                }
            }
        });

        //console.log('updated',this.entities,this.systems)
    }

    animateEntities = (filter:boolean=true,order?:string[]) => {
        //console.log('animate entities')
        if(!this.animating) {
            this.animating = true;
            if(typeof requestAnimationFrame !== 'undefined') {
                let anim = () => {
                    requestAnimationFrame(()=>{
                        if(this.animating){ 
                            this.updateEntities(order,filter);
                            anim();
                            
                        }
                    });
                }
                anim();
            } else {
                let looper = () => {
                    setTimeout(async ()=>{
                        if(this.animating){ 
                            this.updateEntities(order,filter);
                            looper();
                        }
                    },10);
                }
                looper();
            }
        }
    }

    stop = () => {
        this.animating = false;
    }

    start = (filter?:boolean) => {
        this.animateEntities(filter);
    }

    addEntities = ( //add multiple entities from the same prototype;
        prototype:EntityProps,
        components:{[key:string]:any}={},
        count:number=1,
    ) => {
        let i = 0;

        let newEntities = {};


        while(i < count) {
            let entity = this.addEntity(
                prototype,
                components
            );

            newEntities[entity.__node.tag] = entity;

            i++;
        }

        return Object.keys(newEntities);
    }

    addEntity = (
        prototype:EntityProps={} as EntityProps,
        components:{[key:string]:any}={}
    ) => {
        if(!prototype) return;
        const entity = this.recursivelyAssign({},prototype) as Entity;
        entity.components = components;
        if(Object.keys(components).length === 0) {
            Object.keys(this.systems).forEach((k)=>{ //default init all systems if none provided, can let you quickly dump empty objects to setup entities
                components[k] = true;
            })
        }
        if(!entity.__node) entity.__node = {} as any;
        if(entity.__node.tag && this.entities[entity.__node.tag]) {
            this.entityCt++;
            let tag = entity.__node.tag+this.entityCt;
            while(this.entities[entity.__node.tag]) {
                this.entityCt++;
                entity.__node.tag = `${tag}${this.entityCt}`;
            }
        } else if(!entity.__node.tag) entity.__node.tag = `entity${Math.floor(Math.random()*1000000000000000)}`;

        this.add(entity);
        this.entities[entity.__node.tag] = this.__node.nodes.get(entity.__node.tag) as any;

        //console.log(entity,'added')

        this.setupEntity(this.entities[entity.__node.tag])

        return this.entities[entity.__node.tag];
    }

    addSystems = (
        systems:{[key:string]:SystemProps}={}, 
        order?:string[]    
    ) => {

        for(const key in systems) {
            systems[key].__node.tag = key;
            this.addSystem(systems[key],undefined,undefined,undefined,undefined,order)
        }
        return this.systems;
    }

    addSystem = (
        prototype:SystemProps, 
        setupEntities?:(entities:{[key:string]:Entity})=>any, //group rules
        setupEntity?:(entity:Entity)=>any, //single entity rules
        operator?:(entities:any)=>any,
        remove?:(entities:any)=>any,
        order?:string[]
    ) => {
        if(!prototype) return;
        const system = this.recursivelyAssign({},prototype) as System;
        if(setupEntities) system.setupEntities = setupEntities;
        if(setupEntity) system.setupEntity = setupEntity;
        if(operator) system.__operator = operator;
        if(remove) system.remove = remove;
        if(system.__node.tag && this.systems[system.__node.tag]) {
            this.systemCt++;
            let tag = system.__node.tag+this.systemCt;
            while(this.systems[system.__node.tag]) {
                this.systemCt++;
                system.__node.tag = `${tag}${this.systemCt}`;
            }
        } else if(!system.__node.tag) system.__node.tag = `system${Math.floor(Math.random()*1000000000000000)}`;

        this.add(system);

        this.systems[system.__node.tag] = this.__node.nodes.get(system.__node.tag) as any;

        if(!this.entityMap.get(system.__node.tag)) this.entityMap.set(system.__node.tag, {}); //map to track local entities
        if(!this.entityKeyMap.get(system.__node.tag)) this.entityKeyMap.set(system.__node.tag, []); //map to track arrays of entity keys to remove redundancy
        this.systems[system.__node.tag].entities = this.entityMap.get(system.__node.tag); //shared object ref
        this.systems[system.__node.tag].entityKeys = this.entityKeyMap.get(system.__node.tag); //shared key ref
        if(this.systems[system.__node.tag]?.setupEntities && Object.keys(this.entities).length > 1) {
            let filtered = this.filterObject(this.entities,(key,v)=>{if(v.components[system.__node.tag]) return true;});
            this.systems[system.__node.tag].setupEntities(filtered);
            Object.assign(this.entityMap.get(system.__node.tag),filtered);
        } 

        if(!order) this.order.push(system.__node.tag);
        else this.order = order;

        return this.systems[system.__node.tag];
    }

    setupEntity = (entity:Entity) => {
        if(entity?.components) {
            for(const key in entity.components) {
                if(this.systems[key]) {
                    this.systems[key].setupEntity(entity);
                    this.entityMap.get(key)[entity.__node.tag] = entity;
                    this.entityKeyMap.get(key).push(entity.__node.tag);
                    // entity.nodes.set(key,this.systems[key]); //this is really probably gonna slow things down when adding/subtracting so we can use the local objects in the service which are pretty straightforward
                    // this.systems[key].nodes.set(entity.tag,entity);
                }
            }
        }
    }

    removeEntity = (tag:string) => {
        const entity = this.entities[tag];
        for(const key in entity.components) {
            if (this.entityMap.get(key)) {
                delete this.entityMap.get(key)[entity.__node.tag];
                this.entityKeyMap.get(key).splice(this.entityKeyMap.get(key).indexOf(entity.__node.tag),1);
            }
            if(this.systems[key]?.remove) {
                this.systems[key].remove(entity,this.entityMap.get(key));
            }   
        }
        delete this.entities[tag];
        return this.remove(tag);
    }

    removeEntities(entities:string[]|{[key:string]:Entity}) {
        if(!Array.isArray(entities)) entities = Object.keys(entities);
        entities.forEach((t) => {
            this.removeEntity(t);
        })
    }

    removeSystem = (tag:string) => {
        if(this.systems[tag]?.remove) {
            for(const e in this.entityKeyMap.get(tag)) { //run the remove routine over the system entities to run any desired cleanup
                this.systems[tag].remove(this.entityMap.get(tag)[e],this.entityMap.get(tag));
            }
        }
        delete this.systems[tag];
        this.entityMap.delete(tag);
        this.entityKeyMap.delete(tag);
        this.order.splice(this.order.indexOf(tag),1);
        return this.remove(tag);
    }

    filterObject(o:{[key:string]:any},filter:(string,any)=>boolean|undefined) {
        return Object.fromEntries(
                    Object.entries(o)
                        .filter(([key,value]) => { filter(key,value)} )
                    );
    }

    setEntities = (entities:{[key:string]:Entity}|string[],props:{[key:string]:any}) => {
        if(Array.isArray(entities)) {
            entities.forEach((k) => {
                if(this.entities[k]) this.recursivelyAssign(this.entities[k],props);
            })
        } else {
            for(const key in this.entities) {
                this.setEntity(this.entities[key],props);
            }
        }
        return true;
    }

    setEntity = (entity:Entity,props:{[key:string]:any}) => {
        return this.recursivelyAssign(entity,props);
    }
    

    //buffer numbers stored on entities, including iterable objects or arrays. 
    //  It's much faster to buffer and use transfer than sending the objects raw over threads as things are jsonified inbetween otherwise, 
    //    and even faster to store everything in typed arrays altogether and use entities to index array locations
    bufferValues = (
        entities:{[key:string]:Entity}, 
        property:string, //e.g. 'position'
        keys?:string[]|{[key:string]:any}, //e,g, ['x','y','z'] or {x,y,z}, pass an array to ensure the correct order
        buffer?:ArrayBufferLike //if you pass a premade buffer, make sure it's the right size
    ) => {
        if(!Array.isArray(keys) && typeof keys === 'object') 
            keys = Object.keys(keys); 
        if(!buffer) {
            let entkeys = Object.keys(entities);
            if(keys)
                buffer = new Float32Array(entkeys.length*keys.length)
            else {
                if(typeof entities[entkeys[0]][property] === 'object') {
                    keys = Object.keys(entities[entkeys[0]][property]);
                    buffer = new Float32Array(entkeys.length*keys.length);
                }
                else buffer = new Float32Array(entkeys.length);
            }
        }
        let i = 0;
        for(const key in entities) {
           if(entities[key][property]) {
            if(keys) {
                for(let j = 0; j < keys.length; j++) {
                    buffer[i] = entities[key][property][keys[j]];
                    i++;
                }
            }
            else {
                buffer[i] = entities[key][property];
                i++
            }
           }
        }   

        return buffer;
    }

}

