import { Service, ServiceOptions } from "../Service";
import { User } from "../router/Router";
/**
 * Sessions are a way to run a loop that monitors data structures to know procedurally when and what to update
 *
 * OneWaySession: source sends props to listener, define listener, source default is creating user
 * SharedSession: two modes:
 *  Hosted: Host receives props from all users based on propnames, users receive hostprops
 *  Shared: All users receive the same props based on their own updates
 *
 * There's also these older stream API functions that are more pure for monitoring objects/arrays and updating new data e.g. out of a buffer.
 * Need to esplain/demo all that too.... @@__@@
 */
export type OneWaySessionProps = {
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
        onopen?: (session: OneWaySessionProps) => void;
        onhasupdate?: (session: OneWaySessionProps, updated: any) => void;
        onmessage?: (session: OneWaySessionProps, updated: any) => void;
        onclose?: (session: OneWaySessionProps) => void;
        [key: string]: any;
    };
    data?: {
        [key: string]: any;
    };
    lastTransmit?: string | number;
    [key: string]: any;
};
export type SessionUser = {
    _id: string;
    sessions: {
        [key: string]: any;
    };
    sessionSubs: {
        [key: string]: {
            onopenSub?: number;
            onmessage?: (session: SharedSessionProps, update: any, user: SessionUser) => void;
            onopen?: (session: SharedSessionProps, user: SessionUser) => void;
            onclose?: (session: SharedSessionProps, user: SessionUser) => void;
        };
    };
    [key: string]: any;
} & User;
export type SharedSessionProps = {
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
        inheritHostData?: boolean;
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
        onhasupdate?: (session: SharedSessionProps, updated: any) => void;
        onopen?: (session: SharedSessionProps) => void;
        onmessage?: (session: SharedSessionProps, updated: any) => void;
        onclose?: (session: SharedSessionProps) => void;
        [key: string]: any;
    };
    data?: {
        shared: {
            [key: string]: {
                [key: string]: any;
            };
        };
        oneWay?: {
            [key: string]: any;
        };
        [key: string]: any;
    };
    lastTransmit?: string | number;
    [key: string]: any;
};
export type StreamInfo = {
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
        oneWay: {
            [key: string]: OneWaySessionProps;
        };
        shared: {
            [key: string]: SharedSessionProps;
        };
    };
    invites: {
        [key: string]: {
            [key: string]: {
                session: OneWaySessionProps | SharedSessionProps | string;
                endpoint?: string;
            };
        };
    };
    constructor(options?: ServiceOptions, users?: {
        [key: string]: SessionUser;
    });
    getSessionInfo: (sessionIdOrName?: string, userId?: string) => {};
    openOneWaySession: (options?: OneWaySessionProps, sourceUserId?: string, listenerUserId?: string) => any;
    openSharedSession: (options: SharedSessionProps, userId?: string) => any;
    open: (options: any, userId?: string) => void;
    updateSession: (options: OneWaySessionProps | SharedSessionProps, userId?: string) => any;
    joinSession: (sessionId: string, userId: string, options?: SharedSessionProps | OneWaySessionProps, remoteUser?: boolean) => SharedSessionProps | OneWaySessionProps | false;
    inviteToSession: (session: OneWaySessionProps | SharedSessionProps | string, userInvited: string, inviteEndpoint?: string, remoteUser?: boolean) => void;
    receiveSessionInvite: (session: OneWaySessionProps | SharedSessionProps | string, userInvited: string, endpoint?: string) => string;
    acceptInvite: (session: OneWaySessionProps | SharedSessionProps | string, userInvited: string, remoteUser?: boolean) => Promise<SharedSessionProps | OneWaySessionProps | false>;
    rejectInvite: (session: OneWaySessionProps | SharedSessionProps | string, userInvited: string, remoteUser?: boolean) => boolean;
    leaveSession: (session: OneWaySessionProps | SharedSessionProps | string, userId: string, clear?: boolean, remoteUser?: boolean) => boolean;
    deleteSession: (session: string | OneWaySessionProps | SharedSessionProps, userId: string, remoteUsers?: boolean) => boolean;
    getFirstMatch(obj1: {
        [key: string]: any;
    }, obj2: {
        [key: string]: any;
    }): string | false;
    swapHost: (session: OneWaySessionProps | SharedSessionProps | string, newHostId?: string, adoptData?: boolean, remoteUser?: boolean) => boolean;
    subscribeToSession: (session: SharedSessionProps | OneWaySessionProps | string, userId: string, onmessage?: (session: SharedSessionProps | OneWaySessionProps, update: any, user: SessionUser) => void, onopen?: (session: SharedSessionProps | OneWaySessionProps, user: SessionUser) => void, onclose?: (session: SharedSessionProps | OneWaySessionProps, user: SessionUser) => void) => OneWaySessionProps | SharedSessionProps;
    unsubsribeFromSession: (session: SharedSessionProps | OneWaySessionProps | string, userId?: string, clear?: boolean) => any;
    sessionUpdateCheck: (sessionHasUpdate?: (session: OneWaySessionProps | SharedSessionProps, update: {
        shared?: any;
        oneWay?: any;
    }) => void, transmit?: boolean) => any;
    transmitSessionUpdates: (updates: {
        oneWay: {
            [key: string]: any;
        };
        shared: {
            [key: string]: any;
        };
    }) => {};
    receiveSessionUpdates: (origin: any, update: string | {
        oneWay: {
            [key: string]: any;
        };
        shared: {
            [key: string]: any;
        };
    }) => SessionUser;
    getUpdatedUserData: (user: SessionUser) => {};
    userUpdateCheck: (user: SessionUser, onupdate?: (user: SessionUser, updateObj: {
        [key: string]: any;
    }) => void) => {};
    setUserProps: (user: string | SessionUser, props: string | {
        [key: string]: any;
    }) => boolean;
    userUpdateLoop: {
        __operator: (user: SessionUser, onupdate?: (user: SessionUser, updateObj: {
            [key: string]: any;
        }) => void) => {};
        __node: {
            loop: number;
        };
    };
    sessionLoop: {
        __operator: (sessionHasUpdate?: (session: OneWaySessionProps | SharedSessionProps, update: {
            shared?: any;
            oneWay?: any;
        }) => void, transmit?: boolean) => any;
        __node: {
            loop: number;
        };
    };
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
    streamLoop: {
        __operator: () => {};
        __node: {
            loop: number;
        };
    };
}
