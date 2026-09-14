import React from 'react';
import { STAGE_OBJECTS, StageObject } from '../data/stageObjects';
import { RGB } from '../types';

interface ToolboxProps {
  activeStageObjectId: string | null;
  onSelectObject: (obj: StageObject) => void;
  onReturnToShelf: () => void;
  lightRGB: RGB;
  onStartDrag: (obj: StageObject, e: React.MouseEvent | React.TouchEvent) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({
  activeStageObjectId,
  onSelectObject,
  onReturnToShelf,
  onStartDrag,
}) => {
  const whiteLight: RGB = { r: 255, g: 255, b: 255 };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border-2 border-zinc-200/90 p-3 text-zinc-900 select-none z-30 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
          <h3 className="font-semibold text-xs sm:text-sm tracking-wide text-zinc-900 uppercase">
            Object Toolbox
          </h3>
          <span className="text-xs text-zinc-500 hidden sm:inline">
            Drag or click an object to place it onto the stage
          </span>
        </div>

        {activeStageObjectId && (
          <button
            type="button"
            onClick={onReturnToShelf}
            className="text-xs py-1 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-md border border-zinc-300 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>Clear Stage</span>
          </button>
        )}
      </div>

      {/* Grid of Objects */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {STAGE_OBJECTS.map((obj) => {
          const isOnStage = activeStageObjectId === obj.id;
          return (
            <div
              key={obj.id}
              id={`toolbox-item-${obj.id}`}
              role="button"
              tabIndex={0}
              onMouseDown={(e) => onStartDrag(obj, e)}
              onTouchStart={(e) => onStartDrag(obj, e)}
              onClick={() => {
                if (isOnStage) {
                  onReturnToShelf();
                } else {
                  onSelectObject(obj);
                }
              }}
              title={`${obj.name}: ${obj.subtitle}`}
              className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                isOnStage
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30'
                  : 'bg-zinc-50/80 hover:bg-white hover:border-zinc-400 border-zinc-200 shadow-xs'
              }`}
            >
              {/* Object SVG (rendered under pure white light while inside toolbox) */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-transform group-hover:scale-105">
                {obj.render(whiteLight, false)}
              </div>

              {/* Object Name */}
              <span className="text-[11px] font-medium text-zinc-800 text-center leading-tight line-clamp-1 mt-1.5">
                {obj.name}
              </span>

              {/* Stage indicator badge */}
              {isOnStage && (
                <div className="absolute -top-1.5 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow">
                  ON STAGE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
