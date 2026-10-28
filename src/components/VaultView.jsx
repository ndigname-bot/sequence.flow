import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Tag, 
  ExternalLink 
} from 'lucide-react';

export default function VaultView({ 
  notes, 
  onDeleteNote, 
  onSendToSequence, 
  onOpenQuickCapture 
}) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tagBadges = {
    video: { label: '📺 Video Note', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    important: { label: '⭐ Important', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    idea: { label: '💡 Quick Idea', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    reference: { label: '📌 Reference', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };

  const filtered = notes.filter(n => {
    const matchesTag = selectedTag === 'all' || n.tag === selectedTag;
    const matchesSearch = n.content.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-400" />
            Quick Notes & Info Vault
          </h2>
          <p className="text-xs text-slate-400">
            Thoughts, video takeaways, and reminders stored safely for later.
          </p>
        </div>

        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quick Note</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved notes and links..."
            className="w-full bg-obsidian-900/90 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-blue-500/50 outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border shrink-0 ${
              selectedTag === 'all'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({notes.length})
          </button>
          {Object.entries(tagBadges).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedTag(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border shrink-0 ${
                selectedTag === key
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-obsidian-950/40 p-12 text-center">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-300 mb-1">Vault is clean</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Whenever you are watching a video or find important information, hit the "New Quick Note" button (or press Q) to save it.
          </p>
          <button
            onClick={onOpenQuickCapture}
            className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-medium hover:bg-blue-600/30 transition"
          >
            + Capture Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((n) => {
            const badge = tagBadges[n.tag] || tagBadges.video;
            const dateStr = new Date(n.createdAt).toLocaleDateString([], { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit' 
            });

            return (
              <div
                key={n.id}
                className="group p-5 rounded-2xl bg-[#090E1A]/80 hover:bg-[#0D1424] border border-slate-800 hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {dateStr}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => onSendToSequence(n.content)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition"
                    title="Send this note into today's active sequence"
                  >
                    <span>Turn into Sequence Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(n.id, n.content)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                      title="Copy to clipboard"
                    >
                      {copiedId === n.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteNote(n.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
