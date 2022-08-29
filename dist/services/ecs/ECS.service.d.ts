import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp, Routes } from '../Service';
export declare type EntityProps = ({
    components: {
        [key: string]: any;
    };
} & RouteProp) | GraphNode;
export declare type SystemProps = (RouteProp & {
    operator: (entities: {
        [key: string]: Entity;
    }) => any;
    setupEntities: (entities: {
        [key: string]: Entity;
    }) => {
        [key: string]: Entity;
    };
    setupEntity: (entity: Entity) => Entity;
}) | GraphNode;
export declare type Entity = {
    components: {
        [key: string]: any;
    };
} & GraphNode;
export declare type System = {
    operator: (entities: {
        [key: string]: Entity;
    }) => any;
    setupEntities: (entities: {
        [key: string]: Entity;
    }) => {
        [key: string]: Entity;
    };
    setupEntity: (entity: Entity) => Entity;
    remove?: (entity: Entity, entitities: {
        [key: string]: Entity;
    }) => Entity;
    entities: {
        [key: string]: Entity;
    };
    entityKeys: string[];
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
    entityMap: Map<string, {
        [key: string]: Entity;
    }>;
    entityKeyMap: Map<string, string[]>;
    order: string[];
    animating: boolean;
    entityCt: number;
    systemCt: number;
    constructor(options?: ECSOptions);
    updateEntities: (order?: string[], filter?: boolean, debug?: any) => void;
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
    addSystem: (prototype: SystemProps, setupEntities?: (entities: {
        [key: string]: Entity;
    }) => any, setupEntity?: (entity: Entity) => any, operator?: (entities: any) => any, remove?: (entities: any) => any, order?: string[]) => System;
    setupEntity: (entity: Entity) => void;
    removeEntity: (tag: string) => string | GraphNode;
    removeEntities(entities: string[] | {
        [key: string]: Entity;
    }): void;
    removeSystem: (tag: string) => string | GraphNode;
    filterObject(o: {
        [key: string]: any;
    }, filter: (string: any, any: any) => boolean | undefined): {
        [k: string]: any;
    };
    setEntities: (entities: string[] | {
        [key: string]: Entity;
    }, props: {
        [key: string]: any;
    }) => boolean;
    setEntity: (entity: Entity, props: {
        [key: string]: any;
    }) => any;
    bufferValues: (entities: {
        [key: string]: Entity;
    }, property: string, keys?: string[] | {
        [key: string]: any;
    }, buffer?: ArrayBufferLike) => ArrayBufferLike;
    routes: Routes;
}
