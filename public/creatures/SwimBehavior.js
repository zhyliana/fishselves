// Handles all movement and swim phase logic for a creature
class SwimBehavior {
  constructor(x, y, minY = 60, maxY = windowHeight - 60) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.phase = random(TWO_PI);
    this.wiggle = 1;
    this.wigglePower = 1;
    this.minY = minY; // Margin for top
    this.maxY = maxY; // Margin for bottom
    // Direction: 1 (right), -1 (left)
    this.direction = random([1, -1]);
    this.speed = random(1.2, 2.5) * this.direction;
    this.prevX = x;
    this.facingAngle = this.direction > 0 ? 0 : PI;
    this.sadMode = false;
  }

  update(strongWiggle) {
    this.phase += 0.018 + (strongWiggle ? 0.13 : 0.05);

    // Move baseX forward horizontally
    this.baseX += this.speed;

    // Sinewave in Y (keeps within minY/maxY)
    this.baseY += sin(this.phase * 0.6) * 0.6;
    this.baseY = constrain(this.baseY, this.minY, this.maxY);

    let amp = strongWiggle ? 22 : 6;
    this.wiggle = lerp(this.wiggle, amp, 0.25);
    this.wigglePower = lerp(this.wigglePower, strongWiggle ? 2 : 1, 0.15);

    let x = this.baseX + sin(this.phase) * this.wiggle * this.wigglePower;
    let y =
      this.baseY + cos(this.phase * 0.8) * this.wiggle * 0.6 * this.wigglePower;
    if (this.sadMode) {
      x = windowWidth + sin(this.phase / 8) * 50
      y += windowHeight / 2

      return { x, y, facingAngle: 0 }
    }

    // WRAP X AROUND: left/right join together
    if (x > windowWidth + 30) {
      this.baseX = -30;
      x = this.baseX;
    } else if (x < -30) {
      this.baseX = windowWidth + 30;
      x = this.baseX;
    }

    // Set facing angle
    let dx = x - this.prevX;
    this.facingAngle = dx >= 0 ? 0 : PI; // 0 for right, PI for left

    return { x, y, facingAngle: this.facingAngle };
  }

  setSadMode(isSad) {
    this.sadMode = isSad;
  }
}
