//provide routes for applying canvases to workers

import { parseFunctionFromText } from "../../Graph";

//load on front and backend
export const workerCanvasRoutes = {
    transferCanvas:(
        worker:Worker|MessagePort,
        options:{
            canvas:HTMLCanvasElement,  
            context?:string, 
            draw?:string|((self:any,canvas:any,context:any)=>void),
            update?:string|((self:any,canvas:any,context:any,input:any)=>void),
            init?:string|((self,canvas:any,context:any)=>void),
            clear?:string|((self,canvas:any,context:any)=>void),
            animating?:boolean //animation will start automatically, else you can call draw conditionally
        }
    ) => {
        let _id = `canvas${Math.floor(Math.random()*1000000000000000)}`;
        let offscreen = (options.canvas as any).transferControlToOffscreen();

        let message:any = {route:'receiveCanvas',args:{canvas:offscreen,_id, context: options.context}};

        if(options.draw) {
            if(typeof options.draw === 'function') message.draw = options.draw.toString()
            else message.draw = options.draw;
        }
        if(options.update) {
            if(typeof options.update === 'function') message.update = options.update.toString()
            else message.update = options.update;
        }
        if(options.init) {
            if(typeof options.init === 'function') message.init = options.init.toString()
            else message.init = options.init;
        }
        if(options.clear) {
            if(typeof options.clear === 'function') message.clear = options.clear.toString()
            else message.clear = options.clear;
        }

        worker.postMessage(message,[offscreen]);
    
        return _id;
    },
    receiveCanvas:(
        self,
        origin, 
        options:{
            canvas:any,
            context:string,
            _id?:string,
            init?:string,
            update?:string,
            draw?:string,
            clear?:string,
            animating?:boolean
        }) => {
        if(!self.graph.CANVASES) self.graph.CANVASES = {};

        let canvasOptions = {
            _id:options._id ? options._id : `canvas${Math.floor(Math.random()*1000000000000000)}`, 
            canvas:options.canvas, //offscreencanvas which renders to page when transfered from the html canvas 
            context:options.canvas.getContext(options.context), //get the rendering context based on string passed
            init:options.init,
            update:options.update,
            clear:options.clear,
            draw:options.draw, 
            animating:('animating' in options) ? options.animating : true
        };

        self.graph.CANVASES[options._id] = canvasOptions;
        
        if(typeof canvasOptions.draw === 'string') {
            canvasOptions.draw = parseFunctionFromText(canvasOptions.draw);
        }      
        if(typeof canvasOptions.update === 'string') {
            canvasOptions.update = parseFunctionFromText(canvasOptions.update);
        }       
        if(typeof canvasOptions.init === 'string') {
            canvasOptions.init = parseFunctionFromText(canvasOptions.init);
        }       
        if(typeof canvasOptions.clear === 'string') {
            canvasOptions.clear = parseFunctionFromText(canvasOptions.clear);
        }
        if(typeof canvasOptions.draw === 'function') {
            let draw = (s,canvas,context) => {            
                if(s.animating) {
                    s.draw(s,canvas,context);
                    requestAnimationFrame(()=>{ 
                        draw(s,canvas,context);  
                    });
                }
            }

            if(typeof canvasOptions.init === 'function') (canvasOptions.init as any)(canvasOptions, canvasOptions.canvas,canvasOptions.context);
            
            draw(canvasOptions, canvasOptions.canvas,canvasOptions.context);
        
        }
   

        return canvasOptions._id;
    },
    setDraw:(
        self, 
        origin, 
        _id?:string, 
        draw?:string|((self,canvas:any,context:any)=>void),
        update?:string|((self,canvas:any,context:any,input:any)=>void),
        init?:string|((self,canvas:any,context:any)=>void),
        clear?:string|((self,canvas:any,context:any)=>void)
    )=>{
        let canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            if(typeof draw === 'string') draw = parseFunctionFromText(draw);
            if(typeof draw === 'function') {
                canvasopts.draw = draw;
            }
            if(typeof update === 'string') update = parseFunctionFromText(update);
            if(typeof update === 'function') {
                canvasopts.update = update;
            }
            if(typeof init === 'string') init = parseFunctionFromText(init);
            if(typeof init === 'function') {
                canvasopts.init = init;
            }
            if(typeof clear === 'string') clear = parseFunctionFromText(clear);
            if(typeof clear === 'function') {
                canvasopts.clear = clear;
            }
            return true;
        }
        return undefined;
    },
    drawFrame:(self,origin,_id?:string,props?:{[key:string]:any}) => { //can update props when calling draw
        let canvasopts;
        if(!_id) canvasopts = Object.entries(self.graph.CANVASES)[0];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            if(props) Object.assign(canvasopts,props);
            if(canvasopts.draw) {
                canvasopts.draw(canvasopts,canvasopts.canvas,canvasopts.context);
                return true;
            }
        }
        return undefined;
    },
    runUpdate:(self,origin,_id?:string,input?:any) => {
        let canvasopts;
        if(!_id) canvasopts = Object.entries(self.graph.CANVASES)[0];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts?.update) {
            canvasopts.update(self,canvasopts.canvas,canvasopts.context,input);
            return true;
        }
        return undefined;
    },
    setProps:(self,origin,_id?:string,props?:{[key:string]:any}) => { //update animation props, e.g. the radius or color of a circle you are drawing with a stored value
        let canvasopts;
        if(!_id) canvasopts = Object.entries(self.graph.CANVASES)[0];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            Object.assign(canvasopts,props);
            return true;
        }
        return undefined;
    },
    startAnim:(self, origin, _id?:string, draw?:string|((canvas:any,context:any)=>void))=>{ //run the draw function applied to the animation or provide a new one

        let canvasopts;
        if(!_id) canvasopts = Object.entries(self.graph.CANVASES)[0];
        else canvasopts = self.graph.CANVASES?.[_id];
        canvasopts.animating = true;
        if(canvasopts && draw) {
            if(typeof draw === 'string') draw = parseFunctionFromText(draw);
            if(typeof draw === 'function') {
                canvasopts.draw = draw;
            }
        }

        if(typeof canvasopts?.draw === 'function') {
            let draw = (s,canvas,context) => {            
                if(s.animating) {
                    s.draw(s,canvas,context);
                    requestAnimationFrame(()=>{ 
                        draw(s,canvas,context);  
                    })
                }
            }

            if(typeof canvasopts.clear === 'function') (canvasopts.clear as any)(canvasopts, canvasopts.canvas, canvasopts.context);
            if(typeof canvasopts.init === 'function') (canvasopts.init as any)(canvasopts, canvasopts.canvas, canvasopts.context);

            draw(canvasopts,canvasopts.canvas,canvasopts.context);
            return true;
        }
        return undefined;
    },
    stopAnim:(self,origin,_id?:string)=>{
        let canvasopts;
        if(!_id) canvasopts = Object.entries(self.graph.CANVASES)[0];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            canvasopts.animating = false;
            if(typeof canvasopts.clear === 'function') canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
            return true;
        }
        return undefined;
    }
}

//todo: threejs