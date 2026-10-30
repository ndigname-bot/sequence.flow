import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Coffee, 
  Bookmark, 
  ExternalLink, 
  Plus, 
  Headphones, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  SkipBack, 
  SkipForward, 
  Settings,
  Music2,
  Waves
} from 'lucide-react';
import { sound } from '../utils/sound';

const TRACKS = [
  {
    id: 'lofi-1',
    category: 'Lo-fi',
    title: 'Blue hour, slow mornings',
    desc: 'Lo-fi · Soft beats · 72 BPM',
    duration: '4:32',
    durationSec: 272,
    synthType: 'lofi'
  },
  {
    id: 'ambient-1',
    category: 'Ambient',
    title: 'A little room to think',
    desc: 'Ambient · Warm pads · No vocals',
    duration: '6:18',
    durationSec: 378,
    synthType: 'ambient'
  },
  {
    id: 'piano-1',
    category: 'Piano',
    title: 'Notes through the window',
    desc: 'Piano · Felt keys · Gentle pace',
    duration: '3:56',
    durationSec: 236,
    synthType: 'piano'
  },
  {
    id: 'electronic-1',
    category: 'Electronic',
    title: 'Quiet circuit',
    desc: 'Electronic · Minimal pulse · 90 BPM',
    duration: '5:24',
    durationSec: 324,
    synthType: 'electronic'
  },
  {
    id: 'nature-1',
    category: 'Nature',
    title: 'Rain in the cedar grove',
    desc: 'Nature · Field textures · Soft rain',
    duration: '8:18',
    durationSec: 498,
    synthType: 'rain'
  }
];

export default function FocusModeView({
  task,
  secondsRemaining,
  isPaused,
  onPauseToggle,
  onEndSession,
  onOpenSettings,
  onCaptureNote,
  linkedNote,
  onOpenNote
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(106); // 1:46 default in Figma
  const [volume, setVolume] = useState(0.7);
  const [quickThought, setQuickThought] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  // Audio Context Ref for Web Audio synthesizer
  const audioCtxRef = useRef(null);
  const synthNodesRef = useRef([]);

  const currentTrack = TRACKS[currentTrackIndex] || TRACKS[0];

  const categories = ['All', 'Lo-fi', 'Ambient', 'Piano', 'Electronic', 'Nature'];

  const filteredTracks = selectedCategory === 'All' 
    ? TRACKS 
    : TRACKS.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());

  // Format time (MM:SS)
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer Circle Math
  const totalSessionSeconds = 30 * 60;
  const progressPct = Math.max(0, Math.min(100, ((totalSessionSeconds - secondsRemaining) / totalSessionSeconds) * 100));
  const strokeDashoffset = 565 - (565 * progressPct) / 100;

  // Real-time audio synthesizer for ambient soundtrack
  const startSynth = (type) => {
    stopSynth();
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'rain') {
        // Pink / Brown noise for rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.2;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        synthNodesRef.current = [whiteNoise, filter, masterGain];
      } else {
        // Ambient chord drone (E minor / A minor warmth)
        const freqs = type === 'lofi' ? [146.83, 220, 261.63, 329.63] : [110, 164.81, 220, 329.63];
        const oscs = freqs.map((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);
          osc.connect(filter);
          filter.connect(masterGain);
          osc.start();
          return osc;
        });
        synthNodesRef.current = [...oscs, masterGain];
      }
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  };

  const stopSynth = () => {
    try {
      if (synthNodesRef.current.length > 0) {
        synthNodesRef.current.forEach(node => {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        });
        synthNodesRef.current = [];
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (_) {}
  };

  const togglePlayMusic = () => {
    if (isPlayingMusic) {
      stopSynth();
      setIsPlayingMusic(false);
    } else {
      startSynth(currentTrack.synthType);
      setIsPlayingMusic(true);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTimeSec(0);
    if (isPlayingMusic) {
      startSynth(TRACKS[nextIdx].synthType);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTimeSec(0);
    if (isPlayingMusic) {
      startSynth(TRACKS[prevIdx].synthType);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlayingMusic) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= currentTrack.durationSec) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingMusic, currentTrack]);

  useEffect(() => {
    return () => stopSynth();
  }, []);

  const handleSaveThought = (e) => {
    e.preventDefault();
    if (!quickThought.trim()) return;
    onCaptureNote({
      id: `thought-${Date.now()}`,
      title: quickThought.trim().slice(0, 50),
      content: quickThought.trim(),
      project: task?.project || 'General',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setQuickThought('');
    setIsCapturing(false);
    sound.playComplete();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">A little space to go deep.</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            One task, a clear intention, and a soundtrack that stays with you.
          </p>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#070B16] hover:bg-[#0C1224] border border-slate-800 text-xs text-slate-300 font-medium transition cursor-pointer self-start md:self-auto"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>Session settings</span>
        </button>
      </div>

      {/* Main Two-Column Focus Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: ACTIVE TASK & CIRCULAR COUNTDOWN TIMER      */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-2xl p-6 md:p-8 space-y-6">
          {/* Project Breadcrumb Tag */}
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{task?.project || 'Website redesign'}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Design exploration</span>
          </div>

          {/* Task Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            {task?.title || 'Explore the new homepage direction'}
          </h2>

          {/* Large Circular Countdown Timer with Living Focus Breath */}
          <div className="flex flex-col items-center justify-center py-4 relative">
            <div className={`relative w-56 h-56 flex items-center justify-center transition-all duration-700 ${!isPaused ? 'animate-breathe-focus' : ''}`}>
              {/* SVG Timer Arc */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="rgba(30, 41, 59, 0.4)"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Active Progress Ring with Glow */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="url(#timerGradient)"
                  strokeWidth="8"
                  strokeDasharray="565"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-cyan-300 font-bold mb-1">
                  <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-cyan-400 animate-ping'}`} />
                  <span>{isPaused ? 'PAUSED' : 'IN FOCUS'}</span>
                </div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-1">
                  remaining of 30 minutes
                </span>
              </div>
            </div>

            {/* Action Buttons: Pause & End Session */}
            <div className="flex items-center gap-3 mt-6 w-full max-w-xs">
              <button
                onClick={onPauseToggle}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue transition cursor-pointer active:scale-98"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume session</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause session</span>
                  </>
                )}
              </button>

              <button
                onClick={onEndSession}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-xs transition cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                <span>End session</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>A 5 min break follows. One thing at a time.</span>
            </div>
          </div>

          {/* Linked Note Card (Image 1 Bottom Left) */}
          <div className="rounded-2xl bg-[#050810] border border-slate-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                <span>{linkedNote?.title || 'Homepage direction'}</span>
              </div>
              <button
                onClick={() => onOpenNote && onOpenNote(linkedNote)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                <span>Open note</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {linkedNote?.content || 'Keep the hero calm, reduce the number of CTAs, and make the navigation feel more editorial.'}
            </p>

            {isCapturing ? (
              <form onSubmit={handleSaveThought} className="pt-2 space-y-2 animate-fade-in">
                <input
                  type="text"
                  value={quickThought}
                  onChange={(e) => setQuickThought(e.target.value)}
                  placeholder="Capture a thought without leaving your session..."
                  autoFocus
                  className="w-full bg-[#080D1C] text-xs text-white px-3 py-2 rounded-xl border border-blue-500/50 outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCapturing(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCapturing(true)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition cursor-pointer pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Capture a thought without leaving your session...</span>
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: YOUR FOCUS SOUNDTRACK (FIGMA IMAGE 1)      */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-2xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Soundtrack Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Your focus soundtrack</span>
                  <Headphones className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Find a rhythm. Let the rest fall away.</p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-[#050810] border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Track List */}
            <div className="space-y-2 pt-2">
              {filteredTracks.map((t, idx) => {
                const isActive = currentTrack.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      const realIndex = TRACKS.findIndex(track => track.id === t.id);
                      setCurrentTrackIndex(realIndex);
                      setCurrentTimeSec(0);
                      if (isPlayingMusic) {
                        startSynth(t.synthType);
                      }
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-950/40 border-blue-500/50 shadow-inner'
                        : 'bg-[#050810] border-slate-800/80 hover:border-slate-700 hover:bg-[#070D1C]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-blue-600 text-white shadow-glow-blue' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {isActive && isPlayingMusic ? (
                          <Waves className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Music2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{t.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">{t.duration}</span>
                      {isActive && isPlayingMusic && (
                        <span className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
                          <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                          <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Persistent Music Player Bar (Image 1 Bottom Right) */}
          <div className="rounded-2xl bg-[#050810] border border-slate-800/80 p-4 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  NOW PLAYING • {currentTrack.category.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-white tracking-tight">
                  {currentTrack.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isPlayingMusic && (
                  <div className="flex items-end gap-1 h-3.5 pr-1">
                    <span className="w-1 bg-cyan-400 rounded-full animate-wave-1" />
                    <span className="w-1 bg-blue-400 rounded-full animate-wave-2" />
                    <span className="w-1 bg-violet-400 rounded-full animate-wave-3" />
                    <span className="w-1 bg-cyan-300 rounded-full animate-wave-1" />
                  </div>
                )}
                <span className="text-xs font-mono text-slate-400">
                  {formatTime(currentTimeSec)} / {currentTrack.duration}
                </span>
              </div>
            </div>

            {/* Scrubber Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-full transition-all duration-300"
                style={{ width: `${(currentTimeSec / currentTrack.durationSec) * 100}%` }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1">
              <button 
                onClick={handlePrevTrack}
                className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
                title="Previous track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayMusic}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-glow-blue transition cursor-pointer active:scale-95"
              >
                {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button 
                onClick={handleNextTrack}
                className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
                title="Next track"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setVolume(v => v === 0 ? 0.7 : 0)}
                  className="text-slate-400 hover:text-white transition"
                >
                  {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                  }}
                  className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
