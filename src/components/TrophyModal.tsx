import React, { useRef, useEffect } from 'react';
import { Download, Award, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrophyModalProps {
  userName: string;
  onClose: () => void;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({ userName, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Fire confetti bursts on opening
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  // Draw trophy on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background: Deep dark slate with radial glow
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.5);
    bgGrad.addColorStop(0, '#131B2E');
    bgGrad.addColorStop(1, '#070A0F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, w - 52, h - 52);

    // Corner decorative accents
    const drawCorner = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(20, 0);
      ctx.lineTo(0, 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    drawCorner(28, 28, 0);
    drawCorner(w - 28, 28, Math.PI / 2);
    drawCorner(w - 28, h - 28, Math.PI);
    drawCorner(28, h - 28, (Math.PI * 3) / 2);

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 16px monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('OPTICS LABORATORY ACADEMY', w / 2, 60);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px "Lora", serif';
    ctx.fillText('Master of Color & Light', w / 2, 95);

    // Golden Stage Light Illustration in Center
    const lightY = 160;
    // Golden Light cone beam
    const coneGrad = ctx.createLinearGradient(w / 2, lightY, w / 2, lightY + 110);
    coneGrad.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
    coneGrad.addColorStop(0.8, 'rgba(253, 224, 71, 0.15)');
    coneGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 16, lightY + 10);
    ctx.lineTo(w / 2 + 16, lightY + 10);
    ctx.lineTo(w / 2 + 75, lightY + 110);
    ctx.lineTo(w / 2 - 75, lightY + 110);
    ctx.closePath();
    ctx.fill();

    // Golden Stage Fixture
    ctx.fillStyle = '#D97706';
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 2;
    // Housing
    ctx.beginPath();
    ctx.roundRect(w / 2 - 24, lightY - 26, 48, 30, 8);
    ctx.fill();
    ctx.stroke();

    // Barn doors
    ctx.fillStyle = '#B45309';
    ctx.fillRect(w / 2 - 34, lightY - 6, 12, 16);
    ctx.fillRect(w / 2 + 22, lightY - 6, 12, 16);

    // Golden Lens glowing
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.ellipse(w / 2, lightY + 4, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Recipient Section
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px monospace';
    ctx.fillText('THIS CERTIFIES THAT', w / 2, 290);

    // Student / User Name in elegant display font
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 30px "Lora", serif';
    ctx.fillText(userName || 'Distinguished Physicist', w / 2, 330);

    // Underline
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 120, 345);
    ctx.lineTo(w / 2 + 120, 345);
    ctx.stroke();

    // Citation text
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '13px "DM Sans", sans-serif';
    ctx.fillText(
      'has demonstrated impeccable mastery in additive light spectrums,',
      w / 2,
      375
    );
    ctx.fillText(
      'chromatic wavelength absorption, and illuminated flag optics.',
      w / 2,
      395
    );

    // Achievement Badge Stamp
    const stampY = 450;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, stampY, 32, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('OPTICAL EXCELLENCE', w / 2, stampY - 6);
    ctx.fillText('GRADE: S+', w / 2, stampY + 8);
    ctx.fillText('HARD MODE', w / 2, stampY + 20);

    // Date and Signature footer
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.fillStyle = '#64748B';
    ctx.font = '11px monospace';
    ctx.fillText(`VERIFIED: ${dateStr}`, w / 2, 515);
  }, [userName]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Optics_Lab_Trophy_${(userName || 'Physicist').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative bg-zinc-900 border border-amber-500/50 rounded-2xl shadow-2xl p-6 max-w-lg w-full flex flex-col items-center select-none animate-in fade-in zoom-in duration-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-amber-400 mb-2">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <h2 className="text-xl font-bold font-serif tracking-wide text-white">
            Congratulations!
          </h2>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <p className="text-sm text-zinc-300 text-center mb-4">
          You conquered Hard Mode with 3 fully correct illuminated flags! Here is your official
          downloadable Optics Lab certificate.
        </p>

        {/* Canvas preview */}
        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-2xl bg-black mb-5">
          <canvas ref={canvasRef} width={500} height={540} className="w-full max-w-[380px] h-auto block" />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex space-x-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Trophy (PNG)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
