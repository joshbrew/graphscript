import { workerCanvasRoutes } from './WorkerCanvas';
//minimal web worker for running offscreen canvases, 
//no graphscript required

const routes = {
    ...workerCanvasRoutes
    //add more compatible routes that don't require graphscript
};

self.onmessage = (ev) => {
    if(ev.data.route) {
        if(Array.isArray(ev.data.args)) {
            routes[ev.data.route](...ev.data.args);
        } else routes[ev.data.route](ev.data.args);
    } //that's it! The functions handle worker communication internally

}

export default self as any;