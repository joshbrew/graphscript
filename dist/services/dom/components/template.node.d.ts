export class TemplateNode extends NodeElement {
    props: {
        operator: (node: any, origin: any, ...args: any[]) => any;
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
        node: any;
    };
    styles: string;
}
import { NodeElement } from "./graph.node.js";
