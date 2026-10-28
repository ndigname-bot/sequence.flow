import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  FileText, 
  Sparkles, 
  SkipForward,
  Trash2,
  Plus,
  Coffee,
  CheckSquare,
  Square,
  Maximize2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function NowFocusing({ 
  task, 
  onComplete, 
  onSkip, 
  onDelete, 
  onUpdateNotes, 
  onUpdateTitle,
  onToggleCheckpoint,
  onAddCheckpoint,
  onDeleteCheckpoint,
  onStartBreak,
  isBreakMode,
  breakSeconds,
  onEndBreak,
  onToggleZen,
  zenMode
}) {
  const [seconds, setSeconds] = useState(task?.elapsedSeconds || 0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(task?.title || '');
  const [newCheckpointText, setNewCheckpointText] = useState('');
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // De-congesting toggles: collapsible sections
  const [showNotes, setShowNotes] = useState(Boolean(task?.notes));
  const [showCheckpoints, setShowCheckpoints] = useState(Boolean(task?.checkpoints?.length));

  useEffect(() => {
    if (task) {
      setSeconds(task.elapsedSeconds || 0);
      setTitleText(task.title || '');
      setShowNotes(Boolean(task.notes));
      setShowCheckpoints(Boolean(task?.checkpoints?.length));
    }
  }, [task?.id]);

  useEffect(() => {
    if (!task || isTimerPaused || isBreakMode) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [task?.id, isTimerPaused, isBreakMode]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTitleSubmit = () => {
    if (titleText.trim()) {
      onUpdateTitle(task.id, titleText.trim());
    } else {
      setTitleText(task.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddCheckpointSubmit = (e) => {
    e.preventDefault();
    if (!newCheckpointText.trim()) return;
    onAddCheckpoint(task.id, newCheckpointText.trim());
    setNewCheckpointText('');
    setShowAddCheckpoint(false);
  };

  if (isBreakMode) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1726] to-[#090d16] border border-blue-400/30 p-10 text-center animate-fade-in shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mx-auto mb-4 text-blue-300">
          <Coffee className="w-7 h-7 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Micro-Break</h3>
        <p className="text-slate-400 text-xs max-w-xs mx-auto mb-6">
          Step back, hydrate, or stretch. Your active flow is paused.
        </p>
        <div className="text-4xl font-mono font-bold text-blue-300 mb-6">
          {formatTime(breakSeconds)}
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

  if (!task) {
    return (
      <div className="rounded-3xl p-12 text-center border border-dashed border-slate-800/80 bg-obsidian-950/40 my-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6 animate-pulse text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight mb-1">Horizon is Clear</h3>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Queue your next step below or load a preset routine to get moving.
        </p>
      </div>
    );
  }

  const checkpoints = task.checkpoints || [];
  const completedCheckpoints = checkpoints.filter(c => c.completed).length;

  return (
    <div className={`relative rounded-3xl bg-[#090E1A] border border-blue-500/30 shadow-glow-blue transition-all duration-300 ${
      zenMode ? 'p-8 md:p-14 max-w-2xl mx-auto shadow-2xl' : 'p-6 md:p-7'
    }`}>
      {/* Top Status & Controls */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
            Current Focus
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-obsidian-950/90 border border-slate-800 text-blue-300 font-mono text-xs">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{formatTime(seconds)}</span>
            <button 
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="text-slate-500 hover:text-slate-200 ml-0.5"
              title={isTimerPaused ? 'Resume timer' : 'Pause timer'}
            >
              {isTimerPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>

          <button
            onClick={onToggleZen}
            title={zenMode ? 'Exit Zen' : 'Zen Focus'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Task Title */}
      <div className="mb-4">
        {isEditingTitle ? (
          <form 
            onSubmit={(e) => { e.preventDefault(); handleTitleSubmit(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="w-full bg-[#05080F] text-xl md:text-2xl font-bold text-white px-3 py-2 rounded-xl border border-blue-500/70 outline-none"
            />
          </form>
        ) : (
          <h2 
            onClick={() => setIsEditingTitle(true)}
            className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug cursor-text hover:text-blue-100 transition group flex items-start justify-between"
            title="Click to edit task title"
          >
            <span>{task.title}</span>
            <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/80 transition-opacity ml-2 shrink-0">
              edit
            </span>
          </h2>
        )}
      </div>

      {/* Spacious Collapsible Tabs: [ Notes ] and [ Checkpoints ] */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono transition border ${
            showNotes
              ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
              : 'bg-obsidian-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3 h-3 text-blue-400" />
          <span>Scratchpad</span>
          {task.notes && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
          {showNotes ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
        </button>

        <button
          onClick={() => setShowCheckpoints(!showCheckpoints)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono transition border ${
            showCheckpoints
              ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
              : 'bg-obsidian-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-3 h-3 text-blue-400" />
          <span>Sub-checks</span>
          {checkpoints.length > 0 && (
            <span className="text-[10px] text-blue-300">
              ({completedCheckpoints}/{checkpoints.length})
            </span>
          )}
          {showCheckpoints ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
        </button>
      </div>

      {/* Expanded Scratchpad Area */}
      {showNotes && (
        <div className="mb-4 rounded-2xl bg-[#060912] border border-slate-800/80 p-3.5 animate-fade-in">
          <textarea
            value={task.notes || ''}
            onChange={(e) => onUpdateNotes(task.id, e.target.value)}
            placeholder="Jot down quick thoughts, links, or draft notes for this task..."
            rows={zenMode ? 5 : 3}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none resize-none font-sans leading-relaxed"
          />
        </div>
      )}

      {/* Expanded Checkpoints Area */}
      {showCheckpoints && (
        <div className="mb-4 rounded-2xl bg-[#060912] border border-slate-800/80 p-3.5 space-y-2 animate-fade-in">
          {checkpoints.map((cp) => (
            <div 
              key={cp.id}
              className="flex items-center justify-between group text-xs text-slate-300 py-1 px-2 rounded hover:bg-slate-800/30 transition"
            >
              <div 
                onClick={() => onToggleCheckpoint(task.id, cp.id)}
                className="flex items-center gap-2 cursor-pointer select-none flex-1"
              >
                {cp.completed ? (
                  <CheckSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-500 hover:text-blue-400 shrink-0" />
                )}
                <span className={cp.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                  {cp.text}
                </span>
              </div>
              <button
                onClick={() => onDeleteCheckpoint(task.id, cp.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {showAddCheckpoint ? (
            <form onSubmit={handleAddCheckpointSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCheckpointText}
                onChange={(e) => setNewCheckpointText(e.target.value)}
                placeholder="Sub-step name..."
                autoFocus
                className="flex-1 bg-obsidian-950 text-xs text-white px-2.5 py-1.5 rounded-lg border border-blue-500/50 outline-none"
              />
              <button 
                type="submit" 
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddCheckpoint(true)}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono pt-1"
            >
              <Plus className="w-3 h-3" /> Add sub-check
            </button>
          )}
        </div>
      )}

      {/* Airy Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/70">
        <button
          onClick={() => onComplete(task.id, seconds)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-600/30 active:scale-98 cursor-pointer group"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
          <span>Done & Advance</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          <kbd className="hidden sm:inline-block ml-1.5 px-1 py-0.5 text-[9px] font-mono bg-blue-700/60 rounded border border-blue-400/30 text-blue-200">
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
            title="Later (move to back)"
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
    </div>
  );
}
