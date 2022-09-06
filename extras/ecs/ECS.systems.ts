import { GraphNode } from "../../Graph";
import { Entity } from "../../services/ecs/ECS.service";

export const Systems = {
    //geometry:{} as SystemProps, //include mesh rotation functions and stuff
    collision:{ //e.g. https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
        //Better implementation: https://wickedengine.net/2020/04/26/capsule-collision-detection/, should adapt for gpujs or something for mass physics
        //lastTime:performance.now(),
        tag:'collision',
        setupEntities:function (entities:{[key:string]:Entity}){
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[this.tag]) continue;

                this.setupEntity(entity);
            }

            return entities;
        },
        setupEntity:function (entity:Entity) {
            if(!('collisionEnabled' in entity)) entity.collisionEnabled = true;
            if(!entity.collisionType) entity.collisionType = 'sphere' //sphere, box, point
            if(!entity.collisionRadius) entity.collisionRadius = 1;
            if(!entity.collisionBoundsScale) entity.collisionBoundsScale = {x:1,y:1,z:1}; //x,y,z dimensions * collision radius, e.g. a box has +x and -x bounds based on these constraints
            if(!entity.colliding) entity.colliding = {} //key:boolean
            if(!entity.position) entity.position = { x:0, y:0, z:0 };

            return entity;
        },
        operator:function(
            entities:{[key:string]:GraphNode}
        ){

            let keys = this.entityKeys;

            for(let i = 0; i < keys.length; i++) {
                const entity1 = entities[keys[i]];
                if(entity1.components) if(!entity1.components[this.tag] || !entity1.collisionEnabled) continue;
                if(!entity1.collisionEnabled) continue;
                for(let j = 0; j < keys.length; j++) {
                    if(i === j) continue;
                    const entity2 = entities[keys[j]];
                    if(entity2.components) if(!entity2.components[this.tag]) continue;
                    if(!entity2.collisionEnabled) continue;
                 
                    let colliding = Systems.collision.collisionCheck(entity1 as any,entity2 as any); //returns distance from origin if colliding (to reduce redundancy later)
                    if(colliding !== false) {
                        if(!entity1.colliding) entity1.colliding = {}
                        if(!entity2.colliding) entity2.colliding = {}
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
            let _mag = magnitude ? 1/magnitude : 0;
            let vn = Object.assign({},v);
            for(const key in v) {
                vn[key] = v[key]*_mag;
            }

            return vn;

        },
        distance3D(
            v1:{x:number,y:number,z:number},
            v2:{x:number,y:number,z:number}
        ){
            return Math.sqrt((v1.x-v2.x)*(v1.x-v2.x) + (v1.y-v2.y)*(v1.y-v2.y) + (v1.z-v2.z)*(v1.z-v2.z))
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
        nearestNeighborSearch(
            entities:{[key:string]:Entity}, 
            isWithinRadius:number=1000000000000000
        ) {
    
            var tree = {};;
    
            for(const key in entities){
                let newnode =  {
                    tag:key,
                    position: undefined,
                    neighbors: []
                };
                newnode.position = entities[key].position;
                tree[key] = newnode;
            }
    
            //Nearest neighbor search. This can be heavily optimized.


            for(const i in tree) { //for each node
                for(const j in tree) { //for each position left to check
                    var dist = Systems.collision.distance3D(tree[i].position,tree[j].position);
                    if(dist < isWithinRadius){
                        var newNeighbori = {
                            tag:j,
                            position: entities[j].position,
                            dist
                        };
                        tree[i].neighbors.push(newNeighbori);
                        var newNeighborj = {
                            tag:j,
                            position: entities[i].position,
                            dist
                        };
                        tree[j].neighbors.push(newNeighborj);
                    }
                }
                tree[i].neighbors.sort(function(a,b) {return a.dist - b.dist}); //Sort by distance, nearest to farthest according to array index
            }
    
            return tree;
        },
        //dynamic AABB trees or octrees
        generateBoundingVolumeTree(
            entities:{[key:string]:Entity}, 
            mode:'octree'|'aabb'='octree', 
            withinRadius:number=1000000000000000,
            minEntities:number=3 //keep dividing until only this many entities are contained in the smallest bounding volume
        ) {
            
            /*
            How to make dynamic bounding volume tree:
            1. Find the bounding volume of all of the objects combined.
            2. Now subdivide bounding volumes by whatever magnitude until you have groups of 2-5 objects closest to each other.
            3. Use box collision checks on the tree to find the best candidates to search for collisions
            */

            let dynamicBoundingVolumeTree = {
                proto:{
                    parent:undefined,
                    children:{} as any,
                    entities:{} as {[key:string]:Entity},
                    collisionType:"box",
                    collisionRadius: 1, 
                    collisionBoundsScale: {x:1,y:1,z:1}, //radius of bounding box
                    position:{x:0,y:0,z:0} //center of bounds
                },
                tree:{} //head will be a hard copy of the prototype and so on
            };

            let maxX, maxY, maxZ;
            let minX = 0, minY = 0, minZ = 0;
            let positions = {};
            let minRadius = withinRadius;

            for(const key in entities) {
                const body = entities[key];

                let xx = body.position.x+body.collisionRadius*body.collisionBoundsScale.x;
                let yy = body.position.y+body.collisionRadius*body.collisionBoundsScale.y;
                let zz = body.position.z+body.collisionRadius*body.collisionBoundsScale.z;

                if(maxX < xx) maxX = xx;
                if(minX > xx) minX = xx;
                if(maxY < yy) maxY = yy;
                if(minY > yy) minY = yy;
                if(maxZ < zz) maxZ = zz;
                if(minZ > zz) minZ = zz;

                if(minRadius > body.collisionRadius) minRadius = body.collisionRadius;

                positions[key] = body.position;

            };

            let head = JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto));

            let boxpos = {x:(maxX+minX)*0.5,y:(maxY+minY)*0.5,z:(maxZ+minZ)*0.5}
            let boxbounds = {x:maxX-boxpos.x,y:maxY-boxpos.y,z:maxZ-boxpos.z};
            
            head.position = boxpos;
            head.collisionBoundsScale = boxbounds; //radius to centers of each sides i.e. distance from center

            head.entities = entities;
            
            dynamicBoundingVolumeTree.tree = head;

            minRadius *= 2;

            if(mode === 'octree') { //octrees
                function genOct(parentPos,halfbounds) { //return center positions of child octree cubes, radius = parent half radius
                    let oct1 = {x:parentPos.x+halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z+halfbounds.z}; //+x+y+z
                    let oct2 = {x:parentPos.x-halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z+halfbounds.z}; //-x+y+z
                    let oct3 = {x:parentPos.x+halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z+halfbounds.z}; //+x-y+z
                    let oct4 = {x:parentPos.x+halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z-halfbounds.z}; //+x+y-z
                    let oct5 = {x:parentPos.x-halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z+halfbounds.z}; //-x-y+z
                    let oct6 = {x:parentPos.x-halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z-halfbounds.z}; //-x+y-z
                    let oct7 = {x:parentPos.x+halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z-halfbounds.z}; //+x-y-z
                    let oct8 = {x:parentPos.x-halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z-halfbounds.z}; //-x-y-z

                    return [oct1,oct2,oct3,oct4,oct5,oct6,oct7,oct8];
                }

                function genOctTree(head) {           
                    let halfbounds = {
                        x:head.collisionBoundsScale.x*0.5,
                        y:head.collisionBoundsScale.y*0.5,
                        z:head.collisionBoundsScale.z*0.5
                    };     
                    let octPos = genOct(head.position,halfbounds);
                    let check = Object.assign({},head.bodies);
                    for(let i = 0; i < 8; i++) {
                        let octquadrant = Object.assign(
                            JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto)),
                            {position:octPos[i],collisionBoundsScale:halfbounds}
                        );
                        octquadrant.parent = head;
                        //now check if any of the bodies are within these and eliminate from the check array
                        for(const j in check) {
                            let collided = Systems.collision.collisionCheck(check[j],octquadrant);
                            if(collided) {
                                octquadrant.entities[j] = check[j];
                                delete check[j];
                            }
                        } //recursively check each oct for entities until only minEntities entities are contained, discount smaller volumes
                        if(Object.keys(octquadrant.entities).length > minEntities-1) {
                            head.children[i] = octquadrant;
                            octquadrant.parent = head;
                            if(Object.keys(octquadrant.entities).length > minEntities && octquadrant.collisionRadius*0.5 > minRadius) {
                                genOctTree(octquadrant);
                            }
                        }
                    }
                }

                genOctTree(head);
                
                return head;
            }
            else { //dynamic AABB trees

                /**
                 *  -------
                 * |   o   |
                 * |  o    |
                 * |o   o  |
                 * |   o   |
                 * |      o|
                 *  -------
                 * 
                 * Model: Bound all of the particles by nearest neighbors
                 *        Now bound the bounding boxes by nearest 3 bounding boxes
                 *        Continue until only 2 bounding boxes returned. Bound to head box containing all boxes.
                 * 
                */
                let tree = Systems.collision.nearestNeighborSearch(positions, withinRadius);

                let keys = Object.keys(tree);

                let tag = keys[Math.floor(Math.random()*keys.length)]; //beginning with random node
                let searching = true; 
                let count = 0;

                let genBoundingBoxLevel = (tree,volumes) => {
                    let newVolumes = {};
                    let foundidxs = {};
                    let treekeys = Object.keys(tree);
                    while(searching && (count < treekeys.length)) { 
                        let node = tree[tag]; 
                        let i = 0; 
                        let j = 0;

                        //starting position 
                        let ux = positions[node.tag].x-volumes[node.tag].collisionBoundsScale.x, 
                            uy = positions[node.tag].y-volumes[node.tag].collisionBoundsScale.y, 
                            uz = positions[node.tag].z-volumes[node.tag].collisionBoundsScale.z, 
                            mx = positions[node.tag].x+volumes[node.tag].collisionBoundsScale.x, 
                            my = positions[node.tag].y+volumes[node.tag].collisionBoundsScale.y, 
                            mz = positions[node.tag].z+volumes[node.tag].collisionBoundsScale.z;

                        let newvolume = JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto));
                        newvolume.tag = `bound${Math.floor(Math.random()*1000000000000000)}`;

                        newvolume.children[node.tag] = volumes[node.tag];
                        newvolume.bodies[node.tag] = entities[node.tag];
                        volumes[node.tag].parent = newvolume;
                        foundidxs[node.tag] = true; //remove added neighbors from candidate search for bounding boxes (till none left to search = move onto next layer of boxes)
                        i++; j++;

                        let nkeys = Object.keys(node.neighbors);

                        while(i < nkeys.length && j < 3) { //make a box around the first 3 unchecked nearest neighbors 
                            if(foundidxs[node.neighbors[i].tag]) { i++; continue; }

                            let uxn = positions[node.neighbors[i].tag].x-volumes[node.neighbors[i].tag].collisionBoundsScale.x, 
                                uyn = positions[node.neighbors[i].tag].y-volumes[node.neighbors[i].tag].collisionBoundsScale.y, 
                                uzn = positions[node.neighbors[i].tag].z-volumes[node.neighbors[i].tag].collisionBoundsScale.z, 
                                mxn = positions[node.neighbors[i].tag].x+volumes[node.neighbors[i].tag].collisionBoundsScale.x, 
                                myn = positions[node.neighbors[i].tag].y+volumes[node.neighbors[i].tag].collisionBoundsScale.y, 
                                mzn = positions[node.neighbors[i].tag].z+volumes[node.neighbors[i].tag].collisionBoundsScale.z;

                            if(ux > uxn) ux = uxn;
                            if(mx < mxn) mx = mxn;
                            if(uy > uyn) uy = uyn;
                            if(my < myn) my = myn;
                            if(uz > uzn) uz = uzn;
                            if(mz < mzn) mz = mzn;

                            newvolume.children[node.neighbors[i].tag] = volumes[node.neighbors[i].tag];
                            newvolume.entities[node.neighbors[i].tag] = entities[node.neighbors[i].tag];
                            volumes[node.neighbors[i].tag].parent = newvolume;
                            foundidxs[node.neighbors[i].tag] = true; //remove added neighbors from candidate search for bounding boxes (till none left to search = move onto next layer of boxes)
                            i++; j++;
                        }

                        let pos = {x:(mx+ux)*0.5,y:(my+uy)*0.5,z:(mz+uz)*0.5};
                        let bounds = {x:mx-pos.x,y:my-pos.y,z:mz-pos.z};

                        newvolume.position = pos;
                        newvolume.collisionBoundsScale = bounds;
                        if(newvolume.bodies.length === 1) newvolume = node; //just forego the bounding volume if not bounding more than one node
                        
                        newVolumes[newvolume.tag] = newvolume;
                        
                        //now find the next not-found neighbor
                        while(i < node.neighbors.length) {
                            if(!foundidxs[node.neighbors[i].tag]) break;
                            i++;
                        }

                        // then walk to the nearest unchecked node and make a box around the next 2 or 3 nearest neighbors
                        // then continue till you run out of nodes to check. Should be left with a bounding tree with larger to smaller boxes
                        // smallest nodes (the bodies) should be parented to their bounding boxes and so on afterward.

                        if(i < node.neighbors.length) {
                            tag = node.neighbors[i].tag; //set the next node index to the unchecked node
                        } else if(Object.keys(foundidxs).length < Object.keys(tree).length) { tag = keys[0]; } //else just jump back to zero and keep looking
                        else searching = false; //no more to search
                        
                        count++;
                    }

                    return newVolumes;
                }

                //generate the largest bounding box level
                let result = genBoundingBoxLevel(tree,entities);

                // first result will be a list of volumes around each set of nearest 3 neighbors
                
                while(Object.keys(result).length > 2) { //and as long as we have enough volumes to bound, keep bounding each set of volumes into larger volumes
                    let nextTree = Systems.collision.nearestNeighborSearch(result,withinRadius);
                    result = genBoundingBoxLevel(nextTree,result);
                }

                head.children = result; //that should parent the final bounding boxes to the main box

                head.children.forEach((n) => {n.parent = head;})

                return head;
            }
        }
    },// as SystemProps,
    collider:{ //this resolves collisions to update movement vectors
        tag:'collider',
        lastTime:performance.now(),
        setupEntities:function (entities:{[key:string]:Entity}){
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[this.tag]) continue;
                this.setupEntity(entity);
            }

            return entities;
        },
        setupEntity:function (entity:Entity) {
            if(!('collisionEnabled' in entity)) Systems.collision.setupEntity(entity);
            if(!('boundingBox' in entity)) 
                entity.boundingBox = {
                    bot:0,
                    top:100,
                    left:0,
                    right:100,
                    front:0,
                    back:100
                };
            if(!('position' in entity)) {
                Systems.movement.setupEntity(entity); 
            }
            if(!('restitution' in entity)) entity.restitution = 1;
            if(!('useBoundingBox' in entity)) entity.useBoundingBox = true;

  
            if(!entity.position.x && !entity.position.y && !entity.position.z) { //randomize starting positions
                entity.position.x = Math.random()*entity.boundingBox.right;
                entity.position.y = Math.random()*entity.boundingBox.back;
                entity.position.z = Math.random()*entity.boundingBox.top;
            }

            //console.log(entity.position)

            return entity;
        },
        operator: function (entities:{[key:string]:Entity}) {

            let keys = this.entityKeys;

            for(let i = 0; i < keys.length; i++) {
                const entity1 = entities[keys[i]];
                if(entity1.components) if(!entity1.components[this.tag] || !entity1.collisionEnabled) continue;
                
                if(entity1.useBoundingBox) this.checkBoundingBox(entity1); 
                
                if(!entity1.collisionEnabled) continue;

                //This does (crappy) sphere collisions, for box collisions we need to reflect based on which cube surfaces are colliding
                if(entity1.colliding) {
                    for(const key2 in entity1.colliding) { 
                        const entity2 = entities[key2];
                        if(entity1.colliding[key2] === false) {
                            delete entity1.colliding[key2] 
                            delete entity2.colliding[entity1.tag]; 
                            continue;
                        }
                        if(!entity2.collisionEnabled) continue;

                        
                        if(entity2.collisionType === 'box') {
                            this.resolveBoxCollision(entity1,entity2,entity1.colliding[key2]);
                        }
                        else {
                            if(entity1.collisionType === 'box') {
                                entity1.fixed = true; //let the box collision check handle it on next pass
                                this.resolveSphereCollisions(entity1,entity2,entity1.colliding[key2]);
                                entity1.fixed = false;
                            }
                            else {
                                this.resolveSphereCollisions(entity1,entity2,entity1.colliding[key2]);
                                delete entity2.colliding[entity1.tag]; //both resolved
                            }
                        }
                        //}
                        //todo: box face (orthogonal) reflections
                        //else if(entity2.collisionType === 'box')
                        //this.resolveBoxCollision(entity1,entity2);
                        
                        delete entity1.colliding[entity2.tag];
                    }
                    
                    delete entity1.colliding;
                }
            }
            return entities;
        },
        checkBoundingBox:(entity)=>{

            //console.log('before',entity.position);
                    
            const xsize = entity.collisionRadius*entity.collisionBoundsScale.x;
            const ysize = entity.collisionRadius*entity.collisionBoundsScale.y;
            const zsize = entity.collisionRadius*entity.collisionBoundsScale.z;

            if ((entity.position.y - ysize) <= entity.boundingBox.front) {
                entity.velocity.y *= -entity.restitution;
                entity.position.y = entity.boundingBox.front + ysize;
            }
            if ((entity.position.y + ysize) >= entity.boundingBox.back) {
                entity.velocity.y *= -entity.restitution;
                entity.position.y = entity.boundingBox.back - ysize;
            }

            if (entity.position.x - xsize <= entity.boundingBox.left) {
                entity.velocity.x *= -entity.restitution;
                entity.position.x = entity.boundingBox.left + xsize;
            }

            if (entity.position.x + xsize >= entity.boundingBox.right) {
                entity.velocity.x *= -entity.restitution;
                entity.position.x = entity.boundingBox.right - xsize;
            }

            if (entity.position.z - zsize <= entity.boundingBox.bot) {
                entity.velocity.z *= -entity.restitution;
                entity.position.z = entity.boundingBox.bot + zsize;
            }

            if (entity.position.z + zsize >= entity.boundingBox.top) {
                entity.velocity.z *= -entity.restitution;
                entity.position.z = entity.boundingBox.top - zsize;
            }

            
            //console.log('after',entity.position, entity.boundingBox);
        },
        //needs improvement
        resolveBoxCollision:(body1:Entity,box:Entity,negate?:boolean)=>{
            //Find which side was collided with

            let positionVec = Systems.collision.makeVec(body1.position,box.position);

            var directionVec = Object.values(positionVec); //Get direction toward body2
            //var normal = Systems.collision.normalize(directionVec);

            let closestSide;
            let closestDist = Infinity;

            let mul = -1;
            if(directionVec[idx] < 0) mul = 1;
            if(negate) mul = - mul;

            for(const key in body1.position) {
                let dist = Math.abs(box.position[key] - body1.position[key]);
                if(
                    dist < closestDist && 
                    Math.abs((box.position[key] - body1.position[key] + body1.velocity[key]*0.00000000000000001)) < dist  //take a super small step forward and see if it's closer in distance to determine if this is a colliding vector
                ) {
                    closestSide = key;
                    closestDist = dist;
                }
            }

            var idx = directionVec.indexOf(closestSide) as any;
            if(idx === 0) idx = 'x';
            if(idx === 1) idx = 'y';
            if(idx === 2) idx = 'z';
            if(idx === 3) idx = 'w'; //wat

            let boxEdgeAxisPosition = box.position[idx] + box.collisionRadius*box.collisionBoundsScale[idx]*mul;
            if(negate) {
                let body1Offset = boxEdgeAxisPosition - body1.collisionRadius*body1.collisionBoundsScale[idx]*mul;
                body1.position[idx] = body1Offset; 

            } else {
                let body1Offset = boxEdgeAxisPosition + body1.collisionRadius*body1.collisionBoundsScale[idx]*mul;
                body1.position[idx] = body1Offset; 
            }
            

            body1.velocity[idx] = -body1.velocity[idx]*body1.restitution; //Reverse velocity of side moving toward
            if(negate) body1.force[idx] = -body1.velocity[idx]; //e.g. to stay inside a box

            var body2AccelMag = Systems.collision.magnitude(box.acceleration);
            var body2AccelNormal = Systems.collision.normalize(box.acceleration);

            body1.force[idx] = -body2AccelNormal[idx]*body2AccelMag*box.mass; //Add force
            if(negate) body1.force[idx] = -body1.force[idx]; //e.g. to stay inside a box

            //Apply Friction  
        },
        resolveSphereCollisions:( //needs improvement
            entity1:Entity,
            entity2:Entity,
            dist?:number
        )=>{

            if(dist === undefined) dist = Systems.collision.distance(entity1.position,entity2.position);
            let vecn = Systems.collision.normalize(Systems.collision.makeVec(entity1.position,entity2.position)) as any; // a to b

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
    },// as SystemProps,
    nbody:{ //gravitational attraction
        tag:'nbody',
        lastTime:performance.now(),
        G:0.00000000006674, //Newton's gravitational constant, can set differently on different sets of components 
        setupEntities:function (entities:{[key:string]:Entity}){
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[this.tag]) continue;

                this.setupEntity(entity);
            }

            return entities;
        },
        setupEntity:function (entity:Entity) {
            if(!('collisionEnabled' in entity)) Systems.collider.setupEntity(entity);

            entity.isAttractor = true;
            if(!('attractorGroup' in entity)) entity.attractorGroup = 0;
            if(!('attractorFrameSearchMax' in entity)) entity.attractorFrameSearchMax = 10;
            if(!('attractorGroupRules' in entity)) entity.attractorGroupRules = { //set attractor group rules
                0:{ G:this.G, maxDist:undefined } //can set as a G number Or an object with a maximum distance to apply the group rule 
            }
        
            return entity;
        },
        operator:function(entities:{[key:string]:Entity}){

            let keys = this.entityKeys;

            for(let i = 0; i < keys.length; i++) {
                const entity = entities[keys[i]];
                if(entity.components) if(!entity.components[this.tag]) continue;
                if(!entity.mass) continue;
                
                let nSearched = 0;
                nested:
                for(let j = 0; j < keys.length; j++) {
                    let randKey = keys[Math.floor(Math.random()*keys.length)];
                    nSearched++;
                    const entity2 = entities[randKey];
                    if(entity2.components) if(!entity2.components[this.tag]) continue nested;
                    if(!entity2.mass || !entity2.isAttractor) continue nested;

                    this.attract(
                        entity,
                        entity2,
                        undefined,
                        this.G
                    );

                    if(nSearched > entity.attractorFrameSearchMax) break nested;
                }
            }

            return entities;
        },
        attract:function(
            body1,
            body2,
            dist?:number, //precalculated?
            G=this.G, //modify G? Default is real world value (needs HUGE mass)
            vecn?:{x:number,y:number,z:number}
        ){

            if(dist === undefined) dist = Systems.collision.distance3D(body1.position,body2.position) as number;
            if(vecn === undefined) vecn = Systems.collision.normalize(
                Systems.collision.makeVec(body1.position,body2.position)
            ) as any; // a to b

            let Fg = 0;
            if(dist < 0.01) dist = .01;
            if(body1.attractorGroupRules[body2.attractorGroup]) {

                if(typeof body1.attractorGroupRules[body2.attractorGroup] === 'object') {
                    if(body1.attractorGroupRules[body2.attractorGroup].maxDist && body1.attractorGroupRules[body2.attractorGroup].maxDist < dist) {

                    } else Fg = body1.attractorGroupRules[body2.attractorGroup].G * body1.mass * body2.mass / (dist*dist);
                } else Fg = body1.attractorGroupRules[body2.attractorGroup] * body1.mass * body2.mass / (dist*dist);
            } else Fg = G * body1.mass * body2.mass / (dist*dist);
            
            //Newton's law of gravitation
            
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
    },// as SystemProps,
    boid:{ //boids, updates velocities based on a particle rule subset
        tag:'boid',
        lastTime:performance.now(),
        defaultAnchor:{x:Math.random(),y:Math.random(),z:Math.random(), mul:0.006},
        setupEntities:function (entities:any){
            for(const key in entities) {
                const entity = entities[key];

                this.setupEntity(entity);
            }

            return entities;
        },
        setupEntity:function (entity:Entity) {
            if(!entity.position) {
                Systems.collider.setupEntity(entity);
            }
            //entity.collisionEnabled = false; //use the bounding box but not the collisions by default (faster)

            let adjustedAnchor = Object.assign({},this.defaultAnchor);
            adjustedAnchor.x *= entity.boundingBox.right;
            adjustedAnchor.y *= entity.boundingBox.back;
            adjustedAnchor.z *= entity.boundingBox.top;

            let boidDefaults = {
                cohesion:0.00001,
                separation:0.0001,
                alignment:0.006,
                swirl:adjustedAnchor,
                attractor:Object.assign(adjustedAnchor,{mul:0.002}),
                useCohesion:true,
                useSeparation:true,
                useAlignment:true,
                useSwirl:true,
                useAttractor:true,
                //useAvoidance:true,
                //avoidance:{groups:[],mul:0.1},
                useAttraction:false, //particles can attract each other on a curve
                //group:0 //search groups to split boids groups (todo)
                groupRadius:200,
                groupSize:5, //number of boids checked per frame to update velocities
                searchLimit:5
            };
            if(!entity.boid) { //boid rules
                entity.boid = boidDefaults
            } else entity.boid = Object.assign(boidDefaults, entity.boid);

            //console.log(entity);
            if(this.entityKeys.length > 1000) {
                entity.boid.groupSize = 1;
                entity.boid.searchLimit = 1;
            }

            return entity;
        },
        operator:function (entities:{[key:string]:Entity}){
            
            let now = performance.now();
            let timeStep = now - this.lastTime
            this.lastTime = now;

            let keys = this.entityKeys;
            let length = keys.length;
        
            let _timeStep = 1/timeStep;

            //console.time('boidloop')
            //let nloops = 0;
            let w = -1;
            outer:
            for(let i = 0; i < keys.length; i++) {
                w++
                let p0 = entities[keys[i]];
                const inRange:any[] = []; //indices of in-range boids
                const distances:any[] = []; //Distances of in-range boids
                const boidVelocities = [
                    p0.position.x, p0.position.y,p0.position.z,
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
        
                let k = -1;

                nested:
                for(let j = 0; j < keys.length; j++) {
                    k++;
                    //nloops++;
                    if(distances.length > p0.boid.groupSize || k > p0.boid.searchLimit) { break nested; }
                    //if(w === 0) console.time('randj');
                    let randj = keys[Math.floor(Math.random()*length)]; // Get random index
                    //if(w === 0) console.timeEnd('randj');
                    if(k===w || randj === keys[i] || inRange.indexOf(randj) > -1) { continue nested; } else {
                        let pr = entities[randj];
                        //if(w === 0) console.time('distance');
                        let disttemp = Math.sqrt(
                            (p0.position.x-pr.position.x)*(p0.position.x-pr.position.x) + 
                            (p0.position.y-pr.position.y)*(p0.position.y-pr.position.y) + 
                            (p0.position.z-pr.position.z)*(p0.position.z-pr.position.z)
                        );
                        //if(w === 0) console.timeEnd('distance');


                        if(disttemp > p0.boid.groupRadius) { continue nested; } else {
                            //if(w === 0) console.time('boidmath');
                            distances.push(disttemp);
                            inRange.push(randj);
    
                            let distInv;
                            if(p0.boid.useSeparation || p0.boid.useAlignment) {
                                distInv = (p0.boid.groupRadius/(disttemp*disttemp));
                                if(distInv > p0.maxSpeed) distInv = p0.maxSpeed;
                                else if (distInv < -p0.maxSpeed) distInv = -p0.maxSpeed;
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
    
                            if(p0.boid.useAttraction && pr.boid.useAttraction) {
                                Systems.nbody.attract(p0,pr,disttemp);
                            }
    
                            if(p0.boid.useAlignment){
                                //console.log(separationVec);
                                boidVelocities[6] = boidVelocities[6] + pr.velocity.x*distInv; 
                                boidVelocities[7] = boidVelocities[7] + pr.velocity.y*distInv;
                                boidVelocities[8] = boidVelocities[8] + pr.velocity.z*distInv;
                            }
    
                            groupCount++;
                            //if(w === 0) console.timeEnd('boidmath');
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
                    if(p0.position.x > p0.boundingBox.left || p0.position.x < p0.boundingBox.right) {
                        boidVelocities[12] *= 3; //attractor should be in the bounding box for this to work properly 
                    }
                    boidVelocities[13] = (p0.boid.attractor.y-p0.position.y)*p0.boid.attractor.mul;
                    if(p0.position.y > p0.boundingBox.top || p0.position.y < p0.boundingBox.bottom) {
                        boidVelocities[13] *= 3;
                    }
                    boidVelocities[14] = (p0.boid.attractor.z-p0.position.z)*p0.boid.attractor.mul;
                    if(p0.position.z > p0.boundingBox.front || p0.position.z < p0.boundingBox.back) {
                        boidVelocities[14] *= 3;
                    }
                }
            
                //console.log(attractorVec)
    
                //if(i===0) console.log(p0, p0.position, p0.velocity, cohesionVec,separationVec,alignmentVec,swirlVec,attractorVec)
    
                p0.velocity.x=p0.velocity.x+boidVelocities[0]+boidVelocities[3]+boidVelocities[6]+boidVelocities[9]+boidVelocities[12]+boidVelocities[15],
                p0.velocity.y=p0.velocity.y+boidVelocities[1]+boidVelocities[4]+boidVelocities[7]+boidVelocities[10]+boidVelocities[13]+boidVelocities[16],
                p0.velocity.z=p0.velocity.z+boidVelocities[2]+boidVelocities[5]+boidVelocities[8]+boidVelocities[11]+boidVelocities[14]+boidVelocities[17]
                
                //console.log(i,groupCount)
                if(isNaN(p0.velocity.x)) console.error(p0, i, groupCount, p0.position, p0.velocity,swirlVec,attractorVec)
            }
        
            //console.timeEnd('boidloop')
            //console.log('nloops', nloops, timeStep)
            return entities;
        }
    },// as SystemProps,
    movement:{ //update force/acceleration/velocity/position vectors
        tag:'movement',
        lastTime:performance.now(),
        setupEntities:function (entities:{[key:string]:Entity}){ //install needed data structures to entities
            for(const key in entities) {
                const entity = entities[key];
                if(entity.components) if(!entity.components[this.tag]) continue;

                this.setupEntity(entity);
            }
        },
        setupEntity:function (entity:Entity) {
            if(!('mass' in entity)) entity.mass = 1;
            if(!('fixed' in entity)) entity.fixed = false;
            if(!entity.force) entity.force = {x:0,y:0,z:0};
            if(!('mass' in entity)) entity.mass = 1;
            if(!('gravity' in entity)) entity.gravity = -9.81; //m/s^2 on earth
            if(!entity.acceleration) entity.acceleration = {x:0,y:0,z:0};
            if(!entity.velocity) entity.velocity = {x:0,y:0,z:0};
            if(!('maxSpeed' in entity)) entity.maxSpeed = 10;
            if(!entity.position) entity.position = {x:0,y:0,z:0};

            return entity;
        },
        operator:function(entities:{[key:string]:Entity}){
            let now = performance.now();
            let timeStep = (now - this.lastTime) * 0.001;
            this.lastTime = now; 

            let keys = this.entityKeys;

            for(let i = 0; i < keys.length; i++) {
                const entity = entities[keys[i]];
                if(entity.components) if(!entity.components[this.tag]) continue;
                if(entity.fixed) continue;
                
                if(entity.mass) { //F = ma, F in Newtons, m in kg, a in m/s^2
                    if(entity.force.x) {
                        entity.acceleration.x += entity.force.x/entity.mass;
                        entity.force.x = 0;
                    }
                    if(entity.force.y) {
                        entity.acceleration.y += entity.force.y/entity.mass;
                        entity.force.y = 0;
                    }
                    if(entity.force.z) {
                        entity.acceleration.z += entity.force.z/entity.mass + entity.gravity;
                        entity.force.z = 0;
                    }
                }

                if(entity.drag) { //e.g.
                    if(entity.acceleration.x) entity.acceleration.x -= entity.acceleration.x*entity.drag*timeStep;
                    if(entity.acceleration.y) entity.acceleration.y -= entity.acceleration.y*entity.drag*timeStep;
                    if(entity.acceleration.z) entity.acceleration.z -= entity.acceleration.z*entity.drag*timeStep;
                }
                if(entity.acceleration.x) entity.velocity.x += entity.acceleration.x*timeStep;
                if(entity.acceleration.y) entity.velocity.y += entity.acceleration.y*timeStep;
                if(entity.acceleration.z) entity.velocity.z += entity.acceleration.z*timeStep;

                if(entity.maxSpeed > 0) {
                    let magnitude = Systems.collision.magnitude(entity.velocity);
                    if(magnitude > entity.maxSpeed) {
                        let scalar = entity.maxSpeed / magnitude;
                        entity.velocity.x *= scalar;
                        entity.velocity.y *= scalar;
                        entity.velocity.z *= scalar;
                    }
                }

                if(entity.velocity.x) entity.position.x += entity.velocity.x*timeStep;
                if(entity.velocity.y) entity.position.y += entity.velocity.y*timeStep;
                if(entity.velocity.z) entity.position.z += entity.velocity.z*timeStep;
               
            }

            return entities;
        }
    } //as SystemProps,
    //materials:{} as SystemProps, //
} //as {[key:string]:SystemProps & {[key:string]:any}}


//modified entity types?