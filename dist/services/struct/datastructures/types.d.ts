export declare type ArbitraryObject = {
    [x: string | number]: any;
};
export declare type Struct = {
    _id: string;
    structType?: string | number;
    timestamp?: string | number;
    ownerId?: string | number;
    parent?: {
        structType: string;
        _id: string | number;
    };
};
export declare type DataTypes = 'byTime' | 'notes' | 'events' | 'sleep' | 'food' | 'rx' | 'hr' | 'ppg' | 'hrv' | 'ecg' | 'emg' | 'eeg' | 'fnirs' | string | number | undefined;
export declare type StructTypes = LooseStructTypes | DataTypes | 'data' | 'struct' | string | number | undefined;
export declare type LooseStructTypes = 'coherence' | 'imu' | 'eyetracker' | 'profile' | 'authorization' | 'group' | 'event' | 'chatroom' | 'comment' | 'notification' | 'schedule' | 'date' | string | number | undefined;
export declare type Data = {
    type: string;
    data: any;
    timestamp?: string | number;
};
export declare type DataStruct = {
    title?: string;
    author?: string;
    expires: boolean | number | string;
    type: string;
    data: Data[];
    tag?: string | number;
} & Struct;
export declare type EventStruct = {
    event: string;
    author: string;
    startTime: string;
    endTime: string;
    grade: string | number;
    notes: string;
    attachments: Data | string | number[];
    users: {};
    tag?: string | number;
} & Struct;
export declare type ChatroomStruct = {
    message: string;
    topic: string;
    author: string;
    attachments: Data | string | number[];
    comments: string[];
    replies: string[];
    users: {};
    audioChatActive: boolean;
    videoChatActive: boolean;
    tag?: string | number;
} & Struct;
export declare type CommentStruct = {
    author: string;
    replyTo: string;
    attachments: Data | string | number[];
    replies: string[];
    users: {};
    tag?: string | number;
} & Struct;
export declare type NotificationStruct = {
    note: string;
    parentUserId: string;
    tag?: string | number;
} & Struct;
export declare type ScheduleStruct = {
    title: string;
    author: string;
    attachments: Data | string | number[];
    dates: string[];
    tag?: string | number;
} & Struct;
export declare type DateStruct = {
    timeSet: string | number;
    notes: string;
    recurs: number | string | boolean;
    attachments: Data | string | number[];
    tag?: string | number;
} & Struct;
export declare type ProfileStruct = {
    username: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    sex?: string;
    birthday?: string;
    userRoles?: {};
    socials?: {};
    data?: {};
    type?: string;
    id?: string | number;
    tag?: string | number;
} & Struct;
export declare type AuthorizationStruct = {
    authorizedId: string;
    authorizedName: string;
    authorizerId: string;
    authorizerName: string;
    authorizations: {};
    structs: {};
    excluded: {};
    groups: {};
    status: "PENDING" | "OKAY";
    expires: string | boolean;
    associatedAuthId: string | number;
    tag?: string | number;
} & Struct;
export declare type GroupStruct = {
    name: string;
    details: string;
    admins: {};
    peers: {};
    clients: {};
    users: {};
    tag?: string | number;
} & Struct;
declare type FreqBand = [number[], number[]];
export declare type FrequencyBandNames = 'scp' | 'delta' | 'theta' | 'alpha1' | 'alpha2' | 'beta' | 'lowgamma' | 'highgamma';
export declare type FrequencyBandsStruct = {
    scp: FreqBand | [];
    delta: FreqBand | [];
    theta: FreqBand | [];
    alpha1: FreqBand | [];
    alpha2: FreqBand | [];
    beta: FreqBand | [];
    lowgamma: FreqBand | [];
    highgamma: FreqBand | [];
};
export declare type EEGStruct = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    count: number;
    times: number[];
    raw: number[];
    filtered: number[];
    fftCount: number;
    fftTimes: number[];
    ffts: [][];
    slices: FrequencyBandsStruct;
    means: FrequencyBandsStruct;
    startTime: number | string;
    tag?: string | number;
} & Struct;
export declare type CoherenceStruct = {
    x0: number;
    y0: number;
    z0: number;
    x1: number;
    y1: number;
    z1: number;
    fftCount: number;
    fftTimes: number[];
    ffts: [][];
    slices: FrequencyBandsStruct;
    means: FrequencyBandsStruct;
    startTime: number | string;
    tag?: string | number;
} & Struct;
export declare type FNIRSStruct = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    count: number;
    times: number[];
    red: number[];
    ir: number[];
    ir2: number[];
    ambient: number[];
    ratio: number[];
    temp: number[];
    beat_detect: {
        beats: any[];
        breaths: any[];
        rir: any[];
        rir2: any[];
        drir_dt: any[];
        localmins: any[];
        localmaxs: any[];
        val_dists: any[];
        peak_dists: any[];
        localmins2: any[];
        localmaxs2: any[];
        val_dists2: any[];
        peak_dists2: any[];
    };
    startTime: number | string;
    tag?: string | number;
} & Struct;
export declare type IMUStruct = {
    Ax: number[];
    Ay: number[];
    Az: number[];
    Gx: number[];
    Gy: number[];
    Gz: number[];
    startTime: number | string;
    tag?: string | number;
} & Struct;
export declare type EyeTrackerStruct = {
    count: number;
    times: number[];
    x: number[];
    y: number[];
    smax: number[];
    smay: number[];
    startTime: number | string;
    tag?: string | number;
} & Struct;
export declare type ECGStruct = {
    count: number;
    times: number[];
    raw: number[];
    filtered: number[];
    bpm: number[];
    hrv: number[];
    startTime: number | string;
    tag?: string | number;
} & Struct;
export declare type PPGStruct = FNIRSStruct;
export declare type HRVStruct = ECGStruct;
export declare type EMGStruct = EEGStruct;
export {};
