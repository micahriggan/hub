import { Service } from '.';
export declare class BaseClient {
    private serviceName;
    private envClient;
    private service;
    constructor(serviceName: any, envUrl?: string);
    getUrl(): Promise<string>;
    register(service?: Partial<Service>): Promise<Service>;
    get(): Promise<Service>;
}
