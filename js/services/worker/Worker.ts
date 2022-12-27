//functionality
import { WorkerService } from './service/Worker.service';
//import { GPUService } from '../gpu/GPU.service';
import { workerCanvasRoutes } from './WorkerCanvas';
import { unsafeRoutes } from '../unsafe/Unsafe.service';
import { Math2 } from 'brainsatplay-math';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService({
        services:{
            workerCanvasRoutes,
            unsafeRoutes, //allows dynamic route loading
            Math,
            Math2
        }
    });
    
}

export default self as any;