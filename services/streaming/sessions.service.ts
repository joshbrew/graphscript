import { stringifyFast } from "../../Graph";
import { Routes, Service, ServiceOptions } from "../Service";
import { User } from "../router/Router";

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
        onmessage?:(session:PrivateSessionProps)=>void,
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
    [key:string]:any
} & Partial<User>

//sessions for shared user data and game/app logic for synchronous and asynchronous sessions to stream selected properties on user objects as they are updated
export type SharedSessionProps = {
    _id?:string,
    settings?:{
        name:string,
        propnames:{[key:string]:boolean},
        users?:{[key:string]:boolean},
        host?:string, //if there is a host, all users only receive from the host's prop updates
        hostprops?:{[key:string]:boolean},
        admins?:{[key:string]:boolean},
        moderators?:{[key:string]:boolean},
        spectators?:{[key:string]:boolean},
        banned?:{[key:string]:boolean},
        password?:string,
        ownerId?:string,
        onopen?:(session:SharedSessionProps)=>void,
        onmessage?:(session:SharedSessionProps)=>void,
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

export class SessionsService extends Service {

    name='sessions';

    users:{ [key:string]:SessionUser }={}

    //complex user sessions with some premade rulesets
    sessions:{
        private:{[key:string]:PrivateSessionProps}, //sync user props <--> user props
        shared:{[key:string]:SharedSessionProps}//sync user props <--> all other users props
    } = {
        private:{},
        shared:{}
    }

    constructor(options:ServiceOptions, users?:{[key:string]:SessionUser}) {
        super(options);
        this.load(this.routes);
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
        if(options._id) {
            if(userId){
                if(!options.settings) options.settings = { listener:userId, source:userId, propnames:{latency:true}, admins:{[userId]:true}, ownerId:userId };
                if(!options.settings.listener) options.settings.listener = userId;
                if(!options.settings.source) options.settings.source = userId;
                if(!this.users[userId].sessions) this.users[userId].sessions = {};
                this.users[userId].sessions[options._id] = options;
            }
            if(!options.data) options.data = {};
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
        userId:string
    ) => {
        if(!options._id) {
            options._id = `shared${Math.floor(Math.random()*1000000000000000)}`;
            if(this.sessions.shared[options._id]) {
                delete options._id;
                this.openSharedSession(options,userId); //regen id
            }
        } 
        if(options._id){  
            if(typeof userId === 'string') {
                if(!options.settings) options.settings = { name:'shared', propnames:{latency:true}, users:{[userId]:true}, admins:{[userId]:true}, ownerId:userId };
                
                if(!options.settings.users) options.settings.users = {[userId]:true};
                if(!options.settings.admins) options.settings.admins = {[userId]:true};
                if(!options.settings.ownerId) options.settings.ownerId = userId;
                if(!this.users[userId].sessions) this.users[userId].sessions = {};
                this.users[userId].sessions[options._id] = options;
            } else if (!options.settings) options.settings = {name:'shared', propnames:{latency:true}, users:{}};
            if(!options.data) options.data = { private:{}, shared:{} };
            if(!options.settings.name) options.name = options.id;
            if(this.sessions.shared[options._id]) {
                return this.updateSession(options,userId);
            }
            else this.sessions.shared[options._id] = options;
        }
        return options;
    }

    //update session properties, also invoke basic permissions checks for who is updating
    updateSession = (
        options:PrivateSessionProps | SharedSessionProps, 
        userId?:string
    ) => {
        //add permissions checks based on which user ID is submitting the update
        let session:any;
        if(options._id && typeof userId === 'string'){ 
            session = this.sessions.private[options._id];
            if(!session) session = this.sessions.shared[options._id];
            if(this.sesh.private[options._id]) {
                let sesh = this.sessions.shared[options._id];
                if(sesh.settings && (sesh?.settings.source === userId || sesh.settings.admins?.[userId] || sesh.settings.moderators?.[userId] || sesh.settings.ownerId === userId)) {
                    return Object.assign(this.session.shared[options._id],options);
                }
            } else if(options.settings?.source) {
                return this.openPrivateSession(options as PrivateSessionProps,userId);
            } else return this.openSharedSession(options as SharedSessionProps,userId);
        }
        return false;
    }

    //add a user id to a session, supply options e.g. to make them a moderator or update properties to be streamed dynamically
    joinSession = (   
        sessionId:string, 
        userId:string,
        options?:SharedSessionProps|PrivateSessionProps
    ) => {
        if(!userId) return false;
        let sesh = this.sessions.shared[sessionId];
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
            if(!this.users[userId].sessions) this.users[userId].sessions = {};
            this.users[userId].sessions[sessionId] = sesh;
            if(options) { return this.updateSession(options,userId); };
            //console.log(sesh)
            return sesh;
        } else if (options?.source || options?.listener) return this.openPrivateSession(options as PrivateSessionProps,userId);
        else if (options) return this.openSharedSession(options as SharedSessionProps,userId);
        return false;
    }

    leaveSession = (
        sessionId:string, 
        userId:string, 
        clear:boolean=true //clear all data related to this user incl permissions
    ) => {
        let session:any = this.sessions.private[sessionId];
        if(!session) session = this.sessions.shared[sessionId];
        if(session) {
            if(this.sessions.private[sessionId]) {
                if(userId === session.settings.source || userId === session.settings.listener || session.settings.admins?.[userId] || session.settings.moderators?.[userId]) {
                    delete this.sessions.private[sessionId];
                    delete this.users[userId].sessions[sessionId];
                    if(clear) {
                        if(session.settings.admins?.[userId])     delete (this.sessions.shared[sessionId].settings?.admins as any)[userId];
                        if(session.settings.moderators?.[userId]) delete (this.sessions.shared[sessionId].settings?.moderators as any)[userId];
                    }
                } 
            } else if (this.sessions.shared[sessionId]) {
                delete this.sessions.shared.settings.users[userId];
                delete this.users[userId].sessions[sessionId];
                if(clear) {
                    if(session.settings.admins?.[userId])     delete (this.sessions.shared[sessionId].settings?.admins as any)[userId];
                    if(session.settings.moderators?.[userId]) delete (this.sessions.shared[sessionId].settings?.moderators as any)[userId];
                    if(session.data.shared[userId]) delete this.sessions.shared[sessionId].data?.shared[userId];
                    if(session.settings.host === userId) {
                        delete session.settings.host;
                        delete session.data.shared;
                        session.data.shared = {};
                        this.swapHost(session);
                    }
                }
            }
            return true;
        }
        return false;
    }

    getFirstMatch(obj1:{[key:string]:any},obj2:{[key:string]:any}) {
        for(const i in obj1) {
            for(const j in obj2) {
                if(i === j) return i;
            }
        }
        return false;
    }

    swapHost = (
        session:PrivateSessionProps|SharedSessionProps|string, 
        newHostId?:string
    ) => {
        if(typeof session === 'string') {
            if(this.sessions.private[session]) session = this.sessions.private[session];
            else if(this.sessions.shared[session]) session = this.sessions.shared[session];
        }
        if(typeof session === 'object' && session.settings) {
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
            return true;
        }
        return false;
    }

    deleteSession = (sessionId:string, userId:string) => {
        let session:any = this.sessions.private[sessionId];
        if(!session) session = this.sessions.shared[sessionId];
        if(session) {
            if(session.source === userId || session.listener === userId || session.admins?.[userId] || session.ownerId === userId) {
                for(const user in session.settings.users) {
                    if(this.users[user].sessions) delete this.users[user].sessions[sessionId];
                }
                if(this.sessions.private[sessionId]) delete this.sessions.private[sessionId]
                else if(this.sessions.shared[sessionId]) delete this.sessions.private[sessionId]
            }
        }
        return true;
    }

    subscribeToSession = (
        session:SharedSessionProps|PrivateSessionProps|string, 
        userId:string, 
        onmessage?:(session:SharedSessionProps|PrivateSessionProps, userId:string)=>void, 
        onopen?:(session:SharedSessionProps|PrivateSessionProps, userId:string)=>void,
        onclose?:(session:SharedSessionProps|PrivateSessionProps, userId:string)=>void
    ) => {
        if(typeof session === 'string') {
            let s = this.sessions.private[session];
            if(!s) s = this.sessions.shared[session] as any;
            if(!s) return undefined;
            session = s;
        } 

        if(typeof session.onopen === 'function') {
            let sub = this.subscribe('joinSession',(res) => {
                if(res._id === (session as any)._id) (session as any).onopen(session, userId);
                this.unsubscribe('joinSession', sub as number);
            })
        }

        if(typeof session === 'object') { //we need to fire onmessage events when the session updates (setState for sessionId) and when the user updates

            if(onmessage) session.onmessage = onmessage;
            if(onopen) session.onclose = onopen;
            if(onclose) session.onclose = onclose;

           
            // if(typeof session.onmessage === 'function') 
            //     this.subscribe(session._id,(session)=>{ session.onmessage(session,userId); });
            
            // this.setState({[session._id]:session});
        }
        return session;
    }

    //iterate all subscriptions, e.g. run on backend
    sessionLoop = (transmit=true) => {
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
                delete this.sessions.private[session]
                break;
            }
            if(sesh.settings && sesh.data) {
                for(const prop in sesh.settings.propnames) {
                    if( this.users[sesh.source][prop]) {
                        if(this.sessions.private[session].data) { 
                            if(typeof sesh.data[prop] === 'object') {
                                if(this.users[sesh.source][prop] && (stringifyFast(sesh.data[prop]) !== stringifyFast(this.users[sesh.source][prop]) || !(prop in sesh.data))) 
                                    updateObj.data[prop] = this.users[sesh.source][prop];
                            }
                            else if(this.users[sesh.source][prop] && (sesh.data[prop] !== this.users[sesh.source][prop] || !(prop in sesh.data))) 
                                updateObj.data[prop] = this.users[sesh.source][prop];
                        }
                        else updateObj.data[prop] = this.users[sesh.source][prop];
                    } else if(this.sessions.private[session]?.data?.[prop]) delete (this.sessions.private[session].data as any)[prop];
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
                    if(!this.users[user]) {
                        delete sesh.settings.users[user]; //dont need to delete admins, mods, etc as they might want to come back <_<
                        if( sesh.data?.shared[user]) delete sesh.data.shared[user];
                        if( sesh.data?.private?.[user]) delete sesh.data.shared[user];
                        if(sesh.settings.host === user) this.swapHost(sesh);
                        updateObj.settings.users = sesh.settings.users;
                        updateObj.settings.host = sesh.settings.host;
                        continue;
                    }
                    if(user !== sesh.settings.host) {
                        privateData[user] = {};
                        for(const prop in sesh.settings.propnames) {
                            if(this.users[user][prop]) {
                                if(sesh.data?.private && !(user in sesh.data.private)) {
                                    if(typeof this.users[user][prop] === 'object') privateData[user][prop] = this.recursivelyAssign({},this.users[user][prop]);
                                    else privateData[user][prop] = this.users[user][prop];
                                } else if(typeof privateData[user][prop] === 'object' && sesh.data) {
                                    if(this.users[user][prop] && (stringifyFast(sesh.data?.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data))) 
                                        privateData[user][prop] =  this.users[user][prop];
                                }
                                else if(this.users[user][prop] && sesh.data?.private?.[prop] !== this.users[user][prop]) 
                                    privateData[user][prop] = this.users[user][prop];
                            } else if (sesh.data?.private?.[user]?.[prop]) delete sesh.data.private[user][prop]; //if user deleted the prop, session can delete it
                        }
                        if(Object.keys(privateData[user]).length === 0) delete privateData[user];
                    } else {
                        sharedData[user] = {};
                        for(const prop in sesh.settings.hostprops) {
                            if(this.users[user][prop]) {
                                if(sesh.data && !(user in sesh.data.shared)) {
                                    if(typeof this.users[user][prop] === 'object') sharedData[user][prop] = this.recursivelyAssign({},this.users[user][prop]);
                                    else sharedData[user][prop] = this.users[user][prop];
                                } else if(typeof sharedData[user][prop] === 'object' && sesh.data) {
                                    if(this.users[user][prop] && (stringifyFast(sesh.data?.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data.shared[user]))) 
                                        sharedData[user][prop] = this.users[user][prop];
                                }
                                else if(this.users[user][prop] && sesh.data?.shared[user][prop] !== this.users[user][prop]) 
                                    sharedData[user][prop] = this.users[user][prop];
                            } else if (sesh.data?.shared[user]?.[prop]) delete sesh.data.shared[user][prop]; //if user deleted the prop, session can delete it
                        }
                    }
                }
                if(Object.keys(privateData).length > 0) {
                    updateObj.data.private = privateData;
                }
                if(Object.keys(sharedData).length > 0) {
                    updateObj.data.shared = sharedData;
                }
            } else { //all users receive the same update when no host set
                const sharedData = {}; //users receive all other user's props
                if(sesh.settings?.users) {
                    for(const user in sesh.settings.users) {
                        if(!this.users[user]) {
                            delete sesh.settings.users[user]; //dont need to delete admins, mods, etc as they might want to come back <_<
                            if( sesh.data?.shared[user]) delete sesh.data.shared[user];
                            if( sesh.data?.private?.[user]) delete sesh.data.shared[user];
                            if(sesh.settings.host === user) this.swapHost(sesh);
                            updateObj.settings.users = sesh.settings.users;
                            updateObj.settings.host = sesh.settings.host;
                            continue;
                        }
                        sharedData[user] = {};
                        for(const prop in sesh.settings.propnames) {
                            if(this.users[user][prop]) {
                                if(sesh.data && !(user in sesh.data.shared)) {
                                    if(typeof this.users[user][prop] === 'object') sharedData[user][prop] = this.recursivelyAssign({},this.users[user][prop]);
                                    else sharedData[user][prop] = this.users[user][prop];
                                } else if(typeof sesh.data?.shared[user][prop] === 'object') {
                                    if((stringifyFast(sesh.data.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data.shared[user]))) { 
                                        //if(stringifyFast(this.users[user][prop]).includes('peer')) console.log(stringifyFast(this.users[user][prop]))
                                        sharedData[user][prop] = this.users[user][prop]; 
                                    }
                                }
                                else if(sesh.data?.shared[user][prop] !== this.users[user][prop]) 
                                    sharedData[user][prop] = this.users[user][prop];
                            } else if (sesh.data?.shared[user]?.[prop]) delete sesh.data.shared[user][prop]; //if user deleted the prop, session can delete it 
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
                this.recursivelyAssign(this.sessions.shared[session].data?.shared,updateObj.data.shared)
               //set latest data on the source object as reference
            }
            if(updateObj.data.private) {
                this.recursivelyAssign(this.sessions.shared[session].data?.private,updateObj.data.private)
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
            for(const s in updates.private) {
                let session = this.sessions.private[s];
                if(session?.settings) {
                    let u = session.settings.listener;
                    if(!users[u]) users[u] = {private:{}};
                    else if(!users[u].private) users[u].private = {};
                    users[u].private[s] = updates.private[s];
                }
            }
        }
        if(updates.shared) {
            for(const s in updates.shared) {
                let session = this.sessions.shared[s];
                if(session?.settings) {
                    let copy;
                    if(session.settings.host) {
                        copy = Object.assign({},updates.shared[s]);
                        delete copy.data.private; 
                    }
                    for(const u in session.settings.users) {
                        if(!users[u]) users[u] = {shared:{}};
                        else if(!users[u].shared) users[u].shared = {};
                        if(session.settings.host) {
                            if(u !== session.settings.host) {
                                users[u].shared[s] = copy;
                            } else users[u].shared[s] = updates.shared[s];
                        } 
                        else users[u].shared[s] = updates.shared[s];
                    }
                }
            }
        }
 
        //console.log(users)

        let message = {route:'receiveSessionUpdates', args:null as any}
        for(const u in users) {
            message.args = [u, users[u]];
            if((this.users[u] as any).send) (this.users[u] as any).send(JSON.stringify(message));
            this.setState({[u]:Object.create(message)})
        }

        return users;
    }

    //receive updates as users
    receiveSessionUpdates = (origin:any, update:{private:{[key:string]:any},shared:{[key:string]:any}}|string) => { //following operator format we get the origin passed
        if(update) if(typeof update === 'string') update = JSON.parse(update as string);
        if(typeof update === 'object') {
            let user = this.users[origin];
            if(!user) return undefined;
            if(!user.sessions) user.sessions = {};

            if(update.private) {
                for(const key in update.private) {
                    if(!user.sessions[key]) continue;
                    this.recursivelyAssign(user.sessions[key].data,update.private[key].data);
                    if(user.sessions[key].onmessage)
                        user.sessions[key].onmessage(user.sessions[key],user._id)
                }
            }
            if(update.shared) {
                for(const key in update.shared) {
                    if(!user.sessions[key]) continue;
                    if(update.shared[key].settings.users) user.sessions[key].settings.users = update.shared[key].settings.users;
                    if(update.shared[key].settings.host) user.sessions[key].settings.host = update.shared[key].settings.host;
                    if(update.shared[key].data.private) this.recursivelyAssign(user.sessions[key].data.private, update.shared[key].data.private);
                    if(update.shared[key].data.shared)  this.recursivelyAssign(user.sessions[key].data.shared, update.shared[key].data.shared);
                    if(user.sessions[key].onmessage)
                        user.sessions[key].onmessage(user.sessions[key],user._id)
                }
            }
            return user;
        }
    }

    //you either need to run this loop on a session to 
    // pass updates up to the server from your user manually
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
    userUpdateCheck = (user:SessionUser) => {
        if(user.sessions) {
            const updateObj = this.getUpdatedUserData(user);

            //console.log(updateObj)

            if(Object.keys(updateObj).length > 0) {
                let message = { route:'setUserProps', args:[user._id, updateObj] };
                if(user.send) user.send(message);
                this.setState({[user._id]:message})
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

    routes:Routes = {
        getSessionInfo:this.getSessionInfo,
        openPrivateSession:this.openPrivateSession,
        openSharedSession:this.openSharedSession,
        updateSession:this.updateSession,
        joinSession:this.joinSession,
        setUserProps:this.setUserProps,
        leaveSession:this.leaveSession,
        getFirstMatch:this.getFirstMatch,
        swapHost:this.swapHost,
        deleteSession:this.deleteSession,
        subscribeToSession:this.subscribeToSession,
        transmitSessionUpdates:this.transmitSessionUpdates,
        receiveSessionUpdates:this.receiveSessionUpdates,
        getUpdatedUserData:this.getUpdatedUserData,
        userUpdateCheck:this.userUpdateCheck,
        userUpdateLoop:{ //this node loop will run separately from the one below it
            operator:this.userUpdateCheck, 
            loop:10//this will set state each iteration so we can trigger subscriptions on session updates :O
        },
        sessionLoop:{
            operator:this.sessionLoop, 
            loop:10//this will set state each iteration so we can trigger subscriptions on session updates :O
        }
    }

}