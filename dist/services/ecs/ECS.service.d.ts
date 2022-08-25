import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp, Routes } from '../Service';
export declare type EntityProps = ({
    components: {
        [key: string]: any;
    };
} & RouteProp) | GraphNode;
export declare type SystemProps = (RouteProp & {
    operator: (self: any, origin: any, entities: {
        [key: string]: Entity;
    }) => any;
    setupEntities: (self: any, entities: {
        [key: string]: Entity;
    }) => {
        [key: string]: Entity;
    };
    setupEntity: (self: any, entity: Entity) => Entity;
}) | GraphNode;
export declare type Entity = {
    components: {
        [key: string]: any;
    };
} & GraphNode;
export declare type System = {
    operator: (self: any, origin: any, entities: {
        [key: string]: Entity;
    }) => any;
    setupEntities: (self: any, entities: {
        [key: string]: Entity;
    }) => {
        [key: string]: Entity;
    };
    setupEntity: (self: any, entity: Entity) => Entity;
} & GraphNode;
export declare type ECSOptions = {
    entities: {
        [key: string]: EntityProps;
    };
    systems: {
        [key: string]: SystemProps;
    };
    order?: string[];
} & ServiceOptions;
export declare class ECSService extends Service {
    entities: {
        [key: string]: Entity;
    };
    systems: {
        [key: string]: System;
    };
    map: Map<string, {
        [key: string]: Entity;
    }>;
    order: string[];
    animating: boolean;
    constructor(options?: ECSOptions);
    updateEntities: (order?: string[], filter?: boolean) => void;
    animate: (filter?: boolean, order?: string[]) => void;
    stop: () => void;
    start: (filter?: boolean) => void;
    addEntities: (prototype: EntityProps, components?: {
        [key: string]: any;
    }, count?: number) => string[];
    addEntity: (prototype?: EntityProps, components?: {
        [key: string]: any;
    }) => Entity;
    addSystems: (systems?: {
        [key: string]: SystemProps;
    }, order?: string[]) => {
        [key: string]: System;
    };
    addSystem: (prototype: SystemProps, setup?: (self: any, entities: any) => any, update?: (self: any, entities: any) => any, order?: string[]) => System;
    setupEntity: (entity: Entity) => void;
    removeEntity: (tag: string) => string | GraphNode;
    removeSystem: (tag: string) => string | GraphNode;
    filterObject(o: {
        [key: string]: any;
    }, filter: (string: any, any: any) => boolean | undefined): {
        [k: string]: any;
    };
    bufferValues: (entities: {
        [key: string]: Entity;
    }, property: string, keys?: string[] | {
        [key: string]: any;
    }, buffer?: ArrayBufferLike) => ArrayBufferLike;
    routes: Routes;
}
