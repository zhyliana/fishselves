class SwimBehavior {
  constructor(x, y) {
    this.sizeScale = random(0.9, 1.7);
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 1.5));
    this.reactionStrength = 1;
    this.groupCenter = createVector(random(width), random(height));
    this.radius = 15 * this.sizeScale;
    this.toMouse = random() < random(0.7, 0.9);
    this.shimmerTimer = 0;
  }

  update(strongWiggle) {
    if (this.shimmerTimer > 0) this.shimmerTimer--;

    let nextPos = p5.Vector.add(this.pos, this.vel);

    // Bounce if leaving the blob or getting too close to another fish
    if (this.distanceToClosestFish() > 1) {
      this.pos.add(this.vel);
    } else {
      this.vel.rotate(random(PI / 1.5, PI * 1.8)); // energetic bounce
      this.vel.setMag(random(1.5, 2.5));
    }

    if (strongWiggle) {
      
      let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
      if (d < width / 2) {
        let towardMouse = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
        towardMouse.setMag(map(d, 0, width / 2, 0.3, 0.02));
        this.vel.lerp(towardMouse, 0.01);
      }
    } else {
      if (this.nearEdge()) {
        let edgeDir = this.edgeFollowDirection();
        this.vel.lerp(edgeDir, 0.05);
      } else {
        let noiseAngle = noise(this.pos.x * 0.005, this.pos.y * 0.005, frameCount * 0.01) * TWO_PI * 2;
        let drift = p5.Vector.fromAngle(noiseAngle);
        drift.setMag(0.3);
        this.vel.lerp(drift, 0.02);
      }
    }

    this.avoidOthers();
    this.edges();
  }

  distanceToClosestFish() {
    let minDist = Infinity;
    fish.forEach(other => {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < minDist) minDist = d;
      }
    });
    return minDist;
  }

  resetGroupCenter() {
    this.groupCenter = createVector(random(width), random(height));
  }

  nearEdge() {
    const buffer = 50;
    return this.pos.x < buffer || this.pos.x > width - buffer || this.pos.y < buffer || this.pos.y > height - buffer;
  }

  edgeFollowDirection() {
    let dists = [this.pos.x, width - this.pos.x, this.pos.y, height - this.pos.y];
    let minIdx = dists.indexOf(min(dists));
    switch (minIdx) {
      case 0: return createVector(0, 1);
      case 1: return createVector(0, -1);
      case 2: return createVector(1, 0);
      case 3: return createVector(-1, 0);
    }
  }

  avoidOthers() {
    fish.forEach(other => {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < this.radius * 1.5) {
          let repulse = p5.Vector.sub(this.pos, other.pos);
          repulse.setMag(0.2 + this.shimmerTimer * 0.01);
          this.pos.add(repulse);
        }
      }
    });
  }

  reactToRipple() {
    this.reactionStrength = 2;
    this.shimmerTimer = 60;
    setTimeout(() => this.reactionStrength = 1, 1000);
  }

  edges() {
    this.pos.x = constrain(this.pos.x, 5, width - 5);
    this.pos.y = constrain(this.pos.y, 5, height - 5);
  }
}