import { ArbitraryObject, Struct } from './types';
export declare class DataTablet {
    workerId: any;
    id: any;
    threaded: boolean;
    workers: any;
    DS: any;
    collections: Map<string, any>;
    data: any;
    rolloverLimit: number;
    dataSorts: Map<string, any>;
    watches: any;
    constructor(props?: {});
    randomId(tag?: string): string;
    setLocalData(structs: (Partial<Struct>)[] | (Partial<Struct>)): void;
    getLocalData(collection: string, query: any): any;
    onCollectionSet: (type: any, collection: any) => void;
    runSort(key: string, dataObj?: {}, newdata?: any[], tablet?: this): any;
    /**
     * Unsorted data structs come in with a minimum 'structType' and 'timestamp' set of values.
     *
     * If a sort key matches the structType or dataType (from a data struct.data array),
     *  it can return a modified struct or push to the newdata array with a set of newly made structs.
     * Return undefined to process the input data by default structType/dataType and timestamp into the tablet, so you can do this
     *   plus split up additional structs or processed structs into each other. This is intentionally vague until we refine this idea into clearer hooks.
     * The newdata array accumulates all of the data structs supplied on a sort pass which gets sent to this.onSorted() at the end of the sorting pass.
     */
    setSort(key: string | string[], response?: (data: any, newdata?: any[], tablet?: this) => void): void;
    getSort(key: string): any;
    checkWatches(sorted?: ArbitraryObject): void;
    /**
     * - pass the sorted structure to the accumulator object which is just an empty object you can do whatever with
     * - ondata checks the data if it's relevant and keeps a record via the accumulator
     * - if the accumlator condition is satisfied, return true which triggers ontrigger(accum), else return a falsey value
     * - ontrigger function then is passed the accumulator object to do whatever with,
     *      e.g. supply it to an 'alert' struct, set alert:true, and data:accum, and update the server to notify any connected peers.
     */
    setWatch(name: string, ownerId: string | undefined, ondata?: (sorted: any, accum: any, ownerId: string) => boolean, ontrigger?: (accum: any) => void): void;
    getWatch(name: string): any;
    sortStructsIntoTable(datastructs?: Struct[]): Promise<void>;
    onUpdate(_: any, __: any, ___?: any): void;
    onSorted(_?: any[]): void;
    getDataByTimestamp(timestamp: number, ownerId: string): any;
    getDataByTimeRange(begin: number, end: number, type: string, ownerId: string): ArbitraryObject;
    getDataByType(type: string, timestamp: number, ownerId: string): any;
    filterSleepResults(unfiltered?: ArbitraryObject): ArbitraryObject;
    sortObjectByPropName(object: ArbitraryObject): {};
    checkRollover(collection: string, limit?: number): boolean;
}
