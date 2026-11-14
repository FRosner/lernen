// Web Audio API Sound Synthesizer für Kuhrennen
// Vollständig offline und ohne externe Sounddateien

class KuhSoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("kuhrennen_sound_enabled") !== "false";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("kuhrennen_sound_enabled", this.enabled ? "true" : "false");
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Kurzer Klick beim Tippen auf Ziffern oder Buttons
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Richtige Antwort: Fröhliche Kuhglocke + Kaching-Klang
  playStepForward() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Kuhglocken-Anschlag (zwei leicht verstimmte Obertöne wie bei einer echten Alpenglocke)
    this._playCowbell(now, 587.33, 845, 0.22, 0.22);

    // 2. Heller Erfolgs-Chime ("Kaching!")
    this._playChime(now + 0.045, 1174.66, 0.35, 0.25, "sine");
    this._playChime(now + 0.045, 2349.32, 0.28, 0.12, "triangle");
  }

  // Sanftes Kuhglocken-Geräusch (auch für Lobby/Mitspieler-Ereignisse)
  playCowbellOnly() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this._playCowbell(now, 540, 810, 0.25, 0.18);
  }

  _playCowbell(startTime, f1, f2, duration, gainLevel) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = "square";
    osc2.type = "square";
    osc1.frequency.setValueAtTime(f1, startTime);
    osc2.frequency.setValueAtTime(f2, startTime);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime((f1 + f2) / 2, startTime);
    filter.Q.setValueAtTime(2.5, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.02);
    osc2.stop(startTime + duration + 0.02);
  }

  _playChime(startTime, freq, duration, gainLevel, type = "sine") {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.04);
  }

  // Falsche Antwort (-0,25 Schritte): Stolper-Ton / kurzes tiefes "Oje-Muuuh"
  playStumble() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.exponentialRampToValueAtTime(115, now + 0.24);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(260, now + 0.24);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.27);
  }

  // Lustiges "Muuuh!" (z. B. bei Kuh-Auswahl oder Spielstart)
  playMoo(pitchFactor = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    const baseFreq = 145 * pitchFactor;
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(baseFreq * 0.92, now);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.12, now + 0.18);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.85, now + 0.52);

    // Vokal-Filter ("Uuu-hhh")
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(340 * pitchFactor, now);
    filter.frequency.linearRampToValueAtTime(480 * pitchFactor, now + 0.2);
    filter.frequency.linearRampToValueAtTime(310 * pitchFactor, now + 0.52);
    filter.Q.setValueAtTime(2.2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.06);
    gain.gain.setValueAtTime(0.25, now + 0.32);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.58);
  }

  // Roboter-Kuh-Sound beim Hinzufügen oder Schwierigkeit-Wechseln (je nach Stufe!)
  playRobotMoo(difficulty = "leicht") {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (difficulty === "baby") {
      // Süßes R2D2-Piepsen + hohes Baby-Roboter-Muuuh
      this._playChime(now, 1046.5, 0.07, 0.16, "sine");
      this._playChime(now + 0.065, 1396.9, 0.08, 0.18, "sine");
      this._playChime(now + 0.14, 1174.7, 0.07, 0.15, "triangle");
      this._playVocoderMoo(now + 0.21, 310, 420, 280, 0.36, 18, "triangle", 0.2);
    } else if (difficulty === "leicht") {
      // Freundliches 8-Bit Blech-Roboter "Biep-Boop-Muh"
      this._playChime(now, 523.25, 0.06, 0.14, "square");
      this._playChime(now + 0.07, 659.25, 0.06, 0.14, "square");
      this._playChime(now + 0.14, 440.0, 0.06, 0.14, "square");
      this._playVocoderMoo(now + 0.21, 185, 215, 155, 0.42, 28, "square", 0.18);
    } else if (difficulty === "mittel") {
      // Futuristischer Cyber-Scan + Vocoder-Muh
      const cyberNotes = [440, 554.37, 659.25, 880];
      cyberNotes.forEach((f, idx) => {
        this._playChime(now + idx * 0.04, f, 0.055, 0.14, "sawtooth");
      });
      this._playVocoderMoo(now + 0.17, 145, 175, 125, 0.46, 36, "sawtooth", 0.22);
    } else if (difficulty === "schwer") {
      // Schwerer Mecha-Servo + tiefes Kampf-Schnauben
      this._playLaserSweep(now, 140, 520, 0.16, 0.18, "sawtooth");
      this._playCowbell(now + 0.14, 220, 330, 0.18, 0.2);
      this._playVocoderMoo(now + 0.18, 98, 122, 78, 0.52, 24, "sawtooth", 0.28);
    } else {
      // Terminator ("Muh-minator"): Metallischer Doppel-Schlag + Laser + Cyborg-Dröhnen
      this._playCowbell(now, 110, 165, 0.16, 0.28);
      this._playCowbell(now + 0.13, 110, 165, 0.2, 0.3);
      this._playLaserSweep(now + 0.24, 1750, 320, 0.18, 0.18, "sawtooth");
      this._playVocoderMoo(now + 0.28, 68, 86, 52, 0.62, 42, "sawtooth", 0.32);
    }
  }

  // Interner Synthesizer für metallisch-roboterhaftes "Muuuh" mit Ring-/AM-Modulation
  _playVocoderMoo(startTime, fStart, fPeak, fEnd, duration, modFreq, waveType, gainLevel) {
    const osc = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const modOsc = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const outGain = this.ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(fStart, startTime);
    osc.frequency.linearRampToValueAtTime(fPeak, startTime + duration * 0.35);
    osc.frequency.linearRampToValueAtTime(fEnd, startTime + duration);

    oscSub.type = "square";
    oscSub.frequency.setValueAtTime(fStart * 1.5, startTime);
    oscSub.frequency.linearRampToValueAtTime(fPeak * 1.5, startTime + duration * 0.35);
    oscSub.frequency.linearRampToValueAtTime(fEnd * 1.5, startTime + duration);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(fStart * 2.4, startTime);
    filter.frequency.linearRampToValueAtTime(fPeak * 2.8, startTime + duration * 0.4);
    filter.frequency.linearRampToValueAtTime(fEnd * 2.0, startTime + duration);
    filter.Q.setValueAtTime(3.2, startTime);

    // Roboter-Puls-Modulation
    modOsc.type = "square";
    modOsc.frequency.setValueAtTime(modFreq, startTime);
    modGain.gain.setValueAtTime(gainLevel * 0.45, startTime);

    outGain.gain.setValueAtTime(0.001, startTime);
    outGain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.03);
    outGain.gain.setValueAtTime(gainLevel * 0.9, startTime + duration * 0.7);
    outGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    oscSub.connect(filter);
    filter.connect(outGain);
    modOsc.connect(modGain);
    modGain.connect(outGain.gain);
    outGain.connect(this.ctx.destination);

    osc.start(startTime);
    oscSub.start(startTime);
    modOsc.start(startTime);

    const stopAt = startTime + duration + 0.03;
    osc.stop(stopAt);
    oscSub.stop(stopAt);
    modOsc.stop(stopAt);
  }

  _playLaserSweep(startTime, fStart, fEnd, duration, gainLevel, type = "sawtooth") {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(fStart, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  // Countdown-Ton (3 - 2 - 1 - LOS!)
  playCountdownTick(isGo = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (!isGo) {
      this._playChime(now, 440, 0.18, 0.22, "triangle");
    } else {
      // LOS! Hoher Doppel-Akkord + Kuhglocke
      this._playChime(now, 880, 0.4, 0.28, "triangle");
      this._playChime(now + 0.04, 1108.73, 0.4, 0.22, "sine");
      this._playCowbell(now, 659.25, 987.77, 0.3, 0.2);
    }
  }

  // Sieges-Fanfare mit Kuhglocken-Jubel
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0.0, d: 0.22 },  // C5
      { f: 659.25, t: 0.12, d: 0.22 }, // E5
      { f: 783.99, t: 0.24, d: 0.22 }, // G5
      { f: 1046.5, t: 0.36, d: 0.55 }  // C6
    ];

    notes.forEach(({ f, t, d }) => {
      this._playChime(now + t, f, d, 0.25, "triangle");
    });

    this._playCowbell(now + 0.36, 587.33, 880, 0.35, 0.18);
    this._playCowbell(now + 0.55, 659.25, 987.77, 0.4, 0.2);
  }

  // Eigene Sieges-/Blech-Fanfare, wenn eine Roboter-Kuh das Rennen gewinnt!
  playRobotFanfare(difficulty = "leicht") {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (difficulty === "schwer" || difficulty === "terminator") {
      // Dramatische Cyborg-/Mecha-Fanfare ("Duhn-Duhn ... Duhn-Duhn-Duhn!")
      const hits = [
        { f: 110, t: 0.0, d: 0.16 },
        { f: 110, t: 0.16, d: 0.16 },
        { f: 110, t: 0.38, d: 0.14 },
        { f: 130.81, t: 0.52, d: 0.18 },
        { f: 146.83, t: 0.68, d: 0.55 }
      ];
      hits.forEach(({ f, t, d }) => {
        this._playChime(now + t, f, d, 0.26, "sawtooth");
        this._playCowbell(now + t, f * 2, f * 3, d * 0.9, 0.18);
      });
      this._playLaserSweep(now + 0.68, 1600, 260, 0.45, 0.16, "sawtooth");
    } else {
      // Verspielte 8-Bit-/Blech-Roboter-Siegesmelodie
      const chipNotes = [
        { f: 523.25, t: 0.0, d: 0.11 },
        { f: 659.25, t: 0.1, d: 0.11 },
        { f: 783.99, t: 0.2, d: 0.11 },
        { f: 1046.5, t: 0.3, d: 0.18 },
        { f: 783.99, t: 0.46, d: 0.11 },
        { f: 1046.5, t: 0.56, d: 0.42 }
      ];
      chipNotes.forEach(({ f, t, d }) => {
        this._playChime(now + t, f, d, 0.18, "square");
      });
      this._playVocoderMoo(now + 0.62, 220, 260, 195, 0.35, 25, "square", 0.16);
    }
  }
}

window.soundManager = new KuhSoundManager();
