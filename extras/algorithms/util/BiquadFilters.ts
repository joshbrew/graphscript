//https://arachnoid.com/phase_locked_loop/resources/biquad_module.py
//Translated to JS by Josh Brewster (MIT License), added BiquadChannelFilterer macros.

export type FilterSettings = {
  sps:number, //required
  useSMA4?:boolean,
  useNotch50?:boolean,
  useNotch60?:boolean,
  useLowpass?: boolean,
  lowpassHz?:number,
  useBandpass?: boolean,
  bandpassLower?:number,
  bandpassUpper?:number,
  useDCBlock?: boolean,
  DCBresonance?: number,
  useScaling?: boolean,
  scalar?:number,
  trimOutliers?:boolean,
  outlierTolerance?:number
}

//Macro for running multiple filter passes over a signal. 
export class BiquadChannelFilterer {

  idx:number; 
  sps:number; 
  bandpassLower?:number; bandpassUpper?:number; 
  useSMA4?:boolean; 
  last4?:number[]; 
  filtered:number; //last sample
  trimOutliers?:boolean;
  outlierTolerance?:number;
  useNotch50?:boolean; 
  useNotch60?:boolean;
  useLowpass?:boolean; 
  lowpassHz?:number;
  useBandpass?:boolean; 
  useDCBlock?:boolean; 
  DCBresonance?:number;
  useScaling?:boolean; 
  scalar?:number; notch50?:any; notch60?:any; lp1?:any; bp1?:any; dcb?:any;

  constructor(
    options:FilterSettings={
      sps:512, //important to be precise!!
      useSMA4:false,
      useNotch50:true,
      useNotch60:true,
      useLowpass: false,
      lowpassHz:100,
      useBandpass: false,
      bandpassLower:3,
      bandpassUpper:45,
      useDCBlock: true,
      DCBresonance:0.995,
      trimOutliers:false,
      outlierTolerance:0.20,
      useScaling: false,
      scalar:1,
    }
  ) {
    this.idx = 0; 
    this.sps = options.sps;
    this.bandpassLower = options.bandpassLower ? options.bandpassLower : 3; 
    this.bandpassUpper = options.bandpassUpper ? options.bandpassUpper : 45;

    this.useSMA4 = options.useSMA4; this.last4=[];
    this.useNotch50 = options.useNotch50; 
    this.useNotch60 = options.useNotch60;
    this.useLowpass = options.useLowpass; 
    this.lowpassHz = options.lowpassHz ? options.lowpassHz : 100;
    this.useBandpass = options.useBandpass;
    this.useDCBlock = options.useDCBlock;
    this.DCBresonance = options.DCBresonance ? options.DCBresonance : 0.995;
    this.useScaling = options.useScaling;
    this.scalar = options.scalar;
    this.trimOutliers = options.trimOutliers;
    this.outlierTolerance = options.outlierTolerance;

    let sps = this.sps;
    this.notch50 = [
                makeNotchFilter(50,sps,2),
                makeNotchFilter(100,sps,2)
            ];
    this.notch60 = [
                makeNotchFilter(60,sps,2),
                makeNotchFilter(120,sps,2)
            ];
    this.lp1 = [
                new Biquad('lowpass', this.lowpassHz, sps),
                new Biquad('lowpass', this.lowpassHz, sps),
                new Biquad('lowpass', this.lowpassHz, sps),
                new Biquad('lowpass', this.lowpassHz, sps)
            ];
    this.bp1 = [
                makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1),
                makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1),
                makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1),
                makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1)
            ];
    this.dcb = new DCBlocker(options.DCBresonance ? options.DCBresonance : 0.995);
  }

  reset(sps=this.sps) {
    this.notch50 = [
                makeNotchFilter(50,sps,2),
                makeNotchFilter(100,sps,2)
            ];
    this.notch60 = [
                makeNotchFilter(60,sps,2),
                makeNotchFilter(120,sps,2)
            ];
      this.lp1 = [
                  new Biquad('lowpass', this.lowpassHz as number, sps),
                  new Biquad('lowpass', this.lowpassHz as number, sps),
                  new Biquad('lowpass', this.lowpassHz as number, sps),
                  new Biquad('lowpass', this.lowpassHz as number, sps)
              ];
      this.bp1 = [
        makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1),
        makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1),
        makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1),
        makeBandpassFilter(this.bandpassLower,this.bandpassUpper,sps,1)
      ];
      this.dcb = new DCBlocker(this.DCBresonance);
  }

  setBandpass(bandpassLower=this.bandpassLower,bandpassUpper=this.bandpassUpper,sps=this.sps) {
      this.bandpassLower=bandpassLower; this.bandpassUpper = bandpassUpper;
      this.bp1 = [
          makeBandpassFilter(bandpassLower,bandpassUpper,sps),
          makeBandpassFilter(bandpassLower,bandpassUpper,sps),
          makeBandpassFilter(bandpassLower,bandpassUpper,sps),
          makeBandpassFilter(bandpassLower,bandpassUpper,sps)
      ];
  }

  apply(
    latestData=0
  ) {
      let out=latestData; 
      if(this.useScaling === true){
          out *= this.scalar as number;
      }
      if(this.filtered && this.trimOutliers && this.outlierTolerance) {
        if(Math.abs(out - this.filtered) > this.outlierTolerance) {
          out = this.filtered; 
        }
      }
      if(this.useDCBlock === true) { //Apply a DC blocking filter
          out = this.dcb.applyFilter(out);
      }
      if(this.useSMA4 === true) { // 4 sample simple moving average (i.e. low pass)
        if(!this.last4) this.last4 = [];

        if(this.last4.length < 4) {
          this.last4.push(out);
        }
        else {
          out = this.last4.reduce((accumulator, currentValue) => accumulator + currentValue)/this.last4.length;
          this.last4.shift();
          this.last4.push(out);
        }
      }
    
      if(this.useNotch50 === true) { //Apply a 50hz notch filter
          this.notch50.forEach((f,i) => {
              out = f.applyFilter(out);
          });
      }
      if(this.useNotch60 === true) { //Apply a 60hz notch filter
          this.notch60.forEach((f,i) => {
              out = f.applyFilter(out);
          });
      } 
      if(this.useLowpass === true) { //Apply 4 50Hz lowpass filters
          this.lp1.forEach((f,i) => {
              out = f.applyFilter(out);
          });
      }
      if(this.useBandpass === true) { //Apply 4 Bandpass filters
          this.bp1.forEach((f,i) => {
              out = f.applyFilter(out);
          });
          out *= this.bp1.length;
      }
      this.filtered = out;
      this.idx++;
      //console.log(this.channel, out)
      return out;
  }
}



export class Biquad {

  type:string;

  freq:number;
  sps:number;
  Q:number;
  dbGain:number;

  a0 = 0;a1 = 0;a2 = 0;
  b0 = 0;b1 = 0;b2 = 0;

  x1 = 0;
  x2 = 0;
  y1 = 0;
  y2 = 0;



  constructor(
    type:'lowpass'|'highpass'|'bandpass'|'notch'|'peak'|'lowshelf'|'highshelf',
    freq:number,
    sps:number,
    Q=1/Math.sqrt(2),
    dbGain=0
  ) {
    let types = ['lowpass','highpass','bandpass','notch','peak','lowshelf','highshelf'];
    if(types.indexOf(type) < 0) { 
      console.error("Valid types: 'lowpass','highpass','bandpass','notch','peak','lowshelf','highshelf'"); 
      return; 
    }
    this.type = type;

    this.freq = freq;
    this.sps = sps;
    this.Q = Q;
    this.dbGain = dbGain;

    let A = Math.pow(10,dbGain/40);
    let omega = 2*Math.PI*freq/sps;
    let sn = Math.sin(omega)
    let cs = Math.cos(omega);
    let alpha = sn/(2*Q);
    let beta = Math.sqrt(A+A);

    this[type](A,sn,cs,alpha,beta);

    //scale constants
    this.b0 /= this.a0;
    this.b1 /= this.a0;
    this.b2 /= this.a0;
    this.a1 /= this.a0;
    this.a2 /= this.a0;
    
  }

  lowpass(A,sn,cs,alpha,beta) { //Stop upper frequencies
    this.b0 = (1-cs)*.5;
    this.b1 = 1-cs;
    this.b2 = (1-cs)*.5;
    this.a0 = 1+alpha;
    this.a1 = -2*cs;
    this.a2 = 1-alpha;
  }

  highpass(A,sn,cs,alpha,beta) { //Stop lower frequencies 
    this.b0 = (1+cs)*.5;
    this.b1 = -(1+cs);
    this.b2 = (1+cs)*.5;
    this.a0 = 1 + alpha;
    this.a1 = -2*cs;
    this.a2 = 1-alpha;
  }

  bandpass(A,sn,cs,alpha,beta) { //Stop lower and upper frequencies. Q = frequency_resonant / Bandwidth(to 3db cutoff line); frequency_resonant = Math.sqrt(f_low * f_high); So for 60Hz with 0.5Hz bandwidth: Fr = Math.sqrt(59.5*60.5). Q = Fr/0.5 = 120;
    this.b0 = alpha;
    this.b1 = 0;
    this.b2 = -alpha;
    this.a0 = 1+alpha;
    this.a1 = -2*cs;
    this.a2 = 1-alpha;
  }

  notch(A,sn,cs,alpha,beta) { //Stop a specific frequency
    this.b0 = 1;
    this.b1 = -2*cs;
    this.b2 = 1;
    this.a0 = 1+alpha;
    this.a1 = -2*cs;
    this.a2 = 1-alpha;
  }

  peak(A,sn,cs,alpha,beta) { //Opposite of a notch filter, stop all but one frequency
    this.b0 = 1+(alpha*A);
    this.b1 = -2*cs;
    this.b2 = 1-(alpha*A);
    this.a0 = 1+(alpha/A);
    this.a1 = -2*cs;
    this.a2 = 1-(alpha/A);
  }

  lowshelf(A,sn,cs,alpha,beta) { //Amplify signals below the cutoff
    this.b0 = A*((A+1) - (A-1)*cs + beta*sn);
    this.b1 = 2*A*((A-1)-(A+1)*cs);
    this.b2 = A*((A+1) - (A-1)*cs - beta*sn);
    this.a0 = (A+1) + (A+1)*cs + beta*sn;
    this.a1 = 2*((A-1) + (A+1)*cs);
    this.a2 = (A+1) + (A-1)*cs - beta*sn;
  }

  highshelf(A,sn,cs,alpha,beta) { //Amplify signals above the cutoff
    this.b0 = A*((A+1) + (A-1)*cs + beta*sn);
    this.b1 = 2*A*((A-1) + (A+1)*cs);
    this.b2 = A*((A+1) - (A-1)*cs - beta*sn);
    this.a0 = (A+1) - (A+1)*cs - beta*sn;
    this.a1 = 2*((A-1) - (A+1)*cs);
    this.a2 = (A+1) - (A-1)*cs - beta*sn;
  }

  applyFilter(signal_step) { //Step the filter forward, return modulated signal amplitude
    let y = this.b0*signal_step + this.b1*this.x1 + this.b2*this.x2 - this.a1*this.y1 - this.a2*this.y2;
    this.x2 = this.x1;
    this.x1 = signal_step;
    this.y2 = this.y1;
    this.y1 = y;
    
    return y;
  }

  zResult(freq) { //This should return the z-transfer function values. Max freq = sps/2
    try{
      let phi = Math.pow((Math.sin(Math.PI*freq*2/(2*this.sps))),2);
      let result = (Math.pow(this.b0+this.b1+this.b2,2) - 
                  4*(this.b0*this.b1+4*this.b0*this.b2 + this.b1*this.b2)*phi + 16*this.b0*this.b2*phi*phi) / 
                  (Math.pow(1+this.a1+this.a2,2) - 4*(this.a1 + 4*this.a2 + this.a1*this.a2)*phi + 16*this.a2*phi*phi)
      return result;
    } catch(err) {
      return -200;
    }
  }

  //Get the center frequency for your bandpass filter
  static calcCenterFrequency(freqStart,freqEnd) {
    return (freqStart+freqEnd) / 2;
  }

  static calcBandwidth(freqStart,freqEnd) {
    return (freqEnd-this.calcCenterFrequency(freqStart,freqEnd));
  }

  //Use for bandpass or peak filter //Q gets sharper as resonance approaches infinity. Set to 500 for example for a more precise filter. Recommended r: Math.floor(Math.log10(frequency))
  static calcBandpassQ (frequency, bandwidth, resonance=Math.pow(10,Math.floor(Math.log10(frequency)))) { //Use Math.sqrt(0.5) for low pass, high pass, and shelf filters
    let Q = resonance*Math.sqrt((frequency-bandwidth)*(frequency+bandwidth))/(2*bandwidth); //tweaked
    return Q;
  }

  static calcNotchQ (frequency, bandwidth, resonance=Math.pow(10,Math.floor(Math.log10(frequency)))) { //Q gets sharper as resonance approaches infinity. Recommended r: Math.floor(Math.log10(frequency))
      let Q = resonance*frequency*bandwidth/Math.sqrt((frequency-bandwidth)*(frequency+bandwidth)); // bw/f
      return Q;
  }

}

export class DCBlocker {

  r:number;
  x1:number;
  x2:number;
  y1:number;
  y2:number;

  constructor(r=0.995) {
    this.r = r;
    this.y1=this.y2=this.x1=this.x2=0;
  }

  applyFilter(signal_step) {
    this.x2=this.x1;
    this.x1 = signal_step
    let y = this.x1 - this.x2 + this.r*this.y1;
    
    this.y2 = this.y1;
    this.y1 = y;
    
    return y;
  }
}
  

/* 

  let notch = new Biquad('notch',60,512,Biquad.calcNotchQ(60,1),0);

  let bandpass = new Biquad('bandpass',
                            Biquad.calcCenterFrequency(3,45),
                            512,
                            Biquad.calcBandpassQ(Biquad.calcCenterFrequency(3,45),Biquad.calcBandwidth(3,45)),
                            0);

*/

//Macros
export const makeNotchFilter = (frequency,sps,bandwidth) => {
  return new Biquad('notch',frequency,sps,Biquad.calcNotchQ(frequency,bandwidth),0);
}

export const makeBandpassFilter = (freqStart,freqEnd,sps,resonance=Math.pow(10,Math.floor(Math.log10(Biquad.calcCenterFrequency(freqStart,freqEnd))))) => {
  return new Biquad('bandpass',
      Biquad.calcCenterFrequency(freqStart,freqEnd),
      sps,
      Biquad.calcBandpassQ(Biquad.calcCenterFrequency(freqStart,freqEnd),Biquad.calcBandwidth(freqStart,freqEnd),resonance),
      0);
}


