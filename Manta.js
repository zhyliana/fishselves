'use client';

class Manta {
  constructor(x, y, fishList, insideBlobFn) {
    this.tailPhase = random(TWO_PI);
    this.color = color(random(180, 255), random(50, 200), random(200, 255));
    this.behavior = new SwimBehavior(x, y, fishList, insideBlobFn);
    this.sizeScale = .50
  }

  update() {
    // this.behavior.update(false, mouseX, mouseY);
  }

  display(strongWiggle) {
    this.tailPhase += 0.2 * this.behavior.reactionStrength + (this.behavior.shimmerTimer > 0 ? 0.4 : 0);

    const size = 50 * this.sizeScale;
    push();
    translate(this.behavior.pos.x, this.behavior.pos.y);
    rotate(this.behavior.vel.heading());
    fill(this.color, 150);

    // Tail
    for (let t = -1; t <= 1; t += 2) {
      for (let glow = 8; glow > 0; glow--) {
        beginShape();
        let tailLen = size * (1.6 + 0.2 * t); // tails of different lengths
        let amp = 14 + 4 * t;
        let phaseJitter = t * 1.1;
        stroke(
          255, 0, 255, 18 * glow
        );
        strokeWeight(glow * 2);
        for (let i = 0; i < 20; i++) {
          let pct = i / 19;
          let x = -pct * tailLen;
          let y =
            t *
            (amp + glow * 0.3) *
            Math.sin(
              this.tailPhase +
              pct * Math.PI * 1.5 +
              phaseJitter +
              0.7 * Math.sin(this.tailPhase * 0.7 + pct * 5)
            );
          vertex(x, y);
        }
        endShape();
      }
    }

    // Body
    noStroke();
    fill(this.color);
    ellipse(0, 0, size, size * 0.6);

    // Eye
    fill(0, 30, 80, 160);
    ellipse(size * 0.28, -2, 5, 5);

    pop();
  }

  resetGroupCenter() {
    this.behavior.resetGroupCenter();
  }

  reactToRipple() {
    this.behavior.reactToRipple();
  }

  get pos() {
    return this.behavior.pos;
  }
}
