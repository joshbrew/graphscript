import { Graph, GraphNode, GraphNodeProperties } from "../../Graph";
import { Protocol, Router, RouterOptions } from "../Router";
import { Routes, Service, ServiceMessage } from "../../services/Service";
export declare type UserProps = {
    _id?: string;
    sockets?: {
        [key: string]: any;
    };
    wss?: {
        [key: string]: any;
    };
    eventsources?: {
        [key: string]: any;
    };
    servers?: {
        [key: string]: any;
    };
    webrtc?: {
        [key: string]: any;
    };
    sessions?: {
        [key: string]: any;
    };
    sendAll?: Protocol | string | {
        [key: string]: {
            [key: string]: any;
        };
    };
    onopen?: (connection: any) => void;
    onmessage?: (message: any) => void;
    onclose?: (connection: any) => void;
    send?: (message: any, channel?: string) => any;
    request?: (message: ServiceMessage | any, connection?: any, origin?: string, method?: string) => Promise<any>;
    latency?: number;
    [key: string]: any;
} & GraphNodeProperties;
export declare type PrivateSessionProps = {
    _id?: string;
    settings?: {
        listener: string;
        source: string;
        propnames: {
            [key: string]: boolean;
        };
        admins?: {
            [key: string]: boolean;
        };
        moderators?: {
            [key: string]: boolean;
        };
        password?: string;
        ownerId?: string;
        onopen?: (session: PrivateSessionProps) => void;
        onmessage?: (session: PrivateSessionProps) => void;
        onclose?: (session: PrivateSessionProps) => void;
        [key: string]: any;
    };
    data?: {
        [key: string]: any;
    };
    lastTransmit?: string | number;
    [key: string]: any;
};
export declare type SharedSessionProps = {
    _id?: string;
    settings?: {
        name: string;
        propnames: {
            [key: string]: boolean;
        };
        users?: {
            [key: string]: boolean;
        };
        host?: string;
        hostprops?: {
            [key: string]: boolean;
        };
        admins?: {
            [key: string]: boolean;
        };
        moderators?: {
            [key: string]: boolean;
        };
        spectators?: {
            [key: string]: boolean;
        };
        banned?: {
            [key: string]: boolean;
        };
        password?: string;
        ownerId?: string;
        onopen?: (session: SharedSessionProps) => void;
        onmessage?: (session: SharedSessionProps) => void;
        onclose?: (session: SharedSessionProps) => void;
        [key: string]: any;
    };
    data?: {
        shared: {
            [key: string]: {
                [key: string]: any;
            };
        };
        private?: {
            [key: string]: any;
        };
        [key: string]: any;
    };
    lastTransmit?: string | number;
    [key: string]: any;
};
export declare class UserRouter extends Router {
    users: {
        [key: string]: GraphNode;
    };
    sessions: {
        private: {
            [key: string]: PrivateSessionProps;
        };
        shared: {
            [key: string]: SharedSessionProps;
        };
    };
    constructor(services: (Service | Graph | Routes | any)[] | {
        [key: string]: Service | Graph | Routes | any;
    } | any[], options?: RouterOptions);
    runAs: (node: string | GraphNode, userId: string | UserProps | (UserProps & GraphNode) | undefined, ...args: any[]) => any;
    pipeAs: (source: string | GraphNode, destination: string, transmitter: Protocol | string, userId: string | UserProps | (UserProps & GraphNode) | undefined, method: string, callback: (res: any) => any | void) => number | false;
    _initConnections: (connections: UserProps) => void;
    addUser: (user: UserProps | any, timeout?: number) => Promise<UserProps | any>;
    removeUser: (user: (UserProps & GraphNode) | string) => boolean;
    updateUser: (user: (UserProps & GraphNode) | string, options: UserProps) => false | ({
        [key: string]: any;
        _id?: string;
        sockets?: {
            [key: string]: any;
        };
        wss?: {
            [key: string]: any;
        };
        eventsources?: {
            [key: string]: any;
        };
        servers?: {
            [key: string]: any;
        };
        webrtc?: {
            [key: string]: any;
        };
        sessions?: {
            [key: string]: any;
        };
        sendAll?: string | {
            [key: string]: {
                [key: string]: any;
            };
        };
        onopen?: (connection: any) => void;
        onmessage?: (message: any) => void;
        onclose?: (connection: any) => void;
        send?: (message: any, channel?: string) => any;
        request?: (message: any, connection?: any, origin?: string, method?: string) => Promise<any>;
        latency?: number;
    } & GraphNodeProperties & GraphNode);
    setUser: (user: string | (UserProps & GraphNode), props: string | {
        [key: string]: any;
    }) => boolean;
    getConnectionInfo: (user: UserProps | (UserProps & GraphNode)) => any;
    getSessionInfo: (sessionId?: string, userId?: string | (UserProps & GraphNode)) => {
        [key: string]: SharedSessionProps;
    };
    openPrivateSession: (options?: PrivateSessionProps, userId?: string | UserProps | (UserProps & GraphNode)) => any;
    openSharedSession: (options: SharedSessionProps, userId: string | UserProps | (UserProps & GraphNode)) => any;
    updateSession: (options: PrivateSessionProps | SharedSessionProps, userId?: string | UserProps | (UserProps & GraphNode)) => any;
    joinSession: (sessionId: string, userId: string | UserProps | (UserProps & GraphNode), options?: SharedSessionProps | PrivateSessionProps) => any;
    leaveSession: (sessionId: string, userId: string | UserProps | (UserProps & GraphNode), clear?: boolean) => boolean;
    getFirstMatch(obj1: {
        [key: string]: any;
    }, obj2: {
        [key: string]: any;
    }): string | false;
    swapHost: (session: PrivateSessionProps | SharedSessionProps | string, newHostId?: string) => boolean;
    deleteSession: (sessionId: string, userId: string | UserProps) => boolean;
    subscribeToSession: (session: SharedSessionProps | PrivateSessionProps | string, userId: string | UserProps | (UserProps & GraphNode), onmessage?: (session: SharedSessionProps | PrivateSessionProps, userId: string) => void, onopen?: (session: SharedSessionProps | PrivateSessionProps, userId: string) => void, onclose?: (session: SharedSessionProps | PrivateSessionProps, userId: string) => void) => PrivateSessionProps | SharedSessionProps;
    sessionLoop: (sendAll?: boolean) => any;
    transmitSessionUpdates: (updates: {
        private: {
            [key: string]: any;
        };
        shared: {
            [key: string]: any;
        };
    }) => {};
    receiveSessionUpdates: (origin: any, update: string | {
        private: {
            [key: string]: any;
        };
        shared: {
            [key: string]: any;
        };
    }) => GraphNode;
    getUpdatedUserData: (user: UserProps & GraphNode) => {};
    userUpdateCheck: (user: UserProps & GraphNode) => {};
    routes: Routes;
}
