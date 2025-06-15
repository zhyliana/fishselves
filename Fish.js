class Fish extends CreatureBase {
  constructor(x, y) {
    super(x, y);
  }

  display(strongWiggle) {
    push();
    this.displayBubbles();
    translate(this.x, this.y);
    rotate(sin(this.phase) * (strongWiggle ? 0.25 : 0.08));

    // Tail
    stroke(180, 100, 255, 150);
    strokeWeight(6);
    noFill();
    beginShape();
    for (let i = 0; i <= 12; i++) {
      let t = i / 12;
      let tx = -30 * t;
      let ty =
        (sin(this.tailPhase + t * PI * 2) +
          0.6 * sin(this.tailPhase * 0.5 + t * PI * 5)) *
        (strongWiggle ? 12 : 5) *
        (1 - t);
      curveVertex(tx, ty);
    }
    endShape();

    // Glow Aura
    if (strongWiggle) {
      for (let r = 26; r > 14; r -= 2) {
        fill(255, 170, 240, 18);
        ellipse(this.x, this.y, r + this.wiggle, r * 0.65 + this.wiggle * 0.4);
      }
    }

    // Head
    noStroke();
    fill(this.baseCol);
    ellipse(0, 0, 34, 22);

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
