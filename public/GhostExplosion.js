// Minimal GhostExplosion class
class GhostExplosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.t = 0;
    this.lifetime = 60;
  }
  update() { this.t++; }
  display() {
    push();
    translate(this.x, this.y);
    let r = 30 + this.t * 3;
    let alpha = map(this.t, 0, this.lifetime, 140, 0);
    noFill();
    stroke(220, 200, 255, alpha);
    strokeWeight(4);
    ellipse(0, 0, r, r * 0.8);
    for (let i = 0; i < 8; i++) {
      let angle = i * PI / 4 + this.t * 0.05;
      let len = r + 12 * sin(this.t * 0.12 + i);
      line(0, 0, cos(angle) * len, sin(angle) * len * 0.8);
    }
    pop();
  }
  finished() { return this.t > this.lifetime; }
}