import { SubprocessContextProps } from '../../services/worker/Subprocess';
import { GPUService } from '../gpu/GPU.service';

if(!globalThis.gpu) globalThis.gpu = new GPUService(); // contains macros for persistent kernels (programs) on the gpu using an instance of gpujs, using the same instance lets us reuse the same kernel instances

export const dft:SubprocessContextProps = {
    structs:{
        sps:250, //sample rate of data 
        nSec:1, //number of seconds of data to buffer
        freqStart:0,
        freqEnd:125, //default full nyquist range 
        watch:['0','1','2','3'],
        blocking:false
    },
    oncreate:(ctx) => {
    },
    ondata:(ctx,arraybuffer) => {

        //console.log('buffer', arraybuffer)
        let results = (globalThis.gpu as GPUService).multidftbandpass(
            arraybuffer, 
            ctx.nSec, 
            ctx.freqStart, 
            ctx.freqEnd,
            1
        ) as [number[],number[][],number[][]] //frequency (x), power spectrums (y), coherence per channel (in order of channels)

        let dft = {};

        ctx.watch.forEach((tag,i) => {
            dft[tag] = results[1][i];
        });


        return {
            frequencies: results[0],
            dft
        }
    }
}