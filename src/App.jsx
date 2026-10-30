import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Bookmark, CheckSquare } from 'lucide-react';
import TopNav from './components/TopNav';
import LeftSidebar from './components/LeftSidebar';
import HeroFocusCard from './components/HeroFocusCard';
import AtmosphereMixer from './components/AtmosphereMixer';
import SequenceQueue from './components/SequenceQueue';
import RightSidebar from './components/RightSidebar';
import FocusBall from './components/FocusBall';
import WorkCompanion from './components/WorkCompanion';
import SessionCompleteTray from './components/SessionCompleteTray';
import NotesDashboard from './components/NotesDashboard';
import RecordChallengeModal from './components/RecordChallengeModal';
import QuickCaptureModal from './components/QuickCaptureModal';
import SprintTemplatesModal from './components/SprintTemplatesModal';
import ShortcutsModal from './components/ShortcutsModal';
import ProfileModal from './components/ProfileModal';
import NewTaskModal from './components/NewTaskModal';
import SprintsView from './components/SprintsView';
import AnalyticsView from './components/AnalyticsView';
import { sound } from './utils/sound';
import { notifications } from './utils/notifications';

const INITIAL_PROJECTS = [
  { id: 'cybersecurity', name: 'Cybersecurity & Study', count: '00' },
  { id: 'software', name: 'Software & Code', count: '00' },
  { id: 'personal', name: 'Personal', count: '00' }
];

const INITIAL_TASKS = [];

const INITIAL_NOTES = [];

export default function App() {
  // App UI Layout State: 'companion' (mini-window) | 'ball' (floating Gemini orb) | 'full' (studio dashboard)
  const [appMode, setAppMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get('mode');
      if (urlMode) return urlMode;
    }
    return localStorage.getItem('sequence_app_mode') || 'full';
  });

  const [autoPip, setAutoPip] = useState(true);

  // Current studio view when in 'full' mode: 'focus' | 'notebook' | 'all_tasks' | 'sprints' | 'insights'
  const [currentView, setCurrentView] = useState('focus');
  const [activeProject, setActiveProject] = useState('cybersecurity');

  // Modals
  const [showSessionCompleteTray, setShowSessionCompleteTray] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [recordChallenge, setRecordChallenge] = useState({ isOpen: false, taskTitle: '' });

  // User Profile
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('sequence_user_name') || 'Nelimo';
  });
  const [workspaceName, setWorkspaceName] = useState(() => {
    return localStorage.getItem('sequence_workspace_name') || "Nelimo's studio";
  });

  // Projects & Tasks (Clean State)
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('sequence_projects_v9');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sequence_flow_tasks_v9');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Notes (Clean State)
  const [vaultNotes, setVaultNotes] = useState(() => {
    const saved = localStorage.getItem('sequence_vault_notes_v9');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  // Focus Countdown (Standard 25 min sprint)
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isPaused, setIsPaused] = useState(false);

  // Stats (Clean Start)
  const [sessionsCount, setSessionsCount] = useState(() => {
    const saved = localStorage.getItem('sequence_sessions_count_v9');
    return saved ? Number(saved) : 0;
  });
  const [streakDays, setStreakDays] = useState(1);
  const [totalFocusedSeconds, setTotalFocusedSeconds] = useState(0);

  const activeTask = tasks.find(t => !t.completed) || tasks[0] || null;

  // Purge any legacy dummy data keys on startup
  useEffect(() => {
    const legacyKeys = [
      'sequence_flow_tasks_v5', 
      'sequence_vault_notes_v5', 
      'sequence_vault_notes_v6', 
      'sequence_projects_v3', 
      'sequence_sessions_count_v5'
    ];
    legacyKeys.forEach(k => localStorage.removeItem(k));
  }, []);

  // Listen to IPC mode changes and Auto-PiP status from Electron
  useEffect(() => {
    if (window.electronAPI) {
      if (window.electronAPI.onSetMode) {
        window.electronAPI.onSetMode((newMode) => {
          setAppMode(newMode);
        });
      }
      if (window.electronAPI.getAutoPipStatus) {
        window.electronAPI.getAutoPipStatus().then(status => setAutoPip(status));
      }
    }
  }, []);

  // Sync state across multiple windows via storage events
  useEffect(() => {
    const handleStorage = (e) => {
      try {
        if (e.key === 'sequence_flow_tasks_v9' && e.newValue) {
          setTasks(JSON.parse(e.newValue));
        }
        if (e.key === 'sequence_vault_notes_v9' && e.newValue) {
          setVaultNotes(JSON.parse(e.newValue));
        }
        if (e.key === 'sequence_projects_v9' && e.newValue) {
          setProjects(JSON.parse(e.newValue));
        }
        if (e.key === 'sequence_user_name' && e.newValue) {
          setUserName(e.newValue);
        }
        if (e.key === 'sequence_workspace_name' && e.newValue) {
          setWorkspaceName(e.newValue);
        }
      } catch (err) {
        console.error('Storage sync error:', err);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('sequence_app_mode', appMode);
  }, [appMode]);

  useEffect(() => {
    localStorage.setItem('sequence_flow_tasks_v9', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sequence_vault_notes_v9', JSON.stringify(vaultNotes));
  }, [vaultNotes]);

  useEffect(() => {
    localStorage.setItem('sequence_projects_v9', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('sequence_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('sequence_workspace_name', workspaceName);
  }, [workspaceName]);

  // Live Timer
  useEffect(() => {
    if (isPaused || !activeTask) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setShowSessionCompleteTray(true);
          sound.playComplete();
          return 0;
        }
        return prev - 1;
      });
      setTotalFocusedSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, activeTask]);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea';

      // Shift + Space launches floating tray or toggles
      if (e.code === 'Space' && e.shiftKey && !isInput) {
        e.preventDefault();
        setAppMode(m => m === 'companion' ? 'full' : 'companion');
        return;
      }

      if (e.code === 'Space' && !isInput && activeTask) {
        e.preventDefault();
        handleCompleteTask(activeTask.id);
      }

      if (e.key.toLowerCase() === 'q' && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowQuickCapture(true);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowQuickCapture(true);
      }

      if (e.key === 'Escape') {
        setShowSessionCompleteTray(false);
        setShowNewTaskModal(false);
        setShowQuickCapture(false);
        setShowTemplatesModal(false);
        setShowShortcuts(false);
        setShowProfileModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTask]);

  // Action: Complete Task
  const handleCompleteTask = (taskId, advance = true) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#2563EB', '#8B5CF6', '#ffffff']
    });

    sound.playComplete();

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    setSessionsCount(c => c + 1);
    setSecondsRemaining(30 * 60);

    // Show Session Complete Tray
    setShowSessionCompleteTray(true);
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    sound.playAdd();
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) sound.playComplete();
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handlePromoteTask = (taskId) => {
    setTasks(prev => {
      const item = prev.find(t => t.id === taskId);
      if (!item) return prev;
      return [item, ...prev.filter(t => t.id !== taskId)];
    });
    setSecondsRemaining(30 * 60);
    sound.playAdd();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleUpdateTitle = (taskId, title) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title } : t));
  };

  const handleAddProject = (name) => {
    const newProj = { id: `proj-${Date.now()}`, name, count: '00' };
    setProjects(prev => [...prev, newProj]);
    sound.playAdd();
  };

  const handleDeleteProject = (projId) => {
    setProjects(prev => prev.filter(p => p.id !== projId));
  };

  // Live Date
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).toUpperCase();

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className={`min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative ${
      appMode === 'companion' || appMode === 'ball' ? 'bg-transparent' : 'bg-[#04070F]'
    }`}>
      {/* ======================================================== */}
      {/* 1. COMPACT "CURRENT WORK COMPANION" MINI-WINDOW          */}
      {/* ======================================================== */}
      {appMode === 'companion' && (
        <WorkCompanion 
          task={activeTask}
          upcomingTasks={tasks.filter(t => !t.completed).slice(1)}
          onCollapseToBall={() => {
            setAppMode('ball');
            if (window.electronAPI?.minimizeToBall) {
              window.electronAPI.minimizeToBall();
            }
          }}
          onExpandToFull={() => {
            if (window.electronAPI?.expandToStudio) {
              window.electronAPI.expandToStudio();
            } else {
              setAppMode('full');
            }
          }}
          onClose={() => {
            if (window.electronAPI?.closeCompanion) {
              window.electronAPI.closeCompanion();
            }
          }}
          onComplete={(id) => handleCompleteTask(id)}
          onPauseToggle={() => setIsPaused(!isPaused)}
          isPaused={isPaused}
          secondsRemaining={secondsRemaining}
          onSaveNote={(note) => {
            setVaultNotes(prev => [note, ...prev]);
            sound.playComplete();
          }}
          vaultNotes={vaultNotes}
          onDeleteNote={(id) => setVaultNotes(prev => prev.filter(n => n.id !== id))}
          onSendNoteToQueue={(content) => {
            handleAddTask({
              id: `task-${Date.now()}`,
              title: content.slice(0, 60),
              duration: '25 min',
              completed: false
            });
            sound.playAdd();
          }}
          onAddTask={handleAddTask}
        />
      )}

      {/* ======================================================== */}
      {/* 2. FLOATING "FOCUS BALL" GEMINI CALL MODE ORB (IMAGE 4)   */}
      {/* ======================================================== */}
      {appMode === 'ball' && (
        <FocusBall 
          onExpand={() => {
            setAppMode('companion');
            if (window.electronAPI?.expandToCompanion) {
              window.electronAPI.expandToCompanion();
            }
          }}
          activeTask={activeTask}
          secondsRemaining={secondsRemaining}
          isPaused={isPaused}
        />
      )}

      {/* ======================================================== */}
      {/* 3. FULL THREE-COLUMN STUDIO DASHBOARD (IMAGES 1 & 2)     */}
      {/* ======================================================== */}
      {appMode === 'full' && (
        <div className="h-screen flex flex-col overflow-hidden">
          {/* TOP NAV BAR */}
          <TopNav 
            onOpenNewTask={() => setShowNewTaskModal(true)}
            onOpenQuickFind={() => setShowQuickCapture(true)}
            activeProject={activeProject}
          />

          {/* THREE-COLUMN WORKSPACE */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT SIDEBAR */}
            <LeftSidebar 
              currentView={currentView}
              onChangeView={(view) => setCurrentView(view)}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              projects={projects}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
              tasksCount={tasks.length}
              sprintsCount={4}
              notesCount={vaultNotes.length || 24}
              userName={userName}
              workspaceName={workspaceName}
              onOpenProfile={() => setShowProfileModal(true)}
              onOpenSettings={() => setShowShortcuts(true)}
            />

            {/* CENTER VIEWPORT */}
            <main className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8 space-y-6">
              {/* Mode switch helper button in header */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-1">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
                  {currentView === 'notebook' ? 'NOTEBOOK DASHBOARD' : 'LAUNCHPAD • STUDIO'}
                </span>

                <div className="flex items-center gap-2">
                  {/* Zoom-style Auto-PiP on leave toggle */}
                  <button
                    onClick={async () => {
                      if (window.electronAPI?.toggleAutoPip) {
                        const next = await window.electronAPI.toggleAutoPip();
                        setAutoPip(next);
                      } else {
                        setAutoPip(!autoPip);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition cursor-pointer ${
                      autoPip 
                        ? 'bg-blue-900/30 border-blue-500/40 text-cyan-300' 
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                    title="When you minimize or leave to Zoom / WhatsApp, automatically float the companion tray in the corner like Zoom"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${autoPip ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                    <span>Auto-PiP on leave: {autoPip ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.electronAPI?.launchCompanion) {
                        window.electronAPI.launchCompanion();
                      } else {
                        setAppMode('companion');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition cursor-pointer active:scale-98"
                  >
                    <span>🚀 Launch Floating Tray</span>
                    <span className="text-[10px] font-mono opacity-80">(Shift + Space)</span>
                  </button>
                </div>
              </div>

              {/* VIEW: FOCUS ROOM */}
              {currentView === 'focus' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Header Title */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Find your flow.
                      </h1>
                      <p className="text-sm text-slate-400 mt-1">
                        One task at a time. You're making space for what matters.
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1626] border border-slate-800 text-[11px] font-mono text-slate-400">
                      <span>📅</span>
                      <span>{dateFormatted}</span>
                    </div>
                  </div>

                  {/* Center Hero Focus Card with Circular Timer */}
                  <HeroFocusCard 
                    task={activeTask}
                    onComplete={handleCompleteTask}
                    onPauseToggle={() => setIsPaused(!isPaused)}
                    isPaused={isPaused}
                    secondsRemaining={secondsRemaining}
                    totalSeconds={1800}
                    sessionNumber={sessionsCount}
                    totalSessions={4}
                    onToggleZen={() => setAppMode('companion')}
                    onUpdateTitle={handleUpdateTitle}
                  />

                  {/* Atmosphere Sound Mixer */}
                  <AtmosphereMixer />

                  {/* Task Sequence Queue */}
                  <SequenceQueue 
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onToggleComplete={handleToggleComplete}
                    onPromoteTask={handlePromoteTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
              )}

              {/* VIEW: NOTEBOOK DASHBOARD (IMAGE 2) */}
              {(currentView === 'notebook' || currentView === 'vault') && (
                <NotesDashboard 
                  notes={vaultNotes}
                  onAddNote={(newNote) => setVaultNotes(prev => [newNote, ...prev])}
                  onDeleteNote={(id) => setVaultNotes(prev => prev.filter(n => n.id !== id))}
                  projects={projects}
                />
              )}

              {/* VIEW: ALL TASKS */}
              {currentView === 'all_tasks' && (
                <div className="max-w-4xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">All Tasks ({tasks.length})</h2>
                    <button
                      onClick={() => setShowNewTaskModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition cursor-pointer"
                    >
                      + Add task
                    </button>
                  </div>

                  <SequenceQueue 
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onToggleComplete={handleToggleComplete}
                    onPromoteTask={(id) => {
                      handlePromoteTask(id);
                      setCurrentView('focus');
                    }}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
              )}

              {/* VIEW: SPRINTS */}
              {currentView === 'sprints' && (
                <div className="max-w-4xl">
                  <SprintsView 
                    customRoutines={[]}
                    onSaveRoutine={() => {}}
                    onDeleteRoutine={() => {}}
                    onLoadRoutine={(rTasks) => {
                      setTasks(rTasks.map((t, i) => ({
                        id: `task-${Date.now()}-${i}`,
                        title: t.title,
                        project: 'Website redesign',
                        duration: '25 min',
                        completed: false
                      })));
                      setCurrentView('focus');
                    }}
                    currentSequence={tasks}
                    onSaveCurrentAsRoutine={() => {}}
                  />
                </div>
              )}

              {/* VIEW: INSIGHTS */}
              {currentView === 'insights' && (
                <AnalyticsView 
                  completedTasks={tasks.filter(t => t.completed)}
                  onClearHistory={() => setTasks(tasks.filter(t => !t.completed))}
                />
              )}
            </main>

            {/* RIGHT SIDEBAR (MOMENTUM & SPRINTS) */}
            {currentView === 'focus' && (
              <RightSidebar 
                completedCount={completedCount}
                sessionsCount={sessionsCount}
                streakDays={streakDays}
                totalFocusedSeconds={totalFocusedSeconds}
                dailyGoalHours={4}
                routines={[]}
                onOpenSprints={() => setCurrentView('sprints')}
              />
            )}
          </div>

          {/* MOBILE BOTTOM NAVIGATION BAR (md:hidden) */}
          <div className="md:hidden flex items-center justify-around py-3 px-4 bg-[#070B14]/95 border-t border-slate-800/80 backdrop-blur-lg shrink-0 z-30">
            <button
              onClick={() => setCurrentView('focus')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentView === 'focus' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Focus</span>
            </button>
            <button
              onClick={() => setCurrentView('notebook')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentView === 'notebook' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Notebook</span>
            </button>
            <button
              onClick={() => setCurrentView('all_tasks')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentView === 'all_tasks' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Queue</span>
            </button>
            <button
              onClick={() => setAppMode('companion')}
              className="flex flex-col items-center gap-1 text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-violet-500 flex items-center justify-center p-0.5 shadow-glow-cyan">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span>Companion</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. "SESSION COMPLETE TRAY" MODAL (IMAGE 3)               */}
      {/* ======================================================== */}
      <SessionCompleteTray 
        isOpen={showSessionCompleteTray}
        onClose={() => setShowSessionCompleteTray(false)}
        task={activeTask}
        onStartBreak={() => {
          setShowSessionCompleteTray(false);
          setSecondsRemaining(5 * 60); // 5 min break
        }}
        onOpenNotebook={() => {
          setShowSessionCompleteTray(false);
          setAppMode('full');
          setCurrentView('notebook');
        }}
        notesCount={vaultNotes.length || 3}
        focusedMinutes={30}
        sprintCompleted={2}
        sprintTotal={4}
      />

      {/* ======================================================== */}
      {/* 5. MODALS & TOOLS                                        */}
      {/* ======================================================== */}
      <NewTaskModal 
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onAddTask={handleAddTask}
        projects={projects}
      />

      <QuickCaptureModal 
        isOpen={showQuickCapture}
        onClose={() => setShowQuickCapture(false)}
        onSaveNote={(note) => {
          setVaultNotes(prev => [note, ...prev]);
          sound.playComplete();
        }}
      />

      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userName={userName}
        workspaceName={workspaceName}
        onSave={({ userName: newName, workspaceName: newWs }) => {
          setUserName(newName);
          setWorkspaceName(newWs);
          sound.playComplete();
        }}
        onResetWorkspace={() => {
          localStorage.removeItem('sequence_flow_tasks_v5');
          localStorage.removeItem('sequence_flow_tasks_v9');
          localStorage.removeItem('sequence_vault_notes_v5');
          localStorage.removeItem('sequence_vault_notes_v6');
          localStorage.removeItem('sequence_vault_notes_v9');
          localStorage.removeItem('sequence_projects_v3');
          localStorage.removeItem('sequence_projects_v9');
          localStorage.removeItem('sequence_sessions_count_v5');
          localStorage.removeItem('sequence_sessions_count_v9');
          setTasks([]);
          setVaultNotes([]);
          setSessionsCount(0);
          setTotalFocusedSeconds(0);
          setProjects([
            { id: 'cyber', name: 'Cybersecurity & Study', count: '00' },
            { id: 'dev', name: 'Software & Projects', count: '00' },
            { id: 'personal', name: 'Personal & Daily', count: '00' }
          ]);
          sound.playComplete();
        }}
      />

      <ShortcutsModal 
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
