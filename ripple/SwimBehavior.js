// Handles all movement and swim phase logic for a creature
class SwimBehavior {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.phase = random(TWO_PI);
    this.wiggle = 1;
    this.wigglePower = 1;
  }

  update(strongWiggle) {
    this.phase += 0.018 + (strongWiggle ? 0.13 : 0.05);
    this.baseX += sin(this.phase * 0.6) * 0.33;
    this.baseY += cos(this.phase * 0.4) * 0.23;
    let amp = strongWiggle ? 22 : 6;
    this.wiggle = lerp(this.wiggle, amp, 0.25);
    this.wigglePower = lerp(this.wigglePower, strongWiggle ? 2 : 1, 0.15);
    const x = this.baseX + sin(this.phase) * this.wiggle * this.wigglePower;
    const y = this.baseY + cos(this.phase * 0.8) * this.wiggle * 0.6 * this.wigglePower;
    return { x, y };
  }
}
