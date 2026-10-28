import React, { useState, useEffect } from 'react';
import { X, BookmarkPlus, Tag, CornerDownLeft, Sparkles } from 'lucide-react';

export default function QuickCaptureModal({ isOpen, onClose, onSaveNote }) {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('video'); // 'video' | 'idea' | 'important' | 'reference'

  useEffect(() => {
    if (isOpen) {
      setContent('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveNote({
      id: `note-${Date.now()}`,
      content: content.trim(),
      tag,
      createdAt: Date.now()
    });
    setContent('');
    onClose();
  };

  const tags = [
    { id: 'video', label: '📺 Video Note', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    { id: 'important', label: '⭐ Important', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { id: 'idea', label: '💡 Quick Idea', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    { id: 'reference', label: '📌 Reference / Link', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#090D16] border border-blue-500/40 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <BookmarkPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Quick Capture Vault</h3>
            <p className="text-xs text-slate-400">
              Jot down notes while watching videos or browsing without losing focus.
            </p>
          </div>
        </div>

        {/* Tag Selector */}
        <div className="flex flex-wrap gap-2 my-4">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTag(t.id)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition border ${
                tag === t.id 
                  ? t.color + ' font-semibold shadow-glow-subtle ring-1 ring-blue-400' 
                  : 'bg-obsidian-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Note Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your note, quote from a video, key link, or future reminder here..."
            rows={5}
            autoFocus
            className="w-full bg-[#05080F] text-slate-100 placeholder-slate-500 p-4 rounded-2xl border border-slate-800 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 outline-none text-sm font-sans resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Saved in your Vault • Access anytime
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                <span>Save to Vault</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
