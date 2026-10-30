import React from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  LayoutGrid, 
  Folder, 
  BookOpen, 
  Sparkles, 
  BarChart2, 
  Palette,
  Check
} from 'lucide-react';

export default function TopNav({ 
  currentTab = 'focus', 
  onChangeTab, 
  onOpenNewTask, 
  onOpenQuickFind,
  onOpenAppearance
}) {
  const tabs = [
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'focus', label: 'Focus mode', icon: Sparkles },
    { id: 'analytics', label: 'Focus analytics', icon: BarChart2 }
  ];

  const currentTabLabel = tabs.find(t => t.id === currentTab)?.label || 'Focus mode';

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070A14]/95 px-4 sm:px-8 flex items-center justify-between gap-4 select-none shrink-0 z-30 backdrop-blur-md">
      {/* Left: Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Sequence Logo with 4 vertical waveform-like bars */}
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onChangeTab('focus')}>
          <div className="flex items-center gap-0.5 h-5">
            <span className="w-1 h-3 rounded-full bg-cyan-400 group-hover:h-4 transition-all duration-200" />
            <span className="w-1 h-5 rounded-full bg-blue-500 group-hover:h-3 transition-all duration-200" />
            <span className="w-1 h-4 rounded-full bg-cyan-300 group-hover:h-5 transition-all duration-200" />
            <span className="w-1 h-2 rounded-full bg-violet-400 group-hover:h-3 transition-all duration-200" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-sans lowercase">
            sequence
          </span>
        </div>

        {/* Workspace Breadcrumb (Figma style) */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-sans">
          <div className="p-1 rounded bg-slate-800/60 text-slate-400">
            <LayoutGrid className="w-3 h-3" />
          </div>
          <span className="hover:text-slate-200 cursor-pointer">Workspace</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-200 font-semibold">{currentTabLabel}</span>
        </div>
      </div>

      {/* Center: The 4 Unified Horizontal View Switcher Pills (From Figma Images 0, 1, 2, 3) */}
      <nav className="flex items-center bg-[#050810] p-1 rounded-2xl border border-slate-800/90 shadow-inner">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Actions: Appearance (Aa/Palette), Quick Find, New Task */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Appearance & Typography Customizer Button */}
        <button
          onClick={onOpenAppearance}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090E1C] hover:bg-[#0E162C] border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
          title="Change Font Style, Size & Color Theme"
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline font-medium">Appearance</span>
        </button>

        {/* Quick find ⌘K */}
        <button
          onClick={onOpenQuickFind}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090E1C] hover:bg-[#0E162C] border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700/60">
            ⌘ K
          </kbd>
        </button>

        {/* + New task */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 active:scale-98 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New task</span>
        </button>
      </div>
    </header>
  );
}
