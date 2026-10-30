import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  CheckSquare, 
  FileText, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  List, 
  Calendar, 
  Play, 
  Check, 
  ExternalLink, 
  Clock, 
  RotateCcw, 
  AlertCircle,
  BookOpen,
  Bookmark,
  Smile,
  Sparkles,
  ChevronRight,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function ProjectManagerView({
  projects = [],
  tasks = [],
  notes = [],
  onAddTask,
  onAddProject,
  onDeleteProject,
  onDeleteTask,
  onDeleteNote,
  onClearAll,
  onRestoreDemoData,
  onSelectTaskToFocus,
  onOpenNote,
  onToggleComplete
}) {
  // Layout choice: 'shelf' (ReadEra book covers) vs 'board' (Kanban columns) vs 'list' (Sequential queue)
  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem('sequence_project_layout_v2') || 'shelf';
  });

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('Study & Reading');
  
  // Selected Project for "Open It Myself" Workspace Modal (ReadEra Reader format)
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);

  // In-card task/note creation
  const [addingTaskForProject, setAddingTaskForProject] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingNoteForProject, setAddingNoteForProject] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // Persist layout choice
  useEffect(() => {
    localStorage.setItem('sequence_project_layout_v2', layoutMode);
  }, [layoutMode]);

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
    sound.playAdd();
  };

  const handleCreateNote = (projectId) => {
    if (!newNoteTitle.trim()) return;
    if (onOpenNote) {
      sound.playAdd();
    }
    setNewNoteTitle('');
    setAddingNoteForProject(null);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject({
      id: newProjectName.toLowerCase().replace(/\s+/g, '-'),
      name: newProjectName.trim(),
      category: newProjectCategory || 'Study & Focus',
      count: '00'
    });
    setNewProjectName('');
    setShowNewProjectModal(false);
    sound.playAdd();
  };

  // Get project cover theme colors & icon
  const getProjectCoverTheme = (index, name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('money') || lower.includes('finance') || lower.includes('reading')) {
      return {
        bg: 'bg-gradient-to-br from-[#0c2229] via-[#07161b] to-[#040d11]',
        border: 'border-emerald-500/40 hover:border-emerald-400',
        spine: 'border-l-emerald-500',
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
        glow: 'shadow-emerald-950/40',
        accentText: 'text-emerald-400',
        pillBg: 'from-emerald-600 to-teal-500'
      };
    }
    if (lower.includes('website') || lower.includes('design') || lower.includes('frontend')) {
      return {
        bg: 'bg-gradient-to-br from-[#0b1b36] via-[#071022] to-[#040813]',
        border: 'border-blue-500/40 hover:border-cyan-400',
        spine: 'border-l-cyan-400',
        badgeBg: 'bg-blue-950/80 text-cyan-300 border-cyan-800/60',
        glow: 'shadow-blue-950/40',
        accentText: 'text-cyan-400',
        pillBg: 'from-blue-600 to-cyan-500'
      };
    }
    if (lower.includes('product') || lower.includes('strategy') || lower.includes('system')) {
      return {
        bg: 'bg-gradient-to-br from-[#1c1236] via-[#110a22] to-[#090513]',
        border: 'border-violet-500/40 hover:border-violet-400',
        spine: 'border-l-violet-400',
        badgeBg: 'bg-violet-950/80 text-violet-300 border-violet-800/60',
        glow: 'shadow-violet-950/40',
        accentText: 'text-violet-400',
        pillBg: 'from-violet-600 to-purple-500'
      };
    }
    // Default palette
    const palettes = [
      {
        bg: 'bg-gradient-to-br from-[#1b1c2b] via-[#0f101c] to-[#07080f]',
        border: 'border-amber-500/40 hover:border-amber-400',
        spine: 'border-l-amber-400',
        badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
        glow: 'shadow-amber-950/40',
        accentText: 'text-amber-400',
        pillBg: 'from-amber-600 to-orange-500'
      },
      {
        bg: 'bg-gradient-to-br from-[#0e2133] via-[#091522] to-[#050b13]',
        border: 'border-cyan-500/40 hover:border-cyan-400',
        spine: 'border-l-cyan-400',
        badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
        glow: 'shadow-cyan-950/40',
        accentText: 'text-cyan-400',
        pillBg: 'from-cyan-600 to-blue-500'
      }
    ];
    return palettes[index % palettes.length];
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

        {/* Action Controls: Shelf / Board / List Toggle, New Project & Clear All */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher: Shelf (ReadEra) | Board (Kanban) | List (Sequential) */}
          <div className="flex items-center bg-[#070B16] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setLayoutMode('shelf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'shelf'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="ReadEra Shelf View (Book Covers & Minimalist Cards)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Shelf</span>
            </button>
            <button
              onClick={() => setLayoutMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'board'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Board View (Kanban Columns)"
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
              title="List View (Sequential Queue)"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Clear All Button */}
          <button
            onClick={() => setShowClearConfirmModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-medium transition cursor-pointer"
            title="Clear all demo data and start 100% clean"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear all</span>
          </button>

          {/* New Project Button */}
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
      {/* ZERO STATE (IF USER CLEARED ALL DATA)                     */}
      {/* ======================================================== */}
      {projects.length === 0 && (
        <div className="py-20 rounded-3xl bg-[#070B16] border border-dashed border-slate-800 text-center space-y-4 max-w-xl mx-auto animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-cyan-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your workspace is clean and ready</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              All demo projects, tasks, and notes have been cleared. You now have a quiet, 100% clean space to build your own system.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create your first project</span>
            </button>
            {onRestoreDemoData && (
              <button
                onClick={onRestoreDemoData}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore sample projects</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW A: READERA SHELF / COVERS VIEW (FIGMA + READERA)    */}
      {/* ======================================================== */}
      {layoutMode === 'shelf' && projects.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {/* ReadEra-Style Header Bar Above Shelf */}
          <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#003844] via-[#04242c] to-[#061922] border border-cyan-500/30 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm">
                <Smile className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                    Reading & Projects Now
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-bold">
                    {projects.length} on shelf
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/70 hidden sm:block">
                  Click any project cover to open workspace, or hit ▶ to start a focus session immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-300/80 hidden md:inline">
                ReadEra Grid Mode
              </span>
            </div>
          </div>

          {/* Book / Project Cards Shelf Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {projects.map((proj, idx) => {
              const projTasks = tasks.filter(t => t.project === proj.id || t.project === proj.name);
              const projNotes = notes.filter(n => n.project === proj.id || n.project === proj.name);
              const completedTasks = projTasks.filter(t => t.completed).length;
              const percent = projTasks.length > 0 ? Math.round((completedTasks / projTasks.length) * 100) : 0;
              const theme = getProjectCoverTheme(idx, proj.name);

              return (
                <div 
                  key={proj.id}
                  onClick={() => setSelectedProjectForModal(proj)}
                  className={`group relative rounded-3xl ${theme.bg} border-2 ${theme.border} border-l-8 ${theme.spine} shadow-2xl ${theme.glow} p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cyan-900/30 cursor-pointer min-h-[350px] overflow-hidden`}
                >
                  {/* Subtle Spine Texture Overlay */}
                  <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/30 border-r border-white/5 pointer-events-none" />

                  {/* Top Cover Bar: Category Badge & Delete Button */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-lg border ${theme.badgeBg}`}>
                      {proj.category || 'PROJECT'}
                    </span>

                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900/80 transition cursor-pointer opacity-40 group-hover:opacity-100"
                        title="Delete this project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Center Cover Graphic & Typography */}
                  <div className="my-auto py-6 space-y-3 relative z-10 text-center">
                    {/* Visual Emblem / Circle Progress */}
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
                      <span className={`text-xl font-extrabold font-mono ${theme.accentText}`}>
                        {percent > 0 ? `${percent}%` : (proj.count || '01')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {projTasks.length} active tasks • {projNotes.length} captured notes
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-3 border-t border-white/10 space-y-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                    {/* Start Focus Button */}
                    {projTasks.length > 0 ? (
                      <button
                        onClick={() => {
                          const firstActive = projTasks.find(t => !t.completed) || projTasks[0];
                          onSelectTaskToFocus(firstActive);
                        }}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r ${theme.pillBg} hover:brightness-110 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-98`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start project focus</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedProjectForModal(proj)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add tasks</span>
                      </button>
                    )}

                    {/* Open Inspector Link */}
                    <button
                      onClick={() => setSelectedProjectForModal(proj)}
                      className="w-full flex items-center justify-center gap-1 py-1 text-[11px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <span>Open workspace</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: BOARD / COLUMNS VIEW (FIGMA KANBAN FORMAT)       */}
      {/* ======================================================== */}
      {layoutMode === 'board' && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {projects.map((proj) => {
            const projTasks = tasks.filter(t => t.project === proj.id || t.project === proj.name);
            const projNotes = notes.filter(n => n.project === proj.id || n.project === proj.name);

            return (
              <div 
                key={proj.id}
                className="rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition relative group/card"
              >
                <div>
                  {/* Column Top Header: Project Name, Counts & Delete Project Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                      <h3 className="font-extrabold text-white text-base tracking-tight truncate">
                        {proj.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-lg border border-cyan-800/40">
                        {projTasks.length} tasks
                      </span>
                      {onDeleteProject && (
                        <button
                          onClick={() => onDeleteProject(proj.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 transition cursor-pointer ml-1"
                          title="Delete this project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Start Focus on this Project Button */}
                  {projTasks.length > 0 && (
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          const firstActive = projTasks.find(t => !t.completed) || projTasks[0];
                          onSelectTaskToFocus(firstActive);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer active:scale-98"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start project focus</span>
                      </button>
                    </div>
                  )}

                  {/* TASKS SECTION */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold px-1">
                      <span>TASKS ({projTasks.length})</span>
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

                    {/* Task Cards List with Delete & Focus Buttons */}
                    {projTasks.length === 0 && addingTaskForProject !== proj.id && (
                      <p className="text-xs text-slate-500 italic py-2 px-1">No tasks in this project yet.</p>
                    )}

                    {projTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                          task.completed 
                            ? 'bg-[#050810]/60 border-slate-900 opacity-60' 
                            : 'bg-[#080E1C] border-slate-800/80 hover:border-blue-500/40 hover:shadow-glow-blue'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            onClick={() => onToggleComplete(task.id)}
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                              task.completed 
                                ? 'bg-blue-600 border-blue-500 text-white' 
                                : 'border-slate-700 hover:border-cyan-400'
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                              {task.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">
                              {task.duration || '25 min'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons on task */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                          {!task.completed && (
                            <button
                              onClick={() => onSelectTaskToFocus(task)}
                              className="p-1.5 rounded-lg bg-blue-600/30 text-cyan-300 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              title="Start Focus Mode on this task"
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          )}
                          {onDeleteTask && (
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* NOTES SECTION */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold px-1">
                      <span>NOTES ({projNotes.length})</span>
                    </div>

                    {projNotes.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-1 px-1">No notes recorded.</p>
                    )}

                    {projNotes.map((note) => (
                      <div
                        key={note.id}
                        className="group/note p-3 rounded-2xl bg-[#060A14] border border-slate-800/80 hover:border-violet-500/40 hover:bg-[#090F1E] transition space-y-1 relative"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span 
                            onClick={() => onOpenNote(note)}
                            className="font-semibold text-slate-200 truncate cursor-pointer hover:text-white"
                          >
                            {note.title}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-slate-400">1 min</span>
                            {onDeleteNote && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteNote(note.id);
                                }}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                                title="Delete note"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p 
                          onClick={() => onOpenNote(note)}
                          className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed cursor-pointer"
                        >
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
      {/* VIEW C: LINEAR / LIST QUEUE VIEW (FIGMA LIST FORMAT)     */}
      {/* ======================================================== */}
      {layoutMode === 'list' && (
        <div className="rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>ALL SEQUENCE TASKS ({tasks.length})</span>
          </div>

          {tasks.length === 0 && (
            <p className="text-xs text-slate-500 italic py-8 text-center">No tasks in queue. Add tasks from projects or click "+ New task".</p>
          )}

          <div className="space-y-2.5">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition group ${
                  task.completed 
                    ? 'bg-[#050810]/60 border-slate-900 opacity-60' 
                    : 'bg-[#080E1C] border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-cyan-400 font-bold w-6">0{idx + 1}</span>
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition cursor-pointer shrink-0 ${
                      task.completed ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{task.project || 'General'}</span>
                      <span>•</span>
                      <span>{task.duration || '25 min'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!task.completed && (
                    <button
                      onClick={() => onSelectTaskToFocus(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Focus</span>
                    </button>
                  )}
                  {onDeleteTask && (
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
        <span>{projects.length} projects • {tasks.length} tasks • {notes.length} notes</span>
        <span className="text-cyan-400 font-bold">Sequence workspace active</span>
      </div>

      {/* ======================================================== */}
      {/* PROJECT WORKSPACE MODAL ("OPEN IT MYSELF AND START")     */}
      {/* ======================================================== */}
      {selectedProjectForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090D1A] border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    {selectedProjectForModal.category || 'PROJECT WORKSPACE'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {selectedProjectForModal.name}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedProjectForModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: Start Project Focus */}
            {(() => {
              const projTasks = tasks.filter(t => t.project === selectedProjectForModal.id || t.project === selectedProjectForModal.name);
              const firstActive = projTasks.find(t => !t.completed) || projTasks[0];

              return (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 to-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">Ready to dive in?</span>
                    <span className="text-xs text-slate-400">Launch a 30-minute focus session on this project.</span>
                  </div>

                  <button
                    disabled={!firstActive}
                    onClick={() => {
                      if (firstActive) {
                        onSelectTaskToFocus(firstActive);
                        setSelectedProjectForModal(null);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start project focus</span>
                  </button>
                </div>
              );
            })()}

            {/* Tasks in this Project */}
            {(() => {
              const projTasks = tasks.filter(t => t.project === selectedProjectForModal.id || t.project === selectedProjectForModal.name);

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-bold">
                    <span>TASKS ({projTasks.length})</span>
                    <button
                      onClick={() => setAddingTaskForProject(selectedProjectForModal.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold text-xs cursor-pointer"
                    >
                      + Add Task
                    </button>
                  </div>

                  {/* Add Task Input inside modal */}
                  {addingTaskForProject === selectedProjectForModal.id && (
                    <div className="p-3 rounded-2xl bg-[#050810] border border-blue-500/50 space-y-2 animate-fade-in">
                      <input 
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateTask(selectedProjectForModal.id);
                          if (e.key === 'Escape') setAddingTaskForProject(null);
                        }}
                        className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setAddingTaskForProject(null)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleCreateTask(selectedProjectForModal.id)}
                          className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                        >
                          Add Task
                        </button>
                      </div>
                    </div>
                  )}

                  {projTasks.length === 0 && addingTaskForProject !== selectedProjectForModal.id && (
                    <p className="text-xs text-slate-500 italic py-3 text-center">No tasks in this project yet.</p>
                  )}

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {projTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#050810] border border-slate-800/80 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => onToggleComplete(task.id)}
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                              task.completed ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 hover:border-cyan-400'
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <span className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!task.completed && (
                            <button
                              onClick={() => {
                                onSelectTaskToFocus(task);
                                setSelectedProjectForModal(null);
                              }}
                              className="p-1.5 rounded-lg bg-blue-600/30 text-cyan-300 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              title="Start Focus on this task"
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          )}
                          {onDeleteTask && (
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Notes in this Project */}
            {(() => {
              const projNotes = notes.filter(n => n.project === selectedProjectForModal.id || n.project === selectedProjectForModal.name);

              return (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-bold">
                    <span>NOTES ({projNotes.length})</span>
                  </div>

                  {projNotes.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2 text-center">No notes captured for this project yet.</p>
                  )}

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {projNotes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => {
                          onOpenNote(note);
                          setSelectedProjectForModal(null);
                        }}
                        className="p-3 rounded-2xl bg-[#050810] border border-slate-800/80 hover:border-violet-500/40 hover:bg-[#080E1C] transition cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white truncate">{note.title}</span>
                          <span className="text-[10px] font-mono text-slate-500">{note.date || 'Today'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              {onDeleteProject && (
                <button
                  onClick={() => {
                    onDeleteProject(selectedProjectForModal.id);
                    setSelectedProjectForModal(null);
                  }}
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete project</span>
                </button>
              )}

              <button
                onClick={() => setSelectedProjectForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold ml-auto transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* NEW PROJECT CREATION MODAL                               */}
      {/* ======================================================== */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <form 
            onSubmit={handleCreateProject}
            className="w-full max-w-sm rounded-3xl bg-[#090D1A] border border-slate-700 p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">Create New Project</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Project Title</label>
              <input 
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g. The Psychology of Money, AI Research"
                autoFocus
                className="w-full bg-[#050810] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Category Tag</label>
              <select
                value={newProjectCategory}
                onChange={(e) => setNewProjectCategory(e.target.value)}
                className="w-full bg-[#050810] text-xs text-white px-3 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-cyan-400"
              >
                <option value="Study & Reading">Study & Reading</option>
                <option value="System & Code">System & Code</option>
                <option value="Design & Strategy">Design & Strategy</option>
                <option value="Personal Growth">Personal Growth</option>
              </select>
            </div>

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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* CLEAR ALL CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#090D1A] border border-rose-500/40 p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Clear All Projects & Notes?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will remove all demo projects, tasks, and notes so you can start with a 100% clean, personal workspace.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirmModal(false);
                  sound.playComplete();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}