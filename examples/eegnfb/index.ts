//@ts-nocheck

//resources
import { DOMService, WorkerCanvas } from 'graphscript/';//'../../index'////'../../index';
import { initDevice, workers, filterPresets, FilterSettings, chartSettings } from 'device-decoder';//'../../../device_debugger/src/device.frontend'//'device-decoder' ////'device-decoder'//'../../../device_debugger/src/device.frontend'//


import { setSignalControls } from 'device-decoder/webglplot.routes'

import gsworker from 'device-decoder/stream.big.worker' //device-decoder/stream.big.worker';
import { Devices } from 'device-decoder.third-party'

import { Howl, Howler } from 'howler';
import { visualizeDirectory } from 'graphscript-services/storage/BFS_CSV';


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
    currentTimestamp:Date.now(),
    lastTimestamp:Date.now(),
    eegDataBuffers:{},

    playing:undefined as Howl,
    analyser:undefined,
    audioFFTBuffer:new Uint8Array(2048), //default fft size
}


const webapp = new DOMService();
webapp.load(workers); //merge the worker service provided by device-decoder for convenience

let transferred = false; //did we transfer a canvas already

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
                                innerHTML:'Connect to an EEG device'
                            } as ElementProps,
                            'connectmode':{
                                tagName:'select',
                                attributes:{
                                    innerHTML:`
                                        <option value='BLE' selected>BLE</option>
                                        <option value='BLE_OTHER'>BLE (Third Party Drivers)</option>
                                        <option value='USB'>USB</option>
                                    `,
                                    onchange:(ev)=>{
                                        if(ev.target.value === 'BLE') {
                                            ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
                                            ev.target.parentNode.querySelector('#selectBLE').style.display = '';
                                            ev.target.parentNode.querySelector('#selectBLEOther').style.display = 'none';
                                        }
                                        else if(ev.target.value === 'USB') {
                                            ev.target.parentNode.querySelector('#selectUSB').style.display = '';
                                            ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
                                            ev.target.parentNode.querySelector('#selectBLEOther').style.display = 'none';
                                        }
                                        else if(ev.target.value === 'BLE_OTHER') {
                                            ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
                                            ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
                                            ev.target.parentNode.querySelector('#selectBLEOther').style.display = '';
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
                            'selectBLEOther':{
                                tagName:'select',
                                style:{display:'none'},
                                onrender:(self)=>{                    
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
                                        else if (mode === 'BLE_OTHER') 
                                            selected = (document.getElementById('selectBLEOther') as HTMLSelectElement).value;

                                        console.log(selected,',',mode,', sps:', Devices[mode][selected].sps)

                                        let info = initDevice(
                                            mode as 'BLE'|'USB'|'BLE_OTHER'|'USB_OTHER'|'OTHER', 
                                            selected, 
                                            {
                                                workerUrl:gsworker,
                                                ondecoded: (data:{[key:number]:number|number[]}) => { 
                                                    //data returned from decoder thread, ready for 
                                                    //outputelm.innerText = JSON.stringify(data);
                                                    //console.log(data)
                                                },

                                                routes:{ //top level routes subscribe to device output thread directly (and workers in top level routes will not use main thread)
                                                    renderer: {
                                                        workerUrl:gsworker,
                                                        callback:'updateCanvas', //will pipe data to the canvas animation living alone on this thread
                                                        oncreate:(self) => {
                                                            //console.log(self,webapp);
                                                            if(transferred) {
                                                                let newCanvas = document.createElement('canvas');
                                                                newCanvas.id = 'waveform';
                                                                newCanvas.style.width = '100%';
                                                                newCanvas.style.height = '300px';
                                                                let node = document.getElementById('waveform');
                                                                let newOCanvas = document.createElement('canvas');
                                                                newOCanvas.id = 'waveformoverlay';
                                                                newOCanvas.style.width = '100%';
                                                                newOCanvas.style.height = '300px';
                                                                newOCanvas.style.transform = 'translateY(-300px)';
                                                                let node2 = document.getElementById('waveformoverlay');
                                                                let parentNode;
                                                                if(node) {
                                                                    parentNode = node.parentNode;
                                                                    node.remove();
                                                                    node2?.remove();
                                                                }
                                                                else parentNode = document.getElementById('output');
                                                                parentNode.appendChild(newCanvas); //now transferrable again
                                                                parentNode.appendChild(newOCanvas);
                                                            }

                                                            let canvas = document.getElementById('waveform');
                                                            let overlay = document.getElementById('waveformoverlay').transferControlToOffscreen();

                                                            if(chartSettings[selected]) {
                                                                console.log(chartSettings[selected])
                                                                self.worker.post('setValue',['chartSettings',chartSettings[selected]])
                                                            } 

                                                            webapp.run(
                                                                'worker.transferCanvas', 
                                                                self.worker.worker,
                                                                {
                                                                    canvas,
                                                                    context:undefined,
                                                                    _id:'waveform',
                                                                    overlay,
                                                                    transfer:[overlay],
                                                                    init:(self:WorkerCanvas, canvas, context) => {
                                                                        //console.log('init', globalThis.Devices);

                                                                        let settings = {
                                                                            canvas,
                                                                            _id:self._id,
                                                                            overlay:self.overlay,
                                                                            width:canvas.clientWidth,
                                                                            height:canvas.clientHeight,
                                                                            lines:{
                                                                                '0':{nSec:10, sps: 250}, //{nPoints:1000}
                                                                                '1':{nSec:10, sps: 250},
                                                                                '2':{nSec:10, sps: 250},
                                                                                '3':{nSec:10, sps: 250}
                                                                            },
                                                                            useOverlay:true,
                                                                        };

                                                                        if(self.graph.chartSettings) Object.assign(settings,self.graph.chartSettings);

                                                                        let r = self.graph.run('setupChart', settings);
                                                                    },
                                                                    update:(
                                                                        self:WorkerCanvas,
                                                                        canvas,
                                                                        context,
                                                                        data:{[key:string]:number|number[]}
                                                                    )=>{
                                                                        self.graph.run('updateChartData', 'waveform', data);
                                                                    },
                                                                    //draw:()=>{},
                                                                    clear:(
                                                                        self:WorkerCanvas,
                                                                        canvas,
                                                                        context
                                                                    ) => {
                                                                        self.graph.run('clearChart','waveform');
                                                                    }
                                                            });
                                                            transferred = true;
                                                        }

                                                        //webapp.run('worker.updateChartData')
                                                    },
                                                    buffering: {
                                                        workerUrl:gsworker,
                                                        init:'createSubprocess',
                                                        initArgs:[
                                                            'circularBuffer2d',
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
                                                                        tags:['0','1','2','3'] //we can name the fft tags coming in from the watched buffer
                                                                    }
                                                                ],
                                                                callback:'runSubprocess',
                                                                blocking:true,
                                                                children:{
                                                                    coherence_main:{
                                                                        operator:(result:any)=>{
                                                                            console.log('coherence result', result); //this algorithm only returns when it detects a beat
                                                                        }
                                                                    },
                                                                    crenderer: {
                                                                        workerUrl:gsworker,
                                                                        callback:'updateCanvas', //will pipe data to the canvas animation living alone on this thread
                                                                        oncreate:(self) => {
                                                                            //console.log(self,webapp);
                                                                            if(transferred) {
                                                                                let newCanvas = document.createElement('canvas');
                                                                                newCanvas.id = 'dftwaveform';
                                                                                newCanvas.style.width = '100%';
                                                                                newCanvas.style.height = '300px';
                                                                                let node = document.getElementById('dftwaveform');
                                                                                let newOCanvas = document.createElement('canvas');
                                                                                newOCanvas.id = 'dftwaveformoverlay';
                                                                                newOCanvas.style.width = '100%';
                                                                                newOCanvas.style.height = '300px';
                                                                                newOCanvas.style.transform = 'translateY(-300px)';
                                                                                let node2 = document.getElementById('dftwaveformoverlay');
                                                                                let parentNode;
                                                                                if(node) {
                                                                                    parentNode = node.parentNode;
                                                                                    node.remove();
                                                                                    node2?.remove();
                                                                                }
                                                                                else parentNode = document.getElementById('output');
                                                                                parentNode.appendChild(newCanvas); //now transferrable again
                                                                                parentNode.appendChild(newOCanvas);
                                                                            }
                
                                                                            let canvas = document.getElementById('dftwaveform');
                                                                            let overlay = document.getElementById('dftwaveformoverlay').transferControlToOffscreen();
                
                                                                            // if(chartSettings[selected]) {
                                                                            //     console.log(chartSettings[selected])
                                                                            //     self.worker.post('setValue',['chartSettings',chartSettings[selected]])
                                                                            // } 
                
                                                                            webapp.run(
                                                                                'worker.transferCanvas', 
                                                                                self.worker.worker,
                                                                                {
                                                                                    canvas,
                                                                                    context:undefined,
                                                                                    _id:'dftwaveform',
                                                                                    overlay,
                                                                                    transfer:[overlay],
                                                                                    init:(self:WorkerCanvas, canvas, context) => {
                                                                                        //console.log('init', globalThis.Devices);
                
                                                                                        let settings = {
                                                                                            canvas,
                                                                                            _id:self._id,
                                                                                            overlay:self.overlay,
                                                                                            width:canvas.clientWidth,
                                                                                            height:canvas.clientHeight,
                                                                                            lines:{
                                                                                                '0_1':{nPoints: 250}, //{nPoints:1000}
                                                                                                '0_2':{nPoints: 250},
                                                                                                '0_3':{nPoints: 250},
                                                                                                '1_2':{nPoints: 250},
                                                                                                '1_3':{nPoints: 250},
                                                                                                '2_3':{nPoints: 250}
                                                                                            },
                                                                                            useOverlay:true,
                                                                                        };
                
                                                                                        if(self.graph.chartSettings) Object.assign(settings,self.graph.chartSettings);
                
                                                                                        let r = self.graph.run('setupChart', settings);
                                                                                    },
                                                                                    update:(
                                                                                        self:WorkerCanvas,
                                                                                        canvas,
                                                                                        context,
                                                                                        data:{[key:string]:number|number[]}
                                                                                    )=>{
                                                                                        self.graph.run('updateChartData', 'dftwaveform', data.coherence);
                                                                                    },
                                                                                    //draw:()=>{},
                                                                                    clear:(
                                                                                        self:WorkerCanvas,
                                                                                        canvas,
                                                                                        context
                                                                                    ) => {
                                                                                        self.graph.run('clearChart','dftwaveform');
                                                                                    }
                                                                            });
                                                                            transferred = true;
                                                                        }
                
                                                                        //webapp.run('worker.updateChartData')
                                                                    },
                                                                }
                                                            },
                                                        }
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
                                                        callback:'runSubprocess',
                                                        blocking:true,
                                                        children:{
                                                            vrms_main:{
                                                                operator:(
                                                                    result:any
                                                                )=>{
                                                                    //console.log('vrms result', result); //this algorithm only returns when it detects a beat
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
                                                },
                                                
                                            }
                                        );

                                        if(info) {
                                            info.then((result) => {
                                                console.log('session', result);

                                                if(filterPresets[selected]) { //enable filters, which are customizable biquad filters
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
                                                                    ['timestamp','0','1','2','3','4','5','6','7']
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
                                                        
                                                        document.getElementById('waveformoverlay').onmouseover = async (ev) => {
                                                            await setSignalControls(
                                                                document.getElementById('waveformcontrols'),
                                                                'waveform',
                                                                result.workers.streamworker,
                                                                result.routes.renderer.worker 
                                                            )
                                                            document.getElementById('waveformcontrols').style.display = '';
                                                        }


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
                                innerHTML:'Play a sound to modulate with the EEG'
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
                    'waveform':{
                        tagName:'canvas',
                        style:{width:'100%', height:'300px'},
                    } as ElementProps,
                    'waveformoverlay':{
                        tagName:'canvas',
                        style:{width:'100%', height:'300px', transform:'translateY(-300px)'},
                    } as ElementProps,
                    'waveformcontrols':{
                        tagName:'table',
                        style:{display:'none', width:'100%', height:'300px', transform:'translateY(-600px)'},
                        attributes: {
                            className:'chartcontrols',
                            onmouseleave:(ev) => {
                                document.getElementById('waveformcontrols').style.display = 'none';
                            }
                        },
                    } as ElementProps,
                    'dftwaveform':{
                        tagName:'canvas',
                        style:{width:'100%', height:'300px'},
                    } as ElementProps,
                    'dftwaveformoverlay':{
                        tagName:'canvas',
                        style:{width:'100%', height:'300px', transform:'translateY(-300px)'},
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

webapp.load(webappHtml);