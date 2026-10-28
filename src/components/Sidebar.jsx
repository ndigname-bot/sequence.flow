import React from 'react';
import { 
  Zap, 
  Layers, 
  BarChart3, 
  Bookmark, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  onChangeTab, 
  zenMode, 
  onToggleZen,
  activeCount,
  notesCount,
  completedCount
}) {
  const tabs = [
    { id: 'flow', label: 'Flow', icon: Zap, badge: activeCount > 0 ? activeCount : null },
    { id: 'vault', label: 'Vault', icon: Bookmark, badge: notesCount > 0 ? notesCount : null },
    { id: 'sprints', label: 'Routines', icon: Layers },
    { id: 'analytics', label: 'Stats', icon: BarChart3, badge: completedCount > 0 ? completedCount : null },
  ];

  return (
    <>
      {/* Desktop Left Navigation Rail */}
      <aside className="hidden md:flex flex-col justify-between w-18 py-6 px-2 bg-[#06090F]/90 border-r border-slate-800/80 backdrop-blur-xl shrink-0 z-30 select-none">
        <div className="flex flex-col items-center gap-6">
          {/* Logo mark */}
          <div 
            onClick={() => onChangeTab('flow')}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-glow-subtle cursor-pointer hover:scale-105 transition-transform"
          >
            <Layers className="w-5 h-5 text-white" />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center gap-3 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  title={tab.label}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-glow-subtle' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] mt-1 font-mono tracking-tight">{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-white font-mono text-[9px] flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onToggleZen}
            title={zenMode ? 'Exit Zen Mode' : 'Cinematic Zen Mode'}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-300 hover:bg-slate-800/60 transition"
          >
            {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Android / Mobile Bottom Ergonomic Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#080B10]/95 border-t border-slate-800/90 backdrop-blur-xl flex items-center justify-around px-2 z-40 select-none pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 transition ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 font-sans">{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-0 right-2 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={onToggleZen}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-blue-300"
        >
          {zenMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          <span className="text-[9px] mt-0.5">Zen</span>
        </button>
      </nav>
    </>
  );
}
