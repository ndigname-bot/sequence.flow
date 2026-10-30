import React from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Play, 
  Sun,
  Flame,
  Award
} from 'lucide-react';

export default function FocusAnalyticsView({
  totalFocusedSeconds = 45000, // 12h 30m default matching Figma
  completedCount = 25,
  streakDays = 5,
  onStartFocus
}) {
  const hours = Math.floor(totalFocusedSeconds / 3600);
  const minutes = Math.floor((totalFocusedSeconds % 3600) / 60);

  const daysData = [
    { day: 'Mon', date: '19', hours: 2.0, count: 4, height: '55%' },
    { day: 'Tue', date: '20', hours: 2.5, count: 5, height: '70%' },
    { day: 'Wed', date: '21', hours: 1.5, count: 3, height: '40%' },
    { day: 'Thu', date: '22', hours: 3.0, count: 6, height: '85%' },
    { day: 'Fri', date: '23', hours: 3.5, count: 7, height: '95%' },
    { day: 'Sat', date: '24', hours: 0, count: 0, height: '0%' },
    { day: 'Sun', date: '25', hours: 0, count: 0, height: '0%' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">See the space you're making.</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A quiet look at your focus, the work it moved forward, and the rhythm that helped.
          </p>
        </div>

        <button
          onClick={onStartFocus}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer self-start md:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start a focus</span>
        </button>
      </div>

      {/* Date Range Picker Bar (Image 0) */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070B16] border border-slate-800 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Oct 19 - 25, 2026 ▾</span>
        </div>
        <span>Last week</span>
      </div>

      {/* Top Three Metric Cards (Image 0) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Time Well Spent */}
        <div className="p-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
            TIME WELL SPENT
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {hours || 12}h {minutes || 30}m
            </span>
            <span className="text-xs font-mono text-slate-500">of 15h goal</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full w-[83%] rounded-full shadow-glow-cyan" />
          </div>
        </div>

        {/* Card 2: Completed Sessions */}
        <div className="p-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
            COMPLETED SESSIONS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {completedCount}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500 block">
            30 min average • breaks excluded
          </span>
        </div>

        {/* Card 3: Days You Made Space */}
        <div className="p-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
            DAYS YOU MADE SPACE
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {streakDays}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 7 days</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold block">
            A session on every weekday
          </span>
        </div>
      </div>

      {/* Middle Two-Column Grid: Week of Focused Work vs Attention Breakdown (Image 0) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Bar Chart (A Week of Focused Work) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">A week of focused work</h3>
              <p className="text-xs text-slate-400 mt-0.5">Completed focus time, day by day.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Focus time</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {daysData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                  {d.hours > 0 ? `${d.hours}h` : ''}
                </span>
                <div className="w-full max-w-[42px] bg-slate-900 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-glow-blue"
                    style={{ height: d.height }}
                  />
                </div>
                <div className="text-center font-mono">
                  <span className="text-[11px] text-slate-400 block font-bold">{d.day}</span>
                  <span className="text-[9px] text-slate-600 block">{d.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Where Your Attention Went (Image 0) */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Where your attention went</h3>
            <p className="text-xs text-slate-400 mt-0.5">12h 30m across 3 projects</p>

            {/* Stacked Progress Bar */}
            <div className="w-full h-2.5 rounded-full flex overflow-hidden mt-5 shadow-inner">
              <div className="bg-blue-600 h-full w-[56%]" title="Website redesign 56%" />
              <div className="bg-cyan-400 h-full w-[32%]" title="Product strategy 32%" />
              <div className="bg-violet-500 h-full w-[12%]" title="Personal 12%" />
            </div>

            {/* Legend List */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="font-semibold text-white">Website redesign</span>
                  <span className="text-[10px] font-mono text-slate-500">(14 sessions)</span>
                </div>
                <div className="font-mono text-right">
                  <span className="font-bold text-white">7h</span>
                  <span className="text-slate-500 ml-2">56%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="font-semibold text-white">Product strategy</span>
                  <span className="text-[10px] font-mono text-slate-500">(8 sessions)</span>
                </div>
                <div className="font-mono text-right">
                  <span className="font-bold text-white">4h</span>
                  <span className="text-slate-500 ml-2">32%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <span className="font-semibold text-white">Personal</span>
                  <span className="text-[10px] font-mono text-slate-500">(3 sessions)</span>
                </div>
                <div className="font-mono text-right">
                  <span className="font-bold text-white">1h 30m</span>
                  <span className="text-slate-500 ml-2">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Steady Rhythm & Mornings Made Room (Image 0) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Small Sessions / Steady Rhythm */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Small sessions. A steady rhythm.</h3>
            <p className="text-xs text-slate-400 mt-0.5">5 active days • 25 completed sessions</p>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {daysData.map((d) => (
              <div 
                key={d.day}
                className={`p-3 rounded-2xl border text-center transition ${
                  d.count > 0 
                    ? 'bg-blue-950/40 border-blue-500/40' 
                    : 'bg-[#050810] border-slate-800/60 opacity-40'
                }`}
              >
                <span className="text-lg font-bold text-white font-mono block">
                  {d.count > 0 ? d.count : '—'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">{d.day}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>You kept a weekday routine and left the weekend open.</span>
          </p>
        </div>

        {/* Right: Mornings Made Room (Peak hours) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#070B16] border border-slate-800/90 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Mornings made room</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              <span className="text-cyan-400 font-bold">60% of your focus time</span> fell between 9 am and noon. Try protecting that window for your next design session.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="p-3 rounded-2xl bg-[#050810] border border-slate-800/80 text-center font-mono">
              <span className="text-xs text-slate-400 block font-bold">6–9 am</span>
              <span className="text-[10px] text-slate-600 block mt-1">15%</span>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-900/40 border border-cyan-400/60 shadow-glow-cyan text-center font-mono">
              <span className="text-xs text-white block font-extrabold">9 am–noon</span>
              <span className="text-[10px] text-cyan-300 block font-bold mt-1">60%</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#050810] border border-slate-800/80 text-center font-mono">
              <span className="text-xs text-slate-400 block font-bold">12–3 pm</span>
              <span className="text-[10px] text-slate-600 block mt-1">15%</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#050810] border border-slate-800/80 text-center font-mono">
              <span className="text-xs text-slate-400 block font-bold">3–6 pm</span>
              <span className="text-[10px] text-slate-600 block mt-1">10%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
