    import GameState from "../../gameState.js";
    import { Howl, Howler } from 'howler';

    export const tagName = 'button'
    export const attributes = {
        onclick:async (ev)=>{
            //ev.target.parentNode.querySelector('#soundDropdown')
            if(GameState.playing) {
                GameState.playing.stop()
                GameState.playing = undefined;
            }

            GameState.playing = new Howl({
                src: (document.getElementById('soundDropdown')).value,
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

    export default (...input) => input