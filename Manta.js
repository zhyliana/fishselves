class Manta extends CreatureBase {
  constructor(x, y) {
    super(x, y);
  }

  display(strongWiggle) {
    push();
    this.displayBubbles();
    translate(this.x, this.y);
    rotate(sin(this.phase) * (strongWiggle ? 0.25 : 0.08));
    this.displayBody();
    this.displayHead();
    this.displayTail(strongWiggle);
    this.displayEye();
    if (strongWiggle) this.onStrongWiggle();
    pop();
  }

  displayTail(strongWiggle) {
    // Double ribbon tail, glowy
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
  }
}
