import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp } from '../Service';

//Entity Component System Service

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
        [key:string]: boolean|(RouteProp & { operator:(self,origin,entities:{[key:string]:any})=>any })|GraphNode //operators on components are used to make passes over entitites
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
                    if(!options.entities[key]) delete options.entities[key];
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
                    if(!options.systems[key]) delete options.systems[key];
                }
                if(typeof options.systems[key] === 'object') {
                }
            }

        if(!options.order) options.order = Object.keys(options.systems);
        this.order = options.order;

        this.load(this.entities);
        this.load(this.systems);
    }

    //e.g. run on requestAnimationFrame
    update = (filter?:boolean) => {
        this.order.forEach((k) => {
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

    animate = (filter?:boolean) => {
        requestAnimationFrame(()=>{
            if(this.animating){ 
                this.update(filter);
                this.animate(filter);
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
        this.entities[entity._id] = entity as any;

        this.load({[entity._id]:entity});
    
    }

    addComponent(
        prototype:{[key:string]:any}, 
        update:(entities:any)=>any
    ) {
        const system = Object.assign({},prototype);
        system.operator = update;
        if(system._id && this.entities[system._id]) {
            system._id = `component${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.systems[system._id] = this.add(system as any) as GraphNode;

        this.load({[system._id]:system});
    }

}

