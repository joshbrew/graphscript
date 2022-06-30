export class CircleCanvasNode extends NodeElement {
    props: {
        radius: number;
        triggered: boolean;
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
    draw(node: any, origin: any, input: any): void;
    addDraw(f: any): void;
    drawFuncs: any[];
    drawCircle(centerX: any, centerY: any, radius: any, fill?: string, strokewidth?: number, strokestyle?: string): void;
    drawLine(from?: {
        x: number;
        y: number;
    }, to?: {
        x: number;
        y: number;
    }, strokewidth?: number, strokestyle?: string): void;
    oncreate: (props: any) => void;
    canvas: any;
    context: any;
    ctx: any;
    onresize: (props: any) => void;
}
import { NodeElement } from "../graph.node.js";
