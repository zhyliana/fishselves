// server.js

const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html and adopt.html by default
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/adopt.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'adopt.html')));

// Start HTTP server
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// --- WebSocket Setup ---
const wss = new WebSocket.Server({ server });

// Example "pool" of fish (could be expanded)
let fishPool = [
  { id: 1, type: 'classic', color: [230, 180, 220] },
  { id: 2, type: 'psychedelic', color: [160, 120, 220] },
  { id: 3, type: 'shrimp', color: [180, 200, 250] },
  { id: 4, type: 'manta', color: [120, 180, 210] },
  { id: 5, type: 'classic', color: [190, 140, 230] },
  { id: 6, type: 'psychedelic', color: [180, 160, 190] },
  // Add more as needed
];

wss.on('connection', (ws) => {
  // Send the current pool on connect
  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch (e) { return; }
    if (data.type === 'getFishPool') {
      ws.send(JSON.stringify({ type: 'fishPool', fish: fishPool }));
    }
    if (data.type === 'adoptFish') {
      let adoptedFish = fishPool.shift() || null;
      ws.send(JSON.stringify({ type: 'adoptedFish', fish: adoptedFish }));
      // Optionally: Broadcast new pool to all tanks
      broadcastPool();
    }
  });
});

// Helper to broadcast fishPool to all clients (e.g., update tank view)
function broadcastPool() {
  const msg = JSON.stringify({ type: 'fishPool', fish: fishPool });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}
