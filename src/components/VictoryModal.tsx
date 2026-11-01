import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Award, Zap, CheckCircle2, Settings } from 'lucide-react';
import { TeamState } from '../types';

interface VictoryModalProps {
  winner: 'team1' | 'team2' | null;
  team1: TeamState;
  team2: TeamState;
  onPlayAgain: () => void;
  onOpenSettings: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  team1,
  team2,
  onPlayAgain,
  onOpenSettings,
}) => {
  useEffect(() => {
    if (!winner) return;

    // Launch multi-stage confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#fbbf24', '#10b981', '#f43f5e'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#fbbf24', '#10b981', '#f43f5e'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [winner]);

  if (!winner) return null;

  const winningTeam = winner === 'team1' ? team1 : team2;
  const isBlueWin = winner === 'team1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in zoom-in-95 duration-300">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center text-white border-4 shadow-2xl overflow-hidden ${
          isBlueWin
            ? 'bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 border-blue-400 shadow-blue-500/40'
            : 'bg-gradient-to-b from-rose-950 via-slate-900 to-slate-950 border-rose-400 shadow-rose-500/40'
        }`}
      >
        {/* Animated Trophy Icon */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg border-2 border-yellow-200">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-amber-950 fill-amber-950/20 animate-bounce" />
          </div>
        </div>

        {/* Victory Announcement */}
        <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
          Шампиони на влечење јаже!
        </div>

        <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2 tracking-wide drop-shadow-md">
          {winningTeam.name} ПОБЕДИ! 🏆
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto mb-6">
          Брилијантно познавање на операции со цели броеви и брзина на таблата!
        </p>

        {/* Match Statistics Card */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-700/80 text-left">
          {/* Team 1 stats */}
          <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-500/30">
            <div className="font-display font-bold text-xs text-blue-300 truncate mb-1">
              {team1.name}
            </div>
            <div className="text-lg font-extrabold text-white">
              {team1.totalCorrect} точни
            </div>
            <div className="text-[11px] text-slate-400">
              од {team1.totalAttempts} обиди ({team1.totalAttempts > 0 ? Math.round((team1.totalCorrect / team1.totalAttempts) * 100) : 0}%)
            </div>
          </div>

          {/* Team 2 stats */}
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30">
            <div className="font-display font-bold text-xs text-rose-300 truncate mb-1">
              {team2.name}
            </div>
            <div className="text-lg font-extrabold text-white">
              {team2.totalCorrect} точни
            </div>
            <div className="text-[11px] text-slate-400">
              од {team2.totalAttempts} обиди ({team2.totalAttempts > 0 ? Math.round((team2.totalCorrect / team2.totalAttempts) * 100) : 0}%)
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-display font-black text-base shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Играј повторно</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>Поставки</span>
          </button>
        </div>
      </div>
    </div>
  );
};
