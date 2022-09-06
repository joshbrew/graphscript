import { GraphNode } from "../../Graph";
import { Entity } from "../../services/ecs/ECS.service";
export declare const Systems: {
    collision: {
        tag: string;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        setupEntity: (entity: Entity) => Entity;
        operator: (entities: {
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
        }, positive?: boolean) => any;
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
        normalize: (v: any) => any;
        distance3D(v1: {
            x: number;
            y: number;
            z: number;
        }, v2: {
            x: number;
            y: number;
            z: number;
        }): number;
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
        tag: string;
        lastTime: number;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        setupEntity: (entity: Entity) => Entity;
        operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        checkBoundingBox: (entity: any) => void;
        resolveBoxCollision: (body1: Entity, box: Entity, negate?: boolean) => void;
        resolveSphereCollisions: (entity1: Entity, entity2: Entity, dist?: number) => void;
    };
    nbody: {
        tag: string;
        lastTime: number;
        G: number;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        setupEntity: (entity: Entity) => Entity;
        operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        attract: (body1: any, body2: any, dist?: number, G?: any, vecn?: {
            x: number;
            y: number;
            z: number;
        }) => void;
    };
    boid: {
        tag: string;
        lastTime: number;
        defaultAnchor: {
            x: number;
            y: number;
            z: number;
            mul: number;
        };
        setupEntities: (entities: any) => any;
        setupEntity: (entity: Entity) => Entity;
        operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
    };
    movement: {
        tag: string;
        lastTime: number;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => void;
        setupEntity: (entity: Entity) => Entity;
        operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
    };
};
