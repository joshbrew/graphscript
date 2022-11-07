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
    subscribeTrigger: (key: string, onchange: (res: any) => void) => number;
    unsubscribeTrigger: (key: string, sub?: number) => boolean;
    subscribeTriggerOnce: (key: string, onchange: (res: any) => void) => void;
}
