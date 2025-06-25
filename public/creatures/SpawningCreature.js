// --- SpawningCreature.js ---
// Wraps any Creature class to animate a pixel-attraction spawn effect.
class SpawningCreature {
  constructor(creature, x, y, duration = 3200) {
    this.creature = creature;
    this.x = x;
    this.y = y;
    this.spawnStart = millis();
    this.duration = random(3000, 5000); // ms, randomized for variety
    this.done = false;
    this.progress = 0;
    // Generate a cloud of particles to "become" the creature
    this.particles = [];
    let numParticles = 64 + int(random(32));
    for (let i = 0; i < numParticles; i++) {
      let angle = random(TWO_PI);
      let distFromCenter = random(80, 260);
      this.particles.push({
        x: x + cos(angle) * distFromCenter,
        y: y + sin(angle) * distFromCenter,
        tx: x,
        ty: y,
        r: random(3, 10),
        col: lerpColor(color(255, 255, 255), creature.baseCol || color(180, 200, 255), random()),
        speed: random(0.9, 1.3)
      });
    }
  }

  update() {
    this.progress = constrain((millis() - this.spawnStart) / this.duration, 0, 1);
    if (this.progress === 1 && !this.done) {
      this.done = true;
    }
    // Move each particle toward (this.x, this.y)
    for (let p of this.particles) {
      p.x += (this.x - p.x) * 0.07 * p.speed;
      p.y += (this.y - p.y) * 0.07 * p.speed;
    }
  }

  display() {
    // Draw particles
    for (let p of this.particles) {
      noStroke();
      fill(p.col, 120 * (1 - this.progress));
      ellipse(p.x, p.y, p.r * (1 - this.progress * 0.6));
    }
    // Draw creature, scaling in as it forms
    push();
    translate(this.x, this.y);
    scale(0.14 + this.progress * 0.92);
    this.creature.display(false);
    pop();
  }

  finished() {
    return this.done;
  }
}
