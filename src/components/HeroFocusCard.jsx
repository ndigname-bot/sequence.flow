import React, { useState, useEffect } from 'react';
import { 
  Pause, 
  Play, 
  SkipForward, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Layers
} from 'lucide-react';

export default function HeroFocusCard({ 
  task, 
  onComplete, 
  onPauseToggle, 
  isPaused,
  secondsRemaining,
  totalSeconds = 1800, // 30:00
  sessionNumber = 1,
  totalSessions = 4,
  onToggleZen,
  onUpdateTitle,
  onAddTask
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [quickTitle, setQuickTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    } else {
      setTitle('');
    }
  }, [task?.id, task?.title]);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      if (task) {
        onUpdateTitle(task.id, title.trim());
      } else if (onAddTask) {
        onAddTask({
          id: `task-${Date.now()}`,
          title: title.trim(),
          project: 'General',
          duration: '25 min',
          completed: false
        });
      }
    }
    setIsEditing(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    if (onAddTask) {
      onAddTask({
        id: `task-${Date.now()}`,
        title: quickTitle.trim(),
        project: 'General',
        duration: '25 min',
        completed: false
      });
      setQuickTitle('');
    }
  };

  // Format MM : SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;

  // Circular progress calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, secondsRemaining / totalSeconds));
  const strokeDashoffset = circumference - (progressRatio * circumference);

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#121B30] to-[#0A1020] border border-blue-500/30 p-6 md:p-8 shadow-2xl overflow-hidden">
      {/* Subtle radial ambient blue bloom */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Bar: Focus vs Short break & Session Counter */}
      <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2 bg-[#090F1E] p-1 rounded-full border border-slate-800 text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Focus</span>
          </button>
          <button className="px-3 py-1 rounded-full text-slate-400 hover:text-slate-200 transition">
            Short break
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400">
            SESSION 0{sessionNumber} / 0{totalSessions}
          </span>
          <button 
            onClick={onToggleZen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            title="Expand to Fullscreen / Zen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Layout: Left Task Information vs Right Circular Timer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Column (Task details & action buttons) */}
        <div className="md:col-span-7 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
            IN THE MOMENT
          </span>

          {isEditing ? (
            <form onSubmit={handleTitleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                autoFocus
                className="w-full bg-[#050810] text-2xl font-bold text-white px-3 py-1.5 rounded-xl border border-blue-500 outline-none"
              />
            </form>
          ) : (
            <h2 
              onClick={() => setIsEditing(true)}
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug cursor-text hover:text-blue-100 transition"
              title="Click to edit task title"
            >
              {task?.title || 'No active task — click to add one'}
            </h2>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{task?.project || 'Current Focus'}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">{task ? (task.duration || '25 min') : 'Queue is ready'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Pause/Resume Button */}
            <button
              onClick={onPauseToggle}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer active:scale-98"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-white" />
                  <span>Resume session</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-white" />
                  <span>Pause session</span>
                </>
              )}
            </button>

            {/* SPACE Advance Button */}
            <button
              onClick={() => onComplete(task?.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer active:scale-98"
            >
              <SkipForward className="w-3.5 h-3.5 text-slate-400" />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 rounded border border-slate-700">
                SPACE
              </kbd>
            </button>
          </div>
        </div>

        {/* Right Column: Circular Progress Ring Timer */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800/70"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Active Glowing Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-blue-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Digital Clock in Center of Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {timeFormatted}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mt-1">
                REMAINING OF 30:00
              </span>

              {/* Progress dots */}
              <div className="flex items-center gap-1 mt-2">
                <span className="w-3 h-0.5 rounded-full bg-blue-500" />
                <span className="w-3 h-0.5 rounded-full bg-blue-500" />
                <span className="w-3 h-0.5 rounded-full bg-blue-500" />
                <span className="w-3 h-0.5 rounded-full bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
