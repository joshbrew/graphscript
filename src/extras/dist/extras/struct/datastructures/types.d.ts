export type ArbitraryObject = {
    [x: string | number]: any;
};
export type Struct = {
    _id: string;
    structType?: string | number;
    timestamp?: string | number;
    ownerId?: string | number;
    parent?: {
        structType: string;
        _id: string | number;
    };
    [key: string]: any;
};
export type DataTypes = 'byTime' | 'notes' | 'events' | 'sleep' | 'food' | 'rx' | 'hr' | 'ppg' | 'hrv' | 'ecg' | 'emg' | 'eeg' | 'fnirs' | string | number | undefined;
export type StructTypes = LooseStructTypes | DataTypes | 'data' | 'struct' | string | number | undefined;
export type LooseStructTypes = 'coherence' | 'imu' | 'eyetracker' | 'profile' | 'authorization' | 'group' | 'event' | 'chatroom' | 'comment' | 'notification' | 'schedule' | 'date' | string | number | undefined;
export type Data = {
    type: string;
    data: any;
    timestamp?: string | number;
};
export type DataStruct = {
    title?: string;
    author?: string;
    expires: boolean | number | string;
    type: string;
    data: Data[];
    tag?: string | number;
} & Struct;
export type EventStruct = {
    event: string;
    author: string;
    startTime: string;
    endTime?: string;
    grade?: string | number;
    value?: any;
    units?: string;
    notes?: string;
    location?: any;
    attachments?: Data | string | number[];
    users?: {
        [key: string]: true;
    };
    tag?: string | number;
} & Struct;
export type ChatroomStruct = {
    message: string;
    topic: string;
    author: string;
    attachments: Data | string | number[];
    comments: string[];
    replies: string[];
    users: {
        [key: string]: true;
    };
    audioChatActive: boolean;
    videoChatActive: boolean;
    tag?: string | number;
} & Struct;
export type CommentStruct = {
    author: string;
    replyTo: string;
    attachments: Data | string | number[];
    replies: string[];
    users: {
        [key: string]: true;
    };
    tag?: string | number;
} & Struct;
export type NotificationStruct = {
    note: string;
    parentUserId: string;
    tag?: string | number;
} & Struct;
export type ScheduleStruct = {
    title: string;
    author: string;
    attachments: Data | string | number[];
    dates: string[];
    tag?: string | number;
} & Struct;
export type DateStruct = {
    timeSet: string | number;
    notes: string;
    recurs: number | string | boolean;
    attachments: Data | string | number[];
    tag?: string | number;
} & Struct;
export type ProfileStruct = {
    username?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    sex?: string;
    birthday?: string;
    userRoles?: {};
    socials?: {};
    data?: {};
    type?: string;
    hidden?: boolean;
    pictureUrl: string;
    accessToken?: string;
    refreshToken?: string;
    tag?: string | number;
} & Struct;
export type AuthorizationStruct = {
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
export type GroupStruct = {
    name: string;
    details: string;
    admins: {};
    peers: {};
    clients: {};
    users: {};
    tag?: string | number;
} & Struct;
type FreqBand = [number[], number[]];
export type FrequencyBandNames = 'scp' | 'delta' | 'theta' | 'alpha1' | 'alpha2' | 'beta' | 'lowgamma' | 'highgamma';
export type FrequencyBandsStruct = {
    scp: FreqBand | [];
    delta: FreqBand | [];
    theta: FreqBand | [];
    alpha1: FreqBand | [];
    alpha2: FreqBand | [];
    beta: FreqBand | [];
    lowgamma: FreqBand | [];
    highgamma: FreqBand | [];
};
export type EEGStruct = {
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
export type CoherenceStruct = {
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
export type FNIRSStruct = {
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
export type IMUStruct = {
    Ax: number[];
    Ay: number[];
    Az: number[];
    Gx: number[];
    Gy: number[];
    Gz: number[];
    startTime: number | string;
    tag?: string | number;
} & Struct;
export type EyeTrackerStruct = {
    count: number;
    times: number[];
    x: number[];
    y: number[];
    smax: number[];
    smay: number[];
    startTime: number | string;
    tag?: string | number;
} & Struct;
export type ECGStruct = {
    count: number;
    times: number[];
    raw: number[];
    filtered: number[];
    bpm: number[];
    hrv: number[];
    startTime: number | string;
    tag?: string | number;
} & Struct;
export type PPGStruct = FNIRSStruct;
export type HRVStruct = ECGStruct;
export type EMGStruct = EEGStruct;
export {};
