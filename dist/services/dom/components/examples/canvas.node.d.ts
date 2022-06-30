export class CanvasNode extends NodeElement {
    props: {
        animation: (node: any, origin: any, input: any) => void;
        operator: (node: any, origin: any, input: any) => void;
        forward: boolean;
        backward: boolean;
        children: any;
        parent: any;
        delay: boolean;
        repeat: boolean;
        recursive: boolean;
        animate: boolean;
        loop: any;
        tag: any;
        input: any;
        graph: any;
        node: any;
    };
    draw(node: any, origin: any, ...input: any[]): void;
    addDraw(f: any): void;
    drawFuncs: any[];
    oncreate: (props: any) => void;
    canvas: any;
    context: any;
    ctx: any;
    onresize: (props: any) => void;
}
import { NodeElement } from "../graph.node.js";
