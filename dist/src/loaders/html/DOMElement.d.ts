export function addCustomElement(cls: any, tag: any, extend?: any): void;
export function randomId(tag?: string): string;
export function parseFunctionFromText(method: any): any;
export class DOMElement extends HTMLElement {
    static get tag(): string;
    static addElement(tag?: string, cls?: typeof DOMElement, extend?: any): void;
    useShadow: boolean;
    FRAGMENT: any;
    STYLE: any;
    attachedShadow: boolean;
    obsAttributes: string[];
    props: {};
    attributeChangedCallback: (name: any, old: any, val: any) => void;
    onchanged: any;
    ONRESIZE: ((ev: any) => void) | ((ev: any) => void);
    ondelete: (() => void) | ((props?: {}) => void);
    oncreate: any;
    renderonchanged: number;
    template: any;
    connectedCallback(): void;
    delete: () => void;
    render: (props?: {}) => void;
    templateResult: any;
    state: {
        pushToState: {};
        data: {};
        triggers: {};
        setState(updateObj: any): {};
        subscribeTrigger(key: any, onchanged?: (res: any) => void): number;
        unsubscribeTrigger(key: any, sub: any): boolean;
        subscribeTriggerOnce(key?: any, onchanged?: (value: any) => void): void;
    };
}
