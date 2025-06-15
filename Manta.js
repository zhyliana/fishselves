class Manta {
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

    // For blowing bubbles when they wiggle
    this.bubbles = [];
    this.bubbleCooldown = 0;
    this.pitchOffset = random(-7, 8); // semitone detune
    this.grumbleSpeed = random(0.8, 1.5); // 1 = normal, <1 slower, >1 faster
    this.grumbleNoteBase = random([
      "C#4", "D4", "D#4", "F4", "G4", "A4", "B4", "C5", "E5"
    ]); // per-fish "voice"

    this.isGrumbling = false;
    this.lastGrumble = 0;
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

    if (strongWiggle && millis() - this.lastGrumble > 140 / this.grumbleSpeed) {
      // Pick this fish's base, detuned & intervalled
      let midi = Tone.Frequency(this.grumbleNoteBase).toMidi() +
        this.pitchOffset + int(random(-2, 3));
      let note = Tone.Frequency(midi, "midi").toNote();
      let duration = random([0.12, 0.16, 0.23, 0.28]) * this.grumbleSpeed;
      let velocity = 0.22 + random(0.14);

      fishGrumbleSynth.triggerAttackRelease(note, duration, undefined, velocity);
      this.lastGrumble = millis();
    }
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

    // Tail
    const tailLen = 75
    for (let t = -1; t <= 1; t += 2) {
      for (let glow = 8; glow > 0; glow--) {
        beginShape();
        let amp = t * 4 + 14;
        let phaseJitter = t * 1.1;
        stroke(
          255, 0, 255, 18 * glow
        );
        strokeWeight(glow * 2);
        fill(255, 255, 255, 30);
        for (let i = 0; i < 20; i++) {
          let pct = i / 19;
          let x = -pct * tailLen;
          let y =
            t *
            (amp + glow * 0.3) *
            Math.sin(
              this.tailPhase +
              pct * Math.PI * 1.5 +
              phaseJitter +
              0.7 * Math.sin(this.tailPhase * 0.7 + pct * 5)
            );
          vertex(x, y);
        }
        endShape();
      }
    }

    // Glow Aura
    if (strongWiggle) {
      for (let r = 26; r > 14; r -= 2) {
        fill(255, 170, 240, 18);
        ellipse(0, 0, r + this.wiggle, r * 0.65 + this.wiggle * 0.4);
      }
    }

    // Head
    noStroke()
    fill(this.baseCol);
    ellipse(0, 0, 34, 22);

    // Dots
    fill(255, 255, 255, 60);
    ellipse(-6, 4, 7, 4);
    ellipse(4, -3, 4, 7);

    // Eye
    fill(0);
    ellipse(9, -3, 6, 6);
    pop();
  }
}