import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp, Routes } from '../Service';

//Entity Component System Service

//e.g.  physics bodies: collision check -> gravity check -> force/acceleration/velocity/position check -> render check, with values stored on entities for each system to access
// you can filter and selectively update systems in specific orders on demand or run on animation frames, you should build varied routines e.g. on-demand or on cycle based on use case

//ECS faq https://github.com/SanderMertens/ecs-faq

export type EntityProps = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & RouteProp | GraphNode

export type SystemProps = (RouteProp & { 
    operator:(self,origin,entities:{[key:string]:Entity})=>any,
    setupEntities:(self:any,entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(self:any,entity:Entity)=>Entity
})|GraphNode

export type Entity = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & GraphNode

export type System = {
    operator:(self,origin,entities:{[key:string]:Entity})=>any,
    setupEntities:(self:any,entities:{[key:string]:Entity})=>{[key:string]:Entity},
    setupEntity:(self:any,entity:Entity)=>Entity
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

export class ECSService extends Service {

    entities:{
        [key:string]:Entity
    } = {}

    systems:{
        [key:string]: System
    } = {}

    map = new Map<string,{[key:string]:Entity}>(); //maps of filtered entity objects based on system tag. e.g. this.maps.get('boids')['entity3'];

    order:string[]=[] //order of execution for component updates

    animating=true;

    constructor(options?:ECSOptions) {
        super(options);
        if(this.routes) this.load(this.routes);

        if(options.systems)
            for(const key in options.systems) {
                this.addSystem(options.systems[key], undefined, undefined, options.order);
            }

        if(options.entities) {
            for(const key in options.entities) {
                this.addEntity(options.entities[key],options.entities[key].components)
            }
        }

    }

    //e.g. run on requestAnimationFrame
    updateEntities = (
        order?:string[], //can only run specific systems and in specific orders
        filter?:boolean 
    ) => { //filter will only pass certain entities based on enabled components
        if(!order) order = this.order;
        
        order.forEach((k) => {
            if(this.systems[k]) {
                if(filter) {
                    (this.systems[k] as GraphNode)._run(this.systems[k] as GraphNode,this,
                        this.mapped.get(k));
                } else (this.systems[k] as GraphNode)._run(this.systems[k] as GraphNode,this,this.entities); //unfiltered, it's faster to handle this in the system with lots of entities
            }
        });
    }

    animate = (filter?:boolean,order?:string[]) => {
        requestAnimationFrame(()=>{
            if(this.animating){ 
                this.update(filter,order);
                this.animate(filter,order);
            }
        });
    }

    stop = () => {
        this.animating = false;
    }

    start = (filter?:boolean) => {
        this.animating = true;
        this.animate(filter);
    }

    filterObject(o:{[key:string]:any},filter:(string,any)=>boolean|undefined) {
        return Object.fromEntries(
                    Object.entries(o)
                        .filter(([key,value]) => { filter(key,value)} )
                    );
    }

    //buffer numbers stored on entities, including iterable objects or arrays. 
    //  It's much faster to buffer and use transfer than sending the objects, 
    //    and even faster to store everything in typed arrays altogether and use entities to index array locations
    bufferEntityProps = (
        entities:{[key:string]:Entity}, 
        property:string, //e.g. 'position'
        keys?:string[]|{[key:string]:any}, //e,g, ['x','y','z'] or {x,y,z}, pass an array to ensure the correct order
        buffer?:ArrayBufferLike //if you pass a premade buffer, make sure it's the right size
    ) => {
        if(!Array.isArray(keys) && typeof keys === 'object') 
            keys = Object.keys(keys); 
        if(!buffer) {
            if(keys)
                buffer = new Float32Array(Object.keys(entities).length*keys.length)
            else buffer = new Float32Array(Object.keys(entities).length);
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
            else buffer[i] = entities[key][property];
           }
        }   

        return buffer;
    }

    addEntities( //add multiple entities from the same prototype;
        prototype:EntityProps,
        components:{[key:string]:any}={},
        count:number=1,
    ) {
        let i = 0;

        let newEntities = {};

        while(i < count) {
            let entity = this.addEntity(
                prototype,
                components
            );

            newEntities[entity.tag] = entity;

            i++;
        }

        return newEntities;
    }

    addEntity(
        prototype:EntityProps={} as EntityProps,
        components:{[key:string]:any}={}
    ) {
        if(!prototype) return;
        const entity = this.recursivelyAssign({},prototype);
        entity.components = components;
        if(Object.keys(components).length === 0) {
            Object.keys(this.systems).forEach((k)=>{ //default init all systems if none provided, can let you quickly dump empty objects to setup entities
                components[k] = true;
            })
        }
        if(entity.tag && this.entities[entity.tag]) {
            entity.tag = `entity${Math.floor(Math.random()*1000000000000000)}`;
        } else if(!entity.tag) entity.tag = `entity${Math.floor(Math.random()*1000000000000000)}`;

        this.load({[entity.tag]:entity});
        this.entities[entity.tag] = this.nodes.get(entity.tag) as any;

        this.setupEntity(this.entities[entity.tag])

        return this.entities[entity.tag];
    }

    addSystems(
        systems:{[key:string]:SystemProps}={}, 
        order?:string[]    
    ) {
        for(const key in systems) {
            this.addSystem(systems[key],undefined,undefined,order)
        }

        return this.systems;
    }

    addSystem(
        prototype:SystemProps, 
        setup?:(self:any,entities:any)=>any,
        update?:(self:any,entities:any)=>any,
        order?:string[]
    ) {
        if(!prototype) return;
        const system = this.recursivelyAssign({},prototype);
        if(setup) system.setupEntities = setup;
        if(update) system.operator = update;
        if(system.tag && this.systems[system.tag]) {
            system.tag = `system${Math.floor(Math.random()*1000000000000000)}`;
        } else if(!system.tag) system.tag = `system${Math.floor(Math.random()*1000000000000000)}`;

        this.load({[system.tag]:system});

        this.systems[system.tag] = this.nodes.get(system.tag) as any;
        if(!this.map.get(system.tag)) this.map.set(system.tag, {}); //map to track local entities

        if(this.systems[system.tag]?.setupEntities) {
            let filtered = this.filterObject(this.entities,(key,v)=>{if(v.components[system.tag]) return true;});
            this.systems[system.tag].setupEntities(system,filtered);
            Object.assign(this.map.get(system.tag),filtered);
        } 

        if(!order) this.order.push(system.tag);
        else this.order = order;

        return this.systems[system.tag];
    }

    setupEntity(entity:Entity) {
        if(entity?.components) {
            for(const key in entity.components) {
                if(this.systems[key]) {
                    this.systems[key].setupEntity(this.systems[key], entity);
                    this.map.get(key)[entity.tag] = entity;
                }
            }
        }
    }

    removeEntity(tag:string) {
        const entity = this.entities[tag];
        for(const key in entity.components) {
            if (this.map.get(key)) delete this.map.get(key)[entity.tag];
        }
        delete this.entities[tag];
        return this.remove(tag);
    }

    removeSystem(tag:string) {
        delete this.systems[tag];
        this.map.delete(tag);
        this.order.splice(this.order.indexOf(tag),1);
        return this.remove(tag);
    }


    routes:Routes = {
        animateEntities:this.animate,
        startEntityAnimation:this.start,
        stopEntityAnimation:this.stop,
        addEntity:this.addEntity,
        addSystem:this.addSystem,
        removeEntity:this.removeEntity,
        removeSystem:this.removeSystem,
        setupEntity:this.setupEntity,
        addEntities:this.addEntities,
        filterObject:this.filterObject
    }
}

