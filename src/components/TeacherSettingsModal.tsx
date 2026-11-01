import React from 'react';
import { X, Settings, Check, Users, Bot, Sliders, Volume2, Lightbulb, Award } from 'lucide-react';
import { DifficultyLevel, GameMode, GameSettings } from '../types';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSave: (newSettings: GameSettings) => void;
  onRestartGame: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onRestartGame,
}) => {
  const [localSettings, setLocalSettings] = React.useState<GameSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleToggleOp = (op: keyof typeof localSettings.operations) => {
    const nextOps = {
      ...localSettings.operations,
      [op]: !localSettings.operations[op],
    };
    // Ensure at least one operation is checked
    if (Object.values(nextOps).every((v) => !v)) {
      nextOps.addition = true;
    }
    setLocalSettings({ ...localSettings, operations: nextOps });
  };

  const handleSaveAndApply = () => {
    onSave(localSettings);
    onClose();
    onRestartGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-300">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-emerald-300">
              Поставки за час / игра
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Прилагодете ги математичките операции според наставната програма
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* 1. Избор на операции со цели броеви */}
          <div>
            <label className="font-display font-bold text-sm text-slate-200 mb-2 block flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Математички операции:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'addition', label: 'Собирање (+)', desc: '(-5) + (+8)' },
                { key: 'subtraction', label: 'Одземање (-)', desc: '(-4) - (-7)' },
                { key: 'multiplication', label: 'Множење (·)', desc: '(-6) · (-3)' },
                { key: 'division', label: 'Делење (:)', desc: '(-32) : (+4)' },
              ].map((item) => {
                const isSelected = localSettings.operations[item.key as keyof typeof localSettings.operations];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggleOp(item.key as keyof typeof localSettings.operations)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-md'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Тежина (Difficulty) */}
          <div>
            <label className="font-display font-bold text-sm text-slate-200 mb-2 block">
              Ниво на тежина:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 'easy', label: 'Лесно', range: 'до ±10' },
                { val: 'medium', label: 'Средно', range: 'до ±20' },
                { val: 'hard', label: 'Напредно', range: 'до ±30' },
                { val: 'expert', label: 'Мајстор', range: 'до ±45' },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, difficulty: lvl.val as DifficultyLevel })}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    localSettings.difficulty === lvl.val
                      ? 'bg-blue-600/30 border-blue-400 text-blue-200 font-bold'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[10px] text-slate-400">{lvl.range}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Должина на игра (Влечења за победа) */}
          <div>
            <label className="font-display font-bold text-sm text-slate-200 mb-2 block flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Цел на влечење (поени предност за победа):</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, pointsToWin: pts })}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    localSettings.pointsToWin === pts
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-sm font-extrabold">{pts}</span>
                  <span className="text-[10px] block opacity-80">{pts === 5 ? 'Препорачано' : 'влечења'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Режим на игра: PvP или Против Компјутер */}
          <div>
            <label className="font-display font-bold text-sm text-slate-200 mb-2 block flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Режим на игра:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, gameMode: 'pvp' })}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  localSettings.gameMode === 'pvp'
                    ? 'bg-purple-950/70 border-purple-400 text-purple-200 font-bold shadow-md'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}
              >
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-xs font-bold">2 Ученици на табла</div>
                  <div className="text-[10px] text-slate-400">Син против Црвен тим</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, gameMode: 'ai' })}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  localSettings.gameMode === 'ai'
                    ? 'bg-rose-950/70 border-rose-400 text-rose-200 font-bold shadow-md'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}
              >
                <Bot className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="text-xs font-bold">Против Компјутер</div>
                  <div className="text-[10px] text-slate-400">Вежбање за еден ученик</div>
                </div>
              </button>
            </div>

            {/* AI Speed if AI mode */}
            {localSettings.gameMode === 'ai' && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-300">Брзина на компјутерот:</span>
                <div className="flex gap-1.5">
                  {(['slow', 'medium', 'fast'] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, aiSpeed: spd })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                        localSettings.aiSpeed === spd
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {spd === 'slow' ? 'Лежерно' : spd === 'medium' ? 'Нормално' : 'Брзо'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Имиња на тимовите */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-blue-300 mb-1 block">Име за Тим 1 (Син):</label>
              <input
                type="text"
                value={localSettings.team1Name}
                onChange={(e) => setLocalSettings({ ...localSettings, team1Name: e.target.value })}
                maxLength={20}
                className="w-full bg-slate-950 border border-blue-500/50 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-hidden focus:border-blue-400"
                placeholder="Син Тим"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-rose-300 mb-1 block">Име за Тим 2 (Црвен):</label>
              <input
                type="text"
                value={localSettings.team2Name}
                onChange={(e) => setLocalSettings({ ...localSettings, team2Name: e.target.value })}
                maxLength={20}
                disabled={localSettings.gameMode === 'ai'}
                className="w-full bg-slate-950 border border-rose-500/50 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-hidden focus:border-rose-400 disabled:opacity-50"
                placeholder="Црвен Тим"
              />
            </div>
          </div>

          {/* 6. Дополнителни опции */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.showHints}
                onChange={(e) => setLocalSettings({ ...localSettings, showHints: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
              />
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Прикажи математички совети за редослед</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
              />
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span>Звучни ефекти</span>
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            Откажи
          </button>
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Зачувај и започни нова игра</span>
          </button>
        </div>
      </div>
    </div>
  );
};
