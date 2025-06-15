// Base class for all aquatic creatures (Fish, Manta, PsychedelicFish, etc.)
class CreatureBase {
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
    this.pitchOffset = random(-7, 8);
    this.grumbleSpeed = random(0.8, 1.5);
    this.grumbleNoteBase = random([
      "C#4", "D4", "D#4", "F4", "G4", "A4", "B4", "C5", "E5"
    ]);
    this.isGrumbling = false;
    this.lastGrumble = 0;
  }

  update(strongWiggle) {
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
      this.bubbleCooldown = 8 + random(7);
    }
    this.bubbleCooldown = max(0, this.bubbleCooldown - 1);

    // Move bubbles up
    this.bubbles.forEach(b => {
      b.y += b.vy;
      b.x += sin(this.phase) * 0.12;
    });
    this.bubbles = this.bubbles.filter(b => millis() - b.t < 1200);

    // Grumble sound
    if (strongWiggle && millis() - this.lastGrumble > 140 / this.grumbleSpeed) {
      let midi = Tone.Frequency(this.grumbleNoteBase).toMidi() + this.pitchOffset + int(random(-2, 3));
      let note = Tone.Frequency(midi, "midi").toNote();
      let duration = random([0.12, 0.16, 0.23, 0.28]) * this.grumbleSpeed;
      let velocity = 0.22 + random(0.14);
      fishGrumbleSynth.triggerAttackRelease(note, duration, undefined, velocity);
      this.lastGrumble = millis();
    }
  }

  displayBubbles() {
    for (let b of this.bubbles) {
      let age = (millis() - b.t) / 1200;
      noStroke();
      fill(200, 230, 255, 90 * (1 - age));
      ellipse(b.x, b.y, b.r * (1 - 0.2 * age));
      fill(255, 255, 255, 30 * (1 - age));
      ellipse(b.x + b.r * 0.12, b.y - b.r * 0.18, b.r * 0.4, b.r * 0.25);
    }
  }
}
