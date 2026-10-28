import React, { useState } from 'react';
import { 
  Plus, 
  ListOrdered, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Play, 
  FileText,
  CornerDownLeft,
  Sparkles,
  Layers
} from 'lucide-react';

export default function QueueSequence({ 
  tasks, 
  onAddTask, 
  onPromote, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  onOpenTemplates
}) {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Header with Template Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">
            Timeline Horizon
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {tasks.length} queued
          </span>
        </div>

        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 transition shadow-glow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Sprint Presets</span>
        </button>
      </div>

      {/* Modern Quick-Input Box */}
      <form onSubmit={handleAdd} className="relative flex items-center group">
        <div className="absolute left-4 text-blue-400 flex items-center pointer-events-none">
          <Plus className="w-4 h-4 transition-transform group-focus-within:rotate-90 duration-200" />
        </div>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Queue next step (hit Enter to sequence)..."
          className="w-full bg-[#0C121E]/90 text-slate-100 placeholder-slate-500 pl-11 pr-24 py-4 rounded-2xl border border-slate-800/80 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 outline-none text-sm font-sans transition-all shadow-inner"
        />
        <div className="absolute right-3.5 flex items-center gap-1.5">
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono bg-slate-800/80 text-slate-400 rounded-lg border border-slate-700/60 shadow-sm">
            <span>Enter</span>
            <CornerDownLeft className="w-3 h-3 text-slate-400" />
          </kbd>
        </div>
      </form>

      {/* Connected Timeline Sequence List */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800/80 bg-obsidian-950/40 p-8 text-center">
          <p className="text-xs text-slate-400 font-mono mb-2">
            The horizon is clear.
          </p>
          <p className="text-xs text-slate-500">
            Add 2–3 micro-tasks or tap <span className="text-blue-400 font-medium">Sprint Presets</span> to load a routine.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-blue-500/20 before:to-transparent">
          {tasks.map((task, index) => {
            const sequenceNum = (index + 2).toString().padStart(2, '0');
            return (
              <div 
                key={task.id}
                className="group relative flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B111D]/80 hover:bg-[#101726] border border-slate-800/80 hover:border-blue-500/40 transition-all duration-200 shadow-sm"
              >
                {/* Timeline Node Dot */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-800 border-2 border-blue-500/60 group-hover:bg-blue-500 group-hover:scale-125 transition-all shadow-glow-subtle" />

                {/* Number & Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-400 shrink-0 w-6">
                    {sequenceNum}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                      {task.title}
                    </p>
                    {task.notes && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>{task.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                  {/* Promote to Current Focus */}
                  <button
                    onClick={() => onPromote(task.id)}
                    title="Promote directly to active focus"
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Up */}
                  {index > 0 && (
                    <button
                      onClick={() => onMoveUp(index)}
                      title="Move up"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Move Down */}
                  {index < tasks.length - 1 && (
                    <button
                      onClick={() => onMoveDown(index)}
                      title="Move down"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(task.id)}
                    title="Delete"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
