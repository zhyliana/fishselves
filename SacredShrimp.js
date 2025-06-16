class SacredShrimp extends CreatureBase {
  constructor(x, y) {
    super(x, y);
    this.appendagePhase = random(TWO_PI);
    this.appendageCount = int(random(6, 11));
    this.innerSpiral = random(0.7, 1.2);
    this.lineColor = color(random(100, 255), random(150, 255), random(180, 255), 170);
    this.headGlow = color(255, 255, 240, 80);
    this.shellDetail = random(0.7, 1.4);
  }

  update(strongWiggle) {
    super.update(strongWiggle);
    this.appendagePhase += 0.04 + (strongWiggle ? 0.15 : 0.06);
  }

  displayBody() {
    // Sacred geometry shell: logarithmic spiral with radial lines
    // Spiral pulses with wiggle and appendage motion!
    let spiralScale =
      1.0 +
      0.09 * sin(this.appendagePhase * 1.1) +
      0.20 * (this.wigglePower - 1); // Pulses more when wiggling strongly

    stroke(this.lineColor);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let t = 0; t < 2.5 * PI; t += PI / 48) {
      let r = 18 * exp(0.23 * t) * this.shellDetail * spiralScale;
      let x = r * cos(t);
      let y = r * sin(t) * 0.75;
      vertex(x, y);
    }
    endShape();

    // Draw radial sacred geometry lines
    stroke(230, 200, 255, 60);
    for (let i = 0; i < 7; i++) {
      let angle = i * TWO_PI / 7;
      let len = 32 * this.shellDetail * spiralScale;
      line(0, 0, len * cos(angle), len * sin(angle));
    }
  }

  displayTail(strongWiggle) {
    // Seahorse-like curly tail with glowing sacred spiral
    push();
    rotate(-PI / 2);
    stroke(160, 210, 255, 80);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let t = 0; t < 1.1 * PI; t += PI / 36) {
      let r = 18 * exp(0.17 * t) * this.shellDetail;
      let x = r * cos(t + 0.2);
      let y = r * sin(t + 0.2) * 0.6;
      curveVertex(x, y);
    }
    endShape();
    pop();
  }

  displayEye() {
    // Floating 'all-seeing' eye with a soft glow
    push();
    translate(21, -7);
    for (let glow = 18; glow > 0; glow -= 3) {
      fill(255, 255, 240, 9);
      noStroke();
      ellipse(0, 0, glow * 1.1, glow * 0.7);
    }
    fill(40, 40, 70);
    ellipse(0, 0, 10, 7);
    fill(230, 255, 255, 230);
    ellipse(2, -1, 4, 2);
    pop();
  }

  displayHead() {
    // Subtle geometric 'halo' for the head
    push();
    translate(15, -6);
    stroke(255, 230, 180, 60);
    noFill();
    ellipse(0, 0, 20, 12);
    pop();
  }

  displayAppendages() {
    // Multiple flapping appendages with flower-petal geometry
    push();
    for (let i = 0; i < this.appendageCount; i++) {
      let theta = map(i, 0, this.appendageCount, -PI / 2.3, PI / 1.4);
      let flap = sin(this.appendagePhase + i * PI / 6) * 14 * this.innerSpiral;
      stroke(200 + 40 * sin(theta), 240, 200, 120);
      strokeWeight(2.3);
      noFill();
      beginShape();
      for (let j = 0; j < 8; j++) {
        let pct = j / 7;
        let len = 22 + 10 * sin(pct * PI * 1.2 + this.appendagePhase + i * 0.7);
        let r = pct * (flap + len);
        let x = r * cos(theta);
        let y = r * sin(theta);
        curveVertex(x, y);
      }
      endShape();
    }
    pop();
  }

  display(strongWiggle) {
    push();
    this.displayBubbles();
    translate(this.x, this.y);
    rotate(this.facingAngle);
    this.displayTail(strongWiggle);
    this.displayBody();
    this.displayHead();
    this.displayAppendages();
    this.displayEye();
    if (strongWiggle) this.onStrongWiggle();
    pop();
  }
}
