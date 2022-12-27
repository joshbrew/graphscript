# CMDService

The CMD service lets you command child processes in Node.js (using the `graphscript-node` dist). It's a pretty straightforward process,
 you provide routes with commands and arguments as they fit into normal child process callbacks. 
 
 See `services/cmd/childproces.js` for a boilerplate node process you can run that sets up a CMDService to enable cross-process message passing by listening to process.stdin the same way other message passing services listen, including all of the helpful utilities like running functions or subscribing across processes.


 ```ts

type CMDRoute = {
    command:string|ChildProcess,
    args?:string[],
    options?:{shell:true, stdio:'inherit',[key:string]:any},
    env?:any,
    cwd?:any,
    signal?:any,
    stdout?:(data:any)=>void,
    onerror?:(error:Error)=>void,
    onclose?:(code: number | null, signal: NodeJS.Signals | null)=>void
} & GraphNodeProperties

type CMDInfo = {
    process:ChildProcess,
    _id:string,
    controller:AbortController,
    send:(data:Serializable)=>boolean,
    request:(message:ServiceMessage|any, method?:string) => Promise<any>,
    post:(route:string, args:any, method?:string) => boolean,
    run:(route:any, args?:any, method?:string) => Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string) => number,
    unsubscribe:(route:any, sub:number) => Promise<boolean>
} & CMDRoute


import { CMDService } from "./CMD.node";
import { unsafeRoutes } from '../unsafe/Unsafe.service';

const service = new CMDService({
    routes:[unsafeRoutes]
}); //now we can send/receive messages

console.log("Child process listening...") 
 
 //....
 
```

Then create childprocess.js in your root (for this example)

```ts

import { CMDService } from "./CMD.node";
import { unsafeRoutes } from '../unsafe/Unsafe.service';

const service = new CMDService({
    routes:[unsafeRoutes]
}); //now we can send/receive messages

console.log("Child process listening...") 
 

```


and from your main program, add the following after instantiating a CMDService


```js

//....

 
const p = service.createProcess({
    command:'node',
    args:['childprocess.js']
});

```

and now you can interact with it nodes across child processes!