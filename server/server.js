const express = require("express");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const cors = require("cors");

const app = express();
const PORT = 5050;
const CUSTOMERS = path.join(__dirname, "storage/customers.json");
const DRIVERS = path.join(__dirname, "storage/drivers.json");
const FINANCIALS = path.join(__dirname, "storage/financials.json");
const ROUTES = path.join(__dirname, "storage/routes.json");
const SHIPMENTS = path.join(__dirname, "storage/shipments.json");

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Server inabembea port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.split("?")[1]);
  const source = params.get("source");

  console.log("New Websocket client connected");
  ws.source = source;
  clients.push(ws);

  sendData(ws, source);
  ws.on("close", () => {
    clients = clients.filter((client) => client.readyState === WebSocket.OPEN);
    console.log("Client disconnected.");
  });
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});

const sendData = (ws, source) => {
  if (source === "dashboard") {
    fs.readFile(SHIPMENTS, "utf8", (err, data) => {
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
  } else if (source === "driver") {
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
  }
};

const broadcastData = (data, targetSource) => {
  clients.forEach((client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.source === targetSource
    ) {
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
      broadcastData(jsonData, "driver");
    } catch (parseError) {
      console.error("Error, parsing JSON:", parseError);
    }
  });
});

chokidar.watch(CUSTOMERS).on("change", () => {
  console.log("JSON file changes, sending update data...");

  fs.readFile(CUSTOMERS, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      broadcastData(jsonData, "customer");
    } catch (parseError) {
      console.error("Error, parsing JSON:", parseError);
    }
  });
});

chokidar.watch(SHIPMENTS).on("change", () => {
  console.log("JSON file changes, sending update data...");

  fs.readFile(SHIPMENTS, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      broadcastData(jsonData, "dashboard");
    } catch (parseError) {
      console.error("Error, parsing JSON:", parseError);
    }
  });
});

chokidar.watch(FINANCIALS).on("change", () => {
  console.log("JSON file changes, sending update data...");

  fs.readFile(FINANCIALS, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      broadcastData(jsonData, "financials");
    } catch (parseError) {
      console.error("Error, parsing JSON:", parseError);
    }
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server is runing...");
});
