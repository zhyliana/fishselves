let fluidShader;
let handpose;
let video;
let hands = [];
let waves = [];
let fish = [];
let fishGrumbleSynth;

let fishArr = [];
let spawning = []; // for creatures being animated in

function addRandomCreature() {
  console.log("Add creature")
  // Pick a random type
  const types = Object.keys(FISH_CLASSES);
  const type = random(types);
  const FishClass = FISH_CLASSES[type];
  let y = height / 2 + random(-80, 80);
  let creature = new FishClass(width / 2, y);
  let spawner = new SpawningCreature(creature, width / 2, y);
  spawning.push(spawner);
}

// Trigger a spawn by button, socket event, or timed interval
function mousePressed() {
  console.log("mouse pressed")
  addRandomCreature();
}

function preload() {
  handPose = ml5.handPose({ flipped: true, maxHands: 1 });
  // fluidShader = loadShader('shaders/fluid.vert', 'shaders/fluid.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Video for ml5 handpose
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  handPose.detectStart(video, (results) => (hands = results));

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

  // Fish objects
  for (let i = 0; i < 8; i++) {
    fish.push(
      new Manta(random(0, windowWidth), random(0, windowHeight), fish, true),
    );
    fish.push(new Fish(random(0, windowWidth), random(0, windowHeight)));
    fish.push(
      new PsychedelicFish(random(0, windowWidth), random(0, windowHeight)),
    );
    fish.push(
      new SacredShrimp(random(0, windowWidth), random(0, windowHeight)),
    );
  }
}

function draw() {
  // Flip
  push();
  // translate(width, 0);
  // scale(-1, 1);
  // background('black')
  image(video, 0, 0, windowWidth, windowHeight);
  pop();

  // Pass hand wave data to shader
  // shader(fluidShader);
  // let wavePts = [];
  // for (let w of waves) {
  //   fill('red')
  //   ellipse(w.x, w.y, 20, 20)
  //   // wavePts.push([w.x / width, w.y / height, (millis() - w.t) / 1200.0]);
  // }
  // console.log("wave pts: ", wavePts)
  // while (wavePts.length < 10) wavePts.push([0, 0, 1]); // Pad to uniform size for GLSL array
  // fluidShader.setUniform('u_time', millis() / 1000.0);
  // fluidShader.setUniform('u_waves', wavePts.flat());
  // fluidShader.setUniform('u_waveCount', waves.length);
  // fluidShader.setUniform('u_resolution', [width, height]);

  // Draw fluid background
  // rect(-width / 2, -height / 2, width, height);
  // resetShader();


  // Show spawning creatures
  for (let i = spawning.length - 1; i >= 0; i--) {
    spawning[i].update();
    spawning[i].display();
    if (spawning[i].finished()) {
      fishArr.push(spawning[i].creature); // Add finished creature to tank
      spawning.splice(i, 1);
    }
  }


  // Draw fish
  for (let f of fish) {
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
  }

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
}
