import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp } from '../Service';

//Entity Component System Service

//e.g.  physics bodies: collision check -> gravity check -> force/acceleration/velocity/position check -> render check, with values stored on entities for each system to access
// you can filter and selectively update systems in specific orders on demand or run on animation frames, you should build varied routines e.g. on-demand or on cycle based on use case

//ECS faq https://github.com/SanderMertens/ecs-faq

export type ECSOptions = {
    entities:{
        [key:string]:boolean|{
            components:{ //which systems should call these entities?
                [key:string]:any //use the system key as the key, value can be a boolean or an object with values etc. use however just helps filter entities
            },
            [key:string]:any
        }
    },
    systems:{
        [key:string]: boolean|(GraphNode & { operator:(entities:{[key:string]:any})=>any })
    },
    order?:string[] //system order of execution by key
} & ServiceOptions

export class ECSService extends Service {

    entities:{
        [key:string]:GraphNode|({
            components:{ //entities keep a dict of toggled components that their properties can/should be mutated by, you can ignore it if you don't need it
                [key:string]:boolean
            }
        } & RouteProp)
    } = {}

    systems:{
        [key:string]: (RouteProp & { operator:(self,origin,entities:{[key:string]:any})=>any })|GraphNode //operators on components are used to make passes over entitites
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

        this.load(this.systems);

        for(const key in options.systems) {
            options.systems[key] = this.nodes.get((options.systems[key] as any)._id);
        }
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
        prototype:{[key:string]:any},
        components:{[key:string]:boolean}
    ) {
        const entity = Object.assign({},prototype);
        entity.components = components;
        if(entity._id && this.entities[entity._id]) {
            entity._id = `entity${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.load({[entity._id]:entity});
        this.entities[entity._id] = this.nodes.get(entity._id) as any;

        return this.entities[entity._id];
    }

    addComponent(
        prototype:{[key:string]:any}, 
        update:(entities:any)=>any
    ) {
        const system = Object.assign({},prototype);
        system.operator = update;
        if(system._id && this.systems[system._id]) {
            system._id = `component${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.load({[system._id]:system});

        this.systems[system._id] = this.nodes.get(system._id) as any;

        return this.systems[system._id];
    }

    removeEntity(id:string) {
        delete this.entities[id];
        return this.remove(id);
    }

    removeSystem(id:string) {
        delete this.systems[id];
        return this.remove(id);
    }
}

