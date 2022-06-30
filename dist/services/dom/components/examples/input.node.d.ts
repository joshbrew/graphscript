export class InputNode extends NodeElement {
    props: {
        operator: (node: any, origin: any, input: any) => any;
        forward: boolean;
        backward: boolean;
        children: any;
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
    oncreate: (props: any) => void;
}
import { NodeElement } from "../graph.node.js";
