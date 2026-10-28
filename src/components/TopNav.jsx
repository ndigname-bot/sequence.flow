import React from 'react';
import { Search, Plus, Check, ChevronRight, LayoutGrid } from 'lucide-react';

export default function TopNav({ onOpenNewTask, onOpenQuickFind, activeProject }) {
  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#080C14] px-4 sm:px-6 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Left: Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Sequence Logo with 4 vertical waveform-like bars */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="flex items-center gap-0.5 h-5">
            <span className="w-1 h-3 rounded-full bg-blue-500 group-hover:h-4 transition-all duration-200" />
            <span className="w-1 h-5 rounded-full bg-blue-400 group-hover:h-3 transition-all duration-200" />
            <span className="w-1 h-4 rounded-full bg-blue-500 group-hover:h-5 transition-all duration-200" />
            <span className="w-1 h-2 rounded-full bg-blue-300 group-hover:h-3 transition-all duration-200" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-sans lowercase">
            sequence
          </span>
        </div>

        {/* Workspace Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-sans">
          <div className="p-1 rounded bg-slate-800/60 text-slate-400">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="hover:text-slate-200 cursor-pointer">Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-200 font-medium">Focus room</span>
        </div>

        {/* All changes saved pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>All changes saved</span>
        </div>
      </div>

      {/* Right: Quick find & + New Task button */}
      <div className="flex items-center gap-3">
        {/* Quick find ⌘K */}
        <button
          onClick={onOpenQuickFind}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1626] hover:bg-[#141E34] border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Quick find</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700/60">
            ⌘ K
          </kbd>
        </button>

        {/* + New task */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New task</span>
        </button>
      </div>
    </header>
  );
}
