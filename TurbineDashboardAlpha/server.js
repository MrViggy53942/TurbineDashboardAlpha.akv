const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
const readline = require("readline");

const app = express();
const PORT = 8080;
const WS_PORT = 8081; // WebSocket port

// Simulated user database
const users = { admin: "password123" };

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}! You accessed a protected route.`,
  });
});

// Start Express server
app.listen(PORT, () =>
  console.log(`Express server running on http://localhost:${PORT}`)
);

// WebSocket setup
const wss = new WebSocket.Server({ port: WS_PORT });
console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);

const csvFilePath = path.join(__dirname, "turbine_data.csv");
let clients = new Set(); // Store connected WebSocket clients

// Function to read CSV data
async function readCSVData() {
  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let headers = [];
  let lastData = null;

  for await (const line of rl) {
    if (!headers.length) {
      headers = line.split(",");
      continue;
    }

    const values = line.split(",");
    const dataObject = headers.reduce((obj, key, index) => {
      obj[key.trim()] = isNaN(values[index])
        ? values[index].trim()
        : parseFloat(values[index]);
      return obj;
    }, {});

    lastData = dataObject;
  }

  return lastData;
}

// Function to broadcast data to all WebSocket clients
async function broadcastCSVData() {
  const data = await readCSVData();
  if (!data) return;

  const jsonData = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonData);
    }
  }

  console.log("Broadcasted:", data);
}

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  const token = req.url.split("token=")[1];

  if (!token) {
    ws.close();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      ws.close();
      return;
    }

    console.log(`Client connected: ${decoded.username}`);
    clients.add(ws);

    // Send initial data immediately
    broadcastCSVData();

    // Remove client on disconnect
    ws.on("close", () => {
      clients.delete(ws);
      console.log("Client disconnected");
    });
  });
});

// Watch CSV file for changes and broadcast new data
fs.watch(csvFilePath, (eventType) => {
  if (eventType === "change") {
    console.log("CSV file updated, broadcasting new data...");
    broadcastCSVData();
  }
});

// Periodic update every 5 seconds (in case file watching fails)
setInterval(broadcastCSVData, 5000);
