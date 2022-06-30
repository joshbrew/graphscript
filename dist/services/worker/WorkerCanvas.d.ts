export declare const workerCanvasRoutes: {
    transferCanvas: (canvas: any, worker: Worker | MessagePort, context?: string, drawfn?: string | ((canvas: any, context: any) => void)) => string;
    receiveCanvas: (self: any, origin: any, options: {
        offscreen: any;
        _id: string;
        context: string;
        animation?: string | ((canvas: any, context: any) => void);
    }) => any;
    setDraw: (self: any, origin: any, _id: string, drawfn: string | ((canvas: any, context: any) => void)) => boolean;
    animate: (self: any, origin: any, _id: any, drawfn?: string | ((canvas: any, context: any) => void)) => boolean;
    stopAnim: (self: any, origin: any, _id: any) => boolean;
};
