let serpent;
let hissSynth, hissNoise;

// function setup() {
// createCanvas(windowWidth, windowHeight);
// serpent = new Vectorcoatl(width / 2, height / 2);

// Setup hiss sound using Tone.js
// hissNoise = new Tone.Noise("white");
// hissSynth = new Tone.NoiseSynth({
//   noise: { type: "white" },
//   envelope: { attack: 0.1, decay: 0.2, sustain: 1, release: 0.5 }
// }).toDestination();

// // To avoid auto-play restrictions, trigger on user action
// userStartAudio();
// // Start the hiss quietly and loop
// hissSynth.volume.value = -25;
// hissSynth.triggerAttack();
// }

// function draw() {
//   serpent.display();
// }

// function mousePressed() {
//   // Optionally, toggle hiss louder or softer on click
//   hissSynth.volume.value = random(-18, -30);
// }

class Quetzal {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.len = 350; // serpent length
    this.segments = 32;
    this.baseAngle = 0;
    this.colors = [
      color(120, 255, 200),
      color(220, 255, 80),
      color(180, 80, 255),
      color(255, 210, 0)
    ];

    // hissNoise = new Tone.Noise("white");
    // hissSynth = new Tone.NoiseSynth({
    //   noise: { type: "white" },
    //   envelope: { attack: 0.1, decay: 0.2, sustain: 1, release: 0.5 }
    // }).toDestination();

    // To avoid auto-play restrictions, trigger on user action
    // userStartAudio();
    // Start the hiss quietly and loop
    // hissSynth.volume.value = -25;
    // hissSynth.triggerAttack();

    this.sadMode = false;
  }

  display(strongWiggle) {
    push();
    translate(this.cx, this.cy);
    this.baseAngle += 0.012;

    let prev = createVector(0, 0);
    for (let i = 0; i < this.segments; i++) {
      let t = i / (this.segments - 1);

      let angle = 0
      // Spiral curve, animated
      if (!this.sadMode) {
        angle = this.baseAngle + t * TWO_PI * 1.5 + sin(frameCount * 0.02 + i) * 0.5;
      }
      let radius = 80 + sin(t * PI * 2 + this.baseAngle) * 24 + i * (this.len / this.segments);

      // Head morphs
      let x = cos(angle) * radius;
      let y = sin(angle) * radius * (0.7 + 0.3 * cos(this.baseAngle + t * 3));

      // Feathers as lines radiating from head
      if (i === 0) {
        strokeWeight(1.5);
        for (let f = 0; f < 14; f++) {
          let fa = this.baseAngle + f * PI / 7 + sin(frameCount * 0.04 + f);
          let fx = x + cos(fa) * 40;
          let fy = y + sin(fa) * 32;
          stroke(180 + 70 * sin(fa), 255, 220, 140);
          line(x, y, fx, fy);
        }
        // Eyes: infinity symbol
        stroke(255, 180, 255);
        noFill();
        push();
        translate(x, y);
        rotate(this.baseAngle * 2);
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.15) {
          let r = 6 + 2 * sin(a * 2 + frameCount * 0.06);
          let ix = r * cos(a) * cos(a);
          let iy = r * sin(a);
          vertex(ix, iy);
        }
        endShape(CLOSE);
        pop();
      }

      // Body: colored lines and triangles
      strokeWeight(1.1 + 1.5 * pow(1 - t, 4));
      stroke(this.colors[i % this.colors.length]);
      line(prev.x, prev.y, x, y);
      line(prev.x + 5, prev.y + 5, x + 5, y + 5);

      // Optional: draw geometric pattern on body
      if (i % 5 === 0 && i !== 0) {
        push();
        translate(x, y);
        rotate(angle + this.baseAngle);
        noFill();
        stroke(255, 60 + 180 * t, 220);
        beginShape();
        for (let j = 0; j < 6; j++) {
          let ang = j * PI / 3;
          let rx = 14 * (0.7 + 0.4 * sin(this.baseAngle * 2 + i + j));
          let ry = rx;
          vertex(cos(ang) * rx, sin(ang) * ry);
        }
        endShape(CLOSE);
        pop();
      }

      prev = createVector(x, y);
    }
    pop();
  }

  update(strongWiggle) {
    if (strongWiggle) {
      hissSynth.volume.value = random(-18, -30);
    }
  }

  setSadMode(mode) {
    this.sadMode = mode;
  }
}
