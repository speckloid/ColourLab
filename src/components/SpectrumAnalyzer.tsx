import React, { useMemo } from 'react';
import { RGB } from '../types';
import { generateSpectrumCurve, ROYGBIV_BANDS } from '../utils/colorPhysics';

interface SpectrumAnalyzerProps {
  lightRGB: RGB;
  targetPos: { x: number; y: number };
  isTargetInLight: boolean;
  targetedObjectName: string | null;
  targetedObjectReflectance: [number, number, number] | null;
}

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  lightRGB,
  isTargetInLight,
  targetedObjectReflectance,
}) => {
  // Generate curve data points based on measured light and object reflectance
  const points = useMemo(() => {
    return generateSpectrumCurve(lightRGB, targetedObjectReflectance, isTargetInLight);
  }, [lightRGB, targetedObjectReflectance, isTargetInLight]);

  // Square-proportioned dimensions
  const width = 200;
  const height = 150;
  const padLeft = 26;
  const padRight = 10;
  const padTop = 14;
  const padBottom = 24;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Build SVG curve path
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    const coords = points.map((pt) => {
      const x = padLeft + (pt.xPercent / 100) * chartW;
      const y = padTop + chartH - pt.intensity * chartH;
      return { x, y };
    });

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      d += ` L ${coords[i].x} ${coords[i].y}`;
    }
    return d;
  }, [points, chartW, chartH, padLeft, padTop]);

  // Area polygon below the curve
  const areaD = useMemo(() => {
    if (!pathD) return '';
    const firstX = padLeft;
    const lastX = padLeft + chartW;
    const baseY = padTop + chartH;
    return `${pathD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }, [pathD, chartW, chartH, padLeft, padTop]);

  return (
    <div className="flex flex-col select-none">
      {/* Square-proportioned Spectrometer Housing */}
      <div className="relative w-52 sm:w-56 bg-zinc-900/95 rounded-xl border border-zinc-700/80 shadow-2xl p-2 flex flex-col backdrop-blur-md">
        {/* CRT / LCD Screen */}
        <div className="relative w-full bg-[#050B14] rounded-lg border border-cyan-950/80 p-1 shadow-inner overflow-hidden">
          {/* Oscilloscope background grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="roygbiv-rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                <stop offset="16%" stopColor="#F97316" stopOpacity="0.85" />
                <stop offset="32%" stopColor="#EAB308" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#22C55E" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#3B82F6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#9333EA" stopOpacity="0.85" />
              </linearGradient>

              <filter id="curve-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Y-Axis Line */}
            <line
              x1={padLeft}
              y1={padTop}
              x2={padLeft}
              y2={padTop + chartH}
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* 100% tick */}
            <line
              x1={padLeft - 2}
              y1={padTop}
              x2={padLeft + chartW}
              y2={padTop}
              stroke="#1E293B"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            {/* 50% tick */}
            <line
              x1={padLeft - 2}
              y1={padTop + chartH / 2}
              x2={padLeft + chartW}
              y2={padTop + chartH / 2}
              stroke="#1E293B"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            {/* Baseline X-Axis */}
            <line
              x1={padLeft}
              y1={padTop + chartH}
              x2={padLeft + chartW}
              y2={padTop + chartH}
              stroke="#475569"
              strokeWidth="1.2"
            />

            {/* Y-Axis tick labels */}
            <text
              x={padLeft - 4}
              y={padTop + 3}
              fill="#94A3B8"
              fontSize="7"
              fontFamily="monospace"
              textAnchor="end"
            >
              100%
            </text>
            <text
              x={padLeft - 4}
              y={padTop + chartH / 2 + 2}
              fill="#64748B"
              fontSize="7"
              fontFamily="monospace"
              textAnchor="end"
            >
              50%
            </text>
            <text
              x={padLeft - 4}
              y={padTop + chartH + 2}
              fill="#94A3B8"
              fontSize="7"
              fontFamily="monospace"
              textAnchor="end"
            >
              0%
            </text>

            {/* Shaded area below curve with rainbow gradient */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#roygbiv-rainbow-grad)"
                className="transition-all duration-100 ease-out"
              />
            )}

            {/* Continuous Smooth Spectral Curve */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#curve-glow)"
                className="transition-all duration-100 ease-out"
              />
            )}

            {/* ROYGBIV Letters and color indicators on X-Axis */}
            {ROYGBIV_BANDS.map((band, idx) => {
              const xPos = padLeft + (idx / (ROYGBIV_BANDS.length - 1)) * chartW;
              return (
                <g key={band.letter} transform={`translate(${xPos}, ${padTop + chartH})`}>
                  <line x1="0" y1="0" x2="0" y2="2" stroke="#64748B" strokeWidth="1" />
                  <circle cx="0" cy="5" r="2" fill={band.baseHueHex} />
                  <text
                    x="0"
                    y="15"
                    fill="#E2E8F0"
                    fontSize="8"
                    fontWeight="700"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {band.letter}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
