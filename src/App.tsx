import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateProblem } from './utils/mathGenerator';
import { sounds } from './utils/audio';
import { GameSettings, MathProblem, TeamState } from './types';
import { Header } from './components/Header';
import { TugOfWarCanvas } from './components/TugOfWarCanvas';
import { TeamPanel } from './components/TeamPanel';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { RulesCheatsheetModal } from './components/RulesCheatsheetModal';
import { VictoryModal } from './components/VictoryModal';
import { Play, Sparkles } from 'lucide-react';

const DEFAULT_SETTINGS: GameSettings = {
  pointsToWin: 5,
  operations: {
    addition: true,
    subtraction: true,
    multiplication: true,
    division: false,
  },
  difficulty: 'easy',
  minNumber: -10,
  maxNumber: 10,
  gameMode: 'pvp',
  aiSpeed: 'medium',
  team1Name: 'Син Тим',
  team2Name: 'Црвен Тим',
  soundEnabled: true,
  showHints: true,
};

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [ropePosition, setRopePosition] = useState<number>(0);
  const [winner, setWinner] = useState<'team1' | 'team2' | null>(null);
  const [lastPullDirection, setLastPullDirection] = useState<'left' | 'right' | null>(null);
  const [pullTrigger, setPullTrigger] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [aiProgress, setAiProgress] = useState<number>(0);

  // Initialize Team 1
  const [team1, setTeam1] = useState<TeamState>(() => {
    const prob = generateProblem(DEFAULT_SETTINGS);
    return {
      id: 'team1',
      name: DEFAULT_SETTINGS.team1Name,
      score: 0,
      currentProblem: prob,
      input: '',
      feedback: null,
      feedbackMessage: '',
      streak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
    };
  });

  // Initialize Team 2
  const [team2, setTeam2] = useState<TeamState>(() => {
    const prob = generateProblem(DEFAULT_SETTINGS);
    return {
      id: 'team2',
      name: DEFAULT_SETTINGS.team2Name,
      score: 0,
      currentProblem: prob,
      input: '',
      feedback: null,
      feedbackMessage: '',
      streak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
    };
  });

  // Sync sounds manager
  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Handle Fullscreen state change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Restart / Reset Game
  const startNewGame = useCallback((customSettings?: GameSettings) => {
    const currentSettings = customSettings || settings;
    setWinner(null);
    setRopePosition(0);
    setLastPullDirection(null);
    setAiProgress(0);

    const prob1 = generateProblem(currentSettings);
    const prob2 = generateProblem(currentSettings);

    setTeam1({
      id: 'team1',
      name: currentSettings.team1Name,
      score: 0,
      currentProblem: prob1,
      input: '',
      feedback: null,
      feedbackMessage: '',
      streak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
    });

    setTeam2({
      id: 'team2',
      name: currentSettings.gameMode === 'ai' ? 'Компјутер 🤖' : currentSettings.team2Name,
      score: 0,
      currentProblem: prob2,
      input: '',
      feedback: null,
      feedbackMessage: '',
      streak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
    });

    // Start 3-2-1 Countdown
    setCountdown(3);
    sounds.playCountdown(false);
  }, [settings]);

  // Countdown timer loop
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
        if (countdown - 1 === 0) {
          sounds.playCountdown(true);
        } else {
          sounds.playCountdown(false);
        }
      }, 750);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCountdown(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // AI Opponent simulation loop
  useEffect(() => {
    if (settings.gameMode !== 'ai' || winner !== null || countdown !== null) {
      return;
    }

    let intervalDuration = 100;
    let targetTime = 5000;
    if (settings.aiSpeed === 'slow') targetTime = 7500;
    if (settings.aiSpeed === 'fast') targetTime = 3400;

    const step = (100 / (targetTime / intervalDuration));
    let currentPct = 0;

    const interval = setInterval(() => {
      currentPct += step;
      if (currentPct >= 100) {
        clearInterval(interval);
        setAiProgress(100);

        // Computer answers
        const isAccurate = Math.random() < 0.88;
        const answer = isAccurate
          ? team2.currentProblem.answer
          : team2.currentProblem.answer + (Math.random() < 0.5 ? 1 : -1);

        handleAiSubmit(answer);
      } else {
        setAiProgress(currentPct);
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [settings.gameMode, settings.aiSpeed, team2.currentProblem.id, winner, countdown]);

  const handleAiSubmit = (ans: number) => {
    if (winner !== null) return;

    const isCorrect = ans === team2.currentProblem.answer;

    if (isCorrect) {
      sounds.playCorrectSound();
      sounds.playRopePullSound();

      setRopePosition((prev) => {
        const next = prev + 1;
        if (next >= settings.pointsToWin) {
          setWinner('team2');
          sounds.playVictoryFanfare();
        }
        return next;
      });

      setLastPullDirection('right');
      setPullTrigger((prev) => prev + 1);

      setTeam2((prev) => ({
        ...prev,
        score: prev.score + 1,
        totalCorrect: prev.totalCorrect + 1,
        totalAttempts: prev.totalAttempts + 1,
        streak: prev.streak + 1,
        feedback: 'correct',
        feedbackMessage: '+1 ПОЕН! Компјутерот повлече!',
        currentProblem: generateProblem(settings, prev.currentProblem.id),
      }));

      setTimeout(() => {
        setTeam2((prev) => ({ ...prev, feedback: null, feedbackMessage: '' }));
      }, 1000);
    } else {
      setTeam2((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        streak: 0,
        feedback: 'wrong',
        feedbackMessage: 'Компјутерот погреши!',
        currentProblem: generateProblem(settings, prev.currentProblem.id),
      }));

      setTimeout(() => {
        setTeam2((prev) => ({ ...prev, feedback: null, feedbackMessage: '' }));
      }, 1000);
    }
  };

  // Team 1 Keypad Actions
  const handleTeam1Number = (digit: string) => {
    if (winner !== null || countdown !== null) return;
    setTeam1((prev) => {
      if (prev.input.length >= 5) return prev;
      return { ...prev, input: prev.input + digit };
    });
  };

  const handleTeam1ToggleSign = () => {
    if (winner !== null || countdown !== null) return;
    setTeam1((prev) => {
      if (!prev.input) return { ...prev, input: '-' };
      if (prev.input.startsWith('-')) return { ...prev, input: prev.input.substring(1) };
      return { ...prev, input: '-' + prev.input };
    });
  };

  const handleTeam1Backspace = () => {
    if (winner !== null || countdown !== null) return;
    setTeam1((prev) => ({
      ...prev,
      input: prev.input.slice(0, -1),
    }));
  };

  const handleTeam1Clear = () => {
    if (winner !== null || countdown !== null) return;
    setTeam1((prev) => ({ ...prev, input: '' }));
  };

  const handleTeam1Submit = () => {
    if (winner !== null || countdown !== null) return;
    if (!team1.input || team1.input === '-') return;

    const userAns = parseInt(team1.input, 10);
    if (isNaN(userAns)) return;

    const isCorrect = userAns === team1.currentProblem.answer;

    if (isCorrect) {
      sounds.playCorrectSound();
      sounds.playRopePullSound();

      setRopePosition((prev) => {
        const next = prev - 1;
        if (next <= -settings.pointsToWin) {
          setWinner('team1');
          sounds.playVictoryFanfare();
        }
        return next;
      });

      setLastPullDirection('left');
      setPullTrigger((prev) => prev + 1);

      setTeam1((prev) => ({
        ...prev,
        score: prev.score + 1,
        totalCorrect: prev.totalCorrect + 1,
        totalAttempts: prev.totalAttempts + 1,
        streak: prev.streak + 1,
        input: '',
        feedback: 'correct',
        feedbackMessage: 'ТОЧНО! +1 ПОВЛЕКУВАЊЕ!',
        currentProblem: generateProblem(settings, prev.currentProblem.id),
      }));

      setTimeout(() => {
        setTeam1((prev) => ({ ...prev, feedback: null, feedbackMessage: '' }));
      }, 900);
    } else {
      sounds.playWrongSound();

      setTeam1((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        streak: 0,
        input: '',
        feedback: 'wrong',
        feedbackMessage: 'Неточно! Обиди се повторно!',
      }));

      setTimeout(() => {
        setTeam1((prev) => ({ ...prev, feedback: null, feedbackMessage: '' }));
      }, 1200);
    }
  };

  // Team 2 Keypad Actions
  const handleTeam2Number = (digit: string) => {
    if (winner !== null || countdown !== null || settings.gameMode === 'ai') return;
    setTeam2((prev) => {
      if (prev.input.length >= 5) return prev;
      return { ...prev, input: prev.input + digit };
    });
  };

  const handleTeam2ToggleSign = () => {
    if (winner !== null || countdown !== null || settings.gameMode === 'ai') return;
    setTeam2((prev) => {
      if (!prev.input) return { ...prev, input: '-' };
      if (prev.input.startsWith('-')) return { ...prev, input: prev.input.substring(1) };
      return { ...prev, input: '-' + prev.input };
    });
  };

  const handleTeam2Backspace = () => {
    if (winner !== null || countdown !== null || settings.gameMode === 'ai') return;
    setTeam2((prev) => ({
      ...prev,
      input: prev.input.slice(0, -1),
    }));
  };

  const handleTeam2Clear = () => {
    if (winner !== null || countdown !== null || settings.gameMode === 'ai') return;
    setTeam2((prev) => ({ ...prev, input: '' }));
  };

  const handleTeam2Submit = () => {
    if (winner !== null || countdown !== null || settings.gameMode === 'ai') return;
    if (!team2.input || team2.input === '-') return;

    const userAns = parseInt(team2.input, 10);
    if (isNaN(userAns)) return;

    const isCorrect = userAns === team2.currentProblem.answer;

    if (isCorrect) {
      sounds.playCorrectSound();
      sounds.playRopePullSound();

      setRopePosition((prev) => {
        const next = prev + 1;
        if (next >= settings.pointsToWin) {
          setWinner('team2');
          sounds.playVictoryFanfare();
        }
        return next;
      });

      setLastPullDirection('right');
      setPullTrigger((prev) => prev + 1);

      setTeam2((prev) => ({
        ...prev,
        score: prev.score + 1,
        totalCorrect: prev.totalCorrect + 1,
        totalAttempts: prev.totalAttempts + 1,
        streak: prev.streak + 1,
        input: '',
        feedback: 'correct',
        feedbackMessage: 'ТОЧНО! +1 ПОВЛЕКУВАЊЕ!',
        currentProblem: generateProblem(settings, prev.currentProblem.id),
      }));

      setTimeout(() => {
        setTeam2((prev) => ({ ...prev, feedback: null, feedbackMessage: '' }));
      }, 900);
    } else {
      sounds.playWrongSound();

      setTeam2((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        streak: 0,
        input: '',
        feedback: 'wrong',
        feedbackMessage: 'Неточно! Обиди се повторно!',
      }));

      setTimeout(() => {
        setTeam2((prev) => ({ ...prev, feedback: null, feedbackMessage: '' }));
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      
      {/* Top Classroom Navigation Bar */}
      <Header
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetGame={() => startNewGame()}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Playing Stage: 3 Column Layout for Interactive Panels */}
      <main className="flex-1 p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 overflow-hidden relative">
        
        {/* LEFT COLUMN: Team 1 (Blue) Panel */}
        <div className="lg:col-span-3 h-full flex flex-col min-h-0 order-2 lg:order-1">
          <TeamPanel
            team={team1}
            isAi={false}
            onNumberClick={handleTeam1Number}
            onToggleSign={handleTeam1ToggleSign}
            onBackspace={handleTeam1Backspace}
            onClear={handleTeam1Clear}
            onSubmit={handleTeam1Submit}
            showHints={settings.showHints}
          />
        </div>

        {/* CENTER COLUMN: Interactive Tug-Of-War Rope & Animated Athletes */}
        <div className="lg:col-span-6 h-full flex flex-col min-h-0 order-1 lg:order-2">
          <TugOfWarCanvas
            ropePosition={ropePosition}
            pointsToWin={settings.pointsToWin}
            winner={winner}
            team1Name={team1.name}
            team2Name={team2.name}
            lastPullDirection={lastPullDirection}
            pullTrigger={pullTrigger}
          />
        </div>

        {/* RIGHT COLUMN: Team 2 (Red) Panel or Computer Opponent */}
        <div className="lg:col-span-3 h-full flex flex-col min-h-0 order-3">
          <TeamPanel
            team={team2}
            isAi={settings.gameMode === 'ai'}
            aiProgress={aiProgress}
            onNumberClick={handleTeam2Number}
            onToggleSign={handleTeam2ToggleSign}
            onBackspace={handleTeam2Backspace}
            onClear={handleTeam2Clear}
            onSubmit={handleTeam2Submit}
            showHints={settings.showHints}
          />
        </div>

        {/* 3-2-1 Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none">
            <div className="text-8xl sm:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-yellow-200 animate-pulse drop-shadow-[0_0_35px_rgba(251,191,36,0.8)]">
              {countdown === 0 ? 'СТАРТ!' : countdown}
            </div>
            <div className="text-sm sm:text-lg font-bold text-slate-300 mt-4 tracking-wider uppercase">
              Подгответе се за влечење јаже!
            </div>
          </div>
        )}
      </main>

      {/* Teacher Settings Modal */}
      <TeacherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => setSettings(newSettings)}
        onRestartGame={startNewGame}
      />

      {/* Math Rules & Sign Conventions Cheatsheet Modal */}
      <RulesCheatsheetModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        winner={winner}
        team1={team1}
        team2={team2}
        onPlayAgain={() => startNewGame()}
        onOpenSettings={() => {
          setWinner(null);
          setIsSettingsOpen(true);
        }}
      />
    </div>
  );
}
