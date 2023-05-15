import { GraphNodeProperties } from '../../core/Graph';
import { Biquad } from './util/BiquadFilters';
import { Math2 } from 'brainsatplay-math';


export const blink_detect = {
    sps:250,
    intervals:{},
    watch:['0'],
    tolerance:0.2, //e.g. mV
    __onconnected:(node) => {
        node.watch.forEach((ch) => node.intervals[ch] = {
            lowpass:new Biquad('lowpass',20,node.sps),
            filtered:[] as number[],
            averaged:[] as number[]
        })
    },
    __operator:function(data:{
        [key:string]:number|number[]
    }) {
        let checkCt = 5;
        let averageCt = 50;

        let found = {};
        let passed = false;


        let pass = (key,n) => {
            let next = this.intervals[key].lowpass.applyFilter(n)
            this.intervals[key].filtered.push(next);
            this.intervals[key].averaged.push(next);
            if(this.intervals[key].filtered.length > checkCt) {
                if(this.intervals[key].averaged.length > averageCt) {
                    this.intervals[key].averaged.splice(0,checkCt);
                    let mean = Math2.mean(this.intervals[key].averaged);
                    if(Math.abs(Math.min(...this.intervals[key].filtered)) > Math.abs(mean) + this.tolerance) {
                        this.intervals[key].filtered.length = 0; //reset
                        passed = true;
                        found[key] = true;
                    }
                } else 
                    this.intervals[key].filtered.shift();
            }
        }
        

        for(const key in this.intervals) {
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
} as GraphNodeProperties