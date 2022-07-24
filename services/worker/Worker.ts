import { Router } from '../../routers/Router';

//functionality
import { WorkerService } from './Worker.service';
import { GPUService } from '../gpu/GPU.service';
import { proxyWorkerRoutes } from './ProxyListener';
import { workerCanvasRoutes } from './WorkerCanvas';
import { unsafeRoutes } from '../unsafe/Unsafe.service';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService();

    (self as any).ROUTER = new Router([ //this links nodes in different services to each other if loaded in this context
        (self as any).SERVICE,
        GPUService,
        proxyWorkerRoutes,
        workerCanvasRoutes,
        unsafeRoutes //allows dynamic route loading
        //load additional services in node or browser workers e.g. http service in node or threejs service in browser
    ]);

    self.onmessage = (ev:MessageEvent) => {
        let result = ((self as any).SERVICE as WorkerService).receive(ev.data); //this will handle graph logic and can run requests for the window or messsage ports etc etc.
        //console.log(result);
    }
    
}

export default self as any;