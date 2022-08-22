export declare const workerCanvasRoutes: {
    transferCanvas: (self: any, origin: any, worker: Worker | MessagePort, options: {
        canvas: HTMLCanvasElement;
        context?: string;
        _id?: string;
        draw?: string | ((self: any, canvas: any, context: any) => void);
        update?: string | ((self: any, canvas: any, context: any, input: any) => void);
        init?: string | ((self: any, canvas: any, context: any) => void);
        clear?: string | ((self: any, canvas: any, context: any) => void);
        animating?: boolean;
    }) => string;
    receiveCanvas: (self: any, origin: any, options: {
        canvas: any;
        context: string;
        _id?: string;
        width?: number;
        height?: number;
        init?: string;
        update?: string;
        draw?: string;
        clear?: string;
        animating?: boolean;
    }) => string;
    setDraw: (self: any, origin: any, settings: {
        _id?: string;
        canvas?: any;
        context?: string;
        width?: number;
        height?: number;
        draw?: string | ((self: any, canvas: any, context: any) => void);
        update?: string | ((self: any, canvas: any, context: any, input: any) => void);
        init?: string | ((self: any, canvas: any, context: any) => void);
        clear?: string | ((self: any, canvas: any, context: any) => void);
    }) => string;
    drawFrame: (self: any, origin: any, _id?: string, props?: {
        [key: string]: any;
    }) => string;
    clearFrame: (self: any, origin: any, _id?: string, input?: any) => string;
    runUpdate: (self: any, origin: any, _id?: string, input?: any) => string;
    setProps: (self: any, origin: any, _id?: string, props?: {
        [key: string]: any;
    }) => string;
    startAnim: (self: any, origin: any, _id?: string, draw?: string | ((canvas: any, context: any) => void)) => string;
    stopAnim: (self: any, origin: any, _id?: string) => string;
    initProxyElement: typeof import("./ProxyListener").initProxyElement;
    makeProxy: (self: any, origin: any, id: any, elm?: any) => any;
    handleProxyEvent: (self: any, origin: any, data: any, id: any) => any;
};
