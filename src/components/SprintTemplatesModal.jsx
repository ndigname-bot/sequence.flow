import React from 'react';
import { X, Sparkles, Coffee, Code2, BookOpen, Wind } from 'lucide-react';

export default function SprintTemplatesModal({ isOpen, onClose, onLoadTemplate }) {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'morning',
      title: 'Morning Startup Routine',
      icon: Coffee,
      desc: 'Get grounded and build early momentum without decision fatigue.',
      tasks: [
        { title: 'Lock in today’s #1 non-negotiable outcome', notes: 'Write it in one clear sentence.' },
        { title: 'Clear high-priority messages & triage inbox', notes: 'Quick sweep, do not get sucked into rabbit holes.' },
        { title: 'Begin 45-minute deep focus session', notes: 'Close all secondary tabs.' }
      ]
    },
    {
      id: 'dev',
      title: 'Code & Ship Sprint',
      icon: Code2,
      desc: 'Fast-paced developer flow from implementation to deployment.',
      tasks: [
        { title: 'Implement feature / fix core bug', notes: 'Keep changes atomic.' },
        { title: 'Run tests & verify build passes', notes: 'npm test / flutter test' },
        { title: 'Git commit & push to GitHub', notes: 'git push origin main' }
      ]
    },
    {
      id: 'study',
      title: 'Deep Study / Academic Sprint',
      icon: BookOpen,
      desc: 'Structured learning sprint for reading and retaining.',
      tasks: [
        { title: 'Deep read chapter / assigned material', notes: 'Highlight key diagrams & definitions.' },
        { title: 'Synthesize bullet-point summary in Scratchpad', notes: 'Explain in your own words.' },
        { title: 'Solve 3 practice questions / test retention', notes: 'Verify without looking at answers.' }
      ]
    },
    {
      id: 'reset',
      title: 'Mind & Workspace Reset',
      icon: Wind,
      desc: 'Wrap up your session cleanly so tomorrow starts effortlessly.',
      tasks: [
        { title: 'Close idle browser tabs and terminal windows', notes: 'Save all open draft files.' },
        { title: 'Jot down top 2 tasks for tomorrow in Scratchpad', notes: 'Eliminate tomorrow morning friction.' },
        { title: 'Review completed tasks log & celebrate progress', notes: 'Done for today!' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-obsidian-900 border border-blue-500/30 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Sprint Presets</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Load a curated 3-step sequence in 1 tap whenever you're unsure what to tackle next.
        </p>

        <div className="space-y-3">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  onLoadTemplate(tpl.tasks);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-obsidian-950/70 hover:bg-[#10192e] border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-semibold text-white group-hover:text-blue-200">
                      {tpl.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    3 steps
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{tpl.desc}</p>
                <div className="pl-3 border-l-2 border-slate-800 text-[11px] text-slate-500 space-y-0.5">
                  {tpl.tasks.map((t, idx) => (
                    <div key={idx} className="truncate">• {t.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
