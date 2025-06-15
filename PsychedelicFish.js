class PsychedelicFish extends CreatureBase {
  constructor(x, y) {
    super(x, y);
    this.size = 75;
  }

  displayTail(strongWiggle) {
    // Trident shape
    this.displayStrokeOnly();

    beginShape();
    vertex(-this.size * 0.75, 5 * sin(this.tailPhase));
    vertex(0, 0);
    vertex(-this.size * 0.75, -5 * sin(this.tailPhase));
    endShape();
  }

  displayBody() {
    this.displayStrokeOnly();

    ellipse(0, 0, this.size, this.size * 0.6);
  }

  displayEye() {
    fill(this.baseCol);
    ellipse(this.size * 0.3, -2, 4, 4);
  }

  displayStrokeOnly() {
    noFill();
    strokeWeight(2);
    stroke(this.baseCol)
  }
}
