import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RGB } from '../types';
import { STAGE_OBJECTS, StageObject } from '../data/stageObjects';
import { StageLight } from './StageLight';
import { VennDiagram } from './VennDiagram';
import { RgbSliders } from './RgbSliders';
import { SpectrumAnalyzer } from './SpectrumAnalyzer';
import { Toolbox } from './Toolbox';
import { Target, RotateCcw, HelpCircle, Info } from 'lucide-react';

export const LearningMode: React.FC = () => {
  // 1. Light Color State (Starts at full white: 255, 255, 255)
  const [lightRGB, setLightRGB] = useState<RGB>({ r: 255, g: 255, b: 255 });

  // 2. Active Object on Stage (null or StageObject)
  const [activeStageObject, setActiveStageObject] = useState<StageObject | null>(null);

  // 3. Sensor Target Position (relative to container in % or px)
  // Default position: Right side inside the light cone
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 560, y: 280 });
  const [isDraggingTarget, setIsDraggingTarget] = useState<boolean>(false);

  // 4. Object Drag State
  const [draggedObject, setDraggedObject] = useState<StageObject | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingObject, setIsDraggingObject] = useState<boolean>(false);

  // Refs for geometry
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);

  // Responsive target positioning initialization
  useEffect(() => {
    if (stageContainerRef.current) {
      const rect = stageContainerRef.current.getBoundingClientRect();
      // Default target inside right side of the light cone
      setTargetPos({
        x: Math.round(rect.width * 0.58),
        y: Math.round(rect.height * 0.54),
      });
    }
  }, []);

  // Check if a point (x, y) relative to stageContainer is inside the light cone or oval
  const checkInsideLightCone = useCallback((x: number, y: number): boolean => {
    if (!stageContainerRef.current) return false;
    const rect = stageContainerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const lampY = 60;
    const stageBottomY = rect.height - 70;

    // Inside the cone polygon roughly:
    if (y < lampY || y > stageBottomY + 70) return false;
    const progress = (y - lampY) / (stageBottomY - lampY); // 0 at lamp, 1 at stage floor
    const halfWidthAtY = 30 + progress * (rect.width * 0.28); // cone spread
    return Math.abs(x - centerX) <= halfWidthAtY;
  }, []);

  // Check if a point is near the center stage object, and compute sub-region reflectance
  const checkOverStageObject = useCallback(
    (x: number, y: number): { onObject: boolean; reflectance: [number, number, number] | null } => {
      if (!activeStageObject || !stageContainerRef.current) return { onObject: false, reflectance: null };
      const rect = stageContainerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const stageFloorY = rect.height - 110;

      // Object bounds approx 100x100 box around center
      const dx = x - centerX;
      const dy = y - stageFloorY;
      if (Math.abs(dx) > 55 || Math.abs(dy) > 60) {
        return { onObject: false, reflectance: null };
      }

      // Normalized coordinates: normX (0 to 1), normY (0 to 1)
      const normX = Math.max(0, Math.min(1, (dx + 50) / 100));
      const normY = Math.max(0, Math.min(1, (dy + 50) / 100));

      if (activeStageObject.getReflectanceAt) {
        const customRefl = activeStageObject.getReflectanceAt(normX, normY);
        return { onObject: true, reflectance: customRefl };
      }

      return { onObject: true, reflectance: activeStageObject.overallReflectance };
    },
    [activeStageObject]
  );

  // Determine what the sensor target is currently measuring
  const stageObjectMeasurement = checkOverStageObject(targetPos.x, targetPos.y);
  const isTargetInLight = checkInsideLightCone(targetPos.x, targetPos.y);
  const isTargetOnObject = stageObjectMeasurement.onObject;

  const targetedObjectName = isTargetOnObject && activeStageObject ? activeStageObject.name : null;
  const targetedObjectReflectance = isTargetOnObject ? stageObjectMeasurement.reflectance : null;

  // Handle Target Sensor Dragging
  const handleTargetMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingTarget(true);
  };

  // Object Dragging Start from Toolbox
  const handleStartObjectDrag = (obj: StageObject, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (stageContainerRef.current) {
      const rect = stageContainerRef.current.getBoundingClientRect();
      setDragPos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
    setDraggedObject(obj);
    setIsDraggingObject(true);
  };

  // Global pointer move and up handlers
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!stageContainerRef.current) return;
      const rect = stageContainerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      if (isDraggingTarget) {
        // Clamp inside stage container
        const clampedX = Math.max(20, Math.min(rect.width - 20, relX));
        const clampedY = Math.max(30, Math.min(rect.height - 40, relY));
        setTargetPos({ x: clampedX, y: clampedY });
      }

      if (isDraggingObject) {
        setDragPos({ x: relX, y: relY });
      }
    };

    const handlePointerUp = () => {
      if (isDraggingTarget) {
        setIsDraggingTarget(false);
      }

      if (isDraggingObject && draggedObject) {
        // Pseudo-gravity stage snap:
        // If dropped inside light cone or near stage oval:
        const inLight = checkInsideLightCone(dragPos.x, dragPos.y);
        const nearStage = dragPos.y > 100 && dragPos.y < (stageContainerRef.current?.clientHeight || 500) + 40;

        if (inLight && nearStage) {
          // Bumps existing object back to toolbox and sets new one to center-stage
          setActiveStageObject(draggedObject);
        }
        // If not dropped over light, snaps back to box automatically
        setIsDraggingObject(false);
        setDraggedObject(null);
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDraggingTarget, isDraggingObject, draggedObject, dragPos, checkInsideLightCone]);

  // Object direct selection (e.g. click from toolbox)
  const handleSelectObject = (obj: StageObject) => {
    setActiveStageObject(obj);
  };

  // Wire curve calculation from Monitor (top-right) to Sensor Target
  const wireD = useCallback(() => {
    if (!stageContainerRef.current) return '';
    const rect = stageContainerRef.current.getBoundingClientRect();
    // Origin at the bottom-left edge of the compact monitor box
    const startX = rect.width - 120;
    const startY = 160;
    const endX = targetPos.x;
    const endY = targetPos.y;

    // Bezier control points for a realistic sagging / flexible black data cable
    const dx = endX - startX;
    const dy = endY - startY;
    const sag = Math.max(40, Math.abs(dx) * 0.35 + 30);
    const cp1X = startX + dx * 0.25;
    const cp1Y = startY + dy * 0.5 + sag;
    const cp2X = startX + dx * 0.75;
    const cp2Y = startY + dy * 0.75 + sag * 0.6;

    return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  }, [targetPos]);

  // Dragged object status: is currently over light?
  const isDraggedInLight = checkInsideLightCone(dragPos.x, dragPos.y);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Upper Interactive Stage Canvas */}
      <div
        ref={stageContainerRef}
        id="learning-stage-canvas"
        className="relative w-full max-w-7xl h-[560px] sm:h-[600px] md:h-[640px] bg-[#0A0A0C] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between"
      >
        {/* Background dark grid lines for scientific reference */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Central Stage Light Fixture and Projected Beam */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <StageLight lightRGB={lightRGB} />
        </div>

        {/* TOP INTERACTIVE PANELS: Venn Diagram + Sliders on Left, Spectrum Monitor on Right */}
        <div className="relative z-20 w-full p-4 sm:p-5 flex justify-between items-start pointer-events-none">
          {/* TOP LEFT: RGB Venn Diagram & Sliders Container */}
          <div className="pointer-events-auto flex flex-col space-y-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl shadow-xl w-60 sm:w-68">
            <VennDiagram lightRGB={lightRGB} />
            <div className="border-t border-white/10 pt-2.5">
              <RgbSliders lightRGB={lightRGB} onChange={setLightRGB} />
            </div>
          </div>

          {/* TOP RIGHT: Spectrum Analyzer Monitor */}
          <div ref={monitorRef} className="pointer-events-auto flex flex-col items-end">
            <SpectrumAnalyzer
              lightRGB={lightRGB}
              targetPos={targetPos}
              isTargetInLight={isTargetInLight}
              targetedObjectName={targetedObjectName}
              targetedObjectReflectance={targetedObjectReflectance}
            />
          </div>
        </div>

        {/* SVG LAYER FOR SENSOR CABLE WIRE */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
          <defs>
            <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Black flexible rubber cable */}
          <path
            d={wireD()}
            fill="none"
            stroke="#18181B"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#wire-shadow)"
          />
          <path
            d={wireD()}
            fill="none"
            stroke="#3F3F46"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* DRAGGABLE SENSOR TARGET SYMBOL */}
        <div
          id="spectrum-target-sensor"
          role="button"
          tabIndex={0}
          onMouseDown={handleTargetMouseDown}
          onTouchStart={handleTargetMouseDown}
          style={{
            left: `${targetPos.x}px`,
            top: `${targetPos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className={`absolute z-30 flex flex-col items-center cursor-grab active:cursor-grabbing transition-transform select-none ${
            isDraggingTarget ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          {/* Crosshair Optics Reticle */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Outer ring */}
            <div
              className={`w-11 h-11 rounded-full border-2 transition-all flex items-center justify-center ${
                isTargetInLight
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_#06B6D4]'
                  : 'border-zinc-500 bg-zinc-900/50'
              }`}
            >
              {/* Inner ring */}
              <div
                className={`w-5 h-5 rounded-full border border-dashed ${
                  isTargetInLight ? 'border-white' : 'border-zinc-400'
                }`}
              />
              {/* Center point */}
              <div
                className={`w-2 h-2 rounded-full ${
                  isTargetInLight ? 'bg-cyan-300 shadow-[0_0_8px_#67E8F9]' : 'bg-zinc-400'
                }`}
              />
            </div>

            {/* Crosshair ticks */}
            <div className="absolute top-0 w-0.5 h-2.5 bg-cyan-400" />
            <div className="absolute bottom-0 w-0.5 h-2.5 bg-cyan-400" />
            <div className="absolute left-0 h-0.5 w-2.5 bg-cyan-400" />
            <div className="absolute right-0 h-0.5 w-2.5 bg-cyan-400" />
          </div>

          {/* Sensor Tag */}
          <div className="mt-1 px-1.5 py-0.5 rounded bg-zinc-950/90 border border-cyan-500/60 text-[9px] font-mono font-bold text-cyan-300 tracking-wider shadow-md pointer-events-none">
            {isTargetOnObject
              ? 'OBJECT REFLECT'
              : isTargetInLight
              ? 'DIRECT BEAM'
              : 'DARK'}
          </div>
        </div>

        {/* ACTIVE OBJECT ON CENTER STAGE */}
        <div className="absolute bottom-12 inset-x-0 flex justify-center items-end pointer-events-none z-20">
          {activeStageObject ? (
            <div
              id="active-stage-object"
              className="relative w-28 h-28 sm:w-32 sm:h-32 pointer-events-auto cursor-pointer group flex flex-col items-center"
              onClick={() => setActiveStageObject(null)}
              title={`${activeStageObject.name} standing on stage. Click to return to toolbox.`}
            >
              {/* Reflected SVG appearance in current stage light */}
              <div className="w-full h-full transition-transform duration-200 group-hover:scale-105">
                {activeStageObject.render(lightRGB, false)}
              </div>

              {/* Pedestal indicator tag */}
              <div className="mt-1 px-2 py-0.5 rounded-full bg-zinc-900/90 border border-white/20 text-[10px] font-mono text-zinc-300 flex items-center space-x-1 shadow-lg opacity-85 group-hover:opacity-100">
                <span>{activeStageObject.name}</span>
                <span className="text-zinc-500 text-[9px]">(Click to Remove)</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500/60 text-xs font-mono pb-4 pointer-events-none">
              [ Stage empty - drag or click an object from toolbox below ]
            </div>
          )}
        </div>

        {/* DRAGGING OBJECT OVERLAY */}
        {isDraggingObject && draggedObject && (
          <div
            style={{
              left: `${dragPos.x}px`,
              top: `${dragPos.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="fixed pointer-events-none z-50 w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl"
          >
            {/* If inside light cone: reflected color; if in dark room: subtle light-grey outline! */}
            {draggedObject.render(lightRGB, !isDraggedInLight)}

            {/* Hover indicator */}
            <div className="text-center mt-1">
              <span
                className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                  isDraggedInLight
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800/90 text-zinc-400 border border-zinc-600'
                }`}
              >
                {isDraggedInLight ? 'Illuminated' : 'Dark Room Outline'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* LOWER SECTION: White Background Toolbox of Objects */}
      <div className="w-full mt-3">
        <Toolbox
          activeStageObjectId={activeStageObject?.id || null}
          onSelectObject={handleSelectObject}
          onReturnToShelf={() => setActiveStageObject(null)}
          lightRGB={lightRGB}
          onStartDrag={handleStartObjectDrag}
        />
      </div>
    </div>
  );
};
