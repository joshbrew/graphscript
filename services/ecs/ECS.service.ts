import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp, Routes } from '../Service';

//Entity Component System Service

//e.g.  physics bodies: collision check -> gravity check -> force/acceleration/velocity/position check -> render check, with values stored on entities for each system to access
// you can filter and selectively update systems in specific orders on demand or run on animation frames, you should build varied routines e.g. on-demand or on cycle based on use case

//ECS faq https://github.com/SanderMertens/ecs-faq

export type EntityProps = boolean|{
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & RouteProp | GraphNode

export type SystemProps = boolean|(RouteProp & { 
    operator:(self,origin,entities:{[key:string]:Entity})=>any,
    setupEntities:(self:any,entities:{[key:string]:Entity})=>void
})|GraphNode

export type Entity = {
    components:{ //which systems should call these entities?
        [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
    },
} & GraphNode

export type System = {
    operator:(self,origin,entities:{[key:string]:Entity})=>any,
    setupEntities:(self:any,entities:{[key:string]:Entity})=>void
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

    order:string[]=[] //order of execution for component updates

    animating=true;

    constructor(options:ECSOptions) {
        super(options);
        if(this.routes) this.load(this.routes);

        if(options.entities)
            for(const key in options.entities) {
                if(typeof options.entities[key] !== 'object') {
                    options.entities[key] = this.nodes.get(key);
                    if(!options.entities[key]) {
                        delete options.entities[key];
                        continue;
                    }
                }
                if(typeof options.entities[key] === 'object') {
                    if(!(options.entities[key] as any).components) {
                        (options.entities[key] as any).components = {}
                    }
                }
            }

        if(options.systems)
            for(const key in options.systems) {
                if(typeof options.systems[key] !== 'object') {
                    options.systems[key] = this.nodes.get(key);
                    if(!options.systems[key]) {
                        delete options.systems[key];
                        continue;
                    }
                }
                if(typeof options.systems[key] === 'object') {
                    
                }
            }

        if(!options.order) options.order = Object.keys(options.systems);
        this.order = options.order;

        this.load(this.entities);

        for(const key in options.entities) {
            options.entities = this.nodes.get((options.entities[key] as any).tag);
        }

        this.entities = options.entities as any;

        this.load(this.systems);

        this.order.forEach((key) => {
            options.systems[key] = this.nodes.get((options.systems[key] as any).tag);
            if((options.systems[key] as any)?.setupEntities) {
                (options.systems[key] as any).setupEntities((options.systems[key] as any),this.entities);
            }
        });

        this.systems = options.systems as any;
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
                        this.filterObject(this.entities,(key,entity)=>{ 
                            if(entity.components[k])
                                return true;
                        }));
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
        return Object.fromEntries(Object.entries(o).filter(([key,value]) => {filter(key,value)}));
    }

    addEntity(
        prototype:{[key:string]:any}={},
        components:{[key:string]:any}={}
    ) {
        const entity = this.recursivelyAssign({},prototype);
        entity.components = components;
        if(Object.keys(components).length === 0) {
            Object.keys(this.systems).forEach((k)=>{ //default init all systems if none provided, can let you quickly dump empty objects to setup entities
                components[k] = true;
            })
        }
        if(entity.tag && this.entities[entity.tag]) {
            entity.tag = `entity${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.load({[entity.tag]:entity});
        this.entities[entity.tag] = this.nodes.get(entity.tag) as any;

        this.setupEntities({[entity.tag]:this.entities[entity.tag]});

        return this.entities[entity.tag];
    }

    addSystem(
        prototype:{[key:string]:any}={}, 
        setup:(self:any,entities:any)=>any,
        update:(self:any,entities:any)=>any
    ) {
        const system = this.recursivelyAssign({},prototype);
        system.setupEntities = setup;
        system.operator = update;
        if(system.tag && this.systems[system.tag]) {
            system.tag = `system${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.load({[system.tag]:system});

        this.systems[system.tag] = this.nodes.get(system.tag) as any;

        if(system?.setupEntities) {
            system.setupEntities(system,this.filterObject(this.entities,(key,v)=>{if(v.components[system.tag]) return true;}))
        } 

        return this.systems[system.tag];
    }

    setupEntities(entities?:any,system?:any) {
        if(system) {
            if(!system?.setupEntities) return;
            if(entities) system.setupEntities(system,this.filterObject(entities,(k,v)=>{if(v.components[system.tag]) return true;}));
            else system.setupEntities(system,this.filterObject(this.entities,(k,v)=>{if(v.components[system.tag]) return true;}))
        } else {
            for(const key in this.systems) {
                if(!(this.systems[key] as any)?.setupEntities) continue;
                if(entities) (this.systems[key] as any).setupEntities(this.systems[key],this.filterObject(entities,(k,v)=>{if(v.components[key]) return true;}));
                else (this.systems[key] as any).setupEntities(this.systems[key],this.filterObject(this.entities,(k,v)=>{if(v.components[key]) return true;}))
            }
        }
    }

    removeEntity(tag:string) {
        delete this.entities[tag];
        return this.remove(tag);
    }

    removeSystem(tag:string) {
        delete this.systems[tag];
        return this.remove(tag);
    }


    routes:Routes = {
        update:this.update,
        animate:this.animate,
        start:this.start,
        stop:this.stop,
        addEntity:this.addEntity,
        addSystem:this.addSystem,
        removeEntity:this.removeEntity,
        removeSystem:this.removeSystem
    }
}

