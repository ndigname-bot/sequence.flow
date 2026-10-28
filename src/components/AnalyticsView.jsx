import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Copy, 
  Check, 
  Trash2, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AnalyticsView({ completedTasks, onClearHistory }) {
  const [copied, setCopied] = useState(false);

  const totalFocusSec = completedTasks.reduce((acc, t) => acc + (t.elapsedSeconds || 0), 0);
  const totalFocusMin = Math.round(totalFocusSec / 60);

  const handleCopyMarkdown = () => {
    if (completedTasks.length === 0) return;
    const items = completedTasks.map(t => {
      const min = Math.round((t.elapsedSeconds || 0) / 60);
      return `- [x] **${t.title}** (${min} mins)${t.notes ? `\n  > ${t.notes}` : ''}`;
    }).join('\n');

    const md = `### Sequence Daily Focus Log\n- Total Steps Completed: ${completedTasks.length}\n- Total Focus Duration: ${totalFocusMin} mins\n\n${items}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Momentum & Insights
          </h2>
          <p className="text-xs text-slate-400">
            Real-time tracking of your flow state and completed sequences.
          </p>
        </div>

        <button
          onClick={handleCopyMarkdown}
          disabled={completedTasks.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Log!' : 'Export Notion Markdown'}</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Tasks Conquered</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {completedTasks.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Steps completed today</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Total Focus Time</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {totalFocusMin} <span className="text-sm font-sans text-slate-400 font-normal">mins</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">In active momentum</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <Flame className="w-4 h-4 text-blue-400" />
            <span>Flow Velocity</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-blue-400">
            {completedTasks.length > 0 ? `${completedTasks.length * 15}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Momentum streak</p>
        </div>
      </div>

      {/* History Log */}
      <div className="rounded-3xl border border-slate-800 bg-obsidian-950/60 p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Sequence History ({completedTasks.length})
            </h3>
          </div>
          {completedTasks.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        {completedTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No completed tasks in this session yet. Advance your first task to see insights!
          </div>
        ) : (
          <div className="space-y-3">
            {completedTasks.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-obsidian-900/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-200 line-through">
                      {t.title}
                    </p>
                    {t.notes && (
                      <p className="text-slate-400 mt-1 text-[11px] bg-obsidian-950/80 p-2 rounded border border-slate-800 font-sans">
                        {t.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px] text-slate-500">
                  {Math.round((t.elapsedSeconds || 0) / 60)}m focus
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
