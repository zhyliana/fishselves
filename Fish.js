class Fish {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.phase = random(TWO_PI);
    this.baseCol = color(random(180, 255), random(100, 180), random(180, 255));
    this.wiggle = 1;
    this.wigglePower = 1;
    this.tailPhase = random(TWO_PI);

    this.bubbles = [];
    this.bubbleCooldown = 0;
  }

  update(strongWiggle) {
    // Body and tail wiggle logic (as before)
    this.phase += 0.018 + (strongWiggle ? 0.13 : 0.05);
    this.tailPhase += 0.18 + (strongWiggle ? 0.7 : 0.21);
    this.baseX += sin(this.phase * 0.6) * 0.33;
    this.baseY += cos(this.phase * 0.4) * 0.23;

    let amp = strongWiggle ? 22 : 6;
    this.wiggle = lerp(this.wiggle, amp, 0.25);
    this.wigglePower = lerp(this.wigglePower, strongWiggle ? 2 : 1, 0.15);

    this.x = this.baseX + sin(this.phase) * this.wiggle * this.wigglePower;
    this.y = this.baseY + cos(this.phase * 0.8) * this.wiggle * 0.6 * this.wigglePower;

    // Bubble blowing
    if (strongWiggle && this.bubbleCooldown <= 0) {
      this.bubbles.push({
        x: this.x + 15,
        y: this.y - 7,
        r: random(6, 13),
        t: millis(),
        vy: random(-0.8, -1.3)
      });
      this.bubbleCooldown = 8 + random(7); // frames between bubbles
    }
    this.bubbleCooldown = max(0, this.bubbleCooldown - 1);

    // Move bubbles up
    this.bubbles.forEach(b => {
      b.y += b.vy;
      b.x += sin(this.phase) * 0.12;
    });

    // Remove old bubbles
    this.bubbles = this.bubbles.filter(b => millis() - b.t < 1200);
  }

  display(strongWiggle) {
    push();
    // Draw bubbles behind the fish
    for (let b of this.bubbles) {
      let age = (millis() - b.t) / 1200;
      noStroke();
      fill(200, 230, 255, 90 * (1 - age));
      ellipse(b.x, b.y, b.r * (1 - 0.2 * age));
      fill(255, 255, 255, 30 * (1 - age));
      ellipse(b.x + b.r * 0.12, b.y - b.r * 0.18, b.r * 0.4, b.r * 0.25);
    }

    translate(this.x, this.y);
    rotate(sin(this.phase) * (strongWiggle ? 0.25 : 0.08));

    // Wiggle tail
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

    // Body (shaking)
    noStroke();

    // Glow Aura
    if (strongWiggle) {
      for (let r = 26; r > 14; r -= 2) {
        fill(255, 170, 240, 18);
        ellipse(0, 0, r + this.wiggle, r * 0.65 + this.wiggle * 0.4);
      }
    }

    fill(this.baseCol);
    ellipse(0, 0, 34, 22);
    fill(255, 255, 255, 60);
    ellipse(-6, 4, 7, 4);
    ellipse(4, -3, 4, 7);
    // Eye
    fill(0);
    ellipse(9, -3, 6, 6);
    pop();
  }
}


