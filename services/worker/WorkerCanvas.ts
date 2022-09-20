//provide routes for applying canvases to workers

import { Graph, parseFunctionFromText } from "../../Graph";
import { proxyElementWorkerRoutes } from "./ProxyListener";

export type WorkerCanvasTransferProps = { //defined in main thread to send to worker
    canvas:HTMLCanvasElement,  
    context?:string, 
    _id?:string,
    draw?:string|((self:any,canvas:any,context:any)=>void),
    update?:string|((self:any,canvas:any,context:any,input:any)=>void),
    init?:string|((self,canvas:any,context:any)=>void),
    clear?:string|((self,canvas:any,context:any)=>void),
    transfer?:any[],
    animating?:boolean, //animation will start automatically, else you can call draw conditionally
    [key:string]:any //any transferrable props you want to use in your animation
}

export type WorkerCanvasReceiveProps = { //defined in worker thread
    canvas:any, //offscreen canvas
    context:string|CanvasRenderingContext2D|WebGL2RenderingContext|WebGLRenderingContext,
    _id?:string,
    width?:number,
    height?:number,
    init?:string,
    update?:string,
    draw?:string,
    clear?:string,
    animating?:boolean,
    [key:string]:any
}

export type WorkerCanvasControls = {
    _id:string,
    worker:Worker|MessagePort,
    draw:(props?:any)=>void,
    update:(props:{[key:string]:any})=>void,
    clear:()=>void,
    init:()=>void,
    stop:()=>void,
    start:()=>void,
    set:(newDrawProps:WorkerCanvasReceiveProps)=>void
}
export type WorkerCanvas = { //this is the object stored on the worker to track this canvas context
    graph:Graph, 
    canvas:any, //OffscreenCanvas
    context?:CanvasRenderingContext2D|WebGL2RenderingContext|WebGLRenderingContext,
    _id:string,
    draw?:((self:WorkerCanvas,canvas:WorkerCanvas['canvas'],context:WorkerCanvas['context'])=>void), //runs in animation loop or on drawFrame calls
    update?:((self:WorkerCanvas,canvas:WorkerCanvas['canvas'],context:WorkerCanvas['context'],input:any)=>void),
    init?:((self:WorkerCanvas,canvas:WorkerCanvas['canvas'],context:WorkerCanvas['context'])=>void),
    clear?:((self:WorkerCanvas,canvas:WorkerCanvas['canvas'],context:WorkerCanvas['context'])=>void),
    animating:boolean, //animation will start automatically, else you can call draw conditionally
    [key:string]:any //any transferrable props you want to use in your animation
}


//load on front and backend
export const workerCanvasRoutes = {
    ...proxyElementWorkerRoutes,
    transferCanvas:function(
        worker:Worker|MessagePort,
        options:WorkerCanvasTransferProps,
        route?:string //we can reroute from the default 'receiveCanvas' e.g. for other rendering init processes like in threejs
    ){
        if(!options) return undefined;
        if(!options._id) options._id = `canvas${Math.floor(Math.random()*1000000000000000)}`;

        let offscreen = (options.canvas as any).transferControlToOffscreen();

        let message:any = {route:route ? route : 'receiveCanvas',args:{
            ...options,
            canvas:offscreen, 
        }};

        this.graph.run('initProxyElement', options.canvas, worker, options._id); //initiate an element proxy

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

        let transfer = [offscreen];
        if(options.transfer) {
            transfer.push(...options.transfer);
            delete options.transfer;
        }

        worker.postMessage(message,transfer);

        //lets add some utilities to make it easy to update the thread
        const workercontrols = {
            _id:options._id,
            width:options.width,
            height:options.height,
            worker,
            draw:(props?:any)=>{
                worker.postMessage({route:'drawFrame',args:[options._id,props]});
            },
            update:(props:{[key:string]:any})=>{
                worker.postMessage({route:'updateCanvas',args:[options._id, props]})
            },
            clear:()=>{
                worker.postMessage({route:'clearCanvas',args:options._id})
            },
            init:()=>{
                //console.log('Posting init')
                worker.postMessage({route:'initCanvas',args:options._id});
            },
            stop:()=>{
                worker.postMessage({route:'stopAnim',args:options._id})
            },
            start:()=>{
                worker.postMessage({route:'startAnim',args:options._id})
            },
            set:(newDrawProps:WorkerCanvasReceiveProps)=>{
                worker.postMessage({route:'setDraw',args:[newDrawProps,options._id]});
            }
        }
    
        return workercontrols as WorkerCanvasControls;
    },
    receiveCanvas:function(
        options:WorkerCanvasReceiveProps
    ){

        if(!this.graph.CANVASES) this.graph.CANVASES = {} as {[key:string]:WorkerCanvas};

        let canvasOptions = options;


        options._id ? canvasOptions._id = options._id : canvasOptions._id = `canvas${Math.floor(Math.random()*1000000000000000)}`;
        typeof options.context === 'string' ? canvasOptions.context = options.canvas.getContext(options.context) : canvasOptions.context = options.context; //get the rendering context based on string passed
        ('animating' in options) ? canvasOptions.animating = options.animating : canvasOptions.animating = true;

        if(this.graph.CANVASES[canvasOptions._id]) {
            this.graph.run('setDraw',canvasOptions);
        }
        else {

            canvasOptions.graph = this.graph;
            this.graph.CANVASES[canvasOptions._id] = canvasOptions;

            //create an element proxy to add event listener functionality
            this.graph.run('makeProxy', canvasOptions._id, canvasOptions.canvas);
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

            if(typeof canvasOptions.init === 'function') 
                    (canvasOptions.init as any)(canvasOptions, canvasOptions.canvas,canvasOptions.context);

            if(typeof canvasOptions.draw === 'function' && canvasOptions.animating) {
                let draw = (s,canvas,context) => {            
                    if(s.animating) {
                        s.draw(s,canvas,context);
                        requestAnimationFrame(()=>{ 
                            draw(s,canvas,context);  
                        });
                    }
                }
                
                draw(canvasOptions, canvasOptions.canvas,canvasOptions.context);
            
            }
        }

        return canvasOptions._id;
    },
    setDraw:function(
        settings:WorkerCanvasReceiveProps,
        _id?:string
    ){
        let canvasopts;
        if(_id) canvasopts = this.graph.CANVASES?.[settings._id];
        else if(settings._id) canvasopts = this.graph.CANVASES?.[settings._id];
        else canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];

        if(canvasopts) {
            if(settings.canvas) {
                canvasopts.canvas = settings.canvas;

                //create an element proxy to add event listener functionality
                this.graph.run('makeProxy', canvasopts._id, canvasopts.canvas);
                //now the canvas can handle mouse and resize events, more can be implemented
            }
            if(typeof settings.context === 'string') canvasopts.context = canvasopts.canvas.getContext(settings.context);
            else if(settings.context) canvasopts.context = settings.context;
            
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
    drawFrame: function(props?:{[key:string]:any},_id?:string) { //can update props when calling draw
        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
        if(canvasopts) {
            if(props) Object.assign(canvasopts,props);
            if(canvasopts.draw) {
                canvasopts.draw(canvasopts,canvasopts.canvas,canvasopts.context);
                return _id;
            }
        }
        return undefined;
    },
    clearCanvas: function(_id?:string) {
        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
        
        if(canvasopts?.clear) {
            canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);
            return _id;
        }
        return undefined;
    },
    initCanvas:function(_id?:string){
        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
        
        if(canvasopts?.init) {
            canvasopts.init(canvasopts,canvasopts.canvas,canvasopts.context);
            return _id;
        }
        return undefined;
    },
    updateCanvas:function(input?:any,_id?:string){
        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
        if(canvasopts?.update) {
            canvasopts.update(canvasopts,canvasopts.canvas,canvasopts.context,input);
            return _id;
        }
        return undefined;
    },
    setProps:function(props?:{[key:string]:any},_id?:string,){ //update animation props, e.g. the radius or color of a circle you are drawing with a stored value
        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
        if(canvasopts) {
            Object.assign(canvasopts,props);
            if(props.width) canvasopts.canvas.width = props.width;
            if(props.height) canvasopts.canvas.height = props.height;
            return _id;
        }
        return undefined;
    },
    startAnim:function(_id?:string, draw?:string|((this:any,canvas:any,context:any)=>void)){ //run the draw function applied to the animation or provide a new one

        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
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
    stopAnim:function(_id?:string){
        let canvasopts;
        if(!_id) canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
        else canvasopts = this.graph.CANVASES?.[_id];
        if(canvasopts) {
            canvasopts.animating = false;
            if(typeof canvasopts.clear === 'function') canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
            return _id;
        }
        return undefined;
    }
}

//todo: threejs