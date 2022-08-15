export declare const workerCanvasRoutes: {
    transferCanvas: (worker: Worker | MessagePort, options: {
        canvas: HTMLCanvasElement;
        context?: string;
        draw?: string | ((canvas: any, context: any) => void);
        init?: string | ((self: any, canvas: any, context: any) => void);
        clear?: string | ((self: any, canvas: any, context: any) => void);
        animating?: boolean;
    }) => string;
    receiveCanvas: (self: any, origin: any, options: {
        canvas: any;
        context: string;
        _id?: string;
        init?: string;
        draw?: string;
        clear?: string;
        animating?: boolean;
    }) => string;
    setDraw: (self: any, origin: any, _id: string, draw: string | ((self: any, canvas: any, context: any) => void), init: string | ((self: any, canvas: any, context: any) => void), clear: string | ((self: any, canvas: any, context: any) => void)) => boolean;
    drawFrame: (self: any, origin: any, _id: string, props?: {
        [key: string]: any;
    }) => boolean;
    setProps: (self: any, origin: any, _id: string, props: {
        [key: string]: any;
    }) => boolean;
    startAnim: (self: any, origin: any, _id: string, draw?: string | ((canvas: any, context: any) => void)) => boolean;
    stopAnim: (self: any, origin: any, _id: string) => boolean;
};
