import type { ReactNode } from 'react';

export type RGB = {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
};

export type StandardColor =
  | 'red'
  | 'green'
  | 'blue'
  | 'cyan'
  | 'magenta'
  | 'yellow'
  | 'white'
  | 'black';

export const COLOR_CYCLE: StandardColor[] = [
  'red',
  'green',
  'blue',
  'cyan',
  'magenta',
  'yellow',
  'white',
  'black',
];

export interface StageObjectDefinition {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'mixed';
  subtitle: string;
  inherentColors: Record<string, { r: number; g: number; b: number; name: string }>;
}

export interface FlagPart {
  id: string;
  label: string;
  originalColor: StandardColor;
  pathD?: string;
  rect?: { x: number; y: number; width: number; height: number };
  polygon?: string;
  circle?: { cx: number; cy: number; r: number };
  customRender?: (fill: string) => ReactNode;
}

export interface FlagDefinition {
  id: string;
  country: string;
  tier: 'easy' | 'hard';
  aspectRatio?: string; // default 3:2 or 2:1
  parts: FlagPart[];
}

export type AppMode = 'menu' | 'learning' | 'game';
export type GameTier = 'easy' | 'hard';

export interface SpectrumDataPoint {
  wavelength: number; // in nm, e.g. 400 to 700
  label: string; // 'V', 'I', 'B', 'G', 'Y', 'O', 'R'
  colorHex: string;
  intensity: number; // 0 to 1
}
