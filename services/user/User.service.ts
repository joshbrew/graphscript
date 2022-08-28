//General Frontend/Backend User Data Structures

import { ProfileStruct } from "./datastructures/DataStructures";
import { Service, ServiceOptions } from "../Service";
import { ConnectionProps, Router, RouterOptions } from "../router/Router2";

export type UserOptions = ServiceOptions & {
    router?:Router|RouterOptions
}

export class UserService extends Service {

    users:{[key:string]:Partial<typeof ProfileStruct>};
    router:Router;

    constructor(options?:ServiceOptions) {
        super(options);
        if(options?.router) {
            if(!(options.router instanceof Router)) this.router = new Router(options.router)
            else this.router = options.router
        } else this.router = new Router();
    }

    addUser(
        info:Partial<typeof ProfileStruct>,
        connections:{[key:string]:ConnectionProps}    
    ) {
        let profile = ProfileStruct(undefined,info);
        
    }

}