import portFinder = require('portfinder');
import { Service } from '@centrapi/hub-client';
const Services: { [serviceName: string]: Service } = {};

export class ServiceRegistry {
  async register(service: Service) {
    const { name, data, host, url, port } = service;
    let usePort = port;
    let useHost = host;
    let useUrl = url;
    if (!url) {
      usePort = usePort || (await portFinder.getPortPromise());
      useHost = useHost || 'http://localhost';
      useUrl = useUrl || useHost + ':' + usePort;
    }
    Services[name] = {
      name,
      data,
      url: useUrl,
      host: useHost,
      port: usePort
    };
    console.log(name, 'registered at ', useUrl);
    return Services[name];
  }

  get(serviceName) {
    return Services[serviceName];
  }

  all() {
    return Services;
  }
}
