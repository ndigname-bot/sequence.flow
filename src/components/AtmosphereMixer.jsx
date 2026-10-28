import React, { useState } from 'react';
import { CloudRain, Waves, Music, SlidersHorizontal, Volume2 } from 'lucide-react';
import { atmosphere } from '../utils/atmosphere';

export default function AtmosphereMixer() {
  const [rainVol, setRainVol] = useState(65);
  const [brownVol, setBrownVol] = useState(40);
  const [lofiVol, setLofiVol] = useState(0);

  const handleRainChange = (e) => {
    const val = Number(e.target.value);
    setRainVol(val);
    atmosphere.setRain(val / 100);
  };

  const handleBrownChange = (e) => {
    const val = Number(e.target.value);
    setBrownVol(val);
    atmosphere.setBrown(val / 100);
  };

  const handleLofiChange = (e) => {
    const val = Number(e.target.value);
    setLofiVol(val);
    atmosphere.setLofi(val / 100);
  };

  return (
    <div className="rounded-2xl bg-[#090F1C]/80 border border-slate-800/80 p-4">
      {/* Atmosphere Header */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-blue-400">
            <span className="w-0.5 h-2 bg-current rounded-full" />
            <span className="w-0.5 h-3.5 bg-current rounded-full" />
            <span className="w-0.5 h-1.5 bg-current rounded-full" />
          </span>
          <span className="font-semibold text-white">Your atmosphere</span>
          <span className="text-slate-500 hidden sm:inline">• Deep work mix</span>
        </div>

        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition cursor-pointer" />
      </div>

      {/* 3 Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Channel 1: Rain */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#060912]/80 border border-slate-800/60">
          <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-300 font-medium truncate">Rain</span>
              <span className="text-slate-500 font-mono text-[10px]">{rainVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainVol}
              onChange={handleRainChange}
              className="w-full h-1 bg-slate-800 accent-blue-500 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Channel 2: Brown Noise */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#060912]/80 border border-slate-800/60">
          <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-300 font-medium truncate">Brown noise</span>
              <span className="text-slate-500 font-mono text-[10px]">{brownVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brownVol}
              onChange={handleBrownChange}
              className="w-full h-1 bg-slate-800 accent-blue-500 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Channel 3: Lo-Fi */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#060912]/80 border border-slate-800/60">
          <Music className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-300 font-medium truncate">Lo-fi</span>
              <span className="text-slate-500 font-mono text-[10px]">
                {lofiVol > 0 ? `${lofiVol}%` : 'OFF'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lofiVol}
              onChange={handleLofiChange}
              className="w-full h-1 bg-slate-800 accent-blue-500 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
