import React from 'react';
import { RGB } from '../types';
import { rgbToString } from '../utils/colorPhysics';

interface StageLightProps {
  lightRGB: RGB;
  isFlickering?: boolean;
}

export const StageLight: React.FC<StageLightProps> = ({ lightRGB, isFlickering = false }) => {
  const lightColorStr = rgbToString(lightRGB);
  // Calculate brightness for glow intensity
  const brightness = (lightRGB.r * 0.299 + lightRGB.g * 0.587 + lightRGB.b * 0.114) / 255;
  const coneAlpha = Math.max(0.04, brightness * 0.38);
  const glowAlpha = Math.max(0.05, brightness * 0.5);

  return (
    <div className="relative w-full h-full pointer-events-none select-none flex flex-col items-center">
      {/* Top Ceiling Rig / Truss */}
      <div className="w-48 h-2 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 rounded-full shadow-md z-20" />
      <div className="w-1.5 h-6 bg-zinc-600 z-20" />

      {/* Cartoon Stage Spotlight Fixture with Barn Doors / Shutters */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Lamp housing */}
        <div className="relative w-28 h-18 bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-t-2xl rounded-b-lg border-2 border-zinc-700 shadow-xl flex items-center justify-center">
          {/* Heat vents / ribs */}
          <div className="absolute top-2 flex space-x-1.5">
            <div className="w-1 h-3 bg-zinc-900 rounded-full" />
            <div className="w-1 h-3 bg-zinc-900 rounded-full" />
            <div className="w-1 h-3 bg-zinc-900 rounded-full" />
            <div className="w-1 h-3 bg-zinc-900 rounded-full" />
          </div>

          {/* Pivot yoke brackets */}
          <div className="absolute -left-3.5 top-5 w-4 h-7 border-t-2 border-l-2 border-b-2 border-zinc-500 rounded-l-md" />
          <div className="absolute -right-3.5 top-5 w-4 h-7 border-t-2 border-r-2 border-b-2 border-zinc-500 rounded-r-md" />

          {/* Circular Lens with active emitter glow */}
          <div
            className="w-16 h-10 rounded-full border-2 border-zinc-600 flex items-center justify-center transition-colors duration-200"
            style={{
              backgroundColor: lightColorStr,
              boxShadow: `0 0 24px ${lightColorStr}, inset 0 0 12px #FFFFFF`,
              filter: isFlickering ? 'brightness(1.4)' : 'none',
            }}
          >
            <div className="w-8 h-4 rounded-full bg-white/70 blur-[1px]" />
          </div>
        </div>

        {/* Barn-door shutters pointing down */}
        <div className="relative w-36 h-6 flex justify-between items-start -mt-0.5">
          {/* Left Shutter */}
          <div
            className="w-10 h-7 bg-zinc-800 border border-zinc-600 origin-top-right transform -rotate-25 shadow-lg rounded-bl-sm"
            style={{ clipPath: 'polygon(0% 0%, 100% 15%, 85% 100%, 0% 85%)' }}
          />
          {/* Front Center Shutter Lip */}
          <div className="w-14 h-2 bg-zinc-900 border-b border-zinc-700 rounded-b-sm" />
          {/* Right Shutter */}
          <div
            className="w-10 h-7 bg-zinc-800 border border-zinc-600 origin-top-left transform rotate-25 shadow-lg rounded-br-sm"
            style={{ clipPath: 'polygon(0% 15%, 100% 0%, 100% 85%, 15% 100%)' }}
          />
        </div>
      </div>

      {/* Cone of Light Projecting Downward */}
      <div className="absolute top-26 w-full h-[calc(100%-80px)] flex justify-center pointer-events-none z-10 overflow-visible">
        {/* Glowing Trapeze/Cone */}
        <div
          className="w-full max-w-2xl h-full transition-all duration-200 ease-out"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${rgbToString(
              lightRGB,
              glowAlpha
            )} 0%, ${rgbToString(lightRGB, coneAlpha)} 60%, transparent 100%)`,
            clipPath: 'polygon(46% 0%, 54% 0%, 95% 90%, 5% 90%)',
            filter: 'blur(1px)',
          }}
        />

        {/* Ray Beam Streaks */}
        <div
          className="absolute inset-0 max-w-2xl mx-auto h-full opacity-60 pointer-events-none"
          style={{
            background: `conic-gradient(from 170deg at 50% 0%, transparent 0deg, ${rgbToString(
              lightRGB,
              0.15
            )} 10deg, transparent 20deg, ${rgbToString(lightRGB, 0.2)} 28deg, transparent 35deg)`,
            clipPath: 'polygon(47% 0%, 53% 0%, 92% 88%, 8% 88%)',
          }}
        />
      </div>

      {/* Stage Floor Oval Footprint */}
      <div className="absolute bottom-6 w-full flex justify-center items-center pointer-events-none z-10">
        {/* Outer illuminated stage oval */}
        <div
          id="stage-light-oval"
          className="w-[380px] sm:w-[480px] h-[130px] sm:h-[150px] rounded-[50%] transition-all duration-200 ease-out flex items-center justify-center"
          style={{
            backgroundColor: rgbToString(lightRGB, coneAlpha * 1.5),
            boxShadow: `0 0 50px 20px ${rgbToString(lightRGB, coneAlpha * 1.8)}, inset 0 0 40px ${rgbToString(
              lightRGB,
              coneAlpha * 1.2
            )}`,
            border: `1.5px solid ${rgbToString(lightRGB, Math.min(0.8, coneAlpha * 2.5))}`,
          }}
        >
          {/* Inner hot spot */}
          <div
            className="w-3/5 h-3/5 rounded-[50%] blur-md transition-all duration-200"
            style={{
              backgroundColor: rgbToString(lightRGB, coneAlpha * 1.2),
            }}
          />
        </div>
      </div>
    </div>
  );
};
