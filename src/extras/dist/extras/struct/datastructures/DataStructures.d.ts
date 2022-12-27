import * as types from './types';
export declare function Struct(structType?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.Struct;
export declare const eegCoordinates: {
    [x: string]: number[];
};
export declare function setCoordinate(channelDict: any, assignTo?: {}): any;
export declare function EEGCoordinates(channelDicts?: [], genCoherenceMap?: boolean): types.EEGStruct[];
export declare function FrequencyBandsStruct(additionalBands?: types.FrequencyBandNames[], //add whatever tags
assignTo?: {}): types.FrequencyBandsStruct;
export declare function EEGStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.EEGStruct;
export declare function CoherenceStruct(coords?: {
    0: types.EEGStruct;
    1: types.EEGStruct;
}, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.CoherenceStruct;
export declare function CoherenceMap(opts?: {
    channelDicts: any[];
    taggedOnly?: boolean;
}, _?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.CoherenceStruct[];
export declare function FNIRSStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.FNIRSStruct;
export declare function IMUStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.IMUStruct;
export declare function EyeTrackerStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.EyeTrackerStruct;
export declare function ECGStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.ECGStruct;
export declare function EDAStruct(_?: string, __?: {}, ___?: {
    _id: string;
}, ____?: {
    structType: string;
    _id: string;
}): void;
export declare function PPGStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.FNIRSStruct;
export declare function HRVStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.ECGStruct;
export declare function EMGStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.EEGStruct;
export declare function ProfileStruct(tag?: string | number | undefined, assignProps?: types.ArbitraryObject, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: types.ArbitraryObject): types.ProfileStruct;
export declare function AuthorizationStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.AuthorizationStruct;
export declare function GroupStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.GroupStruct;
export declare function Data(type: string, data: any): {
    type: string;
    data: any;
    timestamp: number;
};
export declare function DataStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.DataStruct;
export declare function EventStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.EventStruct;
export declare function ChatroomStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.ChatroomStruct;
export declare function CommentStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.CommentStruct;
export declare function NotificationStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.NotificationStruct;
export declare function ScheduleStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.ScheduleStruct;
export declare function DateStruct(tag?: string | number | undefined, assignProps?: {}, parentUser?: Partial<types.ProfileStruct> | {
    _id: string;
}, parentStruct?: {
    structType: string;
    _id: string;
}): types.DateStruct;
export declare const structRegistry: {
    Struct: typeof Struct;
    EEGStruct: typeof EEGStruct;
    FNIRSStruct: typeof FNIRSStruct;
    CoherenceStruct: typeof CoherenceStruct;
    CoherenceMap: typeof CoherenceMap;
    FrequencyBandsStruct: typeof FrequencyBandsStruct;
    IMUStruct: typeof IMUStruct;
    EyeTrackerStruct: typeof EyeTrackerStruct;
    ECGStruct: typeof ECGStruct;
    EDAStruct: typeof EDAStruct;
    PPGStruct: typeof PPGStruct;
    HRVStruct: typeof HRVStruct;
    EMGStruct: typeof EMGStruct;
    ProfileStruct: typeof ProfileStruct;
    AuthorizationStruct: typeof AuthorizationStruct;
    GroupStruct: typeof GroupStruct;
    DataStruct: typeof DataStruct;
    EventStruct: typeof EventStruct;
    ChatroomStruct: typeof ChatroomStruct;
    CommentStruct: typeof CommentStruct;
    NotificationStruct: typeof NotificationStruct;
    ScheduleStruct: typeof ScheduleStruct;
    DateStruct: typeof DateStruct;
};
