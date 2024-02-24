export declare let recursivelyStringifyFunctions: (obj: {
    [key: string]: any;
}) => {};
export declare function getFnParamNames(fn: any): any;
export declare let getFunctionHead: (methodString: any) => any;
export declare function parseFunctionFromText(method?: string): any;
export declare function reconstructObject(json?: string | {
    [x: string]: any;
}): any;
export declare const stringifyWithCircularRefs: (obj: any, space?: any) => string;
export declare const stringifyWithFunctionsAndCircularRefs: (obj: any, space?: any) => string;
export declare const stringifyFast: (obj: any, space?: any) => string;
