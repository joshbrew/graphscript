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
        boundaries:{x:100,y:100,z:100}, //x,y,z coordinate space 
        setupEntities:(self,entities:{[key:string]:GraphNode})=>{
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;

                if(!('collisionEnabled' in entity)) entity.collisionEnabled = true;
                if(!entity.collisionType) entity.collisionType = 'sphere' //sphere, box, point
                if(!entity.collisionRadius) entity.collisionRadius = 1;
                if(!entity.collisionBoundsScale) entity.collisionBoundsScale = {x:1,y:1,z:1}; //x,y,z dimensions * collision radius, e.g. a box has +x and -x bounds based on these constraints
                if(!entity.colliding) entity.colliding = {} //key:boolean
                if(!entity.position) entity.position = {
                    x:Math.random()*self.boundaries.x,
                    y:Math.random()*self.boundaries.y,
                    z:Math.random()*self.boundaries.z
                };
            }
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
                 
                    if(Systems.collision.collisionCheck(entity1,entity2)) {
                        entity1.colliding[entity2.tag] = true;
                        entity2.colliding[entity1.tag] = true;
                    }
                }
            }
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
            if(
                Systems.collision.distance(body1.position,body2.position) < (   
                    Math.max(...Object.values(body1.collisionBoundsScale))*body1.collisionRadius + 
                    Math.max(...Object.values(body2.collisionBoundsScale))*body2.collisionRadius
                )
            ) {
                //Do collision check
                let isColliding = false;
                if(body1.collisionType === "sphere") {
                    if(body2.collisionType === "sphere") { isColliding = Systems.collision.sphericalCollisionCheck(body1,body2);}
                    else if(body2.collisionType === "box") { isColliding = Systems.collision.sphereBoxCollisionCheck(body1,body2);}
                    else if(body2.collisionType === "point") { isColliding = Systems.collision.isPointInsideSphere(body2.position,body1);}
                }
                else if(body1.collisionType === "box" ) {
                    if(body2.collisionType === "sphere") { isColliding = Systems.collision.sphereBoxCollisionCheck(body2,body1);}
                    else if(body2.collisionType === "box") { isColliding = Systems.collision.boxCollisionCheck(body1,body2);}
                    else if(body2.collisionType === "point") { isColliding = Systems.collision.isPointInsideBox(body1.position,body1); }
                }
                else if (body1.collisionType === "point") {
                    if(body2.collisionType === "sphere") { isColliding = Systems.collision.isPointInsideSphere(body1.position,body2); }
                    else if(body2.collisionType === "box") { isColliding = Systems.collision.isPointInsideBox(body1.position,body2); }
                }

                return isColliding;
            }
            else return false
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
            }
        )=>{
            let dist = Systems.collision.distance(body1.position,body2.position);

            return dist < (body1.collisionRadius + body2.collisionRadius);
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
            }
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
    
            let dist = Systems.collision.distance(sphere.position,clamp);
    
            return dist > sphere.collisionRadius;
        },
        isPointInsideSphere:(
            point:{x:number,y:number,z:number},
            sphere:{
                position:{x:number,y:number,z:number},
                collisionRadius:number,
                collisionBoundsScale:{x:number,y:number,z:number},
                [key:string]:any
            }
        )=>{
            let dist = Systems.collision.distance(point,sphere.position);

            return dist < sphere.collisionRadius;
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
        }
    } as SystemProps,
    collider:{ //this resolves collisions to update movement vectors
        lastTime:performance.now(),
        setupEntities:(self,entities:{[key:string]:Entity})=>{
            Systems.collision.setupEntities(Systems.collision,entities);
            Systems.movement.setupEntities(Systems.movement,entities); 
        },
        operator:(self, origin, entities:{[key:string]:Entity})=>{
            for(const key in entities) {
                const entity1 = entities[key];
                if(entity1.components) if(!entity1.components[self.tag] || !entity1.collisionEnabled) continue;
                if(!entity1.collisionEnabled) continue;

                for(const key2 in entity1.colliding) { //this is not perfect, the collisions act weird when multiple things collide or surfaces get too close
                    const entity2 = entities[key2];
                    if(!entity2.collisionEnabled) continue;

                    let dist = Systems.collision.distance(entity1.position,entity2.position);
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

                    dist = Systems.collision.distance(entity1.position,entity2.position);

                    let vrel = {
                        x:entity1.velocity.x - entity2.velocity.x,
                        y:entity1.velocity.y - entity2.velocity.y,
                        z:entity1.velocity.z - entity2.velocity.z
                    };

                    let speed = vrel.x*vecn.x + vrel.y*vecn.y + vrel.z*vecn.z;

                    if(speed > 0) {
                        let impulse = 2*speed/sumMass;
                        entity1.velocity.x -= impulse*vecn.x*entity2.mass*entity1.restitution///entity1.mass;
                        entity1.velocity.y -= impulse*vecn.y*entity2.mass*entity1.restitution///entity1.mass;
                        entity1.velocity.z -= impulse*vecn.z*entity2.mass*entity1.restitution///entity1.mass;
                    
                        entity2.velocity.x += impulse*vecn.x*entity2.mass*entity2.restitution/entity2.mass;
                        entity2.velocity.y += impulse*vecn.y*entity2.mass*entity2.restitution/entity2.mass;
                        entity2.velocity.z += impulse*vecn.z*entity2.mass*entity2.restitution/entity2.mass;
                        
                    }
                    //if(!entity1.collidedWith[entity2.tag] && !entity1.prevCollidedWith[entity2.tag]) {
                    //}
                    // entity1.collidedWith[entity2.tag] = entity2.tag;
                    // entity2.collidedWith[entity1.tag] = entity1.tag;

                    entity1.colliding[key2] = false;
                    entity2.colliding[key] = false;
                }
            }
        }
    } as SystemProps,
    movement:{
        lastTime:performance.now(),
        setupEntities:(self,entities:{[key:string]:Entity})=>{ //install needed data structures to entities
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;

                if(!('mass' in entity)) entity.mass = 1;
                if(!entity.force) entity.force = {x:0,y:0,z:0};
                if(!('mass' in entity)) entity.mass = 1;
                if(!('gravity' in entity)) entity.gravity = -9.81; //m/s^2 on earth
                if(!entity.acceleration) entity.acceleration = {x:0,y:0,z:0};
                if(!entity.velocity) entity.velocity = {x:0,y:0,z:0};
                if(!entity.position) entity.position = {x:0,y:0,z:0};
            }
        },
        operator:(self, origin, entities:{[key:string]:Entity})=>{
            let now = performance.now();
            let timeStep = (now - self.lastTime) * 0.001;
            self.lastTime = now; 
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[self.tag]) continue;
                
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
        }
    } as SystemProps,
    //materials:{} as SystemProps, //
} as {[key:string]:SystemProps & {[key:string]:any}}


//modified entity types?