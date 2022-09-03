import { Routes } from '../Service';
export declare type Subprocess = (context: SubprocessContext, data: {
    [key: string]: any;
} | any) => {
    [key: string]: any;
} | undefined;
export declare type SubprocessContextProps = {
    ondata: Subprocess;
    oncreate?: (context: SubprocessContext) => void;
    structs?: {
        [key: string]: any;
    };
    [key: string]: any;
};
export declare type SubprocessContext = {
    ondata: Subprocess;
    oncreate?: (context: SubprocessContext) => void;
    run?: (data: {
        [key: string]: any;
    } | any) => any;
    [key: string]: any;
};
export declare const algorithms: {
    [key: string]: SubprocessContextProps;
};
export declare function createSubprocess(options: SubprocessContextProps, inputs?: {
    [key: string]: any;
}): SubprocessContext;
export declare const subprocessRoutes: Routes;
