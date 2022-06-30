export class NodeElement {
    props: {
        operator: (self: any, origin: any, ...args: any[]) => any[];
        forward: boolean;
        backward: boolean;
        children: any;
        parent: any;
        delay: boolean;
        repeat: boolean;
        recursive: boolean;
        frame: boolean;
        animate: boolean;
        loop: any;
        tag: any;
        input: any;
        graph: any;
    };
    input_delay: number;
    template: any;
    render: (props?: {
        operator: (self: any, origin: any, ...args: any[]) => any[];
        forward: boolean;
        backward: boolean;
        children: any;
        parent: any;
        delay: boolean;
        repeat: boolean;
        recursive: boolean;
        frame: boolean;
        animate: boolean;
        loop: any;
        tag: any;
        input: any;
        graph: any;
    }) => void;
    templateString: any;
    FRAGMENT: any;
    setupNode(props: any): void;
    id: any;
    oncreate: any;
    ondelete: any;
    onresize: any;
    onchanged: any;
    renderonchanged: boolean;
}
