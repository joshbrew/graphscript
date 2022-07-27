/// <reference types="node" />
import { ChildProcess, Serializable } from 'child_process';
import { Routes, Service, ServiceOptions } from '../Service';
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
    createProcess: (properties: CMDRoute) => CMDRoute;
    abort: (process: ChildProcess | CMDInfo) => boolean;
    send: (process: ChildProcess, data: Serializable) => boolean;
    request: () => void;
    runRequest: () => void;
    routes: Routes;
}
