
import { GraphNodeProperties } from '../../core/Graph';
import { GPUService } from '../gpu/GPU.service';

if(!globalThis.gpu) globalThis.gpu = new GPUService(); // contains macros for persistent kernels (programs) on the gpu using an instance of gpujs, using the same instance lets us reuse the same kernel instances

export const coherence:GraphNodeProperties = {
    sps:250, //sample rate of data 
    nSec:1, //number of seconds of data to buffer
    freqStart:0,
    freqEnd:125, //default full nyquist range 
    tags:['0','1','2','3'],
    coherenceTags:[] as any[],
    __onconnected:function (node) {
        node.tags.forEach((tag,i) => {
            if(i !== node.tags.length-1){
                for(let j = i+1; j < node.tags.length; j++) {
                    node.coherenceTags.push(node.tags[i]+'_'+node.tags[j]);
                }
            }
        })
    },
    __operator:function(arraybuffer) {

        let ts = Date.now();

        //console.log('buffer', arraybuffer)
        let results = (globalThis.gpu as GPUService).coherence(
            arraybuffer, 
            this.nSec, 
            this.freqStart, 
            this.freqEnd
        ) as [number[],number[][],number[][]] //frequency (x), power spectrums (y), coherence per channel (in order of channels)

        let dft = {};

        this.tags.forEach((tag,i) => {
            dft[tag] = results[1][i];
        });

        let coherence = {};

        this.coherenceTags.forEach((tag,i) => {
            coherence[tag] = results[2][i];
        });

        return {
            timestamp:ts,
            frequencies:results[0],
            dft,
            coherence
        };
    }
}