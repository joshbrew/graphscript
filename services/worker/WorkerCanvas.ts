//provide routes for applying canvases to workers
import { proxyElementWorkerRoutes, initProxyElement } from './ProxyListener';

declare var WorkerGlobalScope;

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

export type CanvasProps = { //defined in worker thread
    canvas:any, //offscreen canvas
    context?:string|CanvasRenderingContext2D|WebGL2RenderingContext|WebGLRenderingContext,
    _id?:string,
    width?:number,
    height?:number,
    draw?:string|((self:any,canvas:any,context:any)=>void),
    update?:string|((self:any,canvas:any,context:any,input:any)=>void),
    init?:string|((self,canvas:any,context:any)=>void),
    clear?:string|((self,canvas:any,context:any)=>void),
    animating?:boolean,
    [key:string]:any
}

export type CanvasControls = {
    _id:string,
    draw:(props?:any)=>void,
    update:(props:{[key:string]:any})=>void,
    clear:()=>void,
    init:()=>void,
    stop:()=>void,
    start:()=>void,
    set:(newDrawProps:CanvasProps)=>void
}

export type WorkerCanvasControls = {
    worker:Worker|MessagePort,
    terminate:()=>void
} & CanvasControls

export type WorkerCanvas = { //this is the object stored on the worker to track this canvas context
    graph:any, //Graph or Service class
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

export function Renderer(
    options:CanvasProps & {worker?:Worker|string|Blob|MessagePort, route?:string}
) {

    if(options.worker) {
        let worker = options.worker;
        let route = options.route;

        if(worker instanceof Blob || typeof worker === 'string') {
            worker = new Worker(worker as any);
        }
        delete options.worker;
        delete options.route;
    
        return transferCanvas(worker, options as WorkerCanvasTransferProps, route);
    }
    else {
        initProxyElement(options.canvas,undefined,options._id);
        return setupCanvas(options);
    }
}


export function transferCanvas(
    worker:Worker|MessagePort,
    options:WorkerCanvasTransferProps,
    route?:string //we can reroute from the default 'setupCanvas' e.g. for other rendering init processes like in threejs
) {


    if(!options) return undefined;
    if(!options._id) options._id = `canvas${Math.floor(Math.random()*1000000000000000)}`;

    let offscreen = (options.canvas as any).transferControlToOffscreen();
    if(!options.width) options.width = options.canvas.clientWidth;
    if(!options.height) options.height = options.canvas.clientHeight;

    let message:any = {route:route ? route : 'setupCanvas', args:{
        ...options,
        canvas:offscreen, 
    }};

    if(this?.__node?.graph) this.__node.graph.run('initProxyElement', options.canvas, worker, options._id); //initiate an element proxy
    else initProxyElement(options.canvas,worker,options._id);

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

    //console.log(worker,message);

    worker.postMessage(message,transfer);

    //lets add some utilities to make it easy to update the thread
    const canvascontrols = {
        _id:options._id,
        width:options.width,
        height:options.height,
        worker,
        draw:(props?:any)=>{
            worker.postMessage({route:'drawFrame',args:[props,options._id]});
        },
        update:(props:{[key:string]:any})=>{
            worker.postMessage({route:'updateCanvas',args:[props,options._id]})
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
        set:(newDrawProps:CanvasProps)=>{
            worker.postMessage({route:'setDraw',args:[newDrawProps,options._id]});
        },
        terminate:()=>{
            (worker as Worker).terminate();
        }
    }

    return canvascontrols as WorkerCanvasControls;
}

export function setDraw(
    settings:CanvasProps,
    _id?:string
) {
    let canvasopts;
    if(this?.__node?.graph) {
        if(_id) canvasopts = this.__node.graph.CANVASES?.[settings._id];
        else if(settings._id) canvasopts = this.__node.graph.CANVASES?.[settings._id];
        else canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
    } else {
        if(_id) canvasopts = globalThis.CANVASES?.[settings._id];
        else if(settings._id) canvasopts = globalThis.CANVASES?.[settings._id];
        else canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
    }

    if(canvasopts) {
        if(settings.canvas) {
            canvasopts.canvas = settings.canvas;

            //create an element proxy to add event listener functionality
            if(this?.__node?.graph) this.__node.graph.run('makeProxy', canvasopts._id, canvasopts.canvas);
            else proxyElementWorkerRoutes.makeProxy(canvasopts._id, canvasopts.canvas);

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
}


export function setupCanvas(
    options:CanvasProps
){
    if(this?.__node?.graph) {
        if(!this.__node.graph.CANVASES) this.__node.graph.CANVASES = {} as {[key:string]:WorkerCanvas};
    }
    else if(!globalThis.CANVASES) globalThis.CANVASES = {} as {[key:string]:WorkerCanvas};

    let canvasOptions = options;

    options._id ? canvasOptions._id = options._id : canvasOptions._id = `canvas${Math.floor(Math.random()*1000000000000000)}`;
    typeof options.context === 'string' ? canvasOptions.context = options.canvas.getContext(options.context) : canvasOptions.context = options.context; //get the rendering context based on string passed
    ('animating' in options) ? canvasOptions.animating = options.animating : canvasOptions.animating = true;

    if(this?.__node?.graph?.CANVASES[canvasOptions._id]) {
        this.__node.graph.run('setDraw',canvasOptions);
    } else if(globalThis.CANVASES?.[canvasOptions._id]) {
        setDraw(canvasOptions);
    } else {
        if(this?.__node?.graph) canvasOptions.graph = this.__node.graph;

        if(this?.__node?.graph) this.__node.graph.CANVASES[canvasOptions._id] = canvasOptions;
        else globalThis.CANVASES[canvasOptions._id] = canvasOptions;

        //create an element proxy to add event listener functionality
        if(this?.__node?.graph) this.__node.graph.run('makeProxy', canvasOptions._id, canvasOptions.canvas);
        else proxyElementWorkerRoutes.makeProxy(canvasOptions._id, canvasOptions.canvas);
        //now the canvas can handle mouse and resize events, more can be implemented
  
        if(options.width) canvasOptions.canvas.width = options.width;
        if(options.height) canvasOptions.canvas.height = options.height;
        
        if(typeof canvasOptions.draw === 'string') {
            canvasOptions.draw = parseFunctionFromText(canvasOptions.draw);
        } else if(typeof canvasOptions.draw === 'function') {
            canvasOptions.draw = canvasOptions.draw;
        }    
        if(typeof canvasOptions.update === 'string') {
            canvasOptions.update = parseFunctionFromText(canvasOptions.update);
        }  else if(typeof canvasOptions.update === 'function') {
            canvasOptions.update = canvasOptions.update;
        }       
        if(typeof canvasOptions.init === 'string') {
            canvasOptions.init = parseFunctionFromText(canvasOptions.init);
        } else if(typeof canvasOptions.init === 'function') {
            canvasOptions.init = canvasOptions.init;
        }        
        if(typeof canvasOptions.clear === 'string') {
            canvasOptions.clear = parseFunctionFromText(canvasOptions.clear);
        } else if(typeof canvasOptions.clear === 'function') {
            canvasOptions.clear = canvasOptions.clear;
        } 

        if(typeof canvasOptions.init === 'function') 
                (canvasOptions.init as any)(canvasOptions, canvasOptions.canvas,canvasOptions.context);

        canvasOptions.stop = () => {stopAnim(canvasOptions._id);};
        canvasOptions.start = (draw?:any) => {startAnim(canvasOptions._id,draw);};
        canvasOptions.set = (settings:any) => {setDraw(settings,canvasOptions._id);}

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

    if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        return canvasOptions._id as string;
    else {
            //lets add some utilities to make it easy to update the thread
    const canvascontrols = {
        _id:options._id,
        width:options.width,
        height:options.height,
        draw:(props?:any)=>{
            drawFrame(props,options._id);
        },
        update:(props:{[key:string]:any})=>{
            updateCanvas(props,options._id);
        },
        clear:()=>{
            clearCanvas(options._id);
        },
        init:()=>{
            //console.log('Posting init')
            initCanvas(options._id);
        },
        stop:()=>{
            stopAnim(options._id);
        },
        start:()=>{
            startAnim(options._id);
        },
        set:(newDrawProps:CanvasProps)=>{
            setDraw(newDrawProps,options._id);
        },
        terminate:()=>{
            stopAnim(options._id);
        }
    }

        return canvascontrols as CanvasControls;
    }
}

//local function copy, same thing but returns the whole canvas object

export function drawFrame(props?:{[key:string]:any},_id?:string) { //can update props when calling draw
    let canvasopts;

    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
    if(canvasopts) {
        if(props) Object.assign(canvasopts,props);
        if(canvasopts.draw) {
            canvasopts.draw(canvasopts,canvasopts.canvas,canvasopts.context);
            return _id;
        }
    }
    return undefined;
}


export function clearCanvas(_id?:string) {
    let canvasopts;
    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
    
    if(canvasopts?.clear) {
        canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);
        return _id;
    }
    return undefined;
}

export function initCanvas(_id?:string){
    let canvasopts;
    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
    
    if(canvasopts?.init) {
        canvasopts.init(canvasopts,canvasopts.canvas,canvasopts.context);
        return _id;
    }
    return undefined;
}

export function updateCanvas(input?:any,_id?:string){
    let canvasopts;
    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
    if(canvasopts?.update) {
        canvasopts.update(canvasopts,canvasopts.canvas,canvasopts.context,input);
        return _id;
    }
    return undefined;
}

export function setProps(props?:{[key:string]:any},_id?:string,){ //update animation props, e.g. the radius or color of a circle you are drawing with a stored value
    let canvasopts;
    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
    if(canvasopts) {
        Object.assign(canvasopts,props);
        if(props.width) canvasopts.canvas.width = props.width;
        if(props.height) canvasopts.canvas.height = props.height;
        return _id;
    }
    return undefined;
}

export function startAnim(_id?:string, draw?:string|((this:any,canvas:any,context:any)=>void)){ //run the draw function applied to the animation or provide a new one

    let canvasopts;
    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
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
}

export function stopAnim(_id?:string){
    let canvasopts;
    if(this?.__node?.graph) {
        if(!_id) canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
        else canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
        if(!_id) canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
        else canvasopts = globalThis.CANVASES?.[_id];
    }
    if(canvasopts) {
        canvasopts.animating = false;
        if(typeof canvasopts.clear === 'function') canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
    }
    return undefined;
}

//load on front and backend
export const workerCanvasRoutes = {
    ...proxyElementWorkerRoutes,
    Renderer:Renderer,
    transferCanvas:transferCanvas,
    setupCanvas:setupCanvas,
    setDraw:setDraw,
    drawFrame:drawFrame,
    clearCanvas:clearCanvas,
    initCanvas:initCanvas,
    updateCanvas:updateCanvas,
    setProps:setProps,
    startAnim:startAnim,
    stopAnim:stopAnim
};

function parseFunctionFromText(method='') {
    //Get the text inside of a function (regular or arrow);
    let getFunctionBody = (methodString) => {
        return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, '$2$3$4');
    }

    let getFunctionHead = (methodString) => {
        let startindex = methodString.indexOf('=>')+1;
        if(startindex <= 0) {
            startindex = methodString.indexOf('){');
        }
        if(startindex <= 0) {
            startindex = methodString.indexOf(') {');
        }
        return methodString.slice(0, methodString.indexOf('{',startindex) + 1);
    }

    let newFuncHead = getFunctionHead(method);
    let newFuncBody = getFunctionBody(method);


    let newFunc;
    if (newFuncHead.includes('function')) {
        let varName = newFuncHead.split('(')[1].split(')')[0]
        newFunc = new Function(varName, newFuncBody);
    } else {
        if(newFuncHead.substring(0,6) === newFuncBody.substring(0,6)) {
        //newFuncBody = newFuncBody.substring(newFuncHead.length);
        let varName = newFuncHead.split('(')[1].split(')')[0]
        //console.log(varName, newFuncHead ,newFuncBody);
        newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf('{')+1,newFuncBody.length-1));
        }
        else {
        try {newFunc = (0,eval)(newFuncHead + newFuncBody + "}");} catch {}
        }
    }

    return newFunc;

}