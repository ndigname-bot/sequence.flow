import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bookmark, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  BookOpen,
  Folder,
  FileText
} from 'lucide-react';

export default function NotesDashboard({ 
  notes = [], 
  onAddNote, 
  onDeleteNote,
  projects = []
}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);
  const [copied, setCopied] = useState(false);

  // New Note Modal / Inline Form State
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState(projects[0]?.name || 'General');
  const [newCategory, setNewCategory] = useState('Lecture Note');
  const [newContent, setNewContent] = useState('');

  const filteredNotes = notes.filter(n => {
    const matchesFilter = selectedFilter === 'all' || n.project?.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = n.title?.toLowerCase().includes(search.toLowerCase()) || 
                          (n.content && n.content.toLowerCase().includes(search.toLowerCase())) ||
                          (n.quote && n.quote.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const activeNote = notes.find(n => n.id === selectedNoteId) || filteredNotes[0] || null;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = {
      id: `n-${Date.now()}`,
      title: newTitle.trim(),
      project: newProject,
      category: newCategory,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      duration: 'Manual entry',
      quote: newContent.trim(),
      points: []
    };

    onAddNote(created);
    setSelectedNoteId(created.id);
    setNewTitle('');
    setNewContent('');
    setShowNewNoteForm(false);
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(`${activeNote.title}\n\n${activeNote.quote || activeNote.content || ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            A place for every thought.
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Your ideas, lecture takeaways, audits, and plans. Collected as you focus.
          </p>
        </div>

        {/* Right Stats & Add Note Action */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-white font-bold block text-sm">{notes.length}</span>
              <span className="text-[10px] text-slate-500">SAVED NOTES</span>
            </div>
          </div>

          <button
            onClick={() => setShowNewNoteForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New note</span>
          </button>
        </div>
      </div>

      {/* Dynamic Project Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedFilter === 'all'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-[#090F1E] border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All notes ({notes.length})
        </button>

        {projects.map((proj) => {
          const count = notes.filter(n => n.project?.toLowerCase() === proj.name.toLowerCase()).length;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedFilter(proj.name)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
                selectedFilter === proj.name
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-[#090F1E] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {proj.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Modal / Form: Create Real Note */}
      {showNewNoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#090D18] border border-cyan-500/40 shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white mb-1">Create Notebook Note</h3>
            <p className="text-xs text-slate-400 mb-4">Add a real note for your project or university course.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Note Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Lecture 2: Middleware Architecture"
                  autoFocus
                  required
                  className="w-full bg-[#050810] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/60 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Project</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full bg-[#050810] text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Lecture Note, Audit, Plan"
                    className="w-full bg-[#050810] text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content / Key Takeaways</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your notes, important points, quotes, or code references here..."
                  rows={4}
                  className="w-full bg-[#050810] text-slate-100 text-xs p-3 rounded-xl border border-slate-800 outline-none font-sans resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewNoteForm(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Column Notebook Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Notes List Column */}
        <div className="lg:col-span-5 rounded-3xl bg-[#080D19]/90 border border-slate-800/80 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3 text-slate-400 font-mono">
              <span className="uppercase tracking-wider text-[10px]">YOUR NOTEBOOK</span>
              <span className="text-[10px]">{filteredNotes.length} thoughts</span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a thought, project or keyword... ⌘F"
                className="w-full bg-[#050812] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:border-cyan-500/50 outline-none"
              />
            </div>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs font-mono">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-slate-300 font-medium mb-1">No notes in this category yet</p>
                <p className="text-slate-500 text-[11px] mb-3">Your notebook is ready for your real thoughts.</p>
                <button
                  onClick={() => setShowNewNoteForm(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-medium hover:bg-blue-600/30 transition cursor-pointer"
                >
                  + Add First Note
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-1">
                {filteredNotes.map(note => {
                  const isSelected = activeNote?.id === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#101A30] border-cyan-400/40 shadow-glow-subtle'
                          : 'bg-[#060912]/60 hover:bg-[#0B1324] border-slate-800/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {note.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{note.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{note.project}</span>
                        <span>•</span>
                        <span>{note.category || 'Note'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>INDEX / 01</span>
            <span className="text-cyan-400">Your Personal Repository</span>
          </div>
        </div>

        {/* Right Note Reading Pane */}
        <div className="lg:col-span-7 rounded-3xl bg-[#080D19]/90 border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between">
          {activeNote ? (
            <div className="space-y-6">
              {/* Header metadata */}
              <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-mono font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeNote.project}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{activeNote.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="Copy note"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onDeleteNote && onDeleteNote(activeNote.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Date */}
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {activeNote.title}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {activeNote.date || 'OCT 2026'} • {activeNote.duration || 'Saved to your pocket'}
                </span>
              </div>

              {/* Content / Quote Block */}
              {(activeNote.quote || activeNote.content) && (
                <div className="p-4 rounded-2xl bg-[#0C152B]/70 border border-cyan-500/20 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {activeNote.quote || activeNote.content}
                </div>
              )}

              {/* Takeaways / Points if any */}
              {activeNote.points && activeNote.points.length > 0 && (
                <div className="space-y-3">
                  {activeNote.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs leading-relaxed">
                      <span className="font-mono text-cyan-400 font-bold shrink-0">{pt.num || `0${i+1}`}</span>
                      <div>
                        <strong className="text-white block mb-0.5">{pt.title}</strong>
                        <span className="text-slate-400">{pt.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs font-mono">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No note selected. Pick or create a note on the left.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Personal Workspace</span>
            <span className="text-cyan-400">Auto-saved to your device</span>
          </div>
        </div>
      </div>
    </div>
  );
}
