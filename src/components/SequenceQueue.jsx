import React, { useState } from 'react';
import { 
  GripVertical, 
  Circle, 
  CheckCircle2, 
  MoreHorizontal, 
  Plus, 
  ChevronDown,
  Trash2,
  Play
} from 'lucide-react';

export default function SequenceQueue({ 
  tasks, 
  onAddTask, 
  onToggleComplete, 
  onPromoteTask, 
  onDeleteTask 
}) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMin, setNewTaskMin] = useState('25 min');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      project: 'Website redesign',
      duration: newTaskMin,
      completed: false
    });
    setNewTaskTitle('');
    setShowAddInput(false);
  };

  const remainingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-3">
      {/* Sequence Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-sm">Your sequence</h3>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px]">
            0{tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition text-xs">
            <span>Design exploration</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          <button
            onClick={() => setShowAddInput(!showAddInput)}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition text-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add task</span>
          </button>
        </div>
      </div>

      {/* Quick Add Inline Form */}
      {showAddInput && (
        <form onSubmit={handleAdd} className="flex items-center gap-2 p-2 rounded-xl bg-[#090F1C] border border-blue-500/40">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What step is next?..."
            autoFocus
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none px-2"
          />
          <select 
            value={newTaskMin}
            onChange={(e) => setNewTaskMin(e.target.value)}
            className="bg-[#050810] text-[10px] text-slate-400 px-2 py-1 rounded border border-slate-800 outline-none"
          >
            <option value="15 min">15 min</option>
            <option value="25 min">25 min</option>
            <option value="30 min">30 min</option>
            <option value="45 min">45 min</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Queue
          </button>
        </form>
      )}

      {/* Sequence List */}
      <div className="space-y-1.5">
        {tasks.map((t, idx) => {
          const isActive = idx === 0 && !t.completed;

          return (
            <div
              key={t.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all select-none ${
                isActive
                  ? 'bg-[#0E1628] border-blue-500/30 shadow-sm'
                  : 'bg-[#090F1C]/70 hover:bg-[#0D1526] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 cursor-grab shrink-0" />

                {/* Status Indicator */}
                <button
                  onClick={() => onToggleComplete(t.id)}
                  className="shrink-0 transition"
                >
                  {t.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <span className="flex items-center gap-0.5 text-blue-400">
                      <span className="w-0.5 h-2 bg-current rounded-full" />
                      <span className="w-0.5 h-3.5 bg-current rounded-full" />
                      <span className="w-0.5 h-2 bg-current rounded-full" />
                    </span>
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                  )}
                </button>

                {/* Title & Project Meta */}
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium truncate ${
                    t.completed ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{t.project || 'Website redesign'}</span>
                    {isActive && (
                      <span className="text-blue-400 font-mono">- in progress</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Duration & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-slate-500">
                  {t.duration || '30 min'}
                </span>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                  {!isActive && !t.completed && (
                    <button
                      onClick={() => onPromoteTask(t.id)}
                      title="Promote to active focus"
                      className="p-1 rounded text-slate-400 hover:text-blue-400"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTask(t.id)}
                    title="Delete"
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sequence Footer */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 px-1">
        <div className="flex items-center gap-1.5 text-blue-400/90">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-glow-subtle" />
          <span>Auto-advance is on</span>
        </div>
        <span>{remainingCount} TASKS LEFT • 1H 40M</span>
      </div>
    </div>
  );
}
