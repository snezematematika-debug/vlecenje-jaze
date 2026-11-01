import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Delete, RotateCcw, Flame, Bot, Sparkles, Lightbulb } from 'lucide-react';
import { TeamState } from '../types';
import { sounds } from '../utils/audio';

interface TeamPanelProps {
  team: TeamState;
  isAi: boolean;
  aiProgress?: number; // 0 to 100 for AI thinking bar
  onNumberClick: (num: string) => void;
  onToggleSign: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  showHints: boolean;
}

export const TeamPanel: React.FC<TeamPanelProps> = ({
  team,
  isAi,
  aiProgress = 0,
  onNumberClick,
  onToggleSign,
  onBackspace,
  onClear,
  onSubmit,
  showHints,
}) => {
  const isTeam1 = team.id === 'team1';

  // Distinct themes
  const colorClasses = isTeam1
    ? {
        bg: 'from-blue-950/70 via-slate-900/90 to-blue-950/50',
        border: 'border-blue-500/50',
        glow: 'shadow-blue-500/20',
        headerBg: 'bg-gradient-to-r from-blue-700 to-indigo-600',
        headerText: 'text-blue-100',
        problemBg: 'bg-blue-950/80 border-blue-400/40',
        problemText: 'text-blue-200',
        inputBorder: 'border-blue-400',
        inputText: 'text-white',
        btnBg: 'bg-blue-900/60 hover:bg-blue-800/80 active:bg-blue-700 text-blue-100 border-blue-500/40',
        submitBg: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-white shadow-emerald-600/40',
        accentText: 'text-blue-400',
      }
    : {
        bg: 'from-rose-950/70 via-slate-900/90 to-rose-950/50',
        border: 'border-rose-500/50',
        glow: 'shadow-rose-500/20',
        headerBg: 'bg-gradient-to-r from-rose-700 to-orange-600',
        headerText: 'text-rose-100',
        problemBg: 'bg-rose-950/80 border-rose-400/40',
        problemText: 'text-rose-200',
        inputBorder: 'border-rose-400',
        inputText: 'text-white',
        btnBg: 'bg-rose-900/60 hover:bg-rose-800/80 active:bg-rose-700 text-rose-100 border-rose-500/40',
        submitBg: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-white shadow-emerald-600/40',
        accentText: 'text-rose-400',
      };

  const handleKeyClick = (key: string) => {
    sounds.playKeyClick();
    onNumberClick(key);
  };

  const handleSignClick = () => {
    sounds.playKeyClick();
    onToggleSign();
  };

  const handleBackClick = () => {
    sounds.playKeyClick();
    onBackspace();
  };

  const handleClearClick = () => {
    sounds.playKeyClick();
    onClear();
  };

  const handleSubmitClick = () => {
    onSubmit();
  };

  return (
    <div
      className={`relative flex flex-col justify-between w-full h-full rounded-3xl border-2 ${colorClasses.border} bg-gradient-to-b ${colorClasses.bg} shadow-2xl ${colorClasses.glow} overflow-hidden backdrop-blur-md p-3 sm:p-4 select-none touch-manipulation`}
    >
      {/* Header bar with team name and score */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-xl ${colorClasses.headerBg} text-white font-display font-bold text-sm sm:text-base tracking-wide shadow-md flex items-center gap-1.5`}
          >
            {isAi ? <Bot className="w-4 h-4 animate-pulse text-amber-300" /> : <Sparkles className="w-4 h-4" />}
            <span className="truncate max-w-[130px]">{team.name}</span>
          </div>

          {/* Streak Flame */}
          {team.streak > 1 && (
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{team.streak} по ред!</span>
            </motion.div>
          )}
        </div>

        {/* Total Correct Count */}
        <div className="text-right">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Точни</div>
          <div className="text-lg sm:text-xl font-display font-extrabold text-white">
            {team.totalCorrect}
          </div>
        </div>
      </div>

      {/* Main Problem Display Card */}
      <div
        className={`relative w-full rounded-2xl border-2 ${colorClasses.problemBg} p-3 sm:p-4 flex flex-col items-center justify-center my-1 shadow-inner min-h-[95px] sm:min-h-[110px] overflow-hidden ${
          team.feedback === 'wrong' ? 'animate-wrong border-red-500/80 bg-red-950/60' : ''
        } ${team.feedback === 'correct' ? 'border-emerald-500/80 bg-emerald-950/60' : ''}`}
      >
        {/* Operation Label badge */}
        <div className="absolute top-2 left-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
          {team.currentProblem.operation === 'addition' && 'Собирање'}
          {team.currentProblem.operation === 'subtraction' && 'Одземање'}
          {team.currentProblem.operation === 'multiplication' && 'Множење'}
          {team.currentProblem.operation === 'division' && 'Делење'}
        </div>

        {/* Math Expression: huge and high readability */}
        <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-wider text-white text-center mt-2">
          {team.currentProblem.displayExpression} = ?
        </div>

        {/* Real-time Input Box */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <div
            className={`min-w-[100px] sm:min-w-[130px] h-10 sm:h-12 rounded-xl bg-slate-950/90 border-2 ${colorClasses.inputBorder} flex items-center justify-center px-3 shadow-inner`}
          >
            <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 tracking-wider">
              {team.input ? team.input : <span className="text-slate-600 animate-pulse">?</span>}
            </span>
          </div>
        </div>

        {/* Feedback message banner (Correct / Wrong) */}
        <AnimatePresence>
          {team.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute inset-x-0 bottom-0 py-1 text-center font-bold text-xs sm:text-sm tracking-wide ${
                team.feedback === 'correct'
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-rose-600/90 text-white'
              }`}
            >
              {team.feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helpful math rule tip (optional) */}
      {showHints && !team.feedback && (
        <div className="text-[11px] text-slate-400 px-2 flex items-center gap-1.5 line-clamp-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{team.currentProblem.explanation}</span>
        </div>
      )}

      {/* Interactive Touch Keypad or AI Thinking Mode */}
      {isAi ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950/50 rounded-2xl border border-rose-500/30 my-2">
          <div className="w-16 h-16 rounded-2xl bg-rose-900/40 border border-rose-400/50 flex items-center justify-center mb-3">
            <Bot className="w-9 h-9 text-rose-300 animate-bounce" />
          </div>
          <div className="text-sm font-bold text-rose-200 mb-1">Компјутерот размислува...</div>
          <div className="text-xs text-slate-400 mb-3">Пресметува со цели броеви</div>
          {/* Progress bar */}
          <div className="w-full max-w-[200px] h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
              style={{ width: `${aiProgress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col justify-end gap-1.5 sm:gap-2 mt-2">
          {/* Keypad Grid (3x4 + Action Row) optimized for fingers */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyClick(digit)}
                className={`h-11 sm:h-13 rounded-xl border font-display font-extrabold text-xl sm:text-2xl shadow-md transition-all active:scale-95 flex items-center justify-center ${colorClasses.btnBg}`}
              >
                {digit}
              </button>
            ))}

            {/* Negative Sign / Toggle key */}
            <button
              type="button"
              onClick={handleSignClick}
              className="h-11 sm:h-13 rounded-xl border border-amber-500/50 bg-amber-950/60 hover:bg-amber-900/80 active:bg-amber-800 text-amber-200 font-display font-extrabold text-2xl shadow-md transition-all active:scale-95 flex items-center justify-center"
              title="Знак минус / смени знак"
            >
              - / ±
            </button>

            {/* Zero */}
            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className={`h-11 sm:h-13 rounded-xl border font-display font-extrabold text-xl sm:text-2xl shadow-md transition-all active:scale-95 flex items-center justify-center ${colorClasses.btnBg}`}
            >
              0
            </button>

            {/* Backspace */}
            <button
              type="button"
              onClick={handleBackClick}
              className="h-11 sm:h-13 rounded-xl border border-slate-600 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold shadow-md transition-all active:scale-95 flex items-center justify-center"
              title="Бриши последен знак"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Action Row: Clear & Submit */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleClearClick}
              className="col-span-1 h-11 sm:h-12 rounded-xl border border-rose-500/40 bg-rose-950/50 hover:bg-rose-900/60 active:bg-rose-800 text-rose-300 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1"
              title="Исчисти"
            >
              <RotateCcw className="w-4 h-4" />
              <span>C</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitClick}
              className={`col-span-3 h-11 sm:h-12 rounded-xl border-2 border-emerald-400 font-display font-extrabold text-base sm:text-lg tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${colorClasses.submitBg}`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>ПРОВЕРИ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
