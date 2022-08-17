## WorkerService

The Worker Service makes it very easy to create multithreaded applications with a generic communication format, and construct arbitrary function graphs.

This includes custom route definitions that allow you to chain workers (incl through message ports for worker -> worker parent-child relationships) and node callbacks seamlessly. 

The custom route:
```ts
type WorkerRoute = {
    worker?:WorkerInfo
    workerUrl?: string|URL|Blob,
    workerId?: string,
    transferFunctions?:{[key:string]:Function},
    transferClasses?:{[key:string]:Function},
    parentRoute?:string, //if a child of a worker node, subscribe to a route on a parent worker?
    callback?:string //Run this route on the worker when the operator is called. If this route is a child of another node, run this node on the child worker when it receives a message. 
} & GraphNodeProperties & WorkerProps

```


To use the worker service:
```ts

import {WorkerService, gsworker} from 'graphscript' //the gsworker is our default worker you can customize to handle most functionality you'd want, incl gpujs and canvases

type WorkerProps = {
    worker:WorkerInfo,
    workerUrl?: string|URL|Blob,
    url?:URL|string|Blob,
    _id?:string,
    port?:MessagePort, //message channel for this instance
    onmessage?:(ev)=>void,
    onerror?:(ev)=>void
} 

type WorkerInfo = {
    worker:Worker,
    send:(message:any,transfer?:any)=>void,
    request:(message:any, transfer?:any, origin?:string, method?:string)=>Promise<any>,
    post:(route:any, args?:any, transfer?:any)=>void,
    run:(route:any, args?:any, transfer?:any, origin?:string, method?:string)=>Promise<any>
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>
} & WorkerProps & WorkerRoute



//import worker from 'graphscript' //default worker
import worker from './worker.ts' //this will compile with tinybuild

const workers = new WorkerService();

let worker1 = workers.addWorker({url:worker});
let worker2 = workers.addWorker({url:worker});

const portId = workers.establishMessageChannel(worker1.worker,worker2.worker)

//if unsafeService is enabled on the worker you can quickly write in functions from the main thread
workers.transferFunction(
    worker1,
    function add1(input) {
        return input + 1;
    }
) //creates a node called 'add' on this worker using the function definition

workers.transferFunction(
    worker2,
    function log(input) {
        console.log('worker logged: ',input);
        return true;
    }
);

worker2.post('subscribeToWorker',['add1',portId,'log']);

worker2.subscribe('log',(res)=>{console.log('returned from worker2: ',res);}) //should grab the 'true' result from worker2 back on the main thread.

worker1.post('add1',3);


//check console, worker2 should log the result!

```

You can use `workers.transferClass` to transfer class methods, but note that if it is extending another class it will error unless the extended class already exists on the receiving thread.

This is an incredibly powerful feature set, use threads for any and all heavy computations, they can even run fetch and server APIs on independent scopes, but note that the memory pool is shared with the main thread unlike child processes in node.