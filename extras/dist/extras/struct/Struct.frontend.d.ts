import { DataTablet } from './datastructures/index';
import { Data, ProfileStruct, AuthorizationStruct, GroupStruct, DataStruct, EventStruct, ChatroomStruct, CommentStruct, Struct } from './datastructures/types';
import { Routes, Service, ServiceOptions } from '../../services/Service';
import { User } from '../../services/router/Router';
export declare const randomId: (prefix?: any) => string;
export declare const pseudoObjectId: (m?: Math, d?: DateConstructor, h?: number, s?: (s: any) => string) => string;
export declare class StructFrontend extends Service {
    name: string;
    currentUser: User;
    tablet: DataTablet;
    collections: Map<string, any>;
    id: string;
    constructor(options?: ServiceOptions, user?: Partial<User>);
    setupUser(userinfo: Partial<User>, callback?: (currentUser: any) => void): Promise<any>;
    baseServerCallback: (data: any) => void;
    onResult(data: any): void;
    randomId(tag?: string): string;
    /**
        let struct = {
            _id: randomId(structType+'defaultId'),   //random id associated for unique identification, used for lookup and indexing
            structType: structType,     //this is how you will look it up by type in the server
            ownerId: parentUser?._id,     //owner user
            timestamp: Date.now(),      //date of creation
            parent: {structType:parentStruct?.structType,_id:parentStruct?._id}, //parent struct it's associated with (e.g. if it needs to spawn with it)
        }
     */
    addStruct(structType?: string, props?: any, //add any props you want to set, adding users[] with ids will tell who to notify if this struct is updated
    parentUser?: {
        [key: string]: any;
    }, parentStruct?: {
        [key: string]: any;
    }, updateServer?: boolean): Promise<Struct>;
    getUser: (info?: string | number, callback?: (data: any) => void) => Promise<{
        user: ProfileStruct;
        groups: [];
        authorizations: [];
    }>;
    getUsers: (ids?: (string | number)[], callback?: (data: any) => void) => Promise<any>;
    getUsersByRole: (userRole: string, callback?: (data: any) => void) => Promise<any>;
    getAllUserData: (ownerId: string | number, excluded?: any[], callback?: (data: any) => void) => Promise<any>;
    query: (collection: string, queryObj?: {}, findOne?: boolean, skip?: number, callback?: (data: any) => void) => Promise<any>;
    getData: (collection: string, ownerId?: string | number | undefined, searchDict?: any, limit?: number, skip?: number, callback?: (data: any) => void) => Promise<any>;
    getDataByIds: (structIds?: any[], ownerId?: string | number | undefined, collection?: string | undefined, callback?: (data: any) => void) => Promise<any>;
    getStructParentData: (struct: any, callback?: (data: any) => void) => Promise<any>;
    setUser: (userStruct?: {}, callback?: (data: any) => void) => Promise<any>;
    checkUserToken: (usertoken: any, user?: User, callback?: (data: any) => void) => Promise<any>;
    setData: (structs?: Partial<Struct> | Partial<Struct>[], notify?: boolean, callback?: (data: any) => void) => Promise<any>;
    updateServerData: (structs?: Partial<Struct> | Partial<Struct>[], notify?: boolean, callback?: (data: any) => void) => Promise<any>;
    deleteData: (structs?: any[], callback?: (data: any) => void) => Promise<any>;
    deleteUser: (userId: any, callback?: (data: any) => void) => Promise<any>;
    setGroup: (groupStruct?: {}, callback?: (data: any) => void) => Promise<any>;
    getUserGroups: (userId?: string, groupId?: string, callback?: (data: any) => void) => Promise<any>;
    deleteGroup: (groupId: any, callback?: (data: any) => void) => Promise<any>;
    setAuthorization: (authorizationStruct?: {}, callback?: (data: any) => void) => Promise<any>;
    getAuthorizations: (userId?: string, authorizationId?: string, callback?: (data: any) => void) => Promise<any>;
    deleteAuthorization: (authorizationId: any, callback?: (data: any) => void) => Promise<any>;
    checkForNotifications: (userId?: string) => Promise<any>;
    resolveNotifications: (notifications?: any[], pull?: boolean, user?: Partial<User>) => Promise<any>;
    setAuthorizationsByGroup: (user?: User) => Promise<any[]>;
    deleteRoom: (roomStruct: any) => Promise<any>;
    deleteComment: (commentStruct: any) => Promise<any>;
    getUserDataByAuthorization: (authorizationStruct: any, collection: any, searchDict: any, limit?: number, skip?: number, callback?: (data: any) => void) => Promise<unknown>;
    getUserDataByAuthorizationGroup: (groupId: string, collection: any, searchDict: any, limit?: number, skip?: number, callback?: (data: any) => void) => Promise<any[]>;
    overwriteLocalData(structs: any): void;
    setLocalData(structs: any): void;
    getLocalData(collection: any, query?: any): any;
    getLocalUserPeerIds: (user?: User) => any[];
    getLocalReplies(struct: any): any;
    hasLocalAuthorization(otherUserId: any, ownerId?: string): any;
    deleteLocalData(structs: any): boolean;
    deleteStruct(struct: any): boolean;
    stripStruct(struct?: {}): {};
    createStruct(structType: any, props: any, parentUser?: User, parentStruct?: any): any;
    userStruct(props?: Partial<User>, currentUser?: boolean): ProfileStruct;
    authorizeUser: (parentUser: Partial<User>, authorizerUserId?: string, authorizerUserName?: string, authorizedUserId?: string, authorizedUserName?: string, authorizations?: {}, structs?: {}, excluded?: {}, groups?: {}, expires?: boolean) => Promise<AuthorizationStruct>;
    addGroup: (parentUser: Partial<User>, name?: string, details?: string, admins?: {}, peers?: {}, clients?: {}, updateServer?: boolean) => Promise<GroupStruct>;
    dataObject(data?: any, type?: string, timestamp?: string | number): {
        type: string;
        data: any;
        timestamp: string | number;
    };
    addData: (parentUser: Partial<User>, author?: string, title?: string, type?: string, data?: string | Data[], expires?: boolean, updateServer?: boolean) => Promise<DataStruct>;
    addEvent: (parentUser: Partial<User>, author?: string, event?: string, notes?: string, startTime?: number, endTime?: number, grade?: number, attachments?: string | Data[], users?: {}, updateServer?: boolean) => Promise<EventStruct>;
    addChatroom: (parentUser: Partial<User>, authorId?: string, message?: string, attachments?: string | Data[], users?: {}, updateServer?: boolean) => Promise<ChatroomStruct>;
    addComment: (parentUser: Partial<User>, roomStruct?: {
        _id: string;
        users: any[];
        comments: any[];
    }, replyTo?: {
        _id: string;
        replies: any[];
    }, authorId?: string, message?: string, attachments?: string | Data[], updateServer?: boolean) => Promise<any[] | CommentStruct>;
    routes: Routes;
}
