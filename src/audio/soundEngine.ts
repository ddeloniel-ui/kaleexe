import { KeypadKey, PlaylistTrack } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private musicTimer: number | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private isMuted = false;
  private volume = 0.65;
  private stepIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 32;
      this.analyser.smoothingTimeConstant = 0.78;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.04);
    }
    if (this.audioEl) {
      this.audioEl.muted = muted;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.04);
    }
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public playCoinSound() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    const now = ctx.currentTime;

    // Subtle slot mechanical click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(190, now);
    clickOsc.frequency.exponentialRampToValueAtTime(75, now + 0.06);
    clickGain.gain.setValueAtTime(0.24, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.07);

    // Metallic coin ring (dual inharmonic partials)
    const freqs = [1568, 2349, 3136];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 0.045);
      osc.frequency.exponentialRampToValueAtTime(f * 0.995, now + 0.55);
      gain.gain.setValueAtTime(0.001, now + 0.045);
      gain.gain.linearRampToValueAtTime(0.14 / (i + 1), now + 0.055);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.55 - i * 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + 0.045);
      osc.stop(now + 0.58);
    });
  }

  public playStartupChime() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    const now = ctx.currentTime;
    // Warm nostalgic 5-note Nokia-inspired gentle chime
    const notes = [
      { freq: 659.25, t: 0.0, dur: 0.16 },
      { freq: 587.33, t: 0.15, dur: 0.16 },
      { freq: 369.99, t: 0.3, dur: 0.24 },
      { freq: 415.3, t: 0.54, dur: 0.22 },
      { freq: 554.37, t: 0.78, dur: 0.45 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.t);
      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.14, now + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.dur);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.dur + 0.02);
    });
  }

  public playSecretUnlockChime() {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const start = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.38);
    });
  }

  public playKeyTone(key: KeypadKey) {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || this.isMuted) return;

    const map: Record<KeypadKey, number> = {
      '1': 523.25,
      '2': 554.37,
      '3': 587.33,
      '4': 622.25,
      '5': 659.25,
      '6': 698.46,
      '7': 739.99,
      '8': 783.99,
      '9': 830.61,
      '*': 466.16,
      '0': 493.88,
      '#': 880.0,
      UP: 720,
      DOWN: 600,
      LEFT: 640,
      RIGHT: 680,
      CALL: 880,
      END: 440,
    };

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(map[key] || 640, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.065);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  public startTrack(track: PlaylistTrack) {
    this.stopTrack();
    const ctx = this.ensureContext();

    if (track.customUrl) {
      const audio = new Audio(track.customUrl);
      audio.loop = true;
      audio.volume = this.volume;
      audio.muted = this.isMuted;
      this.audioEl = audio;

      if (ctx && this.masterGain) {
        try {
          this.audioSourceNode = ctx.createMediaElementSource(audio);
          this.audioSourceNode.connect(this.masterGain);
        } catch {
          // Fallback cleanly to direct HTMLAudio output if MediaElementSource fails
        }
      }
      void audio.play().catch(() => {});
      return;
    }

    if (!ctx || !this.masterGain) return;

    this.stepIndex = 0;
    const beatMs = Math.round((60 / track.bpm) * 1000);

    const scheduleStep = () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const chordIdx = Math.floor(this.stepIndex / 4) % track.chords.length;
      const melodyIdx = this.stepIndex % track.melody.length;

      // Play warm Rhodes-like chord at bar boundaries
      if (this.stepIndex % 4 === 0) {
        const chord = track.chords[chordIdx];
        chord.forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const filter = this.ctx!.createBiquadFilter();
          const gain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.025);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(950, now);

          const dur = (beatMs / 1000) * 3.8;
          gain.gain.setValueAtTime(0.001, now + i * 0.025);
          gain.gain.linearRampToValueAtTime(0.055, now + i * 0.025 + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(now + i * 0.025);
          osc.stop(now + dur + 0.05);
        });
      }

      // Soft plucked note on gentle pattern
      if (this.stepIndex % 2 === 0 || this.stepIndex % 4 === 3) {
        const noteFreq = track.melody[melodyIdx];
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        const noteDur = (beatMs / 1000) * 1.4;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + noteDur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + noteDur + 0.04);
      }

      this.stepIndex += 1;
    };

    scheduleStep();
    this.musicTimer = window.setInterval(scheduleStep, beatMs);
  }

  public getAudioProgress(): { current: number; duration: number } | null {
    if (!this.audioEl) return null;
    const duration = Number.isFinite(this.audioEl.duration) ? Math.floor(this.audioEl.duration) : 0;
    const current = Math.floor(this.audioEl.currentTime || 0);
    return { current, duration };
  }

  public stopTrack() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl = null;
    }
    if (this.audioSourceNode) {
      try {
        this.audioSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.audioSourceNode = null;
    }
  }

  public getEqualizerLevels(bars = 8): number[] {
    if (!this.analyser) {
      return new Array(bars).fill(0.15);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    const out: number[] = [];
    for (let i = 0; i < bars; i++) {
      const val = data[i % data.length] ?? 0;
      out.push(Math.max(0.12, Math.min(1, val / 170)));
    }
    return out;
  }
}

export const soundEngine = new SoundEngine();
