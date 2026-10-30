import React, { useState, useRef, useEffect } from 'react';
import { 
  Pause, 
  Play, 
  SkipForward, 
  Check, 
  Minus, 
  Maximize2, 
  X,
  Plus, 
  Trash2, 
  ArrowRight, 
  CornerDownLeft, 
  Layers, 
  FileText,
  Clock,
  Sparkles,
  Bookmark,
  Mic,
  Square,
  Waves
} from 'lucide-react';
import { useDraggable } from '../utils/useDraggable';
import { VoiceRecorder } from '../utils/voiceRecorder';
import { sound } from '../utils/sound';

export default function WorkCompanion({ 
  task, 
  upcomingTasks = [],
  onCollapseToBall, 
  onExpandToFull, 
  onClose,
  onComplete, 
  onPauseToggle, 
  isPaused,
  secondsRemaining = 1500,
  onSaveNote,
  vaultNotes = [],
  onDeleteNote,
  onSendNoteToQueue,
  onAddTask
}) {
  const handleDragPointerDown = useDraggable();
  // Two Bars Switcher: 'queue' (Dark Blue) vs 'notes' (Deep Violet)
  const [activeBar, setActiveBar] = useState('queue'); // 'queue' | 'notes'
  const [quickNoteInput, setQuickNoteInput] = useState('');
  const [quickTaskInput, setQuickTaskInput] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);

  // Voice Recording State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState(null);
  const voiceRecorderRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const nextTask = upcomingTasks[0] || null;

  // Handle Note Save (Text)
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!quickNoteInput.trim()) return;
    onSaveNote({
      id: `note-${Date.now()}`,
      title: quickNoteInput.trim().slice(0, 45),
      content: quickNoteInput.trim(),
      project: task?.project || 'General',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setQuickNoteInput('');
  };

  // Start Hands-Free Voice Recording
  const startVoiceRecording = async () => {
    try {
      const recorder = new VoiceRecorder();
      voiceRecorderRef.current = recorder;
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      setVoiceTranscript('');

      await recorder.start({
        onTranscriptUpdate: (text) => setVoiceTranscript(text),
        onTimeUpdate: (sec) => setRecordingSeconds(sec)
      });
      sound.playAdd();
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please check system permissions.');
      setIsRecordingVoice(false);
    }
  };

  // Stop and Save Voice Note
  const stopVoiceRecording = async () => {
    if (!voiceRecorderRef.current) return;
    try {
      const result = await voiceRecorderRef.current.stop();
      setIsRecordingVoice(false);
      voiceRecorderRef.current = null;

      const title = result.text 
        ? `🎙️ ${result.text.slice(0, 45)}` 
        : `🎙️ Voice Note (${result.duration})`;

      onSaveNote({
        id: `voice-${Date.now()}`,
        title,
        content: result.text || `Voice recording memo (${result.duration})`,
        audioDataUrl: result.audioDataUrl,
        duration: result.duration,
        project: task?.project || 'General',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      sound.playComplete();
    } catch (err) {
      console.error('Stop recording error:', err);
      setIsRecordingVoice(false);
    }
  };

  // Cancel Voice Recording
  const cancelVoiceRecording = () => {
    if (voiceRecorderRef.current) {
      voiceRecorderRef.current.cancel();
      voiceRecorderRef.current = null;
    }
    setIsRecordingVoice(false);
    setVoiceTranscript('');
  };

  // Toggle Play / Pause on Recorded Audio Note
  const togglePlayAudio = (noteId, audioDataUrl) => {
    if (currentlyPlayingAudio === noteId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setCurrentlyPlayingAudio(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(audioDataUrl);
      audioPlayerRef.current = audio;
      setCurrentlyPlayingAudio(noteId);
      audio.onended = () => setCurrentlyPlayingAudio(null);
      audio.play().catch(() => setCurrentlyPlayingAudio(null));
    }
  };

  useEffect(() => {
    return () => {
      if (voiceRecorderRef.current) voiceRecorderRef.current.cancel();
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);

  // Handle Add Next Step in Queue
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!quickTaskInput.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: quickTaskInput.trim(),
      project: task?.project || 'General',
      duration: '25 min',
      completed: false
    });
    setQuickTaskInput('');
    setShowAddStep(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 select-none pointer-events-auto">
      {/* Floating Round-Edged Companion Card */}
      <div className="relative w-full h-full rounded-[28px] bg-[#070B16] border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-5 overflow-hidden flex flex-col justify-between transition-all duration-300">
        
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 inset-x-0 h-1 transition-colors duration-500 ${
          activeBar === 'queue' ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600' : 'bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-500'
        }`} />

        {/* Top Control Bar: Logo, Two Bar Switcher, Window Controls */}
        <div 
          onPointerDown={handleDragPointerDown}
          className="flex items-center justify-between gap-2 mb-3.5 cursor-grab active:cursor-grabbing select-none shrink-0"
        >
          {/* Logo mark */}
          <div className="flex items-center gap-1.5 shrink-0" data-no-drag>
            <span className="flex items-center gap-0.5">
              <span className={`w-1 h-3 rounded-full transition-colors ${activeBar === 'queue' ? 'bg-blue-400' : 'bg-violet-400'}`} />
              <span className={`w-1 h-4 rounded-full transition-colors ${activeBar === 'queue' ? 'bg-cyan-300' : 'bg-fuchsia-300'}`} />
              <span className={`w-1 h-2 rounded-full transition-colors ${activeBar === 'queue' ? 'bg-blue-500' : 'bg-violet-500'}`} />
            </span>
            <span className="text-xs font-bold lowercase tracking-tight text-white font-sans">
              sequence
            </span>
          </div>

          {/* The Two Bars Switcher Pills (Dark Blue Queue vs Violet Notes) */}
          <div className="flex items-center bg-[#050810] p-0.5 rounded-xl border border-slate-800 text-[11px] font-mono shrink-0" data-no-drag>
            {/* Queue Bar Button (Dark Blue) */}
            <button
              onClick={() => setActiveBar('queue')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                activeBar === 'queue'
                  ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeBar === 'queue' ? 'bg-cyan-300 animate-pulse' : 'bg-slate-500'}`} />
              <span>Queue</span>
              {upcomingTasks.length > 0 && (
                <span className="text-[9px] opacity-80">({upcomingTasks.length + 1})</span>
              )}
            </button>

            {/* Notes Bar Button (Deep Violet) */}
            <button
              onClick={() => setActiveBar('notes')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                activeBar === 'notes'
                  ? 'bg-violet-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3 h-3 text-violet-300" />
              <span>Notes</span>
              {vaultNotes.length > 0 && (
                <span className="text-[9px] opacity-80">({vaultNotes.length})</span>
              )}
            </button>
          </div>

          {/* Window Minimizer & Studio Expander */}
          <div className="flex items-center gap-1 shrink-0" data-no-drag>
            {/* Minimize -> Collapses to Floating Orb in Corner */}
            <button
              onClick={onCollapseToBall}
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition cursor-pointer"
              title="Minimize to floating Focus Ball"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Expand -> Opens Full Studio Launchpad */}
            <button
              onClick={onExpandToFull}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              title="Open full planning studio"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close / Hide companion */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition cursor-pointer"
                title="Hide companion"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* BAR 1: THE QUEUE BAR (Dark Blue Theme)                   */}
        {/* ======================================================== */}
        {activeBar === 'queue' && (
          <div className="space-y-4 animate-fade-in">
            {/* Active Task Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0C152B] to-[#070D1C] border border-blue-500/30 p-5 shadow-inner">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>NOW FOCUSING</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-500/30">
                  {timeFormatted}
                </span>
              </div>

              {/* Task Title */}
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug my-2">
                {task?.title || 'No active task. Queue a step below!'}
              </h3>

              {/* Quick Actions (Pause / Done & Next) */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onComplete(task?.id)}
                  disabled={!task}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-glow-blue active:scale-98 transition cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Done & Next</span>
                  <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-blue-800/60 rounded border border-blue-400/30">
                    Space
                  </kbd>
                </button>

                <button
                  onClick={onPauseToggle}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Up Next Horizon Cue */}
            <div className="rounded-2xl bg-[#050810] border border-slate-800/80 p-3.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="uppercase tracking-wider">UP NEXT IN SEQUENCE</span>
                <button
                  onClick={() => setShowAddStep(!showAddStep)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add step
                </button>
              </div>

              {/* Add next step inline */}
              {showAddStep && (
                <form onSubmit={handleTaskSubmit} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={quickTaskInput}
                    onChange={(e) => setQuickTaskInput(e.target.value)}
                    placeholder="Next step..."
                    autoFocus
                    className="flex-1 bg-[#090D18] text-xs text-white px-2.5 py-1.5 rounded-lg border border-cyan-500/50 outline-none"
                  />
                  <button type="submit" className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold">
                    Queue
                  </button>
                </form>
              )}

              {nextTask ? (
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#080D1A] border border-blue-500/20 text-slate-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="truncate">{nextTask.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {nextTask.duration || '25 min'}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 font-mono py-1">
                  Queue is clear. Add 1 or 2 steps to stay in momentum!
                </p>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BAR 2: THE NOTES BAR WITH HANDS-FREE VOICE RECORDING     */}
        {/* ======================================================== */}
        {activeBar === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            {/* Active Voice Recording Panel OR Quick Text Capture Box */}
            {isRecordingVoice ? (
              <div className="rounded-2xl bg-gradient-to-br from-[#2D0D26] via-[#1D082A] to-[#0E041A] border border-rose-500/50 p-4 space-y-3 shadow-lg shadow-rose-950/50 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                      RECORDING HANDS-FREE...
                    </span>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-white bg-rose-950/80 px-2 py-0.5 rounded-lg border border-rose-500/40">
                    {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Animated Waveform & Live Transcript */}
                <div className="flex items-center gap-2 py-1 px-1 bg-[#090310]/60 rounded-xl border border-rose-500/20">
                  <span className="flex items-center gap-1 pl-2">
                    <span className="w-1 h-3 bg-rose-400 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-fuchsia-300 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-6 bg-white rounded-full animate-pulse delay-150" />
                    <span className="w-1 h-4 bg-rose-400 rounded-full animate-pulse delay-100" />
                    <span className="w-1 h-2 bg-violet-400 rounded-full animate-pulse delay-200" />
                  </span>
                  <p className="text-xs text-rose-100 italic truncate flex-1 min-w-0 pr-2">
                    {voiceTranscript || 'Speak aloud — recording your thought...'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-500/20">
                  <button
                    type="button"
                    onClick={cancelVoiceRecording}
                    className="px-3 py-1 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/40 transition cursor-pointer active:scale-95"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Save Voice Note</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Quick Capture Box (Deep Violet) */
              <form onSubmit={handleNoteSubmit} className="space-y-2">
                <div className="relative rounded-2xl bg-gradient-to-br from-[#170E2D] to-[#0D071C] border border-violet-500/30 p-3 shadow-inner">
                  <textarea
                    value={quickNoteInput}
                    onChange={(e) => setQuickNoteInput(e.target.value)}
                    placeholder="Capture quick thought, or click 🎙️ below to record voice hands-free..."
                    rows={3}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleNoteSubmit(e);
                      }
                    }}
                    className="w-full bg-transparent text-xs text-violet-100 placeholder-violet-400/50 outline-none resize-none font-sans leading-relaxed"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-violet-500/20 text-[10px] font-mono text-violet-400">
                    {/* Voice Recording Button */}
                    <button
                      type="button"
                      onClick={startVoiceRecording}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-600/30 hover:bg-rose-600/30 text-violet-200 hover:text-rose-200 border border-violet-400/40 hover:border-rose-400/40 text-[11px] font-semibold transition cursor-pointer active:scale-95 shadow-sm"
                      title="Hands busy? Click to record a voice note"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span>Record Voice Note</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!quickNoteInput.trim()}
                      className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Save</span>
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* List of Captured Notes with Audio Players */}
            <div className="rounded-2xl bg-[#050810] border border-slate-800/80 p-3 max-h-[160px] overflow-y-auto space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                RECENTLY CAPTURED ({vaultNotes.length})
              </div>

              {vaultNotes.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-mono py-2 text-center">
                  No notes saved yet. Record or type above while studying!
                </p>
              ) : (
                vaultNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="group p-2.5 rounded-xl bg-[#0B0818] border border-violet-500/20 hover:border-violet-400/40 text-xs transition space-y-1.5"
                  >
                    <p className="text-violet-200 line-clamp-2 font-sans text-[11px]">
                      {note.content}
                    </p>

                    {/* Voice Memo Player Bar if note has audioDataUrl */}
                    {note.audioDataUrl && (
                      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-violet-950/60 border border-violet-500/30 text-xs">
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(note.id, note.audioDataUrl)}
                          className="w-5 h-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shrink-0 transition shadow-sm cursor-pointer"
                          title={currentlyPlayingAudio === note.id ? 'Pause' : 'Play'}
                        >
                          {currentlyPlayingAudio === note.id ? (
                            <Pause className="w-2.5 h-2.5 fill-current" />
                          ) : (
                            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          )}
                        </button>
                        <span className="text-[10px] font-mono text-violet-300 font-bold truncate flex-1">
                          Voice Memo • {note.duration || '0:15'}
                        </span>
                        {currentlyPlayingAudio === note.id && (
                          <span className="flex items-center gap-0.5 h-2.5 pr-1">
                            <span className="w-0.5 h-2 bg-violet-300 animate-pulse" />
                            <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                            <span className="w-0.5 h-1.5 bg-violet-300 animate-pulse delay-150" />
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-violet-500/10 text-[10px]">
                      <button
                        onClick={() => onSendNoteToQueue(note.content)}
                        className="text-violet-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                        title="Promote note to task on the queue side"
                      >
                        <span>➔ Send to Queue</span>
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Ambient Footer Prompt */}
        <p className="text-[10px] text-slate-500 font-mono text-center mt-4">
          Hover bottom orb to check status • Shift + Space to advance
        </p>
      </div>
    </div>
  );
}
