import * as express from 'express';
import { Server } from "http";
import request = require('request-promise');

export type Service = {
  name: string;
  host?: string;
  url?: string;
  port?: number | string;
  data?: any;
  heartbeat?: number;
};

export const EnvConstants = {
  HUB_NAME: 'hub',
  HUB_PORT: process.env.HUB_PORT || 5555,
  HUB_HOST: process.env.HUB_HOST || 'http://localhost'
};

const defaultUrl = EnvConstants.HUB_HOST + ':' + EnvConstants.HUB_PORT;
const wait =  (time) => new Promise(r => setTimeout(r, time));

export class HubClient {
  private app: Server;
  private stopped = false;
  private service: Service;
  public request = request;
  constructor(private serviceName, private hubUrl: string = defaultUrl) {}


  private async ensureConnected() {
    let connected = false;
    const ping = () => {
      return request.get(this.hubUrl + '/ping');
    };

    while (!connected) {
      try {
        await ping();
        connected = true;
      } catch (e) {
        console.log('waiting for hub to come up @ ', this.hubUrl);
        await wait(1000);
      }
    }
  }


  async get(serviceName: string = this.serviceName) {
    await this.ensureConnected();
    const resp = await request.get(this.hubUrl + `/service/${serviceName}`, { json: true });
    return resp as Service;
  }

  async getUrl() {
    while (!this.service) {
      console.log('Waiting for ', this.serviceName);
      this.service = await this.get(this.serviceName);
      if (!this.service) {
        await wait(1000);
      } else {
        console.log('Service retrieved', this.service);
      }
    }
    return this.service.url;
  }

  async register(service: Partial<Service>) {
    const name = service.name || this.serviceName;
    if(!name) {
      throw new Error('service must have a name');
    }
    const defaultedService = Object.assign({}, { name }, service);
    if(name !==  EnvConstants.HUB_NAME) {
      await this.ensureConnected();
    }
    const resp = await request.post(this.hubUrl + `/service`, {
      body: {
        ...defaultedService
      },
      json: true
    });
    console.log('registered service', this.serviceName);
    return resp as Service;
  }


  async connect(service: Partial<Service>, app: express.Application) {
    try {
      let registeredService = service;
      if(!service.port) {
        registeredService = await this.register(service);
      }
      this.app = app.listen(registeredService.port, async () => {
        registeredService = await this.register(service);
        console.log(registeredService.name, 'listening on port', registeredService.port);
        await this.startHeartbeat(registeredService.name);
      });
    } catch(err) {
      console.log(err)
      wait(1000);
      this.connect(service, app)
    }
  }

  async disconnect() {
    this.stopped = true;
    if(this.app) {
      this.app.removeAllListeners();
      this.app.close();
    }
  }

  async startHeartbeat(name: string = this.serviceName) {
    while(!this.stopped) {
      await this.request.get(this.hubUrl + '/heartbeat/' + name)
      await wait(5000);
    }
  }
}
