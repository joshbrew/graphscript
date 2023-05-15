//@ts-nocheck

//resources
import { Service, WorkerCanvas, GraphNodeProperties, loaders, htmlloader, HTMLNodeProperties } from '../..//index';
import { 
    initDevice, 
    workers, 
    filterPresets, 
    FilterSettings, 
    chartSettings 
} from '../../../device_debugger/src/device.frontend'//


import { setSignalControls } from '../../src/extras/webgl-plot/webglplot.routes'//'graphscript-services'//'../../extras/webgl-plot/webglplot.routes'

import gsworker from '../../../device_debugger/src/stream.big.worker' //device-decoder/stream.big.worker';
import { Devices } from '../../../device_debugger/src/devices/third_party/index'//

import { Howl, Howler } from 'howler';
import { visualizeDirectory } from '../../src/extras/build/storage/index.storage.services'//'graphscript-services/storage/BFS_CSV';


import './index.css'

//types
import { WorkerRoute } from 'graphscript/services/worker/Worker.service';
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
    },
    OTHER: {
        simulator:'Simulator'
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
    latestRaw:{},
    latestRMS:{},
    sampleError:{},

    playing:undefined as Howl,
    analyser:undefined,
    audioFFTBuffer:new Uint8Array(2048), //default fft size
}


const webapp = new Service({loaders:{
    ...loaders,
    htmlloader
}});
webapp.addServices({workers}); //merge the worker service provided by device-decoder for convenience


let transferred = false; //did we transfer a canvas already
let ctransferred = false;

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
                                innerHTML:'Connect to an EEG device'
                            } as HTMLNodeProperties,
                            'connectmode':{
                                tagName:'select',
                                innerHTML:`
                                    <option value='BLE' selected>BLE</option>
                                    <option value='BLE_OTHER'>BLE (Third Party Drivers)</option>
                                    <option value='USB'>USB</option>
                                    <option value='OTHER'>Other</option>
                                `,
                                onchange:(ev)=>{ // this is a terrible solution :P
                                    if(ev.target.value === 'BLE') {
                                        ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectBLE').style.display = '';
                                        ev.target.parentNode.querySelector('#selectBLEOther').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectOther').style.display = 'none';
                                    }
                                    else if(ev.target.value === 'USB') {
                                        ev.target.parentNode.querySelector('#selectUSB').style.display = '';
                                        ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectBLEOther').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectOther').style.display = 'none';
                                    }
                                    else if(ev.target.value === 'BLE_OTHER') {
                                        ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectBLEOther').style.display = '';
                                        ev.target.parentNode.querySelector('#selectOther').style.display = 'none';
                                    }
                                    else if(ev.target.value === 'OTHER') {
                                        ev.target.parentNode.querySelector('#selectUSB').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectBLE').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectBLEOther').style.display = 'none';
                                        ev.target.parentNode.querySelector('#selectOther').style.display = '';
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
                            'selectBLEOther':{
                                tagName:'select',
                                style:{display:'none'},
                                __onrender:(self)=>{                    
                                    for(const key in selectable.BLE_OTHER) { //include both sets
                                        self.innerHTML += `<option value='${key}'>${selectable.BLE_OTHER[key]}</option>`
                                    }
                                }
                            } as HTMLNodeProperties,
                            'selectOther':{
                                tagName:'select',
                                style:{display:'none'},
                                __onrender:(self)=>{                    
                                    for(const key in selectable.OTHER) { //include both sets
                                        self.innerHTML += `<option value='${key}'>${selectable.OTHER[key]}</option>`
                                    }
                                }
                            } as HTMLNodeProperties,
                            'connectDevice':{
                                tagName:'button',
                                innerHTML:'Connect Device',
                                onclick:async (ev)=>{

                                        //let outputelm = document.getElementById('raw') as HTMLDivElement;

                                        let mode = (document.getElementById('connectmode') as HTMLSelectElement).value;
                                        let selected;
                                        if(mode === 'BLE')
                                            selected = (document.getElementById('selectBLE') as HTMLSelectElement).value;
                                        else if (mode === 'USB') 
                                            selected = (document.getElementById('selectUSB') as HTMLSelectElement).value;
                                        else if (mode === 'BLE_OTHER') 
                                            selected = (document.getElementById('selectBLEOther') as HTMLSelectElement).value;
                                        else if (mode === 'OTHER') 
                                            selected = (document.getElementById('selectOther') as HTMLSelectElement).value;

                                        console.log(selected,',',mode,', sps:', Devices[mode][selected].sps)

                                        
                                        let rmsetemplate = ``;
                                        let rmseanim = () => {
                                            document.getElementById('rmse').innerHTML = rmsetemplate;
                                        }
                                        //let recording = false;

                                        let info = await initDevice(
                                            Devices[mode][selected], 
                                            {
                                                devices:Devices,
                                                workerUrl:gsworker,
                                                ondecoded: (data:{[key:number]:number|number[]}) => { 
                                                    //data returned from decoder thread, ready for 
                                                    //outputelm.innerText = JSON.stringify(data);
                                                    //console.log(data)

                                                    //console.log(data);
                                                    GameState.latestRaw = data;

                                                    let rmskeys = Object.keys(GameState.latestRMS); //1 second RMS average used as predicted value for getting the error

                                                    if(rmskeys.length > 0) { 
                                                        rmsetemplate = ``;
                                                        rmskeys.forEach((key) => {
                                                            if(GameState.latestRaw[key] && key !== 'timestamp') {
                                                                if(Array.isArray(GameState.latestRaw[key])) {
                                                                    GameState.sampleError[key] = GameState.latestRaw[key].map((v) => {
                                                                        return Math.abs(GameState.latestRMS[key] - v);
                                                                    });
                                                                    rmsetemplate += `<div>${key}: ${GameState.sampleError[key][GameState.sampleError[key].length - 1]}</div>`;
                                                                }
                                                                else {
                                                                    GameState.sampleError[key] = Math.abs(GameState.latestRMS[key] - v);
                                                                    rmsetemplate += `<div>${key}: ${GameState.sampleError[key]}</div>`;
                                                                }
                                                            }
                                                        });
                                                        GameState.sampleError.timestamp = GameState.latestRaw.timestamp;
                                                        // if(recording) {
                                                        //     info.tree.rmscsv.worker.post('appendCSV',GameState.sampleError)
                                                        // }
                                                        requestAnimationFrame(rmseanim);
                                                    }
                                                },

                                                roots:{ //top level tree subscribe to device output thread directly (and workers in top level tree will not use main thread)
                                                    renderer: {
                                                        workerUrl:gsworker,
                                                        callback:'updateCanvas', //will pipe data to the canvas animation living alone on this thread
                                                        __onconnected:(node) => {

                                                            if(transferred) {
                                                                let newCanvas = document.createElement('canvas');
                                                                newCanvas.id = 'waveform';
                                                                newCanvas.style.width = '100%';
                                                                newCanvas.style.height = '300px';
                                                                newCanvas.style.position = 'absolute';
                                                                newCanvas.style.zIndex = '1';
                                                                let node = document.getElementById('waveform');
                                                                let newOCanvas = document.createElement('canvas');
                                                                newOCanvas.id = 'waveformoverlay';
                                                                newOCanvas.style.width = '100%';
                                                                newOCanvas.style.height = '300px';
                                                                newOCanvas.style.position = 'absolute';
                                                                newOCanvas.style.zIndex = '2';

                                                                let node2 = document.getElementById('waveformoverlay');
                                                                let parentNode;
                                                                if(node) {
                                                                    parentNode = node.parentNode;
                                                                    node.remove();
                                                                    node2?.remove();
                                                                }
                                                                else parentNode = document.getElementById('waveformdiv');
                                                                parentNode.appendChild(newCanvas); //now transferrable again
                                                                parentNode.appendChild(newOCanvas);
                                                            }

                                                            let canvas = document.getElementById('waveform');
                                                            canvas.width = canvas?.clientWidth;
                                                            canvas.height = canvas?.clientHeight;
                                                            let overlay = document.getElementById('waveformoverlay').transferControlToOffscreen();
                                                            overlay.width = canvas?.clientWidth;
                                                            overlay.height = canvas?.clientHeight;

                                                            //console.log(node,webapp);
                                                            if(chartSettings[selected]) {;
                                                                node.worker.post('setValue',['chartSettings',chartSettings[selected]])
                                                            } 

                                                            console.log('webapp',webapp);

                                                            webapp.run(
                                                                'transferCanvas', 
                                                                node.worker.worker,
                                                                {
                                                                    canvas,
                                                                    //context:undefined,
                                                                    _id:'waveform',
                                                                    overlay,
                                                                    transfer:[overlay],
                                                                    init:(self:WorkerCanvas, canvas, context) => {
                                                                        //console.log('init', globalThis.Devices);

                                                                        let settings = {
                                                                            canvas,
                                                                            _id:self._id,
                                                                            overlay:self.overlay,
                                                                            lines:{
                                                                                '0':{nSec:10, sps: 250}, //{nPoints:1000}
                                                                                '1':{nSec:10, sps: 250},
                                                                                '2':{nSec:10, sps: 250},
                                                                                '3':{nSec:10, sps: 250}
                                                                            },
                                                                            useOverlay:true,
                                                                        };

                                                                        canvas.addEventListener('resize',(o)=>{ 
                                                                            canvas.width = o.width; canvas.height = o.height;
                                                                            if(self.overlay) { 
                                                                                self.overlay.width = o.width;
                                                                                self.overlay.height = o.height;
                                                                            }
                                                                            
                                                                            self.graph.plotter.plots[self._id].plot.webgl.viewport(0, 0, canvas.width, canvas.height);
                                                                        });

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
                                                    } as WorkerRoute,
                                                    vrms:{
                                                        workerUrl:gsworker,
                                                        init:'createSubprocess',
                                                        initArgs:[
                                                            'rms',
                                                            {
                                                                sps:Devices[mode][selected].sps,
                                                                nSec:1,
                                                                watch:['0','1','2','3']
                                                            }
                                                        ],
                                                        callback:'runSubprocess',
                                                        blocking:true, //runs async without backing up on bulk dispatches
                                                        __children:{
                                                            vrms_main:{
                                                                __operator:(
                                                                    result:any
                                                                )=>{
                                                                    GameState.latestRMS = result;
                                                                }
                                                            },
                                                            rmscsv:{
                                                                workerUrl:gsworker,
                                                                // init:'createCSV',
                                                                // initArgs:[`data/${new Date().toISOString()}_${selected}_${mode}.csv`],
                                                                callback:'appendCSV',
                                                                stopped:true //we will press a button to stop/start the csv collection conditionally
                                                            } as WorkerRoute
                                                        }
                                                    } as WorkerRoute,
                                                    csv:{
                                                        workerUrl:gsworker,
                                                        // init:'createCSV',
                                                        // initArgs:[`data/${new Date().toISOString()}_${selected}_${mode}.csv`],
                                                        callback:'appendCSV',
                                                        stopped:true //we will press a button to stop/start the csv collection conditionally
                                                    } as WorkerRoute,
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
                                                        __children:{
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
                                                                blocking:true, //runs async without backing up on bulk dispatches
                                                                __children:{
                                                                    coherence_main:{
                                                                        __operator:(result:any)=>{
                                                                            //console.log('result', result);
                                                                            //console.log('coherence result', result); //this algorithm only returns when it detects a beat
                                                                            if(!result?.frequencies) return;
                                                                            if(result?.frequencies) 
                                                                                document.getElementById('dftxaxis').innerHTML = `<span>${result.frequencies[0]}</span><span>${result.frequencies[Math.floor(result.frequencies.length*0.5)]}</span><span>${result.frequencies[result.frequencies.length-1]}</span>`;
                                                                        
                                                                            let alphaCoherence = 0;
                                                                            let ct = 0;
                                                                            //our frequency distribution has round numbers so we can do this
                                                                            for(let i = result.frequencies.indexOf(8); i < result.frequencies.indexOf(12); i++) {
                                                                                alphaCoherence += result.coherence['0_1'][i];
                                                                                ct++;
                                                                            }
                                                                            if(ct) alphaCoherence /= ct;
                                                                            if(isNaN(alphaCoherence)) alphaCoherence = 0;
                                                                            if(GameState.playing) {
                                                                                let newVol = alphaCoherence;
                                                                                if(newVol < 0) newVol = 0;
                                                                                if(newVol > 1) newVol = 1;
                                                                                GameState.playing.volume(newVol);
                                                                            }
                                                                        
                                                                        }
                                                                    } as GraphNodeProperties,
                                                                    crenderer: {
                                                                        workerUrl:gsworker,
                                                                        callback:'updateCanvas', //will pipe data to the canvas animation living alone on this thread
                                                                        __onconnected:(node) => {
                                                                            //console.log(self,webapp);
                                                                            if(ctransferred) {
                                                                                let newCanvas = document.createElement('canvas');
                                                                                newCanvas.id = 'dftwaveform';
                                                                                newCanvas.style.width = '100%';
                                                                                newCanvas.style.height = '300px';
                                                                                newCanvas.style.position = 'absolute';
                                                                                newCanvas.style.zIndex = '1';
                                                                                let node = document.getElementById('dftwaveform');
                                                                                let newOCanvas = document.createElement('canvas');
                                                                                newOCanvas.id = 'dftwaveformoverlay';
                                                                                newOCanvas.style.width = '100%';
                                                                                newOCanvas.style.height = '300px';
                                                                                newOCanvas.style.position = 'absolute';
                                                                                newOCanvas.style.zIndex = '2';
                
                                                                                let node2 = document.getElementById('dftwaveformoverlay');
                                                                                let parentNode;
                                                                                if(node) {
                                                                                    parentNode = node.parentNode;
                                                                                    node.remove();
                                                                                    node2?.remove();
                                                                                }
                                                                                else parentNode = document.getElementById('dftdiv');
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
                                                                                'transferCanvas', 
                                                                                node.worker.worker,
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
                                                                                                '0_1':{nPoints: 125, ymin:0, ymax:1}, //{nPoints:1000}
                                                                                                '0_2':{nPoints: 125, ymin:0, ymax:1},
                                                                                                '0_3':{nPoints: 125, ymin:0, ymax:1},
                                                                                                '1_2':{nPoints: 125, ymin:0, ymax:1},
                                                                                                '1_3':{nPoints: 125, ymin:0, ymax:1},
                                                                                                '2_3':{nPoints: 125, ymin:0, ymax:1}
                                                                                            },
                                                                                            useOverlay:true,
                                                                                        };
                
                                                                                        //if(self.graph.chartSettings) Object.assign(settings,self.graph.chartSettings);
                
                                                                                        let r = self.graph.run('setupChart', settings);

                                                                                        //console.log(settings, self);
                                                                                        
                                                                                        canvas.addEventListener('resize',()=>{ 
                                                                                            canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
                                                                                            if(self.overlay) { 
                                                                                                self.overlay.width = canvas.clientWidth;
                                                                                                self.overlay.height = canvas.clientHeight;
                                                                                            }
                                                                                            
                                                                                            self.graph.plotter.plots[self._id].plot.webgl.viewport(0, 0, canvas.width, canvas.height);
                                                                                            //r.width = canvas.width; r.height = canvas.height; 
                                                                                        });


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
                                                                            ctransferred = true;
                                                                        }
                
                                                                        //webapp.run('worker.updateChartData')
                                                                    } as WorkerRoute,
                                                                }
                                                            } as WorkerRoute,
                                                        }
                                                    } as WorkerRoute
                                                }
                                            }
                                        );

                                        //console.log(info);

                                        if(info) {
                                            console.log('session', info);

                                            if(filterPresets[selected]) { //enable filters, which are customizable biquad filters
                                                //console.log(filterPresets[selected]);
                                                info.workers.streamworker.post(
                                                    'setFilters', 
                                                    filterPresets[selected] as {[key:string]:FilterSettings}
                                                );
                                            }

                                            let cap;
                                            let csvmenu;
                                            if(typeof info.tree === 'object') {
                                                if(workers.get('csv')) {
                                                    
                                                    csvmenu = document.getElementById('csvmenu');
                                                    
                                                    cap = document.createElement('button');
                                                    cap.innerHTML = `Record ${selected} (${mode})`;
                                                    let onclick = () => {
                                                        recording = true;
                                                        workers.get('csv').worker.post(
                                                            'createCSV',
                                                            [
                                                                `data/${new Date().toISOString()}_${selected}_${mode}.csv`,
                                                                ['timestamp','0','1','2','3','4','5','6','7'],
                                                                Devices[mode][selected].sps*5, //buffer between writes to idb
                                                                1000/Devices[mode][selected].sps
                                                            ]
                                                        );
                                                        workers.get('vrms.rmscsv').worker.post(
                                                            'createCSV',
                                                            [
                                                                `data/${new Date().toISOString()}_RMS_${selected}_${mode}.csv`,
                                                                ['timestamp','0','1','2','3'],
                                                                50 //buffer between writes to idb
                                                            ]
                                                        );
                                                        workers.get('csv').worker.start();
                                                        workers.get('vrms.rmscsv').worker.start();
                                                        cap.innerHTML = `Stop recording ${selected} (${mode})`;
                                                        cap.onclick = () => {
                                                            recording = false;
                                                            workers.get('csv').worker.stop();
                                                            workers.get('vrms.rmscsv').worker.stop();
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
                                                            info.workers.streamworker,
                                                            workers.get('renderer').worker 
                                                        )
                                                        document.getElementById('waveformcontrols').style.display = '';
                                                    }
                                                }
                                            }
                                            info.options.ondisconnect = () => { visualizeDirectory('data',csvmenu); }

                                            //console.log(result);
                                            let disc = document.createElement('button');
                                            disc.innerHTML = `Disconnect ${selected} (${mode})`;
                                            disc.onclick = () => {
                                                info.disconnect();
                                                disc.remove();
                                                if(cap) cap.remove();
                                            }
                                            ev.target.parentNode.appendChild(disc);
                                        }
                                }
                            } as HTMLNodeProperties
                        }
                    } as HTMLNodeProperties
                }
            } as HTMLNodeProperties,
            'output':{
                tagName:'div',
                __children:{
                    'playsounds':{
                        tagName:'div',
                        __children:{
                            'soundheader':{
                                tagName:'h4',
                                innerHTML:'Play a sound to modulate volume with the EEG using the mean Alpha Coherence between channels 0 and 1'
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
                    'ln0':{
                        tagName:'hr'
                    },
                    'waveformtitle':{
                        tagName:'div',
                        innerHTML:'Raw Data'
                    } as HTMLNodeProperties,
                    'waveformdiv':{
                        tagName:'div',
                        style:{height:'300px'},
                        __children:{
                            'waveform':{
                                tagName:'canvas',
                                style:{width:'100%', height:'300px', position:'absolute', zIndex:'1'}
                            } as HTMLNodeProperties,
                            'waveformoverlay':{
                                tagName:'canvas',
                                style:{width:'100%', height:'300px', position:'absolute', zIndex:'2'},
                            } as HTMLNodeProperties,
                            'waveformcontrols':{
                                tagName:'table',
                                style:{display:'none', width:'100%', height:'300px', position:'absolute',  zIndex:'3'},
                                className:'chartcontrols',
                                onmouseleave:(ev) => {
                                    document.getElementById('waveformcontrols').style.display = 'none';
                                }
                            } as HTMLNodeProperties,
                        }
                    },
                    'ln':{
                        tagName:'hr'
                    },
                    'dfttitle':{
                        tagName:'div',
                        innerHTML:'Coherence'
                    } as HTMLNodeProperties,
                    'dftdiv':{
                        tagName:'div',
                        style:{height:'300px'},
                        __children:{
                            'dftwaveform':{
                                tagName:'canvas',
                                style:{width:'100%', height:'300px', position:'absolute', zIndex:'1'},
                            } as HTMLNodeProperties,
                            'dftwaveformoverlay':{
                                tagName:'canvas',
                                style:{width:'100%', height:'300px',  position:'absolute', zIndex:'2'},
                            } as HTMLNodeProperties,
                        }
                    },
                    'ln2':{
                        tagName:'hr'
                    },
                    'dftxaxis':{
                        tagName:'div',
                        style:{display:'flex', justifyContent:'space-between'}
                    } as HTMLNodeProperties,
                    'ln3':{
                        tagName:'hr'
                    },
                    'rmsediv':{
                        tagName:'div',
                        innerHTML:`RMSV (mV)`,
                        __children:{
                            'rmse':{
                                tagName:'div'
                            } as HTMLNodeProperties
                        }
                    },
                    'ln4':{
                        tagName:'hr'
                    },
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

webapp.load(webappHtml);


