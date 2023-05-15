//we need to buffer before doing bulk blocking operations on separate threads sometimes (ffts in our case) so we are splitting this into 2 algos

import { GraphNodeProperties } from '../../core/Graph';
import { ByteParser } from './util/ByteParser';


export const circularBuffer2d:GraphNodeProperties = {
    bufferSize:250, //e.g. sps * nsec of data to buffer
    watch:['0','1','2','3'],
    data:{},
    blocking:false,
    
    __onconnected:function (node) {
        for(const key in node.watch) {
            node.data[key] = new Array(node.bufferSize).fill(0);
        }
    },
    __operator:function (data) {
        
        let buffer2d = [] as number[][];
    
        this.watch.forEach((key) => {
            if(data[key]) {
                ByteParser.circularBuffer(this.data[key], data[key])
                buffer2d.push(this.data[key])
            }
        });

        //console.log('buffered', buffer2d)

        return buffer2d;
    }
}