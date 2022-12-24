export declare class EventHandler {
    pushToState: {};
    data: {};
    triggers: {};
    constructor(data?: {
        [key: string]: any;
    });
    setState: (updateObj: {
        [key: string]: any;
    }) => {};
    setValue: (key: any, value: any) => void;
    triggerState: (key: any, value: any) => void;
    subscribeTrigger: (key: string, onchange: (res: any) => void, refObject?: {
        [key: string]: any;
    }, refKey?: string) => number;
    unsubscribeTrigger: (key: string, sub?: number) => boolean;
    subscribeTriggerOnce: (key: string, onchange: (res: any) => void) => void;
    getTrigger: (key: any, sub: any) => any;
    getSnapshot: () => void;
    onRemoved: (trigger: {
        sub: number;
        onchange: Function;
    }) => void;
}
