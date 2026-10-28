import React, { useState } from 'react';
import { CloudRain, Headphones, Radio, Volume2, X } from 'lucide-react';
import { ambient } from '../utils/ambient';

export default function AmbientPlayer() {
  const [active, setActive] = useState(ambient.currentTrack);
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(0.35);

  const handleSelect = (track) => {
    if (active === track) {
      ambient.stop();
      setActive(null);
    } else {
      if (track === 'rain') ambient.playRain();
      if (track === 'binaural') ambient.playBinaural();
      if (track === 'whitenoise') ambient.playWhiteNoise();
      setActive(track);
    }
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    ambient.setVolume(v);
  };

  const trackLabels = {
    rain: { label: 'Rainfall', icon: CloudRain },
    binaural: { label: 'Binaural Drone', icon: Headphones },
    whitenoise: { label: 'Soft Noise', icon: Radio },
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
          active 
            ? 'bg-blue-950/60 border-blue-500/50 text-blue-300 shadow-glow-subtle' 
            : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
        }`}
        title="Ambient Focus Sounds"
      >
        {active ? (
          <>
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="capitalize">{active}</span>
          </>
        ) : (
          <>
            <Headphones className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Ambient</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-obsidian-900/95 border border-blue-500/30 p-4 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-blue-400" />
              Focus Atmosphere
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(trackLabels).map(([key, item]) => {
              const Icon = item.icon;
              const isSelected = active === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center text-xs transition border ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                      : 'bg-obsidian-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          {active && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-blue-400" /> Volume
                </span>
                <span className="font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolume}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
