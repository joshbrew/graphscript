import { Service } from "../../services/Service";
import { gpuUtils } from 'gpujsutils';
export declare class GPUService extends Service {
    gpu: gpuUtils;
    constructor(options?: any);
    addFunc: (fn: string | Function) => void;
    addKernel: (name: string, fn: string | Function, options?: any) => void;
    combineKernels: (name: string, fs: (string | Function)[], ckrnl?: () => void) => void;
    callKernel: (name: string, ...args: any[]) => void;
    dft: (signalBuffer: number[], nSeconds: any, scalar?: number) => any;
    multidft: (signalBuffer: number[], nSeconds: any, scalar?: number) => any;
    multidftbandpass: (buffered: number[][], nSeconds: number, freqStart: number, freqEnd: number, scalar?: number) => any;
    coherence: (buffered: number[][], nSeconds: number, freqStart: number, freqEnd: number) => any[];
}
