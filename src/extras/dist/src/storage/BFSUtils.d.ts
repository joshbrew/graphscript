export function readFileChunk(path?: string, begin?: number, end?: number, onread?: (data: any) => void): Promise<any>;
export function processCSVChunksFromDB(path?: string, onData?: (csvdata: any, start: any, end: any, size: any) => void, maxChunkSize?: number, start?: number, end?: string, options?: {}): Promise<any>;
export function readCSVChunkFromDB(path?: string, start?: number, end?: string, options?: {}): Promise<{}>;
export let fsInited: boolean;
export const fs: import("browserfs/dist/node/core/FS.js").FSModule;
export function initFS(dirs?: string[], oninit?: (exists?: any[]) => void, onerror?: (e: any) => void, filesystem?: string): Promise<any>;
export function exists(path?: string): Promise<any>;
export function readFile(path?: string): Promise<any>;
export function getFilenames(directory?: string, onload?: (directory: any) => void): Promise<any>;
export function writeFile(path: any, data: any, onwrite?: (data: any) => void): Promise<any>;
export function appendFile(path: any, data: any, onwrite?: (data: any) => void): Promise<any>;
export function deleteFile(path?: string, ondelete?: () => void): Promise<any>;
export function readFileAsText(path?: string, end?: string, begin?: number, onread?: (data: any, filename: any) => void): Promise<any>;
export function listFiles(dir?: string, onload?: (directory: any) => void): Promise<any>;
export function getFileSize(path?: string, onread?: (size: any) => void): Promise<any>;
export function getCSVHeader(path?: string, onopen?: (header: any, filename: any) => void): Promise<any>;
export function writeToCSVFromDB(path?: string, fileSizeLimitMb?: number): Promise<any>;
export function dirExists(fs: any, directory: any): Promise<any>;
export namespace BFSRoutes {
    export { initFS };
    export { dirExists };
    export { exists };
    export { readFile };
    export { readFileChunk };
    export { getFilenames };
    export { writeFile };
    export { appendFile };
    export { deleteFile };
    export { readFileAsText };
    export { getFileSize };
    export { getCSVHeader };
    export { listFiles };
}