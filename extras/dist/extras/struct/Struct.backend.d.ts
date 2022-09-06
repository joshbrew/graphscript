import ObjectID from "bson-objectid";
import { AuthorizationStruct, GroupStruct, ProfileStruct } from "./datastructures/types";
import { Routes, Service, ServiceOptions } from "../../services/Service";
import { User } from '../../services/router/Router';
export declare const toObjectID: (str: any) => any;
export declare const getStringId: (mongoid: string | ObjectID) => string;
declare type CollectionsType = {
    users?: CollectionType;
    [x: string]: CollectionType;
};
declare type CollectionType = any | {
    instance?: any;
    reference: {
        [key: string]: any;
    };
};
export declare class StructBackend extends Service {
    name: string;
    debug: boolean;
    db: any;
    users: {
        [key: string]: User;
    };
    collections: CollectionsType;
    mode: 'local' | 'mongodb' | string;
    useAuths: boolean;
    constructor(options?: ServiceOptions, dboptions?: {
        users?: {
            [key: string]: User;
        };
        mode?: 'local' | 'mongodb' | string;
        db?: any;
        collections?: CollectionsType;
    });
    query: (requestingUserId: string, collection?: any, queryObj?: any, findOne?: boolean, skip?: number) => Promise<any>;
    getUser: (requestingUserId: string, lookupId: string) => Promise<any>;
    setUser: (requestingUserId: string, struct: Partial<ProfileStruct>) => Promise<any>;
    getUsersByIds: (requestingUserId: string, userIds: string[]) => Promise<any>;
    getUsersByRole: (requestingUserId: string, role: string) => Promise<any>;
    deleteUser: (requestingUserId: string, userId: string) => Promise<any>;
    setData: (requestingUserId: string, structs: any[], notify?: boolean) => Promise<any>;
    getData: (requestingUserId: string, collection?: string, ownerId?: string, dict?: any, limit?: number, skip?: number) => Promise<any>;
    getDataByIds: (requestingUserId: string, structIds: string[], ownerId?: string, collection?: string) => Promise<any>;
    getAllData: (requestingUserId: string, ownerId: string, excludedCollections?: string[]) => Promise<any>;
    deleteData: (requestingUserId: string, structIds: string[]) => Promise<any>;
    getUserGroups: (requestingUserId: string, userId?: string, groupId?: string) => Promise<any>;
    deleteGroup: (requestingUserId: string, groupId: string) => Promise<any>;
    getAuthorizations: (requestingUserId: string, ownerId?: string, authId?: string) => Promise<any>;
    deleteAuthorization: (requestingUserId: string, authId: string) => Promise<any>;
    notificationStruct(parentStruct?: any): {
        structType: string;
        timestamp: number;
        _id: string;
        note: string;
        alert: boolean;
        ownerId: string;
        parentUserId: string;
        parent: {
            structType: any;
            _id: string;
        };
    };
    checkToNotify(user: Partial<ProfileStruct>, structs?: any[], mode?: string): Promise<boolean>;
    queryMongo(user: Partial<ProfileStruct>, collection: string, queryObj?: any, findOne?: boolean, skip?: number): Promise<any>;
    setMongoData(user: Partial<ProfileStruct>, structs?: any[], notify?: boolean): Promise<boolean | any[]>;
    setMongoUser(user: Partial<ProfileStruct>, struct: Partial<ProfileStruct>): Promise<false | ProfileStruct>;
    setGroup(user: Partial<ProfileStruct>, struct: any, mode?: string): Promise<false | GroupStruct>;
    getMongoUser(user: Partial<ProfileStruct>, info?: string, bypassAuth?: boolean): Promise<{} | {
        user: ProfileStruct;
        authorizations: AuthorizationStruct[];
        groups: GroupStruct[] | {
            user: ProfileStruct;
        };
    }>;
    getMongoUsersByIds(user: Partial<ProfileStruct>, userIds?: any[]): Promise<ProfileStruct[]>;
    getMongoUsersByRoles(user: Partial<ProfileStruct>, role: string): Promise<ProfileStruct[]>;
    getMongoDataByIds(user: Partial<ProfileStruct>, structIds: string[], ownerId: string | undefined, collection: string | undefined): Promise<any[]>;
    getMongoData(user: Partial<ProfileStruct>, collection: string | undefined, ownerId: string | undefined, dict?: any | undefined, limit?: number, skip?: number): Promise<any[]>;
    getAllUserMongoData(user: Partial<ProfileStruct>, ownerId: any, excluded?: any[]): Promise<any[]>;
    getMongoDataByRefs(user: Partial<ProfileStruct>, structRefs?: any[]): Promise<any[]>;
    getMongoAuthorizations(user: Partial<ProfileStruct>, ownerId?: string, authId?: string): Promise<AuthorizationStruct[]>;
    getMongoGroups(user: Partial<ProfileStruct>, userId?: string, groupId?: string): Promise<GroupStruct[]>;
    deleteMongoData(user: Partial<ProfileStruct>, structRefs?: any[]): Promise<boolean>;
    deleteMongoUser(user: Partial<ProfileStruct>, userId: any): Promise<boolean>;
    deleteMongoGroup(user: Partial<ProfileStruct>, groupId: any): Promise<boolean>;
    deleteMongoAuthorization(user: Partial<ProfileStruct>, authId: any): Promise<boolean>;
    setAuthorization(user: Partial<ProfileStruct>, authStruct: any, mode?: string): Promise<false | AuthorizationStruct>;
    checkAuthorization(user: string | Partial<ProfileStruct> | {
        _id: string;
    }, struct: any, request?: string, //'WRITE'
    mode?: string): Promise<boolean>;
    wipeDB: () => Promise<boolean>;
    overwriteLocalData(structs: any): void;
    setLocalData(structs: any): void;
    getLocalData(collection: any, query?: any): any;
    deleteLocalData(struct: any): boolean;
    routes: Routes;
}
export {};
