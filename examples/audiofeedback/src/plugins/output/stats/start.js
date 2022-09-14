import GameState from "../../gameState.js";

    export const tagName = 'table'
    export const animation = function(){
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
    }