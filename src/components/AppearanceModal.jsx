import React from 'react';
import { X, Check, Type, Palette, Sliders } from 'lucide-react';
import { FONT_STYLES, FONT_SIZES, COLOR_THEMES } from '../utils/theme';

export default function AppearanceModal({
  isOpen,
  onClose,
  currentFont,
  onSelectFont,
  currentSize,
  onSelectSize,
  currentTheme,
  onSelectTheme
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#090D1A] border border-slate-700/80 shadow-2xl p-6 space-y-6 text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Appearance & Typography</h3>
              <p className="text-xs text-slate-400">Personalize your font, scale, and colors</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Font Style */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span>Typeface Style</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FONT_STYLES.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectFont(f.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs text-left transition cursor-pointer ${
                  currentFont === f.id
                    ? 'bg-blue-600/20 border-cyan-400 text-white font-bold shadow-sm'
                    : 'bg-[#060812] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
                style={{ fontFamily: f.family }}
              >
                <span>{f.name}</span>
                {currentFont === f.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Font Size Scale */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Font Size & Spacing</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {FONT_SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSize(s.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs transition cursor-pointer ${
                  currentSize === s.id
                    ? 'bg-blue-600/20 border-cyan-400 text-white font-bold shadow-sm'
                    : 'bg-[#060812] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{s.scale}x</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Accent Color Theme */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>Accent Theme</span>
          </div>
          <div className="space-y-2">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  currentTheme === theme.id
                    ? 'bg-slate-800/80 border-cyan-400 text-white font-bold'
                    : 'bg-[#060812] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-1">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm"
                      style={{ backgroundColor: theme.primary }} 
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm"
                      style={{ backgroundColor: theme.accent }} 
                    />
                  </div>
                  <span>{theme.name}</span>
                </div>
                {currentTheme === theme.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
