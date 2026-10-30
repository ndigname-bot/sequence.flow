import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Bookmark, CheckSquare, Folder, BarChart2 } from 'lucide-react';

import TopNav from './components/TopNav';
import FocusModeView from './components/FocusModeView';
import ProjectManagerView from './components/ProjectManagerView';
import NotesDashboardView from './components/NotesDashboardView';
import FocusAnalyticsView from './components/FocusAnalyticsView';
import AppearanceModal from './components/AppearanceModal';
import FocusBall from './components/FocusBall';
import WorkCompanion from './components/WorkCompanion';
import SessionCompleteTray from './components/SessionCompleteTray';
import NewTaskModal from './components/NewTaskModal';
import QuickCaptureModal from './components/QuickCaptureModal';
import ShortcutsModal from './components/ShortcutsModal';
import ProfileModal from './components/ProfileModal';

import { sound } from './utils/sound';
import { notifications } from './utils/notifications';
import { applyTheme } from './utils/theme';

const INITIAL_PROJECTS = [
  { id: 'website-redesign', name: 'Website redesign', count: '08' },
  { id: 'product-strategy', name: 'Product strategy', count: '06' },
  { id: 'personal', name: 'Personal', count: '04' }
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Explore the new homepage direction',
    project: 'Website redesign',
    duration: '30 min',
    completed: false
  },
  {
    id: 'task-2',
    title: 'Build the core component library',
    project: 'Website redesign',
    duration: '45 min',
    completed: false
  },
  {
    id: 'task-3',
    title: 'Map the onboarding journey',
    project: 'Product strategy',
    duration: '25 min',
    completed: false
  },
  {
    id: 'task-4',
    title: 'Review weekly goals',
    project: 'Personal',
    duration: '15 min',
    completed: false
  }
];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Homepage direction',
    content: 'Keep the hero calm, reduce the number of CTAs, and make the navigation feel more editorial.\n\nLead with the feeling of making progress. Keep the opening message simple: less switching, more meaningful work.',
    project: 'Website redesign',
    date: 'Oct 27, 2026'
  },
  {
    id: 'note-2',
    title: 'Component library principles',
    content: 'Start with the button system, then move to cards and finally the navigation patterns. Motion should guide, never compete.',
    project: 'Website redesign',
    date: 'Oct 28, 2026'
  },
  {
    id: 'note-3',
    title: 'Onboarding flow exploration',
    content: 'Keep the first run focused on one clear outcome. Remove the tutorial modal and surface guidance only when it is needed.',
    project: 'Product strategy',
    date: 'Oct 29, 2026'
  }
];

export default function App() {
  // App UI Layout Mode: 'companion' | 'ball' | 'full'
  const [appMode, setAppMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get('mode');
      if (urlMode === 'companion' || urlMode === 'ball') return urlMode;
      if (urlMode === 'studio' || urlMode === 'full') return 'full';
    }
    return 'full';
  });

  // Current Unified Tab: 'projects' | 'notes' | 'focus' | 'analytics' (From Figma Images 0, 1, 2, 3)
  const [currentTab, setCurrentTab] = useState('focus');
  const [autoPip, setAutoPip] = useState(true);

  // Appearance & Personalization Settings
  const [currentFont, setCurrentFont] = useState(() => {
    return localStorage.getItem('sequence_font_v1') || 'jakarta';
  });
  const [currentSize, setCurrentSize] = useState(() => {
    return localStorage.getItem('sequence_size_v1') || 'standard';
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('sequence_theme_v1') || 'cyan-sapphire';
  });
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);

  // Modals
  const [showSessionCompleteTray, setShowSessionCompleteTray] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Projects, Tasks & Notes State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('sequence_projects_v10');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sequence_flow_tasks_v10');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [vaultNotes, setVaultNotes] = useState(() => {
    const saved = localStorage.getItem('sequence_vault_notes_v10');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  // Countdown Timer (Default 30 min session matching Figma)
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);
  const [isPaused, setIsPaused] = useState(false);

  // Metrics
  const [sessionsCount, setSessionsCount] = useState(() => {
    const saved = localStorage.getItem('sequence_sessions_count_v10');
    return saved ? Number(saved) : 25;
  });
  const [streakDays, setStreakDays] = useState(5);
  const [totalFocusedSeconds, setTotalFocusedSeconds] = useState(45000); // 12h 30m

  const activeTask = tasks.find(t => !t.completed) || tasks[0] || null;
  const linkedNote = vaultNotes.find(n => n.project === activeTask?.project || n.title === activeTask?.title) || vaultNotes[0] || null;

  // Apply Appearance Theme on Mount & Change
  useEffect(() => {
    applyTheme(currentTheme, currentFont, currentSize);
    localStorage.setItem('sequence_font_v1', currentFont);
    localStorage.setItem('sequence_size_v1', currentSize);
    localStorage.setItem('sequence_theme_v1', currentTheme);
  }, [currentTheme, currentFont, currentSize]);

  // Persist State
  useEffect(() => {
    localStorage.setItem('sequence_projects_v10', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('sequence_flow_tasks_v10', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sequence_vault_notes_v10', JSON.stringify(vaultNotes));
  }, [vaultNotes]);

  useEffect(() => {
    localStorage.setItem('sequence_sessions_count_v10', sessionsCount.toString());
  }, [sessionsCount]);

  // Timer Tick
  useEffect(() => {
    let timer = null;
    if (!isPaused && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handleCompleteTask(activeTask?.id);
            return 30 * 60;
          }
          return prev - 1;
        });
        setTotalFocusedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused, secondsRemaining, activeTask]);

  // Listen to IPC mode changes and Auto-PiP status from Electron
  useEffect(() => {
    if (window.electronAPI) {
      if (window.electronAPI.onSetMode) {
        window.electronAPI.onSetMode((newMode) => {
          if (newMode === 'studio') {
            setAppMode('full');
          } else {
            setAppMode(newMode);
          }
        });
      }
      if (window.electronAPI.getAutoPipStatus) {
        window.electronAPI.getAutoPipStatus().then(status => setAutoPip(status));
      }
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea';

      // Shift + Space launches floating companion or toggles
      if (e.code === 'Space' && e.shiftKey && !isInput) {
        e.preventDefault();
        if (window.electronAPI) {
          if (appMode === 'full') {
            window.electronAPI.launchCompanion();
          } else {
            window.electronAPI.expandToStudio();
          }
        } else {
          setAppMode(m => m === 'companion' ? 'full' : 'companion');
        }
        return;
      }

      // Space advances task
      if (e.code === 'Space' && !isInput && activeTask) {
        e.preventDefault();
        handleCompleteTask(activeTask.id);
      }

      // ⌘ K opens quick search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowQuickCapture(true);
      }

      if (e.key === 'Escape') {
        setShowSessionCompleteTray(false);
        setShowNewTaskModal(false);
        setShowQuickCapture(false);
        setShowShortcuts(false);
        setShowProfileModal(false);
        setShowAppearanceModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTask, appMode]);

  // Action: Complete Task
  const handleCompleteTask = (taskId) => {
    if (!taskId) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    setSessionsCount(c => c + 1);
    sound.playComplete();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00F0FF', '#2563EB', '#8B5CF6']
      });
    } catch (_) {}

    notifications.send('Focus Task Completed!', `Awesome job finishing "${activeTask?.title || 'task'}".`);
  };

  // Action: Add Task
  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    sound.playAdd();
  };

  // Action: Add Project
  const handleAddProject = (newProj) => {
    setProjects(prev => [...prev, newProj]);
    sound.playAdd();
  };

  // Action: Delete Project
  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId && p.name !== projectId));
    setTasks(prev => prev.filter(t => t.project !== projectId));
    setVaultNotes(prev => prev.filter(n => n.project !== projectId));
    sound.playAdd();
  };

  // Action: Delete Task
  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    sound.playAdd();
  };

  // Action: Delete Note
  const handleDeleteNote = (noteId) => {
    setVaultNotes(prev => prev.filter(n => n.id !== noteId));
    sound.playAdd();
  };

  // Action: Clear All Projects, Tasks, and Notes (100% Clean Slate)
  const handleClearAllData = () => {
    setProjects([]);
    setTasks([]);
    setVaultNotes([]);
    setSessionsCount(0);
    setTotalFocusedSeconds(0);
    localStorage.removeItem('sequence_projects_v10');
    localStorage.removeItem('sequence_flow_tasks_v10');
    localStorage.removeItem('sequence_vault_notes_v10');
    localStorage.removeItem('sequence_sessions_count_v10');
    sound.playComplete();
  };

  return (
    <div className={`w-full min-h-screen selection:bg-cyan-500/30 overflow-x-hidden relative ${
      appMode === 'full' ? 'bg-[#04070F] text-slate-100' : 'bg-transparent text-slate-100'
    }`}>
      {/* ======================================================== */}
      {/* 1. COMPACT "WORK COMPANION" MINI-TRAY OVERLAY            */}
      {/* ======================================================== */}
      {appMode === 'companion' && (
        <div className="w-full h-full min-h-screen flex items-center justify-center p-2 bg-transparent select-none">
          <WorkCompanion 
            task={activeTask}
            upcomingTasks={tasks.filter(t => !t.completed).slice(1)}
            onCollapseToBall={() => {
              if (window.electronAPI?.minimizeToBall) {
                window.electronAPI.minimizeToBall();
              } else {
                setAppMode('ball');
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
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FLOATING "FOCUS BALL" GEMINI CALL MODE ORB            */}
      {/* ======================================================== */}
      {appMode === 'ball' && (
        <div className="w-full h-full min-h-screen flex items-center justify-center bg-transparent select-none">
          <FocusBall 
            onExpand={() => {
              if (window.electronAPI?.expandToCompanion) {
                window.electronAPI.expandToCompanion();
              } else {
                setAppMode('companion');
              }
            }}
            activeTask={activeTask}
            secondsRemaining={secondsRemaining}
            isPaused={isPaused}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FULL MINIMALIST STUDIO DASHBOARD (FIGMA FRAMEWORKS)   */}
      {/* ======================================================== */}
      {appMode === 'full' && (
        <div className="min-h-screen flex flex-col bg-[#04070F] text-slate-100">
          {/* Minimalist Top Nav with Sub-nav Pills & Customization Toggle */}
          <TopNav 
            currentTab={currentTab}
            onChangeTab={(tabId) => setCurrentTab(tabId)}
            onOpenNewTask={() => setShowNewTaskModal(true)}
            onOpenQuickFind={() => setShowQuickCapture(true)}
            onOpenAppearance={() => setShowAppearanceModal(true)}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 overflow-y-auto">
            {/* VIEW 1: PROJECTS (PROJECT MANAGER - FIGMA IMAGE 3) */}
            {currentTab === 'projects' && (
              <ProjectManagerView 
                projects={projects}
                tasks={tasks}
                notes={vaultNotes}
                onAddTask={handleAddTask}
                onAddProject={handleAddProject}
                onDeleteProject={handleDeleteProject}
                onDeleteTask={handleDeleteTask}
                onDeleteNote={handleDeleteNote}
                onClearAll={handleClearAllData}
                onSelectTaskToFocus={(t) => {
                  setTasks(prev => [t, ...prev.filter(item => item.id !== t.id)]);
                  setCurrentTab('focus');
                }}
                onOpenNote={(note) => {
                  setCurrentTab('notes');
                }}
                onToggleComplete={(id) => {
                  setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
                  sound.playComplete();
                }}
              />
            )}

            {/* VIEW 2: NOTES (NOTEBOOK DASHBOARD - FIGMA IMAGE 2) */}
            {currentTab === 'notes' && (
              <NotesDashboardView 
                notes={vaultNotes}
                projects={projects}
                onAddNote={(newNote) => setVaultNotes(prev => [newNote, ...prev])}
                onDeleteNote={handleDeleteNote}
                onSendNoteToQueue={(content) => {
                  handleAddTask({
                    id: `task-${Date.now()}`,
                    title: content.slice(0, 60),
                    duration: '25 min',
                    completed: false
                  });
                  sound.playAdd();
                }}
              />
            )}

            {/* VIEW 3: FOCUS MODE (ACTIVE TASK + SOUNDTRACK - FIGMA IMAGE 1) */}
            {currentTab === 'focus' && (
              <FocusModeView 
                task={activeTask}
                secondsRemaining={secondsRemaining}
                isPaused={isPaused}
                onPauseToggle={() => setIsPaused(!isPaused)}
                onEndSession={() => handleCompleteTask(activeTask?.id)}
                onOpenSettings={() => setShowShortcuts(true)}
                onCaptureNote={(note) => setVaultNotes(prev => [note, ...prev])}
                linkedNote={linkedNote}
                onOpenNote={() => setCurrentTab('notes')}
              />
            )}

            {/* VIEW 4: FOCUS ANALYTICS (SEE THE SPACE YOU'RE MAKING - FIGMA IMAGE 0) */}
            {currentTab === 'analytics' && (
              <FocusAnalyticsView 
                totalFocusedSeconds={totalFocusedSeconds}
                completedCount={sessionsCount}
                streakDays={streakDays}
                onStartFocus={() => setCurrentTab('focus')}
              />
            )}
          </main>

          {/* Mobile Bottom Navigation Bar (md:hidden) */}
          <div className="md:hidden flex items-center justify-around py-3 px-4 bg-[#070B14]/95 border-t border-slate-800/80 backdrop-blur-lg shrink-0 z-30">
            <button
              onClick={() => setCurrentTab('projects')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentTab === 'projects' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setCurrentTab('notes')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentTab === 'notes' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setCurrentTab('focus')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentTab === 'focus' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Focus</span>
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                currentTab === 'analytics' ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODALS & TOOLS                                        */}
      {/* ======================================================== */}
      <AppearanceModal 
        isOpen={showAppearanceModal}
        onClose={() => setShowAppearanceModal(false)}
        currentFont={currentFont}
        onSelectFont={setCurrentFont}
        currentSize={currentSize}
        onSelectSize={setCurrentSize}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

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

      <ShortcutsModal 
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
