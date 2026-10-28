// Multi-channel Web Audio Mixer for "Your atmosphere"
class AtmosphereMixer {
  constructor() {
    this.ctx = null;
    this.channels = {
      rain: { node: null, gainNode: null, filter: null, volume: 0 },
      brown: { node: null, gainNode: null, filter: null, volume: 0 },
      lofi: { node: null, gainNode: null, volume: 0 }
    };
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

  setRain(volume) {
    this.init();
    if (!this.ctx) return;
    this.channels.rain.volume = volume;

    if (volume <= 0) {
      if (this.channels.rain.node) {
        try { this.channels.rain.node.stop(); } catch(e) {}
        this.channels.rain.node.disconnect();
        this.channels.rain.node = null;
      }
      return;
    }

    if (!this.channels.rain.node) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.channels.rain.node = source;
      this.channels.rain.gainNode = gain;
      this.channels.rain.filter = filter;
    } else {
      this.channels.rain.gainNode.gain.setTargetAtTime(volume * 0.35, this.ctx.currentTime, 0.05);
    }
  }

  setBrown(volume) {
    this.init();
    if (!this.ctx) return;
    this.channels.brown.volume = volume;

    if (volume <= 0) {
      if (this.channels.brown.node) {
        try { this.channels.brown.node.stop(); } catch(e) {}
        this.channels.brown.node.disconnect();
        this.channels.brown.node = null;
      }
      return;
    }

    if (!this.channels.brown.node) {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 0.25;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

      source.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.channels.brown.node = source;
      this.channels.brown.gainNode = gain;
    } else {
      this.channels.brown.gainNode.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.05);
    }
  }

  setLofi(volume) {
    this.init();
    if (!this.ctx) return;
    this.channels.lofi.volume = volume;

    if (volume <= 0) {
      if (this.channels.lofi.node) {
        try { 
          this.channels.lofi.node.osc1.stop();
          this.channels.lofi.node.osc2.stop();
        } catch(e) {}
        this.channels.lofi.node = null;
      }
      return;
    }

    if (!this.channels.lofi.node) {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, now); // Om frequency 136.1Hz

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(142.1, now); // 6Hz theta focus differential

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.25, now);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.channels.lofi.node = { osc1, osc2 };
      this.channels.lofi.gainNode = gain;
    } else {
      this.channels.lofi.gainNode.gain.setTargetAtTime(volume * 0.25, this.ctx.currentTime, 0.05);
    }
  }
}

export const atmosphere = new AtmosphereMixer();
