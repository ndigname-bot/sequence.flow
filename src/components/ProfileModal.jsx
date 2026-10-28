import React, { useState } from 'react';
import { X, User, Briefcase, Check, Trash2, Sparkles } from 'lucide-react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  userName, 
  workspaceName, 
  onSave,
  onResetWorkspace
}) {
  const [name, setName] = useState(userName || '');
  const [workspace, setWorkspace] = useState(workspaceName || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      userName: name.trim(),
      workspaceName: workspace.trim() || `${name.trim()}'s studio`
    });
    onClose();
  };

  const initials = name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ME';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#090D18] border border-cyan-500/40 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-violet-600 text-slate-950 font-mono font-bold text-sm flex items-center justify-center shadow-glow-subtle">
            {initials}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your Workspace</h3>
            <p className="text-xs text-slate-400">Personalize your identity & control</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Your Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emmanuel, Nelimo..."
              autoFocus
              required
              className="w-full bg-[#050810] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/60 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workspace Title</span>
            </label>
            <input
              type="text"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="e.g. Cybersecurity Lab, Dev Studio..."
              className="w-full bg-[#050810] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/60 outline-none"
            />
          </div>

          {/* Reset All Dummy Data Button */}
          {onResetWorkspace && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Wipe all dummy sample tasks and start completely clean?')) {
                    onResetWorkspace();
                    onClose();
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all sample data & start fresh</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold shadow-glow-cyan transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
