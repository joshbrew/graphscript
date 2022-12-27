export declare type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare class ArrayManip {
    static autoscale(array: any, lineIdx?: number, nLines?: number, centerZero?: boolean, ymin?: number, ymax?: number, clamp?: boolean): any;
    static genTimestamps(ct: any, sps: any): any[];
    static absmax(array: any): number;
    static downsample(array: any, fitCount: any, scalar?: number): any;
    static upsample(array: any, fitCount: any, scalar?: number): any[];
    static interpolate(array: number[], fitCount: number, scalar?: number): any;
    static HSLToRGB(h: any, s: any, l: any, scalar?: number): [number, number, number];
    static circularBuffer(arr: any[], newEntries: any[]): any[];
    static reformatData(data: {
        [key: string]: number[] | number | {
            values: number[] | number;
            [key: string]: any;
        };
    } | string | ((number | number[])[]) | number, key?: string): string | number | {
        [key: string]: number | number[] | {
            [key: string]: any;
            values: number[] | number;
        };
    } | (number | number[])[];
    static padTime(data: number[], //new data, assumed to be sequential between a gap
    lastValue: number, //the last data point before the gap
    time: number, //interval that's passed to determine slope between samples
    targetFit: number): number[];
    static interpolateForTime(data: number[], //new data, assumed to be evenly spread over a time interval
    time: number, //the time interval passed (s)
    targetSPS: number): any;
    static bufferValues: (objects: {
        [key: string]: {
            [key: string]: any;
        };
    }, property: string, keys?: string[] | {
        [key: string]: any;
    }, buffer?: ArrayBufferLike) => ArrayBufferLike;
    isTypedArray(x: any): boolean;
    recursivelyAssign: (target: any, obj: any) => any;
    spliceTypedArray(arr: TypedArray, start: number, end?: number): TypedArray;
}
