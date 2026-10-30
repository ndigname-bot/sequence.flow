import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Plus, 
  Trash2, 
  Share2, 
  BookOpen, 
  LayoutGrid, 
  Columns, 
  CheckSquare, 
  Calendar,
  ExternalLink,
  Tag
} from 'lucide-react';
import { sound } from '../utils/sound';

export default function NotesDashboardView({
  notes = [],
  projects = [],
  onAddNote,
  onDeleteNote,
  onSendNoteToQueue
}) {
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [viewStyle, setViewStyle] = useState('split'); // 'split' (Dual Pane) vs 'grid' (Cards Grid)
  const [isEditing, setIsEditing] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter notes by project and search query
  const filteredNotes = notes.filter(note => {
    const matchesProject = selectedProjectId === 'all' || note.project === selectedProjectId;
    const matchesSearch = !searchQuery.trim() || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesSearch;
  });

  const activeNote = notes.find(n => n.id === activeNoteId) || filteredNotes[0] || notes[0] || null;

  const handleCreateNewNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim() || 'New ideas captured here...',
      project: selectedProjectId === 'all' ? (projects[0]?.name || 'Personal') : selectedProjectId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    onAddNote(newNote);
    setActiveNoteId(newNote.id);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowCreateModal(false);
    sound.playAdd();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">A place for every thought.</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your ideas, decisions and small discoveries. Collected as you focus.
          </p>
        </div>

        {/* Stats on Right (Image 2) */}
        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <span className="text-xl font-bold text-white block">{notes.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">NOTES</span>
          </div>
          <div className="text-right font-mono pl-4 border-l border-slate-800">
            <span className="text-xl font-bold text-cyan-400 block">+{Math.min(notes.length, 8)}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">THIS WEEK</span>
          </div>
        </div>
      </div>

      {/* Filter Row: Project Pills & View Toggles (Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Project Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedProjectId('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedProjectId === 'all'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-[#070B16] border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All notes ({notes.length})
          </button>
          {projects.map((proj) => {
            const count = notes.filter(n => n.project === proj.id || n.project === proj.name).length;
            const isSelected = selectedProjectId === proj.id || selectedProjectId === proj.name;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-[#070B16] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {proj.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Action Controls: View Switcher (Dual Pane vs Grid) & New Note */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#070B16] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewStyle('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewStyle === 'split' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Dual-Pane Split View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewStyle('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewStyle === 'grid' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New note</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW A: DUAL-PANE SPLIT VIEW (FIGMA IMAGE 2)             */}
      {/* ======================================================== */}
      {viewStyle === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANE: COLLECTED THOUGHTS LIST */}
          <div className="lg:col-span-5 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-2xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                YOUR NOTEBOOK
              </span>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Collected thoughts
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a thought, project or keyword... (⌘ F)"
                className="w-full bg-[#050810] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Note List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredNotes.length === 0 && (
                <p className="text-xs text-slate-500 italic py-6 text-center">No notes found matching your search.</p>
              )}

              {filteredNotes.map((note) => {
                const isActive = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 ${
                      isActive
                        ? 'bg-blue-950/40 border-blue-500/60 shadow-inner'
                        : 'bg-[#050810] border-slate-800/80 hover:border-slate-700 hover:bg-[#080E1C]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {note.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500">
                          {note.date || 'Today'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {note.content || 'Notes captured during focus session.'}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-cyan-400/80">
                      <Tag className="w-2.5 h-2.5" />
                      <span>{note.project || 'General'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              <span>{filteredNotes.length} of {notes.length} shown</span>
              <span>INDEX / 01</span>
            </div>
          </div>

          {/* RIGHT PANE: ACTIVE NOTE READING & EDITING VIEW (IMAGE 2) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-2xl p-6 md:p-8 space-y-6">
            {activeNote ? (
              <div className="space-y-6 animate-fade-in">
                {/* Note Breadcrumb & Actions */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{activeNote.project || 'Website redesign'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSendNoteToQueue && onSendNoteToQueue(activeNote.title)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/30 text-xs font-semibold transition cursor-pointer"
                      title="Convert to Focus Task"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Queue as Task</span>
                    </button>

                    <button
                      onClick={() => onDeleteNote(activeNote.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note Title & Date Header */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {activeNote.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    {activeNote.date || 'OCT 27, 2026'} • 3 notes from a 30 min focus
                  </p>
                </div>

                {/* Linked Session Banner */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 to-cyan-950/20 border border-blue-500/30 text-xs">
                  <span className="font-semibold text-slate-200">
                    Linked to task: {activeNote.title}
                  </span>
                  <span className="text-cyan-400 font-mono flex items-center gap-1">
                    <span>In progress</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>

                {/* Editorial Quote Box (Image 2) */}
                <div className="p-4 rounded-2xl bg-[#050810] border-l-4 border-l-blue-500 border border-slate-800/80 text-sm text-slate-300 italic leading-relaxed">
                  "The homepage should feel like an invitation to focus, not another tool asking for attention."
                </div>

                {/* Numbered Editorial Insights (Image 2) */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      01 One clear promise
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Lead with the feeling of making progress. Keep the opening message simple: less switching, more meaningful work.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      02 Give the product room
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Explore a wider, editorial hero. Show one real focus session rather than a collage of features. Let the interface tell the story.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      03 Quiet by design
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Use generous spacing, a restrained blue accent and a single primary action. Motion should guide, never compete.
                    </p>
                  </div>
                </div>

                {/* Actual Saved Note Content */}
                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    RAW CAPTURE NOTES
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#050810] p-4 rounded-2xl border border-slate-800">
                    {activeNote.content}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                  <span>Design exploration</span>
                  <span>NOTE / 02</span>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 space-y-2">
                <Bookmark className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm">Select a note from the left pane or click "+ New note" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: CARDS GRID VIEW                                  */}
      {/* ======================================================== */}
      {viewStyle === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                setViewStyle('split');
              }}
              className="p-5 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl hover:border-cyan-500/50 hover:shadow-glow-cyan transition cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    {note.project || 'General'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">{note.date || 'Today'}</span>
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
                  </div>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{note.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{note.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Open reader →</span>
                <span className="text-slate-500">1 min read</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Note Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <form 
            onSubmit={handleCreateNewNote}
            className="w-full max-w-lg rounded-3xl bg-[#090D1A] border border-slate-700 p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-white">Create New Thought Note</h3>
            <input 
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title (e.g. Architecture decisions, Key findings)"
              autoFocus
              className="w-full bg-[#050810] text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 outline-none focus:border-cyan-400"
            />
            <textarea 
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note content, ideas, quotes, or findings..."
              rows={5}
              className="w-full bg-[#050810] text-xs text-white p-3.5 rounded-xl border border-slate-700 outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
