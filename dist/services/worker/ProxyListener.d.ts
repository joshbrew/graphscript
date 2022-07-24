export declare function initProxyElement(element: any, worker: any): string;
export declare class EventDispatcher {
    _listeners: any;
    addEventListener(type: any, listener: any): void;
    hasEventListener(type: any, listener: any): boolean;
    removeEventListener(type: any, listener: any): void;
    dispatchEvent(event: any): void;
}
export declare class ElementProxyReceiver extends EventDispatcher {
    style: any;
    width: any;
    left: any;
    right: any;
    top: any;
    height: any;
    constructor();
    get clientWidth(): any;
    get clientHeight(): any;
    setPointerCapture(): void;
    releasePointerCapture(): void;
    getBoundingClientRect(): {
        left: any;
        top: any;
        width: any;
        height: any;
        right: any;
        bottom: any;
    };
    handleEvent(data: any): void;
    focus(): void;
}
export declare class ProxyManager {
    id: any;
    targets: any;
    constructor();
    makeProxy(id: any): void;
    getProxy(id: any): any;
    handleEvent(data: any, id: any): void;
}
export declare const proxyWorkerRoutes: {
    initProxyElement: typeof initProxyElement;
    makeProxy: (self: any, origin: any, id: any) => any;
    handleProxyEvent: (self: any, origin: any, data: any, id: any) => any;
};
