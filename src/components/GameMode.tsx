import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StandardColor, COLOR_CYCLE, RGB } from '../types';
import {
  STANDARD_COLORS,
  calculateReflectedStandardColor,
  COLOR_HEX,
  rgbToString,
} from '../utils/colorPhysics';
import { EASY_FLAGS, HARD_FLAGS, GameFlag } from '../data/flags';
import { StageLight } from './StageLight';
import { TrophyModal } from './TrophyModal';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const LIGHT_COLORS: StandardColor[] = [
  'red',
  'green',
  'blue',
  'cyan',
  'magenta',
  'yellow',
  'white',
];

export const GameMode: React.FC = () => {
  // Game Progression
  const [tier, setTier] = useState<'easy' | 'hard'>('easy');
  const [easyScore, setEasyScore] = useState<number>(0);
  const [hardScore, setHardScore] = useState<number>(0);
  const [hardUnlocked, setHardUnlocked] = useState<boolean>(false);

  // Round State
  const [currentFlag, setCurrentFlag] = useState<GameFlag>(EASY_FLAGS[0]);
  const [stageLightColor, setStageLightColor] = useState<StandardColor>('white');
  const [isLightCycling, setIsLightCycling] = useState<boolean>(false);

  // User Guesses: mapping of baseColor -> guessedColor
  const [userGuesses, setUserGuesses] = useState<Record<StandardColor, StandardColor>>({} as any);

  // Validation & Animation State
  // 'guessing' | 'revealing' | 'result'
  const [roundPhase, setRoundPhase] = useState<'guessing' | 'revealing' | 'result'>('guessing');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string>('');

  // Victory & Trophy
  const [showTrophyModal, setShowTrophyModal] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(false);

  // Pick a flag avoiding immediate repetition
  const pickNewFlag = useCallback(
    (currentTier: 'easy' | 'hard', excludeId?: string): GameFlag => {
      const pool = currentTier === 'easy' ? EASY_FLAGS : HARD_FLAGS;
      const candidates = pool.filter((f) => f.id !== excludeId);
      const chosen = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
      return chosen;
    },
    []
  );

  // Initialize a new round
  const startNewRound = useCallback(
    (nextTier?: 'easy' | 'hard') => {
      const activeTier = nextTier || tier;
      const newFlag = pickNewFlag(activeTier, currentFlag?.id);
      setCurrentFlag(newFlag);
      setRoundPhase('guessing');
      setIsCorrect(null);
      setExplanation('');

      // Initialize user guesses to start as identical to the original white-light colors
      const initialGuesses = {} as Record<StandardColor, StandardColor>;
      COLOR_CYCLE.forEach((c) => {
        initialGuesses[c] = c;
      });
      setUserGuesses(initialGuesses);

      // Smooth light color cycling animation
      setIsLightCycling(true);
      let cycleCount = 0;
      const totalCycles = 9;
      // Choose target light color randomly
      const targetColor = LIGHT_COLORS[Math.floor(Math.random() * LIGHT_COLORS.length)];

      const interval = setInterval(() => {
        cycleCount++;
        const tempColor = LIGHT_COLORS[cycleCount % LIGHT_COLORS.length];
        setStageLightColor(tempColor);

        if (cycleCount >= totalCycles) {
          clearInterval(interval);
          setStageLightColor(targetColor);
          setIsLightCycling(false);
        }
      }, 140);
    },
    [tier, currentFlag, pickNewFlag]
  );

  // Initial load
  useEffect(() => {
    startNewRound('easy');
  }, []);

  // Cycle the color of a segment
  // Sequence: [Red → Green → Blue → Cyan → Magenta → Yellow → White → Black]
  const handleToggleColor = (baseColor: StandardColor) => {
    if (roundPhase !== 'guessing' || isLightCycling) return;

    const currentColor = userGuesses[baseColor] || baseColor;
    const currentIndex = COLOR_CYCLE.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % COLOR_CYCLE.length;
    const nextColor = COLOR_CYCLE[nextIndex];

    setUserGuesses((prev) => ({
      ...prev,
      [baseColor]: nextColor,
    }));
  };

  // True optical reflection color mapping
  const trueReflectionMap = useMemo(() => {
    const map = {} as Record<StandardColor, StandardColor>;
    COLOR_CYCLE.forEach((base) => {
      map[base] = calculateReflectedStandardColor(base, stageLightColor);
    });
    return map;
  }, [stageLightColor]);

  // Handle guess confirmation
  const handleConfirmGuess = () => {
    if (roundPhase !== 'guessing' || isLightCycling) return;

    setRoundPhase('revealing');

    // Check if every unique color in this flag matches the true optical reflection
    let allMatch = true;
    const explanations: string[] = [];

    currentFlag.uniqueBaseColors.forEach((baseCol) => {
      const userGuessed = userGuesses[baseCol] || baseCol;
      const trueReflected = trueReflectionMap[baseCol];

      if (userGuessed !== trueReflected) {
        allMatch = false;
        explanations.push(
          `${baseCol.toUpperCase()} reflects ${trueReflected.toUpperCase()} under ${stageLightColor.toUpperCase()} light (you picked ${userGuessed.toUpperCase()})`
        );
      } else {
        explanations.push(
          `${baseCol.toUpperCase()} correctly appears ${trueReflected.toUpperCase()}`
        );
      }
    });

    // After revealing animation delay:
    setTimeout(() => {
      setIsCorrect(allMatch);
      setExplanation(explanations.join(' • '));
      setRoundPhase('result');

      if (allMatch) {
        // Confetti burst
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });

        if (tier === 'easy') {
          const newScore = easyScore + 1;
          setEasyScore(newScore);
          if (newScore >= 3 && !hardUnlocked) {
            setHardUnlocked(true);
          }
        } else {
          const newScore = hardScore + 1;
          setHardScore(newScore);
          if (newScore >= 3) {
            setShowNamePrompt(true);
          }
        }
      }
    }, 900);
  };

  // Convert light color name to RGB
  const activeLightRGB: RGB = STANDARD_COLORS[stageLightColor] || { r: 255, g: 255, b: 255 };

  const currentScore = tier === 'easy' ? easyScore : hardScore;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center select-none">
      {/* Top Game Bar: Tier Selector, Score, Instructions */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 mb-3 shadow-xl">
        {/* Tier Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-400 uppercase">Tier:</span>
          <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                if (tier !== 'easy') {
                  setTier('easy');
                  startNewRound('easy');
                }
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                tier === 'easy'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Easy (Primary Flags)
            </button>
            <button
              type="button"
              onClick={() => {
                if (!hardUnlocked) return;
                if (tier !== 'hard') {
                  setTier('hard');
                  startNewRound('hard');
                }
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                tier === 'hard'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : hardUnlocked
                  ? 'text-zinc-300 hover:text-white'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>Hard (Secondary Colors)</span>
              {!hardUnlocked && (
                <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded">
                  Locked (Need 3)
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Score Progress (3 Needed to pass) */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono text-zinc-400">Correct Flags:</span>
            <div className="flex space-x-1.5">
              {[1, 2, 3].map((step) => {
                const filled = currentScore >= step;
                return (
                  <div
                    key={step}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      filled
                        ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_8px_#10B981]'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
          </div>

          {tier === 'hard' && hardScore >= 3 && (
            <button
              type="button"
              onClick={() => setShowTrophyModal(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center space-x-1 shadow-md cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Trophy</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Game Stage Area */}
      <div className="relative w-full h-[520px] sm:h-[560px] bg-[#0A0A0C] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
        {/* Background dark grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top Center: Stage Light pointing down */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <StageLight lightRGB={activeLightRGB} isFlickering={isLightCycling} />
        </div>

        {/* Stage Light Color Announcement Banner */}
        <div className="relative z-20 w-full flex justify-center pointer-events-none mt-2">
          <div className="bg-zinc-900/90 border border-white/15 px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center space-x-2">
            <span className="text-xs font-mono text-zinc-400">ACTIVE STAGE LIGHT:</span>
            <span
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center space-x-1.5 shadow-sm"
              style={{
                backgroundColor: COLOR_HEX[stageLightColor],
                color: ['yellow', 'cyan', 'white'].includes(stageLightColor) ? '#000' : '#FFF',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-80" />
              <span>{isLightCycling ? 'Cycling...' : stageLightColor}</span>
            </span>
          </div>
        </div>

        {/* CENTER INTERACTIVE SPLIT: Left Reference Box | Center Stage Reveal | Right Guessing Box */}
        <div className="relative z-20 w-full flex-1 flex items-center justify-between px-2 sm:px-6 my-2">
          {/* LEFT PANEL: Reference Flag in Pure White Light */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>White Light Reference</span>
            </div>
            {/* White box container */}
            <div className="w-44 sm:w-56 h-32 sm:h-40 bg-white rounded-2xl p-2.5 shadow-2xl border-2 border-zinc-300 flex flex-col items-center justify-center">
              <div className="w-full h-full rounded-lg overflow-hidden shadow-sm border border-zinc-200 flex items-center justify-center">
                {currentFlag.render({
                  red: 'red',
                  green: 'green',
                  blue: 'blue',
                  cyan: 'cyan',
                  magenta: 'magenta',
                  yellow: 'yellow',
                  white: 'white',
                  black: 'black',
                })}
              </div>
            </div>
            <span className="text-xs font-semibold text-zinc-200">
              {currentFlag.country}
            </span>
          </div>

          {/* CENTER STAGE: Duplicate Moves onto Stage under Light on Confirm */}
          <div className="flex flex-col items-center justify-center flex-1 mx-2">
            {roundPhase !== 'guessing' ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <span className="text-[10px] font-mono uppercase text-cyan-300 tracking-wider mb-1">
                  True Illuminated Reflection
                </span>
                <div className="w-40 sm:w-52 h-28 sm:h-36 rounded-xl overflow-hidden shadow-[0_0_35px_rgba(255,255,255,0.2)] border-2 border-white/40">
                  {currentFlag.render(trueReflectionMap)}
                </div>
                <span className="text-[11px] font-mono text-zinc-300 mt-1.5">
                  Under {stageLightColor.toUpperCase()} Light
                </span>
              </div>
            ) : (
              <div className="text-center text-zinc-500 text-xs font-mono py-8 px-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
                <span>[ Guess will animate here onto center stage ]</span>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Interactive User Guessing Workspace */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Your Illuminated Guess</span>
            </div>

            {/* Interactive Flag Box */}
            <div
              id="guess-flag-container"
              role="button"
              tabIndex={0}
              onClick={() => {
                // Clicking flag toggles the primary color
                if (currentFlag.uniqueBaseColors.length > 0) {
                  handleToggleColor(currentFlag.uniqueBaseColors[0]);
                }
              }}
              className="w-44 sm:w-56 h-32 sm:h-40 bg-zinc-950 rounded-2xl p-2.5 shadow-2xl border-2 border-cyan-500/50 hover:border-cyan-400 flex flex-col items-center justify-center cursor-pointer transition-all group"
              title="Click parts of the flag or use color toggles below to guess illuminated reflection"
            >
              <div className="w-full h-full rounded-lg overflow-hidden shadow-inner border border-zinc-700 flex items-center justify-center">
                {currentFlag.render(userGuesses)}
              </div>
            </div>

            {/* Color cycling control pills for each original color in this flag */}
            <div className="flex flex-col items-center space-y-1 w-full">
              <span className="text-[10px] text-zinc-400 font-mono">
                Click color to toggle:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-[240px]">
                {currentFlag.uniqueBaseColors.map((base) => {
                  const currentGuess = userGuesses[base] || base;
                  return (
                    <button
                      key={base}
                      id={`toggle-color-${base}`}
                      type="button"
                      onClick={() => handleToggleColor(base)}
                      className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 flex items-center space-x-1.5 text-[11px] font-mono transition-all cursor-pointer shadow-sm"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
                        style={{ backgroundColor: COLOR_HEX[base] }}
                      />
                      <span className="text-zinc-400 capitalize">{base}:</span>
                      <span
                        className="font-bold capitalize px-1 rounded"
                        style={{
                          color: COLOR_HEX[currentGuess],
                          backgroundColor:
                            currentGuess === 'black' ? '#27272A' : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        {currentGuess}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION DOCK & FEEDBACK */}
        <div className="relative z-20 w-full flex flex-col items-center pt-2 border-t border-zinc-800">
          {roundPhase === 'guessing' ? (
            <div className="flex items-center space-x-3">
              <button
                id="btn-confirm-guess"
                type="button"
                disabled={isLightCycling}
                onClick={handleConfirmGuess}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Confirm Decision</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => startNewRound()}
                className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Skip Flag
              </button>
            </div>
          ) : roundPhase === 'revealing' ? (
            <div className="py-2 text-sm font-mono text-cyan-300 animate-pulse flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Placing flag under stage light beam...</span>
            </div>
          ) : (
            /* Result Banner */
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-700 p-3 rounded-xl">
              <div className="flex items-center space-x-2.5">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCorrect ? 'Correct Reflection!' : 'Incorrect Guess'}
                  </h4>
                  <p className="text-xs text-zinc-300 font-mono mt-0.5 leading-relaxed max-w-2xl">
                    {explanation}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-next-flag"
                  type="button"
                  onClick={() => startNewRound()}
                  className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Next Flag</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Name prompt modal when completing Hard Mode */}
      {showNamePrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif mb-1">
              Hard Tier Mastered!
            </h3>
            <p className="text-xs text-zinc-300 mb-4">
              You correctly deduced 3 illuminated secondary-color flags! Enter your name to generate
              your certified Optics Laboratory Trophy.
            </p>
            <input
              type="text"
              placeholder="Your Name (e.g., Dr. Jane Doe)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 mb-4 text-center font-medium"
            />
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowNamePrompt(false);
                  setShowTrophyModal(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-md cursor-pointer"
              >
                Claim Trophy
              </button>
              <button
                type="button"
                onClick={() => setShowNamePrompt(false)}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downloadable Trophy Modal */}
      {showTrophyModal && (
        <TrophyModal
          userName={userName || 'Optics Student'}
          onClose={() => setShowTrophyModal(false)}
        />
      )}
    </div>
  );
};
