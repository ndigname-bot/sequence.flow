import React, { useState } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';

export default function FocusBall({ 
  onExpand, 
  activeTask, 
  secondsRemaining = 1478, // 24:38
  isPaused = false
}) {
  const [isHovered, setIsHovered] = useState(false);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div 
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Info Pill on Hover */}
      {isHovered && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#070C18]/95 border border-cyan-400/40 shadow-glow-cyan backdrop-blur-xl animate-fade-in text-xs font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-semibold text-white truncate max-w-[180px]">
            {activeTask?.title || 'Sequence Focus'}
          </span>
          <span className="font-mono text-cyan-300 font-bold border-l border-slate-700 pl-2">
            {timeFormatted}
          </span>
        </div>
      )}

      {/* The 3D Gemini-Style Live Focus Ball */}
      <button
        onClick={onExpand}
        className="relative group w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 animate-float"
        title="Click to open Work Companion mini-window"
      >
        {/* Exterior Ambient Neon Cyan & Violet Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-violet-500 opacity-80 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all" />

        {/* 3D Glass Sphere Body */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#12284D] via-[#0B152B] to-[#040814] border border-cyan-300/60 shadow-glow-orb flex items-center justify-center overflow-hidden">
          {/* Internal Specular Highlight Reflection */}
          <div className="absolute top-1.5 left-2.5 w-6 h-3 rounded-full bg-white/40 blur-[1px] transform -rotate-12 pointer-events-none" />

          {/* Animated Waveform Bars (like Gemini call mode) */}
          <div className="flex items-center gap-1 h-5 z-10">
            <span className={`w-1 rounded-full bg-cyan-300 transition-all duration-300 ${isPaused ? 'h-2' : 'h-3 animate-pulse'}`} />
            <span className={`w-1 rounded-full bg-white transition-all duration-300 ${isPaused ? 'h-3' : 'h-5 animate-pulse delay-75'}`} />
            <span className={`w-1 rounded-full bg-cyan-400 transition-all duration-300 ${isPaused ? 'h-4' : 'h-4 animate-pulse delay-150'}`} />
            <span className={`w-1 rounded-full bg-blue-300 transition-all duration-300 ${isPaused ? 'h-1.5' : 'h-2.5 animate-pulse delay-100'}`} />
          </div>

          {/* Bottom violet tint rim light */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-violet-500/40 to-transparent pointer-events-none" />
        </div>
      </button>
    </div>
  );
}
