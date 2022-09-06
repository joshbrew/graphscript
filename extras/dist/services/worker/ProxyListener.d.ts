declare function wheelEventHandler(event: any, sendFn: any): void;
declare function preventDefaultHandler(event: any): void;
declare function touchEventHandler(event: any, sendFn: any): void;
declare function filteredKeydownEventHandler(event: any, sendFn: any): void;
export declare const eventHandlers: {
    contextmenu: typeof preventDefaultHandler;
    mousedown: (event: any, sendFn: any) => void;
    mousemove: (event: any, sendFn: any) => void;
    mouseup: (event: any, sendFn: any) => void;
    pointerdown: (event: any, sendFn: any) => void;
    pointermove: (event: any, sendFn: any) => void;
    pointerup: (event: any, sendFn: any) => void;
    touchstart: typeof touchEventHandler;
    touchmove: typeof touchEventHandler;
    touchend: typeof touchEventHandler;
    wheel: typeof wheelEventHandler;
    keydown: typeof filteredKeydownEventHandler;
};
export declare function initProxyElement(element: any, worker: any, id: any): any;
export declare class EventDispatcher {
    _listeners: any;
    addEventListener(type: any, listener: any): void;
    hasEventListener(type: any, listener: any): boolean;
    removeEventListener(type: any, listener: any): void;
    dispatchEvent(event: any, target: any): void;
}
export declare class ElementProxyReceiver extends EventDispatcher {
    _listeners: any;
    proxied: any;
    style: any;
    width: any;
    left: any;
    right: any;
    top: any;
    height: any;
    constructor();
    get clientWidth(): any;
    get clientHeight(): any;
    setPointerCapture: () => void;
    releasePointerCapture: () => void;
    getBoundingClientRect: () => {
        left: any;
        top: any;
        width: any;
        height: any;
        right: any;
        bottom: any;
    };
    handleEvent: (data: any) => void;
    focus(): void;
}
export declare class ProxyManager {
    targets: any;
    constructor();
    makeProxy: (id: any, addTo?: any) => void;
    getProxy: (id: any) => any;
    handleEvent: (data: any, id: any) => boolean;
}
export declare const proxyElementWorkerRoutes: {
    initProxyElement: typeof initProxyElement;
    makeProxy: (id: any, elm?: any) => any;
    handleProxyEvent: (data: any, id: any) => any;
};
export {};
