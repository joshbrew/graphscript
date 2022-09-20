import { Graph } from "../../Graph";
export declare type WorkerCanvasTransferProps = {
    canvas: HTMLCanvasElement;
    context?: string;
    _id?: string;
    draw?: string | ((self: any, canvas: any, context: any) => void);
    update?: string | ((self: any, canvas: any, context: any, input: any) => void);
    init?: string | ((self: any, canvas: any, context: any) => void);
    clear?: string | ((self: any, canvas: any, context: any) => void);
    transfer?: any[];
    animating?: boolean;
    [key: string]: any;
};
export declare type WorkerCanvasReceiveProps = {
    canvas: any;
    context: string | CanvasRenderingContext2D | WebGL2RenderingContext | WebGLRenderingContext;
    _id?: string;
    width?: number;
    height?: number;
    init?: string;
    update?: string;
    draw?: string;
    clear?: string;
    animating?: boolean;
    [key: string]: any;
};
export declare type WorkerCanvasControls = {
    _id: string;
    worker: Worker | MessagePort;
    draw: (props?: any) => void;
    update: (props: {
        [key: string]: any;
    }) => void;
    clear: () => void;
    init: () => void;
    stop: () => void;
    start: () => void;
    set: (newDrawProps: WorkerCanvasReceiveProps) => void;
};
export declare type WorkerCanvas = {
    graph: Graph;
    canvas: any;
    context?: CanvasRenderingContext2D | WebGL2RenderingContext | WebGLRenderingContext;
    _id: string;
    draw?: ((self: WorkerCanvas, canvas: WorkerCanvas['canvas'], context: WorkerCanvas['context']) => void);
    update?: ((self: WorkerCanvas, canvas: WorkerCanvas['canvas'], context: WorkerCanvas['context'], input: any) => void);
    init?: ((self: WorkerCanvas, canvas: WorkerCanvas['canvas'], context: WorkerCanvas['context']) => void);
    clear?: ((self: WorkerCanvas, canvas: WorkerCanvas['canvas'], context: WorkerCanvas['context']) => void);
    animating: boolean;
    [key: string]: any;
};
export declare const workerCanvasRoutes: {
    transferCanvas: (worker: Worker | MessagePort, options: WorkerCanvasTransferProps, route?: string) => WorkerCanvasControls;
    receiveCanvas: (options: WorkerCanvasReceiveProps) => string;
    setDraw: (settings: WorkerCanvasReceiveProps, _id?: string) => string;
    drawFrame: (props?: {
        [key: string]: any;
    }, _id?: string) => string;
    clearCanvas: (_id?: string) => string;
    initCanvas: (_id?: string) => string;
    updateCanvas: (input?: any, _id?: string) => string;
    setProps: (props?: {
        [key: string]: any;
    }, _id?: string) => string;
    startAnim: (_id?: string, draw?: string | ((this: any, canvas: any, context: any) => void)) => string;
    stopAnim: (_id?: string) => string;
    initProxyElement: typeof import("./ProxyListener").initProxyElement;
    makeProxy: (id: any, elm?: any) => any;
    handleProxyEvent: (data: any, id: any) => any;
};
