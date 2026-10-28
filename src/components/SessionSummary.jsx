import React, { useState } from 'react';
import { 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Trash2, 
  Clock, 
  Flame,
  Check
} from 'lucide-react';

export default function SessionSummary({ completedTasks, onClearHistory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalFocusSec = completedTasks.reduce((acc, t) => acc + (t.elapsedSeconds || 0), 0);
  const totalFocusMin = Math.round(totalFocusSec / 60);

  const handleCopySummary = () => {
    if (completedTasks.length === 0) return;
    const text = completedTasks.map((t, i) => {
      const min = Math.round((t.elapsedSeconds || 0) / 60);
      return `• [x] ${t.title} (${min}m)${t.notes ? `\n    Notes: ${t.notes}` : ''}`;
    }).join('\n');

    const summary = `**Sequence Session Log**\nCompleted: ${completedTasks.length} tasks | Total focus: ${totalFocusMin}m\n\n${text}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-6 border-t border-slate-800/80">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Completed</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {completedTasks.length}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Focused</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {totalFocusMin} <span className="text-xs font-normal text-slate-400 font-sans">mins</span>
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-obsidian-900/60 border border-slate-800/80 flex sm:block items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 sm:mb-1">
            <Flame className="w-3.5 h-3.5 text-blue-400" />
            <span>Momentum</span>
          </div>
          <p className="text-xl font-bold font-mono text-blue-400">
            {completedTasks.length > 0 ? `${completedTasks.length * 10}%` : 'Ready'}
          </p>
        </div>
      </div>

      {/* Notion-style Toggle for Finished Tasks */}
      {completedTasks.length > 0 && (
        <div className="rounded-xl border border-slate-800/80 bg-obsidian-950/60 overflow-hidden">
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-800/30 transition select-none"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <span>Session Log ({completedTasks.length} done)</span>
            </div>
            
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Copy markdown summary"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={onClearHistory}
                className="p-1 text-slate-500 hover:text-rose-400 transition"
                title="Clear history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="p-3.5 border-t border-slate-800/80 space-y-2 bg-obsidian-900/30">
              {completedTasks.map((t) => (
                <div 
                  key={t.id}
                  className="flex items-start justify-between text-xs py-1.5 px-2 rounded hover:bg-slate-800/40"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="line-through text-slate-400">{t.title}</span>
                      {t.notes && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {t.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px] ml-2 shrink-0">
                    {Math.round((t.elapsedSeconds || 0) / 60)}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
