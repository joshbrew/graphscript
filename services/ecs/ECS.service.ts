import { Graph, GraphNode } from '../../Graph';
import { Service, ServiceOptions } from '../Service';

//Entity Component System Service

export type ECSOptions = {
    entities:{
        [key:string]:boolean|{
            components:{
                [key:string]:boolean
            },
            [key:string]:any
        }
    },
    components:{
        [key:string]: boolean|(GraphNode & { operator:(entities:{[key:string]:any})=>any })
    },
    order:string[] //component order of execution by key
} & ServiceOptions

export class ECSService extends Service {

    entities:{
        [key:string]:GraphNode|{
            components:{ //entities keep a dict of toggled components that their properties can/should be mutated by, you can ignore it if you don't need it
                [key:string]:boolean
            },
            [key:string]:any
        }
    } = {}

    components:{
        [key:string]: boolean|(GraphNode & { operator:(self,origin,entities:{[key:string]:any})=>any }) //operators on components are used to make passes over entitites
    } = {}

    order:string[]=[] //order of execution for component updates

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

                    if(!(options.entities[key] instanceof GraphNode)) {
                        this.add(options.entities[key] as any)
                    }
                }
            }

        if(options.components)
            for(const key in options.components) {
                if(typeof options.components[key] !== 'object') {
                    options.components[key] = this.nodes.get(key);
                    if(!options.components[key]) delete options.components[key];
                }
                if(typeof options.components[key] === 'object') {
                    if(!(options.components[key] instanceof GraphNode)) {
                        this.add(options.components[key] as any)
                    }
                }
            }
    }

    //e.g. run on requestAnimationFrame
    update = () => {
        this.order.forEach((k) => {
            if(this.components[k]) {
                (this.components[k] as GraphNode).run(this.entities);
            }
        });
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
    
    }

    addComponent(
        prototype:{[key:string]:any}, 
        update:(entities:any)=>any
    ) {
        const component = Object.assign({},prototype);
        component.operator = update;
        if(component._id && this.entities[component._id]) {
            component._id = `component${Math.floor(Math.random()*1000000000000000)}`;
        }

        this.components[component._id] = this.add(component as any) as GraphNode;
    }

}

