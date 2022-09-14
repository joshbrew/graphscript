import GameState from "../../gameState.js" 

export const tagName = 'button'
export const attributes = {
    onclick: () => {
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