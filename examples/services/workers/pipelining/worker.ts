
import { WorkerService, remoteGraphRoutes } from '../../../../index';

//worker threads

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    
    const worker = new WorkerService({
        //props:{} //could set the props instead of globalThis but it really does not matter unless you want to bake in for more complex service modules
        roots:{
            ...remoteGraphRoutes,
        }
    });

    console.log('worker', worker)
    
}

export default self as any;
