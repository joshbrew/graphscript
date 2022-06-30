export class GraphElement {
    tree: {};
    props: {
        graph: Graph;
        nodes: any[];
    };
    input_delay: number;
    template: any;
    children_ready(top_children?: any[]): void;
    oncreate: any;
    ondelete: any;
    onresize: any;
    onchanged: any;
    renderonchanged: boolean;
}
