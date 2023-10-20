import { stringifyFast } from "../utils";
import { Service, ServiceOptions } from "../Service";
import { User } from "../router/Router";
import { loaders } from "../../loaders/index";

//parse from this object/endpoint and send to that object/endpoint, e.g. single users
export type PrivateSessionProps = {
    _id?:string,
    settings?:{
        listener:string,
        source:string,
        propnames:{[key:string]:boolean},
        admins?:{[key:string]:boolean},
        moderators?:{[key:string]:boolean},
        password?:string,
        ownerId?:string,
        onopen?:(session:PrivateSessionProps)=>void,
        onmessage?:(session:PrivateSessionProps, updated:any)=>void,
        onclose?:(session:PrivateSessionProps)=>void,
        [key:string]:any //arbitrary props e.g. settings, passwords
    },
    data?:{
        [key:string]:any
    },
    lastTransmit?:string|number,
    [key:string]:any //arbitrary props e.g. settings, passwords
}

export type SessionUser = {
    _id:string, //unique identifier for user, used as key in users object and in general
    sessions:{[key:string]:any},
    sessionSubs:{[key:string]:{
        onopenSub?:number,
        onmessage?:(session:SharedSessionProps|PrivateSessionProps, update:any, user:SessionUser)=>void, 
        onopen?:(session:SharedSessionProps|PrivateSessionProps, user:SessionUser)=>void,
        onclose?:(session:SharedSessionProps|PrivateSessionProps, user:SessionUser)=>void
    }}
    [key:string]:any
} & Partial<User> //extend base users on the router or just wrapping a connection from another service

//sessions for shared user data and game/app logic for synchronous and asynchronous sessions to stream selected properties on user objects as they are updated
export type SharedSessionProps = {
    _id?:string,
    settings?:{
        name:string,
        propnames:{[key:string]:boolean},
        users?:{[key:string]:boolean},
        host?:string, //if there is a host, all users only receive from the host's prop updates and vise versa
        hostprops?:{[key:string]:boolean},
        passOnHostData?:boolean, //new hosts adopt old host data? Default true
        admins?:{[key:string]:boolean},
        moderators?:{[key:string]:boolean},
        spectators?:{[key:string]:boolean},
        banned?:{[key:string]:boolean},
        password?:string,
        ownerId?:string,
        onopen?:(session:SharedSessionProps)=>void,
        onmessage?:(session:SharedSessionProps, updated:any)=>void,
        onclose?:(session:SharedSessionProps)=>void,
        [key:string]:any //arbitrary props e.g. settings, passwords
    },
    data?:{
        shared:{
            [key:string]:{
                [key:string]:any
            }
        },
        private?:{ //host driven sessions will share only what the host shares to all users, while hosts will receive hidden data
            [key:string]:any
        },
        [key:string]:any
    },
    lastTransmit?:string|number,
    [key:string]:any //arbitrary props e.g. settings, passwords
}

export type StreamInfo = {
    [key:string]:{
        object:{[key:string]:any}, //the object we want to watch
        settings:{ //the settings for how we are handling the transform on the watch loop
            keys?: string[]
            callback?:0|1|Function,
            lastRead?:number,
            [key:string]:any
        },
        onupdate?:(data:any,streamSettings:any)=>void,
        onclose?:(streamSettings:any)=>void
    }
}

//Todo: streamline, we don't *really* need 3 types of streaming data structures but on the other hand everything is sort of optimized so just keep it
export class SessionsService extends Service {

    name='sessions';

    users:{ [key:string]:SessionUser } = {}

    //complex user sessions with some premade rulesets
    sessions:{
        private:{[key:string]:PrivateSessionProps}, //sync user props <--> user props
        shared:{[key:string]:SharedSessionProps}//sync user props <--> all other users props
    } = {
        private:{},
        shared:{}
    }


    constructor(options?:ServiceOptions, users?:{[key:string]:SessionUser}) {
        super(options);
        this.setLoaders(loaders);
        this.load(this);
        if(users) this.users = users;
    }

    getSessionInfo = (
        sessionId?:string, //id or name (on shared sessions)
        userId?:string
    ) => {
        if(!sessionId) {
            return this.sessions.shared;
        }
        else {
            if(this.sessions.private[sessionId]) {
                let s = this.sessions.private[sessionId];
                if(s.settings)
                    if(s.settings.source === userId || s.settings.listener === userId || s.settings.ownerId === userId || s.settings.admins?.[userId as string] || s.settings.moderators?.[userId as string])
                        return {private:{[sessionId]:s}};
            } else if(this.sessions.shared[sessionId]) {
                return {shared:{[sessionId]:this.sessions.shared[sessionId]}};
            } else {
                let res = {};
                for(const id in this.sessions.shared) {
                    if(this.sessions.shared[id].settings?.name) //get by name
                        res[id] = this.sessions.shared.settings;
                }
                if(Object.keys(res).length > 0) return res;
            }
        }
    }

    openPrivateSession = (
        options:PrivateSessionProps={}, 
        userId?:string
    ) => {
        if(!options._id) {
            options._id = `private${Math.floor(Math.random()*1000000000000000)}`;       
            if(this.sessions.private[options._id]) {
                delete options._id;
                this.openPrivateSession(options,userId); //regen id
            }
        }   
        if(options._id && userId && this.users[userId]) {
            if(userId){
                if(!options.settings) 
                    options.settings = { 
                        listener:userId, 
                        source:userId, 
                        propnames:{latency:true}, 
                        admins:{[userId]:true}, 
                        ownerId:userId 
                    };
                if(!options.settings.listener) 
                    options.settings.listener = userId;
                if(!options.settings.source) 
                    options.settings.source = userId;
                if(!this.users[userId].sessions) 
                    this.users[userId].sessions = {};
                this.users[userId].sessions[options._id] = options;
            }
            if(!options.data) options.data = {};
            if(options.onopen) options.onopen(options);
            if(this.sessions.private[options._id]) {
                return this.updateSession(options,userId);
            }
            else if(options.settings?.listener && options.settings.source) 
                this.sessions.private[options._id] = options; //need the bare min in here
        }
        return options;
    }

    openSharedSession = (
        options:SharedSessionProps, 
        userId?:string
    ) => {
        if(!options._id) {
            options._id = `shared${Math.floor(Math.random()*1000000000000000)}`;
            if(this.sessions.shared[options._id]) {
                delete options._id;
                this.openSharedSession(options,userId); //regen id
            }
        } 
        if(options._id && userId && this.users[userId]){  
            if(typeof userId === 'string') {
                if(!options.settings) 
                    options.settings = { 
                        name:'shared', 
                        propnames:{latency:true}, 
                        users:{[userId]:true}, 
                        admins:{[userId]:true}, 
                        ownerId:userId 
                    };
                
                if(!options.settings.users) 
                    options.settings.users = {[userId]:true};
                if(!options.settings.admins) 
                    options.settings.admins = {[userId]:true};
                if(!options.settings.ownerId) 
                    options.settings.ownerId = userId;
                if(!this.users[userId].sessions) 
                    this.users[userId].sessions = {};
                this.users[userId].sessions[options._id] = options;
            } 
            else if (!options.settings) 
                options.settings = {
                    name:'shared', 
                    propnames:{latency:true}, 
                    users:{}
                };
            if(!options.data) 
                options.data = { private:{}, shared:{} };
            if(!options.settings.name) 
                options.name = options.id;
            if(options.onopen) options.onopen(options);
            if(this.sessions.shared[options._id]) {
                return this.updateSession(options,userId);
            }
            else this.sessions.shared[options._id] = options;
        }
        return options;
    }

    open = (options:any,userId?:string) => {
        if(options.listener) this.openPrivateSession(options,userId);
        else this.openSharedSession(options,userId);
    }

    //update session properties, also invoke basic permissions checks for who is updating
    updateSession = (
        options:PrivateSessionProps | SharedSessionProps, 
        userId?:string
    ) => {
        //add permissions checks based on which user ID is submitting the update
        let session:any;
        if(options._id){ 
            session = this.sessions.private[options._id];
            if(!session) 
                session = this.sessions.shared[options._id];
            if(session && userId) {
                if(session.settings && (
                    session?.settings.source === userId || 
                    session.settings.admins?.[userId] || 
                    session.settings.moderators?.[userId] || 
                    session.settings.ownerId === userId
                )) {
                    return this.recursivelyAssign(session, options);
                }
            } else if(options.settings?.source) {
                return this.openPrivateSession(options as PrivateSessionProps,userId);
            } else return this.openSharedSession(options as SharedSessionProps,userId);
        }
        return false;
    }

    //add a user id to a session, Run this at the session host location and clientside if separate. remoteUser will take care of this on either endpoint for you
    //supply options e.g. to make them a moderator or update properties to be streamed dynamically
    joinSession = (   
        sessionId:string, 
        userId:string,
        options?:SharedSessionProps|PrivateSessionProps,
        remoteUser:boolean=false
    ) => {
        if(!userId && !this.users[userId]) return false;
        if(!this.users[userId].sessions) this.users[userId].sessions = {};
        let sesh = this.sessions.shared[sessionId] as SharedSessionProps|PrivateSessionProps;
        if(!sesh) sesh = this.sessions.private[sessionId];
        //console.log(sessionId,userId,sesh,this.sessions);
        if(sesh?.settings) {
            if(sesh.settings?.banned) {
                if(sesh.settings.banned[userId]) return false;
            }
            if(sesh.settings?.password) {
                if(!options?.settings?.password) return false;
                if(options.settings.password !== sesh.settings.password) return false
            }
            (sesh.settings.users as any)[userId] = true;
            sesh.settings.newUser = true;
            this.users[userId].sessions[sessionId] = sesh;
            if(options) { return this.updateSession(options,userId); };
            //console.log(sesh)
            if(remoteUser) {
                if(this.users[userId]?.send) {
                    this.users[userId].send({route:'joinSession',args:[sessionId,userId,sesh]});
                }
            }
            return sesh;
        } 
        else if (options?.source || options?.listener) {
            sesh = this.openPrivateSession(options as PrivateSessionProps,userId);
            if(remoteUser) {
                if(this.users[userId]?.send) {
                    this.users[userId].send({route:'joinSession',args:[sessionId,userId,sesh]});
                }
            }
            return sesh;
        }
        else if (options) {
            sesh = this.openSharedSession(options as SharedSessionProps,userId);
            if(remoteUser) {
                if(this.users[userId]?.send) {
                    this.users[userId].send({route:'joinSession',args:[sessionId,userId,sesh]});
                }
            }
            return sesh;
        }
        return false;
    }

    //Remove a user from a session. Private sessions will be closed
    //Run this at the session host location
    leaveSession = (
        session:PrivateSessionProps|SharedSessionProps|string,  
        userId:string, 
        clear:boolean=true, //clear all data related to this user incl permissions
        remoteUser:boolean=true //send user an all-clear to unsubscribe on their end
    ) => {
        let sessionId:string|undefined;
        if(typeof session === 'string') {
            sessionId = session;
            session = this.sessions.private[sessionId];
            if(!session) session = this.sessions.shared[sessionId];
        } else sessionId = session._id;
        if(session) {
            if(this.sessions.private[sessionId]) {
                if( userId === session.settings.source || 
                    userId === session.settings.listener || 
                    session.settings.admins?.[userId] || 
                    session.settings.moderators?.[userId]
                ) {
                    delete this.sessions.private[sessionId];
                    delete this.users[userId]?.sessions[sessionId];
                    delete this.users[userId]?.sessionSubs?.[sessionId];
                    if(clear) {
                        if(session.settings.admins?.[userId])     delete (this.sessions.shared[sessionId].settings?.admins as any)[userId];
                        if(session.settings.moderators?.[userId]) delete (this.sessions.shared[sessionId].settings?.moderators as any)[userId];
                    }
                    if(remoteUser && this.users[userId]?.send) {
                        this.users[userId].send({route:'unsubscribeFromSession',args:[session._id, userId, clear]});
                    } else {
                        this.unsubsribeFromSession(session, userId, clear);
                    }
                } 
            } else if (this.sessions.shared[sessionId]) {
                delete this.sessions.shared.settings.users[userId];
                delete this.users[userId]?.sessions[sessionId];
                delete this.users[userId]?.sessionSubs?.[sessionId];
                if(clear) {
                    if(session.settings.admins?.[userId])     delete (this.sessions.shared[sessionId].settings?.admins as any)[userId];
                    if(session.settings.moderators?.[userId]) delete (this.sessions.shared[sessionId].settings?.moderators as any)[userId];
                    if(session.data.shared[userId]) delete this.sessions.shared[sessionId].data?.shared[userId];
                    if(session.settings.host === userId) {
                        this.swapHost(session, undefined, true);
                        delete session.data.shared[userId];
                    }
                }
                if(remoteUser && this.users[userId]?.send) {
                    this.users[userId].send({route:'unsubscribeFromSession',args:[session._id, userId, clear]});
                } else {
                    this.unsubsribeFromSession(session, userId, clear);
                }
            }
            return true;
        }
        return false;
    }

    //Delete a session. Run this at the session host location
    deleteSession = (sessionId:string, userId:string, remoteUser=true) => {
        let session:any = this.sessions.private[sessionId];
        if(!session) session = this.sessions.shared[sessionId];
        if(session) {
            if(session.source === userId || session.listener === userId || session.admins?.[userId] || session.ownerId === userId) {
                for(const user in session.settings.users) {
                    if(this.users[user]?.sessions) delete this.users[user].sessions[sessionId];
                    if(this.users[user]?.sessionSubs) delete this.users[user].sessionSubs[sessionId];
                    if(remoteUser && this.users[user]?.send) {
                        this.users[user].send({route:'unsubscribeFromSession',args:[session._id, user]});
                    } else {
                        this.unsubsribeFromSession(session, user);
                    }
                }
                if(this.sessions.private[sessionId]) delete this.sessions.private[sessionId];
                else if(this.sessions.shared[sessionId]) delete this.sessions.private[sessionId];
                if(session.onclose) session.onclose(session);
            }
        }
        return true;
    }

    getFirstMatch(obj1:{[key:string]:any},obj2:{[key:string]:any}) {
        for(const i in obj1) {
            if(i in obj2) return i;
        }
        return false;
    }

    swapHost = (
        session:PrivateSessionProps|SharedSessionProps|string, 
        newHostId?:string,
        adoptData:boolean=true //copy original session hosts data?
    ) => {
        if(typeof session === 'string') {
            if(this.sessions.private[session]) session = this.sessions.private[session];
            else if(this.sessions.shared[session]) session = this.sessions.shared[session];
        }
        if(typeof session === 'object' && session.settings) {
            let oldHost = session.settings.host;
            delete session.settings.host;
            if(newHostId) {
                if(session.settings.users[newHostId]) session.settings.host = newHostId;
            }
            if(session.settings.ownerId && !session.settings.host) {
                if(session.settings.users[session.settings.ownerId]) session.settings.host = session.settings.ownerId;
            }
            if(session.settings.admins && !session.settings.host) {
                let match = this.getFirstMatch(session.settings.users,session.settings.admins);
                if(match) session.settings.host = match;
            }//sendAll leadership when host swapping
            if(session.settings.moderators && !session.settings.host) {
                let match = this.getFirstMatch(session.settings.users,session.settings.moderators);
                if(match) session.settings.host = match;
            }//sendAll leadership when host swapping
            if(!session.settings.host) session.settings.host = Object.keys(session.settings.users)[0]; //replace host 
            if(adoptData && oldHost && session.settings.passOnHostData !== false) {
                if(session.data?.shared[oldHost]) { //private data will stay the same
                    if(session.data?.shared[oldHost]) {
                        session.data.shared[session.settings.host] = Object.assign(session.data.shared[session.settings.host] ? session.data.shared[session.settings.host] : {}, session.data.shared[oldHost]);
                    }
                }
            }
            return true;
        }
        return false;
    }

    //run these on the clientside user
    subscribeToSession = (
        session:SharedSessionProps|PrivateSessionProps|string, 
        userId:string, 
        onmessage?:(session:SharedSessionProps|PrivateSessionProps, update:any, user:SessionUser)=>void, 
        onopen?:(session:SharedSessionProps|PrivateSessionProps, user:SessionUser)=>void,
        onclose?:(session:SharedSessionProps|PrivateSessionProps, user:SessionUser)=>void
    ) => {
        if(typeof session === 'string') {
            let s = this.sessions.private[session];
            if(!s) s = this.sessions.shared[session] as any;
            if(!s) return undefined;
            session = s;
        }
        
        let user = this.users[userId];
        if(!user) return undefined;
        if(!user.sessionSubs) user.sessionSubs = {};
        if(!user.sessionSubs[session._id]) user.sessionSubs[session._id] = {};

        if(typeof onopen === 'function') {
            let sub = this.subscribe('joinSession',(res) => {
                if(res._id === (session as any)._id) onopen(session as any, user);
                this.unsubscribe('joinSession', sub as number);
            });
            user.sessionSubs[session._id].onopenSub = sub;
        }

        if(typeof session === 'object') { //we need to fire onmessage events when the session updates (setState for sessionId) and when the user updates
            if(onmessage) user.sessionSubs[session._id].onmessage = onmessage;
            //if(onopen) this.sessionSubs[userId][session._id].onopen = onopen;
            if(onclose) user.sessionSubs[session._id].onclose = onclose;

        }
        return session;
    }

    //run these on the clientside user
    unsubsribeFromSession = (
        session:SharedSessionProps|PrivateSessionProps|string, 
        userId?:string,
        clear=true //clear session data (default true)
    ) => {
        if(typeof session === 'string') {
            let s = this.sessions.private[session];
            if(!s) s = this.sessions.shared[session] as any;
            if(!s) return undefined;
            session = s;
        } 

        const clearSessionSubs = (Id:string, s:SharedSessionProps|PrivateSessionProps) => {
            let u = this.users[Id];
            if(!u) return undefined;
            if(u.sessionSubs?.[s._id]) {
                if(u.sessionSubs[s._id].onopenSub) {
                    this.unsubscribe('joinSession', u.sessionSubs[s._id].onopenSub as number);
                }
            }
            if(u.sessionSubs[s._id].onclose) u.sessionSubs[s._id].onclose(s, u);
            delete u.sessionSubs[s._id];
        }

        if(userId) {
            clearSessionSubs(userId, session);
        } else {
            for(const key in this.users) {
                clearSessionSubs(key, session);
            }
        }

        if(clear) {
            if(this.sessions.private[session._id]) delete this.sessions.private[session._id];
            else if(this.sessions.shared[session._id]) delete this.sessions.shared[session._id];
        }
    }

    //iterate all subscriptions, e.g. run on backend
    sessionUpdateCheck = (transmit=true) => {
        let updates:any = {
            private:{},
            shared:{}
        };

        for(const session in this.sessions.private) {
            const sesh = this.sessions.private[session];
            const updateObj = {
                _id:sesh._id,
                settings:{
                    listener:sesh.listener,
                    source:sesh.source
                },
                data:{}
            } as any; //pull user's updated props and send to listener
            if(!this.users[sesh.source]) {
                delete this.sessions.private[session];
                break;
            } 
            if(sesh.settings && sesh.data) {
                for(const prop in sesh.settings.propnames) {
                    if(prop in this.users[sesh.source]) {
                        if(this.sessions.private[session].data) { 
                            if(typeof sesh.data[prop] === 'object') {
                                if(this.users[sesh.source][prop] && (stringifyFast(sesh.data[prop]) !== stringifyFast(this.users[sesh.source][prop]) || !(prop in sesh.data))) 
                                    updateObj.data[prop] = this.users[sesh.source][prop];
                            }
                            else if(prop in this.users[sesh.source] && (sesh.data[prop] !== this.users[sesh.source][prop] || !(prop in sesh.data))) 
                                updateObj.data[prop] = this.users[sesh.source][prop];
                        }
                        else updateObj.data[prop] = this.users[sesh.source][prop];
                    } else if(this.sessions.private[session]?.data && prop in this.sessions.private[session]?.data) 
                        delete (this.sessions.private[session].data as any)[prop];
                }
            }
            if(Object.keys(updateObj.data).length > 0) {
                this.recursivelyAssign(this.sessions.private[session].data, updateObj.data); //set latest data on the source object as reference
                updates.private[sesh._id as string] = updateObj;
            }
        }

        for(const session in this.sessions.shared) {
            const sesh = this.sessions.shared[session];
            const updateObj = {
                _id:sesh._id,
                settings:{
                    name:sesh.name
                },
                data:{}
            } as any;
            if(sesh.settings?.host) {
                //host receives object of all other users
                const privateData = {}; //host receives all users' props
                const sharedData = {}; //users receive host props       
                for(const user in sesh.settings.users) {
                    if(!this.users[user]) { //if no user found assume they're to be kicked from session
                        delete sesh.settings.users[user]; //dont need to delete admins, mods, etc as they might want to come back <_<
                        if( sesh.settings.host === user ) 
                            this.swapHost(sesh, undefined, true);
                        if( sesh.data?.shared[user] ) 
                            delete sesh.data.shared[user];
                        if( sesh.data?.private?.[user] ) 
                            delete sesh.data.shared[user];
                        updateObj.settings.users = sesh.settings.users;
                        updateObj.settings.host = sesh.settings.host;
                        continue;
                    } else if (sesh.settings.newUser) { //propagate who joined the room too
                        updateObj.settings.users = sesh.settings.users;
                        updateObj.settings.host = sesh.settings.host;
                        sesh.settings.newUser = false;
                    }
                    if(user !== sesh.settings.host) { //the host will receive the private data
                        privateData[user] = {};
                        for(const prop in sesh.settings.propnames) {
                            if(prop in this.users[user]) {
                                if(sesh.data?.private && !(user in sesh.data.private)) {
                                    if(typeof this.users[user][prop] === 'object') 
                                        privateData[user][prop] = this.recursivelyAssign({},this.users[user][prop]);
                                    else privateData[user][prop] = this.users[user][prop];
                                } else if(typeof privateData[user][prop] === 'object' && sesh.data) {
                                    if(prop in this.users[user][prop] && (stringifyFast(sesh.data?.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data))) 
                                        privateData[user][prop] =  this.users[user][prop];
                                }
                                else if(this.users[user][prop] && sesh.data?.private?.[prop] !== this.users[user][prop]) 
                                    privateData[user][prop] = this.users[user][prop];
                            } else if (sesh.data?.private?.[user] && prop in sesh.data?.private?.[user]) delete sesh.data.private[user][prop]; //if user deleted the prop, session can delete it
                        }
                        if(Object.keys(privateData[user]).length === 0) delete privateData[user];
                    } else {                        //the rest of the users will receive the shared data
                        sharedData[user] = {};
                        for(const prop in sesh.settings.hostprops) {
                            if(prop in this.users[user]) {
                                if(sesh.data && !(user in sesh.data.shared)) {
                                    if(typeof this.users[user][prop] === 'object') 
                                        sharedData[user][prop] = this.recursivelyAssign({},this.users[user][prop]);
                                    else sharedData[user][prop] = this.users[user][prop];
                                } else if(typeof sharedData[user][prop] === 'object' && sesh.data) {
                                    if((stringifyFast(sesh.data?.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data.shared[user]))) 
                                        sharedData[user][prop] = this.users[user][prop];
                                }
                                else if(sesh.data?.shared[user][prop] !== this.users[user][prop]) 
                                    sharedData[user][prop] = this.users[user][prop];
                            } else if (sesh.data?.shared[user] && prop in sesh.data?.shared[user]) 
                                delete sesh.data.shared[user][prop]; //if user deleted the prop, session can delete it
                        }
                    }
                }
                if(Object.keys(privateData).length > 0) {
                    updateObj.data.private = privateData;
                }
                if(Object.keys(sharedData).length > 0) {
                    updateObj.data.shared = sharedData;
                }
            } else { //all users receive the same update via shared data when no host set
                const sharedData = {}; //users receive all other user's props
                if(sesh.settings?.users) {
                    for(const user in sesh.settings.users) {
                        if(!this.users[user]) { //if no user found assume they're to be kicked from session
                            delete sesh.settings.users[user]; //dont need to delete admins, mods, etc as they might want to come back <_<
                            if( sesh.settings.host === user ) 
                                this.swapHost(sesh, undefined, true);
                            if( sesh.data?.shared[user] ) 
                                delete sesh.data.shared[user];
                            if( sesh.data?.private?.[user] ) 
                                delete sesh.data.shared[user];
                            updateObj.settings.users = sesh.settings.users;
                            updateObj.settings.host = sesh.settings.host;
                            continue;
                        }
                        sharedData[user] = {};
                        for(const prop in sesh.settings.propnames) {
                            if(prop in this.users[user]) {
                                if(sesh.data && !(user in sesh.data.shared)) {
                                    if(typeof this.users[user][prop] === 'object') sharedData[user][prop] = this.recursivelyAssign({},this.users[user][prop]);
                                    else sharedData[user][prop] = this.users[user][prop];
                                } else if(typeof sesh.data?.shared[user]?.[prop] === 'object') {
                                    if((stringifyFast(sesh.data.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data.shared[user]))) { 
                                        //if(stringifyFast(this.users[user][prop]).includes('peer')) console.log(stringifyFast(this.users[user][prop]))
                                        sharedData[user][prop] = this.users[user][prop]; 
                                    }
                                }
                                else if(sesh.data?.shared[user]?.[prop] !== this.users[user][prop]) 
                                    sharedData[user][prop] = this.users[user][prop];
                            } else if (sesh.data?.shared[user] && prop in sesh.data?.shared[user]) 
                                delete sesh.data.shared[user][prop]; //if user deleted the prop, session can delete it 
                        }
                        if(Object.keys(sharedData[user]).length === 0) delete sharedData[user];
                    }
                    if(Object.keys(sharedData).length > 0) {
                        //console.log(sharedData);
                        updateObj.data.shared = sharedData;
                    } 
                } 
            }

            if(updateObj.data.shared || updateObj.data.private) 
                updates.shared[sesh._id as string] = updateObj;

            if(updateObj.data.shared) {
                this.recursivelyAssign(this.sessions.shared[session].data?.shared,updateObj.data.shared);
               //set latest data on the source object as reference
            }
            if(updateObj.data.private) {
                this.recursivelyAssign(this.sessions.shared[session].data?.private,updateObj.data.private);
                //set latest data on the source object as reference
            }
           
        }

        if(Object.keys(updates.private).length === 0) delete updates.private;
        if(Object.keys(updates.shared).length === 0) delete updates.shared;
        if(Object.keys(updates).length === 0) return undefined;

        if(transmit) this.transmitSessionUpdates(updates);

        return updates; //this will setState on the node which should trigger message passing on servers when it's wired up
        // setTimeout(()=>{
        //     if(this.RUNNING) this.sessionLoop(Date.now());
        // }, this.DELAY)
        
    }

    //transmit updates to users and setState locally based on userId
    transmitSessionUpdates = (updates:{
        private:{[key:string]:any},
        shared:{[key:string]:any}
    }) => {
        let users = {};
        if(updates.private) {
            for(const s in updates.private) { //private session ids
                let session = this.sessions.private[s];
                if(session?.settings) {
                    let u = session.settings.listener; //single user listener
                    if(!users[u]) users[u] = {private:{}};
                    else if(!users[u].private) users[u].private = {};
                    users[u].private[s] = updates.private[s];
                }
            }
        }
        if(updates.shared) {
            for(const s in updates.shared) { //shared session ids
                let session = this.sessions.shared[s];
                if(session?.settings) {
                    for(const u in session.settings.users) { //for users in session
                        if(!users[u]) users[u] = {shared:{}};
                        else if(!users[u].shared) users[u].shared = {};
                        users[u].shared[s] = updates.shared[s];
                    }
                }
            }
        }
 
        //each user will receive an update for all sessions they are subscribed to
        //console.log(users)

        let message = {route:'receiveSessionUpdates', args:null as any}
        for(const u in users) {
            message.args = [u, users[u]];
            if((this.users[u] as any)?.send) (this.users[u] as any).send(JSON.stringify(message));
            this.setState({[u]:Object.create(message)})
        }

        return users;
    }

    //receive updates as a user
    receiveSessionUpdates = (origin:any, update:{private:{[key:string]:any},shared:{[key:string]:any}}|string) => { //following operator format we get the origin passed
        if(update) if(typeof update === 'string') update = JSON.parse(update as string);
        if(typeof update === 'object') {
            let user = this.users[origin];
            if(user) {
                if(!user.sessions) user.sessions = {private:{},shared:{}};
                if(!user.sessionSubs) user.sessionSubs = {};
            }

            if(update.private) {
                for(const key in update.private) {
                    this.recursivelyAssign(this.sessions.private[key].data, update.private[key].data);
                    if(this.sessions.private[key]?.settings.onmessage) 
                        this.sessions.private[key].settings.onmessage(this.sessions.private[key], update.private[key]);
                    if(user?.sessionSubs[user._id]?.[key]?.onmessage)
                        user.sessionSubs[user._id][key].onmessage(user.sessions[key], update, user);
                }
            }
            if(update.shared) {
                for(const key in update.shared) {
                    if(update.shared[key].settings.users) this.sessions.shared[key].settings.users = update.shared[key].settings.users;
                    if(update.shared[key].settings.host) this.sessions.shared[key].settings.host = update.shared[key].settings.host;
                    if(update.shared[key].data.private) this.recursivelyAssign(this.sessions.shared[key].data.private, update.shared[key].data.private);
                    if(update.shared[key].data.shared)  this.recursivelyAssign(this.sessions.shared[key].data.shared, update.shared[key].data.shared);
                    if(this.sessions.shared[key]?.settings.onmessage) 
                        this.sessions.shared[key].settings.onmessage(this.sessions.shared[key], update.shared[key]);
                    if(user?.sessionSubs[user._id]?.[key]?.onmessage)
                        user.sessionSubs[user._id][key].onmessage(user.sessions[key], update, user);
                }
            }
            return user;
        }
    }

    getUpdatedUserData = (user:SessionUser) => {
        const updateObj = {};
        for(const key in user.sessions) {
            let s = user.sessions[key];
            if(s.settings.users[user._id as string] || s.settings.source === user._id) {
                if(!s.settings.spectators?.[user._id as string]) {
                    if(s.settings.host === user._id) {
                        for(const prop in s.settings.hostprops) {
                            if(!updateObj[prop] && prop in user) {
                                if(s.data.shared?.[user._id as string] && prop in s.data.shared?.[user._id as string]) {
                                    if(typeof user[prop] === 'object') {
                                        if(stringifyFast(s.data.shared[user._id as string][prop]) !== stringifyFast(user[prop]))
                                            updateObj[prop] = user[prop];
                                    }
                                    else if (s.data.shared[user._id as string][prop] !== user[prop]) updateObj[prop] = user[prop];   
                                } else updateObj[prop] = user[prop]
                            }
                        }   
                    } else {
                        for(const prop in s.settings.propnames) {
                            if(!updateObj[prop] && user[prop] !== undefined) {
                                if(s.settings.source) {
                                    if(typeof user[prop] === 'object' && prop in s.data) {
                                        if(stringifyFast(s.data[prop]) !== stringifyFast(user[prop]))
                                            updateObj[prop] = user[prop];
                                    }
                                    else if (s.data[prop] !== user[prop]) updateObj[prop] = user[prop];  
                                }
                                else {
                                    if(s.data.shared?.[user._id as string] && prop in s.data.shared?.[user._id as string]) { //host only sessions have a little less efficiency in this setup
                                        if(typeof user[prop] === 'object') {
                                            if(stringifyFast(s.data.shared[user._id as string][prop]) !== stringifyFast(user[prop]))
                                                updateObj[prop] = user[prop];
                                        }
                                        else if (s.data.shared[user._id as string][prop] !== user[prop]) updateObj[prop] = user[prop];
                                    } else updateObj[prop] = user[prop]
                                }
                            }
                        }
                    }
                }
                
            }
        }
        return updateObj;
    }

    //e.g. run on frontend
    userUpdateCheck = (user:SessionUser, onupdate?:(user:SessionUser, updateObj:{[key:string]:any})=>void) => {
        //console.log('checking',user, this);
        if(user.sessions) {
            const updateObj = this.getUpdatedUserData(user);

            //console.log(updateObj)

            if(Object.keys(updateObj).length > 0) {
                let message = { route:'setUserProps', args:[user._id, updateObj] };
                if(user.send) user.send(message);
                this.setState({[user._id]:message});
                if(onupdate) { onupdate(user, updateObj) };
                return updateObj;
            } 
        }
        return undefined; //state won't trigger if returning undefined on the loop
    }
  
    setUserProps = (user:string|SessionUser, props:{[key:string]:any}|string) => {
        if(user) if(typeof user === 'string') {
            user = this.users[user as string];
            if(!user) return false;
        }
        if(props) if(typeof props === 'string') {
            props = JSON.parse(props as string);
        }

        this.recursivelyAssign(user,props);

        //console.log(user,props)
        return true;
    }

    //more general object streaming
    
    //more rudimentary object streaming than the above sessions
	STREAMLATEST = 0;
	STREAMALLLATEST = 1;
    streamSettings:StreamInfo = {};

    streamFunctions:any = {
        //these default functions will only send the latest of an array or value if changes are detected, and can handle single nested objects 
        // you can use the setting to create watch properties (e.g. lastRead for these functions). 
        // All data must be JSONifiable
        allLatestValues:(prop:any, setting:any)=>{ //return arrays of hte latest values on an object e.g. real time data streams. More efficient would be typedarrays or something
            let result:any = undefined;

            if(Array.isArray(prop)) {
                if(prop.length !== setting.lastRead) {
                    result = prop.slice(setting.lastRead);
                    setting.lastRead = prop.length;
                }
            }
            else if (typeof prop === 'object') {
                result = {};
                for(const p in prop) {
                    if(Array.isArray(prop[p])) {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};
                        
                        if(prop[p].length !== setting[p].lastRead) {
                            result[p] = prop[p].slice(setting[p].lastRead);
                            setting[p].lastRead = prop[p].length;
                        }
                    }
                    else {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};

                        if(setting[p].lastRead !== prop[p]) {
                            result[p] = prop[p];
                            setting[p].lastRead = prop[p];
                        }
                    }
                }
                if(Object.keys(result).length === 0) result = undefined;
            }
            else { 
                if(setting.lastRead !== prop) {
                    result = prop;
                    setting.lastRead = prop;
                } 
            }

            return result;

            
        },
        latestValue:(prop:any,setting:any)=>{
            let result:any = undefined;
            if(Array.isArray(prop)) {
                if(prop.length !== setting.lastRead) {
                    result = prop[prop.length-1];
                    setting.lastRead = prop.length;
                }
            }
            else if (typeof prop === 'object') {
                result = {};
                for(const p in prop) {
                    if(Array.isArray(prop[p])) {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};
                        
                        if(prop[p].length !== setting[p].lastRead) {
                            result[p] = prop[p][prop[p].length-1];
                            setting[p].lastRead = prop[p].length;
                        }
                    }
                    else {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};

                        if(setting[p].lastRead !== prop[p]) {
                            result[p] = prop[p];
                            setting[p].lastRead = prop[p];
                        }
                    }
                }
            }
            else { 
                if(setting.lastRead !== prop) {
                    result = prop;
                    setting.lastRead = prop;
                } 
            }

            return result;
        },
    };

	setStreamFunc = (
        name:string,
        key:string,
        callback:0|1|Function=this.streamFunctions.allLatestValues) => {
		if(!this.streamSettings[name].settings[key]) 
			this.streamSettings[name].settings[key] = {lastRead:0};
		
		if(callback === this.STREAMLATEST) 
			this.streamSettings[name].settings[key].callback = this.streamFunctions.latestValue; //stream the latest value 
		else if(callback === this.STREAMALLLATEST) 
			this.streamSettings[name].settings[key].callback = this.streamFunctions.allLatestValues; //stream all of the latest buffered data
		else if (typeof callback === 'string') 
			this.streamSettings[name].settings[key].callback = this.streamFunctions[callback]; //indexed functions
		else if (typeof callback === 'function')
			this.streamSettings[name].settings[key].callback = callback; //custom function

		if(!this.streamSettings[name].settings[key].callback) this.streamSettings[name].settings[key].callback = this.streamFunctions.allLatestValues; //default
		
        return true;
	}

	addStreamFunc = (name,callback=(data)=>{}) => {
		this.streamFunctions[name] = callback;
	}

	// 		object:{key:[1,2,3],key2:0,key3:'abc'}, 		// Object we are buffering data from
	//		settings:{
	//      	callback:0, 	// Default data streaming mode for all keys
	//			keys:['key','key2'], 	// Keys of the object we want to buffer into the stream
	// 			key:{
	//				callback:0 //specific modes for specific keys or can be custom functions
	// 				lastRead:0,	
	//			} //just dont name an object key 'keys' :P
	//		}
	setStream = (
		object={},   //the object you want to watch
		settings: {
			keys?: string[]
			callback?: Function
		}={}, //settings object to specify how data is pulled from the object keys
		streamName=`stream${Math.floor(Math.random()*10000000000)}`, //used to remove or modify the stream by name later
        onupdate?:(update:any,settings:any)=>void,
        onclose?:(settings:any)=>void
	) => {

		///stream all of the keys from the object if none specified
		if(settings.keys) { 
			if(settings.keys.length === 0) {
				let k = Object.keys(object);
				if(k.length > 0) {
					settings.keys = Array.from(k);
				}
			}
		} else {
			settings.keys = Array.from(Object.keys(object));
		}

		this.streamSettings[streamName] = {
			object,
			settings,
            onupdate,
            onclose
		};

		// if(!settings.callback) settings.callback = this.STREAMALLLATEST;

        this.subscribe(streamName, (res:any)=>{ 
            if(this.streamSettings[streamName].onupdate) 
                (this.streamSettings[streamName] as any).onupdate(res,this.streamSettings[streamName]); 
        });

		settings.keys.forEach((prop) => {
			if(settings[prop]?.callback)
				this.setStreamFunc(streamName,prop,settings[prop].callback);
			else
				this.setStreamFunc(streamName,prop,settings.callback);
		});
        

		return this.streamSettings[streamName];

	}

	//can remove a whole stream or just a key from a stream if supplied
	removeStream = (streamName,key) => {
		if(streamName && this.streamSettings[streamName] && !key) {
            if(this.streamSettings[streamName].onclose) 
                (this.streamSettings[streamName] as any).onclose(this.streamSettings[streamName]);
            this.unsubscribe(streamName); //remove the subscriptions to this stream
            delete this.streamSettings[streamName];
        } else if (key && this.streamSettings[streamName]?.settings?.keys) {
			let idx = (this.streamSettings[streamName].settings.keys as any).indexOf(key);
			if(idx > -1) 
            (this.streamSettings[streamName].settings.keys as any).splice(idx,1);
			if(this.streamSettings[streamName].settings[key]) 
				delete this.streamSettings[streamName].settings[key];
            return true;
		}
        return false;
	}

	//can update a stream object by object assignment using the stream name (if you don't have a direct reference)
	updateStreamData = (streamName, data={}) => {
		if(this.streamSettings[streamName]) {
			Object.assign(this.streamSettings[streamName].object,data);
			return this.streamSettings[streamName].object;
		}
		return false;
	} 

    getStreamUpdate = (streamName:string) => {
        if(!this.streamSettings[streamName]) return;
        let streamUpdate = {};
        (this.streamSettings[streamName].settings.keys as any).forEach((key) => {
            if(this.streamSettings[streamName].settings[key]) {
                let data = this.streamSettings[streamName].settings[key].callback(
                    this.streamSettings[streamName].object[key],
                    this.streamSettings[streamName].settings[key]
                );
                if(data !== undefined) streamUpdate[key] = data; //overlapping props will be overwritten (e.g. duplicated controller inputs)
            }
        });
        this.setState({[streamName]:streamUpdate}); // the streamName is subscribable to do whatever you want with
        return streamUpdate;
    }

    getAllStreamUpdates = () => {
        let updateObj = {};

        for(const streamName in this.streamSettings) {
            let streamUpdate = this.getStreamUpdate(streamName);
            Object.assign(updateObj,streamUpdate);
        }

        return updateObj;
        
	}

    streamLoop = {
        __operator:this.getAllStreamUpdates,
        __node:{loop:10}
    }

    userUpdateLoop = { //this node loop will run separately from the one below it
        __operator:this.userUpdateCheck, 
        __node:{loop:10}//this will set state each iteration so we can trigger subscriptions on session updates :O
    }

    sessionLoop = {
        __operator:this.sessionUpdateCheck, 
        __node:{loop:10}//this will set state each iteration so we can trigger subscriptions on session updates :O
    }



}