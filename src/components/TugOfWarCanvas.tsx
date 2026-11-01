import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Zap, Flame, Crown, Sparkles } from 'lucide-react';

interface TugOfWarCanvasProps {
  ropePosition: number; // e.g. -5 to +5 (negative is team1/blue advantage, positive is team2/red advantage)
  pointsToWin: number;
  winner: 'team1' | 'team2' | null;
  team1Name: string;
  team2Name: string;
  lastPullDirection: 'left' | 'right' | null;
  pullTrigger: number;
}

export const TugOfWarCanvas: React.FC<TugOfWarCanvasProps> = ({
  ropePosition,
  pointsToWin,
  winner,
  team1Name,
  team2Name,
  lastPullDirection,
  pullTrigger,
}) => {
  // Normalize rope offset to percentage (-100% to +100% of max allowed visual movement)
  // Max visual offset in pixels: ~140px left or right
  const visualShift = (ropePosition / pointsToWin) * 110;

  // Tension ratio from 0 to 1
  const tension = Math.min(1, Math.abs(ropePosition) / pointsToWin);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center select-none overflow-hidden bg-gradient-to-b from-sky-900/40 via-slate-900/60 to-slate-950/80 rounded-3xl border-2 border-slate-700/60 shadow-2xl p-3 sm:p-5 backdrop-blur-md">
      
      {/* Top Tug-Of-War Progress Gauge */}
      <div className="w-full max-w-lg flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center justify-between w-full text-xs sm:text-sm font-bold tracking-wide">
          <div className="flex items-center gap-1.5 text-blue-400 font-display">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            <span className="truncate max-w-[120px]">{team1Name}</span>
            <span className="bg-blue-950/90 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/40 text-xs">
              {ropePosition < 0 ? `+${Math.abs(ropePosition)}` : '0'}
            </span>
          </div>

          <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-800/90 border border-slate-600/60 text-slate-300 font-semibold text-xs shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Цел: {pointsToWin} влечења</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-400 font-display">
            <span className="bg-rose-950/90 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40 text-xs">
              {ropePosition > 0 ? `+${ropePosition}` : '0'}
            </span>
            <span className="truncate max-w-[120px]">{team2Name}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block" />
          </div>
        </div>

        {/* Visual rope progress track with steps */}
        <div className="w-full relative h-7 bg-slate-950/90 rounded-2xl p-1 border border-slate-700/80 shadow-inner flex items-center">
          {/* Left win zone */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-blue-500/20 rounded-l-2xl border-r border-blue-500/40 flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-blue-400 opacity-60" />
          </div>
          {/* Right win zone */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-rose-500/20 rounded-r-2xl border-l border-rose-500/40 flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-rose-400 opacity-60" />
          </div>

          {/* Center marker */}
          <div className="absolute left-1/2 top-1 bottom-1 w-0.5 -translate-x-1/2 bg-amber-400/70 z-0">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 -translate-x-0.5 -translate-y-0.5" />
          </div>

          {/* Step notches */}
          <div className="w-full flex justify-between px-9 z-0 pointer-events-none">
            {Array.from({ length: pointsToWin * 2 + 1 }).map((_, idx) => {
              const stepVal = idx - pointsToWin;
              const isCenter = stepVal === 0;
              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isCenter
                      ? 'h-3.5 bg-amber-400/60'
                      : Math.abs(stepVal) === pointsToWin
                      ? 'h-3 bg-slate-400'
                      : 'h-2 bg-slate-700'
                  }`}
                />
              );
            })}
          </div>

          {/* Active Tug Ribbon Indicator on track */}
          <motion.div
            className="absolute top-0.5 bottom-0.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.9)] flex items-center justify-center z-10 -ml-3"
            animate={{
              left: `${50 + (ropePosition / pointsToWin) * 44}%`,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-900 animate-ping" />
          </motion.div>
        </div>

        {/* Advantage status text */}
        <div className="text-xs font-bold transition-all duration-300 text-center">
          {ropePosition === 0 && (
            <span className="text-slate-400">Јажето е на средина! Кој ќе повлече прв?</span>
          )}
          {ropePosition < 0 && (
            <span className="text-blue-400 font-semibold flex items-center gap-1 justify-center">
              <span>⬅</span> {team1Name} води со {Math.abs(ropePosition)} {Math.abs(ropePosition) === 1 ? 'поен' : 'поени'}!
            </span>
          )}
          {ropePosition > 0 && (
            <span className="text-rose-400 font-semibold flex items-center gap-1 justify-center">
              {team2Name} води со {ropePosition} {ropePosition === 1 ? 'поен' : 'поени'}! <span>➡</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Arena with Characters and Rope */}
      <div className="relative w-full flex-1 flex items-center justify-center my-2 min-h-[220px] max-h-[360px]">
        {/* Sky background clouds / stars / decorative flags */}
        <div className="absolute inset-x-0 top-0 h-10 flex justify-around opacity-30 pointer-events-none">
          <div className="w-12 h-6 bg-slate-600/40 rounded-full blur-xs" />
          <div className="w-16 h-8 bg-slate-600/30 rounded-full blur-xs" />
          <div className="w-10 h-5 bg-slate-600/40 rounded-full blur-xs" />
        </div>

        {/* Ground Surface: Grass / Stadium Mat with Chalk Line */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-emerald-950/90 via-emerald-900/50 to-transparent rounded-b-2xl border-b-4 border-emerald-600/60 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Grass texture tufts */}
          <div className="absolute inset-x-0 bottom-1 flex justify-between px-6 opacity-40 text-emerald-400 text-xs select-none">
            <span>🌱</span><span>🌿</span><span>🌱</span><span>🌿</span><span>🌱</span><span>🌿</span><span>🌱</span><span>🌿</span><span>🌱</span>
          </div>

          {/* Center White Chalk Line */}
          <div className="absolute bottom-0 w-2 h-14 bg-white/40 rounded-t-sm shadow-md flex flex-col items-center">
            <div className="w-4 h-1 bg-amber-400 mt-1" />
          </div>

          {/* Left / Right Boundary Lines */}
          <div className="absolute bottom-0 left-[18%] w-1.5 h-10 bg-blue-500/60 rounded-t-sm" />
          <div className="absolute bottom-0 right-[18%] w-1.5 h-10 bg-rose-500/60 rounded-t-sm" />
        </div>

        {/* Floating "+1 ПОВЛЕЧЕНО!" Banner on pull */}
        <AnimatePresence>
          {lastPullDirection && (
            <motion.div
              key={`pull-${pullTrigger}`}
              initial={{ opacity: 0, y: 15, scale: 0.7 }}
              animate={{ opacity: 1, y: -25, scale: 1.15 }}
              exit={{ opacity: 0, y: -45, scale: 0.9 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className={`absolute top-1/4 z-30 font-display font-extrabold text-lg sm:text-xl px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2 border-2 ${
                lastPullDirection === 'left'
                  ? 'bg-blue-600 text-white border-blue-300 shadow-blue-500/50'
                  : 'bg-rose-600 text-white border-rose-300 shadow-rose-500/50'
              }`}
            >
              <Zap className="w-5 h-5 fill-yellow-300 text-yellow-200" />
              <span>{lastPullDirection === 'left' ? `${team1Name} ПОВЛЕЧЕ!` : `${team2Name} ПОВЛЕЧЕ!`}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Scene Group (Rope + Blue Character + Red Character) */}
        <motion.div
          className="relative w-full max-w-xl h-48 sm:h-56 flex items-center justify-center"
          animate={{
            x: visualShift,
          }}
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 18,
          }}
        >
          {/* SVG ROPE */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 600 240"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="ropeShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Rope Shadow on Ground */}
            <path
              d="M 190 200 Q 300 208 410 200"
              stroke="#0f172a"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* Main Hemp Rope - Dynamic sag depending on tension */}
            <path
              d={`M 185 130 Q 300 ${130 + (1 - tension * 0.7) * 12} 415 130`}
              stroke="url(#ropeGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray="12 4"
              filter="url(#ropeShadow)"
            />

            {/* Rope Outer Strands for realism */}
            <path
              d={`M 185 130 Q 300 ${130 + (1 - tension * 0.7) * 12} 415 130`}
              stroke="#78350f"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />

            {/* Center Ribbon / Flag on Rope */}
            <g transform="translate(300, 132)">
              {/* Knot */}
              <circle cx="0" cy="0" r="7" fill="#dc2626" stroke="#fef08a" strokeWidth="2" />
              {/* Ribbon flaps hanging down */}
              <path
                d="M -3 3 L -7 28 L 0 22 L 7 28 L 3 3 Z"
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="1.5"
              />
              <path
                d="M -1 3 L -3 20 L 0 16 L 3 20 L 1 3 Z"
                fill="#facc15"
                opacity="0.8"
              />
            </g>
          </svg>

          {/* LEFT CHARACTER: Blue Team Athlete */}
          <div
            className={`absolute left-[12%] sm:left-[16%] bottom-3 sm:bottom-4 z-20 transition-transform duration-300 ${
              lastPullDirection === 'left' ? 'scale-105' : ''
            }`}
          >
            <BlueTeamAthlete
              isPulling={lastPullDirection === 'left'}
              isStraining={ropePosition > 1}
              isWinning={winner === 'team1'}
              isLosing={winner === 'team2'}
              teamName={team1Name}
            />
          </div>

          {/* RIGHT CHARACTER: Red Team Athlete */}
          <div
            className={`absolute right-[12%] sm:right-[16%] bottom-3 sm:bottom-4 z-20 transition-transform duration-300 ${
              lastPullDirection === 'right' ? 'scale-105' : ''
            }`}
          >
            <RedTeamAthlete
              isPulling={lastPullDirection === 'right'}
              isStraining={ropePosition < -1}
              isWinning={winner === 'team2'}
              isLosing={winner === 'team1'}
              teamName={team2Name}
            />
          </div>

          {/* Dust/Effort particles when rope is pulled */}
          <AnimatePresence>
            {lastPullDirection && (
              <motion.div
                key={`dust-${pullTrigger}`}
                initial={{ opacity: 0.9, scale: 0.4 }}
                animate={{ opacity: 0, scale: 1.8, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`absolute bottom-6 ${
                  lastPullDirection === 'left' ? 'left-[22%]' : 'right-[22%]'
                } pointer-events-none text-xl`}
              >
                💨
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer hint for classroom */}
      <div className="w-full flex items-center justify-between text-[11px] sm:text-xs text-slate-400 px-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Син тим влече на лево</span>
        </div>
        <div className="text-center font-medium text-slate-400 hidden sm:block">
          Секој точен одговор носи 1 повлекување кон вашиот тим!
        </div>
        <div className="flex items-center gap-1">
          <span>Црвен тим влече на десно</span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
      </div>
    </div>
  );
};

// Vector SVG Athlete for Blue Team
const BlueTeamAthlete: React.FC<{
  isPulling: boolean;
  isStraining: boolean;
  isWinning: boolean;
  isLosing: boolean;
  teamName: string;
}> = ({ isPulling, isStraining, isWinning, isLosing, teamName }) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Team Nametag badge */}
      <div className="mb-1 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[11px] font-black tracking-wide border border-blue-400 shadow-md">
        {teamName}
      </div>

      {/* SVG Cartoon Athlete */}
      <svg
        width="110"
        height="145"
        viewBox="0 0 110 145"
        className={`transition-all duration-300 filter drop-shadow-xl ${
          isWinning ? 'animate-bounce' : isPulling ? '-rotate-6 scale-105' : isStraining ? 'rotate-3' : '-rotate-2'
        }`}
      >
        <g>
          {/* Winner Crown / Trophy */}
          {isWinning && (
            <g transform="translate(42, -5)">
              <polygon points="0,15 5,0 12,10 19,0 24,15" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="5" cy="0" r="1.5" fill="#ef4444" />
              <circle cx="12" cy="10" r="1.5" fill="#3b82f6" />
              <circle cx="19" cy="0" r="1.5" fill="#10b981" />
            </g>
          )}

          {/* Effort sweat drops if straining or pulling */}
          {(isPulling || isStraining) && (
            <g>
              <circle cx="32" cy="22" r="3" fill="#67e8f9" opacity="0.9" className="animate-ping" />
              <path d="M 28 25 Q 32 20 30 18" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Legs & Shoes - Braced pulling stance leaning left */}
          {/* Back leg (left) */}
          <path d="M 40 92 L 20 122 L 10 125" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
          {/* Front leg (right, planted hard) */}
          <path d="M 58 92 L 68 122 L 80 125" stroke="#1e3a8a" strokeWidth="14" strokeLinecap="round" />
          {/* Shoes */}
          <ellipse cx="14" cy="126" rx="10" ry="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
          <ellipse cx="76" cy="126" rx="11" ry="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />

          {/* Torso / Jersey (Blue #1) */}
          <path
            d="M 32 52 L 68 52 L 62 96 L 38 96 Z"
            fill="#2563eb"
            stroke="#1d4ed8"
            strokeWidth="3"
            rx="4"
          />
          {/* Jersey Stripes & Number */}
          <path d="M 40 52 L 40 96 M 60 52 L 60 96" stroke="#60a5fa" strokeWidth="2" opacity="0.5" />
          <text x="50" y="80" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="18" fontFamily="Fredoka">
            1
          </text>

          {/* Head & Face */}
          <circle cx="50" cy="35" r="20" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
          {/* Hair (Cool spiky hair) */}
          <path
            d="M 32 30 Q 50 10 68 28 Q 60 14 46 16 Q 36 20 32 30 Z"
            fill="#451a03"
          />
          {/* Athletic Headband (Blue) */}
          <rect x="31" y="24" width="38" height="7" rx="3" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1" />

          {/* Facial Expression */}
          {isWinning ? (
            /* Joyful laughing face */
            <g>
              <ellipse cx="43" cy="34" rx="2.5" ry="3.5" fill="#0f172a" />
              <ellipse cx="57" cy="34" rx="2.5" ry="3.5" fill="#0f172a" />
              <path d="M 43 42 Q 50 51 57 42" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
              <circle cx="37" cy="40" r="3" fill="#f87171" opacity="0.6" />
              <circle cx="63" cy="40" r="3" fill="#f87171" opacity="0.6" />
            </g>
          ) : isLosing ? (
            /* Shocked / strained face */
            <g>
              <circle cx="43" cy="34" r="3" fill="#0f172a" />
              <circle cx="57" cy="34" r="3" fill="#0f172a" />
              <ellipse cx="50" cy="44" rx="4" ry="5" fill="#0f172a" />
              <path d="M 40 28 L 47 31 M 60 31 L 53 28" stroke="#78350f" strokeWidth="2" />
            </g>
          ) : (
            /* Determined, focused grit face */
            <g>
              <ellipse cx="43" cy="34" rx="2.5" ry="2" fill="#0f172a" />
              <ellipse cx="57" cy="34" rx="2.5" ry="2" fill="#0f172a" />
              {/* Determined eyebrows */}
              <path d="M 39 28 L 47 31 M 61 28 L 53 31" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
              {/* Clenched teeth smile/grit */}
              <rect x="44" y="41" width="12" height="4" rx="2" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
            </g>
          )}

          {/* Arms holding the rope securely */}
          {/* Back arm */}
          <path d="M 40 56 L 65 74 L 88 80" stroke="#fbcfe8" strokeWidth="8" strokeLinecap="round" />
          {/* Front arm gripping rope */}
          <path d="M 58 56 L 82 72 L 102 78" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          {/* Hands with blue sports gloves */}
          <ellipse cx="94" cy="78" rx="6" ry="6" fill="#1e40af" stroke="#93c5fd" strokeWidth="1.5" />
          <ellipse cx="103" cy="79" rx="6" ry="6" fill="#1e40af" stroke="#93c5fd" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

// Vector SVG Athlete for Red Team
const RedTeamAthlete: React.FC<{
  isPulling: boolean;
  isStraining: boolean;
  isWinning: boolean;
  isLosing: boolean;
  teamName: string;
}> = ({ isPulling, isStraining, isWinning, isLosing, teamName }) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Team Nametag badge */}
      <div className="mb-1 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[11px] font-black tracking-wide border border-rose-400 shadow-md">
        {teamName}
      </div>

      {/* SVG Cartoon Athlete */}
      <svg
        width="110"
        height="145"
        viewBox="0 0 110 145"
        className={`transition-all duration-300 filter drop-shadow-xl ${
          isWinning ? 'animate-bounce' : isPulling ? 'rotate-6 scale-105' : isStraining ? '-rotate-3' : 'rotate-2'
        }`}
      >
        <g>
          {/* Winner Crown / Trophy */}
          {isWinning && (
            <g transform="translate(42, -5)">
              <polygon points="0,15 5,0 12,10 19,0 24,15" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="5" cy="0" r="1.5" fill="#ef4444" />
              <circle cx="12" cy="10" r="1.5" fill="#3b82f6" />
              <circle cx="19" cy="0" r="1.5" fill="#10b981" />
            </g>
          )}

          {/* Effort sweat drops if straining or pulling */}
          {(isPulling || isStraining) && (
            <g>
              <circle cx="78" cy="22" r="3" fill="#67e8f9" opacity="0.9" className="animate-ping" />
              <path d="M 82 25 Q 78 20 80 18" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Legs & Shoes - Braced pulling stance leaning right */}
          {/* Front leg (left, planted hard) */}
          <path d="M 52 92 L 42 122 L 30 125" stroke="#881337" strokeWidth="14" strokeLinecap="round" />
          {/* Back leg (right) */}
          <path d="M 70 92 L 90 122 L 100 125" stroke="#4c0519" strokeWidth="14" strokeLinecap="round" />
          {/* Shoes */}
          <ellipse cx="34" cy="126" rx="11" ry="6" fill="#e11d48" stroke="#9f1239" strokeWidth="2" />
          <ellipse cx="96" cy="126" rx="10" ry="6" fill="#e11d48" stroke="#9f1239" strokeWidth="2" />

          {/* Torso / Jersey (Red/Rose #2) */}
          <path
            d="M 42 52 L 78 52 L 72 96 L 48 96 Z"
            fill="#e11d48"
            stroke="#be123c"
            strokeWidth="3"
            rx="4"
          />
          {/* Jersey Stripes & Number */}
          <path d="M 50 52 L 50 96 M 70 52 L 70 96" stroke="#fda4af" strokeWidth="2" opacity="0.5" />
          <text x="60" y="80" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="18" fontFamily="Fredoka">
            2
          </text>

          {/* Head & Face */}
          <circle cx="60" cy="35" r="20" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
          {/* Hair (Ponytail or curly hair) */}
          <path
            d="M 42 28 Q 60 10 78 30 Q 72 14 56 16 Q 46 20 42 28 Z"
            fill="#292524"
          />
          {/* Ponytail tuft */}
          <ellipse cx="80" cy="24" rx="8" ry="6" fill="#292524" />
          {/* Athletic Headband (Red) */}
          <rect x="41" y="24" width="38" height="7" rx="3" fill="#be123c" stroke="#fecdd3" strokeWidth="1" />

          {/* Facial Expression */}
          {isWinning ? (
            /* Joyful laughing face */
            <g>
              <ellipse cx="53" cy="34" rx="2.5" ry="3.5" fill="#0f172a" />
              <ellipse cx="67" cy="34" rx="2.5" ry="3.5" fill="#0f172a" />
              <path d="M 53 42 Q 60 51 67 42" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
              <circle cx="47" cy="40" r="3" fill="#f87171" opacity="0.6" />
              <circle cx="73" cy="40" r="3" fill="#f87171" opacity="0.6" />
            </g>
          ) : isLosing ? (
            /* Shocked / strained face */
            <g>
              <circle cx="53" cy="34" r="3" fill="#0f172a" />
              <circle cx="67" cy="34" r="3" fill="#0f172a" />
              <ellipse cx="60" cy="44" rx="4" ry="5" fill="#0f172a" />
              <path d="M 50 31 L 43 28 M 70 28 L 63 31" stroke="#78350f" strokeWidth="2" />
            </g>
          ) : (
            /* Determined grit face pulling hard to the right */
            <g>
              <ellipse cx="53" cy="34" rx="2.5" ry="2" fill="#0f172a" />
              <ellipse cx="67" cy="34" rx="2.5" ry="2" fill="#0f172a" />
              {/* Determined eyebrows */}
              <path d="M 51 31 L 43 28 M 71 31 L 63 28" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" />
              {/* Clenched teeth smile/grit */}
              <rect x="54" y="41" width="12" height="4" rx="2" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
            </g>
          )}

          {/* Arms gripping the rope to pull right */}
          {/* Back arm */}
          <path d="M 70 56 L 45 74 L 22 80" stroke="#fbcfe8" strokeWidth="8" strokeLinecap="round" />
          {/* Front arm */}
          <path d="M 52 56 L 28 72 L 8 78" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" />
          {/* Hands with red sports gloves */}
          <ellipse cx="16" cy="78" rx="6" ry="6" fill="#9f1239" stroke="#fda4af" strokeWidth="1.5" />
          <ellipse cx="7" cy="79" rx="6" ry="6" fill="#9f1239" stroke="#fda4af" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
