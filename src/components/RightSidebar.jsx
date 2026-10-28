import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Coffee, 
  ShieldCheck, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function RightSidebar({ 
  completedCount = 0, 
  sessionsCount = 0, 
  streakDays = 1,
  totalFocusedSeconds = 0,
  dailyGoalHours = 2,
  routines = [],
  onOpenSprints
}) {
  const focusedMins = Math.floor(totalFocusedSeconds / 60);
  const hours = Math.floor(focusedMins / 60);
  const mins = focusedMins % 60;
  const timeDisplay = `${hours}h ${mins}m`;

  // 16 segmented bars calculation
  const totalSegments = 16;
  const goalMinutes = dailyGoalHours * 60;
  const activeSegments = Math.min(totalSegments, Math.round((focusedMins / (goalMinutes || 120)) * totalSegments));

  return (
    <aside className="w-80 border-l border-slate-800/80 bg-[#070B12] p-5 space-y-6 shrink-0 select-none overflow-y-auto">
      {/* 1. TODAY'S MOMENTUM (Real Dynamic Calculations) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500">
          <span>TODAY'S MOMENTUM</span>
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
        </div>

        {/* Big Metric Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {timeDisplay}
          </span>
          <span className="text-xs font-mono text-slate-500">/ {dailyGoalHours}h goal</span>
        </div>

        {/* Dynamic Segmented Progress Bars (16 vertical pills) */}
        <div className="grid grid-cols-16 gap-1 h-3.5 items-center">
          {Array.from({ length: totalSegments }).map((_, i) => {
            const isFilled = i < activeSegments;
            return (
              <span
                key={i}
                className={`h-full rounded-full transition-all duration-500 ${
                  isFilled 
                    ? 'bg-blue-500 shadow-glow-subtle' 
                    : 'bg-slate-800/80'
                }`}
              />
            );
          })}
        </div>

        {/* 3 Metrics Columns */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 text-center">
          <div>
            <span className="block text-sm font-bold font-mono text-white">0{completedCount}</span>
            <span className="text-[10px] text-slate-500 leading-tight">Tasks completed</span>
          </div>
          <div>
            <span className="block text-sm font-bold font-mono text-white">0{sessionsCount}</span>
            <span className="text-[10px] text-slate-500 leading-tight">Focus sessions</span>
          </div>
          <div>
            <span className="block text-sm font-bold font-mono text-blue-400">{streakDays}d</span>
            <span className="text-[10px] text-slate-500 leading-tight">Streak</span>
          </div>
        </div>
      </div>

      {/* 2. YOUR SPRINTS (Real Custom Routines) */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>Your sprints</span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-full">
              0{routines.length || 1}
            </span>
          </div>
          <button 
            onClick={onOpenSprints}
            className="text-slate-500 hover:text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Render Real User Routines */}
        {routines.length > 0 ? (
          routines.slice(0, 2).map((r) => (
            <div 
              key={r.id} 
              onClick={onOpenSprints}
              className="p-3.5 rounded-2xl bg-[#0C1220] border border-blue-500/30 hover:border-blue-500/50 transition cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-white truncate max-w-[140px]">{r.title}</span>
                </div>
                <span className="flex items-center gap-1 text-[9px] font-mono text-blue-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  READY
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{r.desc || 'Custom routine'}</p>

              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-1/3 rounded-full" />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{r.tasks?.length || 3} TASKS</span>
                <span>SPRINT</span>
              </div>
            </div>
          ))
        ) : (
          <div 
            onClick={onOpenSprints}
            className="p-4 rounded-2xl bg-[#090F1C]/80 border border-slate-800/80 hover:border-blue-500/40 text-center cursor-pointer transition"
          >
            <p className="text-xs text-slate-400 mb-1">No custom sprints yet</p>
            <span className="text-[10px] text-blue-400 font-medium">+ Create routine</span>
          </div>
        )}

        <button 
          onClick={onOpenSprints}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 font-medium pt-1 cursor-pointer"
        >
          <span>View all sprints</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3. AFTER THIS FOCUS */}
      <div className="space-y-2 pt-4 border-t border-slate-800/80">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          AFTER THIS FOCUS
        </span>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#090F1C]/70 border border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">A little room to breathe</h4>
            <p className="text-[10px] font-mono text-slate-500">5 MIN • SHORT BREAK</p>
          </div>
        </div>
      </div>

      {/* 4. DISTRACTIONS, ON HOLD */}
      <div className="p-3.5 rounded-2xl bg-[#090F1C]/70 border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-white">Distractions, on hold.</h4>
            <p className="text-[10px] text-slate-500">Notifications muted while you focus</p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-blue-400 shadow-glow-subtle shrink-0" />
      </div>
    </aside>
  );
}
