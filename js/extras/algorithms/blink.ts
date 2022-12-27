import { SubprocessContextProps } from '../../services/worker/Subprocess';
import { Biquad } from './util/BiquadFilters';
import { Math2 } from 'brainsatplay-math';


export const blink_detect = {
    structs:{
        sps:250,
        intervals:{},
        watch:['0'],
        tolerance:0.2 //absolute tolerance e.g. 0.2mV
    },
    oncreate:(ctx) => {
        ctx.watch.forEach((ch) => ctx.intervals[ch] = {
            lowpass:new Biquad('lowpass',20,ctx.sps),
            filtered:[] as number[],
            averaged:[] as number[]
        })
    },
    ondata:(ctx,data:{
        [key:string]:number|number[]
    }) => {
        let checkCt = 5;
        let averageCt = 50;

        let found = {};
        let passed = false;


        let pass = (key,n) => {
            let next = ctx.intervals[key].lowpass.applyFilter(n)
            ctx.intervals[key].filtered.push(next);
            ctx.intervals[key].averaged.push(next);
            if(ctx.intervals[key].filtered.length > checkCt) {
                if(ctx.intervals[key].averaged.length > averageCt) {
                    ctx.intervals[key].averaged.splice(0,checkCt);
                    let mean = Math2.mean(ctx.intervals[key].averaged);
                    if(Math.abs(Math.min(...ctx.intervals[key].filtered)) > Math.abs(mean) + ctx.tolerance) {
                        ctx.intervals[key].filtered.length = 0; //reset
                        passed = true;
                        found[key] = true;
                    }
                } else 
                    ctx.intervals[key].filtered.shift();
            }
        }
        

        for(const key in ctx.intervals) {
            if(data[key]) {
                if(Array.isArray(data[key])) {
                    (data[key] as any).forEach((n) => {
                        pass(key,n);
                    });
                } else if(typeof data[key] === 'number') pass(key,data[key]);
            }
        }

        if(passed) return found;
        
    } 
} as SubprocessContextProps