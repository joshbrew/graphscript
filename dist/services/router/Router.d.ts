import { Graph, GraphNode } from "../../Graph";
import { Routes, Service, ServiceOptions } from "../Service";
import { ProfileStruct } from "../struct/datastructures/types";
export declare type User = {
    _id: string;
    send: (...args: any[]) => any;
    request: (...args: any[]) => Promise<any> | Promise<any>[] | undefined;
    post: (...args: any[]) => void;
    run: (...args: any[]) => Promise<any> | Promise<any>[] | undefined;
    subscribe: (...args: any[]) => Promise<number> | Promise<number>[] | undefined;
    unsubscribe: (...args: any[]) => Promise<boolean> | Promise<boolean>[] | undefined;
    terminate: (...args: any[]) => boolean;
    onclose?: (user: User) => void;
    [key: string]: any;
} & Partial<ProfileStruct>;
export declare type ConnectionProps = {
    connection: GraphNode | Graph | {
        [key: string]: any;
    } | string;
    service?: string | Graph | Service;
    source?: string;
    onclose?: (connection: ConnectionInfo, ...args: any[]) => void;
};
export declare type ConnectionInfo = {
    connection: GraphNode | Graph | {
        [key: string]: any;
    };
    service?: string | Service | Graph;
    _id: string;
    source: string;
    connectionType?: string;
    connectionsKey?: string;
    send?: (...args: any[]) => any;
    request?: (...args: any[]) => Promise<any> | Promise<any>[];
    post?: (...args: any[]) => void;
    run?: (...args: any[]) => Promise<any> | Promise<any>[];
    subscribe?: (...args: any[]) => Promise<number> | Promise<number>[] | undefined;
    unsubscribe?: (...args: any[]) => Promise<boolean> | Promise<boolean>[];
    terminate: (...args: any[]) => boolean;
    onclose?: (connection: ConnectionInfo, ...args: any[]) => void;
};
export declare type RouterOptions = ServiceOptions & {
    services?: {
        [key: string]: Service | any | {
            service: Service | any;
            connections: string[] | {
                [key: string]: any;
            };
            config?: {
                [key: string]: {
                    _id?: string;
                    source?: string;
                    onclose?: (c: ConnectionInfo, ...args: any[]) => void;
                    args?: any[];
                    [key: string]: any;
                };
            };
        };
    };
    syncServices?: boolean;
    order?: string[];
};
export declare class Router extends Service {
    name: string;
    connections: {
        [key: string]: ConnectionInfo;
    };
    sources: {
        [key: string]: {
            [key: string]: ConnectionInfo;
        };
    };
    services: {
        [key: string]: Service;
    };
    serviceConnections: {
        [key: string]: {
            [key: string]: {
                [key: string]: any;
            };
        };
    };
    users: {
        [key: string]: User;
    };
    order: string[];
    constructor(options?: RouterOptions);
    addUser: (info: Partial<ProfileStruct> & {
        onclose?: (connection: ConnectionInfo, ...args: any[]) => void;
    }, connections?: {
        [key: string]: string | ConnectionInfo | ConnectionProps;
    }, config?: {
        [key: string]: {
            [key: string]: any;
            service: Service;
            _id?: string;
            onclose?: (c: ConnectionInfo, ...args: any[]) => void;
            args?: any[];
        };
    }, receiving?: boolean) => Promise<User>;
    removeUser(profile: string | User | {
        _id: string;
        [key: string]: any;
    }, terminate?: boolean): boolean;
    getConnection: (sourceId: string, hasMethod?: string) => ConnectionInfo | undefined;
    getConnections: (sourceId: string, hasMethod?: string, props?: {}) => {
        [key: string]: ConnectionInfo;
    };
    addConnection: (options: ConnectionProps | ConnectionInfo | string, source?: string) => ConnectionInfo;
    removeConnection: (connection: string | ConnectionInfo | {
        [key: string]: any;
        _id: string;
    }, terminate?: boolean) => boolean;
    addService: (service: Service, connections?: any, includeClassName?: boolean, routeFormat?: string, syncServices?: boolean, source?: string, order?: string[]) => void;
    addServiceConnections: (service: Service | string, connectionsKey: any, source?: string) => {};
    openConnection: (service: string | Service, options: {
        [key: string]: any;
    }, source?: string, ...args: any[]) => Promise<void | ConnectionInfo>;
    terminate: (connection: string | ConnectionInfo) => boolean;
    subscribeThroughConnection: (route: string, relay: string | ConnectionInfo, endpoint: string, callback: string | ((res: any) => void), ...args: any[]) => Promise<unknown>;
    routeConnections: (route: string, transmitter: string | ConnectionInfo, receiver: string | ConnectionInfo, ...args: any[]) => Promise<number>;
    syncServices: () => void;
    setUserData: (user: string | User, data: string | {
        [key: string]: any;
    }) => boolean;
    routes: Routes;
}
