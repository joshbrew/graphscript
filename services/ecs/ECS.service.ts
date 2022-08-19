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
    operator:(self,origin,entities:{[key:string]:any})=>any,
    setupEntities:(self:any,entities:{[key:string]:GraphNode})=>void
})|GraphNode

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
        [key:string]:EntityProps
    } = {}

    systems:{
        [key:string]: SystemProps
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
            options.entities = this.nodes.get((options.entities[key] as any)._id);
        }

        this.entities = options.entities as any;

        this.load(this.systems);

        for(const key in options.systems) {
            options.systems[key] = this.nodes.get((options.systems[key] as any)._id);
            if((options.systems[key] as any)?.setupEntities) {
                (options.systems[key] as any).setupEntities((options.systems[key] as any),this.entities);
            }
        }

        this.systems = options.systems as any;
    }

    //e.g. run on requestAnimationFrame
    update = (
        filter?:boolean, 
        order?:string[] //can only run specific systems and in specific orders
    ) => { //filter will only pass certain entities based on enabled components
        if(!order) order = this.order;
        
        order.forEach((k) => {
            if(this.systems[k]) {
                if(filter) {
                    (this.systems[k] as GraphNode).run(
                        this.filterObject(this.entities,(key,entity)=>{ 
                            if(entity.components[k])
                                return true;
                        }));
                } else (this.systems[k] as GraphNode).run(this.entities); //unfiltered, it's faster to handle this in the system with lots of entities
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
        if(entity._id && this.entities[entity._id]) {
            entity._id = `entity${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.load({[entity._id]:entity});
        this.entities[entity._id] = this.nodes.get(entity._id) as any;

        this.setupEntities({[entity._id]:this.entities[entity._id]});

        return this.entities[entity._id];
    }

    addSystem(
        prototype:{[key:string]:any}={}, 
        setup:(self:any,entities:any)=>any,
        update:(self:any,entities:any)=>any
    ) {
        const system = this.recursivelyAssign({},prototype);
        system.setupEntities = setup;
        system.operator = update;
        if(system._id && this.systems[system._id]) {
            system._id = `system${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.load({[system._id]:system});

        this.systems[system._id] = this.nodes.get(system._id) as any;

        if(system?.setupEntities) {
            system.setupEntities(system,this.filterObject(this.entities,(key,v)=>{if(v.components[system._id]) return true;}))
        } 

        return this.systems[system._id];
    }

    setupEntities(entities?:any,system?:any) {
        if(system) {
            if(!system?.setupEntities) return;
            if(entities) system.setupEntities(system,this.filterObject(entities,(k,v)=>{if(v.components[system._id]) return true;}));
            else system.setupEntities(system,this.filterObject(this.entities,(k,v)=>{if(v.components[system._id]) return true;}))
        } else {
            for(const key in this.systems) {
                if(!(this.systems[key] as any)?.setupEntities) continue;
                if(entities) (this.systems[key] as any).setupEntities(this.systems[key],this.filterObject(entities,(k,v)=>{if(v.components[key]) return true;}));
                else (this.systems[key] as any).setupEntities(this.systems[key],this.filterObject(this.entities,(k,v)=>{if(v.components[key]) return true;}))
            }
        }
    }

    removeEntity(id:string) {
        delete this.entities[id];
        return this.remove(id);
    }

    removeSystem(id:string) {
        delete this.systems[id];
        return this.remove(id);
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



export const Systems = {
    movement:{
        lastTime:Date.now(),
        setupEntities:(self:any,entities:any)=>{ //install needed data structures to entities
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self._id]) continue;

                if(!('mass' in entity)) entity.mass = 1;
                if(!entity.force) entity.force = {x:0,y:0,z:0};
                if(!('mass' in entity)) entity.mass = 1;
                if(!('gravity' in entity)) entity.gravity = -9.81; //m/s^2 on earth
                if(!entity.acceleration) entity.acceleration = {x:0,y:0,z:0};
                if(!entity.velocity) entity.velocity = {x:0,y:0,z:0};
                if(!entity.position) entity.position = {x:0,y:0,z:0};
            }
        },
        operator:(self, origin, entities:{[key:string]:GraphNode})=>{
            let now = Date.now();
            let timeStep = (now - self.lastTime) * 0.001;
            self.lastTime = now; 
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self._id]) continue;
                
                if(typeof entity.force === 'object' && entity.mass) {
                    if(entity.force.x) {
                        entity.accleration.x += entity.force.x*entity.mass*timeStep;
                        entity.force.x = 0;
                    }
                    if(entity.force.y) {
                        entity.accleration.y += entity.force.y*entity.mass*timeStep;
                        entity.force.y = 0;
                    }
                    if(entity.force.z) {
                        if(entity.gravity) {
                            entity.force.z += entity.gravity*entity.mass*timeStep;
                        }
                        entity.accleration.z += entity.force.z*entity.mass*timeStep;
                        entity.force.z = 0;
                    }
                }
                if(typeof entity.acceleration === 'object') {
                    if(entity.drag) { //e.g.
                        if(entity.accleration.x) entity.acceleration.x -= entity.acceleration.x*entity.drag*timeStep;
                        if(entity.accleration.y) entity.acceleration.y -= entity.acceleration.y*entity.drag*timeStep;
                        if(entity.accleration.z) entity.acceleration.z -= entity.acceleration.z*entity.drag*timeStep;
                    }
                    if(entity.accleration.x) entity.velocity.x += entity.accleration.x*timeStep;
                    if(entity.accleration.y) entity.velocity.y += entity.accleration.y*timeStep;
                    if(entity.accleration.z) entity.velocity.z += entity.accleration.z*timeStep;

                }
                if(typeof entity.velocity === 'object') {
                    if(entity.velocity.x) entity.position.x += entity.velocity.x*timeStep;
                    if(entity.velocity.y) entity.position.y += entity.velocity.y*timeStep;
                    if(entity.velocity.z) entity.position.z += entity.velocity.z*timeStep;
                }
            }
        }
    } as SystemProps
} as {[key:string]:SystemProps}