import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Tag, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight, 
  Search, 
  FileText,
  Sparkles,
  CornerDownLeft
} from 'lucide-react';

export default function NotesWorkspace({ 
  activeTask, 
  onUpdateActiveTaskNotes,
  vaultNotes, 
  onAddVaultNote, 
  onDeleteVaultNote, 
  onSendToScheduler 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'video' | 'task_notes'
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedTag, setSelectedTag] = useState('video');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const tags = [
    { id: 'video', label: '📺 Video Note', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 'idea', label: '💡 Quick Idea', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'important', label: '⭐ Important', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 'ref', label: '📌 Reference', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  ];

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    onAddVaultNote({
      id: `note-${Date.now()}`,
      content: newNoteText.trim(),
      tag: selectedTag,
      createdAt: Date.now()
    });

    setNewNoteText('');
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = vaultNotes.filter(n => {
    const matchesTab = activeTab === 'all' || (activeTab === 'video' && n.tag === 'video');
    const matchesSearch = n.content.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col rounded-3xl bg-[#080D18] border border-slate-800/90 shadow-xl overflow-hidden">
      {/* Workspace Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-[#090F1D]/80">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Notes & Video Vault</h3>
              <p className="text-[11px] text-slate-400">Information & takeaways kept separate from schedule</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            {vaultNotes.length} saved
          </span>
        </div>

        {/* Rapid Capture Input Bar */}
        <form onSubmit={handleCreateNote} className="space-y-2">
          <div className="relative">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Capture note while watching a video or surfing (Hit Enter to save)..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateNote(e);
                }
              }}
              className="w-full bg-[#050810] text-slate-100 placeholder-slate-500 p-3 rounded-2xl border border-slate-800 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 outline-none text-xs font-sans resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {tags.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTag(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition border shrink-0 ${
                    selectedTag === t.id
                      ? t.color + ' font-semibold ring-1 ring-blue-400'
                      : 'bg-obsidian-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-[11px] font-semibold transition shrink-0 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Tabs: [ All Vault ] | [ 📺 Video Notes ] | [ Active Task Notes ] */}
      <div className="flex items-center gap-1 p-2 bg-[#060A13] border-b border-slate-800/80 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-medium transition text-center ${
            activeTab === 'all'
              ? 'bg-blue-600/20 text-blue-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Notes ({vaultNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-medium transition text-center ${
            activeTab === 'video'
              ? 'bg-blue-600/20 text-blue-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📺 Video Notes
        </button>
        <button
          onClick={() => setActiveTab('task_notes')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-medium transition text-center ${
            activeTab === 'task_notes'
              ? 'bg-blue-600/20 text-blue-300 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Task Scratchpad
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* VIEW 1: ACTIVE TASK SPECIFIC SCRATCHPAD */}
        {activeTab === 'task_notes' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-[11px] font-mono font-semibold text-blue-300 uppercase tracking-wider block mb-1">
                Scratchpad for Current Focus:
              </span>
              <p className="text-xs font-semibold text-white truncate">
                {activeTask?.title || 'No active task selected'}
              </p>
            </div>
            {activeTask ? (
              <textarea
                value={activeTask.notes || ''}
                onChange={(e) => onUpdateActiveTaskNotes(activeTask.id, e.target.value)}
                placeholder="Write specific notes, formulas, scratch links for this active task..."
                rows={10}
                className="w-full bg-[#050810] text-slate-200 placeholder-slate-600 p-4 rounded-2xl border border-slate-800 outline-none text-xs font-sans resize-none leading-relaxed focus:border-blue-500/50"
              />
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                Start a task in the Focus pane to unlock its scratchpad.
              </p>
            )}
          </div>
        ) : (
          /* VIEW 2: VAULT NOTES LIST */
          <>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                No notes in this category. Type in the box above to capture one!
              </div>
            ) : (
              filteredNotes.map(n => (
                <div 
                  key={n.id}
                  className="p-3.5 rounded-2xl bg-[#0A0F1E] border border-slate-800/80 hover:border-blue-500/30 transition-all space-y-2 group"
                >
                  <p className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSendToScheduler(n.content)}
                        className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                        title="Add as a task on the Scheduler side"
                      >
                        <span>➔ Schedule</span>
                      </button>

                      <button
                        onClick={() => handleCopy(n.id, n.content)}
                        className="text-slate-500 hover:text-slate-200 p-1"
                        title="Copy note"
                      >
                        {copiedId === n.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={() => onDeleteVaultNote(n.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
