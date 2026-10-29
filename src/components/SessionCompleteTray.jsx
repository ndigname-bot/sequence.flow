import React from 'react';
import { 
  CheckCircle2, 
  Coffee, 
  BookOpen, 
  Play, 
  X, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

export default function SessionCompleteTray({ 
  isOpen, 
  onClose, 
  task, 
  onStartBreak, 
  onOpenNotebook,
  notesCount = 0,
  focusedMinutes = 25,
  sprintCompleted = 1,
  sprintTotal = 4,
  latestNote
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg rounded-3xl bg-[#090E1D] border-2 border-cyan-400/40 shadow-glow-cyan p-7 relative overflow-hidden">
        {/* Glow ambient bloom */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold lowercase tracking-tight text-white font-sans text-sm">
              sequence
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              A LITTLE ROOM TO BREATHE
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Status & Title */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-glow-subtle">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
              SESSION COMPLETE
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              A good place to pause.
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {task?.title || 'Session completed'}
            </p>
          </div>
        </div>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#050812] border border-slate-800/80 text-center mb-4">
          <div>
            <span className="block text-lg font-bold font-mono text-white">{focusedMinutes} min</span>
            <span className="text-[10px] text-slate-500">Focused</span>
          </div>
          <div>
            <span className="block text-lg font-bold font-mono text-cyan-400">{notesCount} notes</span>
            <span className="text-[10px] text-slate-500">Collected</span>
          </div>
          <div>
            <span className="block text-lg font-bold font-mono text-white">{sprintCompleted} / {sprintTotal}</span>
            <span className="text-[10px] text-slate-500">Sprint tasks</span>
          </div>
        </div>

        {/* Saved to Notebook Box */}
        <div className="p-3.5 rounded-2xl bg-[#050812] border border-slate-800/80 mb-4 space-y-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold block">
            SAVED TO YOUR NOTEBOOK
          </span>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {latestNote ? `"${latestNote}"` : `"Your focus session is logged in your notebook. Clear mind, zero open loops."`}
          </p>
        </div>

        {/* Short Break Preview Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0C152B]/80 border border-blue-500/30 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Take a little room to breathe</h4>
              <p className="text-[10px] text-slate-400">5 min break, then the core component library</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300">05:00</span>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onStartBreak}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start break</span>
          </button>

          <button
            onClick={onOpenNotebook}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-medium text-xs transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open notebook</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 font-mono text-center mt-5">
          Your progress, gathered. Your next step, ready when you are.
        </p>
      </div>
    </div>
  );
}
