import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, BookOpen, Settings, RotateCcw } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onResetGame: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenRules,
  onOpenSettings,
  onResetGame,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-6 py-2 bg-slate-900/90 border-b border-slate-800 text-white select-none backdrop-blur-md z-30">
      
      {/* Title & Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-700/80">
          <span className="text-blue-400">(-5)</span>
          <span className="text-amber-400">+</span>
          <span className="text-rose-400">(+8)</span>
        </div>

        <div>
          <h1 className="text-sm sm:text-lg md:text-xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-300 to-rose-400">
            МАТЕМАТИЧКО ВЛЕЧЕЊЕ ЈАЖЕ
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
            Операции со цели броеви за интерактивен панел
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Rules button */}
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold text-xs shadow-sm transition-all active:scale-95"
          title="Правила за цели броеви"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
          <span className="hidden md:inline">Правила</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-xs shadow-sm transition-all active:scale-95"
          title="Поставки за наставник"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span className="hidden md:inline">Поставки</span>
        </button>

        {/* Reset button */}
        <button
          onClick={onResetGame}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-xs shadow-sm transition-all active:scale-95"
          title="Ресетирај рунда"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span className="hidden lg:inline">Ресетирај</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-blue-950/70 border-blue-500/50 text-blue-300'
              : 'bg-slate-800 border-slate-700 text-slate-500'
          }`}
          title={soundEnabled ? 'Исклучи звук' : 'Вклучи звук'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          )}
        </button>

        {/* Fullscreen button for smartboard */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/60 text-slate-200 transition-all active:scale-95"
          title={isFullscreen ? 'Излези од цел екран' : 'Цел екран за интерактивен панел'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          ) : (
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          )}
        </button>
      </div>
    </header>
  );
};
