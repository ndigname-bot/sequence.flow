import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bookmark, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  MoreHorizontal,
  ArrowRight,
  CheckSquare,
  Square
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
  const [bookViewMode, setBookViewMode] = useState(false);
  const [checkedActions, setCheckedActions] = useState({});

  // New Note Modal / Inline Form State
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState(projects[0]?.name || 'Website redesign');
  const [newCategory, setNewCategory] = useState('Design exploration');
  const [newCallout, setNewCallout] = useState('');
  const [newPoint1, setNewPoint1] = useState('');
  const [newPoint2, setNewPoint2] = useState('');
  const [newPoint3, setNewPoint3] = useState('');
  const [newActionItem, setNewActionItem] = useState('');

  const filteredNotes = notes.filter(n => {
    const matchesFilter = selectedFilter === 'all' || n.project?.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = n.title?.toLowerCase().includes(search.toLowerCase()) || 
                          (n.callout && n.callout.toLowerCase().includes(search.toLowerCase())) ||
                          (n.quote && n.quote.toLowerCase().includes(search.toLowerCase())) ||
                          (n.points && n.points.some(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.desc?.toLowerCase().includes(search.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  const activeNote = notes.find(n => n.id === selectedNoteId) || filteredNotes[0] || notes[0] || null;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const points = [];
    if (newPoint1.trim()) points.push({ num: '01', title: newPoint1.trim().split('\n')[0], desc: newPoint1.trim().split('\n').slice(1).join('\n') || '' });
    if (newPoint2.trim()) points.push({ num: '02', title: newPoint2.trim().split('\n')[0], desc: newPoint2.trim().split('\n').slice(1).join('\n') || '' });
    if (newPoint3.trim()) points.push({ num: '03', title: newPoint3.trim().split('\n')[0], desc: newPoint3.trim().split('\n').slice(1).join('\n') || '' });

    const created = {
      id: `n-${Date.now()}`,
      title: newTitle.trim(),
      project: newProject,
      category: newCategory || 'Personal Reflection',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      sessionInfo: '3 notes from a 30 min focus',
      calloutTitle: newTitle.trim(),
      callout: newCallout.trim(),
      points: points.length > 0 ? points : undefined,
      actionItem: newActionItem.trim() ? {
        title: newActionItem.trim(),
        sub: 'Carry into the next session'
      } : undefined
    };

    onAddNote(created);
    setSelectedNoteId(created.id);
    setNewTitle('');
    setNewCallout('');
    setNewPoint1('');
    setNewPoint2('');
    setNewPoint3('');
    setNewActionItem('');
    setShowNewNoteForm(false);
  };

  const handleCopy = () => {
    if (!activeNote) return;
    const pointsText = activeNote.points ? activeNote.points.map(p => `${p.num} ${p.title}\n${p.desc}`).join('\n\n') : '';
    const textToCopy = `${activeNote.title}\n${activeNote.date || ''}\n\n${activeNote.callout || activeNote.quote || ''}\n\n${pointsText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleActionCheck = (noteId) => {
    setCheckedActions(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in select-none">
      {/* Top Breadcrumb & Actions Bar (Matching Figma Image 2 Top Header) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="hover:text-slate-200 cursor-pointer">Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-white font-medium">Notebook</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>All changes saved</span>
          </div>

          <button 
            onClick={() => {
              const searchInput = document.getElementById('notes-search-input');
              if (searchInput) searchInput.focus();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#070D1A] border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition"
          >
            <span>Quick find</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[9px] text-slate-300">⌘K</kbd>
          </button>

          <button
            onClick={() => setShowNewNoteForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glow-blue transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New note</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            A place for every thought.
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Your ideas, decisions and small discoveries. Collected as you focus.
          </p>
        </div>

        {/* Right Stats & View Options */}
        <div className="flex items-center gap-6 text-right">
          <div>
            <span className="text-xl font-bold font-mono text-white block leading-tight">{notes.length}</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">NOTES</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-xl font-bold font-mono text-cyan-400 block leading-tight">+{Math.min(notes.length, 8)}</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">THIS WEEK</span>
          </div>
          <div className="border-l border-slate-800 pl-4 hidden sm:flex items-center gap-2">
            <button
              onClick={() => setBookViewMode(!bookViewMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition cursor-pointer ${
                bookViewMode 
                  ? 'bg-blue-600/20 border-blue-500/50 text-cyan-300' 
                  : 'bg-[#060A14] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Book view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Project Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
            selectedFilter === 'all'
              ? 'bg-blue-600 text-white font-semibold shadow-glow-blue'
              : 'bg-[#070D1A] border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>All notes</span>
          <span className="text-[10px] font-mono opacity-80">{notes.length}</span>
        </button>

        {projects.map((proj) => {
          const count = notes.filter(n => n.project?.toLowerCase() === proj.name.toLowerCase()).length;
          const isSelected = selectedFilter.toLowerCase() === proj.name.toLowerCase();
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedFilter(proj.name)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-glow-blue'
                  : 'bg-[#070D1A] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{proj.name}</span>
              <span className="text-[10px] font-mono opacity-80">{count.toString().padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      {/* Modal / Form: Create Real Note */}
      {showNewNoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-[#080D1A] border border-cyan-400/30 shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white mb-1">Create Notebook Thought</h3>
            <p className="text-xs text-slate-400 mb-4">Structure your ideas, takeaways, and next steps.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Thought / Note Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Architecture or Homepage direction"
                  autoFocus
                  required
                  className="w-full bg-[#050812] text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/60 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Project</label>
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="w-full bg-[#050812] text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Design exploration, Decision log, Ideas"
                    className="w-full bg-[#050812] text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Callout Summary / Thesis</label>
                <textarea
                  value={newCallout}
                  onChange={(e) => setNewCallout(e.target.value)}
                  placeholder="The main takeaway or promise (e.g. The homepage should feel like an invitation to focus...)"
                  rows={2}
                  className="w-full bg-[#050812] text-slate-100 text-xs p-3 rounded-xl border border-slate-800 outline-none font-sans resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Numbered Principles / Takeaways</label>
                <input
                  type="text"
                  value={newPoint1}
                  onChange={(e) => setNewPoint1(e.target.value)}
                  placeholder="01 Title and description (e.g. One clear promise: Lead with progress)"
                  className="w-full bg-[#050812] text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                />
                <input
                  type="text"
                  value={newPoint2}
                  onChange={(e) => setNewPoint2(e.target.value)}
                  placeholder="02 Title and description (e.g. Give product room: Show one real focus session)"
                  className="w-full bg-[#050812] text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Actionable Next Step (Optional)</label>
                <input
                  type="text"
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  placeholder="e.g. Sketch two hero directions"
                  className="w-full bg-[#050812] text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue"
                >
                  Save to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two-Column Notebook Layout (Matching Figma Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Column: Collected Thoughts List */}
        <div className="lg:col-span-5 rounded-[28px] bg-[#070C18]/90 border border-slate-800/80 p-5 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-0.5">
                YOUR NOTEBOOK
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">Collected thoughts</h3>
                <span className="text-xs font-mono text-slate-400">{filteredNotes.length}</span>
              </div>
            </div>

            {/* Search Input with ⌘F badge */}
            <div className="relative mb-3.5">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="notes-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a thought, project or keyword..."
                className="w-full bg-[#040812] text-xs text-slate-200 placeholder-slate-500 pl-9 pr-9 py-2.5 rounded-xl border border-slate-800/80 focus:border-cyan-500/50 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">
                ⌘F
              </span>
            </div>

            {/* Sub-bar: Recently Opened */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2 px-1">
              <span>RECENTLY OPENED</span>
              <span>{filteredNotes.length} OF {notes.length}</span>
            </div>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs font-mono">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-slate-300 font-medium mb-1">No thoughts matched</p>
                <p className="text-slate-500 text-[11px] mb-3">Add a thought or search another keyword.</p>
                <button
                  onClick={() => setShowNewNoteForm(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 text-cyan-300 border border-blue-500/30 text-xs font-medium hover:bg-blue-600/30 transition cursor-pointer"
                >
                  + Add First Note
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
                {filteredNotes.map(note => {
                  const isSelected = activeNote?.id === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#0E172B] border-cyan-400/50 shadow-glow-subtle'
                          : 'bg-[#050914]/60 hover:bg-[#0A1020] border-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {note.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{note.time || '14:32'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pl-5.5">
                        <span className="truncate">{note.project}</span>
                        <span>•</span>
                        <span className="truncate">{note.category || 'Session notes'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Left Footer: Browse all notes & Index */}
          <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span className="hover:text-cyan-300 cursor-pointer flex items-center gap-1">
              Browse all notes <ArrowRight className="w-2.5 h-2.5" />
            </span>
            <span className="text-slate-500">INDEX / 01</span>
          </div>
        </div>

        {/* Right Column: Selected Note Detail View (Matching Figma Screenshot 2) */}
        <div className="lg:col-span-7 rounded-[28px] bg-[#070C18]/90 border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between backdrop-blur-sm">
          {activeNote ? (
            <div className="space-y-6">
              {/* Header: Project pill & Actions */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/40 text-[11px] font-mono text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{activeNote.project}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                    title="Copy note"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {}}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                    title="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteNote && onDeleteNote(activeNote.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Metadata */}
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {activeNote.title}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeNote.date || 'OCT 27, 2026'} • {activeNote.sessionInfo || '3 notes from a 30 min focus'}
                </span>
              </div>

              {/* Editorial Callout Box with ↗ Icon */}
              {(activeNote.callout || activeNote.quote || activeNote.content) && (
                <div className="p-4 rounded-2xl bg-[#0B1324]/80 border border-blue-500/30 text-slate-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
                    <span>{activeNote.calloutTitle || activeNote.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeNote.callout || activeNote.quote || activeNote.content}
                  </p>
                </div>
              )}

              {/* Numbered Principles / Takeaways Cards (01, 02, 03) */}
              {activeNote.points && activeNote.points.length > 0 && (
                <div className="space-y-4 pt-1">
                  {activeNote.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3.5 text-xs">
                      <span className="font-mono text-cyan-400 font-bold shrink-0 text-sm mt-0.5">
                        {pt.num || `0${i+1}`}
                      </span>
                      <div className="space-y-0.5">
                        <strong className="text-white block font-semibold text-xs">
                          {pt.title}
                        </strong>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {pt.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actionable Next Step Box (e.g. Sketch two hero directions) */}
              {activeNote.actionItem && (
                <div 
                  onClick={() => toggleActionCheck(activeNote.id)}
                  className="p-3.5 rounded-2xl bg-[#060B17] border border-slate-800/80 hover:border-cyan-400/30 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-cyan-400">
                      {checkedActions[activeNote.id] ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 group-hover:text-cyan-300" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-medium block ${checkedActions[activeNote.id] ? 'line-through text-slate-500' : 'text-white'}`}>
                        {activeNote.actionItem.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {activeNote.actionItem.sub || 'Carry into the next session'}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs font-mono">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No note selected. Pick or create a note on the left.</p>
            </div>
          )}

          {/* Right Footer: Category & Note Number */}
          <div className="pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>{activeNote?.category || 'Design exploration'}</span>
            <span className="text-slate-500">NOTE / 02</span>
          </div>
        </div>

      </div>
    </div>
  );
}
