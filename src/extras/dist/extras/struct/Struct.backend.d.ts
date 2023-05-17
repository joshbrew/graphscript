import { ObjectId } from "./datastructures/bson.cjs";
import { AuthorizationStruct, GroupStruct, ProfileStruct } from "./datastructures/types";
import { Service } from "../../services/Service";
import { User } from '../../services/router/Router';
export declare const toObjectId: (str: any) => any;
export declare const getStringId: (mongoid: string | ObjectId) => any;
declare type CollectionsType = {
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
    mode: 'local' | 'mongo' | string;
    useAuths: boolean;
    useAccessTokens: boolean;
    useRefreshTokens: boolean;
    accessTokens: Map<string, string>;
    refreshTokens: Map<string, string>;
    constructor(options?: any, dboptions?: {
        users?: {
            [key: string]: User;
        };
        mode?: 'local' | 'mongo' | string;
        db?: any;
        collections?: CollectionsType;
        useAuths?: boolean;
        debug?: boolean;
    });
    initDB: (dboptions: any) => void;
    query: (requestingUserId: string, collection?: any, queryObj?: any, findOne?: boolean, skip?: number, accessToken?: string) => Promise<any>;
    getUser: (requestingUserId: string, lookupId: string, basicInfo?: boolean, accessToken?: string) => Promise<any>;
    setUser: (requestingUserId: string, struct: Partial<ProfileStruct>, accessToken: string) => Promise<any>;
    getUsersByIds: (requestingUserId: string, userIds: string[], basicInfo?: boolean) => Promise<any>;
    getUsersByRole: (requestingUserId: string, role: string) => Promise<any>;
    deleteUser: (requestingUserId: string, userId: string, accessToken?: string) => Promise<any>;
    setData: (requestingUserId: string, structs: any[], notify?: boolean, accessToken?: string) => Promise<any>;
    getData: (requestingUserId: string, collection?: string, ownerId?: string, dict?: any, limit?: number, skip?: number, accessToken?: string) => Promise<any>;
    getDataByIds: (requestingUserId: string, structIds: string[], ownerId?: string, collection?: string, accessToken?: string) => Promise<any>;
    getAllData: (requestingUserId: string, ownerId: string, excludedCollections?: string[], accessToken?: string) => Promise<any>;
    deleteData: (requestingUserId: string, structIds: string[], accessToken?: string) => Promise<any>;
    getUserGroups: (requestingUserId: string, userId?: string, groupId?: string) => Promise<any>;
    deleteGroup: (requestingUserId: string, groupId: string, accessToken?: string) => Promise<any>;
    getAuthorizations: (requestingUserId: string, ownerId?: string, authId?: string, accessToken?: string) => Promise<any>;
    deleteAuthorization: (requestingUserId: string, authId: string, accessToken?: string) => Promise<any>;
    notificationStruct: (parentStruct?: any) => {
        structType: string;
        timestamp: number;
        _id: string;
        note: string;
        alert: boolean;
        ownerId: string;
        parentUserId: string;
        parent: {
            structType: any;
            _id: any;
        };
    };
    checkToNotify: (user: Partial<ProfileStruct>, structs?: any[], mode?: string) => Promise<boolean>;
    queryMongo: (user: Partial<ProfileStruct>, collection: string, queryObj?: any, findOne?: boolean, skip?: number, accessToken?: string) => Promise<any>;
    setMongoData: (user: Partial<ProfileStruct>, structs?: any[], notify?: boolean, accessToken?: string) => Promise<boolean | any[]>;
    setMongoUser: (user: Partial<ProfileStruct>, struct: Partial<ProfileStruct>, accessToken?: string) => Promise<false | ProfileStruct>;
    setGroup: (user: Partial<ProfileStruct>, struct: any, mode?: string, accessToken?: string) => Promise<false | GroupStruct>;
    getMongoUser: (user: Partial<ProfileStruct>, info?: string, requireAuth?: boolean, basicInfo?: boolean, accessToken?: string) => Promise<{} | {
        user: ProfileStruct;
        authorizations: AuthorizationStruct[];
        groups: GroupStruct[] | {
            user: ProfileStruct;
        };
    }>;
    queryUsers: (user: Partial<ProfileStruct>, info?: string, limit?: number, skip?: number, requireAuth?: boolean, accessToken?: string) => Promise<{} | {
        user: ProfileStruct;
        authorizations: AuthorizationStruct[];
        groups: GroupStruct[] | {
            user: ProfileStruct;
        };
    }>;
    getMongoUsersByIds: (user: Partial<ProfileStruct>, userIds?: any[], basicInfo?: boolean) => Promise<ProfileStruct[]>;
    getMongoUsersByRole: (user: Partial<ProfileStruct>, role: string) => Promise<ProfileStruct[]>;
    getMongoDataByIds: (user: Partial<ProfileStruct>, structIds: string[], ownerId: string | undefined, collection: string | undefined, accessToken?: string) => Promise<any[]>;
    getMongoData: (user: Partial<ProfileStruct>, collection: string | undefined, ownerId: string | undefined, dict?: any | undefined, limit?: number, skip?: number, accessToken?: string) => Promise<any[]>;
    getAllUserMongoData: (user: Partial<ProfileStruct>, ownerId: any, excluded?: any[], accessToken?: string) => Promise<any[]>;
    getMongoDataByRefs: (user: Partial<ProfileStruct>, structRefs?: any[], accessToken?: string) => Promise<any[]>;
    getMongoAuthorizations: (user: Partial<ProfileStruct>, ownerId?: any, authId?: string, accessToken?: string) => Promise<AuthorizationStruct[]>;
    getMongoGroups: (user: Partial<ProfileStruct>, userId?: any, groupId?: string) => Promise<GroupStruct[]>;
    deleteMongoData: (user: Partial<ProfileStruct>, structRefs?: any[], accessToken?: string) => Promise<boolean>;
    deleteMongoUser: (user: Partial<ProfileStruct>, userId: any, accessToken?: string) => Promise<boolean>;
    deleteMongoGroup: (user: Partial<ProfileStruct>, groupId: any, accessToken?: string) => Promise<boolean>;
    deleteMongoAuthorization: (user: Partial<ProfileStruct>, authId: any, accessToken?: string) => Promise<boolean>;
    setAuthorization: (user: Partial<ProfileStruct>, authStruct: any, accessToken?: string) => Promise<false | AuthorizationStruct>;
    checkAuthorization: (user: string | Partial<ProfileStruct> | {
        _id: string;
    }, struct: any, request?: string, accessToken?: string) => Promise<boolean>;
    wipeDB: () => Promise<boolean>;
    overwriteLocalData: (structs: any) => void;
    setLocalData: (structs: any) => void;
    getLocalData: (collection: any, query?: any) => any;
    deleteLocalData: (struct: any) => boolean;
}
export {};
