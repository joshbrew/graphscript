//import { Router } from '../../routers/Router';

//functionality
import { WorkerService } from './Worker.service';
import { GPUService } from '../gpu/GPU.service';
import { proxyWorkerRoutes } from './ProxyListener';
import { workerCanvasRoutes } from './WorkerCanvas';
import { unsafeRoutes } from '../unsafe/Unsafe.service';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService({
        routes:[
            (self as any).SERVICE,
            GPUService,
            proxyWorkerRoutes,
            workerCanvasRoutes,
            unsafeRoutes //allows dynamic route loading
        ],
        includeClassName:false
    });
    
}

export default self as any;