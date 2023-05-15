//root mean square doer thinger

import { GraphNodeProperties } from "../../core/Graph";
import { ByteParser } from "./util/ByteParser";

export const rms:GraphNodeProperties = {
    sps:250, //sample rate of data 
    nSec:1, //number of seconds of data to buffer
    watch:['0','1','2','3'],
    data:{},
    rms:{},
    //__onconnected:(node) => { },
    __operator:function (data) {

        this.watch.forEach((key) => {
            if(data[key]) {
                if(!this.data[key]) {
                    if(Array.isArray(data[key])) {
                        this.data[key] = new Array(Math.floor(this.sps*this.nSec)).fill(data[key][0]);
                    } else this.data[key] = new Array(Math.floor(this.sps*this.nSec)).fill(data[key]);
                }
                ByteParser.circularBuffer(this.data[key],data[key]);
            }
        });

        if(data.timestamp) {
            if(Array.isArray(data.timestamp)) {
                this.rms.timestamp = data.timestamp[data.timestamp.length - 1];
            } else this.rms.timestamp = data.timestamp;
        } else this.rms.timestamp = Date.now();

        //console.log(ctx.rms,ctx.data);

        return new Promise(async res => {
            await Promise.all(this.watch.map(async (key) => {
                if(this.data[key]) this.rms[key] = Math.sqrt(Math.abs((this.data[key] as number[]).reduce((p,v,i) => p + v*v )/this.data[key].length)); //root mean square sum
                else delete this.rms[key];
            }))

            res(this.rms);
        }) 

    }
}