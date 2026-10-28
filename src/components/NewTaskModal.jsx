import React, { useState } from 'react';
import { X, Plus, Clock, Folder } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onAddTask, projects }) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.name || 'General');
  const [duration, setDuration] = useState('25 min');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: title.trim(),
      project: projectId,
      duration,
      completed: false,
      notes: ''
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md rounded-3xl bg-[#090D18] border border-blue-500/40 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-white mb-1">Create Real Task</h3>
        <p className="text-xs text-slate-400 mb-5">Queue a real personal task into your focus flow.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study chapter 4, review code, reply to client..."
              autoFocus
              required
              className="w-full bg-[#050810] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500/60 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                <span>Project</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#050810] text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-800 outline-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name} className="bg-[#090D18] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Target Sprint</span>
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#050810] text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-800 outline-none cursor-pointer"
              >
                <option value="15 min">15 min sprint</option>
                <option value="25 min">25 min (standard)</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min (deep)</option>
                <option value="60 min">60 min</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              Add to Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
