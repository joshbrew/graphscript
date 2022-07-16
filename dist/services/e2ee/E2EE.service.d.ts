import { Service, Routes, ServiceMessage, ServiceOptions } from "../Service";
export declare class E2EEService extends Service {
    name: string;
    keys: {
        [key: string]: {
            key: string;
            _id: string;
        };
    };
    securedKeys: boolean;
    encryptedkeys?: string;
    secret?: string;
    constructor(options?: ServiceOptions, keys?: {
        [key: string]: {
            key: string;
            _id?: string;
        };
    }, secureKeys?: boolean, secret?: string);
    addKey: (key: string, _id?: string) => string | {
        key: string;
        _id: string;
    };
    static generateSecret(): string;
    encrypt(message: string, key: string): string;
    decrypt(message: string, key: string): string;
    encryptRoute: (message: ServiceMessage | string, keyId: string) => ServiceMessage;
    decryptRoute: (message: ServiceMessage | string, keyId: string) => string | ServiceMessage;
    transmit: (message: ServiceMessage | string, keyId?: string) => any;
    receive: (message: ServiceMessage | string, keyId?: string) => any;
    routes: Routes;
}
