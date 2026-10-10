// Web Audio API Sound Synthesizer für Blitzaufgaben
// Vollständig offline und ohne externe Sounddateien

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("blitz_sound_enabled") !== "false";
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
    localStorage.setItem("blitz_sound_enabled", this.enabled ? "true" : "false");
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Das charakteristische "Kaching!"-Münz-/Kassengeräusch
  playKaching() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Erster Schlag (tieferer Anschlag / "Ka-")
    this._playChime(now, 988, 0.25, 0.28, "triangle");

    // 2. Zweiter Schlag kurz danach (hellerer Glockenklang / "-ching!")
    this._playChime(now + 0.05, 1319, 0.45, 0.35, "sine");
    this._playChime(now + 0.05, 2638, 0.35, 0.15, "triangle");

    // 3. Metallischer Münz-Glanz (kurzer metallischer Transiente)
    this._playMetallicClick(now + 0.05);
  }

  _playChime(startTime, freq, duration, gainLevel, type = "sine") {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  _playMetallicClick(startTime) {
    // Kurzes Bandpass-Rauschen für den Münz-/Kassenanschlag
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(4500, startTime);
    filter.Q.setValueAtTime(3.0, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(startTime);
  }

  // Sanfter Ton bei Fehleingabe
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Klickton beim Tippen auf Tasten
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(500, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Feierlicher Schluss-Akkord bei Rundenende
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { f: 523.25, t: 0 },    // C5
      { f: 659.25, t: 0.1 },  // E5
      { f: 783.99, t: 0.2 },  // G5
      { f: 1046.50, t: 0.32 } // C6
    ];

    chords.forEach(({ f, t }) => {
      this._playChime(now + t, f, 0.45, 0.22, "triangle");
    });
  }
}

window.soundManager = new SoundManager();
