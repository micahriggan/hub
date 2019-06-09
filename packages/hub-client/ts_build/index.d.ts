/// <reference types="request" />
import * as express from 'express';
import request = require('request-promise');
export declare type Service = {
    name: string;
    host?: string;
    url?: string;
    port?: number | string;
    data?: any;
    heartbeat?: number;
};
export declare const EnvConstants: {
    HUB_NAME: string;
    HUB_PORT: string | number;
    HUB_HOST: string;
};
export declare class HubClient {
    private serviceName;
    private hubUrl;
    private app;
    private stopped;
    private service;
    request: import("request").RequestAPI<request.RequestPromise, request.RequestPromiseOptions, import("request").RequiredUriUrl>;
    constructor(serviceName: any, hubUrl?: string);
    private ensureConnected;
    get(serviceName?: string): Promise<Service>;
    getUrl(): Promise<string>;
    register(service: Partial<Service>): Promise<Service>;
    connect(service: Partial<Service>, app: express.Application): Promise<void>;
    disconnect(): Promise<void>;
    startHeartbeat(name?: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map