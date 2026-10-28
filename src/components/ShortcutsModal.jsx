import React from 'react';
import { X, Command } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Complete current task and advance sequence' },
    { key: 'Enter', desc: 'Add task to sequence (when typing in input)' },
    { key: 'N', desc: 'Focus the quick task input from anywhere' },
    { key: 'Esc', desc: 'Close dialogs or blur active input' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-obsidian-900 border border-blue-500/30 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Command className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-semibold text-white">Keyboard Flow</h3>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Designed for speed and uninterrupted focus so you never get stuck between tasks.
        </p>

        <div className="space-y-3">
          {shortcuts.map((s, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between py-2 border-b border-slate-800/80 last:border-0"
            >
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-blue-400 font-mono text-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
          >
            Got it, back to flow
          </button>
        </div>
      </div>
    </div>
  );
}
