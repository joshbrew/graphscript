//AlgorithmContext implementation for a basic low-pass peak finding algorithm with some basic error correction
import { Math2 } from 'brainsatplay-math';
import { SubprocessContext, SubprocessContextProps } from '../../services/worker/Subprocess';
import { Biquad } from './util/BiquadFilters';

export const beat_detect = {
    structs:{ //assign key data structures to the context for reference on each pass
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
    },
    oncreate:(context) => {
        if(!context.lowpass) { //init lowpass filter with up to date sample rate
            let freq = context.maxFreq;
            if(!freq) freq = 1;
            if(freq > 1) freq *= 0.5; //helps smooth more on faster sine waves, for low freqs this starts to be too smooth
            
            //lowpass filter constraints
            context.lowpass = new Biquad('lowpass', context.maxFreq, context.sps);

            context.peakFinderWindow = Math.floor(context.sps/context.maxFreq)
            if(context.peakFinderWindow%2 === 0) context.peakFinderWindow+=1; 
            if(context.peakFinderWindow < 5) context.peakFinderWindow = 5;
            context.midpoint = Math.round(context.peakFinderWindow*.5);

        }
    },
    ondata:(
        context:SubprocessContext,
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
    )=>{

        if(!('red' in data) && !('heg' in data) && !('raw' in data)) return undefined;  //invalid data

        let refdata = data.red ? data.red : data.heg? data.heg : data.raw;

        if(!('timestamp' in data)) { //generate timestamps if none, assuming latest data is at time of the ondata callback
            if(Array.isArray(refdata)) { //assume timestamp
                let now = Date.now();
                let len;
                if(refdata) len = (refdata as number[]).length;
                let toInterp = [now - (refdata as number[]).length*context.sps*1000, now];
                data.timestamp = Math2.upsample(toInterp,(refdata as number[]).length);
            } else {
                data.timestamp = Date.now();
            }
        }

        let pass = (amplitude, timestamp) => {
            if(amplitude) {
                context.refdata.push(amplitude);
            }
            context.timestamp.push(timestamp);

            let beat;
            
            if(context.refdata.length > context.peakFinderWindow) { //we only need to store enough data in a buffer to run the algorithm (to limit buffer overflow)
                context.refdata.shift();
                context.timestamp.shift();
            }


            context.smoothed.push(
                context.lowpass.applyFilter(context.refdata[context.refdata.length - 1])
            );

            if(context.smoothed.length > context.peakFinderWindow) {
                context.smoothed.shift();
            }

        
            if(context.smoothed.length === context.peakFinderWindow) {
                // context.dsmoothed.push(
                //     (   context.refdata[context.refdata.length-1] - 
                //         context.refdata[context.refdata.length-2]   
                //     ) / context.timestamp[context.timestamp[context.timestamp.length-1]]
                // );

                //context.smoothed.indexOf(Math.max(...context.smoothed)) === context.midpoint 
                if(Math2.isExtrema(context.smoothed,'valley')) {
                    context.valleys.push({
                        value:context.smoothed[context.smoothed.length - context.midpoint ? context.midpoint : 1], 
                        timestamp:context.timestamp[context.timestamp.length - context.midpoint ? context.midpoint : 1]
                    });
                } else if (Math2.isExtrema(context.smoothed,'peak')) {
                    context.peaks.push({
                        value:context.smoothed[context.smoothed.length - context.midpoint ? context.midpoint : 1], 
                        timestamp:context.timestamp[context.timestamp.length - context.midpoint ? context.midpoint : 1]
                    });
                }


                if(context.valleys.length > 2 && context.peaks.length > 2) {

                    //if we have 3+ peaks or 3+ valleys in front of the previous peak or valley, we need to shave them off as we are looking for a sine wave (1 peak 1 valley).
                    if(context.valleys[context.valleys.length-1].timestamp < context.peaks[context.peaks.length - 2].timestamp) 
                        context.peaks.splice(context.peaks.length-1);
                    if(context.peaks[context.peaks.length-1].timestamp < context.valleys[context.valleys.length - 2].timestamp) 
                        context.valleys.splice(context.valleys.length-1);

                    context.valley_distances.push({
                        distance:context.valleys[context.valleys.length - 1].timestamp - context.valleys[context.valleys.length - 2].timestamp,
                        timestamp:context.valleys[context.valleys.length - 1].timestamp,
                        peak0:context.valleys[context.valleys.length - 1].value,
                        peak1:context.valleys[context.valleys.length - 2].value
                    });
                
                    context.peak_distances.push({
                        distance:context.peaks[context.peaks.length - 1].timestamp - context.peaks[context.peaks.length - 2].timestamp,
                        timestamp:context.peaks[context.peaks.length - 1].timestamp,
                        peak0:context.peaks[context.peaks.length - 1].value,
                        peak1:context.peaks[context.peaks.length - 2].value
                    });

                    if(context.peak_distances.length > 1 && context.valley_distances.length > 1) {
                        if(context.lastPeak < context.peaks[context.peaks.length-1].timestamp && context.lastValley < context.peaks[context.peaks.length-1].timestamp) {
                            if(context.valley_distances[context.valley_distances.length -1].timestamp > context.peak_distances[context.peak_distances.length-1].timestamp) {
                                let bpm, change = 0;
                                if(context.beats.length < 1) {
                                    bpm = 60/(0.0005 * (context.peak_distances[context.peak_distances.length-1].distance + 
                                        context.valley_distances[context.valley_distances.length-1].distance));
                                    
                                } else if (context.beats[context.beats.length-1].timestamp !== context.peak_distances[context.peak_distances.length-1].timestamp) {
                                    bpm = 60/(0.0005*(context.peak_distances[context.peak_distances.length-1].dt + context.valley_distances[context.valley_distances.length-1].dt));
                                    change = Math.abs(bpm - context.beats[context.beats.length - 1].bpm);
                                }

                                beat = {
                                    timestamp:context.peak_distances[context.peak_distances.length - 1].timestamp, 
                                    change, 
                                    bpm,
                                    height0:context.peak_distances[context.peak_distances.length-1].peak0 - 
                                                context.valley_distances[context.valley_distances.length-1].peak0, 
                                    height1:context.peak_distances[context.peak_distances.length-1].peak1 - 
                                                context.valley_distances[context.valley_distances.length-1].peak1
                                }

                                context.beats.push(beat);

                                context.lastPeak = context.peaks[context.peaks.length-1].timestamp;
                                context.lastValley = context.peaks[context.peaks.length-1].timestamp;
                            } else {
                                let bpm, change = 0;
                                if(context.beats.length < 2) {
                                    bpm = 60/(0.0005*(context.peak_distances[context.peak_distances.length-2].distance + context.valley_distances[context.valley_distances.length-2].distance)); //(averaged peak + valley distance (msec)) * msec/sec * 60sec/min
                                } else if(context.beats[context.beats.length-1].timestamp !== context.peak_distances[context.peak_distances.length-2].timestamp) {
                                    bpm = 60/(0.0005*(context.peak_distances[context.peak_distances.length-2].distance + context.valley_distances[context.valley_distances.length-2].distance));
                                    change = Math.abs(bpm-context.beats[context.beats.length-2].bpm);
                                }

                                beat = {
                                    timestamp:context.peak_distances[context.peak_distances.length-2].timestamp, 
                                    change, 
                                    bpm, 
                                    height0:context.peak_distances[context.peak_distances.length-2].peak0-context.valley_distances[context.valley_distances.length-2].peak0,
                                    height1:context.peak_distances[context.peak_distances.length-2].peak1-context.valley_distances[context.valley_distances.length-2].peak1
                                }

                                context.beats.push(beat);

                                context.lastPeak = context.peaks[context.peaks.length-1].timestamp;
                                context.lastValley = context.peaks[context.peaks.length-1].timestamp;
                            }
                        }
                    }

                    //limits memory usage
                    if(context.peaks.length > context.limit) { context.peaks.shift(); }
                    if(context.valleys.length > context.limit) { context.valleys.shift(); }
                    if(context.peak_distances.length > context.limit) { context.peak_distances.shift(); }
                    if(context.valley_distances.length > context.limit) { context.valley_distances.shift(); }
                    if(context.beats.length > context.limit) { context.beats.shift(); }

                }
            }

            return beat;
        }

        //console.log(context); console.log(data);

        if(data.red) {
            if(('ir' in data) && !Array.isArray(data.red)) return pass((data.red  as number)+(data.ir as number),data.timestamp);

            let result;
            if(data.ir) (data.red as number[]).map((v,i) => { return pass(v+(data as any).ir[i],(data.timestamp as number[])[i]); });
            else (data.red as number[]).map((v,i) => { return pass(v,(data.timestamp as number[])[i]); });
            return result;

        } else if (data.raw) {
            if(!Array.isArray(data.raw)) return pass(data.raw,data.timestamp);
            let result = data.raw.map((v,i) => { return pass(v,(data.timestamp as number[])[i]); });
            return result;
        } else if (Array.isArray(data.heg)) {
            if(!Array.isArray(data.heg)) return pass(data.heg,data.timestamp);
            let result = data.heg.map((v,i) => { return pass(v,(data.timestamp as number[])[i]); });
            return result;

        }
        //returns a beat when one is detected with the latest data passed in, else returns undefined
    }
} as SubprocessContextProps;