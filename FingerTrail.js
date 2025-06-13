let fingerTrail = [];
const maxTrailLength = 80;
const fadeDuration = 1800; // ms

function addFingerPoint(x, y) {
  fingerTrail.push({ x, y, t: millis() });
}

function drawFingerTrail() {
  if (fingerTrail.length < 2) return;

  // Remove faded points
  const now = millis();
  fingerTrail = fingerTrail.filter(pt => now - pt.t < fadeDuration);

  // Smooth palette
  const palette = [
    [248, 244, 252], // white
    [155, 237, 255], // cyan
    [255, 169, 237], // magenta/pink
    [252, 255, 210]  // yellow
  ];

  // Draw smooth, wispy main trail
  for (let j = 11; j > 0; j -= 2) {
    strokeWeight(j);
    noFill();
    beginShape();
    for (let i = 0; i < fingerTrail.length; i++) {
      const pt = fingerTrail[i];
      const age = map(now - pt.t, 0, fadeDuration, 0, 1);
      const c = palette[(i + j) % palette.length];
      stroke(c[0], c[1], c[2], lerp(80, 0, age) * 0.15 * j);

      // Use Catmull-Rom for fluid curves (p5: curveVertex)
      curveVertex(pt.x, pt.y);
    }
    endShape();
  }

  // Dots: scattered along the trail, fade out as well
  for (let i = 0; i < fingerTrail.length; i += 3) {
    const pt = fingerTrail[i];
    const age = map(now - pt.t, 0, fadeDuration + 500, 0, 1);
    const c = palette[i % palette.length];
    noStroke();
    fill(c[0], c[1], c[2], lerp(50, 0, age));
    ellipse(pt.x + random(-3, 3), pt.y + random(-3, 3), random(2, 8), random(2, 13));
  }
}
