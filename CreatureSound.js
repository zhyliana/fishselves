class CreatureSound {
  constructor() {
    this.pitchOffset = random(-7, 8);
    this.grumbleSpeed = random(0.8, 1.5);
    this.grumbleNoteBase = random([
      "C#4", "D4", "D#4", "F4", "G4", "A4", "B4", "C5", "E5"
    ]);
    this.lastGrumble = 0;
  }

  maybeGrumble(strongWiggle) {
    if (
      strongWiggle &&
      millis() - this.lastGrumble > 140 / this.grumbleSpeed
    ) {
      let midi = Tone.Frequency(this.grumbleNoteBase).toMidi() +
        this.pitchOffset + int(random(-2, 3));
      let note = Tone.Frequency(midi, "midi").toNote();
      let duration = random([0.12, 0.16, 0.23, 0.28]) * this.grumbleSpeed;
      let velocity = 0.22 + random(0.14);
      fishGrumbleSynth.triggerAttackRelease(note, duration, undefined, velocity);
      this.lastGrumble = millis();
    }
  }
}
