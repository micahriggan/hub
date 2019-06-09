const { HubClient } = require('@centrapi/hub-client');
const express = require('express');
const cors = require('cors');
const http = require('http');
const wait =  (time) => new Promise(r => setTimeout(r, time));

async function monitor() {
  const monitorApp = express();
  monitorApp.use(express.json());
  monitorApp.use(cors());

  monitorApp.get('/ping/:service', async (req, res) => {
    const name = req.params.service;
    console.log('pinging', name);
    const client = new HubClient(name);
    const serviceInfo = await client.get();
    if(serviceInfo) {
      client.request.get(serviceInfo.url + '/ping').pipe(res);
    } else {
      res.status(404).send();
    }
  });

  monitorApp.get('/ping', (req, res) => {
    console.log('monitor - pinged');
    res.send('pong');
  });

  const hub = new HubClient('monitor');
  const service = await hub.connect({}, monitorApp);
}

async function api() {
  const api = express();
  api.use(express.json());
  api.use(cors());

  api.get('/ping', (req, res) => {
    console.log('api - pinged');
    res.send('pong');
  });

  const hub = new HubClient('api');
  const service = await hub.connect({}, api);
}

async function monitorWorker() {
  const monitorClient = new HubClient('monitor');
  setInterval(async () => {
    try {
      const url = await monitorClient.getUrl()
      // ask the monitor to ping api
      await monitorClient.request.get(url + '/ping/api')
    } catch(e) {
      console.error(e);
    }
  }, 5000);
}


// launch two apis and a worker that connects to one of the apis
monitor();
api();
monitorWorker();
