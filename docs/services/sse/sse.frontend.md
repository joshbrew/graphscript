## SSEfrontend


Using the built-in EventSource API in-browser, we can establish arbitrary event responses from the server very quickly.

For non-default events (message, open, close, error), set the callback to `true` to just use the default `this.receive` and `setState` (if keepState is true) built in to the service.
```ts

import {SSEfrontend} from 'graphscript'

type EventSourceProps = {
    url:string,
    events:{
        message?:(ev:any,sseinfo?:EventSourceInfo)=>void,  //will use this.receive as default to process node commands
        open?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        close?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        error?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        [key:string]:any
    }
    evoptions?:boolean|AddEventListenerOptions,
    type?:'eventsource'|string,
    _id?:string,
    keepState?:boolean
}

type EventSourceInfo = {
    source:EventSource
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