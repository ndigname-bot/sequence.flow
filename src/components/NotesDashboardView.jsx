import React, { useState, useRef, useEffect } from 'react';
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
  Tag,
  Play,
  Pause,
  Mic,
  Volume2,
  Smile,
  Sparkles,
  ArrowUpRight,
  X,
  FileText
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
  
  // Layout choice: 'shelf' (ReadEra Bookshelf) vs 'split' (Dual Pane) vs 'grid' (Cards Grid)
  const [viewStyle, setViewStyle] = useState(() => {
    return localStorage.getItem('sequence_notes_layout_v2') || 'shelf';
  });

  const [selectedNoteForModal, setSelectedNoteForModal] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Audio Playback for Voice Notes
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioPlayerRef = useRef(null);

  // Persist layout choice
  useEffect(() => {
    localStorage.setItem('sequence_notes_layout_v2', viewStyle);
  }, [viewStyle]);

  const togglePlayAudio = (noteId, audioDataUrl) => {
    if (playingAudioId === noteId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAudioId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(audioDataUrl);
    audioPlayerRef.current = audio;
    setPlayingAudioId(noteId);

    audio.onended = () => {
      setPlayingAudioId(null);
      audioPlayerRef.current = null;
    };
    audio.onerror = () => {
      setPlayingAudioId(null);
      audioPlayerRef.current = null;
    };
    audio.play().catch(err => console.error('Audio play error:', err));
  };

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

  // Notebook Cover Styling Themes
  const getNoteCoverTheme = (note, index) => {
    if (note.audioDataUrl) {
      return {
        bg: 'bg-gradient-to-br from-[#271038] via-[#160824] to-[#0A0312]',
        border: 'border-violet-500/40 hover:border-fuchsia-400',
        spine: 'border-l-fuchsia-500',
        badgeBg: 'bg-violet-950/80 text-fuchsia-300 border-fuchsia-800/60',
        glow: 'shadow-violet-950/40',
        accentText: 'text-fuchsia-400',
        pillBg: 'from-violet-600 to-fuchsia-500'
      };
    }
    const lower = (note.project || '').toLowerCase();
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
    // Default palettes
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
        bg: 'bg-gradient-to-br from-[#1a1236] via-[#100a24] to-[#080414]',
        border: 'border-violet-500/40 hover:border-violet-400',
        spine: 'border-l-violet-400',
        badgeBg: 'bg-violet-950/80 text-violet-300 border-violet-800/60',
        glow: 'shadow-violet-950/40',
        accentText: 'text-violet-400',
        pillBg: 'from-violet-600 to-purple-500'
      }
    ];
    return palettes[index % palettes.length];
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">A place for every thought.</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your ideas, voice memos, and small discoveries. Collected as you focus.
          </p>
        </div>

        {/* Stats on Right */}
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

      {/* Filter Row: Project Pills & View Toggles */}
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

        {/* Action Controls: Shelf / Split / Grid View Switcher & New Note */}
        <div className="flex items-center gap-2">
          {/* Switcher Pills: Shelf | Split | Grid */}
          <div className="flex items-center bg-[#070B16] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewStyle('shelf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewStyle === 'shelf' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="ReadEra Bookshelf View (Notebook Covers)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Shelf</span>
            </button>
            <button
              onClick={() => setViewStyle('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewStyle === 'split' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Dual-Pane Split Reader"
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
      {/* ZERO STATE (IF NO NOTES SAVED YET)                       */}
      {/* ======================================================== */}
      {notes.length === 0 && (
        <div className="py-20 rounded-3xl bg-[#070B16] border border-dashed border-slate-800 text-center space-y-4 max-w-xl mx-auto animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-cyan-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your notebook shelf is clear</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              Capture your first idea, or speak a hands-free voice note in the floating companion to start filling your shelf.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create your first thought</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW A: READERA NOTEBOOK SHELF (BOOK COVER FORMAT)        */}
      {/* ======================================================== */}
      {viewStyle === 'shelf' && notes.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          {/* ReadEra Header Bar Above Shelf */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#003844] via-[#04242c] to-[#061922] border border-cyan-500/30 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm">
                <Smile className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                    Thought Notebooks on Shelf
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-bold">
                    {filteredNotes.length} volumes
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/70 hidden sm:block">
                  Click any notebook cover to open reader, or hit ▶ to play voice memos directly from the shelf.
                </p>
              </div>
            </div>

            {/* Quick Find Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in notebooks..."
                className="w-full bg-[#03151D] text-xs text-white pl-8 pr-3 py-1.5 rounded-xl border border-cyan-500/40 outline-none focus:border-cyan-300 placeholder-cyan-300/40 font-sans"
              />
            </div>
          </div>

          {/* Notebook Bookshelf Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {filteredNotes.map((note, idx) => {
              const theme = getNoteCoverTheme(note, idx);

              return (
                <div 
                  key={note.id}
                  onClick={() => setSelectedNoteForModal(note)}
                  className={`group relative rounded-3xl ${theme.bg} border-2 ${theme.border} border-l-8 ${theme.spine} shadow-2xl ${theme.glow} p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2.5 hover:scale-[1.02] hover:rotate-[-0.75deg] hover:shadow-cyan-500/25 cursor-pointer min-h-[350px] overflow-hidden`}
                >
                  {/* Spine Stitched Texture Overlay */}
                  <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/30 border-r border-white/5 pointer-events-none" />

                  {/* Ambient Light Gleam Sheen on Hover */}
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Top Cover Bar: Project Tag Badge & Delete Button */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-lg border ${theme.badgeBg}`}>
                      {note.audioDataUrl ? '🎙️ VOICE MEMO' : (note.project || 'THOUGHT')}
                    </span>

                    {onDeleteNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900/80 transition cursor-pointer opacity-40 group-hover:opacity-100 active:scale-90"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Center Cover Graphic & Typography */}
                  <div className="my-auto py-5 space-y-3 relative z-10 text-center">
                    {/* Visual Voice Memo Player OR Monogram */}
                    {note.audioDataUrl ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(note.id, note.audioDataUrl)}
                          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer group/btn"
                          title={playingAudioId === note.id ? 'Pause Voice Note' : 'Play Voice Note'}
                        >
                          {playingAudioId === note.id ? (
                            <Pause className="w-7 h-7 fill-current" />
                          ) : (
                            <Play className="w-7 h-7 fill-current ml-1" />
                          )}
                        </button>
                        
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px] text-fuchsia-300 font-bold">
                          <span>{note.duration || '0:15'}</span>
                          {playingAudioId === note.id && (
                            <span className="flex items-end gap-0.5 h-3 ml-1">
                              <span className="w-0.5 bg-fuchsia-300 rounded-full animate-wave-1" />
                              <span className="w-0.5 bg-white rounded-full animate-wave-2" />
                              <span className="w-0.5 bg-cyan-300 rounded-full animate-wave-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition">
                        <FileText className={`w-6 h-6 ${theme.accentText}`} />
                      </div>
                    )}

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug group-hover:text-cyan-200 transition line-clamp-2">
                        {note.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 relative z-10" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-slate-500">{note.date || 'Today'}</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSendNoteToQueue && onSendNoteToQueue(note.title)}
                        className="p-1 rounded text-cyan-400 hover:text-white transition cursor-pointer"
                        title="Queue as focus task"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedNoteForModal(note)}
                        className="flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: DUAL-PANE SPLIT VIEW (FIGMA IMAGE 2)             */}
      {/* ======================================================== */}
      {viewStyle === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
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

                    {/* Voice Memo player pill if note has audio */}
                    {note.audioDataUrl && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 p-1.5 rounded-xl bg-violet-950/60 border border-violet-500/40 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(note.id, note.audioDataUrl)}
                          className="w-5 h-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition"
                          title={playingAudioId === note.id ? 'Pause' : 'Play'}
                        >
                          {playingAudioId === note.id ? (
                            <Pause className="w-2.5 h-2.5 fill-current" />
                          ) : (
                            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          )}
                        </button>
                        <span className="text-[10px] font-mono text-violet-300 font-bold truncate flex-1">
                          Voice Memo • {note.duration || '0:15'}
                        </span>
                        {playingAudioId === note.id && (
                          <span className="flex items-center gap-0.5 h-2.5 pr-1">
                            <span className="w-0.5 h-2 bg-violet-300 animate-pulse" />
                            <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                            <span className="w-0.5 h-1.5 bg-violet-300 animate-pulse delay-150" />
                          </span>
                        )}
                      </div>
                    )}

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

          {/* RIGHT PANE: ACTIVE NOTE READING & EDITING VIEW (FIGMA IMAGE 2) */}
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

                {/* Voice Recording Player Bar if active note has audioDataUrl */}
                {activeNote.audioDataUrl && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/70 to-purple-950/50 border border-violet-500/40 shadow-xl flex items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => togglePlayAudio(activeNote.id, activeNote.audioDataUrl)}
                        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95 shrink-0"
                        title={playingAudioId === activeNote.id ? 'Pause Voice Memo' : 'Play Voice Memo'}
                      >
                        {playingAudioId === activeNote.id ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Mic className="w-3.5 h-3.5 text-rose-400" />
                            <span>Recorded Voice Memo</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-900/80 border border-violet-400/40 text-violet-200 font-bold">
                            {activeNote.duration || '0:15'}
                          </span>
                        </div>
                        <p className="text-[11px] text-violet-300/80 mt-0.5">
                          {playingAudioId === activeNote.id ? 'Playing voice recording audio...' : 'Recorded hands-free in Work Companion'}
                        </p>
                      </div>
                    </div>

                    {playingAudioId === activeNote.id ? (
                      <div className="flex items-center gap-1 h-5 pr-2">
                        <span className="w-1 h-3 bg-violet-400 animate-pulse rounded-full" />
                        <span className="w-1 h-5 bg-cyan-300 animate-pulse delay-75 rounded-full" />
                        <span className="w-1 h-2 bg-purple-400 animate-pulse delay-150 rounded-full" />
                        <span className="w-1 h-4 bg-violet-300 animate-pulse delay-100 rounded-full" />
                        <span className="w-1 h-5 bg-white animate-pulse delay-200 rounded-full" />
                      </div>
                    ) : (
                      <button
                        onClick={() => togglePlayAudio(activeNote.id, activeNote.audioDataUrl)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 text-xs font-semibold border border-violet-400/30 transition cursor-pointer"
                      >
                        Play Audio
                      </button>
                    )}
                  </div>
                )}

                {/* Editorial Quote Box (Image 2) */}
                <div className="p-4 rounded-2xl bg-[#050810] border-l-4 border-l-blue-500 border border-slate-800/80 text-sm text-slate-300 italic leading-relaxed">
                  "The homepage should feel like an invitation to focus, not another tool asking for attention."
                </div>

                {/* Actual Saved Note Content */}
                <div className="pt-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                    RAW CAPTURE NOTES
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#050810] p-4 rounded-2xl border border-slate-800">
                    {activeNote.content}
                  </p>
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
      {/* VIEW C: CARDS GRID VIEW                                  */}
      {/* ======================================================== */}
      {viewStyle === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
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

                {note.audioDataUrl && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 p-2 rounded-xl bg-violet-950/60 border border-violet-500/40 text-xs mt-2"
                  >
                    <button
                      type="button"
                      onClick={() => togglePlayAudio(note.id, note.audioDataUrl)}
                      className="w-6 h-6 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                      title={playingAudioId === note.id ? 'Pause' : 'Play'}
                    >
                      {playingAudioId === note.id ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </button>
                    <span className="text-[10px] font-mono text-violet-300 font-bold truncate flex-1">
                      Voice Memo • {note.duration || '0:15'}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Open reader →</span>
                <span className="text-slate-500">1 min read</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* NOTE READER MODAL (FOR SHELF OPENING)                    */}
      {/* ======================================================== */}
      {selectedNoteForModal && (
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
                    {selectedNoteForModal.project || 'THOUGHT NOTEBOOK'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {selectedNoteForModal.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedNoteForModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Memo Player inside Modal if audio exists */}
            {selectedNoteForModal.audioDataUrl && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/70 to-purple-950/50 border border-violet-500/40 shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => togglePlayAudio(selectedNoteForModal.id, selectedNoteForModal.audioDataUrl)}
                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer active:scale-95 shrink-0"
                  >
                    {playingAudioId === selectedNoteForModal.id ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-rose-400" />
                        <span>Recorded Voice Memo</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-900/80 border border-violet-400/40 text-violet-200 font-bold">
                        {selectedNoteForModal.duration || '0:15'}
                      </span>
                    </div>
                    <p className="text-[11px] text-violet-300/80 mt-0.5">
                      {playingAudioId === selectedNoteForModal.id ? 'Playing voice recording audio...' : 'Recorded hands-free'}
                    </p>
                  </div>
                </div>

                {playingAudioId === selectedNoteForModal.id && (
                  <div className="flex items-center gap-1 h-5 pr-2">
                    <span className="w-1 h-3 bg-violet-400 animate-pulse rounded-full" />
                    <span className="w-1 h-5 bg-cyan-300 animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-purple-400 animate-pulse delay-150 rounded-full" />
                  </div>
                )}
              </div>
            )}

            {/* Note Content Box */}
            <div className="p-5 rounded-2xl bg-[#050810] border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {selectedNoteForModal.content}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <button
                onClick={() => {
                  if (onSendNoteToQueue) onSendNoteToQueue(selectedNoteForModal.title);
                  setSelectedNoteForModal(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/30 transition cursor-pointer font-semibold"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Queue as Task</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {onDeleteNote && (
                  <button
                    onClick={() => {
                      onDeleteNote(selectedNoteForModal.id);
                      setSelectedNoteForModal(null);
                    }}
                    className="p-2 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setSelectedNoteForModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
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