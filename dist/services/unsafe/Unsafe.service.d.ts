import { GraphNode } from "../../Graph";
export declare const unsafeRoutes: {
    setRoute: (self: GraphNode, origin: any, fn: string | (() => any), fnName?: string) => boolean;
    transferClass: (classObj: any) => false | {
        route: string;
        args: any;
    };
    receiveClass: (self: GraphNode, origin: any, stringified: string) => boolean;
};
