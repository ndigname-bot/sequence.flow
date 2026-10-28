import React, { useState } from 'react';
import { 
  Pause, 
  Play, 
  SkipForward, 
  Check, 
  Minus, 
  Maximize2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  CornerDownLeft, 
  Layers, 
  FileText,
  Clock,
  Sparkles,
  Bookmark
} from 'lucide-react';

export default function WorkCompanion({ 
  task, 
  upcomingTasks = [],
  onCollapseToBall, 
  onExpandToFull, 
  onComplete, 
  onPauseToggle, 
  isPaused,
  secondsRemaining = 1500,
  onSaveNote,
  vaultNotes = [],
  onDeleteNote,
  onSendNoteToQueue,
  onAddTask
}) {
  // Two Bars Switcher: 'queue' (Dark Blue) vs 'notes' (Deep Violet)
  const [activeBar, setActiveBar] = useState('queue'); // 'queue' | 'notes'
  const [quickNoteInput, setQuickNoteInput] = useState('');
  const [quickTaskInput, setQuickTaskInput] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const nextTask = upcomingTasks[0] || null;

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!quickNoteInput.trim()) return;
    onSaveNote({
      id: `note-${Date.now()}`,
      content: quickNoteInput.trim(),
      tag: 'quick',
      createdAt: Date.now()
    });
    setQuickNoteInput('');
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!quickTaskInput.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: quickTaskInput.trim(),
      duration: '25 min',
      completed: false
    });
    setQuickTaskInput('');
    setShowAddStep(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none animate-fade-in pointer-events-auto">
      {/* Floating Round-Edged Companion Card (Not Windowed, Soft Curved Borders) */}
      <div className="relative w-full max-w-[430px] rounded-[32px] bg-[#070A14]/95 border border-slate-800 shadow-2xl p-6 overflow-hidden transition-all duration-300">
        
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 inset-x-0 h-1 transition-colors duration-500 ${
          activeBar === 'queue' ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600' : 'bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-500'
        }`} />

        {/* Top Control Bar: Logo, Two Bar Switcher, Window Controls */}
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <span className={`w-1 h-3 rounded-full transition-colors ${activeBar === 'queue' ? 'bg-blue-400' : 'bg-violet-400'}`} />
              <span className={`w-1 h-4 rounded-full transition-colors ${activeBar === 'queue' ? 'bg-cyan-300' : 'bg-fuchsia-300'}`} />
              <span className={`w-1 h-2 rounded-full transition-colors ${activeBar === 'queue' ? 'bg-blue-500' : 'bg-violet-500'}`} />
            </span>
            <span className="text-xs font-bold lowercase tracking-tight text-white font-sans">
              sequence
            </span>
          </div>

          {/* The Two Bars Switcher Pills (Dark Blue Queue vs Violet Notes) */}
          <div className="flex items-center bg-[#050810] p-1 rounded-2xl border border-slate-800/80 text-[11px] font-mono">
            {/* Queue Bar Button (Dark Blue) */}
            <button
              onClick={() => setActiveBar('queue')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition cursor-pointer ${
                activeBar === 'queue'
                  ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeBar === 'queue' ? 'bg-cyan-300 animate-pulse' : 'bg-slate-500'}`} />
              <span>Queue</span>
              {upcomingTasks.length > 0 && (
                <span className="text-[9px] opacity-80">({upcomingTasks.length + 1})</span>
              )}
            </button>

            {/* Notes Bar Button (Deep Violet) */}
            <button
              onClick={() => setActiveBar('notes')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition cursor-pointer ${
                activeBar === 'notes'
                  ? 'bg-violet-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3 h-3 text-violet-300" />
              <span>Notes</span>
              {vaultNotes.length > 0 && (
                <span className="text-[9px] opacity-80">({vaultNotes.length})</span>
              )}
            </button>
          </div>

          {/* Window Minimizer & Studio Expander */}
          <div className="flex items-center gap-1">
            {/* Minimize -> Collapses to Floating Orb in Corner */}
            <button
              onClick={onCollapseToBall}
              className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition cursor-pointer"
              title="Minimize to floating orb"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Expand -> Opens Full Studio Launchpad */}
            <button
              onClick={onExpandToFull}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              title="Open full planning studio"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BAR 1: THE QUEUE BAR (Dark Blue Theme)                   */}
        {/* ======================================================== */}
        {activeBar === 'queue' && (
          <div className="space-y-4 animate-fade-in">
            {/* Active Task Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0C152B] to-[#070D1C] border border-blue-500/30 p-5 shadow-inner">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>NOW FOCUSING</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-500/30">
                  {timeFormatted}
                </span>
              </div>

              {/* Task Title */}
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug my-2">
                {task?.title || 'No active task. Queue a step below!'}
              </h3>

              {/* Quick Actions (Pause / Done & Next) */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onComplete(task?.id)}
                  disabled={!task}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-glow-blue active:scale-98 transition cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Done & Next</span>
                  <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-blue-800/60 rounded border border-blue-400/30">
                    Space
                  </kbd>
                </button>

                <button
                  onClick={onPauseToggle}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Up Next Horizon Cue */}
            <div className="rounded-2xl bg-[#050810] border border-slate-800/80 p-3.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="uppercase tracking-wider">UP NEXT IN SEQUENCE</span>
                <button
                  onClick={() => setShowAddStep(!showAddStep)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add step
                </button>
              </div>

              {/* Add next step inline */}
              {showAddStep && (
                <form onSubmit={handleTaskSubmit} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={quickTaskInput}
                    onChange={(e) => setQuickTaskInput(e.target.value)}
                    placeholder="Next step..."
                    autoFocus
                    className="flex-1 bg-[#090D18] text-xs text-white px-2.5 py-1.5 rounded-lg border border-cyan-500/50 outline-none"
                  />
                  <button type="submit" className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold">
                    Queue
                  </button>
                </form>
              )}

              {nextTask ? (
                <div className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[#080D1A] border border-blue-500/20 text-slate-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="truncate">{nextTask.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {nextTask.duration || '25 min'}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 font-mono py-1">
                  Queue is clear. Add 1 or 2 steps to stay in momentum!
                </p>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAR 2: THE NOTES BAR (Deep Violet Theme)                 */}
        {/* ======================================================== */}
        {activeBar === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Capture Box (Deep Violet) */}
            <form onSubmit={handleNoteSubmit} className="space-y-2">
              <div className="relative rounded-2xl bg-gradient-to-br from-[#170E2D] to-[#0D071C] border border-violet-500/30 p-3 shadow-inner">
                <textarea
                  value={quickNoteInput}
                  onChange={(e) => setQuickNoteInput(e.target.value)}
                  placeholder="Capture quick thought, video takeaway, or link (Enter to save)..."
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleNoteSubmit(e);
                    }
                  }}
                  className="w-full bg-transparent text-xs text-violet-100 placeholder-violet-400/50 outline-none resize-none font-sans leading-relaxed"
                />
                <div className="flex items-center justify-between pt-2 border-t border-violet-500/20 text-[10px] font-mono text-violet-400">
                  <span>Saved in your vault</span>
                  <button
                    type="submit"
                    disabled={!quickNoteInput.trim()}
                    className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Save</span>
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* List of Captured Notes */}
            <div className="rounded-2xl bg-[#050810] border border-slate-800/80 p-3 max-h-[160px] overflow-y-auto space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                RECENTLY CAPTURED ({vaultNotes.length})
              </div>

              {vaultNotes.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-mono py-2 text-center">
                  No notes saved yet. Type above while watching or studying!
                </p>
              ) : (
                vaultNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="group p-2.5 rounded-xl bg-[#0B0818] border border-violet-500/20 hover:border-violet-400/40 text-xs transition space-y-1.5"
                  >
                    <p className="text-violet-200 line-clamp-2 font-sans text-[11px]">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-violet-500/10 text-[10px]">
                      <button
                        onClick={() => onSendNoteToQueue(note.content)}
                        className="text-violet-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                        title="Promote note to task on the queue side"
                      >
                        <span>➔ Send to Queue</span>
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Ambient Footer Prompt */}
        <p className="text-[10px] text-slate-500 font-mono text-center mt-4">
          Hover bottom orb to check status • Shift + Space to advance
        </p>
      </div>
    </div>
  );
}
