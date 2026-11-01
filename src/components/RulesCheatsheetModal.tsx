import React from 'react';
import { X, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

interface RulesCheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesCheatsheetModal: React.FC<RulesCheatsheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-indigo-300">
              Правила за операции со цели броеви
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Потсетник за часот по математика за брзо пресметување на табла
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* 1. Собирање */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30">
            <div className="font-display font-bold text-base text-blue-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              1. Собирање на цели броеви (+)
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Исти знаци:</strong> Ги собираме нивните апсолутни вредности и го препишуваме заедничкиот знак.
                  <br />
                  <span className="font-mono text-amber-300 text-xs">Пример: (+4) + (+3) = +7 &nbsp;|&nbsp; (-5) + (-4) = -9</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Различни знаци:</strong> Од поголемата вредност ја одземаме помалата и го ставаме знакот на поголемиот број.
                  <br />
                  <span className="font-mono text-amber-300 text-xs">Пример: (-8) + (+5) = -3 &nbsp;|&nbsp; (+9) + (-4) = +5</span>
                </span>
              </li>
            </ul>
          </div>

          {/* 2. Одземање */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30">
            <div className="font-display font-bold text-base text-purple-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              2. Одземање на цели броеви (-)
            </div>
            <p className="text-slate-300 mb-2">
              Одземањето на еден број е еднакво на собирање со неговиот <strong>спротивен број</strong>:
              <br />
              <span className="font-mono text-purple-300 font-bold">a - b = a + (-b)</span>
            </p>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-purple-500/20 font-mono text-xs text-amber-300 space-y-1">
              <div>(+6) - (+9) = 6 - 9 = <strong>-3</strong></div>
              <div>(+5) - (-4) = 5 + 4 = <strong>+9</strong> &nbsp; (минус и минус даваат плус!)</div>
              <div>(-7) - (-3) = -7 + 3 = <strong>-4</strong></div>
            </div>
          </div>

          {/* 3. Множење и делење (Златни правила за знаци) */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
            <div className="font-display font-bold text-base text-amber-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              3. Множење (·) и Делење (:) — Златни правила за знаци
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/40">
                <div className="text-emerald-400 font-bold mb-1 text-xs uppercase tracking-wide">Исти знаци = ПЛУС (+)</div>
                <div className="font-mono text-xs text-slate-200 space-y-0.5">
                  <div>(+) · (+) = <span className="text-emerald-400 font-bold">(+)</span></div>
                  <div>(-) · (-) = <span className="text-emerald-400 font-bold">(+)</span></div>
                  <div className="text-amber-300 pt-1">(-6) · (-4) = +24</div>
                  <div className="text-amber-300">(-36) : (-6) = +6</div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-500/40">
                <div className="text-rose-400 font-bold mb-1 text-xs uppercase tracking-wide">Различни знаци = МИНУС (-)</div>
                <div className="font-mono text-xs text-slate-200 space-y-0.5">
                  <div>(+) · (-) = <span className="text-rose-400 font-bold">(-)</span></div>
                  <div>(-) · (+) = <span className="text-rose-400 font-bold">(-)</span></div>
                  <div className="text-amber-300 pt-1">(-7) · (+5) = -35</div>
                  <div className="text-amber-300">(+42) : (-7) = -6</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-95"
          >
            Јасно ми е, продолжуваме!
          </button>
        </div>
      </div>
    </div>
  );
};
