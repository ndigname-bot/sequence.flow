// Web Audio API procedural sound effects for clean, tactile UI feedback
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Crisp, uplifting chime when a task is completed & next one advances
  playComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Dual harmonic chime (C6 -> G6) with bell decay
    const notes = [
      { freq: 1046.5, delay: 0, dur: 0.8, gain: 0.18 }, // C6
      { freq: 1318.5, delay: 0.08, dur: 0.9, gain: 0.16 }, // E6
      { freq: 1567.98, delay: 0.16, dur: 1.2, gain: 0.22 } // G6
    ];

    notes.forEach(({ freq, delay, dur, gain: noteGain }) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.0001, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(noteGain, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + dur);
    });
  }

  // Soft tactile pop when adding a task or pressing Enter
  playAdd() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gainNode.gain.setValueAtTime(0.09, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Gentle wake-up ping for "What's Next?" nudge notification
  playNudge() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const sound = new SoundEngine();
