import { Routes, Service, ServiceOptions } from "../Service";
import { User } from "../router/Router";
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
export declare type SessionUser = {
    _id: string;
    sessions: {
        [key: string]: any;
    };
    [key: string]: any;
} & Partial<User>;
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
export declare type StreamInfo = {
    [key: string]: {
        object: {
            [key: string]: any;
        };
        settings: {
            keys?: string[];
            callback?: 0 | 1 | Function;
            lastRead?: number;
            [key: string]: any;
        };
        onupdate?: (data: any, streamSettings: any) => void;
        onclose?: (streamSettings: any) => void;
    };
};
export declare class SessionsService extends Service {
    name: string;
    users: {
        [key: string]: SessionUser;
    };
    sessions: {
        private: {
            [key: string]: PrivateSessionProps;
        };
        shared: {
            [key: string]: SharedSessionProps;
        };
    };
    constructor(options: ServiceOptions, users?: {
        [key: string]: SessionUser;
    });
    getSessionInfo: (sessionId?: string, userId?: string) => {
        [key: string]: SharedSessionProps;
    };
    openPrivateSession: (options?: PrivateSessionProps, userId?: string) => any;
    openSharedSession: (options: SharedSessionProps, userId?: string) => any;
    updateSession: (options: PrivateSessionProps | SharedSessionProps, userId?: string) => any;
    joinSession: (sessionId: string, userId: string, options?: SharedSessionProps | PrivateSessionProps) => any;
    leaveSession: (sessionId: string, userId: string, clear?: boolean) => boolean;
    getFirstMatch(obj1: {
        [key: string]: any;
    }, obj2: {
        [key: string]: any;
    }): string | false;
    swapHost: (session: PrivateSessionProps | SharedSessionProps | string, newHostId?: string) => boolean;
    deleteSession: (sessionId: string, userId: string) => boolean;
    subscribeToSession: (session: SharedSessionProps | PrivateSessionProps | string, userId: string, onmessage?: (session: SharedSessionProps | PrivateSessionProps, userId: string) => void, onopen?: (session: SharedSessionProps | PrivateSessionProps, userId: string) => void, onclose?: (session: SharedSessionProps | PrivateSessionProps, userId: string) => void) => PrivateSessionProps | SharedSessionProps;
    sessionUpdateCheck: (transmit?: boolean) => any;
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
    }) => SessionUser;
    getUpdatedUserData: (user: SessionUser) => {};
    userUpdateCheck: (user: SessionUser) => {};
    setUserProps: (user: string | SessionUser, props: string | {
        [key: string]: any;
    }) => boolean;
    STREAMLATEST: number;
    STREAMALLLATEST: number;
    streamSettings: StreamInfo;
    streamFunctions: any;
    setStreamFunc: (name: string, key: string, callback?: 0 | 1 | Function) => boolean;
    addStreamFunc: (name: any, callback?: (data: any) => void) => void;
    setStream: (object?: {}, settings?: {
        keys?: string[];
        callback?: Function;
    }, streamName?: string, onupdate?: (update: any, settings: any) => void, onclose?: (settings: any) => void) => {
        object: {
            [key: string]: any;
        };
        settings: {
            [key: string]: any;
            keys?: string[];
            callback?: 0 | Function | 1;
            lastRead?: number;
        };
        onupdate?: (data: any, streamSettings: any) => void;
        onclose?: (streamSettings: any) => void;
    };
    removeStream: (streamName: any, key: any) => boolean;
    updateStreamData: (streamName: any, data?: {}) => false | {
        [key: string]: any;
    };
    getStreamUpdate: (streamName: string) => {};
    getAllStreamUpdates: () => {};
    routes: Routes;
}
