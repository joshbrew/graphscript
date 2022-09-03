import { Routes } from '../Service';
import { WorkerInfo } from './Worker.node.service';

export type Subprocess = (context,data:{[key:string]:any}|any)=>{[key:string]:any}|undefined

export type SubprocessContextProps = {
    ondata:Subprocess,
    oncreate?:(ctx:SubprocessContext)=>void,
    structs?:{ [key:string]:any }, //default structures
    [key:string]:any
}

export type SubprocessContext = {
    ondata:Subprocess,
    oncreate?:(ctx:SubprocessContext)=>void,
    run?:(data:{[key:string]:any}|any)=>any, //quicker macro
    [key:string]:any
};


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
    'initSubprocesses':function initsubprocesses(subprocesses:{ //use secondary workers to run processes and report results back to the main thread or other
        [key:string]:{
            subprocess:string|{
                name:string,
                structs:{},
                oncreate:string|((ctx:SubprocessContext)=>void),
                ondata:string|((context,data:{[key:string]:any}|any)=>{[key:string]:any}|undefined),
                props?:{[key:string]:any} //other htings you want on the context
            }, 
            otherArgs?:any[], init?:string, initArgs?:any[], //do we need to call an init function before running the callbacks? The results of this init will set the otherArgs
            url?:any,
            callback?:string|((data:any)=>any), //do we want to do something with the subprocess output (if any) on the main thread? 
            pipeTo?:{ //pipe outputs (if any) from the suprocesses to a specific route on main thread or a known route on another thread?
                portId:string, 
                route:string, otherArgs:any[], 
            }, //can pipe the results to a specific route on main thread or other threads via message ports
            worker?:WorkerInfo
        }
    }) {
        for(const p in subprocesses) {
            let options = subprocesses[p];
            if(typeof options.subprocess === 'object') {
                if(typeof options.subprocess.oncreate === 'function') {
                    options.subprocess.oncreate = options.subprocess.oncreate.toString();
                }
                if(typeof options.subprocess.ondata === 'function') {
                    options.subprocess.ondata = options.subprocess.ondata.toString();
                }
            }
        }
    }
} as Routes