import GameState from "../../gameState.js";
export const tagName = 'button'
export const attributes = {
    onclick:(ev)=>{
        if(GameState.playing){
            GameState.playing.stop();
            GameState.playing = undefined;
        }
    },
    innerText:'Stop'
}