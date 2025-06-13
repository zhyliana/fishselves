let fluidShader;
let handpose;
let video;
let predictions = [];
let lastHandPos = null;
let waves = [];
let fish = [];

function preload() {
  handPose = ml5.handPose({ flipped: true });
  // fluidShader = loadShader('shaders/fluid.vert', 'shaders/fluid.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke();

  // Video for ml5 handpose
  video = createCapture(VIDEO, { flipped: true });
  video.size(windowWidth, windowHeight)
  // video.hide();

  handPose.detectStart(video, results => predictions = results);

  // Fish objects
  for (let i = 0; i < 8; i++) {
    fish.push(new Fish(random(0, windowWidth), random(0, windowHeight)));
  }
}

function draw() {
  // Flip
  // push();
  // translate(width, 0);
  // scale(-1, 1);
  image(video, 0, 0, width, height);
  // pop();

  // Find the tip of the middle finger in predictions
  if (predictions.length > 0) {
    const tip = predictions[0].keypoints.find(pt => pt.name === "middle_finger_tip");
    if (tip) {
      const x = tip.x
      const y = tip.y

      if (lastHandPos) {
        let d = dist(x, y, lastHandPos.x, lastHandPos.y);
        if (d > 20) {
          addFingerPoint(x, y);
        }
      }
      lastHandPos = { x, y };
    }
  }

  drawFingerTrail();

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

  // Draw fish
  for (let f of fish) {
    // Fish react to waves near them
    for (let w of fingerTrail) {
      if (dist(f.x, f.y, w.x, w.y) < 70) glow = true;
    }
    let strongWiggle = false;
    for (let i = Math.max(0, fingerTrail.length - 18); i < fingerTrail.length; i++) {
      let pt = fingerTrail[i];
      if (pt && dist(f.x, f.y, pt.x, pt.y) < 60) strongWiggle = true;
    }
    f.update(strongWiggle);
    f.display(strongWiggle);
  }
}
