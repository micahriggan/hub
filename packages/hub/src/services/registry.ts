import portFinder = require('portfinder');
import { Service } from '@centrapi/hub-client';
const Services: { [serviceName: string]: Service } = {};

const wait = async (time) => new Promise(resolve => setTimeout(resolve, time));

const ports = {};
export class ServiceRegistry {
  async getAvailablePort(serviceName?: string) {
    const suggestedPort = await portFinder.getPortPromise();
    if(suggestedPort && !ports[suggestedPort]) {
      ports[suggestedPort] = suggestedPort;
      return suggestedPort;
    } else {
      await wait(1000);
      return this.getAvailablePort();
    }
  }
  async register(service: Service) {
    const { name, data, host, url, port } = service;
    if(Services[name]) {
      return Services[name];
    }
    let usePort = port;
    let useHost = host;
    let useUrl = url;
    if (!url) {
      usePort = usePort || (await this.getAvailablePort());
      useHost = useHost || 'http://localhost';
      useUrl = useUrl || useHost + ':' + usePort;
    }
    Services[name] = {
      name,
      data,
      url: useUrl,
      host: useHost,
      port: usePort,
      heartbeat: Date.now()
    };
    console.log(name, 'registered at', useUrl);
    return Services[name];
  }

  get(serviceName) {
    const service = Services[serviceName];
    return service;
  }

  pruneDead() {
    for(const serviceName of Object.keys(Services)) {
      const service = Services[serviceName];
      if(service.heartbeat < Date.now() - 10000) {
        console.log('Pruning', serviceName);
        delete Services[serviceName];
        delete ports[service.port];
      }
    }
  }

  heartbeat(serviceName: string) {
    if(Services[serviceName]) {
      Services[serviceName].heartbeat = Date.now();
    }
  }

  all() {
    return Services;
  }
}
