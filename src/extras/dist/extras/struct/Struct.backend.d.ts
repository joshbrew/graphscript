import { ObjectId } from "./datastructures/bson.cjs";
import { AuthorizationStruct, GroupStruct, ProfileStruct } from "./datastructures/types";
import { Service } from "../../services/Service";
import { User } from '../../services/router/Router';
export declare const toObjectId: (str: any) => any;
export declare const getStringId: (mongoid: string | ObjectId) => any;
type CollectionsType = {
    [x: string]: CollectionType;
};
type CollectionType = any | {
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
        useAccessTokens?: boolean;
        useRefreshTokens?: boolean;
    });
    initDB: (dboptions: any) => void;
    query: (requestingUserId: string, collection?: any, queryObj?: any, findOne?: boolean, skip?: number, token?: string) => Promise<any>;
    getUser: (requestingUserId: string, lookupId: string, basicInfo?: boolean, token?: string) => Promise<any>;
    setUser: (requestingUserId: string, struct: Partial<ProfileStruct>, token: string) => Promise<any>;
    getUsersByIds: (requestingUserId: string, userIds: string[], basicInfo?: boolean) => Promise<any>;
    getUsersByRole: (requestingUserId: string, role: string) => Promise<any>;
    deleteUser: (requestingUserId: string, userId: string, token?: string) => Promise<any>;
    setData: (requestingUserId: string, structs: any[], notify?: boolean, token?: string) => Promise<any>;
    getData: (requestingUserId: string, collection?: string, ownerId?: string, dict?: any, limit?: number, skip?: number, token?: string) => Promise<any>;
    getDataByIds: (requestingUserId: string, structIds: string[], ownerId?: string, collection?: string, token?: string) => Promise<any>;
    getAllData: (requestingUserId: string, ownerId: string, excludedCollections?: string[], token?: string) => Promise<any>;
    deleteData: (requestingUserId: string, structIds: string[], token?: string) => Promise<any>;
    getUserGroups: (requestingUserId: string, userId?: string, groupId?: string) => Promise<any>;
    deleteGroup: (requestingUserId: string, groupId: string, token?: string) => Promise<any>;
    getAuthorizations: (requestingUserId: string, ownerId?: string, authId?: string, token?: string) => Promise<any>;
    deleteAuthorization: (requestingUserId: string, authId: string, token?: string) => Promise<any>;
    getToken: (user: Partial<ProfileStruct>) => string;
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
    queryMongo: (user: Partial<ProfileStruct>, collection: string, queryObj?: any, findOne?: boolean, skip?: number, token?: string) => Promise<any>;
    setMongoData: (user: Partial<ProfileStruct>, structs?: any[], notify?: boolean, token?: string) => Promise<boolean | any[]>;
    setMongoUser: (user: Partial<ProfileStruct>, struct: Partial<ProfileStruct>, token?: string) => Promise<false | ProfileStruct>;
    setGroup: (user: Partial<ProfileStruct>, struct: any, mode?: string, token?: string) => Promise<false | GroupStruct>;
    getMongoUser: (user: Partial<ProfileStruct>, info?: string, requireAuth?: boolean, basicInfo?: boolean, token?: string) => Promise<{} | {
        user: ProfileStruct;
        authorizations: AuthorizationStruct[];
        groups: GroupStruct[] | {
            user: ProfileStruct;
        };
    }>;
    queryUsers: (user: Partial<ProfileStruct>, info?: string, limit?: number, skip?: number, requireAuth?: boolean, token?: string) => Promise<{} | {
        user: ProfileStruct;
        authorizations: AuthorizationStruct[];
        groups: GroupStruct[] | {
            user: ProfileStruct;
        };
    }>;
    getMongoUsersByIds: (user: Partial<ProfileStruct>, userIds?: any[], basicInfo?: boolean) => Promise<ProfileStruct[]>;
    getMongoUsersByRole: (user: Partial<ProfileStruct>, role: string) => Promise<ProfileStruct[]>;
    getMongoDataByIds: (user: Partial<ProfileStruct>, structIds: string[], ownerId: string | undefined, collection: string | undefined, token?: string) => Promise<any[]>;
    getMongoData: (user: Partial<ProfileStruct>, collection: string | undefined, ownerId: string | undefined, dict?: any | undefined, limit?: number, skip?: number, token?: string) => Promise<any[]>;
    getAllUserMongoData: (user: Partial<ProfileStruct>, ownerId: any, excluded?: any[], token?: string) => Promise<any[]>;
    getMongoDataByRefs: (user: Partial<ProfileStruct>, structRefs?: any[], token?: string) => Promise<any[]>;
    getMongoAuthorizations: (user: Partial<ProfileStruct>, ownerId?: any, authId?: string, token?: string) => Promise<AuthorizationStruct[]>;
    getMongoGroups: (user: Partial<ProfileStruct>, userId?: any, groupId?: string) => Promise<GroupStruct[]>;
    deleteMongoData: (user: Partial<ProfileStruct>, structRefs?: any[], token?: string) => Promise<boolean>;
    deleteMongoUser: (user: Partial<ProfileStruct>, userId: any, token?: string) => Promise<boolean>;
    deleteMongoGroup: (user: Partial<ProfileStruct>, groupId: any, token?: string) => Promise<boolean>;
    deleteMongoAuthorization: (user: Partial<ProfileStruct>, authId: any, token?: string) => Promise<boolean>;
    setAuthorization: (user: Partial<ProfileStruct>, authStruct: any, token?: string) => Promise<false | AuthorizationStruct>;
    checkAuthorization: (user: string | Partial<ProfileStruct> | {
        _id: string;
    }, struct: any, request?: string, token?: string) => Promise<boolean>;
    wipeDB: () => Promise<boolean>;
    overwriteLocalData: (structs: any) => void;
    setLocalData: (structs: any) => void;
    getLocalData: (collection: any, query?: any) => any;
    deleteLocalData: (struct: any) => boolean;
}
export {};
