export function toISOLocal(d: any): string;
export class CSV {
    static saveCSV(csvDat?: string, name?: string): void;
    static openCSV(delimiter?: string, onOpen?: (csvDat: any, header: any, path: any) => any): void;
    static openCSVRaw(onOpen?: (csvDat: any, path: any) => any): void;
    constructor(onOpen?: (csvDat?: any[], header?: any[]) => void, saveButtonId?: any, openButtonId?: any);
    onOpen(csvDat?: any[], header?: any[]): void;
    notes: {
        idx: number;
        text: string;
    }[];
    processArraysForCSV(data?: string[], delimiter?: string, header?: string, saveNotes?: boolean): string;
}
export function parseCSVData(data: any, filename: any, head: any, hasend?: boolean, parser?: (lines: any, filename: any, head: any) => {
    filename: any;
}): {
    filename: any;
};
export function processDataForCSV(options?: {}): {
    filename: any;
    header: string;
    body: string;
};
