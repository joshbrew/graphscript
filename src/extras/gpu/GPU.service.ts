//gpujs implementation. all of this can and should be optimized and built upon but it's just functional

import { Service } from "../../services/Service";
import {gpuUtils} from 'gpujsutils'//'../node_modules/gpujsutils/src/gpuUtils'
import {Math2} from 'brainsatplay-math'
import { parseFunctionFromText } from "../../services/utils";

//https://github.com/joshbrew/gpujsutils

export class GPUService extends Service {

    gpu = new gpuUtils()

    
    constructor(options?:any) {
        super(options)
        this.load(this);
    }


    addFunc=(fn:string|Function)=>{
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        if(typeof fn === 'function') this.gpu.addFunction(fn as any);
    }
    addKernel=(name:string,fn:string|Function,options?:any)=>{
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        if(typeof fn === 'function') this.gpu.addKernel(name,fn as any,options);
    }
    combineKernels=(name:string,fs:(string|Function)[], ckrnl?:()=>void)=>{
        for(let i = 0; i < fs.length; i++) {
            if(typeof fs[i] === 'string') fs[i] = parseFunctionFromText(fs[i] as string);
        }
        if(typeof ckrnl === 'string') ckrnl = parseFunctionFromText(ckrnl);
        this.gpu.combineKernels(name, fs, ckrnl);
    }
    callKernel=(name:string,...args:any[])=>{
        this.gpu.callKernel(name,args);
    }
    dft=(signalBuffer: number[], nSeconds: any, scalar?: number)=>{
        if (scalar == undefined) scalar = 1;
        return this.gpu.gpuDFT(signalBuffer,nSeconds,scalar);
    }
    multidft=(signalBuffer: number[], nSeconds: any, scalar?: number)=>{
        if (scalar == undefined) scalar = 1;
        return this.gpu.MultiChannelDFT(signalBuffer,nSeconds,scalar);
    }
    multidftbandpass=(buffered:number[][],nSeconds:number,freqStart:number,freqEnd:number, scalar?:number) => {
        if (scalar == undefined) scalar = 1;
        return this.gpu.MultiChannelDFT_Bandpass(buffered, nSeconds, freqStart, freqEnd, scalar);
    }
    //need to fix the ffts
    coherence=(buffered:number[][],nSeconds:number,freqStart:number,freqEnd:number) => {
        const correlograms = Math2.correlograms(buffered as any); //should get this onto the GPU also, an untested function exists
        const buffer = [...buffered, ...correlograms];
        //console.log(buffer)
        var dfts:any;

        var scalar = 1;
        //console.log(mins)
        //console.log(buffer);
        dfts = this.gpu.MultiChannelDFT_Bandpass(buffer, nSeconds, freqStart, freqEnd, scalar);
        //console.log(dfts)
        const cordfts = dfts[1].splice(buffered.length, buffer.length - buffered.length);
        //console.log(cordfts)

        const coherenceResults:any[] = [];
        const nChannels = buffered.length;

        //cross-correlation dfts arranged like e.g. for 4 channels: [0:0, 0:1, 0:2, 0:3, 1:1, 1:2, 1:3, 2:2, 2:3, 3:3] etc.
        var k = 0;
        var l = 0;
        cordfts.forEach((row, i) => { //move autocorrelation results to front to save brain power
        if (l + k === nChannels) {
            var temp = cordfts.splice(i, 1);
            k++;
            cordfts.splice(k, 0, ...temp);
            l = 0;
            //console.log(i);
        }
        l++;
        });
        //Now arranged like [0:0,1:1,2:2,3:3,0:1,0:2,0:3,1:2,1:3,2:3]

        //Outputs FFT coherence data in order of channel data inputted e.g. for 4 channels resulting DFTs = [0:1,0:2,0:3,1:2,1:3,2:3];

        var autoFFTproducts:any[] = [];
        k = 0;
        l = 1;
        cordfts.forEach((dft, i) => {
        var newdft = new Array(dft.length).fill(0);
        if (i < nChannels) { //sort out autocorrelogram FFTs
            dft.forEach((amp, j) => {
            newdft[j] = amp//*dfts[1][i][j];
            });
            autoFFTproducts.push(newdft);
        }
        else { //now multiply cross correlogram ffts and divide by autocorrelogram ffts (magnitude squared coherence)
            dft.forEach((amp, j) => {
                let denom = (autoFFTproducts[k][j] * autoFFTproducts[k + l][j]);
                if(denom !== 0)
                    newdft[j] = amp * amp / denom;//Magnitude squared coherence;
                else newdft[j] = 0;

                if (newdft[j] > 1) { newdft[j] = 1; } //caps the values at 1
                //newdft[j] = Math.pow(newdft[j],.125)
                });
                l++;
                if ((l + k) === nChannels) {
                k++;
                l = 1;
                }
                coherenceResults.push(newdft);
            }
        });
        return [dfts[0], dfts[1], coherenceResults];
    }

}