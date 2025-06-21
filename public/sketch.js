// sketch.js

// 1. Globals (arrays for creatures, etc)
let fish = [];
let mantas = [];
let shrimpies = [];

// 2. p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Example: Create some fish and mantas
  for (let i = 0; i < 12; i++) {
    fish.push(new Fish(random(width), random(height)));
  }
  for (let i = 0; i < 3; i++) {
    mantas.push(new Manta(random(width), random(height)));
  }
  shrimpies.push(new SacredShrimp(width / 2, height / 2));
}

// 3. p5.js draw loop
function draw() {
  background(12, 10, 40);

  // Draw and update all creatures
  fish.forEach(f => {
    f.update(false);      // You could pass strongWiggle based on your app logic
    f.display(false);
  });
  mantas.forEach(m => {
    m.update(false);
    m.display(false);
  });
  shrimpies.forEach(s => {
    s.update(false);
    s.display(false);
  });
}

// 4. (Optional) Mouse/keyboard functions, helper functions, etc.
