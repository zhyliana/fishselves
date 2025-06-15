class Manta extends CreatureBase {
  constructor(x, y) {
    super(x, y);
  }

  display(strongWiggle) {
    push();
    this.displayBubbles();
    translate(this.x, this.y);
    rotate(sin(this.phase) * (strongWiggle ? 0.25 : 0.08));

    // Head
    noStroke();
    fill(this.baseCol);
    ellipse(0, 0, 34, 22);

    // Tail (double ribbons)
    const tailLen = 75;
    for (let t = -1; t <= 1; t += 2) {
      for (let glow = 8; glow > 0; glow--) {
        beginShape();
        let amp = t * 4 + 14;
        let phaseJitter = t * 1.1;
        stroke(255, 0, 255, 18 * glow);
        strokeWeight(glow * 2);
        fill(255, 255, 255, 30);
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

    // Glow Aura
    if (strongWiggle) {
      for (let r = 26; r > 14; r -= 2) {
        fill(255, 170, 240, 18);
        ellipse(0, 0, r + this.wiggle, r * 0.65 + this.wiggle * 0.4);
      }
    }

    // Dots
    fill(255, 255, 255, 60);
    ellipse(-6, 4, 7, 4);
    ellipse(4, -3, 4, 7);

    // Eye
    fill(0);
    ellipse(9, -3, 6, 6);
    pop();
  }
}
