## Workers

To use workers within our graph hierarchy, we need to establish a worker service in the worker. This will set up the onmessage function correctly to interpret service messages.

e.g. worker.ts
```ts
//functionality
import { WorkerService, workerCanvasRoutes, workerCanvasRoutes, remoteGraphRoutes, ECSService } from 'graphscript';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService({
        services:{
            //GPUService,
            ECSService
        }
        roots:{
            ...workerCanvasRoutes,
            ...remoteGraphRoutes //allows dynamic route loading
        },
        includeClassName:false
    });
    
}

export default self as any;

```


This worker implements several useful services including a dedicated gpu.js instance, allowing for multithreaded gpu kernel calls for zero downtime on the main thread.

Now you can post commands and subscribe to results easily, or chain threads via message ports easily (see worker.service.md).

Note the remoteGraphRoutes allow writing functions, properties, and classes to the thread from another thread. Use with caution!