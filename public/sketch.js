// sketch.js

// 1. Globals (arrays for creatures, etc)
let fish = [];
let mantas = [];
let shrimpies = [];
let ghostExplosions = [];

let video;
let hands = [];
let fishGrumbleSynth;

let fishArr = [];

// Example: import { SacredGeometryShrimp } from './SacredGeometryShrimp.js';

const FISH_CLASSES = {
  fish: Fish,
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

// ml5.js ------
let handpose;
function preload() {
  handPose = ml5.handPose({ flipped: true, maxHands: 1 });
  // fluidShader = loadShader('shaders/fluid.vert', 'shaders/fluid.frag');
}

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

function setupMl5() {
  // Video for ml5 handpose
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  handPose.detectStart(video, (results) => (hands = results));
}

function setupSynth() {
  // Global layered synth for all fish
  fishGrumbleSynth = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 12,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.2, decay: 0.09, sustain: 0.18, release: 0.8 },
  }).toDestination();

  // Make it cute and "alien" by running through a filter and some vibrato
  const fishFilter = new Tone.Filter(1100, "highpass").toDestination();
  fishGrumbleSynth.connect(fishFilter);

  // Optional vibrato effect
  const vibrato = new Tone.Vibrato(4.7, 0.19).toDestination();
  fishFilter.connect(vibrato);

  // Unlock Tone.js context on user gesture (for Fish grumble)
  // getAudioContext().suspend();
  // userStartAudio();
  window.addEventListener(
    "pointerdown",
    () => {
      Tone.start();
      getAudioContext().resume();
    },
    { once: true },
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  setupSocket();
  setupMl5();
  setupSynth();
}

// 3. p5.js draw loop
function draw() {
  // background('black')
  image(video, 0, 0, windowWidth, windowHeight);

  fishArr.forEach(f => {
    // Fish react to waves near them
    for (let w of fingerTrail) {
      if (dist(f.x, f.y, w.x, w.y) < 70) glow = true;
    }

    let strongWiggle = false;
    for (
      let i = Math.max(0, fingerTrail.length - 18);
      i < fingerTrail.length;
      i++
    ) {
      let pt = fingerTrail[i];
      if (pt && dist(f.x, f.y, pt.x, pt.y) < 60) strongWiggle = true;
    }

    f.update(strongWiggle);
    f.display(strongWiggle);
  });

  // Find the tip of the middle finger in hands
  if (hands.length > 0) {
    const tip = hands[0].middle_finger_tip;
    if (tip) {
      const x = tip.x;
      const y = tip.y;

      addFingerPoint(x, y);
    }
  }

  drawFingerTrail();

  // Ghost explosions
  ghostExplosions = ghostExplosions.filter(g => {
    g.update();
    g.display();
    return !g.finished();
  });
}