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
    update = (
        filter?:boolean, 
        order?:string[] //can only run specific systems and in specific orders
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


export const Systems = {
    //geometry:{} as SystemProps, //include mesh rotation functions and stuff
    collision:{ //e.g. https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
        //lastTime:performance.now(),
        setupEntities:(self,entities:{[key:string]:GraphNode})=>{
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;

                Systems.collision.setEntity(entity);
            }
        },
        setEntity:(entity:GraphNode) => {
            if(!('collisionEnabled' in entity)) entity.collisionEnabled = true;
            if(!entity.collisionType) entity.collisionType = 'sphere' //sphere, box, point
            if(!entity.collisionRadius) entity.collisionRadius = 1;
            if(!entity.collisionBoundsScale) entity.collisionBoundsScale = {x:1,y:1,z:1}; //x,y,z dimensions * collision radius, e.g. a box has +x and -x bounds based on these constraints
            if(!entity.colliding) entity.colliding = {} //key:boolean
            if(!entity.position) entity.position = { x:0, y:0, z:0 };
        },
        operator:(
            self,
            origin,
            entities:{[key:string]:GraphNode}
        )=>{
            for(const key in entities) {
                const entity1 = entities[key];
                if(entity1.components) if(!entity1.components[self.tag] || !entity1.collisionEnabled) continue;
                if(!entity1.collisionEnabled) continue;
                for(const key2 in entities) {
                    const entity2 = entities[key2];
                    if(entity2.components) if(!entity2.components[self.tag]) continue;
                    if(!entity2.collisionEnabled) continue;
                 
                    let colliding = Systems.collision.collisionCheck(entity1,entity2); //returns distance from origin if colliding (to reduce redundancy later)
                    if(colliding !== false) {
                        entity1.colliding[entity2.tag] = colliding;
                        entity2.colliding[entity1.tag] = colliding;
                    }
                }
            }
            return entities;
            //now resolve the collisions e.g. relative displacement + mass-force vectors to pass to the movement system
        },
        collisionCheck:(
            body1:{
                position:{x:number,y:number,z:number},
                collisionEnabled?:boolean,
                collisionType:'sphere'|'box'|'point',
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            body2:{
                position:{x:number,y:number,z:number},
                collisionEnabled?:boolean,
                collisionType:'sphere'|'box'|'point',
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            }
        )=>{
            if(body1.collisionEnabled === false || body2.collisionEnabled === false) return false;

            //Check if within a range close enough to merit a collision check

            const dist = Systems.collision.distance(body1.position,body2.position);

            if(
                dist < (   
                    Math.max(...Object.values(body1.collisionBoundsScale))*body1.collisionRadius + 
                    Math.max(...Object.values(body2.collisionBoundsScale))*body2.collisionRadius
                )
            ) {
                //Do collision check
                let isColliding = false;
                if(body1.collisionType === "sphere") {
                    if(body2.collisionType === "sphere") { isColliding = Systems.collision.sphereCollisionCheck(body1,body2,dist);}
                    else if(body2.collisionType === "box") { isColliding = Systems.collision.sphereBoxCollisionCheck(body1,body2,dist);}
                    else if(body2.collisionType === "point") { isColliding = Systems.collision.isPointInsideSphere(body2.position,body1,dist);}
                }
                else if(body1.collisionType === "box" ) {
                    if(body2.collisionType === "sphere") { isColliding = Systems.collision.sphereBoxCollisionCheck(body2,body1,dist);}
                    else if(body2.collisionType === "box") { isColliding = Systems.collision.boxCollisionCheck(body1,body2);}
                    else if(body2.collisionType === "point") { isColliding = Systems.collision.isPointInsideBox(body1.position,body1); }
                }
                else if (body1.collisionType === "point") {
                    if(body2.collisionType === "sphere") { isColliding = Systems.collision.isPointInsideSphere(body1.position,body2,dist); }
                    else if(body2.collisionType === "box") { isColliding = Systems.collision.isPointInsideBox(body1.position,body2); }
                }

                if(isColliding) return dist;
            }
            return false
        },
        sphereCollisionCheck:(
            body1:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            body2:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            dist?:number
        )=>{
            if(dist === undefined) dist = Systems.collision.distance(body1.position,body2.position);

            return (dist as number) < (body1.collisionRadius + body2.collisionRadius);
        },
        boxCollisionCheck:(
            body1:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            body2:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            }
        )=>{
            let body1minX = (body1.position.x-body1.collisionRadius)*body1.collisionBoundsScale.x;
            let body1maxX = (body1.position.x+body1.collisionRadius)*body1.collisionBoundsScale.x;
            let body1minY = (body1.position.y-body1.collisionRadius)*body1.collisionBoundsScale.y;
            let body1maxY = (body1.position.y+body1.collisionRadius)*body1.collisionBoundsScale.y;
            let body1minZ = (body1.position.z-body1.collisionRadius)*body1.collisionBoundsScale.z;
            let body1maxZ = (body1.position.z+body1.collisionRadius)*body1.collisionBoundsScale.z;
    
            let body2minX = (body2.position.x-body2.collisionRadius)*body1.collisionBoundsScale.x;
            let body2maxX = (body2.position.x+body2.collisionRadius)*body1.collisionBoundsScale.x;
            let body2minY = (body2.position.y-body2.collisionRadius)*body1.collisionBoundsScale.y;
            let body2maxY = (body2.position.y+body2.collisionRadius)*body1.collisionBoundsScale.y;
            let body2minZ = (body2.position.z-body2.collisionRadius)*body1.collisionBoundsScale.z;
            let body2maxZ = (body2.position.z+body2.collisionRadius)*body1.collisionBoundsScale.z;
    
            return  (
                        ((body1maxX <= body2maxX && body1maxX >= body2minX) || (body1minX <= body2maxX && body1minX >= body2minX)) &&
                        ((body1maxY <= body2maxY && body1maxY >= body2minY) || (body1minY <= body2maxY && body1minY >= body2minY)) &&
                        ((body1maxZ <= body2maxZ && body1maxZ >= body2minZ) || (body1minZ <= body2maxZ && body1minZ >= body2minZ))
                    );
        },
        sphereBoxCollisionCheck:(
            sphere:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            box:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            dist?:number
        )=>{
            let boxMinX = (box.position.x-box.collisionRadius)*box.collisionBoundsScale.x;
            let boxMaxX = (box.position.x+box.collisionRadius)*box.collisionBoundsScale.x;
            let boxMinY = (box.position.y-box.collisionRadius)*box.collisionBoundsScale.y;
            let boxMaxY = (box.position.y+box.collisionRadius)*box.collisionBoundsScale.y;
            let boxMinZ = (box.position.z-box.collisionRadius)*box.collisionBoundsScale.z;
            let boxMaxZ = (box.position.z+box.collisionRadius)*box.collisionBoundsScale.z;
    
            //let direction = Math.makeVec(sphere.position,box.position);
    
            //Get closest point to sphere center
            let clamp = {
                x:Math.max(boxMinX, Math.min(sphere.position.x, boxMaxX)),
                y:Math.max(boxMinY, Math.min(sphere.position.y, boxMaxY)),
                z:Math.max(boxMinZ, Math.min(sphere.position.z, boxMaxZ))
            };
    
            if(dist === undefined) dist = Systems.collision.distance(sphere.position,clamp);
    
            return (dist as number) > sphere.collisionRadius;
        },
        isPointInsideSphere:(
            point:{x:number,y:number,z:number},
            sphere:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            },
            dist?:number
        )=>{
            if(dist === undefined) dist = Systems.collision.distance(point,sphere.position);

            return (dist as number) < sphere.collisionRadius;
        },
        isPointInsideBox:(
            point:{x:number,y:number,z:number},
            box:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            }
        )=>{
            //should precompute these for speed with Box objects as reference
            let boxminX = (box.position.x-box.collisionRadius)*box.collisionBoundsScale.x;
            let boxmaxX = (box.position.x+box.collisionRadius)*box.collisionBoundsScale.x;
            let boxminY = (box.position.y-box.collisionRadius)*box.collisionBoundsScale.x;
            let boxmaxY = (box.position.y+box.collisionRadius)*box.collisionBoundsScale.x;
            let boxminZ = (box.position.z-box.collisionRadius)*box.collisionBoundsScale.x;
            let boxmaxZ = (box.position.z+box.collisionRadius)*box.collisionBoundsScale.x;

            return  (point.x >= boxminX && point.x <= boxmaxX) &&
                    (point.y >= boxminY && point.y <= boxmaxY) &&
                    (point.z >= boxminZ && point.z <= boxmaxZ);
        },
        closestPointOnLine:(
            point:{x:number,y:number,z:number},
            lineStart:{x:number,y:number,z:number},
            lineEnd:{x:number,y:number,z:number},
        )=>{
            let a = {x:lineEnd.x-lineStart.x,y:lineEnd.y-lineStart.y,z:lineEnd.z-lineStart.z};
            let b = {x:lineStart.x-point.x,y:lineStart.y-point.y,z:lineStart.z-point.z};
            let c = {x:lineEnd.x-point.x,y:lineEnd.y-point.y,z:lineEnd.z-point.z};
            let bdota = Systems.collision.dot(b,a);
            if(bdota <= 0) return lineStart;
            let cdota = Systems.collision.dot(c,a);
            if(cdota <= 0) return lineEnd;
            let _bdotapluscdota = 1/(bdota+cdota);
            return {
                x:lineStart.x + ((lineEnd.x-lineStart.x)*bdota)*_bdotapluscdota,
                y:lineStart.y + ((lineEnd.y-lineStart.y)*bdota)*_bdotapluscdota,
                z:lineStart.z + ((lineEnd.z-lineStart.z)*bdota)*_bdotapluscdota
            };
        },
        closestPointOnPolygon:(
            point:{x:number,y:number,z:number},
            t0:{x:number,y:number,z:number},
            t1:{x:number,y:number,z:number},
            t2:{x:number,y:number,z:number}
        )=>{
            //Find the normal of the polygon
            let n = Systems.collision.calcNormal(t0,t1,t2);
            //Find the distance from point to the plane given the normal
            let dist = Systems.collision.dot(point,n) - Systems.collision.dot(t0,n);
            //project p onto the plane by stepping from p to the plane
            let projection = Systems.collision.vecadd(point,Systems.collision.vecscale(n,-dist));

            //compute edge vectors
            let v0x = t2[0] - t0[0];
            let v0y = t2[1] - t0[1];
            let v0z = t2[2] - t0[2];
            let v1x = t1[0] - t0[0];
            let v1y = t1[1] - t0[1];
            let v1z = t1[2] - t0[2];
            let v2x = projection[0] - t0[0];
            let v2y = projection[1] - t0[1];
            let v2z = projection[2] - t0[2];

            //compute dots
            let dot00 = v0x*v0x+v0y*v0y+v0z*v0z;
            let dot01 = v0x*v1x+v0y*v1y+v0z*v1z;
            let dot02 = v0x*v2x+v0y*v2y+v0z*v2z;
            let dot11 = v1x*v1x+v1y*v1y+v1z*v1z;
            let dot12 = v1x*v2x+v1y*v2y+v1z*v2z;

            //compute barycentric coords (uvs) of projection point
            let denom = dot00*dot11 - dot01*dot01;
            if(Math.abs(denom) < 1e-30) {
                return undefined; //unusable
            }
            let _denom = 1/denom;
            let u = (dot11*dot02 - dot01*dot12)*_denom;
            let v = (dot00*dot12 - dot01*dot02)*_denom;

            //check uv coordinates for validity
            if((u >= 0) && (v >= 0) && (u+v<1)) {
                return projection;
            } else return undefined; //nearest orthogonal point is outside triangle

        },
        calcNormal:(
            t0:{x:number,y:number,z:number},
            t1:{x:number,y:number,z:number},
            t2:{x:number,y:number,z:number},
            positive=true
        )=>{
            var QR = Systems.collision.makeVec(t0,t1);
            var QS = Systems.collision.makeVec(t0,t2);
    
            if(positive === true){
                return Systems.collision.normalize(Systems.collision.cross3D(QR,QS));
            }
            else {
                return Systems.collision.normalize(Systems.collision.cross3D(QS,QR));
            }
        },
        dot:(
            v1:any,
            v2:any
        )=>{
            let dot = 0;
            for(const key in v1) {
                dot += v1[key]*v2[key];
            }
            return dot;
        },
        makeVec(
            p1:{x:number,y:number,z:number},
            p2:{x:number,y:number,z:number}
        ) {
            return {
                x:p2.x-p1.x,
                y:p2.y-p1.y,
                z:p2.z-p1.z
            };
        },
        vecadd:(
            v1:any,
            v2:any
        )=>{ //v1+v2
            let result = Object.assign({},v1);
            for(const key in result) {
                result[key] += v2[key];
            }
            return result;
        },
        vecsub:(
            v1:any,
            v2:any
        )=>{ //v1-v2, e.g. a point is v2 - v1
            let result = Object.assign({},v1);
            for(const key in result) {
                result[key] -= v2[key];
            }
            return result;
        },
        vecmul:(
            v1:any,
            v2:any
        )=>{ //v1*v2
            let result = Object.assign({},v1);
            for(const key in result) {
                result[key] *= v2[key];
            }
            return result;
        },
        vecdiv:(
            v1:any,
            v2:any
        )=>{ //v1/v2
            let result = Object.assign({},v1);
            for(const key in result) {
                result[key] /= v2[key];
            }
            return result;
        },
        vecscale:(
            v1:any,
            scalar:number
        )=>{ //v1*v2
            let result = Object.assign({},v1);
            for(const key in result) {
                result[key] *= scalar;
            }
            return result;
        },
        distance:(
            v1:any,
            v2:any
        )=>{
            let distance = 0;
            for(const key in v1) {
                distance += Math.pow(v1[key]-v2[key],2)
            }
            return Math.sqrt(distance);
        },
        magnitude:(
            v:any
        ) => {
            let magnitude = 0;
            for(const key in v) {
                magnitude += v[key]*v[key];
            }
            return Math.sqrt(magnitude);
        },
        normalize:(
            v:any
        ) => {
            let magnitude = Systems.collision.magnitude(v);
            let _mag = 1/magnitude;
            let vn = {};
            for(const key in v) {
                vn[key] = v[key]*_mag;
            }

            return vn;

        },
        cross3D(
            v1:{x:number,y:number,z:number},
            v2:{x:number,y:number,z:number}
        ) { //3D vector cross product
            return {
                x:v1.y*v2.z-v1.z*v2.y,
                y:v1.z*v2.x-v1.x*v2.z,
                z:v1.x*v2.y-v1.y*v2.x
            };
        },
        nearestNeighborSearch(entities:{[key:string]:Entity}, isWithinRadius:number=10) {
    
            var tree = {};;
    
            for(const key in entities){
                let newnode =  {
                    position: undefined,
                    neighbors: []
                };
                newnode.position = entities[key].position;
                tree[key] = newnode;
            }
    
            //Nearest neighbor search. This can be heavily optimized.


            for(const i in tree) { //for each node
                for(const j in tree) { //for each position left to check
                    var dist = Systems.collision.distance(tree[i].position,tree[j].position);
                    if(dist < isWithinRadius){
                        var newNeighbori = {
                            position: entities[j].position,
                            dist
                        };
                        tree[i].neighbors.push(newNeighbori);
                        var newNeighborj = {
                            position: entities[i].position,
                            dist
                        };
                        tree[j].neighbors.push(newNeighborj);
                    }
                }
                tree[i].neighbors.sort(function(a,b) {return a.dist - b.dist}); //Sort by distance, nearest to farthest according to array index
            }
    
            return tree;
        }
    } as SystemProps,
    collider:{ //this resolves collisions to update movement vectors
        lastTime:performance.now(),
        useBoundingBox:true,
        collisionBounds:{bot:0,top:100,left:0,right:100,front:0,back:100},
        setupEntities:(self,entities:{[key:string]:Entity})=>{
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;
                self.setEntity(entity);
            }
        },
        setEntity:(entity:GraphNode) => {
            Systems.collision.setEntity(entity);
            Systems.movement.setEntity(entity); 

            if(!('restitution' in entity)) entity.restitution = 1;
        },
        operator:(self, origin, entities:{[key:string]:Entity})=>{
            for(const key in entities) {
                const entity1 = entities[key];
                if(entity1.components) if(!entity1.components[self.tag] || !entity1.collisionEnabled) continue;
                if(!entity1.collisionEnabled) continue;

                //This does (crappy) sphere collisions, for box collisions we need to reflect based on which cube surfaces are colliding
                for(const key2 in entity1.colliding) { 
                    const entity2 = entities[key2];
                    if(entity1.colliding[key2] === false) {
                        delete entity1.colliding[key2] 
                        delete entity2.colliding[entity1.tag]; 
                        continue;
                    }
                    if(!entity2.collisionEnabled) continue;

                    
                    if(entity2.collisionType === 'box') {
                        self.resolveBoxCollision(entity1,entity2,entity1.colliding[key2]);
                    }
                    else {
                        if(entity1.collisionType === 'box') {
                            entity1.fixed = true; //let the box collision check handle it on next pass
                            self.resolveSphereCollisions(entity1,entity2,entity1.colliding[key2]);
                            entity1.fixed = false;
                        }
                        else {
                            self.resolveSphereCollisions(entity1,entity2,entity1.colliding[key2]);
                            delete entity2.colliding[entity1.tag]; //both resolved
                        }
                    }
                    //}
                    //todo: box face (orthogonal) reflections
                    //else if(entity2.collisionType === 'box')
                    //self.resolveBoxCollision(entity1,entity2);
                    
                    delete entity1.colliding[entity2.tag];
                }

                if(self.useBoundingBox) self.checkBoundingBox(self,entity1);

            }
            return entities;
        },
        checkBoundingBox:(self,entity)=>{
                    
            const ysize = entity.collisionRadius*entity.collisionBoundsScale.y;
            const xsize = entity.collisionRadius*entity.collisionBoundsScale.x;
            const zsize = entity.collisionRadius*entity.collisionBoundsScale.z;

            if ((entity.position.y - ysize) <= self.collisionBounds.top) {
                entity.velocity.y *= entity.restitution;
                entity.position.y = self.collisionBounds.top + ysize;
            }
            if ((entity.position.y + ysize) >= self.collisionBounds.bot) {
                entity.velocity.y *= entity.restitution;
                entity.position.y = self.collisionBounds.bot - ysize;
            }

            if (entity.position.x - xsize <= self.collisionBounds.left) {
                entity.velocity.x *= entity.restitution;
                entity.position.x = self.collisionBounds.left + xsize;
            }

            if (entity.position.x + xsize >= self.collisionBounds.right) {
                entity.velocity.x *= entity.restitution;
                entity.position.x = self.collisionBounds.right - xsize;
            }

            if (entity.position.z - zsize <= self.collisionBounds.front) {
                entity.velocity.z *= entity.restitution;
                entity.position.z = self.collisionBounds.front + zsize;
            }

            if (entity.position.z + zsize >= self.collisionBounds.back) {
                entity.velocity.z *= entity.restitution;
                entity.position.z = self.collisionBounds.back - zsize;
            }
        },
        //needs improvement
        resolveBoxCollision:(body1:Entity,box:Entity)=>{
            //Find which side was collided with

            var directionVec = Object.values(Systems.collision.makeVec(body1.position,box.position) as number[]); //Get direction toward body2
            //var normal = Systems.collision.normalize(directionVec);

            var max = Math.max(...directionVec);
            var min = Math.min(...directionVec);
            var side = max;;
            if(Math.abs(min) > max) {
                side = min;
            }
            var idx = directionVec.indexOf(side) as any;
            if(idx === 0) idx = 'x';
            if(idx === 1) idx = 'y';
            if(idx === 2) idx = 'z';
            if(idx === 3) idx = 'w'; //wat

            body1.velocity[idx] = -body1.velocity[idx]*body1.restitution; //Reverse velocity

            var body2AccelMag = Systems.collision.magnitude(box.acceleration);
            var body2AccelNormal = Systems.collision.normalize(box.acceleration);

            body1.force[idx] = -body2AccelNormal[idx]*body2AccelMag*box.mass; //Add force

            //Apply Friction  
        },
        resolveSphereCollisions:(entity1:Entity,entity2:Entity,dist?:number)=>{

            if(dist === undefined) dist = Systems.collision.distance(entity1.position,entity2.position);
            let vecn = Systems.collision.normalize(Systems.collision.makeVec(entity1.position,entity2.position)); // a to b

            let sumMass = entity1.mass+entity2.mass;
            let ratio = entity1.mass/sumMass; //displace proportional to mass
            let rmin = 1-ratio;

            if(entity1.fixed === false) {
                entity1.position.x += vecn.x*rmin*1.01;
                entity1.position.y += vecn.y*rmin*1.01;
                entity1.position.z += vecn.z*rmin*1.001;
            } else {
                entity2.position.x -= vecn.x*1.01;
                entity2.position.y -= vecn.y*1.01;
                entity2.position.z -= vecn.z*1.01;
            }
            if(entity2.fixed === false) {
                entity2.position.x += vecn.x*ratio*1.01;
                entity2.position.y += vecn.y*ratio*1.01;
                entity2.position.z += vecn.z*ratio*1.01;
            } else {
                entity1.position.x += vecn.x*1.01;
                entity1.position.y += vecn.y*1.01;
                entity1.position.z += vecn.z*1.01;
            }
            //slidey

            //get updated distance (?)
            dist = Systems.collision.distance(entity1.position,entity2.position);

            let vrel = {
                x:entity1.velocity.x - entity2.velocity.x,
                y:entity1.velocity.y - entity2.velocity.y,
                z:entity1.velocity.z - entity2.velocity.z
            };

            let speed = vrel.x*vecn.x + vrel.y*vecn.y + vrel.z*vecn.z;

            if(speed > 0) {
                let impulse = 2*speed/sumMass;

                if(entity1.fixed === false) {
                    entity1.velocity.x -= impulse*vecn.x*entity2.mass*entity1.restitution///entity1.mass;
                    entity1.velocity.y -= impulse*vecn.y*entity2.mass*entity1.restitution///entity1.mass;
                    entity1.velocity.z -= impulse*vecn.z*entity2.mass*entity1.restitution///entity1.mass;
                }
                
                if(entity2.fixed === false) {
                    entity2.velocity.x += impulse*vecn.x*entity2.mass*entity2.restitution/entity2.mass;
                    entity2.velocity.y += impulse*vecn.y*entity2.mass*entity2.restitution/entity2.mass;
                    entity2.velocity.z += impulse*vecn.z*entity2.mass*entity2.restitution/entity2.mass;
                }

            }
            //if(!entity1.collidedWith[entity2.tag] && !entity1.prevCollidedWith[entity2.tag]) {
            //}
            // entity1.collidedWith[entity2.tag] = entity2.tag;
            // entity2.collidedWith[entity1.tag] = entity1.tag;
        }
    } as SystemProps,
    nbody:{ //gravitational attraction
        lastTime:performance.now(),
        G:0.00000000006674, //Newton's gravitational constant
        setupEntities:(self,entities:{[key:string]:Entity})=>{
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;

                Systems.nbody.setEntity(entity);
            }
        },
        setEntity:(entity:GraphNode) => {
            Systems.collision.setEntity(entity);
            Systems.movement.setEntity(entity);

            entity.isAttractor = true;
        },
        operator:(self,origin,entities:{[key:string]:Entity})=>{
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;
                if(!entity.mass) continue;
                
                for(const key2 in entities) {
                    const entity2 = entities[key2];
                    if(entity2.components) if(!entity2.components[self.tag]) continue;
                    if(!entity2.mass || !entity2.isAttractor) continue;

                    Systems.nbody.attract(entity,entity2);
                }
            }

            return entities;
        },
        attract:(
            body1,
            body2,
            dist?:number,
            vecn?:{x:number,y:number,z:number}
        )=>{

            if(dist === undefined) dist = Systems.collision.distance(body1.position,body2.position) as number;
            if(vecn === undefined) vecn = Systems.collision.normalize(Systems.collision.makeVec(body1.position,body2.position)); // a to b

            //Newton's law of gravitation
            let Fg = 0.00000000006674 * body1.mass * body2.mass / (dist*dist);

            body1.force.x += (vecn as any).x*Fg;
            body1.force.y += (vecn as any).y*Fg;
            body1.force.z += (vecn as any).z*Fg;
            body2.force.x -= (vecn as any).x*Fg;
            body2.force.y -= (vecn as any).y*Fg;
            body2.force.z -= (vecn as any).z*Fg;

            //next we should pass this to the movement system to resolve the forces into the movements (like below)

            // let mass1Inv = 1/body1.mass;
            // let mass2Inv = 1/body2.mass;
            // //Get force vectors
            // let FgOnBody1 = {x: (vecn as any).x*Fg, y: (vecn as any).y*Fg, z: (vecn as any).z*Fg};
            // let FgOnBody2 = {x:-(vecn as any).x*Fg, y:-(vecn as any).y*Fg, z:-(vecn as any).z*Fg};
            
            // if(!body1.fixed) {
            //     body1.velocity.x += tstep*FgOnBody1.x*mass1Inv;
            //     body1.velocity.y += tstep*FgOnBody1.y*mass1Inv;
            //     body1.velocity.z += tstep*FgOnBody1.z*mass1Inv;
            // }

            // if(!body2.fixed) {
            //     body2.velocity.x += tstep*FgOnBody2.x*mass2Inv;
            //     body2.velocity.y += tstep*FgOnBody2.y*mass2Inv;
            //     body2.velocity.z += tstep*FgOnBody2.z*mass2Inv;
            // }
        }
    } as SystemProps,
    boid:{ //boids, updates velocities based on a particle rule subset
        lastTime:performance.now(),
        setupEntities:(entities:any)=>{
            for(const key in entities) {
                const entity = entities[key];

                Systems.collision.setEntity(entity);
                Systems.movement.setEntity(entity);

                if(!entity.boid) { //boid rules
                    entity.boid = {
                        cohesion:0.00001,
                        separation:0.0001,
                        alignment:0.006,
                        swirl:{x:0.5,y:0.5,z:0.5,mul:0.006},
                        attractor:{x:0.5,y:0.5,z:0.5,mul:0.002},
                        useCohesion:true,
                        useSeparation:true,
                        useAlignment:true,
                        useSwirl:true,
                        useAttractor:true,
                        //useAvoidance:true,
                        //avoidance:{groups:[],mul:0.1},
                        attraction: 0.00000000006674, //Newton's gravitational constant by default
                        useAttraction:false, //particles can attract each other on a curve
                        groupRadius:200,
                        groupSize:10,
                        searchLimit:10
                    }
                }
            }
        },
        operator:(self,origin,entities:{[key:string]:Entity})=>{
            
            let now = performance.now();
            let timeStep = now - self.lastTime
            self.lastTime = now;

            let keys = Object.keys(entities);
            let length = Object.keys(entities).length;
        
            let _timeStep = 1/timeStep;
            outer:
            for(const i in entities) {
                let p0 = entities[i];
                const inRange:any[] = []; //indices of in-range boids
                const distances:any[] = []; //Distances of in-range boids
                const boidVelocities = [
                    p0.position.x,
                    p0.position.y,
                    p0.position.z,
                    0,0,0,
                    p0.velocity.x,p0.velocity.y,p0.velocity.z,
                    0,0,0,
                    0,0,0,
                    0,0,0
                ]; //Velocity mods of in-range boids, representing each type of modifier
                /*
                    cohesion, separation, alignment, attraction, avoidance
                */
                
                let groupCount = 1;
        
                nested:
                for(const j in entities) {
                    let p = entities[j];
                    if(distances.length > p0.boid.groupSize || j >= p0.boid.searchLimit) { break nested; }
    
                    let randj = keys[Math.floor(Math.random()*length)]; // Get random index
                    if(j===i || entities[randj].tag === entities[i].tag || inRange.indexOf(randj) > -1) {  } else {
                        let pr = entities[randj];
                        let disttemp = Systems.collision.distance(p0.position,pr.position);
                        
                        if(disttemp > p0.boid.groupRadius) { } else {
                            distances.push(disttemp);
                            inRange.push(randj);
    
                            let distInv;
                            if(p0.boid.useSeparation || p0.boid.useAlignment) {
                                distInv = (p0.boid.groupRadius/(disttemp*disttemp));
                                if(distInv == Infinity) distInv = p.maxSpeed;
                                else if (distInv == -Infinity) distInv = -p.maxSpeed;
                            }
                    
                            if(p0.boid.useCohesion){
                                boidVelocities[0] += (pr.position.x - p0.position.x)*0.5*disttemp*_timeStep;
                                boidVelocities[1] += (pr.position.y - p0.position.y)*0.5*disttemp*_timeStep;
                                boidVelocities[2] += (pr.position.z - p0.position.z)*0.5*disttemp*_timeStep;
                            }
    
                            if(isNaN(disttemp) || isNaN(boidVelocities[0]) || isNaN(pr.position.x)) {
                                console.log(disttemp, i, randj, p0.position, pr.position, boidVelocities); p0.position.x = NaN; 
                                return;
                            }
    
                            if(p0.boid.useSeparation){
                                boidVelocities[3] = boidVelocities[3] + (p0.position.x-pr.position.x)*distInv;
                                boidVelocities[4] = boidVelocities[4] + (p0.position.y-pr.position.y)*distInv; 
                                boidVelocities[5] = boidVelocities[5] + (p0.position.z-pr.position.z)*distInv;
                            }
    
                            if(p0.boid.useAttraction) {
                                Systems.nbody.calcAttraction(p0,pr,disttemp);
                            }
    
                            if(p0.boid.useAlignment){
                                //console.log(separationVec);
                                boidVelocities[6] = boidVelocities[6] + pr.velocity.x*distInv; 
                                boidVelocities[7] = boidVelocities[7] + pr.velocity.y*distInv;
                                boidVelocities[8] = boidVelocities[8] + pr.velocity.z*distInv;
                            }
    
                            groupCount++;
                        }
                    }
                }
                
                // if(p0.boid.useAvoidance && p0.boid.avoidance.groups.length > 0) {
                //     let searchidx = Math.floor(Math.random()*p0.boid.avoidanceGroups.length);
                //     const inRange2:any[] = [];
                //     nested2:
                //     for(let k = 0; k < p0.boid.searchLimit; k++) {
                //         searchidx++;
                //         let group = p0.boid.avoidanceGroups[searchidx%p0.boid.avoidanceGroups.length];
                //         if(inRange2 > p0.boid.groupSize) { break nested2; }
    
                //         let randj = keys[Math.floor(Math.random()*group.length)]; // Get random index
                //         if( keys[k] === i || entities[randj].tag === entities[k].tag || inRange2.indexOf(randj) > -1) {  } else {
                //             let pr = group[randj];
                //             let disttemp = Systems.collision.distance(p0.position,pr.position);
                            
                //             if(disttemp > p0.boid.groupRadius) { } else {
                //                 inRange2.push(randj);
                //                 let distInv = (p0.boid.groupRadius/(disttemp*disttemp));
                //                 if(distInv == Infinity) distInv = pr.maxSpeed;
                //                 else if (distInv == -Infinity) distInv = -pr.maxSpeed;
                //                 boidVelocities[15] = boidVelocities[15] + (p0.position.x-pr.position.x)*distInv;
                //                 boidVelocities[16] = boidVelocities[16] + (p0.position.y-pr.position.y)*distInv; 
                //                 boidVelocities[17] = boidVelocities[17] + (p0.position.z-pr.position.z)*distInv;
                //             }
                //         }
                //     } 
    
                //     let _len = inRange2.length;
                //     boidVelocities[15] = boidVelocities[15]*_len;
                //     boidVelocities[16] = boidVelocities[16]*_len;
                //     boidVelocities[17] = boidVelocities[17]*_len;
    
                // }
    
    
                let _groupCount = 1/groupCount;
        
                if(p0.boid.useCohesion){
                    boidVelocities[0] = p0.boid.cohesion*(boidVelocities[0]*_groupCount);
                    boidVelocities[1] = p0.boid.cohesion*(boidVelocities[1]*_groupCount);
                    boidVelocities[2] = p0.boid.cohesion*(boidVelocities[2]*_groupCount);
                } else { boidVelocities[0] = 0; boidVelocities[1] = 0; boidVelocities[2] = 0; }
    
                if(p0.boid.useSeparation){
                    boidVelocities[3] = p0.boid.separation*boidVelocities[3];
                    boidVelocities[4] = p0.boid.separation*boidVelocities[4];
                    boidVelocities[5] = p0.boid.separation*boidVelocities[5];
                } else { boidVelocities[3] = 0; boidVelocities[4] = 0; boidVelocities[5] = 0; }
    
                if(p0.boid.useAlignment){
                    boidVelocities[6] = -(p0.boid.alignment*boidVelocities[6]*_groupCount);
                    boidVelocities[7] = p0.boid.alignment*boidVelocities[7]*_groupCount;
                    boidVelocities[8] = p0.boid.alignment*boidVelocities[8]*_groupCount;//Use a perpendicular vector [-y,x,z]
                } else { boidVelocities[6] = 0; boidVelocities[7] = 0; boidVelocities[8] = 0; }    
    
                const swirlVec = [0,0,0];
                if(p0.boid.useSwirl == true){
                    boidVelocities[9] = -(p0.position.y-p0.boid.swirl.y)*p0.boid.swirl.mul;
                    boidVelocities[10] = (p0.position.z-p0.boid.swirl.z)*p0.boid.swirl.mul;
                    boidVelocities[11] = (p0.position.x-p0.boid.swirl.x)*p0.boid.swirl.mul
                }
                const attractorVec = [0,0,0];
    
                if(p0.boid.useAttractor == true){
                    boidVelocities[12] = (p0.boid.attractor.x-p0.position.x)*p0.boid.attractor.mul;
                    if(p0.position.x > p0.boid.boundingBox.left || p0.position.x < p0.boid.boundingBox.right) {
                        boidVelocities[12] *= 3; //attractor should be in the bounding box for this to work properly 
                    }
                    boidVelocities[13] = (p0.boid.attractor.y-p0.position.y)*p0.boid.attractor.mul;
                    if(p0.position.y > p0.boid.boundingBox.top || p0.position.y < p0.boid.boundingBox.bottom) {
                        boidVelocities[13] *= 3;
                    }
                    boidVelocities[14] = (p0.boid.attractor.z-p0.position.z)*p0.boid.attractor.mul;
                    if(p0.position.z > p0.boid.boundingBox.front || p0.position.z < p0.boid.boundingBox.back) {
                        boidVelocities[14] *= 3;
                    }
                }
            
                //console.log(attractorVec)
    
                //if(i===0) console.log(p0, p0.position, p0.velocity, cohesionVec,separationVec,alignmentVec,swirlVec,attractorVec)
    
                entities[i].velocity.x=p0.velocity.x*p0.drag+boidVelocities[0]+boidVelocities[3]+boidVelocities[6]+boidVelocities[9]+boidVelocities[12]+boidVelocities[15],
                entities[i].velocity.y=p0.velocity.y*p0.drag+boidVelocities[1]+boidVelocities[4]+boidVelocities[7]+boidVelocities[10]+boidVelocities[13]+boidVelocities[16],
                entities[i].velocity.z=p0.velocity.z*p0.drag+boidVelocities[2]+boidVelocities[5]+boidVelocities[8]+boidVelocities[11]+boidVelocities[14]+boidVelocities[17]
                
                //console.log(i,groupCount)
                if(isNaN(entities[i].velocity.x)) console.error(p0, i, groupCount, p0.position, p0.velocity,swirlVec,attractorVec)
            }
        
            return entities;
        }
    } as SystemProps,
    movement:{ //update force/acceleration/velocity/position vectors
        lastTime:performance.now(),
        setupEntities:(self,entities:{[key:string]:Entity})=>{ //install needed data structures to entities
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;

                Systems.movement.setEntity(entity);
            }
        },
        setEntity:(entity:GraphNode) => {
            if(!('mass' in entity)) entity.mass = 1;
            if(!('fixed' in entity)) entity.fixed = false;
            if(!entity.force) entity.force = {x:0,y:0,z:0};
            if(!('mass' in entity)) entity.mass = 1;
            if(!('gravity' in entity)) entity.gravity = -9.81; //m/s^2 on earth
            if(!entity.acceleration) entity.acceleration = {x:0,y:0,z:0};
            if(!entity.velocity) entity.velocity = {x:0,y:0,z:0};
            if(!entity.position) entity.position = {x:0,y:0,z:0};
        },
        operator:(self, origin, entities:{[key:string]:Entity})=>{
            let now = performance.now();
            let timeStep = (now - self.lastTime) * 0.001;
            self.lastTime = now; 
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;
                if(entity.fixed) continue;
                
                if(typeof entity.force === 'object' && entity.mass) { //F = ma, F in Newtons, m in kg, a in m/s^2
                    if(entity.force.x) {
                        entity.accleration.x += entity.force.x/entity.mass;
                        entity.force.x = 0;
                    }
                    if(entity.force.y) {
                        entity.accleration.y += entity.force.y/entity.mass;
                        entity.force.y = 0;
                    }
                    if(entity.force.z) {
                        entity.accleration.z += entity.force.z/entity.mass + entity.gravity;
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
            return entities;
        }
    } as SystemProps,
    //materials:{} as SystemProps, //
} as {[key:string]:SystemProps & {[key:string]:any}}


//modified entity types?