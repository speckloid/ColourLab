import React, { useState } from 'react';
import { AppMode } from './types';
import { LearningMode } from './components/LearningMode';
import { GameMode } from './components/GameMode';
import {
  Lightbulb,
  Gamepad2,
  BookOpen,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('menu');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* PERSISTENT TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand & Mode Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={() => setCurrentMode('menu')}
            className="flex items-center space-x-2 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white block">
                Color Lab
              </span>
            </div>
          </button>

          {/* Persistent Mode Navigation Pills */}
          <div className="hidden sm:flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setCurrentMode('menu')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentMode === 'menu'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Main Menu
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode('learning')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                currentMode === 'learning'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learning Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode('game')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                currentMode === 'game'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Mode</span>
            </button>
          </div>
        </div>

        {/* Right Header Utilities: Help Guide & Fullscreen */}
        <div className="flex items-center space-x-2">
          {/* Active Mode indicator on mobile */}
          <span className="sm:hidden text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
            {currentMode.toUpperCase()}
          </span>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center space-x-1 text-xs"
            title="Optical Principles & Help"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">Science Guide</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Classroom Projection Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 w-full p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center">
        {currentMode === 'menu' && (
          <div className="w-full max-w-4xl py-8 flex flex-col items-center text-center animate-in fade-in duration-300">
            {/* Stage Light Spotlight Effect over Menu Title */}
            <div className="relative mb-8">
              <div className="w-56 h-14 bg-blue-500/20 blur-3xl rounded-full absolute -top-4 inset-x-0 mx-auto" />
              <h1 className="text-4xl sm:text-6xl font-bold font-serif tracking-tight text-white leading-tight">
                Color Lab
              </h1>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-xl">
              {/* Card 1: Learning Mode */}
              <div
                role="button"
                tabIndex={0}
                id="btn-select-learning-mode"
                onClick={() => setCurrentMode('learning')}
                className="group relative bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/60 rounded-2xl p-6 text-left shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    Learning Mode
                  </h2>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-blue-400 space-x-1">
                  <span>Enter Laboratory</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Game Mode */}
              <div
                role="button"
                tabIndex={0}
                id="btn-select-game-mode"
                onClick={() => setCurrentMode('game')}
                className="group relative bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-indigo-500/60 rounded-2xl p-6 text-left shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    Game Mode
                  </h2>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-indigo-400 space-x-1">
                  <span>Start Challenge</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentMode === 'learning' && <LearningMode />}
        {currentMode === 'game' && <GameMode />}
      </main>

      {/* CLASSROOM FOOTER */}
      <footer className="w-full bg-zinc-950/60 border-t border-white/5 py-2.5 px-4 text-center text-[11px] text-zinc-500 font-mono flex flex-wrap justify-between items-center max-w-7xl mx-auto">
        <span>Optics & Spectral Reflection Physics Model</span>
        <div className="flex space-x-4">
          <span>Additive: R+G=Yellow • R+B=Magenta • G+B=Cyan</span>
          <span>ROYGBIV Spectral Distribution</span>
        </div>
      </footer>

      {/* SCIENCE PRINCIPLES & HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl text-left select-none animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-cyan-400 mb-3">
              <Info className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white font-serif">
                Optics & Color Principles
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-white text-sm mb-1 text-blue-400">
                  1. Additive Light Mixing (Stage Light & Venn Diagram)
                </h4>
                <p>
                  Light adds wavelengths together. Red + Green light forms <strong>Yellow</strong>.
                  Red + Blue light forms <strong>Magenta</strong>. Green + Blue light forms{' '}
                  <strong>Cyan</strong>. When all three are at 100%, they combine to make{' '}
                  <strong>White</strong> light.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1 text-emerald-400">
                  2. Object Color Reflection & Absorption
                </h4>
                <p>
                  Pigments and physical objects do not generate light—they <em>reflect</em> certain
                  wavelengths and <em>absorb</em> the rest:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-zinc-400">
                  <li>
                    A <strong>White T-Shirt</strong> reflects all colors: in magenta light it looks
                    magenta!
                  </li>
                  <li>
                    A <strong>Red Apple</strong> only reflects Red: in green or blue light, with no
                    red to reflect, it appears <strong>Black</strong>.
                  </li>
                  <li>
                    A <strong>Yellow Banana</strong> reflects Red and Green: in Red light it looks
                    Red, in Green light it looks Green, and in Blue light it looks Black!
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1 text-purple-400">
                  3. Spectrum Analyzer & Target Sensor
                </h4>
                <p>
                  Drag the crosshair sensor over the light beam or an illuminated stage object. The
                  data logger graphs intensity across the <strong>ROYGBIV</strong> rainbow
                  spectrum:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-zinc-400">
                  <li>
                    <strong>Direct Light:</strong> Measures the emitted photon curve of the stage
                    beam.
                  </li>
                  <li>
                    <strong>Over Object:</strong> Multiplies the light by the object's reflectance.
                  </li>
                  <li>
                    <strong>In Dark Room:</strong> The curve drops to a zero flatline.
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
