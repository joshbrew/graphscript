//root mean square doer thinger

import { SubprocessContextProps } from "../../services/worker/Subprocess";
import { ByteParser } from "./util/ByteParser";

export const rms:SubprocessContextProps = {
    structs:{
        sps:250, //sample rate of data 
        nSec:1, //number of seconds of data to buffer
        watch:['0','1','2','3'],
        data:{},
        rms:{}
    },
    //oncreate:(ctx) => { },
    ondata:(ctx,data) => {

        ctx.watch.forEach((key) => {
            if(data[key]) {
                if(!ctx.data[key]) {
                    if(Array.isArray(data[key])) {
                        ctx.data[key] = new Array(Math.floor(ctx.sps*ctx.nSec)).fill(data[key][0]);
                    } else ctx.data[key] = new Array(Math.floor(ctx.sps*ctx.nSec)).fill(data[key]);
                }
                ByteParser.circularBuffer(ctx.data[key],data[key]);
            }
        });

        if(data.timestamp) {
            if(Array.isArray(data.timestamp)) {
                ctx.rms.timestamp = data.timestamp[data.timestamp.length - 1];
            } else ctx.rms.timestamp = data.timestamp;
        } else ctx.rms.timestamp = Date.now();

        //console.log(ctx.rms,ctx.data);

        return new Promise(async res => {
            await Promise.all(ctx.watch.map(async (key) => {
                if(ctx.data[key]) ctx.rms[key] = Math.sqrt(Math.abs((ctx.data[key] as number[]).reduce((p,v,i) => p + v*v )/ctx.data[key].length)); //root mean square sum
                else delete ctx.rms[key];
            }))

            res(ctx.rms);
        }) 

    }
}