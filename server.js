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
  { id: 1, type: 'quetzal', color: [230, 180, 220] },
  { id: 2, type: 'psychedelicFish', color: [160, 120, 220] },
  { id: 3, type: 'shrimp', color: [180, 200, 250] },
  { id: 4, type: 'manta', color: [120, 180, 210] },
  { id: 5, type: 'fish', color: [190, 140, 230] },
  { id: 6, type: 'psychedelicFish', color: [180, 160, 190] },
  { id: 7, type: 'quetzal', color: [180, 160, 190] },
  { id: 8, type: 'shrimp', color: [180, 200, 250] },
  { id: 9, type: 'psychedelicFish', color: [180, 200, 250] },
  { id: 10, type: 'manta', color: [180, 200, 250] },
  { id: 11, type: 'manta', color: [180, 200, 250] },
  { id: 12, type: 'fish', color: [190, 140, 230] },
  { id: 13, type: 'shrimp', color: [180, 200, 250] },
  { id: 13, type: 'psychedelicFish', color: [180, 200, 250] },
  { id: 15, type: 'fish', color: [190, 140, 230] },
  // Add more as needed
];

let adopted = []

wss.on('connection', (ws) => {
  // Send the current pool on connect
  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch (e) { return; }
    if (data.type === 'getFishPool') {
      ws.send(JSON.stringify({ type: 'fishPool', fish: fishPool }));
    }
    if (data.type === 'adoptFish') {
      // Remove a fish ONLY for /adopt clients
      let adoptedFish = fishPool.shift() || null;
      if (adoptedFish) adopted.push(adoptedFish);

      ws.send(JSON.stringify({ type: 'adoptedFish', fish: adoptedFish }));

      // Tell tank clients (so they can show a "ghost explosion" at adoptedFish.x/y)
      broadcastPool(adoptedFish);
    }
  });
});

// Helper to broadcast fishPool to all clients (e.g., update tank view)
function broadcastPool(adoptedFish) {
  const msg = JSON.stringify({
    type: 'fishPool',
    fish: fishPool,
    adoptedFish: adoptedFish || null
  });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}
