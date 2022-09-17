import { Graph, parseFunctionFromText } from '../../Graph';
import { WorkerInfo, WorkerService } from './Worker.service';
import { unsafeRoutes } from '../unsafe/Unsafe.service';

export type Subprocess = (context:SubprocessContext,data:{[key:string]:any}|any)=>{[key:string]:any}|undefined

export type SubprocessContextProps = {
    ondata:Subprocess,
    oncreate?:(context:SubprocessContext)=>void,
    structs?:{ [key:string]:any }, //default structures, gets assigned to the context
    [key:string]:any
}

export type SubprocessContext = {
    ondata:Subprocess,
    oncreate?:(context
        :SubprocessContext)=>void,
    run?:(data:{[key:string]:any}|any)=>any //quicker macro
    [key:string]:any
};


export type SubprocessWorkerProps = { //use secondary workers to run processes and report results back to the main thread or other

    subprocess:string|{
        name:string,
        structs:{},
        oncreate:string|((ctx:SubprocessContext)=>void),
        ondata:string|((context,data:{[key:string]:any}|any)=>{[key:string]:any}|undefined),
        props?:{[key:string]:any}, //other htings you want on the context
    }, 

    subscribeRoute:string, source?:WorkerInfo, //source worker and the route we want to subscribe to on that worker, if no source it subscribes to a main thread route
    route:string, //route to run on our subprocess to pass back to window and/or pipe to another worker in the background
    init?:string, initArgs?:any[],   otherArgs?:any[],  //do we need to call an init function before running the callbacks? The results of this init will set the otherArgs
    callback?:string|((data:any)=>any), //do we want to do something with the subprocess output (if any) on the main thread? 
    pipeTo?:{ //pipe outputs (if any) from the suprocesses to a specific route on main thread or a known route on another thread?
        worker?:WorkerInfo, portId?:string, 
        route:string, otherArgs?:any[], 
        init?:string, initArgs?:any[], 
    }, //can pipe the results to a specific route on main thread or other threads via message ports
    worker?:WorkerInfo, url?:any, //need one or the other
    stopped?:boolean //you can subscribe the subprocess later by calling start();
}
export type SubprocessWorkerInfo = { //use secondary workers to run processes and report results back to the main thread or other
    sub:number,
    blocking?:boolean, //if piping, is the pipe blocking?
    stop:()=>void, //unsubscribe subprocess to stop updating it
    start:()=>void, //subscribe subprocess to continue updating it 
    terminate:()=>void, //terminate the worker
    setArgs:(args:any[]|{[key:string]:any})=>void //set additional arguments for the subprocess, this is an array of additional function arguments, first argument is always the subscribed output from the initial process
} & SubprocessWorkerProps;



export const algorithms:{ [key:string]:SubprocessContextProps } = {}

export const loadAlgorithms = (settings:{ [key:string]:SubprocessContextProps }) => {
    return Object.assign(algorithms,settings);
}


export function createSubprocess(
    options:SubprocessContextProps,
    inputs?:{[key:string]:any} //e.g. set the sample rate for this run
):SubprocessContext {

    let ctx = {
        _id:options._id ? options._id : `algorithm${Math.floor(Math.random()*1000000000000000)}`,
        ondata:options.ondata,
        run:(data:{[key:string]:any}|any) => {
            return ctx.ondata(ctx, data);
        }
    } as SubprocessContext;
    if(options.structs) recursivelyAssign(ctx, JSON.parse( JSON.stringify( options.structs ))); //hard copy
    if(inputs) recursivelyAssign(ctx, JSON.parse( JSON.stringify( inputs )));

    if(options.oncreate) {
        ctx.oncreate = options.oncreate;
    }
    if(ctx.oncreate) {
        ctx.oncreate(ctx);
    }

    //console.log('context created', ctx, inputs, options);

    return ctx;

}


let recursivelyAssign = (target,obj) => {
    for(const key in obj) {
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            if(typeof target[key] === 'object' && !Array.isArray(target[key])) recursivelyAssign(target[key], obj[key]);
            else target[key] = recursivelyAssign({},obj[key]); 
        } else target[key] = obj[key];
    }

    return target;
}



export const subprocessRoutes = {
    ...unsafeRoutes,
    loadAlgorithms:loadAlgorithms,
    'initSubprocesses':async function initSubprocesses( //requires unsafeRoutes
        subprocesses:{ //use secondary workers to run processes and report results back to the main thread or other
            [key:string]:SubprocessWorkerProps
        },
        service?:WorkerService //defaults to this.graph (assumed to be workerservice)
    ) {
        if(!service) service = this.graph;
        if(!service) return undefined;

        for(const p in subprocesses) {
            let s = subprocesses[p] as SubprocessWorkerInfo;

            if(!s.worker && s.url) s.worker = service.addWorker({url:s.url});
            if(!s.worker) continue;

            let w = s.worker;
            let wpId;
            wpId = service.establishMessageChannel(w.worker,s.source?.worker); //will be routed to main thread if source worker not defined
            if(!s.source) s.source = service as any;

            if(typeof s.subprocess === 'object') { //transfer the template for the worker
                const p = s.subprocess;
                if(!p.name) continue;
                if(typeof p.oncreate === 'function') {
                    p.oncreate = p.oncreate.toString();
                }
                if(typeof p.ondata === 'function') {
                    p.ondata = p.ondata.toString();
                }

                s.worker.post(
                    'addSubprocessTemplate',[
                        p.name,
                        p.structs,
                        p.oncreate,
                        p.ondata,
                        p.props
                    ]
                );

                s.subprocess = p.name;
            }

            if(s.init) {
                let r = await w.run(s.init, s.initArgs);
                s.otherArgs = r;
            }

            if(s.otherArgs) {
                w.run('setValue',['otherArgsProxy', Array.isArray(s.otherArgs) ? s.otherArgs : [s.otherArgs]]);
            }
            if(s.pipeTo) {
                w.run('setValue',['routeProxy', s.route]); //set the route we want to run through our proxy function below
                w.run('setValue',['pipeRoute', s.pipeTo.route]); //set the route to pipe results to
                
                //create dedicated worker if not specified
                if(s.url && !s.pipeTo.worker) {
                    let w2 = service.addWorker({url:s.url});
                    s.pipeTo.portId = service.establishMessageChannel(w.worker,w2.worker) as string;
                    s.pipeTo.worker = w2;
                }

                if(s.pipeTo.init) {
                    s.pipeTo.otherArgs = await s.pipeTo.worker.run(s.pipeTo.init, s.pipeTo.initArgs);
                }
                
                w.run('setValue',['pipePort', s.pipeTo.portId]); //set the pipe port
                if(s.pipeTo.otherArgs) w.run('setValue',['otherPipeArgs', s.pipeTo.otherArgs]); //set additional args to pipe with the results
                service.transferFunction(
                    w,
                    function pipeResults(data){
                        //console.log('piping', data);
                        let inp = data;
                        if(this.graph.otherArgsProxy) inp = [data, ...this.graph.otherArgsProxy]
                        let r = this.graph.run(this.graph.routeProxy, inp);

                        if(!s.blocking) return new Promise((res) => {
                            if(r instanceof Promise) {
                                r.then((rr) => {
                                    if(rr !== undefined) {
                                        let args = rr; if(this.graph.otherPipeArgs) args = [rr, ...this.graph.otherPipeArgs];
                                        if(this.workers[this.graph.pipePort]) {
                                            s.blocking = true;
                                            (this.workers[this.graph.pipePort] as WorkerInfo).run(this.graph.pipeRoute,args).then((result)=>{
                                                s.blocking = false;
                                                res(result);
                                            }); //will report to main thread if pipePort undefined (if not set in this init)
                                        }
                                            
                                    }
                                });
                            } else if(r !== undefined) {
                                let args = r; if(this.graph.otherPipeArgs) args = [r, ...this.graph.otherPipeArgs];
                                if(this.workers[this.graph.pipePort]){
                                    s.blocking = true;
                                    (this.workers[this.graph.pipePort] as WorkerInfo).run(this.graph.pipeRoute,args).then((result)=>{
                                        s.blocking = false;
                                        res(result); //this really isn't that efficient since the tertiary thread will report back to main thread through this thread. Better would be to proxy the third thread as well
                                    }); //will report to main thread if pipePort undefined (if not set in this init)
                                }//this.transmit({route:this.graph.pipeRoute, args}, this.graph.pipePort);   
                            }
                        });

                        return undefined;
                        
                    },
                    s.route+'_pipeResults'
                )

                s.route = s.route+'_pipeResults'; //we are proxying through here
                //pass decode/parse thread results to the subprocess, and then the subprocess can pipe 
                //  back to main thread or another worker (e.g. the render thread)

            } else {
                w.run('setValue',['routeProxy',s.route]);
                service.transferFunction(
                    w,
                    function routeProxy(data:any) {
                        let r;
                        if(this.graph.otherArgsProxy) r = this.graph.nodes.get(this.graph.routeProxy).operator(data, ...this.graph.otherArgsProxy);
                        else r = this.graph.nodes.get(this.graph.routeProxy).operator(data);
                        
                        if(this.graph.state.triggers[this.graph.routeProxy]) {
                            if(r instanceof Promise) {
                                r.then((rr) => {
                                    this.setState({[this.graph.routeProxy]:rr});
                                })
                            }
                            else this.setState({[this.graph.routeProxy]:r}); //so we can subscribe to the original route
                        }
                        return r;
                    },
                    s.route+'_routeProxy'
                )

                s.route = s.route+'_routeProxy'; //proxying through here 

                if(!s.stopped) w.run('subscribeToWorker', [s.subscribeRoute, wpId, s.route]).then((sub) => {
                    s.sub = sub;
                }); 
            }

            s.stop = async () => {
                //console.log(s.source, s.sub);
                if(s.source && typeof s.sub === 'number') {
                    s.source.unsubscribe(s.subscribeRoute,s.sub);
                    return true;
                }
                return undefined;
            }

            s.start = async () => {
                if(typeof s.sub !== 'number') return w.run('subscribeToWorker', [s.subscribeRoute, wpId, s.route, s.blocking]).then((sub) => {
                    s.sub = sub;
                }); 
            }

            s.setArgs = async (args:any[]|{[key:string]:any}) => { 
                //set additional arguments (subscription outputs are the first argument to the subprocess route, 
                //  for now this is not configurable unless you do something yourself). Need otherArgs set on init (just use a blank array) to be able to use these 
                if(Array.isArray(args)) await w.run('setValue', ['otherArgsProxy', args]);
                else if (typeof args === 'object') {
                    for(const key in args) {
                        await w.run('setValue',[key,args[key]]);
                    }
                }

                return true;
            }

            s.terminate = () => {
                w.terminate();
                if(s.source?.worker && typeof s.sub === 'number') {
                    s.source.post('unsubscribe',s.sub);
                }
                if(s.pipeTo?.worker) {
                    s.pipeTo.worker.terminate();
                }
            }

            if(s.callback) w.subscribe(s.route, (res) => { //we can change thisfrom the initial definition too
                if(typeof s.callback === 'string') this.graph.run(s.callback,res);
                else s.callback(res);
            });

        }

        return subprocesses as {
            [key: string]: SubprocessWorkerInfo;
        };
    },
    'addSubprocessTemplate': function subprocesstempalte(
        name:string,
        structs:{},
        oncreate:string|((ctx:SubprocessContext)=>void),
        ondata:string|((context,data:{[key:string]:any}|any)=>{[key:string]:any}|undefined),
        props?:{[key:string]:any} //other htings you want on the context
    ) {
        if(typeof oncreate === 'string') oncreate = parseFunctionFromText(oncreate);
        if(typeof ondata === 'string') ondata = parseFunctionFromText(ondata);

        if(typeof ondata === 'function') {
            algorithms[name] = {
                ondata,
                oncreate:typeof oncreate === 'function' ? oncreate : null,
                structs
            } as SubprocessContextProps

            if(typeof props === 'object') Object.assign(algorithms[name], props);

            return true;
        }
    },
    'updateSubprocess': function updatesubprocess(
        structs:{},
        _id?:string
    ) {
        if(!this.graph.ALGORITHMS) this.graph.ALGORITHMS = {};

        if(!_id) _id = Object.keys(this.graph.ALGORITHMS)[0]; //run the first key if none specified
        if(!_id) return;

        Object.assign(this.graph.ALGORITHMS[_id],structs); //e.g. update sample rate or sensitivity
    },
    'createSubprocess': function creatsubprocess( //returns id of algorithm for calling it on server
        options:SubprocessContextProps|string,
        inputs?:{[key:string]:any} //e.g. set the sample rate for this run
    ){
        if(!this.graph.ALGORITHMS) this.graph.ALGORITHMS = {};
        if(typeof options === 'string') {
            options = algorithms[options];
        }

        if(typeof options === 'object') {
            if(typeof options.ondata === 'string') options.ondata = parseFunctionFromText(options.ondata);

            let ctx;
            if(typeof options?.ondata === 'function') ctx = createSubprocess(options,inputs);
            if(ctx) this.graph.ALGORITHMS[ctx._id] = ctx;

            if(ctx) return ctx._id;
        }
        return false;
        
    },
    'runSubprocess':function runsubprocess(
        data:{[key:string]:any}, 
        _id?:string
    ){
        if(!this.graph.ALGORITHMS) this.graph.ALGORITHMS = {};

        if(!_id) _id = Object.keys(this.graph.ALGORITHMS)[0]; //run the first key if none specified

        if(!_id) return;
        let res = this.graph.ALGORITHMS[_id].run(data); 

        //console.log(this.graph.ALGORITHMS[_id]);
        if(res !== undefined) {
            if(Array.isArray(res)) {
                let pass:any[] = [];
                res.forEach((r) => {
                    if(r !== undefined) {
                        pass.push(r);
                        this.graph.setState({[_id as string]:r});
                    }
                });
                if(pass.length > 0) {
                    return pass;
                }
            }
            else {
                this.graph.setState({[_id as string]:res}); 
                return res;
            }
        }
        //results subscribable by algorithm ID for easier organizing, 
        //  algorithms returning undefined will not set state so you can have them only trigger 
        //      behaviors conditionally e.g. on forward pass algorithms that run each sample but only 
        //          report e.g. every 100 samples or when an anomaly is identified
    }
};