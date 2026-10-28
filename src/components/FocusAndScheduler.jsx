import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Flame, 
  Coffee, 
  SkipForward, 
  Trash2, 
  Plus, 
  ListOrdered, 
  CornerDownLeft, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Pause,
  Sparkles,
  Trophy
} from 'lucide-react';

export default function FocusAndScheduler({ 
  task, 
  onComplete, 
  onSkip, 
  onDelete, 
  onUpdateTitle,
  upcomingTasks,
  onAddTask,
  onPromote,
  onDeleteUpcoming,
  onMoveUp,
  onMoveDown,
  onStartBreak,
  isBreakMode,
  breakSeconds,
  onEndBreak,
  onTimeIsUp,
  recordStreak,
  onOpenTemplates
}) {
  // Target Sprint Clock (e.g. 15, 25, 45 mins)
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [newStepText, setNewStepText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(task?.title || '');

  // Reset countdown whenever active task changes
  useEffect(() => {
    if (task) {
      setTitleText(task.title || '');
      setSecondsRemaining(targetMinutes * 60);
      setIsTimerPaused(false);
    }
  }, [task?.id, targetMinutes]);

  // Live Countdown & Trigger "Time's Up Challenge"
  useEffect(() => {
    if (!task || isTimerPaused || isBreakMode) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Time is up! Trigger the record challenge animation
          onTimeIsUp(task.title);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [task?.id, isTimerPaused, isBreakMode, task?.title]);

  const formatCountdown = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentComplete = Math.max(0, Math.min(100, 
    ((targetMinutes * 60 - secondsRemaining) / (targetMinutes * 60)) * 100
  ));

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    onAddTask(newStepText.trim());
    setNewStepText('');
  };

  const handleTitleSubmit = () => {
    if (titleText.trim()) {
      onUpdateTitle(task.id, titleText.trim());
    } else {
      setTitleText(task.title);
    }
    setIsEditingTitle(false);
  };

  if (isBreakMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center rounded-3xl bg-[#090E1A] border border-blue-400/30 p-10 text-center animate-fade-in shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mx-auto mb-4 text-blue-300">
          <Coffee className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Micro-Rest Interval</h3>
        <p className="text-slate-400 text-xs max-w-xs mx-auto mb-6">
          Step back and refresh. Focus timer is paused.
        </p>
        <div className="text-4xl font-mono font-bold text-blue-300 mb-6">
          {formatCountdown(breakSeconds)}
        </div>
        <button
          onClick={onEndBreak}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          Resume Focus Flow ➔
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 1. ACTIVE FOCUS STAGE */}
      <div className="relative rounded-3xl bg-[#090E1A] border border-blue-500/40 shadow-glow-blue p-6 md:p-7 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Status bar */}
        <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-400 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
              Scheduler & Focus
            </span>
            {recordStreak > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>{recordStreak} record streak!</span>
              </span>
            )}
          </div>

          {/* Sprint target selector (15m, 25m, 45m) */}
          <div className="flex items-center gap-1 bg-obsidian-950/90 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
            {[15, 25, 45].map(m => (
              <button
                key={m}
                onClick={() => {
                  setTargetMinutes(m);
                  setSecondsRemaining(m * 60);
                }}
                className={`px-2 py-0.5 rounded-lg transition ${
                  targetMinutes === m ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Active Task Details */}
        {task ? (
          <div className="relative z-10 mb-5">
            {/* Countdown Clock Display */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {formatCountdown(secondsRemaining)}
                </span>
                <span className="text-xs font-mono text-slate-500">remaining</span>
              </div>

              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-obsidian-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition"
              >
                {isTimerPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pause</span>
                  </>
                )}
              </button>
            </div>

            {/* Glowing progress bar */}
            <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden mb-4 border border-slate-800/80">
              <div 
                className="bg-gradient-to-r from-blue-500 to-amber-400 h-full transition-all duration-1000 ease-linear shadow-glow-subtle"
                style={{ width: `${percentComplete}%` }}
              />
            </div>

            {/* Task Title */}
            {isEditingTitle ? (
              <form onSubmit={(e) => { e.preventDefault(); handleTitleSubmit(); }}>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  onBlur={handleTitleSubmit}
                  autoFocus
                  className="w-full bg-[#05080F] text-lg font-bold text-white px-3 py-2 rounded-xl border border-blue-500 outline-none"
                />
              </form>
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                className="text-lg sm:text-xl font-bold text-white tracking-tight cursor-text hover:text-blue-200 transition group flex items-start justify-between"
                title="Click to edit task title"
              >
                <span>{task.title}</span>
                <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 ml-2 shrink-0">
                  edit
                </span>
              </h2>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No active task. Pick or add a step below to start focus.
          </div>
        )}

        {/* Primary Action Buttons */}
        {task && (
          <div className="relative z-10 flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => onComplete(task.id, targetMinutes * 60 - secondsRemaining)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 active:scale-98 transition cursor-pointer group"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>Done & Advance</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              <kbd className="hidden sm:inline-block ml-1.5 px-1 py-0.2 text-[9px] font-mono bg-blue-700/60 rounded border border-blue-400/30 text-blue-200">
                Space
              </kbd>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onStartBreak}
                title="3-minute breather"
                className="p-2 rounded-xl text-slate-400 hover:text-blue-300 hover:bg-slate-800/60 transition"
              >
                <Coffee className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSkip(task.id)}
                title="Later (defer to end)"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                title="Delete task"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. THE UPCOMING SEQUENCE (SCHEDULER HORIZON) */}
      <div className="flex-1 flex flex-col rounded-3xl bg-[#080D18] border border-slate-800/90 p-5 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Upcoming Schedule
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {upcomingTasks.length} queued
            </span>
          </div>

          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300"
          >
            <Sparkles className="w-3 h-3" />
            <span>Presets</span>
          </button>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddSubmit} className="relative mb-3 flex items-center group">
          <Plus className="w-4 h-4 text-blue-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={newStepText}
            onChange={(e) => setNewStepText(e.target.value)}
            placeholder="Schedule next step (hit Enter)..."
            className="w-full bg-[#050810] text-slate-200 placeholder-slate-500 pl-10 pr-20 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500/50 outline-none text-xs"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-mono bg-slate-800/80 text-slate-400 rounded-lg absolute right-2 border border-slate-700/60">
            Enter
          </kbd>
        </form>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-mono border border-dashed border-slate-800/60 rounded-2xl">
              No tasks scheduled. Add 2–3 items above to keep the sequence rolling!
            </div>
          ) : (
            upcomingTasks.map((t, index) => {
              const seqNum = (index + 2).toString().padStart(2, '0');
              return (
                <div
                  key={t.id}
                  className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#090F1E]/80 hover:bg-[#0D1528] border border-slate-800/80 hover:border-blue-500/30 transition text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-400 w-5 shrink-0">
                      {seqNum}
                    </span>
                    <p className="font-medium text-slate-200 group-hover:text-white truncate">
                      {t.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => onPromote(t.id)}
                      title="Promote to current focus"
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-400 transition"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    {index > 0 && (
                      <button
                        onClick={() => onMoveUp(index)}
                        title="Move up"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < upcomingTasks.length - 1 && (
                      <button
                        onClick={() => onMoveDown(index)}
                        title="Move down"
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteUpcoming(t.id)}
                      title="Delete"
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
