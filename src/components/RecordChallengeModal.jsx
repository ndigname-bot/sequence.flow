import React from 'react';
import { Trophy, Clock, Flame, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecordChallengeModal({ 
  isOpen, 
  taskTitle, 
  onYesCrushedIt, 
  onNeedMoreTime 
}) {
  if (!isOpen) return null;

  const handleYes = () => {
    // Burst of gold & electric blue confetti
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#3b82f6', '#fbbf24', '#f59e0b', '#ffffff']
    });
    onYesCrushedIt();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#080D18] border-2 border-blue-500/50 shadow-2xl p-7 text-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mt-16" />

        {/* Animated Trophy Icon */}
        <div className="relative z-10 w-20 h-20 rounded-3xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center mx-auto mb-5 text-amber-300 shadow-glow-subtle animate-bounce">
          <Trophy className="w-10 h-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
        </div>

        {/* Challenge Header */}
        <div className="relative z-10 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-semibold mb-3">
            <Clock className="w-3.5 h-3.5 animate-spin-slow text-blue-400" />
            <span>TIME'S UP!</span>
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
            Did you get to break the record?
          </h3>
          <p className="text-slate-300 text-xs max-w-xs mx-auto leading-relaxed">
            Target time reached for <span className="text-blue-300 font-semibold">"{taskTitle}"</span>.
          </p>
        </div>

        {/* Yes / No Choices */}
        <div className="relative z-10 space-y-3">
          {/* YES CHOICE */}
          <button
            onClick={handleYes}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>YES! Beat the Clock 🏆</span>
          </button>

          {/* NO CHOICE */}
          <button
            onClick={onNeedMoreTime}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/60 transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>No, I'm still going (+5 mins)</span>
          </button>
        </div>

        <p className="relative z-10 text-[11px] text-slate-500 mt-5 font-mono">
          Keep the rhythm going without stress.
        </p>
      </div>
    </div>
  );
}
