import React, { useRef, useEffect } from 'react';
import { RGB } from '../types';

interface VennDiagramProps {
  lightRGB: RGB;
  showLabels?: boolean;
}

export const VennDiagram: React.FC<VennDiagramProps> = ({ lightRGB, showLabels = true }) => {
  const { r, g, b } = lightRGB;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use higher internal resolution for crisp retina display
    const size = 220;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, size, size);

    // Geometry of the 3 circles
    const radius = 52;
    const circleR = { x: size / 2, y: 76, color: `rgb(${r}, 0, 0)`, active: r > 0, stroke: '#EF4444' };
    const circleG = { x: size / 2 - 32, y: 136, color: `rgb(0, ${g}, 0)`, active: g > 0, stroke: '#22C55E' };
    const circleB = { x: size / 2 + 32, y: 136, color: `rgb(0, 0, ${b})`, active: b > 0, stroke: '#3B82F6' };

    // 1. ADDITIVE COLOR MIXING: 'lighter' composite mode adds RGB channels directly (clamping at 255)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Draw Red circle
    if (r > 0) {
      ctx.fillStyle = circleR.color;
      ctx.beginPath();
      ctx.arc(circleR.x, circleR.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Green circle
    if (g > 0) {
      ctx.fillStyle = circleG.color;
      ctx.beginPath();
      ctx.arc(circleG.x, circleG.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Blue circle
    if (b > 0) {
      ctx.fillStyle = circleB.color;
      ctx.beginPath();
      ctx.arc(circleB.x, circleB.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. OVERLAY CRISP VECTOR OUTLINES & LABELS
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    const drawRing = (circle: typeof circleR) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      if (!circle.active) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = circle.stroke;
      }
      ctx.stroke();
    };

    drawRing(circleR);
    drawRing(circleG);
    drawRing(circleB);

    if (showLabels) {
      ctx.font = 'bold 12px "Manjari", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // R label
      ctx.fillStyle = r > 0 ? '#FCA5A5' : '#64748B';
      ctx.fillText('R', circleR.x, circleR.y - radius + 14);

      // G label
      ctx.fillStyle = g > 0 ? '#86EFAC' : '#64748B';
      ctx.fillText('G', circleG.x - radius + 22, circleG.y + 16);

      // B label
      ctx.fillStyle = b > 0 ? '#93C5FD' : '#64748B';
      ctx.fillText('B', circleB.x + radius - 22, circleB.y + 16);
    }
    ctx.restore();
  }, [r, g, b, showLabels]);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 bg-zinc-950/90 rounded-2xl p-1 border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
        {/* Dark stage backing with subtle grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* HTML5 Canvas with native additive lighter blend mode */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block relative z-10"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};
