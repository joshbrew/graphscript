import { Entity } from "../../services/ecs/ECS.service";
export declare const Systems: {
    collision: {
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        setupEntity: (entity: Entity) => Entity;
        __node: {
            tag: string;
        };
        __operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
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
        }) => {
            [key: string]: number;
        };
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
        dot: (v1: {
            [key: string]: number;
        }, v2: {
            [key: string]: number;
        }) => number;
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
        vecadd: (v1: {
            [key: string]: number;
        }, v2: {
            [key: string]: number;
        }) => {
            [key: string]: number;
        };
        vecsub: (v1: {
            [key: string]: number;
        }, v2: {
            [key: string]: number;
        }) => {
            [key: string]: number;
        };
        vecmul: (v1: {
            [key: string]: number;
        }, v2: {
            [key: string]: number;
        }) => {
            [key: string]: number;
        };
        vecdiv: (v1: {
            [key: string]: number;
        }, v2: {
            [key: string]: number;
        }) => {
            [key: string]: number;
        };
        vecscale: (v1: {
            [key: string]: number;
        }, scalar: number) => {
            [key: string]: number;
        };
        distance: (v1: {
            [key: string]: number;
        }, v2: {
            [key: string]: number;
        }) => number;
        magnitude: (v: {
            [key: string]: number;
        }) => number;
        normalize: (v: {
            [key: string]: number;
        }) => {};
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
        lastTime: number;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        setupEntity: (entity: Entity) => Entity;
        __operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        __node: {
            tag: string;
        };
        checkBoundingBox: (entity: any) => void;
        resolveBoxCollision: (body1: Entity, box: Entity, negate?: boolean) => void;
        resolveSphereCollisions: (entity1: Entity, entity2: Entity, dist?: number) => void;
    };
    nbody: {
        lastTime: number;
        G: number;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        setupEntity: (entity: Entity) => Entity;
        __operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        __node: {
            tag: string;
        };
        attract: (body1: any, body2: any, dist?: number, G?: any, vecn?: {
            x: number;
            y: number;
            z: number;
        }) => void;
    };
    boid: {
        lastTime: number;
        defaultAnchor: {
            x: number;
            y: number;
            z: number;
            mul: number;
        };
        setupEntities: (entities: any) => any;
        setupEntity: (entity: Entity) => Entity;
        __operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
        __node: {
            tag: string;
        };
    };
    movement: {
        __node: {
            tag: string;
        };
        lastTime: number;
        setupEntities: (entities: {
            [key: string]: Entity;
        }) => void;
        setupEntity: (entity: Entity) => Entity;
        __operator: (entities: {
            [key: string]: Entity;
        }) => {
            [key: string]: Entity;
        };
    };
};
