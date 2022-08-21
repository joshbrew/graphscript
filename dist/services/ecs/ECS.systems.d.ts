import { GraphNode } from "../../Graph";
import { Entity } from "./ECS.service";
export declare const Systems: {
    collision: {
        setupEntities: (self: any, entities: {
            [key: string]: Entity;
        }) => void;
        setEntity: (entity: Entity) => void;
        operator: (self: any, origin: any, entities: {
            [key: string]: GraphNode;
        }) => {
            [key: string]: GraphNode;
        };
        collisionCheck: (body1: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionEnabled?: boolean;
            collisionType: 'sphere' | 'box' | 'point';
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, body2: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionEnabled?: boolean;
            collisionType: 'sphere' | 'box' | 'point';
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }) => number | false;
        sphereCollisionCheck: (body1: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, body2: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, dist?: number) => boolean;
        boxCollisionCheck: (body1: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, body2: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }) => boolean;
        sphereBoxCollisionCheck: (sphere: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, box: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, dist?: number) => boolean;
        isPointInsideSphere: (point: {
            x: number;
            y: number;
            z: number;
        }, sphere: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }, dist?: number) => boolean;
        isPointInsideBox: (point: {
            x: number;
            y: number;
            z: number;
        }, box: {
            [key: string]: any;
            position: {
                x: number;
                y: number;
                z: number;
            };
            collisionRadius: number;
            collisionBoundsScale: {
                x: number;
                y: number;
                z: number;
            };
        }) => boolean;
        closestPointOnLine: (point: {
            x: number;
            y: number;
            z: number;
        }, lineStart: {
            x: number;
            y: number;
            z: number;
        }, lineEnd: {
            x: number;
            y: number;
            z: number;
        }) => {
            x: number;
            y: number;
            z: number;
        };
        closestPointOnPolygon: (point: {
            x: number;
            y: number;
            z: number;
        }, t0: {
            x: number;
            y: number;
            z: number;
        }, t1: {
            x: number;
            y: number;
            z: number;
        }, t2: {
            x: number;
            y: number;
            z: number;
        }) => any;
        calcNormal: (t0: {
            x: number;
            y: number;
            z: number;
        }, t1: {
            x: number;
            y: number;
            z: number;
        }, t2: {
            x: number;
            y: number;
            z: number;
        }, positive?: boolean) => {};
        dot: (v1: any, v2: any) => number;
        makeVec(p1: {
            x: number;
            y: number;
            z: number;
        }, p2: {
            x: number;
            y: number;
            z: number;
        }): {
            x: number;
            y: number;
            z: number;
        };
        vecadd: (v1: any, v2: any) => any;
        vecsub: (v1: any, v2: any) => any;
        vecmul: (v1: any, v2: any) => any;
        vecdiv: (v1: any, v2: any) => any;
        vecscale: (v1: any, scalar: number) => any;
        distance: (v1: any, v2: any) => number;
        magnitude: (v: any) => number;
        normalize: (v: any) => {};
        cross3D(v1: {
            x: number;
            y: number;
            z: number;
        }, v2: {
            x: number;
            y: number;
            z: number;
        }): {
            x: number;
            y: number;
            z: number;
        };
        nearestNeighborSearch(entities: {
            [key: string]: Entity;
        }, isWithinRadius?: number): {};
        generateBoundingVolumeTree(entities: {
            [key: string]: Entity;
        }, mode?: 'octree' | 'aabb', withinRadius?: number, minEntities?: number): any;
    };
    collider: {
        lastTime: number;
        useBoundingBox: boolean;
        collisionBounds: {
            bot: number;
            top: number;
            left: number;
            right: number;
            front: number;
            back: number;
        };
        setupEntities: (self: any, entities: {
            [key: string]: Entity;
        }) => void;
        setEntity: (entity: Entity) => void;
        operator: (self: any, origin: any, entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        checkBoundingBox: (self: any, entity: any) => void;
        resolveBoxCollision: (body1: Entity, box: Entity, negate?: boolean) => void;
        resolveSphereCollisions: (entity1: Entity, entity2: Entity, dist?: number) => void;
    };
    nbody: {
        lastTime: number;
        G: number;
        setupEntities: (self: any, entities: {
            [key: string]: Entity;
        }) => void;
        setEntity: (entity: Entity) => void;
        operator: (self: any, origin: any, entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        attract: (body1: any, body2: any, dist?: number, vecn?: {
            x: number;
            y: number;
            z: number;
        }) => void;
    };
    boid: {
        lastTime: number;
        setupEntities: (entities: any) => void;
        operator: (self: any, origin: any, entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
    };
    movement: {
        lastTime: number;
        setupEntities: (self: any, entities: {
            [key: string]: Entity;
        }) => void;
        setEntity: (entity: Entity) => void;
        operator: (self: any, origin: any, entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
    };
};
