import React from 'react';
import { RGB } from '../types';

interface RgbSlidersProps {
  lightRGB: RGB;
  onChange: (newRGB: RGB) => void;
}

export const RgbSliders: React.FC<RgbSlidersProps> = ({ lightRGB, onChange }) => {
  const handleSliderChange = (channel: 'r' | 'g' | 'b', value: number) => {
    onChange({
      ...lightRGB,
      [channel]: value,
    });
  };

  return (
    <div className="w-full flex flex-col space-y-3.5 select-none">
      {/* RED SLIDER */}
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="flex items-center space-x-1.5 text-red-400 font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
            <span>Red</span>
          </span>
          <span className="text-zinc-400 font-mono text-[11px]">{lightRGB.r}</span>
        </div>
        <input
          id="slider-red-beam"
          type="range"
          min="0"
          max="255"
          value={lightRGB.r}
          onChange={(e) => handleSliderChange('r', Number(e.target.value))}
          className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-red-500 border border-zinc-700/80"
          style={{
            background: `linear-gradient(to right, #27272a, #EF4444 ${
              (lightRGB.r / 255) * 100
            }%, #27272a ${(lightRGB.r / 255) * 100}%)`,
          }}
        />
      </div>

      {/* GREEN SLIDER */}
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="flex items-center space-x-1.5 text-green-400 font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E]" />
            <span>Green</span>
          </span>
          <span className="text-zinc-400 font-mono text-[11px]">{lightRGB.g}</span>
        </div>
        <input
          id="slider-green-beam"
          type="range"
          min="0"
          max="255"
          value={lightRGB.g}
          onChange={(e) => handleSliderChange('g', Number(e.target.value))}
          className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-green-500 border border-zinc-700/80"
          style={{
            background: `linear-gradient(to right, #27272a, #22C55E ${
              (lightRGB.g / 255) * 100
            }%, #27272a ${(lightRGB.g / 255) * 100}%)`,
          }}
        />
      </div>

      {/* BLUE SLIDER */}
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="flex items-center space-x-1.5 text-blue-400 font-semibold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
            <span>Blue</span>
          </span>
          <span className="text-zinc-400 font-mono text-[11px]">{lightRGB.b}</span>
        </div>
        <input
          id="slider-blue-beam"
          type="range"
          min="0"
          max="255"
          value={lightRGB.b}
          onChange={(e) => handleSliderChange('b', Number(e.target.value))}
          className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-zinc-700/80"
          style={{
            background: `linear-gradient(to right, #27272a, #3B82F6 ${
              (lightRGB.b / 255) * 100
            }%, #27272a ${(lightRGB.b / 255) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};
