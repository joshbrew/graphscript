
//functionality
import { WorkerService, workerCanvasRoutes, remoteGraphRoutes } from '../../index';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService({
        roots:{
            ...workerCanvasRoutes,
            ...remoteGraphRoutes, //allows dynamic route loading
            console,
            mul:function(a,b) { return a * b; },
            
            __listeners:{
                console:{
                    mul:{
                        __callback:'console.log'
                    }
                }
            }
        }
    });
}

export default self as any;

