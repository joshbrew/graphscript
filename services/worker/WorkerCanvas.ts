//provide routes for applying canvases to workers

import { parseFunctionFromText } from "../../Graph";
import { proxyElementWorkerRoutes } from "./ProxyListener";

//load on front and backend
export const workerCanvasRoutes = {
    ...proxyElementWorkerRoutes,
    transferCanvas:(
        self,
        origin,
        worker:Worker|MessagePort,
        options:{
            canvas:HTMLCanvasElement,  
            context?:string, 
            _id?:string,
            draw?:string|((self:any,canvas:any,context:any)=>void),
            update?:string|((self:any,canvas:any,context:any,input:any)=>void),
            init?:string|((self,canvas:any,context:any)=>void),
            clear?:string|((self,canvas:any,context:any)=>void),
            animating?:boolean //animation will start automatically, else you can call draw conditionally
        }
    ) => {
        if(!options) return undefined;
        if(!options._id) options._id = `canvas${Math.floor(Math.random()*1000000000000000)}`;

        let offscreen = (options.canvas as any).transferControlToOffscreen();

        let message:any = {route:'receiveCanvas',args:{canvas:offscreen, context: options.context, _id:options._id}};

        self.graph.run('initProxyElement', options.canvas, worker, options._id); //initiate an element proxy

        if(options.draw) {
            if(typeof options.draw === 'function') message.args.draw = options.draw.toString()
            else message.args.draw = options.draw;
        }
        if(options.update) {
            if(typeof options.update === 'function') message.args.update = options.update.toString()
            else message.args.update = options.update;
        }
        if(options.init) {
            if(typeof options.init === 'function') message.args.init = options.init.toString()
            else message.args.init = options.init;
        }
        if(options.clear) {
            if(typeof options.clear === 'function') message.args.clear = options.clear.toString()
            else message.args.clear = options.clear;
        }

        worker.postMessage(message,[offscreen]);
    
        return options._id;
    },
    receiveCanvas:(
        self,
        origin, 
        options:{
            canvas:any,
            context:string,
            _id?:string,
            width?:number,
            height?:number,
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
            context:options.context ? options.canvas.getContext(options.context) : undefined, //get the rendering context based on string passed
            init:options.init,
            update:options.update,
            clear:options.clear,
            draw:options.draw, 
            animating:('animating' in options) ? options.animating : true
        };

        if(self.graph.CANVASES[canvasOptions._id]) {
            self.graph.run('setDraw',canvasOptions);
        }
        else {
            self.graph.CANVASES[canvasOptions._id] = canvasOptions;

            //create an element proxy to add event listener functionality
            self.graph.run('makeProxy', canvasOptions._id, canvasOptions.canvas);
            //now the canvas can handle mouse and resize events, more can be implemented
            
            if(options.width) canvasOptions.canvas.width = options.width;
            if(options.height) canvasOptions.canvas.height = options.height;
            
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

                if(typeof canvasOptions.init === 'function') 
                    (canvasOptions.init as any)(canvasOptions, canvasOptions.canvas,canvasOptions.context);
                
                draw(canvasOptions, canvasOptions.canvas,canvasOptions.context);
            
            }
        }
   

        return canvasOptions._id;
    },
    setDraw:(
        self, 
        origin, 
        settings:{
            _id?:string, 
            canvas?:any,
            context?:string,
            width?:number,
            height?:number,
            draw?:string|((self,canvas:any,context:any)=>void),
            update?:string|((self,canvas:any,context:any,input:any)=>void),
            init?:string|((self,canvas:any,context:any)=>void),
            clear?:string|((self,canvas:any,context:any)=>void)
        }
    )=>{
        let canvasopts;
        if(settings._id) canvasopts = self.graph.CANVASES?.[settings._id];
        else canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];

        if(canvasopts) {
            if(settings.canvas) {
                canvasopts.canvas = settings.canvas;

                //create an element proxy to add event listener functionality
                self.graph.run('makeProxy', canvasopts._id, canvasopts.canvas);
                //now the canvas can handle mouse and resize events, more can be implemented
            }
            if(settings.context) canvasopts.context = canvasopts.canvas.getContext(settings.context);
            if(settings.width) canvasopts.canvas.width = settings.width;
            if(settings.height) canvasopts.canvas.height = settings.height;
            if(typeof settings.draw === 'string') settings.draw = parseFunctionFromText(settings.draw);
            if(typeof settings.draw === 'function') {
                canvasopts.draw = settings.draw;
            }
            if(typeof settings.update === 'string') settings.update = parseFunctionFromText(settings.update);
            if(typeof settings.update === 'function') {
                canvasopts.update = settings.update;
            }
            if(typeof settings.init === 'string') settings.init = parseFunctionFromText(settings.init);
            if(typeof settings.init === 'function') {
                canvasopts.init = settings.init;
            }
            if(typeof settings.clear === 'string') settings.clear = parseFunctionFromText(settings.clear);
            if(typeof settings.clear === 'function') {
                canvasopts.clear = settings.clear;
            }
            return settings._id;
        }
        return undefined;
    },
    drawFrame:(self,origin,_id?:string,props?:{[key:string]:any}) => { //can update props when calling draw
        let canvasopts;
        if(!_id) canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            if(props) Object.assign(canvasopts,props);
            if(canvasopts.draw) {
                canvasopts.draw(canvasopts,canvasopts.canvas,canvasopts.context);
                return _id;
            }
        }
        return undefined;
    },
    clearFrame:(self,origin,_id?:string,input?:any) => {
        let canvasopts;
        if(!_id) canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];
        else canvasopts = self.graph.CANVASES?.[_id];
        
        if(canvasopts?.clear) {
            canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context,input);
            return _id;
        }
        return undefined;
    },
    runUpdate:(self,origin,_id?:string,input?:any) => {
        let canvasopts;
        if(!_id) canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts?.update) {
            canvasopts.update(canvasopts,canvasopts.canvas,canvasopts.context,input);
            return _id;
        }
        return undefined;
    },
    setProps:(self,origin,_id?:string,props?:{[key:string]:any}) => { //update animation props, e.g. the radius or color of a circle you are drawing with a stored value
        let canvasopts;
        if(!_id) canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            Object.assign(canvasopts,props);
            if(props.width) canvasopts.canvas.width = props.width;
            if(props.height) canvasopts.canvas.height = props.height;
            return _id;
        }
        return undefined;
    },
    startAnim:(self, origin, _id?:string, draw?:string|((canvas:any,context:any)=>void))=>{ //run the draw function applied to the animation or provide a new one

        let canvasopts;
        if(!_id) canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];
        else canvasopts = self.graph.CANVASES?.[_id];
        canvasopts.animating = true;
        if(canvasopts && draw) {
            if(typeof draw === 'string') draw = parseFunctionFromText(draw);
            if(typeof draw === 'function') {
                canvasopts.draw = draw;
            }
            return _id;
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
            return _id;
        }
        return undefined;
    },
    stopAnim:(self,origin,_id?:string)=>{
        let canvasopts;
        if(!_id) canvasopts = self.graph.CANVASES?.[Object.keys(self.graph.CANVASES)[0]];
        else canvasopts = self.graph.CANVASES?.[_id];
        if(canvasopts) {
            canvasopts.animating = false;
            if(typeof canvasopts.clear === 'function') canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
            return _id;
        }
        return undefined;
    }
}

//todo: threejs