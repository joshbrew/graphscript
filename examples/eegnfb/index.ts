//@ts-nocheck

//resources
import { DOMService, SubprocessWorkerInfo } from 'graphscript'//'../../index'////'../../index';
import { initDevice, Devices, gsworker } from '../../../device_debugger/src/device.frontend'//'device-decoder' ////'device-decoder'//'../../../device_debugger/src/device.frontend'//
import { Howl, Howler } from 'howler';
import { visualizeDirectory } from '../../extras/storage/BFS_CSV'


import './index.css'

//types
import { ElementProps, ElementInfo } from 'graphscript/services/dom/types/element';
//import { ComponentProps } from 'graphscript/services/dom/types/component';

//Selectable devices and labels
const selectable = {
    BLE:{
        nrf5x:'nRF5x board',
    },
    BLE_OTHER:{
        muse:'Muse',
        ganglion:'Ganglion'
    },
    USB:{
        cyton:'Open BCI Cyton',
        cyton_daisy:'Open BCI Cyton x2 (daisy chain mode)',
        freeeeg32:'FreeEEG32',
        freeeeg32_optical:'FreeEEG32 optical cable',
        freeeeg128:'FreeEEG128',
        nrf5x:'nRF5x board'
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
                                    for(const key in selectable.BLE_OTHER) { //include both sets
                                        self.innerHTML += `<option value='${key}'>${selectable.BLE_OTHER[key]}</option>`
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

                                        console.log(selected,',',mode,', sps:',Devices[mode][selected].sps)

                                        let info = initDevice(
                                            mode as 'BLE'|'USB', 
                                            selected, 
                                            {
                                                ondecoded: (data:{[key:number]:number|number[]}) => { 
                                                        //data returned from decoder thread, ready for 
                                                        //outputelm.innerText = JSON.stringify(data);
                                                        //console.log(data)
                                                },

                                                routes:{
                                                    buffering: {
                                                        workerUrl:gsworker,
                                                        init:'createSubprocess',
                                                        initArgs:[
                                                            'buffering',
                                                            {
                                                                bufferSize:Devices[mode][selected].sps,
                                                                watch:['0','1','2','3']
                                                            }
                                                        ],
                                                        callback:'runSubprocess',
                                                        children:{
                                                            coherence:{
                                                                workerUrl:gsworker,
                                                                init:'createSubprocess',
                                                                initArgs:[
                                                                    'coherence',
                                                                    {
                                                                        sps:Devices[mode][selected].sps,
                                                                        watch:['0','1','2','3']
                                                                    }
                                                                ],
                                                                callback:'runSubprocess'
                                                            },
                                                            vrms:{
                                                                workerUrl:gsworker,
                                                                init:'createSubprocess',
                                                                initArgs:[
                                                                    'rms',
                                                                    {
                                                                        sps:Devices[mode][selected].sps,
                                                                        watch:['0','1','2','3']
                                                                    }
                                                                ],
                                                                callback:'runSubprocess'
                                                            }
                                                        }
                                                    },
                                                    csv:{
                                                        callback:'appendCSV',
                                                        init:'createCSV',
                                                        initArgs:[`data/${new Date().toISOString()}_${selected}_${mode}.csv`], //filename
                                                        stopped:true //we will press a button to stop/start the csv collection conditionally
                                                    }
                                                },
                                                
                                                // subprocesses:{
                                                //     coherence: {
                                                //         init:'createSubprocess',
                                                //         initArgs:[
                                                //             'buffering', //preprogrammed algorithm
                                                //             {
                                                //                 bufferSize:Devices[mode][selected].sps,
                                                //                 watch:['0','1','2','3']
                                                //             }
                                                //         ],
                                                //         route:'runSubprocess', //the init function will set the _id as an additional argument for runAlgorithm which selects existing contexts by _id 
                                                //         pipeTo:{ //tertiary worker which can run blocking processes while the main subprocess runs separately
                                                //             route:'runSubprocess',
                                                //             init:'createSubprocess',
                                                //             initArgs:[
                                                //                 'coherence',
                                                //                 {
                                                //                     sps:Devices[mode][selected].sps,
                                                //                     watch:['0','1','2','3']
                                                //                 }
                                                //             ]
                                                //         },
                                                //         callback:(output:[number[],number[][],number[][]])=>{
                                                //             console.log('coherence result', output); //this algorithm only returns when it detects a beat
                                                //         }
                                                //         //pipeTo coherence
                                                //     },
                                                //     noise:{ //https://www.electronics-tutorials.ws/accircuits/rms-voltage.html
                                                //         init:'createSubprocess',
                                                //         initArgs:[
                                                //             'buffering', //preprogrammed algorithm
                                                //             {
                                                //                 bufferSize:Devices[mode][selected].sps,
                                                //                 watch:['0','1','2','3']
                                                //             }
                                                //         ],
                                                //         route:'runSubprocess', //the init function will set the _id as an additional argument for runAlgorithm which selects existing contexts by _id 
                                                //         pipeTo:{ //tertiary worker which can run blocking processes while the main subprocess runs separately
                                                //             route:'runSubprocess',
                                                //             init:'createSubprocess',
                                                //             initArgs:[
                                                //                 'vrms',
                                                //                 {
                                                //                     sps:Devices[mode][selected].sps,
                                                //                     watch:['0','1','2','3']
                                                //                 }
                                                //             ]
                                                //         },
                                                //         callback:(output:{[key:string]:number})=>{
                                                //             console.log('vrms result', output); //this algorithm only returns when it detects a beat
                                                //         }
                                                //     },
                                                //     csv:{
                                                //         route:'appendCSV',
                                                //         otherArgs:[`data/${new Date().toISOString()}_${selected}_${mode}.csv`], //filename
                                                //         stopped:true //we will press a button to stop/start the csv collection conditionally
                                                //     }
                                                // }
                                            }
                                        );

                                        if(info) {
                                            info.then((result) => {
                                                console.log('session', result);
                                                let cap;
                                                let csvmenu;
                                                if(typeof result.subprocesses === 'object') {
                                                    if(result.subprocesses.csv as SubprocessWorkerInfo) {
                                                        
                                                        csvmenu = document.getElementById('csvmenu');
                                                        
                                                        cap = document.createElement('button');
                                                        cap.innerHTML = `Record ${selected} (${mode})`;
                                                        cap.onclick = () => {
                                                            //(result.subprocesses.csv as SubprocessWorkerInfo).setArgs([`data/${new Date().toISOString()}_${selected}_${mode}.csv`]);
                                                            (result.subprocesses.csv as SubprocessWorkerInfo).start();
                                                            cap.innerHTML = `Stop recording ${selected} (${mode})`;
                                                            cap.onclick = () => {
                                                                (result.subprocesses.csv as SubprocessWorkerInfo).stop();
                                                                visualizeDirectory('data', csvmenu);
                                                                cap.innerHTML = `Record ${selected} (${mode})`;
                                                            }
                                                        }
        
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
                                                    if(cap) cap.remove();
                                                }
                                                ev.target.parentNode.appendChild(disc);
                                            });
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
                    } as ElementProps,
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
                        animation:function() {
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
                    } as ElementProps,
                    'csvmenu':{
                        tagName:'div',
                        innerHTML:'CSVs',
                        onrender:(self) => {
                            //console.log('rendering html')
                            visualizeDirectory('data', self);
                        }
                    } as ElementProps,
                }
            } as ElementProps
        }
    } as ElementProps
}


const webapp = new DOMService({
    routes:webappHtml
});