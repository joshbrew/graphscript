export function initProxyElement(element: any, worker: any): string;
export class EventDispatcher {
    addEventListener(type: any, listener: any): void;
    _listeners: {};
    hasEventListener(type: any, listener: any): boolean;
    removeEventListener(type: any, listener: any): void;
    dispatchEvent(event: any): void;
}
export class ElementProxyReceiver extends EventDispatcher {
    style: {};
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
    left: any;
    top: any;
    width: any;
    height: any;
    focus(): void;
}
export class ProxyManager {
    id: string;
    targets: {};
    handleEvent(data: any, id: any): void;
    makeProxy(id: any): void;
    getProxy(id: any): any;
}
export namespace proxyWorkerRoutes {
    export { initProxyElement };
    export function makeProxy(self: any, origin: any, id: any): any;
    export function handleProxyEvent(self: any, origin: any, data: any, id: any): any;
}
