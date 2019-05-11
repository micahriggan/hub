import { Service } from '@centrapi/hub-client';
export declare class DecentEnvProvider {
    register(service: Service): Promise<Service>;
    get(serviceName: any): Service;
    all(): {
        [serviceName: string]: Service;
    };
}
