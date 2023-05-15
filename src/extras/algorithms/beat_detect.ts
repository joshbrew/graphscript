//AlgorithmContext implementation for a basic low-pass peak finding algorithm with some basic error correction
import { Math2 } from 'brainsatplay-math';
import { Biquad } from './util/BiquadFilters';
import { GraphNodeProperties } from '../../core/Graph';

export const beat_detect = {
    refdata:[] as any,
    lowpass:undefined,
    smoothed:[] as any,
    //dsmoothed:[] as any, //slope
    timestamp:[] as any,
    peaks:[] as any,
    valleys:[] as any,
    peak_distances:[] as any,
    valley_distances:[] as any,
    beats:[] as any,
    lastPeak:0,
    lastValley:0,
    sps:100, //set the sample rate, e.g. 100
    maxFreq:4, //the max frequency of peaks we want to detect, we will create a moving average and peak finding interval based on this and the sample rate. //e.g. 4hz for heart rate, or 1/3rd hz for breathing
    limit:10, //limit number of last-values stored on the peak/valley/beat arrays to save memory, can just collect externally when a beat is returned
    __onconnected:function() {
        if(!this.lowpass) { //init lowpass filter with up to date sample rate
            let freq = this.maxFreq;
            if(!freq) freq = 1;
            if(freq > 1) freq *= 0.5; //helps smooth more on faster sine waves, for low freqs this starts to be too smooth
            
            //lowpass filter constraints
            this.lowpass = new Biquad('lowpass', this.maxFreq, this.sps);

            this.peakFinderWindow = Math.floor(this.sps/this.maxFreq)
            if(this.peakFinderWindow%2 === 0) this.peakFinderWindow+=1; 
            if(this.peakFinderWindow < 5) this.peakFinderWindow = 5;
            this.midpoint = Math.round(this.peakFinderWindow*.5);

        }
    },
    __operator:function(
        data:{
            //general use data key
            raw?:number|number[],  
            
            //pulse ox or fnirs data
            red?:number|number[], //could be any LED really but we are using red and IR predominantly
            ir?:number|number[], 
            heg?:number|number[], //e.g. the Peanut only gives us the HEG in a usable way

            //used for frequency finding
            timestamp?:number|number[]
        }
    ){

        if(!('red' in data) && !('heg' in data) && !('raw' in data)) return undefined;  //invalid data

        let refdata = data.red ? data.red : data.heg? data.heg : data.raw;

        if(!('timestamp' in data)) { //generate timestamps if none, assuming latest data is at time of the ondata callback
            if(Array.isArray(refdata)) { //assume timestamp
                let now = Date.now();
                let len;
                if(refdata) len = (refdata as number[]).length;
                let toInterp = [now - (refdata as number[]).length*this.sps*1000, now];
                data.timestamp = Math2.upsample(toInterp,(refdata as number[]).length);
            } else {
                data.timestamp = Date.now();
            }
        }

        let pass = (amplitude, timestamp) => {
            if(amplitude) {
                this.refdata.push(amplitude);
            }
            this.timestamp.push(timestamp);

            let beat;
            
            if(this.refdata.length > this.peakFinderWindow) { //we only need to store enough data in a buffer to run the algorithm (to limit buffer overflow)
                this.refdata.shift();
                this.timestamp.shift();
            }


            this.smoothed.push(
                this.lowpass.applyFilter(this.refdata[this.refdata.length - 1])
            );

            if(this.smoothed.length > this.peakFinderWindow) {
                this.smoothed.shift();
            }

        
            if(this.smoothed.length === this.peakFinderWindow) {
                // context.dsmoothed.push(
                //     (   context.refdata[context.refdata.length-1] - 
                //         context.refdata[context.refdata.length-2]   
                //     ) / context.timestamp[context.timestamp[context.timestamp.length-1]]
                // );

                //context.smoothed.indexOf(Math.max(...context.smoothed)) === context.midpoint 
                if(Math2.isExtrema(this.smoothed,'valley')) {
                    this.valleys.push({
                        value:this.smoothed[this.smoothed.length - this.midpoint ? this.midpoint : 1], 
                        timestamp:this.timestamp[this.timestamp.length - this.midpoint ? this.midpoint : 1]
                    });
                } else if (Math2.isExtrema(this.smoothed,'peak')) {
                    this.peaks.push({
                        value:this.smoothed[this.smoothed.length - this.midpoint ? this.midpoint : 1], 
                        timestamp:this.timestamp[this.timestamp.length - this.midpoint ? this.midpoint : 1]
                    });
                }


                if(this.valleys.length > 2 && this.peaks.length > 2) {

                    //if we have 3+ peaks or 3+ valleys in front of the previous peak or valley, we need to shave them off as we are looking for a sine wave (1 peak 1 valley).
                    if(this.valleys[this.valleys.length-1].timestamp < this.peaks[this.peaks.length - 2].timestamp) 
                        this.peaks.splice(this.peaks.length-1);
                    if(this.peaks[this.peaks.length-1].timestamp < this.valleys[this.valleys.length - 2].timestamp) 
                        this.valleys.splice(this.valleys.length-1);

                    this.valley_distances.push({
                        distance:this.valleys[this.valleys.length - 1].timestamp - this.valleys[this.valleys.length - 2].timestamp,
                        timestamp:this.valleys[this.valleys.length - 1].timestamp,
                        peak0:this.valleys[this.valleys.length - 1].value,
                        peak1:this.valleys[this.valleys.length - 2].value
                    });
                
                    this.peak_distances.push({
                        distance:this.peaks[this.peaks.length - 1].timestamp - this.peaks[this.peaks.length - 2].timestamp,
                        timestamp:this.peaks[this.peaks.length - 1].timestamp,
                        peak0:this.peaks[this.peaks.length - 1].value,
                        peak1:this.peaks[this.peaks.length - 2].value
                    });

                    if(this.peak_distances.length > 1 && this.valley_distances.length > 1) {
                        if(this.lastPeak < this.peaks[this.peaks.length-1].timestamp && this.lastValley < this.peaks[this.peaks.length-1].timestamp) {
                            if(this.valley_distances[this.valley_distances.length -1].timestamp > this.peak_distances[this.peak_distances.length-1].timestamp) {
                                let bpm, change = 0;
                                if(this.beats.length < 1) {
                                    bpm = 60/(0.0005 * (this.peak_distances[this.peak_distances.length-1].distance + 
                                        this.valley_distances[this.valley_distances.length-1].distance));
                                    
                                } else if (this.beats[this.beats.length-1].timestamp !== this.peak_distances[this.peak_distances.length-1].timestamp) {
                                    bpm = 60/(0.0005*(this.peak_distances[this.peak_distances.length-1].dt + this.valley_distances[this.valley_distances.length-1].dt));
                                    change = Math.abs(bpm - this.beats[this.beats.length - 1].bpm);
                                }

                                beat = {
                                    timestamp:this.peak_distances[this.peak_distances.length - 1].timestamp, 
                                    change, 
                                    bpm,
                                    height0:this.peak_distances[this.peak_distances.length-1].peak0 - 
                                                this.valley_distances[this.valley_distances.length-1].peak0, 
                                    height1:this.peak_distances[this.peak_distances.length-1].peak1 - 
                                                this.valley_distances[this.valley_distances.length-1].peak1
                                };

                                this.beats.push(beat);

                                this.lastPeak = this.peaks[this.peaks.length-1].timestamp;
                                this.lastValley = this.peaks[this.peaks.length-1].timestamp;
                            } else {
                                let bpm, change = 0;
                                if(this.beats.length < 2) {
                                    bpm = 60/(0.0005*(this.peak_distances[this.peak_distances.length-2].distance + this.valley_distances[this.valley_distances.length-2].distance)); //(averaged peak + valley distance (msec)) * msec/sec * 60sec/min
                                } else if(this.beats[this.beats.length-1].timestamp !== this.peak_distances[this.peak_distances.length-2].timestamp) {
                                    bpm = 60/(0.0005*(this.peak_distances[this.peak_distances.length-2].distance + this.valley_distances[this.valley_distances.length-2].distance));
                                    change = Math.abs(bpm-this.beats[this.beats.length-2].bpm);
                                }

                                beat = {
                                    timestamp:this.peak_distances[this.peak_distances.length-2].timestamp, 
                                    change, 
                                    bpm, 
                                    height0:this.peak_distances[this.peak_distances.length-2].peak0-this.valley_distances[this.valley_distances.length-2].peak0,
                                    height1:this.peak_distances[this.peak_distances.length-2].peak1-this.valley_distances[this.valley_distances.length-2].peak1
                                }; 
                                if(Array.isArray(beat.timestamp)) beat.timestamp = beat.timestamp[0]; //some kind of bug 

                                this.beats.push(beat);

                                this.lastPeak = this.peaks[this.peaks.length-1].timestamp;
                                this.lastValley = this.peaks[this.peaks.length-1].timestamp;
                            }
                        }
                    }

                    //limits memory usage
                    if(this.peaks.length > this.limit) { this.peaks.shift(); }
                    if(this.valleys.length > this.limit) { this.valleys.shift(); }
                    if(this.peak_distances.length > this.limit) { this.peak_distances.shift(); }
                    if(this.valley_distances.length > this.limit) { this.valley_distances.shift(); }
                    if(this.beats.length > this.limit) { this.beats.shift(); }

                }
            }

            return beat;
        }

        //console.log(context); 

        if(data.red) {
            if(('ir' in data) && !Array.isArray(data.red)) return pass((data.red  as number)+(data.ir as number),data.timestamp);
            
            let result;
            if(data.ir) result = (data.red as number[]).map((v,i) => { 
                return pass(v+(data as any).ir[i],(data.timestamp as number[])[i]); 
            }).filter(v => {if(v) return true;});
            else result = (data.red as number[]).map((v,i) => { 
                return pass(v,(data.timestamp as number[])[i]); 
            }).filter(v => {if(v) return true;});
            
            return result; //will return an array, defined results will be 

        } else if (data.raw) {
            if(!Array.isArray(data.raw)) return pass(data.raw,data.timestamp);
            let result = data.raw.map((v,i) => { 
                return pass(v,(data.timestamp as number[])[i]); 
            }).filter(v => {if(v) return true;});
            return result; //will return an array
        } else if (Array.isArray(data.heg)) {
            if(!Array.isArray(data.heg)) return pass(data.heg,data.timestamp);
            let result = data.heg.map((v,i) => { 
                return pass(v,(data.timestamp as number[])[i]); 
            }).filter(v => {if(v) return true;});
            return result; //will return an array

        }
        //returns a beat when one is detected with the latest data passed in, else returns undefined
    }
} as GraphNodeProperties;