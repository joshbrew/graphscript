//@ts-nocheck

//resources
import { Graph, loaders, htmlloader, HTMLNodeProperties } from '../../../index'////'../../index';
import {initDevice, Devices, filterPresets} from '../../../../device_debugger/src/device.frontend'//'device-decoder'//'../../../device_debugger/src/device.frontend'//'device-decoder' ////'device-decoder'//'../../../device_debugger/src/device.frontend'//
import gsworker from '../../../../device_debugger/src/stream.big.worker'
import { Howl, Howler } from 'howler';
import { visualizeDirectory } from '../../../src/extras/storage/BFS_CSV'//'../../extras/storage/BFS_CSV'


import './index.css'

//types
//import { ComponentProps } from 'graphscript/services/dom/types/component';

//Selectable devices and labels
const selectable = {
    BLE:{
        hegduino:'HEGduino (BLE)',
        hegduinoV1:'HEGduino V1 (USB)',
        blueberry2:'Blueberry (BLE)',
        blueberry:'Blueberry_Legacy (BLE)'
    },
    USB:{
        peanut:'Biocomp Peanut HEG (USB)',
        hegduino:'HEGduino (USB)',
        hegduinoV1:'HEGduino V1 (USB)'
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
        __children:{
            'devices':{
                tagName:'div',
                __children:{
                    'devicediv':{
                        tagName:'div',
                        __children:{
                            'connectheader':{
                                tagName:'h4',
                                innerHTML:'Connect to an HEG device'
                            } as HTMLNodeProperties,
                            'connectmode':{
                                tagName:'select',
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
                            } as HTMLNodeProperties,
                            'selectUSB':{
                                tagName:'select',
                                style:{display:'none'},
                                __onrender:(self)=>{                      
                                    for(const key in selectable.USB) {
                                        self.innerHTML += `<option value='${key}'>${selectable.USB[key]}</option>`
                                    }
                                }
                            } as HTMLNodeProperties,
                            'selectBLE':{
                                tagName:'select',
                                __onrender:(self)=>{                      
                                    for(const key in selectable.BLE) {
                                        self.innerHTML += `<option value='${key}'>${selectable.BLE[key]}</option>`
                                    }
                                }
                            } as HTMLNodeProperties,
                            'connectDevice':{
                                tagName:'button',
                                innerHTML:'Connect Device',
                                onclick:(ev)=>{

                                    //let outputelm = document.getElementById('raw') as HTMLDivElement;

                                    let mode = (document.getElementById('connectmode') as HTMLSelectElement).value;
                                    let selected;
                                    if(mode === 'BLE')
                                        selected = (document.getElementById('selectBLE') as HTMLSelectElement).value;
                                    else if (mode === 'USB') 
                                        selected = (document.getElementById('selectUSB') as HTMLSelectElement).value;

                                    console.log(selected,',',mode,', sps:',Devices[mode][selected].sps)

                                    let info = initDevice(
                                        Devices[mode][selected],
                                        {
                                            ondecoded:
                                                (data:{
                                                    red:number|number[], 
                                                    ir:number|number[], 
                                                    heg:number|number[], 
                                                    timestamp:number|number[]
                                                }) => { //data returned from decoder thread, ready for 
                                                    //outputelm.innerText = JSON.stringify(data);
                                                    //console.log(data)
    
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
                                            roots:{ //top level routes subscribe to device output thread directly (and workers in top level routes will not use main thread)
                                                hr: {
                                                    workerUrl:gsworker,
                                                    init:'createSubprocess',
                                                    initArgs:[
                                                        'heartrate', //preprogrammed algorithm
                                                        {
                                                            sps:Devices[mode][selected].sps
                                                        }
                                                    ],
                                                    callback:'runSubprocess', //the init function will set the _id as an additional argument for runSubprocess which selects existing contexts by _id 
                                                    __children:{
                                                        hr_main:{
                                                            __operator:(
                                                                heartbeat:{
                                                                    bpm: number,
                                                                    change: number, //i.e. HRV
                                                                    height0: number,
                                                                    height1: number,
                                                                    timestamp: number
                                                                }
                                                            )=>{
                                                                console.log('heartrate result', heartbeat); //this algorithm only returns when it detects a beat
                                                            }
                                                        }
                                                    }
                                                },
                                                breath:{
                                                    workerUrl:gsworker,
                                                    init:'createSubprocess',
                                                    initArgs:[
                                                        'breath',
                                                        {
                                                            sps:Devices[mode][selected].sps
                                                        }
                                                    ],
                                                    callback:'runSubprocess',
                                                    __children:{
                                                        breath_main:{
                                                            __operator:(
                                                                breath:{
                                                                    bpm: number,
                                                                    change: number,
                                                                    height0: number,
                                                                    height1: number,
                                                                    timestamp: number
                                                                }
                                                            )=>{
                                                                console.log('breath detect result', breath); //this algorithm only returns when it detects a beat
                                                            }
                                                        }
                                                    }
                                                },
                                                csv:{
                                                    workerUrl:gsworker,
                                                    // init:'createCSV',
                                                    // initArgs:[`data/${new Date().toISOString()}_${selected}_${mode}.csv`],
                                                    callback:'appendCSV',
                                                    stopped:true //we will press a button to stop/start the csv collection conditionally
                                                }
                                            }
                                        }
                                    );
                                    

                                    if(info) {
                                        info.then((result) => {
                                            console.log('session', result);

                                            if(filterPresets[selected]) { //enable filters, which are customizable biquad filters and other
                                                //console.log(filterPresets[selected]);
                                                result.workers.streamworker.post(
                                                    'setFilters', 
                                                    filterPresets[selected] as {[key:string]:FilterSettings}
                                                );
                                            }

                                            let cap;
                                            let csvmenu;
                                            if(typeof result.routes === 'object') {
                                                if(result.routes.csv) {
                                                    
                                                    csvmenu = document.getElementById('csvmenu');
                                                    
                                                    cap = document.createElement('button');
                                                    cap.innerHTML = `Record ${selected} (${mode})`;
                                                    let onclick = () => {
                                                        result.routes.csv.worker.post(
                                                            'createCSV',
                                                            [
                                                                `data/${new Date().toISOString()}_${selected}_${mode}.csv`,
                                                                ['timestamp','heg','red','ir']
                                                            ]);
                                                        result.routes.csv.worker.start();
                                                        cap.innerHTML = `Stop recording ${selected} (${mode})`;
                                                        cap.onclick = () => {
                                                            result.routes.csv.worker.stop();
                                                            visualizeDirectory('data', csvmenu);
                                                            cap.innerHTML = `Record ${selected} (${mode})`;
                                                            cap.onclick = onclick;
                                                        }
                                                    }

                                                    cap.onclick = onclick;
    
                                                    ev.target.parentNode.appendChild(cap);
                                                }
                                            }

                                            result.options.ondisconnect = () => { visualizeDirectory('data',csvmenu); }

                                            //console.log(result);
                                            let disc = document.createElement('button');
                                            disc.innerHTML = `Disconnect ${selected} (${mode})`;
                                            disc.onclick = () => {
                                                result.disconnect();
                                                disc.remove();
                                                //if(cap) cap.remove();
                                            }
                                            ev.target.parentNode.appendChild(disc);
                                        });
                                    }
                                }
                                
                            } as HTMLNodeProperties
                        }
                    }
                }
            },
            'output':{
                tagName:'div',
                __children:{
                    'playsounds':{
                        tagName:'div',
                        __children:{
                            'soundheader':{
                                tagName:'h4',
                                innerHTML:'Play a sound to modulate with the HEG'
                            } as HTMLNodeProperties,
                            'soundDropdown':{
                                tagName:'select',
                                innerHTML:soundFilePaths.map((p) => `<option value='${p}'>${p}</option>`)
                            } as HTMLNodeProperties,
                            'play':{
                                tagName:'button',
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
                            } as HTMLNodeProperties,
                            'stop':{
                                tagName:'button',
                                onclick:(ev)=>{
                                    if(GameState.playing){
                                        GameState.playing.stop();
                                        GameState.playing = undefined;
                                    }
                                },
                                innerText:'Stop'
                            } as HTMLNodeProperties
                        }
                    } as HTMLNodeProperties,
                    'stats':{
                        tagName:'table',
                        __animation:function(){
                            if(!this.innerHTML || GameState.currentTimestamp !== GameState.lastTimestamp){
                                this.innerHTML = `
                                STATS:
                                <tr> <th>Timestamp: </th><td>${new Date(GameState.currentTimestamp).toISOString()}</td> </tr>
                                <tr> <th>Current: </th><td>${GameState.currentHEG?.toFixed(2)}</td> </tr>
                                <tr> <th>Baseline: </th><td>${GameState.baselineHEG?.toFixed(2)}</td> </tr>
                                <tr> <th>Fast Change: </th><td>${GameState.baselineHEG ? (100*GameState.shortChange/GameState.baselineHEG)?.toFixed(2) : 0}%</td> </tr>
                                <tr> <th>Slow Change: </th><td>${GameState.baselineHEG ? (100*GameState.longChange/GameState.baselineHEG)?.toFixed(2): 0}%</td> </tr>
                                `
                            }
                        },
                    } as HTMLNodeProperties,
                    'resetstats':{
                        tagName:'button',
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
                    } as HTMLNodeProperties,
                    'waveform':{
                        tagName:'canvas',
                        style:{width:'100vw', height:'300px'},
                        __onrender:function (canvas:HTMLCanvasElement,info:ElementInfo) { 
                            canvas.width = canvas.clientWidth;
                            canvas.height = canvas.clientHeight;

                            let ctx = canvas.getContext('2d');

                            this.canvas = canvas;
                            this.ctx = ctx;

                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        },
                        __animation:function() {
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
                    } as HTMLNodeProperties,
                    'csvmenu':{
                        tagName:'div',
                        innerHTML:'CSVs',
                        __onrender:(self) => {
                            //console.log('rendering html')
                            visualizeDirectory('data', self);
                        }
                    } as HTMLNodeProperties,
                }
            } as HTMLNodeProperties
        }
    } as HTMLNodeProperties
} 



const webapp = new Graph({
    roots:webappHtml,
    loaders:{...loaders,htmlloader}
});

