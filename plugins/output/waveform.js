    import GameState from "../gameState.js" 
    
    export const tagName = 'canvas'

    export const style = {width:'100vw', height:'300px'}

    export const onrender = function (canvas,info) { 
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        let ctx = canvas.getContext('2d');

        this.canvas = canvas;
        this.ctx = ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    export const animation = function() {
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

    export default (...input) => input