
//The data atlas is specifically for creating structs for location-based data.
// Uses MNI acoordinates for head placement.
import * as types from './types'

/* Barebones struct format with basic metadata, append any additional props */
export function Struct(
    structType:string|number|undefined='struct', 
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {
    
    function randomId(tag = '') {
        return `${tag+Math.floor(Math.random()+Math.random()*Math.random()*10000000000000000)}`;
    }
    
    let struct: types.Struct = {
        _id: randomId(structType+'defaultId'),   //random id associated for unique identification, used for lookup and indexing
        structType: structType,     //this is how you will look it up by type in the server
        ownerId: (parentUser as types.ProfileStruct)?._id,     //owner user
        timestamp: Date.now(),      //date of creation
        parent: {structType:parentStruct?.structType,_id:parentStruct?._id}, //parent struct it's associated with (e.g. if it needs to spawn with it)
    }

    if(!struct.ownerId) delete struct.ownerId;
    if(!struct?.parent?._id) delete struct.parent;
    if(Object.keys(assignProps).length > 0) Object.assign(struct,assignProps); //can overwrite any default props as well
    return struct as types.Struct;
}

export const eegCoordinates = {
    FP1: [-21.2, 66.9, 12.1],
    FPZ: [1.4, 65.1, 11.3],
    FP2: [24.3, 66.3, 12.5],
    AF7: [-41.7, 52.8, 11.3],
    AF3: [-32.7, 48.4, 32.8],
    AFZ: [1.8, 54.8, 37.9],
    AF4: [35.1, 50.1, 31.1],
    AF8: [43.9, 52.7, 9.3],
    F5:  [-51.4, 26.7, 24.7],
    F3:  [-39.7, 25.3, 44.7],
    F1:  [-22.1, 26.8, 54.9],
    FZ:  [0.0, 26.8, 60.6],
    F2:  [23.6, 28.2, 55.6],
    F4:  [41.9, 27.5, 43.9],
    F6:  [52.9, 28.7, 25.2],
    F7:  [-52.1, 28.6, 3.8],
    F8:  [53.2, 28.4, 3.1],
    FC5: [-59.1, 3.0, 26.1],
    FC3: [-45.5, 2.4, 51.3],
    FC1: [-24.7, 0.3, 66.4],
    FCZ: [1.0, 1.0, 72.8],
    FC2: [26.1, 3.2, 66.0],
    FC4: [47.5, 4.6, 49.7,],
    FC6: [60.5, 4.9, 25.5],
    FT9: [-53.8, -2.1, -29.1],
    FT7: [-59.2, 3.4, -2.1],
    FT8: [60.2, 4.7, -2.8],
    FT10: [55.0, -3.6, -31.0],
    T7: [-65.8, -17.8, -2.9],
    T5: [-61.5, -65.3, 1.1],
    T3: [-70.2, -21.3, -10.7],
    T4: [71.9,-25.2,-8.2],
    T6: [59.3, -67.6,  3.8],
    T8: [67.4, -18.5, -3.4],
    C5: [-63.6, -18.9, 25.8],
    C3: [-49.1, -20.7, 53.2],
    C1: [-25.1, -22.5, 70.1],
    CZ: [0.8, -21.9, 77.4],
    C2: [26.7, -20.9, 69.5],
    C4: [50.3, -18.8, 53.0],
    C6: [65.2, -18.0, 26.4],
    CP5: [-61.8, -46.2, 22.5],
    CP3: [-46.9, -47.7, 49.7],
    CP1: [-24.0, -49.1, 66.1],
    CPZ: [0.7, -47.9, 72.6],
    CP2: [25.8, -47.1, 66.0],
    CP4: [49.5, -45.5, 50.7],
    CP6: [62.9, -44.6, 24.4],
    TP9: [-73.6, -46.7, -4.0], // estimated
    TP7: [-63.6, -44.7, -4.0],
    TP8: [64.6, -45.4, -3.7],		
    TP10: [74.6, -47.4, -3.7], // estimated
    P9: [-50.8, -51.3, -37.7],
    P7: [-55.9, -64.8, 0.0],
    P5: [-52.7, -67.1, 19.9],
    P3: [-41.4, -67.8, 42.4],
    P1: [-21.6, -71.3, 52.6],
    PZ: [0.7, -69.3, 56.9],
    P2: [24.4, -69.9, 53.5],
    P4: [44.2, -65.8, 42.7],
    P6: [54.4, -65.3, 20.2],
    P8: [56.4, -64.4, 0.1],
    P10: [51.0, -53.9, -36.5],
    PO7: [-44.0, -81.7, 1.6],
    PO3: [-33.3, -84.3, 26.5],
    POZ: [0.0, -87.9, 33.5],
    PO4: [35.2, -82.6, 26.1],
    PO8: [43.3, -82.0, 0.7],
    O1: [-25.8, -93.3, 7.7],
    OZ: [0.3, -97.1, 8.7],
    O2: [25.0, -95.2, 6.2]
} as {[x:string]: number[]}

export function setCoordinate(channelDict:any, assignTo={}) { // TODO: Define channelDict
    
    if(!eegCoordinates[channelDict.tag] && channelDict.position) {
        eegCoordinates[channelDict.tag] = [channelDict.position.x, channelDict.position.y, channelDict.position.z];
    }

    if(eegCoordinates[channelDict.tag]) {
        let props = {
            channel: '',
            position:{
                x:eegCoordinates[channelDict.tag][0],
                y:eegCoordinates[channelDict.tag][1],
                z:eegCoordinates[channelDict.tag][2]
            }
        };

        return Object.assign(assignTo,props);
    } else return Object.assign(assignTo,channelDict);

}

export function EEGCoordinates(channelDicts:[]=[], genCoherenceMap=true) {
    let structs:any[] = [];
    for(let channelDict of channelDicts) {
        let struct = EEGStruct(channelDict);
        structs.push(struct);
    }
    if(genCoherenceMap) {
        structs.push(...CoherenceMap({channelDicts}));
    }

    return structs as types.EEGStruct[];
}

//Returns an object with arrays for each key. These will denote the frequencies represented in the FFT, split for quick reference in each band.
export function FrequencyBandsStruct(
    additionalBands:types.FrequencyBandNames[] = [], //add whatever tags
    assignTo={} //can assign properties to another object e.g. a fully loaded struct
) {
    let bands: types.FrequencyBandsStruct = {
        scp: [], 
        delta: [], 
        theta: [], 
        alpha1: [], 
        alpha2: [], 
        beta: [], 
        lowgamma: [], 
        highgamma: []
    };

    additionalBands.forEach((band:types.FrequencyBandNames) => bands[band] = []); 

    return Object.assign(assignTo,bands);
}

export function EEGStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {
    let bands = FrequencyBandsStruct();
    let props = {
        tag:tag, 
        position:{x:0,y:0,z:0},
        count:0,
        times:[], 
        raw:[], 
        filtered:[], 
        fftCount:0,
        fftTimes:[], //Separate timing for ffts on workers
        ffts:[], 
        slices:JSON.parse(JSON.stringify(bands)), 
        means:JSON.parse(JSON.stringify(bands)),
        startTime:Date.now()
    };

    let struct = Struct('eeg', props, parentUser, parentStruct) as types.EEGStruct
    
    if(tag) setCoordinate(props,struct);

    return Object.assign(struct,assignProps) as types.EEGStruct;
}

export function CoherenceStruct(
    coords={0:EEGStruct('FP1'), 1:EEGStruct('FP2')},
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {
    let bands = FrequencyBandsStruct();
	let props =	{
        tag: coords[0]?.tag+"::"+coords[1]?.tag,
        x0:  coords[0]?.position?.x,
        y0:  coords[0]?.position?.y,
        z0:  coords[0]?.position?.z,
        x1: coords[1]?.position?.x,
        y1: coords[1]?.position?.y,
        z1: coords[1]?.position?.z,
        fftCount: 0,
        fftTimes:[],
        ffts:[],
        slices: JSON.parse(JSON.stringify(bands)),
        means: JSON.parse(JSON.stringify(bands)),  // counter value when this struct was last read from (for using get functions)
        startTime:Date.now()
    };

    let struct = Struct('coherence',props,parentUser,parentStruct);
    
    return Object.assign(struct,assignProps) as types.CoherenceStruct;
    
}

export function CoherenceMap(
    opts:{channelDicts:any[], taggedOnly?:boolean}={channelDicts:[{ch:0, tag:'FP1', analyze: false},{ch:1,tag:'FP2', analyze: false}],taggedOnly:true}, 
    _:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {
    var cmap:any[] = [];
    var l = 1, k = 0;

    for( var i = 0; i < (opts.channelDicts.length*(opts.channelDicts.length + 1)/2)-opts.channelDicts.length; i++){
        if(opts.taggedOnly === false || (opts.taggedOnly === true && 
            ((opts.channelDicts[k].tag !== null && opts.channelDicts[k+l].tag !== null) 
            &&(opts.channelDicts[k].tag !== 'other' && opts.channelDicts[k+l].tag !== 'other')
            &&(opts.channelDicts[k].analyze === true && opts.channelDicts[k+l].analyze === true)))) 
        {
            var coord0 = EEGStruct(opts.channelDicts[k].tag);
            var coord1 = EEGStruct(opts.channelDicts[k+l].tag);

            // cmap.push(CoherenceStruct(coord0,coord1,parentUser,parentStruct,assignProps));
            cmap.push(CoherenceStruct({0: coord0, 1: coord1}, {}, parentUser,parentStruct));
        }
        l++;
        if (l + k === opts.channelDicts.length) {
            k++;
            l = 1;
        }
    }
    //console.log(cmap,channelTags);
    return cmap as types.CoherenceStruct[];
}

export function FNIRSStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        position:{x:0,y:0,z:0},
        count:0,
        times:[],
        red:[],
        ir:[],
        ir2:[], //if there is a second IR led for the site
        ambient:[],
        ratio:[],
        temp:[],
        beat_detect: {
            beats:[],
            breaths:[],
            rir:[],
            rir2:[],
            drir_dt:[],
            localmins:[],
            localmaxs:[],
            val_dists:[],
            peak_dists:[],
            localmins2:[],
            localmaxs2:[],
            val_dists2:[],
            peak_dists2:[]
        },
        startTime:Date.now()
    };

    
    let struct = Struct('fnirs',props,parentUser,parentStruct) as types.FNIRSStruct
        
    if(tag) setCoordinate(props, struct);
    
    return Object.assign(struct,assignProps) as types.FNIRSStruct;
	
}


export function IMUStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        Ax:[],
        Ay:[],
        Az:[],
        Gx:[],
        Gy:[],
        Gz:[],
        startTime:Date.now()
    };

    let struct = Struct('imu',props,parentUser,parentStruct);

    if(tag) setCoordinate(props,struct);
    
    return Object.assign(struct,assignProps) as types.IMUStruct;

}

export function EyeTrackerStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {

    let props = {
        tag:tag,
        count:0, 
        times:[], 
        x:[], 
        y:[], 
        smax:[],  //simple moving averages
        smay:[], 
        startTime:Date.now()
    };
    
    let struct = Struct('eyetracker',props,parentUser,parentStruct);
    
    return Object.assign(struct,assignProps) as types.EyeTrackerStruct;

}


export function ECGStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {

    let props = {
        tag:tag,
        count:0,
        times:[],
        raw:[],
        filtered:[],
        bpm:[],
        hrv:[],
        startTime:Date.now()
    };
    
    let struct = Struct('ecg',props,parentUser,parentStruct);
    
    return Object.assign(struct,assignProps) as types.ECGStruct;
    
}

export function EDAStruct(
    _:string = '',
    __={},
    ___={_id:''},
    ____={structType:'struct',_id:''} 
) {

}

export function PPGStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) { 
    let struct = FNIRSStruct(tag,parentUser,parentStruct, assignProps);
    struct.structType = 'ppg';
    return struct as types.PPGStruct;
}

export function HRVStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) { 
    let struct = ECGStruct(tag,parentUser,parentStruct,assignProps);
    struct.structType = 'hrv';
    return struct as types.HRVStruct;
}

export function EMGStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) { 
    let struct = EEGStruct(tag,parentUser,parentStruct, assignProps);
    struct.structType = 'emg';
    return struct as types.EMGStruct;
}


//User defined structs e.g. for building a communication database

export function ProfileStruct(
    tag:string|number|undefined = '',
    assignProps:types.ArbitraryObject={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct:types.ArbitraryObject={structType:'struct',_id:''} 
) {

    let props = {
        tag:      tag,
        name:      '', 
        username:  '',
        firstName: '', 
        lastName:  '', 
        email:     '', 
        phone:     '',
        sex:       '',
        birthday:  '',
        type:      '',
        userRoles: {},
        socials:   {},
        data:      {}, //arbitrary stuff
        id:        '' //references the token id which is behind a collection permission
    };

    let struct = Struct('profile',props,parentUser,parentStruct);
    
    return Object.assign(struct,assignProps) as types.ProfileStruct;

}

export function AuthorizationStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        authorizedId:     '',
        authorizedName:   '',
        authorizerId:     '',
        authorizerName:   '',
        authorizations:   {}, //authorization types e.g. what types of data the person has access to
        structs:          {}, //specific structs, contains structrefs
        excluded:         {}, 
        groups:           {},
        status:           'PENDING', //PENDING for non-approved auths
        expires:          false, 
        associatedAuthId: '' //other authorization id belonging to other user
    };

    let struct = Struct('authorization',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.AuthorizationStruct;

}

export function GroupStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        name:"",
        details:"",
        admins:{}, // can add/remove peers/clients.
        peers:{}, // gets access to clients
        clients:{}, // //gives access to peers
        users:{} //all users (for notifying)   
    };

    let struct = Struct('group',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.GroupStruct;
}

export function Data(type:string,data:any) {
    return {
        type,
        data,
        timestamp:Date.now()
    };
}

export function DataStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:       tag,
        title:      "",
        author:     "",
        expires:    false, //date of expiration, or never. Data that never expires should generally only be patient controlled stuff so its transparent
        type:       "", //graph, file, table, fitbit_hr, fitbit_diet, etc.
        data:       new Array() //arrays, objects, links, API refrences, pdfs, csvs, xls, etc.
    };

    let struct = Struct('data',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.DataStruct;
}

export function EventStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag: tag,
        event:"",  //event type e.g. relapse, hospitalization
        author:"", //
        startTime:"",  //event began
        endTime:"",    //event ended
        grade:0,  //severity
        notes:"", //additional details
        attachments:new Array(),
        users:{}, //users to be informed (i.e. peers)
    };

    let struct = Struct('event',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.EventStruct;

}

export function ChatroomStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        message:'',
        topic:'',
        author:'',
        attachments: new Array(),
        comments: new Array(),
        replies: new Array(),
        users: {},
        audioChatActive: false,
        videoChatActive: false
    };

    let struct = Struct('chatroom',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.ChatroomStruct;

}

export function CommentStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag: tag,
        author:'',
        replyTo:'',
        message:'',
        rating:0,
        replies: new Array(),
        users: {},
        attachments: new Array()
    };

    let struct = Struct('comment',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.CommentStruct;

}

export function NotificationStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        note:'',
        parentUserId:''
    };

    let struct = Struct('notification',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.NotificationStruct;

}


export function ScheduleStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        title:'',
        author:'',
        attachments: new Array(),
        dates: new Array()
    };

    let struct = Struct('schedule',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.ScheduleStruct;

}

export function DateStruct(
    tag:string|number|undefined = '',
    assignProps={},
    parentUser:Partial<types.ProfileStruct>|{_id:string}={_id:''},
    parentStruct={structType:'struct',_id:''} 
) {
    let props = {
        tag:tag,
        timeSet:'',
        notes:'',
        recurs:'NEVER',
        attachments: new Array(),
    };

    let struct = Struct('date',props,parentUser,parentStruct);

    return Object.assign(struct,assignProps) as types.DateStruct;

}

//list of available struct types
export const structRegistry = {
    Struct,
    EEGStruct,
    FNIRSStruct,
    CoherenceStruct,
    CoherenceMap,
    FrequencyBandsStruct,
    IMUStruct,
    EyeTrackerStruct,
    ECGStruct,
    EDAStruct,
    PPGStruct,
    HRVStruct,
    EMGStruct,
    ProfileStruct,
    AuthorizationStruct,
    GroupStruct,
    DataStruct,
    EventStruct,
    ChatroomStruct,
    CommentStruct,
    NotificationStruct,
    ScheduleStruct,
    DateStruct
};


