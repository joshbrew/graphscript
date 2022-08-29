//General Frontend/Backend User Data Structures

import {DS} from "./datastructures/index";
import { ConnectionInfo, ConnectionProps, Router, RouterOptions } from "../router/Router";
import { ProfileStruct } from "./datastructures/types";


export type User = {
    _id:string,
    send:(...args:any[])=>any,
    request:(...args:any[])=>Promise<any>|Promise<any>[]|undefined,
    post:(...args:any[])=>void,
    run:(...args:any[])=>Promise<any>|Promise<any>[]|undefined,
    subscribe:(...args:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe:(...args:any[])=>Promise<boolean>|Promise<boolean>[]|undefined,
    terminate:(...args:any[]) => boolean,
    onclose?:(user:User)=>void
} & Partial<ProfileStruct>

export class UserRouter extends Router {

    users:{[key:string]:User}; //jsonifiable information

    constructor(options?:RouterOptions) {
        super(options);
    }

    addUser = (
        info:Partial<ProfileStruct> & {onclose:(connection:ConnectionInfo,...args:any[])=>void},
        connections?:{[key:string]:ConnectionProps}    
    ) => {
        if(!info._id) {
            info._id = `user${Math.floor(Math.random()*1000000000000000)}`;
        }

        let profile = DS.ProfileStruct(info._id,info) as User;
        
        if(connections){
            for(const key in connections) {
               this.addConnection(connections[key], profile._id);
            }
        }

        let send = (message:any, ...a:any[]) => {
            let connection = this.getConnection(profile._id, 'send');
            if(connection?.send) return connection.send(message, ...a);
        }

        let request = (message:any, method?:any, ...a:any[]) => {
            let connection = this.getConnection(profile._id, 'request');
            if(connection?.request) return connection.request(message, method, ...a);
        }

        let post = (route:any, args?:any, method?:string, ...a:any[]) => {
            let connection = this.getConnection(profile._id, 'post');
            if(connection?.post) return connection.post(route, args, method, ...a);
        }

        let run = (route:any, args?:any, method?:string, ...a:any[]) => {
            let connection = this.getConnection(profile._id, 'run');
            if(connection?.run) return connection.run(route, args, method, ...a);
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string,...a:any[]) => {
            let connection = this.getConnection(profile._id, 'subscribe');
            if(connection?.subscribe) return connection.subscribe(route, callback, ...a);
        }

        let unsubscribe = (route:any, sub:number, ...a:any[]) => {
            let connection = this.getConnection(profile._id, 'unsubscribe');
            if(connection?.unsubscribe) return connection.unsubscribe(route, sub, ...a);
        }

        let terminate = () => {
            return this.removeUser(profile)
        }

        profile.send = send;
        profile.request = request;
        profile.post = post;
        profile.run = run;
        profile.subscribe = subscribe;
        profile.unsubscribe = unsubscribe;
        profile.terminate = terminate;
        //these are macros to get available connections

        this.users[profile._id] = profile;

        return profile;
    }
    
    removeUser(
        profile:string | User | {_id:string, [key:string]:any},
        terminate?:true
    ) {
        if(terminate) this.removeConnection(profile as any, terminate);

        if (typeof profile === 'string') profile = this.users[profile];
        if(typeof profile === 'object' && profile._id) {
            delete this.users[profile._id];
            if(profile.onclose) profile.onclose(profile);
        }


        return true;
    }

  

    //subscribeToRemoteUser

    //subscribeRemoteUser


    
}