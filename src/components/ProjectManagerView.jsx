import React, { useState } from 'react';
import { 
  Folder, 
  CheckSquare, 
  FileText, 
  Plus, 
  MoreHorizontal, 
  LayoutGrid, 
  List, 
  Calendar, 
  Play, 
  Check,
  ExternalLink,
  Clock
} from 'lucide-react';

export default function ProjectManagerView({
  projects = [],
  tasks = [],
  notes = [],
  onAddTask,
  onAddProject,
  onSelectTaskToFocus,
  onOpenNote,
  onToggleComplete
}) {
  // Layout choice: 'board' (3-column Kanban) vs 'list' (Linear sequence queue)
  const [layoutMode, setLayoutMode] = useState('board');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [addingTaskForProject, setAddingTaskForProject] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).toUpperCase();

  const handleCreateTask = (projectId) => {
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      project: projectId,
      duration: '25 min',
      completed: false
    });
    setNewTaskTitle('');
    setAddingTaskForProject(null);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject({
      id: newProjectName.toLowerCase().replace(/\s+/g, '-'),
      name: newProjectName.trim(),
      count: '00'
    });
    setNewProjectName('');
    setShowNewProjectModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Project manager</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Projects, tasks, and notes arranged together so you can plan, review, and move work forward without losing context.
          </p>
        </div>

        {/* Action Controls: View Switcher (Board vs List) & Add Project */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#070B16] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setLayoutMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'board'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Board View (Columns)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'list'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View (Sequential)"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090E1C] border border-slate-800 text-xs font-mono text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{dateFormatted}</span>
          </div>

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New project</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW A: BOARD / COLUMNS VIEW (FIGMA IMAGE 3)             */}
      {/* ======================================================== */}
      {layoutMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const projTasks = tasks.filter(t => t.project === proj.id || t.project === proj.name);
            const projNotes = notes.filter(n => n.project === proj.id || n.project === proj.name);

            return (
              <div 
                key={proj.id}
                className="rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition"
              >
                {/* Column Top Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <h3 className="font-bold text-white text-base tracking-tight">{proj.name}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-lg border border-cyan-800/40">
                      {projTasks.length} tasks • {projNotes.length} notes
                    </span>
                  </div>

                  {/* TASKS SECTION */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold px-1">
                      <span>TASKS</span>
                      <button
                        onClick={() => setAddingTaskForProject(proj.id)}
                        className="text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                      >
                        + Add task
                      </button>
                    </div>

                    {/* Quick Add Task Input */}
                    {addingTaskForProject === proj.id && (
                      <div className="p-2.5 rounded-xl bg-[#050810] border border-blue-500/50 space-y-2 animate-fade-in">
                        <input 
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Task title..."
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateTask(proj.id);
                            if (e.key === 'Escape') setAddingTaskForProject(null);
                          }}
                          className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setAddingTaskForProject(null)}
                            className="px-2 py-1 text-[10px] text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleCreateTask(proj.id)}
                            className="px-2.5 py-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Task Cards List */}
                    {projTasks.length === 0 && addingTaskForProject !== proj.id && (
                      <p className="text-xs text-slate-400 italic py-2 px-1">No tasks yet. Click + Add task above.</p>
                    )}

                    {projTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          task.completed 
                            ? 'bg-[#050810]/60 border-slate-900 opacity-60' 
                            : 'bg-[#080E1C] border-slate-800/80 hover:border-blue-500/40 hover:shadow-glow-blue'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => onToggleComplete(task.id)}
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition cursor-pointer ${
                              task.completed 
                                ? 'bg-blue-600 border-blue-500 text-white' 
                                : 'border-slate-700 hover:border-cyan-400'
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">
                              {task.duration || '25 min'}
                            </span>
                          </div>
                        </div>

                        {!task.completed && (
                          <button
                            onClick={() => onSelectTaskToFocus(task)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-blue-600/30 text-cyan-300 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                            title="Start Focus Mode"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* NOTES SECTION */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold px-1">
                      <span>NOTES</span>
                    </div>

                    {projNotes.length === 0 && (
                      <p className="text-xs text-slate-400 italic py-1 px-1">No notes recorded for this project.</p>
                    )}

                    {projNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => onOpenNote(note)}
                        className="p-3 rounded-2xl bg-[#060A14] border border-slate-800/80 hover:border-violet-500/40 hover:bg-[#090F1E] transition cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200 truncate">{note.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">1 min read</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {note.content || 'Notes captured during session.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: LINEAR / LIST QUEUE VIEW                         */}
      {/* ======================================================== */}
      {layoutMode === 'list' && (
        <div className="rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>ALL SEQUENCE TASKS ({tasks.length})</span>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                  task.completed 
                    ? 'bg-[#050810]/60 border-slate-900 opacity-60' 
                    : 'bg-[#080E1C] border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-cyan-400 font-bold w-6">0{idx + 1}</span>
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                      task.completed ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{task.project || 'General'}</span>
                      <span>•</span>
                      <span>{task.duration || '25 min'}</span>
                    </div>
                  </div>
                </div>

                {!task.completed && (
                  <button
                    onClick={() => onSelectTaskToFocus(task)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Focus</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Manager Footer Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
        <span>{projects.length} projects • {tasks.length} tasks • {notes.length} notes</span>
        <span className="text-cyan-400 font-bold">Next focus session ready anytime</span>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <form 
            onSubmit={handleCreateProject}
            className="w-full max-w-sm rounded-3xl bg-[#090D1A] border border-slate-700 p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Create New Project</h3>
            <input 
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g. Cybersecurity, AI Research, Mobile App"
              autoFocus
              className="w-full bg-[#050810] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
