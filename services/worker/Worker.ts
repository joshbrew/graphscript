//functionality
import { WorkerService } from './Worker.service';
//import { GPUService } from '../gpu/GPU.service';
import { workerCanvasRoutes } from './WorkerCanvas';
import { unsafeRoutes } from '../unsafe/Unsafe.service';
import { ECSService } from '../ecs/ECS.service';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService({
        routes:[
            (self as any).SERVICE,
            //GPUService,
            workerCanvasRoutes,
            ECSService,
            unsafeRoutes //allows dynamic route loading
        ],
        includeClassName:false
    });
    
}

export default self as any;