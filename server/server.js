const express = require("express");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const cors = require("cors");

const app = express();
const PORT = 5050;
const DRIVERS = path.join(__dirname, "storage/drivers.json");
// const FINANCIALS = path.join(__dirname, "storage/financials.json");
// const ROUTES = path.join(__dirname, "storage/routes.json");
// const SHIPMENTS = path.join(__dirname, "storage/shipments.json");

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Server inabembea port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  console.log("New Websocket client connected");
  clients.push(ws);

  sendData(ws);
  ws.on("close", () => {
    clients = clients.filter((client) => client.readyState === WebSocket.OPEN);
    console.log("Client disconnected.");
  });
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});

const sendData = (ws) => {
  fs.readFile(DRIVERS, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading DRIVERS file", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      ws.send(JSON.stringify(jsonData));
    } catch (parseError) {
      console.error("Error parsing DRIVERS json", parseError);
    }
  });
};

const broadcastData = (data) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

chokidar.watch(DRIVERS).on("change", () => {
  console.log("JSON file changes, sending update data...");

  fs.readFile(DRIVERS, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      broadcastData(jsonData);
    } catch (parseError) {
      console.error("Error, parsing JSON:", parseError);
    }
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server is runing...");
});
