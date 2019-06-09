import express = require("express");
import cors = require("cors");
import { EnvConstants, HubClient } from "@centrapi/hub-client";
import { ServiceRegistry } from "./services/registry";
const app = express();
app.use(express.json());
app.use(cors());

const registry = new ServiceRegistry();

app.get("/ping", (req, res) => {
  res.send({ msg: "pong" });
});

app.get("/heartbeat/:serviceName", (req, res) => {
  const serviceName = req.params.serviceName;
  console.log(serviceName, "heartbeat");
  registry.heartbeat(serviceName);
  res.send();
});

app.get("/", (req, res) => {
  const payload = registry.all();
  res.send(payload);
});

app.get("/service/:serviceName", (req, res) => {
  const { serviceName } = req.params;
  const payload = registry.get(serviceName);
  res.send(payload);
});

app.post("/service", async (req, res) => {
  const { name, url, port, data } = req.body;
  try {
    if (!name) {
      throw new Error("Services must be named");
    }
    const payload = await registry.register({ name, url, port, data });
    res.send(payload);
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = EnvConstants.HUB_PORT;

function start() {
  const hub = new HubClient("hub");
  hub.connect({ port, host: EnvConstants.HUB_HOST }, app);
  setInterval(() => {
    registry.pruneDead();
  }, 10000);
}
if (require.main === module) {
  start();
}

module.exports = { app, start };
