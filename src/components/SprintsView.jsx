import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Play, 
  Sparkles, 
  Save, 
  Coffee, 
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

export default function SprintsView({ 
  customRoutines, 
  onSaveRoutine, 
  onDeleteRoutine, 
  onLoadRoutine,
  currentSequence,
  onSaveCurrentAsRoutine
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineDesc, setRoutineDesc] = useState('');
  const [taskInputs, setTaskInputs] = useState(['', '', '']);

  const defaultTemplates = [
    {
      id: 'default-morning',
      title: 'Morning Startup Routine ☕',
      desc: 'Build early momentum without decision fatigue.',
      tasks: [
        'Lock in today’s #1 non-negotiable outcome',
        'Clear high-priority messages & triage inbox',
        'Begin 45-minute deep focus session'
      ]
    },
    {
      id: 'default-dev',
      title: 'Code & Ship Sprint 💻',
      desc: 'Fast-paced developer flow from code to deployment.',
      tasks: [
        'Implement feature / fix core bug',
        'Run tests & verify build passes',
        'Git commit & push to GitHub'
      ]
    },
    {
      id: 'default-reset',
      title: 'Workspace & Mind Reset 🧹',
      desc: 'Wrap up your work cleanly so tomorrow starts effortlessly.',
      tasks: [
        'Close idle browser tabs and terminal windows',
        'Jot down top 2 tasks for tomorrow in Scratchpad',
        'Review completed tasks log & celebrate progress'
      ]
    }
  ];

  const handleAddTaskField = () => {
    setTaskInputs([...taskInputs, '']);
  };

  const handleUpdateTaskField = (idx, val) => {
    const copy = [...taskInputs];
    copy[idx] = val;
    setTaskInputs(copy);
  };

  const handleRemoveTaskField = (idx) => {
    if (taskInputs.length <= 1) return;
    setTaskInputs(taskInputs.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const validTasks = taskInputs.filter(t => t.trim() !== '');
    if (!routineTitle.trim() || validTasks.length === 0) return;

    onSaveRoutine({
      id: `routine-${Date.now()}`,
      title: routineTitle.trim(),
      desc: routineDesc.trim() || 'Custom daily routine',
      tasks: validTasks,
      createdAt: Date.now()
    });

    setRoutineTitle('');
    setRoutineDesc('');
    setTaskInputs(['', '', '']);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Daily Routines & Sprints
          </h2>
          <p className="text-xs text-slate-400">
            Automate your repeated flows so you never sit at your PC wondering what to do.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentSequence.length > 0 && (
            <button
              onClick={onSaveCurrentAsRoutine}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-obsidian-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
              title="Save your current active tasks as a reusable routine"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>Save Current Flow</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Routine</span>
          </button>
        </div>
      </div>

      {/* Custom User Routines Section */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          My Personal Routines ({customRoutines.length})
        </h3>

        {customRoutines.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800/80 bg-obsidian-950/40 p-6 text-center mb-6">
            <p className="text-xs text-slate-400 mb-1">
              You haven’t created a personal daily routine yet.
            </p>
            <p className="text-[11px] text-slate-500">
              Click <span className="text-blue-400 font-medium">"Create Custom Routine"</span> above to set up your everyday morning, school, or study pattern!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {customRoutines.map((r) => (
              <div 
                key={r.id}
                className="group p-5 rounded-2xl bg-[#090E1A]/80 hover:bg-[#0D1526] border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-200">
                      {r.title}
                    </h4>
                    <button
                      onClick={() => onDeleteRoutine(r.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete routine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {r.desc && (
                    <p className="text-xs text-slate-400 mb-3">{r.desc}</p>
                  )}
                  <div className="space-y-1 pl-2 border-l-2 border-blue-500/30 text-xs text-slate-300 mb-4">
                    {r.tasks.map((taskText, idx) => (
                      <div key={idx} className="truncate">• {taskText}</div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onLoadRoutine(r.tasks.map(t => ({ title: t })))}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition border border-blue-500/30 hover:border-transparent cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start This Routine</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Curated Sprints */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Quick Starter Sprints
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {defaultTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl bg-obsidian-950/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <h4 className="text-xs font-semibold text-white mb-1">{tpl.title}</h4>
                <p className="text-[11px] text-slate-400 mb-3">{tpl.desc}</p>
                <div className="space-y-0.5 text-[11px] text-slate-500 mb-3">
                  {tpl.tasks.map((t, idx) => (
                    <div key={idx} className="truncate">• {t}</div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onLoadRoutine(tpl.tasks.map(t => ({ title: t })))}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
              >
                Load Sprint
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Custom Routine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#090D16] border border-blue-500/40 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Create Daily Routine</h3>
            <p className="text-xs text-slate-400 mb-4">
              Define the sequence of tasks you repeat every day or morning.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Routine Name
                </label>
                <input
                  type="text"
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  placeholder="e.g. Morning Study Sprint, Post-Work Reset..."
                  required
                  autoFocus
                  className="w-full bg-[#05080F] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500/60 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={routineDesc}
                  onChange={(e) => setRoutineDesc(e.target.value)}
                  placeholder="e.g. Knock out before 10 AM"
                  className="w-full bg-[#05080F] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500/60 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300">
                    Tasks in Sequence
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTaskField}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Step
                  </button>
                </div>

                <div className="space-y-2">
                  {taskInputs.map((taskVal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 w-5 shrink-0">
                        0{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={taskVal}
                        onChange={(e) => handleUpdateTaskField(idx, e.target.value)}
                        placeholder={`Step ${idx + 1}...`}
                        required={idx === 0}
                        className="flex-1 bg-[#05080F] text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-blue-500/60 outline-none"
                      />
                      {taskInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTaskField(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
