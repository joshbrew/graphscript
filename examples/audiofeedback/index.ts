//@ts-nocheck

//resources
import { DOMService } from 'graphscript'//'../../index';
import {initDevice, Devices} from 'device-decoder'
import { Howl, Howler } from 'howler';


import './index.css'

//types
import { ElementProps, ElementInfo } from 'graphscript/services/dom/types/element';
//import { ComponentProps } from 'graphscript/services/dom/types/component';

//Selectable devices and labels
const selectable = {
    BLE:{
        hegduino:'HEGduino (BLE)',
        blueberry2:'Blueberry (BLE)',
        blueberry:'Blueberry_Legacy (BLE)'
    },
    USB:{
        peanut:'Biocomp Peanut HEG (USB)',
        hegduino:'HEGduino (USB)'
    }
}


const soundFilePaths = [
    './src/assets/kalimba.wav',
    './src/assets/phonk.wav',
    './src/assets/synthflute.wav'
];

const GameState = {
    baselineHEG:0,
    currentHEG:0,
    shortChange:0,
    longChange:0,
    currentTimestamp:Date.now(),
    lastTimestamp:Date.now(),
    dataFrameTime:0,
    raw:undefined,
    hegDataBuffer:new Array(512).fill(0),
    localMax:0,

    playing:undefined as Howl,
    analyser:undefined,
    audioFFTBuffer:new Uint8Array(2048), //default fft size
}

//start of your web page
const webappHtml = {
    'app':{
        tagName:'div',
        children:{
            'devices':{
                tagName:'div',
                children:{
                    'devicediv':{
                        tagName:'div',
                        children:{
                            'connectheader':{
                                tagName:'h4',
                                innerHTML:'Connect to an HEG device'
                            } as ElementProps,
                            'connectmode':{
                                tagName:'select',
                                attributes:{
                                    innerHTML:`
                                        <option value='BLE' selected>BLE</option>
                                        <option value='USB'>USB</option>
                                    `,
                                    onchange:(ev)=>{
                                        if(ev.target.value === 'BLE') {
                                            ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
                                            ev.target.parentNode.querySelector('#selectBLE').style.display = '';
                                        }
                                        else if(ev.target.value === 'USB') {
                                            ev.target.parentNode.querySelector('#selectUSB').style.display = '';
                                            ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
                                        }
                                    }
                                }
                            } as ElementProps,
                            'selectUSB':{
                                tagName:'select',
                                style:{display:'none'},
                                onrender:(self)=>{                      
                                    for(const key in selectable.USB) {
                                        self.innerHTML += `<option value='${key}'>${selectable.USB[key]}</option>`
                                    }
                                }
                            } as ElementProps,
                            'selectBLE':{
                                tagName:'select',
                                onrender:(self)=>{                      
                                    for(const key in selectable.BLE) {
                                        self.innerHTML += `<option value='${key}'>${selectable.BLE[key]}</option>`
                                    }
                                }
                            } as ElementProps,
                            'connectDevice':{
                                tagName:'button',
                                attributes:{
                                    innerHTML:'Connect Device',
                                    onclick:(ev)=>{

                                        //let outputelm = document.getElementById('raw') as HTMLDivElement;

                                        let mode = (document.getElementById('connectmode') as HTMLSelectElement).value;
                                        let selected;
                                        if(mode === 'BLE')
                                            selected = (document.getElementById('selectBLE') as HTMLSelectElement).value;
                                        else if (mode === 'USB') 
                                            selected = (document.getElementById('selectUSB') as HTMLSelectElement).value;

                                        let info = initDevice(
                                            mode as 'BLE'|'USB', 
                                            selected, 
                                            {
                                                ondecoded:
                                                    (data:{
                                                        red:number|number[], 
                                                        ir:number|number[], 
                                                        heg:number|number[], 
                                                        timestamp:number|number[]
                                                    }) => { //data returned from decoder thread, ready for 
                                                        //outputelm.innerText = JSON.stringify(data);
                                                        console.log(data)
        
                                                        GameState.raw = data;
        
                                                        if(data.heg) {
                                                            let heg = Array.isArray(data.heg) ? data.heg[data.heg.length-1] : data.heg;
                                                            GameState.currentHEG = heg;
                                                            GameState.lastTimestamp = GameState.currentTimestamp;
        
                                                            GameState.currentTimestamp = Array.isArray(data.timestamp) ? data.timestamp[data.timestamp.length-1] : data.timestamp;
                                                            
                                                            GameState.dataFrameTime = GameState.currentTimestamp - GameState.lastTimestamp; 
        
                                                            if(!GameState.baselineHEG) 
                                                                GameState.baselineHEG = heg; //first HEG sample
                                                            else {
                                                                GameState.shortChange = (GameState.baselineHEG * 0.10 + heg*0.9) - GameState.baselineHEG;
                                                                GameState.longChange = (GameState.baselineHEG * 0.99 +heg*0.01) - GameState.baselineHEG; 
                                                                GameState.baselineHEG = GameState.baselineHEG * 0.9999 + heg*0.0001; //have the baseline shift slowly (10000 samples)
        
                                                                let newLocalMax = false;
                                                                if(heg > GameState.localMax) {
                                                                    GameState.localMax = heg;
                                                                    newLocalMax = true;
                                                                }
                                                                let shifted = GameState.hegDataBuffer.shift(); 
                                                                GameState.hegDataBuffer.push(heg);
                                                                if(GameState.localMax === shifted && !newLocalMax) {
                                                                    GameState.localMax = Math.max(...GameState.hegDataBuffer);
                                                                }
        
                                                                if(GameState.playing) {
                                                                    let newVol = GameState.playing.volume() + GameState.longChange/GameState.baselineHEG;
                                                                    if(newVol < 0) newVol = 0;
                                                                    if(newVol > 1) newVol = 1;
                                                                    GameState.playing.volume(newVol);
                                                                }
                                                            }
                                                            //if(data.red)
                                                            //if(data.ir)
                                                            //if(data.timestamp)
                                                        }
                                                },
                                                subprocesses:{
                                                    hr: {
                                                        init:'createAlgorithmContext',
                                                        initArgs:[
                                                            'heartrate', //preprogrammed algorithm
                                                            {
                                                                sps:Devices[mode][selected].sps
                                                            }
                                                        ],
                                                        route:'runAlgorithm', //the init function will set the _id as an additional argument for runAlgorithm which selects existing contexts by _id 
                                                        callback:(heartbeat)=>{
                                                            console.log('heartrate result', heartbeat); //this algorithm only returns when it detects a beat
                                                        }
                                                    },
                                                    breath:{
                                                        init:'createAlgorithmContext',
                                                        initArgs:[
                                                            'breath',
                                                            {
                                                                sps:Devices[mode][selected].sps
                                                            }
                                                        ],
                                                        route:'runAlgorithm',
                                                        callback:(breath)=>{
                                                            console.log('breath detect result', breath); //this algorithm only returns when it detects a beat
                                                        }
                                                    }
                                                }
                                            }
                                        );

                                        if(info) {
                                            info.then((result) => {
                                                console.log(result);
                                                let disc = document.createElement('button');
                                                disc.innerHTML = `Disconnect ${selected} (${mode})`;
                                                disc.onclick = () => {
                                                    result.disconnect();
                                                    disc.remove();
                                                }
                                                ev.target.parentNode.appendChild(disc);
                                            })
                                        }
                                    }
                                }
                            } as ElementProps
                        }
                    }
                }
            },
            'output':{
                tagName:'div',
                children:{
                    'playsounds':{
                        tagName:'div',
                        children:{
                            'soundheader':{
                                tagName:'h4',
                                innerHTML:'Play a sound to modulate with the HEG'
                            } as ElementProps,
                            'soundDropdown':{
                                tagName:'select',
                                innerHTML:soundFilePaths.map((p) => `<option value='${p}'>${p}</option>`)
                            } as ElementProps,
                            'play':{
                                tagName:'button',
                                attributes:{
                                    onclick:(ev)=>{
                                        //ev.target.parentNode.querySelector('#soundDropdown')
                                        if(GameState.playing) {
                                            GameState.playing.stop()
                                            GameState.playing = undefined;
                                        }

                                        GameState.playing = new Howl({
                                            src:(document.getElementById('soundDropdown') as HTMLSelectElement).value,
                                            loop:true,
                                            autoplay:true,
                                            volume:0.5,
                                            onend:()=>{},
                                            onplay:()=>{},
                                            onload:()=>{
                                                GameState.analyser = Howler.ctx.createAnalyser();
                                                Howler.masterGain.connect(GameState.analyser);
                                                GameState.analyser.connect(Howler.ctx.destination);
                                            }
                                        });
                                    },
                                    innerText:'Play'
                                }
                            } as ElementProps,
                            'stop':{
                                tagName:'button',
                                attributes:{
                                    onclick:(ev)=>{
                                        if(GameState.playing){
                                            GameState.playing.stop();
                                            GameState.playing = undefined;
                                        }
                                    },
                                    innerText:'Stop'
                                }
                            } as ElementProps
                        }
                    } as ElementProps,
                    'stats':{
                        tagName:'table',
                        animation:function(){
                            if(!this.element.innerHTML || GameState.currentTimestamp !== GameState.lastTimestamp){
                                this.element.innerHTML = `
                                STATS:
                                <tr> <th>Timestamp: </th><td>${new Date(GameState.currentTimestamp).toISOString()}</td> </tr>
                                <tr> <th>Current: </th><td>${GameState.currentHEG?.toFixed(2)}</td> </tr>
                                <tr> <th>Baseline: </th><td>${GameState.baselineHEG?.toFixed(2)}</td> </tr>
                                <tr> <th>Fast Change: </th><td>${GameState.baselineHEG ? (100*GameState.shortChange/GameState.baselineHEG)?.toFixed(2) : 0}%</td> </tr>
                                <tr> <th>Slow Change: </th><td>${GameState.baselineHEG ? (100*GameState.longChange/GameState.baselineHEG)?.toFixed(2): 0}%</td> </tr>
                                `
                            }
                        },
                    } as ElementProps,
                    'resetstats':{
                        tagName:'button',
                        attributes:{
                            onclick:() => {
                                Object.assign(GameState,{
                                    baselineHEG:0,
                                    currentHEG:0,
                                    shortChange:0,
                                    longChange:0,
                                    currentTimestamp:Date.now(),
                                    lastTimestamp:Date.now(),
                                    dataFrameTime:0,
                                    raw:undefined,
                                    hegDataBuffer:new Array(512).fill(0),
                                    localMax:0,
                                })
                            },
                            innerText:'Reset stats'
                        }
                    },
                    'waveform':{
                        tagName:'canvas',
                        style:{width:'100vw', height:'300px'},
                        onrender:function (canvas:HTMLCanvasElement,info:ElementInfo) { 
                            canvas.width = canvas.clientWidth;
                            canvas.height = canvas.clientHeight;

                            let ctx = canvas.getContext('2d');

                            this.canvas = canvas;
                            this.ctx = ctx;

                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        },
                        animation:function(){
                            //this = node, this.element = element

                            this.ctx.fillStyle = '#000';
                            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                            this.ctx.lineWidth = 2;
                                
                            this.ctx.strokeStyle = 'limegreen'
                            this.ctx.beginPath();

                            let sliceWidth = (this.canvas.width * 1.0) / 512;
                            let x = 0;
    
                            for (let i = 0; i < 512; i++) {
                                let v = 1 - GameState.hegDataBuffer[i] / GameState.localMax;
                                let y = (v * this.canvas.height + this.canvas.height)*0.5;

                                if (i === 0) {
                                    this.ctx.moveTo(x, y)
                                } else {
                                    this.ctx.lineTo(x, y)
                                }

                                x += sliceWidth;
                            }

                            this.ctx.lineTo(this.canvas.width, this.canvas.height )
                            this.ctx.stroke()

                            if(GameState.analyser) {
                                GameState.analyser.getByteFrequencyData(GameState.audioFFTBuffer);
                                //console.log(GameState.audioFFTBuffer);
                               
                                this.ctx.strokeStyle = 'royalblue'
                                this.ctx.beginPath()
    
                                x = 0
    
                                for (let i = 0; i < 512; i++) {
                                    let v = GameState.audioFFTBuffer[i] / 255.0
                                    let y = (this.canvas.height - v * this.canvas.height) 
    
                                    if (i === 0) {
                                        this.ctx.moveTo(x, y)
                                    } else {
                                        this.ctx.lineTo(x, y)
                                    }
    
                                    x += sliceWidth;
                                }
    
                                this.ctx.lineTo(this.canvas.width, this.canvas.height )
                                this.ctx.stroke();

                               
                            }
                        }
                    }
                }
            } as ElementProps
        }
    } as ElementProps
}


const webapp = new DOMService({
    routes:webappHtml
});