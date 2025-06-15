class PsychedelicFish extends CreatureBase {
  constructor(x, y) {
    super(x, y);
  }

  display(strongWiggle) {
    push();
    this.displayBubbles();
    noFill();
    strokeWeight(2);
    stroke(this.baseCol);

    translate(this.x, this.y);
    rotate(sin(this.phase) * (strongWiggle ? 0.25 : 0.08));

    // Tail (simple trident)
    let size = 75;
    beginShape();
    vertex(-size * 0.75, 5 * sin(this.tailPhase));
    vertex(0, 0);
    vertex(-size * 0.75, -5 * sin(this.tailPhase));
    endShape();

    // Body
    ellipse(0, 0, size, size * 0.6);

    // Eye
    fill(this.baseCol);
    ellipse(size * 0.3, -2, 4, 4);

    pop();

    // Glow Aura
    if (strongWiggle) {
      for (let r = 26; r > 14; r -= 2) {
        fill(255, 170, 240, 18);
        ellipse(this.x, this.y, r + this.wiggle, r * 0.65 + this.wiggle * 0.4);
      }
    }
  }
}
