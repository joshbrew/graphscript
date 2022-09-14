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

    playing:undefined,
    analyser:undefined,
    audioFFTBuffer:new Uint8Array(2048), //default fft size
}


export default GameState