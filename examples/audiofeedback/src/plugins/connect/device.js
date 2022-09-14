import { initDevice, Devices } from 'device-decoder' ////'device-decoder'//'../../../device_debugger/src/device.frontend'//
import GameState from "../gameState.js"
import { visualizeDirectory } from '../../../extras/storage/BFS_CSV.js'

export const tagName = 'button'
export const attributes = {
    innerHTML: 'Connect Device',
    onclick: (ev) => {

        //let outputelm = document.getElementById('raw') as HTMLDivElement;

        let mode = (document.getElementById('connectmode')).value;
        let selected;
        if (mode === 'BLE')
            selected = (document.getElementById('selectBLE')).value;
        else if (mode === 'USB')
            selected = (document.getElementById('selectUSB')).value;

        console.log(selected, ',', mode, ', sps:', Devices[mode][selected].sps)

        let info = initDevice(
            mode,
            selected,
            {
                ondecoded:
                    (data) => { //data returned from decoder thread, ready for 
                        //outputelm.innerText = JSON.stringify(data);
                        //console.log(data)

                        GameState.raw = data;

                        if (data.heg) {
                            let heg = Array.isArray(data.heg) ? data.heg[data.heg.length - 1] : data.heg;
                            GameState.currentHEG = heg;
                            GameState.lastTimestamp = GameState.currentTimestamp;

                            GameState.currentTimestamp = Array.isArray(data.timestamp) ? data.timestamp[data.timestamp.length - 1] : data.timestamp;

                            GameState.dataFrameTime = GameState.currentTimestamp - GameState.lastTimestamp;

                            if (!GameState.baselineHEG)
                                GameState.baselineHEG = heg; //first HEG sample
                            else {
                                GameState.shortChange = (GameState.baselineHEG * 0.10 + heg * 0.9) - GameState.baselineHEG;
                                GameState.longChange = (GameState.baselineHEG * 0.99 + heg * 0.01) - GameState.baselineHEG;
                                GameState.baselineHEG = GameState.baselineHEG * 0.9999 + heg * 0.0001; //have the baseline shift slowly (10000 samples)

                                let newLocalMax = false;
                                if (heg > GameState.localMax) {
                                    GameState.localMax = heg;
                                    newLocalMax = true;
                                }
                                let shifted = GameState.hegDataBuffer.shift();
                                GameState.hegDataBuffer.push(heg);
                                if (GameState.localMax === shifted && !newLocalMax) {
                                    GameState.localMax = Math.max(...GameState.hegDataBuffer);
                                }

                                if (GameState.playing) {
                                    let newVol = GameState.playing.volume() + GameState.longChange / GameState.baselineHEG;
                                    if (newVol < 0) newVol = 0;
                                    if (newVol > 1) newVol = 1;
                                    GameState.playing.volume(newVol);
                                }
                            }
                            //if(data.red)
                            //if(data.ir)
                            //if(data.timestamp)
                        }
                    },
                subprocesses: {
                    hr: {
                        init: 'createSubprocess',
                        initArgs: [
                            'heartrate', //preprogrammed algorithm
                            {
                                sps: Devices[mode][selected].sps
                            }
                        ],
                        route: 'runSubprocess', //the init function will set the _id as an additional argument for runAlgorithm which selects existing contexts by _id 
                        callback: (heartbeat) => {
                            console.log('heartrate result', heartbeat); //this algorithm only returns when it detects a beat
                        }
                    },
                    breath: {
                        init: 'createSubprocess',
                        initArgs: [
                            'breath',
                            {
                                sps: Devices[mode][selected].sps
                            }
                        ],
                        route: 'runSubprocess',
                        callback: (breath) => {
                            console.log('breath detect result', breath); //this algorithm only returns when it detects a beat
                        }
                    },
                    csv: {
                        route: 'appendCSV',
                        otherArgs: [`data/${new Date().toISOString()}_${selected}_${mode}.csv`], //filename
                        stopped: true //we will press a button to stop/start the csv collection conditionally
                    }
                }

            }
        );

        if (info) {
            info.then((result) => {
                console.log('session', result);
                let cap;
                let csvmenu;
                if (typeof result.subprocesses === 'object') {
                    if (result.subprocesses.csv) {

                        csvmenu = document.getElementById('csvmenu');

                        cap = document.createElement('button');
                        cap.innerHTML = `Record ${selected} (${mode})`;
                        cap.onclick = () => {
                            (result.subprocesses.csv).setArgs([`data/${new Date().toISOString()}_${selected}_${mode}.csv`]);
                            (result.subprocesses.csv).start();
                            cap.innerHTML = `Stop recording ${selected} (${mode})`;
                            cap.onclick = () => {
                                (result.subprocesses.csv).stop();
                                visualizeDirectory('data', csvmenu);
                                cap.innerHTML = `Record ${selected} (${mode})`;
                            }
                        }

                        ev.target.parentNode.appendChild(cap);
                    }
                }

                result.options.ondisconnect = () => { visualizeDirectory('data', csvmenu); }

                //console.log(result);
                let disc = document.createElement('button');
                disc.innerHTML = `Disconnect ${selected} (${mode})`;
                disc.onclick = () => {
                    result.disconnect();
                    disc.remove();
                    if (cap) cap.remove();
                }
                ev.target.parentNode.appendChild(disc);
            });
        }
    }
}

export default (...input) => input