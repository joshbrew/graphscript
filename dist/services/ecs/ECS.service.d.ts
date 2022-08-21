import { GraphNode } from '../../Graph';
import { Service, ServiceOptions, RouteProp, Routes } from '../Service';
export declare type EntityProps = boolean | ({
    components: {
        [key: string]: any;
    };
} & RouteProp) | GraphNode;
export declare type SystemProps = boolean | (RouteProp & {
    operator: (self: any, origin: any, entities: {
        [key: string]: Entity;
    }) => any;
    setupEntities: (self: any, entities: {
        [key: string]: Entity;
    }) => void;
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
    }) => void;
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
    order: string[];
    animating: boolean;
    constructor(options: ECSOptions);
    updateEntities: (order?: string[], filter?: boolean) => void;
    animate: (filter?: boolean, order?: string[]) => void;
    stop: () => void;
    start: (filter?: boolean) => void;
    filterObject(o: {
        [key: string]: any;
    }, filter: (string: any, any: any) => boolean | undefined): {
        [k: string]: any;
    };
    addEntity(prototype?: {
        [key: string]: any;
    }, components?: {
        [key: string]: any;
    }): Entity;
    addSystem(prototype: {
        [key: string]: any;
    }, setup: (self: any, entities: any) => any, update: (self: any, entities: any) => any): System;
    setupEntities(entities?: any, system?: any): void;
    removeEntity(tag: string): string | GraphNode;
    removeSystem(tag: string): string | GraphNode;
    routes: Routes;
}
