// Bubbles.js
class Bubbles {
  constructor() {
    this.list = [];
  }

  blow(x, y) {
    this.list.push({
      x: x + 15,
      y: y - 7,
      r: random(6, 13),
      t: millis(),
      vy: random(-0.8, -1.3)
    });
  }

  update(phase) {
    this.list.forEach(b => {
      b.y += b.vy;
      b.x += sin(phase) * 0.12;
    });
    this.list = this.list.filter(b => millis() - b.t < 1200);
  }

  display() {
    for (let b of this.list) {
      let age = (millis() - b.t) / 1200;
      noStroke();
      fill(200, 230, 255, 90 * (1 - age));
      ellipse(b.x, b.y, b.r * (1 - 0.2 * age));
      fill(255, 255, 255, 30 * (1 - age));
      ellipse(b.x + b.r * 0.12, b.y - b.r * 0.18, b.r * 0.4, b.r * 0.25);
    }
  }
}
