## SSEfrontend


Using the built-in EventSource API in-browser, we can establish arbitrary event responses from the server very quickly. We combined this with our HTTPbackend to enable two-way connections via REST calls and SSE subscriptions. Serverside can talk to specific clients directly with ID'd connections and association via the `Router`

For non-default events (message, open, close, error), set the callback to `true` to just use the default `this.receive` and `setState` (if keepState is true) built in to the service.
```ts

import {SSEfrontend} from 'graphscript'

export type EventSourceProps = {
    url:string,
    events:{
        message?:(ev:any,sseinfo?:EventSourceInfo)=>void,  //will use this.receive as default
        open?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        close?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        error?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        [key:string]:any
    }
    //these callbacks are copied to events object above if not defined, just simpler
    onmessage?:(ev:any,sseinfo?:EventSourceInfo)=>void,  //will use this.receive as default
    onopen?:(ev:any,sseinfo?:EventSourceInfo)=>void,
    onclose?:(ev:any,sseinfo?:EventSourceInfo)=>void,
    onerror?:(ev:any,sseinfo?:EventSourceInfo)=>void,
    evoptions?:boolean|AddEventListenerOptions,
    type?:'eventsource'|string,
    _id?:string,
    keepState?:boolean
}

export type EventSourceInfo = {
    source:EventSource,
    send:(message:any)=>any,
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:() => void,
    graph:SSEfrontend
} & EventSourceProps



const sse = new SSEfrontend();

const sseinfo = sse.openSSE({
    url:'http://localhost:8080/sse',
    events:{
        'test':(ev)=>{console.log('test',ev.data)}
    }
} as EventSourceProps) as EventSourceInfo;


```

That's basically it!

Terminate event sources with .terminate like in every other service.