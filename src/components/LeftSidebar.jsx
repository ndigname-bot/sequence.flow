import React, { useState } from 'react';
import { 
  CheckSquare, 
  Layers, 
  BarChart3, 
  Plus, 
  Sparkles, 
  Settings, 
  MoreHorizontal, 
  ChevronsUpDown,
  Folder,
  Bookmark,
  Trash2
} from 'lucide-react';

export default function LeftSidebar({ 
  currentView, 
  onChangeView, 
  activeProject, 
  onSelectProject,
  projects = [],
  onAddProject,
  onDeleteProject,
  tasksCount = 0,
  sprintsCount = 0,
  notesCount = 0,
  userName = 'Nelimo',
  workspaceName = "Nelimo's studio",
  onOpenProfile,
  onOpenSettings
}) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Calculate 2-letter initials
  const initials = userName
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ME';

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject(newProjectName.trim());
    setNewProjectName('');
    setShowAddProject(false);
  };

  return (
    <aside className="hidden md:flex w-64 border-r border-slate-800/80 bg-[#070B12] flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="p-3.5 space-y-5">
        {/* Workspace Switcher */}
        <div 
          onClick={onOpenProfile}
          className="flex items-center justify-between p-2 rounded-2xl bg-[#0F1626]/80 border border-slate-800/80 hover:border-blue-500/40 transition cursor-pointer group"
          title="Click to rename workspace or edit profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-white truncate group-hover:text-blue-200 transition-colors">
                {workspaceName}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">Personal workspace</p>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0" />
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          {/* Focus Room */}
          <button
            onClick={() => onChangeView('focus')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentView === 'focus'
                ? 'bg-blue-600 text-white shadow-glow-subtle font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-0.5">
                <span className="w-0.5 h-2.5 bg-current rounded-full" />
                <span className="w-0.5 h-4 bg-current rounded-full" />
                <span className="w-0.5 h-3 bg-current rounded-full" />
                <span className="w-0.5 h-1.5 bg-current rounded-full" />
              </span>
              <span>Focus room</span>
            </div>
          </button>

          {/* All Tasks */}
          <button
            onClick={() => onChangeView('all_tasks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentView === 'all_tasks'
                ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>All tasks</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{tasksCount}</span>
          </button>

          {/* Sprints */}
          <button
            onClick={() => onChangeView('sprints')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentView === 'sprints'
                ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Sprints</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">0{sprintsCount}</span>
          </button>

          {/* Notes & Vault */}
          <button
            onClick={() => onChangeView('vault')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentView === 'vault'
                ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>Notes & Vault</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">{notesCount}</span>
          </button>

          {/* Insights */}
          <button
            onClick={() => onChangeView('insights')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentView === 'insights'
                ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>Insights</span>
            </div>
          </button>
        </nav>

        {/* Dynamic Personal Projects Section */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            <span>PROJECTS</span>
            <button 
              onClick={() => setShowAddProject(!showAddProject)}
              className="hover:text-blue-400 transition cursor-pointer"
              title="Add personal project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inline Project Add Field */}
          {showAddProject && (
            <form onSubmit={handleCreateProject} className="px-3 pt-1">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name (e.g. Work, Study)..."
                autoFocus
                className="w-full bg-[#050810] text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-blue-500/60 outline-none"
              />
            </form>
          )}

          <div className="space-y-0.5">
            {projects.map((proj) => {
              const isSelected = activeProject === proj.id;
              return (
                <div key={proj.id} className="group/item flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-slate-800/40 transition">
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="flex items-center gap-2 min-w-0 flex-1 text-xs text-left cursor-pointer"
                  >
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className={`truncate ${isSelected ? 'text-blue-300 font-semibold' : 'text-slate-300 group-hover/item:text-white'}`}>
                      {proj.name}
                    </span>
                  </button>

                  <div className="flex items-center gap-1">
                    {proj.count && (
                      <span className="text-[10px] font-mono text-slate-500">{proj.count}</span>
                    )}
                    {projects.length > 1 && (
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition"
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Motivation & Profile */}
      <div className="p-3.5 space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] border border-blue-500/20 text-left relative overflow-hidden">
          <Sparkles className="w-4 h-4 text-blue-400 mb-2" />
          <p className="text-xs font-semibold text-slate-200 leading-snug mb-1">
            Less switching.<br />More meaningful work.
          </p>
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">
            YOUR SPACE TO GO DEEP
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800/80 space-y-1">
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings & shortcuts</span>
          </button>

          <div 
            onClick={onOpenProfile}
            className="flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-slate-800/40 transition cursor-pointer group"
            title="Click to change your name"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                {initials}
              </div>
              <span className="text-slate-200 font-medium truncate group-hover:text-blue-300 transition-colors">
                {userName}
              </span>
            </div>
            <button className="text-slate-500 hover:text-slate-300 p-0.5">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
