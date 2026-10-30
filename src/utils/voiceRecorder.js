/**
 * Voice Recorder Utility with MediaRecorder and Web Speech API.
 * Captures native audio clips and converts speech to text in real time.
 */

export class VoiceRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.recognition = null;
    this.transcript = '';
    this.startTime = 0;
  }

  async start({ onTranscriptUpdate, onTimeUpdate }) {
    this.audioChunks = [];
    this.transcript = '';
    this.startTime = Date.now();

    // 1. Get Microphone Stream
    this.stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      } 
    });

    // 2. Set up MediaRecorder
    let mimeType = 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      mimeType = 'audio/webm;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      mimeType = 'audio/ogg;codecs=opus';
    }

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    };

    this.mediaRecorder.start(250); // Slice every 250ms

    // 3. Set up Speech Recognition (if supported in browser/electron)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
          let interim = '';
          let final = '';
          for (let i = 0; i < event.results.length; i++) {
            const transcriptText = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcriptText + ' ';
            } else {
              interim += transcriptText;
            }
          }
          this.transcript = (final + interim).trim();
          if (onTranscriptUpdate) {
            onTranscriptUpdate(this.transcript);
          }
        };

        this.recognition.start();
      } catch (err) {
        console.warn('SpeechRecognition init warning:', err);
      }
    }

    // 4. Time Update Interval
    if (onTimeUpdate) {
      this.timeInterval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
        onTimeUpdate(elapsedSec);
      }, 500);
    }
  }

  async stop() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }

    const durationSec = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ text: this.transcript, audioDataUrl: null, duration: durationFormatted });
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const blob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType || 'audio/webm' });

        // Stop all audio tracks to release microphone
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }

        // Convert Blob to base64 Data URL for persistent storage in localStorage
        const reader = new FileReader();
        reader.onloadend = () => {
          const audioDataUrl = reader.result;
          resolve({
            text: this.transcript,
            audioDataUrl,
            duration: durationFormatted
          });
        };
        reader.readAsDataURL(blob);
      };

      try {
        this.mediaRecorder.stop();
      } catch (_) {
        resolve({ text: this.transcript, audioDataUrl: null, duration: durationFormatted });
      }
    });
  }

  cancel() {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.recognition) {
      try { this.recognition.stop(); } catch (_) {}
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch (_) {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.audioChunks = [];
  }
}
