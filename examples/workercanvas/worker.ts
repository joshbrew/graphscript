import { 
    WorkerService, 
    unsafeRoutes, 
    workerCanvasRoutes,
     //GPUService 
} from '../../index'/////"../../GraphServiceRouter/index";//from 'graphscript'


declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    const worker = new WorkerService({
        services:{
            //GPUService as any,
            workerCanvasRoutes,
            unsafeRoutes //allows dynamic route loading
        }
    });

    console.log(worker)
}



export default self as any;