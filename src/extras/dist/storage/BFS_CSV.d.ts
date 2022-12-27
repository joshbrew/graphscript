import { readCSVChunkFromDB } from './BFSUtils';
import { CSV, toISOLocal } from './csv';
export declare const appendCSV: (newData: {
    [key: string]: number | number[];
}, filename: string, header?: string[], toFixed?: number) => Promise<boolean>;
export declare const updateCSVHeader: (header: any[], filename: string) => void;
export declare const createCSV: (filename: string, header: string[], bufferSize?: number, xIncrement?: number) => Promise<unknown>;
export declare const visualizeDirectory: (dir: string, parentNode?: HTMLElement) => Promise<unknown>;
export declare const csvRoutes: {
    appendCSV: (newData: {
        [key: string]: number | number[];
    }, filename: string, header?: string[], toFixed?: number) => Promise<boolean>;
    updateCSVHeader: (header: any[], filename: string) => void;
    createCSV: (filename: string, header: string[], bufferSize?: number, xIncrement?: number) => Promise<unknown>;
    visualizeDirectory: (dir: string, parentNode?: HTMLElement) => Promise<unknown>;
    openCSV: typeof CSV.openCSV;
    saveCSV: typeof CSV.saveCSV;
    openCSVRaw: typeof CSV.openCSVRaw;
    parseCSVData: (data: any, filename: any, head: any, hasend?: boolean, parser?: (lines: any, filename: any, head: any) => {
        filename: any;
    }) => {
        filename: any;
    };
    getCSVHeader: (path?: string, onopen?: (header: any, filename: any) => void) => Promise<any>;
    writeToCSVFromDB: (path?: string, fileSizeLimitMb?: number) => Promise<any>;
    readCSVChunkFromDB: typeof readCSVChunkFromDB;
    toISOLocal: typeof toISOLocal;
};
