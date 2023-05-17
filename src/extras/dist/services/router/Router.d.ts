import { Graph, GraphNode } from "../../core/Graph";
import { Service, ServiceOptions } from "../Service";
export declare type User = {
    _id: string;
    send: (...args: any[]) => any;
    request: (...args: any[]) => Promise<any> | Promise<any>[] | undefined;
    post: (...args: any[]) => void;
    run: (...args: any[]) => Promise<any> | Promise<any>[] | undefined;
    subscribe: (...args: any[]) => Promise<number> | Promise<number>[] | undefined;
    unsubscribe: (...args: any[]) => Promise<boolean> | Promise<boolean>[] | undefined;
    sendAll: (...args: any[]) => any;
    requestAll: (...args: any[]) => Promise<any[]> | undefined;
    postAll: (...args: any[]) => void;
    runAll: (...args: any[]) => Promise<any[]> | undefined;
    subscribeAll: (...args: any[]) => Promise<number[]> | undefined;
    unsubscribeAll: (...args: any[]) => Promise<boolean[]> | undefined;
    terminate: (...args: any[]) => boolean;
    onclose?: (user: User) => void;
    [key: string]: any;
};
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
    send?: (message: any, ...a: any[]) => any;
    request?: (message: any, method?: any, ...a: any[]) => Promise<any> | Promise<any>[];
    post?: (route: any, args?: any, method?: string, ...a: any[]) => void;
    run?: (route: any, args?: any, method?: string, ...a: any[]) => Promise<any> | Promise<any>[];
    subscribe?: (route: any, callback?: ((res: any) => void) | string, ...a: any[]) => Promise<number> | undefined;
    unsubscribe?: (route: any, sub: number, ...arrayBuffer: any[]) => Promise<boolean> | Promise<boolean>[];
    terminate: (...a: any[]) => boolean;
    onclose?: (connection: ConnectionInfo, ...args: any[]) => void;
};
export declare type RouterOptions = {
    graph?: {
        [key: string]: Service | Graph | any | {
            service: Service | Graph | any;
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
    timeout?: number;
    order?: string[];
    [key: string]: any;
} & ServiceOptions;
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
    userTimeout: number;
    order: string[];
    constructor(options?: RouterOptions);
    addUser: (info: {
        _id: string;
    } & {
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
    getConnection: (sourceId: string, hasMethod?: string, connectionId?: string) => User | ConnectionInfo | undefined;
    getConnections: (sourceId: string, hasMethod?: string, props?: {}) => {
        [key: string]: ConnectionInfo;
    };
    runConnection: (userId: string, method: 'run' | 'post' | 'subscribe' | 'unsubscribe' | 'terminate' | 'send' | 'request' | 'runAll' | 'postAll' | 'subscribeAll' | 'unsubscribeAll' | 'sendAll' | 'requestAll', args: any[], connectionId?: string) => Promise<any>;
    subscribeThroughConnection: (route: string, remoteRelay: string | ConnectionInfo, remoteEndpoint: string, callback: string | ((res: any) => void), ...args: any[]) => Promise<unknown>;
    addConnection: (options: ConnectionProps | ConnectionInfo | string, source?: string) => ConnectionInfo;
    removeConnection: (connection: string | ConnectionInfo | {
        [key: string]: any;
        _id: string;
    }, terminate?: boolean) => boolean;
    routeService: (service: Service, connections?: any, source?: string, order?: string[]) => void;
    addServiceConnections: (service: Service | string, connectionsKey: any, source?: string) => {};
    openConnection: (service: string | Service, options: {
        [key: string]: any;
    }, source?: string, ...args: any[]) => Promise<void | ConnectionInfo>;
    terminate: (connection: string | ConnectionInfo) => boolean;
    routeConnections: (route: string, transmitter: string | ConnectionInfo, receiver: string | ConnectionInfo, ...args: any[]) => Promise<number>;
    setUserData: (user: string | User, data: string | {
        [key: string]: any;
    }) => boolean;
}
export declare function connectionHasId(connection: {
    _id?: string;
    [key: string]: any;
}, timeout?: number): Promise<boolean>;
