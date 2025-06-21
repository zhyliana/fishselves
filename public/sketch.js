// sketch.js

// 1. Globals (arrays for creatures, etc)
let fish = [];
let mantas = [];
let shrimpies = [];
let ghostExplosions = [];

let fishArr = [];

// Example: import { SacredGeometryShrimp } from './SacredGeometryShrimp.js';

const FISH_CLASSES = {
  fish: CreatureBase,
  psychedelicFish: PsychedelicFish,
  shrimp: SacredShrimp,
  manta: Manta
  // Add more as needed
};

function updateFishPool(newFishData, adoptedFish) {
  // Find removed fish IDs
  let prevIds = fishArr.map(f => f.id);
  let newIds = newFishData.map(f => f.id);
  let goneIds = prevIds.filter(id => !newIds.includes(id));

  // For each goneId, spawn a ghost at its last position
  fishArr.forEach(f => {
    if (goneIds.includes(f.id)) {
      ghostExplosions.push(new GhostExplosion(f.x, f.y));
    }
  });

  // Recreate fishArr from newFishData, but try to keep .x/.y the same for unchanged fish
  fishArr = newFishData.map(fd => {
    let prev = fishArr.find(f => f.id === fd.id);
    if (prev) return prev; // Preserve y position
    // else create new
    const FishClass = FISH_CLASSES[fd.type] || Fish;
    let f = new FishClass(random(width), random(height));
    f.id = fd.id;
    return f;
  });
}

let ws; // Declare at top-level

// 2. p5.js setup

function setupSocket() {
  // Initialize WebSocket once
  ws = new WebSocket('ws://localhost:4000');

  ws.onopen = () => {
    // Optionally, ask for the fish pool
    ws.send(JSON.stringify({ type: 'getFishPool' }));
  };

  // WS handler
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.type === "fishPool") {
      updateFishPool(msg.fish, msg.adoptedFish);
    }
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  setupSocket()
}

// 3. p5.js draw loop
function draw() {
  background(12, 10, 40);

  fishArr.forEach(f => {
    f.update(false);
    f.display(false);
  });

  // Ghost explosions
  ghostExplosions = ghostExplosions.filter(g => {
    g.update();
    g.display();
    return !g.finished();
  });
}