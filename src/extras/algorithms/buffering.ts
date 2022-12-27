//we need to buffer before doing bulk blocking operations on separate threads sometimes (ffts in our case) so we are splitting this into 2 algos

import { SubprocessContextProps } from '../../services/worker/Subprocess';
import { ByteParser } from './util/ByteParser';


export const circularBuffer2d:SubprocessContextProps = {
    structs:{
        bufferSize:250, //e.g. sps * nsec of data to buffer
        watch:['0','1','2','3'],
        data:{},
        blocking:false
    },
    oncreate:(ctx) => {
        for(const key in ctx.watch) {
            ctx.data[key] = new Array(ctx.bufferSize).fill(0);
        }
    },
    ondata:(ctx,data) => {
        
        let buffer2d = [] as number[][];
    
        ctx.watch.forEach((key) => {
            if(data[key]) {
                ByteParser.circularBuffer(ctx.data[key], data[key])
                buffer2d.push(ctx.data[key])
            }
        });

        //console.log('buffered', buffer2d)

        return buffer2d;
    }
}