const express = require("express");
const webSocket = require("ws");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DRIVERS = path.join(__dirname, "storage/drivers.JSON");
const FINANCIALS = path.join(__dirname, "storage/financials.JSON");
const ROUTES = path.join(__dirname, "storage/routes.JSON");
const SHIPMENTS = path.join(__dirname, "storage/shipments.JSON");

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Server inabembea port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  console.log("New Websocket client connected");
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("Client disconnected.");
  });
});

const broadcastData = (data) => {
  clients.forEach((client) => {
    if (client.readyState === webSocket.OPEN) {
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
