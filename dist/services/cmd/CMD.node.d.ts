/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess, Serializable } from 'child_process';
import { Routes, Service, ServiceMessage, ServiceOptions } from '../Service';
import { GraphNodeProperties } from '../../Graph';
export declare type CMDRoute = {
    command: string | ChildProcess;
    args?: string[];
    options?: {
        shell: true;
        stdio: 'inherit';
        [key: string]: any;
    };
    env?: any;
    cwd?: any;
    signal?: any;
    stdout?: (data: any) => void;
    onerror?: (error: Error) => void;
    onclose?: (code: number | null, signal: NodeJS.Signals | null) => void;
} & GraphNodeProperties;
export declare type CMDInfo = {
    process: ChildProcess;
    _id: string;
    controller: AbortController;
} & CMDRoute;
export declare class CMDService extends Service {
    processes: {
        [key: string]: {
            _id: string;
            process: ChildProcess;
            controller: AbortController;
        } & CMDRoute;
    };
    customRoutes: ServiceOptions['customRoutes'];
    constructor(options?: ServiceOptions);
    createProcess: (properties: CMDRoute) => CMDRoute;
    abort: (childprocess: ChildProcess | CMDInfo) => boolean;
    send: (childprocess: ChildProcess, data: Serializable) => boolean;
    request: (message: ServiceMessage | any, processId: string, origin?: string, method?: string) => Promise<unknown>;
    runRequest: (message: any, callbackId: string | number, childprocess?: ChildProcess | string) => any;
    subscribeProcess(route: string, childprocess: ChildProcess | string): number;
    subscribeToProcess(route: string, processId: string, callback?: ((res: any) => void) | string): any;
    routes: Routes;
}
