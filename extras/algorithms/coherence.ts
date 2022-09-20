import { SubprocessContextProps } from '../../services/worker/Subprocess';
import { GPUService } from '../gpu/GPU.service';

if(!globalThis.gpu) globalThis.gpu = new GPUService(); // contains macros for persistent kernels (programs) on the gpu using an instance of gpujs, using the same instance lets us reuse the same kernel instances

export const coherence:SubprocessContextProps = {
    structs:{
        sps:250, //sample rate of data 
        nSec:1, //number of seconds of data to buffer
        freqStart:0,
        freqEnd:125, //default full nyquist range 
        tags:['0','1','2','3'],
        coherenceTags:[] as any[]
    },
    oncreate:(ctx) => {
        ctx.tags.forEach((tag,i) => {
            if(i !== ctx.tags.length-1){
                for(let j = i+1; j < ctx.tags.length; j++) {
                    ctx.coherenceTags.push(ctx.tags[i]+'_'+ctx.tags[j]);
                }
            }
        })
    },
    ondata:(ctx,arraybuffer) => {

        let ts = Date.now();

        //console.log('buffer', arraybuffer)
        let results = (globalThis.gpu as GPUService).coherence(
            arraybuffer, 
            ctx.nSec, 
            ctx.freqStart, 
            ctx.freqEnd
        ) as [number[],number[][],number[][]] //frequency (x), power spectrums (y), coherence per channel (in order of channels)

        let dft = {};

        ctx.tags.forEach((tag,i) => {
            dft[tag] = results[1][i];
        });

        let coherence = {};

        ctx.coherenceTags.forEach((tag,i) => {
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