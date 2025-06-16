// Base class for all aquatic creatures (Fish, Manta, PsychedelicFish, etc.)
class CreatureBase {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.phase = random(TWO_PI);
    this.baseCol = color(random(180, 255), random(100, 180), random(180, 255));
    this.facingAngle = 0;
    this.wiggle = 1;
    this.wigglePower = 1;

    this.tailPhase = random(TWO_PI);

    // Swimming Behavior
    this.swim = new SwimBehavior(x, y, 60, windowHeight - 60);

    // Bubbles
    this.bubbles = new Bubbles();
    this.bubbleCooldown = 0;

    // Sound
    this.sound = new CreatureSound();
  }

  update(strongWiggle) {
    const swimPos = this.swim.update(strongWiggle);
    this.x = swimPos.x;
    this.y = swimPos.y;
    this.tailPhase += 0.07 + (strongWiggle ? 0.23 : 0.07);
    this.facingAngle = swimPos.facingAngle;
    this.wiggle = this.swim.wiggle;
    this.wigglePower = this.swim.wigglePower;

    // Bubble blowing
    if (strongWiggle && this.bubbleCooldown <= 0) {
      this.bubbles.blow(this.x, this.y);
      this.bubbleCooldown = 8 + random(7);
    }
    this.bubbleCooldown = max(0, this.bubbleCooldown - 1);

    // Update bubbles
    this.bubbles.update(this.phase);

    // Grumble sound
    this.sound.maybeGrumble(strongWiggle);
  }

  displayBubbles() {
    this.bubbles.display();
  }

  display(strongWiggle) {
    push();
    this.displayBubbles();
    translate(this.x, this.y);
    rotate(this.facingAngle);
    rotate(sin(this.swim.phase) * (strongWiggle ? 0.25 : 0.08));
    this.displayTail(strongWiggle);
    this.displayBody();
    this.displayEye();
    if (strongWiggle) this.onStrongWiggle();
    pop();
  }

  displayBody() {
    // Default: generic oval body with dots
    noStroke()
    fill(this.baseCol);
    ellipse(0, 0, 34, 22);
    fill(255, 255, 255, 60);
    ellipse(-6, 4, 7, 4);
    ellipse(4, -3, 4, 7);
  }

  displayEye() {
    fill(0);
    ellipse(9, -3, 6, 6);
  }

  displayTail(strongWiggle) {
    // Default: single wavy ribbon
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
  }

  onStrongWiggle() {
    // Default: aura glow
    noStroke()
    for (let r = 26; r > 14; r -= 2) {
      fill(255, 170, 240, 18);
      ellipse(0, 0, r + this.wiggle, r * 0.65 + this.wiggle * 0.4);
    }
  }
}
