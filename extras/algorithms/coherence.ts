import { SubprocessContextProps } from '../../services/worker/Subprocess';
import { GPUService } from '../gpu/GPU.service';

if(!globalThis.gpu) globalThis.gpu = new GPUService(); // contains macros for persistent kernels (programs) on the gpu using an instance of gpujs, using the same instance lets us reuse the same kernel instances

export const coherence:SubprocessContextProps = {
    structs:{
        sps:250, //sample rate of data 
        nSec:1, //number of seconds of data to buffer
        freqStart:0,
        freqEnd:125, //default full nyquist range 
        watch:['0','1','2','3'],
        data:{},
        blocking:false
    },
    oncreate:(ctx) => {
        for(const key in ctx.watch) {
            ctx.watch[key] = new Array(Math.floor(ctx.sps*ctx.nSec)).fill(0);
        }
    },
    ondata:(ctx,arraybuffer) => {

        return (globalThis.gpu as GPUService).coherence(
                    arraybuffer, 
                    ctx.nSec, 
                    ctx.freqStart, 
                    ctx.freqEnd
                ) as [number[],number[][],number[][]] //frequency (x), power spectrums (y)
    }
}