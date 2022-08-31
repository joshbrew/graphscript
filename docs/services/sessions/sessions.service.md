Sessions allow for convenient, efficient data streaming. Simply identify which properties on which users or objects that you want to stream, run the corresponding update loop (as server, user, or for object streams) or write your own callback sequences to call the update functions, and let the service do the rest.

The user oriented streaming functions watch user objects for updates and only pass new data around as needed, and auto updates based on user data streaming in (using the `sessionLoop` or `userUpdateLoop`s respectively) 

There is also a more basic object streaming function set that will watch objects and pass updates using specifiable streaming functions. It comes with efficient functions for grabbing all new data or only latest data values (e.g. controller streams or frame states) then sets state. Just run the `streamLoop` to handle all of your active streams at a reasonable update rate.

As long as session users have a .send function available in the format of our main services, they will send messages automatically to desired endpoints, either using the wrapped User object from the Router or any individual socket, sse, etc. connection. You can scale your applications as needed this way while it all follows a common set of handles
```ts
export type SessionUser = {
    _id:string, //unique identifier for user, used as key in users object and in general
    sessions:{[key:string]:any},
    [key:string]:any
} & Partial<User> //session user obj

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
```

As you can see there is a lot to pick apart in this service! We'll get to it as we go here :-P
```ts

export class SessionsService {
    //...
    routes:Routes = {
        getSessionInfo,
        openPrivateSession,
        openSharedSession,
        updateSession,
        joinSession,
        setUserProps,
        leaveSession,
        getFirstMatch,
        swapHost,
        deleteSession,
        subscribeToSession,
        transmitSessionUpdates,
        receiveSessionUpdates,
        getUpdatedUserData,
        userUpdateCheck,
        userUpdateLoop:{ //this node loop will run separately from the one below it
            operator:this.userUpdateCheck, 
            loop:10//this will set state each iteration so we can trigger subscriptions on session updates :O
        },
        sessionLoop:{
            operator:this.sessionUpdateCheck, 
            loop:10//this will set state each iteration so we can trigger subscriptions on session updates :O
        },
        setStreamFunc,
        addStreamFunc,
        setStream,
        removeStream,
        updateStreamData,
        getStreamUpdate,
        getAllStreamUpdates,
        streamLoop:{
            operator:this.getAllStreamUpdates,
            loop:10
        }
    }
}

```