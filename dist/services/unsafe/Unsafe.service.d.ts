import { GraphNode } from "../../Graph";
export declare const unsafeRoutes: {
    addRoute: (self: GraphNode, origin: any, fnName: string, fn: string | (() => any)) => void;
    transferClass: (classObj: any) => false | {
        route: string;
        args: any;
    };
    receiveClass: (self: GraphNode, origin: any, stringified: string) => void;
};
