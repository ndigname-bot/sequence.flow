import React from 'react';
import { 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  Timer, 
  HelpCircle,
  Layers,
  BookmarkPlus
} from 'lucide-react';
import AmbientPlayer from './AmbientPlayer';

export default function Header({ 
  soundEnabled, 
  onToggleSound, 
  notificationStatus, 
  onRequestNotification,
  nudgeInterval,
  onChangeNudgeInterval,
  onShowShortcuts,
  onOpenQuickCapture
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800/70">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-glow-subtle">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white font-sans">
              Sequence
            </h1>
            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold tracking-wide">
              Flow 2.0
            </span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Fast Quick Note Capture (for video watching/learning) */}
        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-mono transition shadow-glow-subtle cursor-pointer"
          title="Quickly save an important note or video takeaway (Shortcut: Q)"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold">Quick Note</span>
          <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 text-[9px] bg-blue-900/60 rounded text-blue-200 border border-blue-400/20">
            Q
          </kbd>
        </button>

        {/* Ambient Focus Audio Player */}
        <AmbientPlayer />

        {/* Nudge Timer Interval Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-obsidian-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Timer className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-500 hidden sm:inline">Nudge:</span>
          <select 
            value={nudgeInterval} 
            onChange={(e) => onChangeNudgeInterval(Number(e.target.value))}
            className="bg-transparent text-blue-400 outline-none cursor-pointer text-xs"
            title="Auto-ping reminder interval"
          >
            <option value={0} className="bg-obsidian-900 text-slate-300">Off</option>
            <option value={5} className="bg-obsidian-900 text-slate-300">5m</option>
            <option value={10} className="bg-obsidian-900 text-slate-300">10m</option>
            <option value={15} className="bg-obsidian-900 text-slate-300">15m</option>
            <option value={25} className="bg-obsidian-900 text-slate-300">25m</option>
          </select>
        </div>

        {/* Desktop Notification Toggle */}
        <button
          onClick={onRequestNotification}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
            notificationStatus === 'granted'
              ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
              : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title={notificationStatus === 'granted' ? 'Alerts Active' : 'Enable Notifications'}
        >
          {notificationStatus === 'granted' ? (
            <Bell className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <BellOff className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
          title={soundEnabled ? 'Chime audio active' : 'Audio muted'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Keyboard Shortcuts Help */}
        <button
          onClick={onShowShortcuts}
          className="p-1.5 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
          title="Keyboard shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
