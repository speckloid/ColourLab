import React from 'react';
import { StandardColor } from '../types';

export interface FlagColorPart {
  baseColor: StandardColor;
  element: (colorMap: Record<StandardColor, StandardColor>) => React.ReactNode;
}

export interface GameFlag {
  id: string;
  country: string;
  tier: 'easy' | 'hard';
  description: string;
  // All unique original base colors present in this flag
  uniqueBaseColors: StandardColor[];
  // SVG renderer that receives a mapping of original base color -> displayed color
  render: (colorMap: Record<StandardColor, StandardColor>, className?: string) => React.ReactNode;
}

// Helper to get hex for color
export const COLOR_TO_HEX: Record<StandardColor, string> = {
  red: '#EF4444',
  green: '#22C55E',
  blue: '#2563EB',
  cyan: '#06B6D4',
  magenta: '#D946EF',
  yellow: '#EAB308',
  white: '#FFFFFF',
  black: '#111827',
};

export const EASY_FLAGS: GameFlag[] = [
  {
    id: 'switzerland',
    country: 'Switzerland',
    tier: 'easy',
    description: 'Red field with a central white cross',
    uniqueBaseColors: ['red', 'white'],
    render: (c, cls) => (
      <svg viewBox="0 0 100 100" className={cls || "w-full h-full"}>
        {/* Red background */}
        <rect width="100" height="100" fill={COLOR_TO_HEX[c.red]} />
        {/* White cross */}
        <rect x="42" y="20" width="16" height="60" fill={COLOR_TO_HEX[c.white]} />
        <rect x="20" y="42" width="60" height="16" fill={COLOR_TO_HEX[c.white]} />
      </svg>
    ),
  },
  {
    id: 'austria',
    country: 'Austria',
    tier: 'easy',
    description: 'Three horizontal stripes: Red, White, Red',
    uniqueBaseColors: ['red', 'white'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.red]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'france',
    country: 'France',
    tier: 'easy',
    description: 'Vertical tricolor: Blue, White, Red',
    uniqueBaseColors: ['blue', 'white', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect x="0" width="40" height="80" fill={COLOR_TO_HEX[c.blue]} />
        <rect x="40" width="40" height="80" fill={COLOR_TO_HEX[c.white]} />
        <rect x="80" width="40" height="80" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'italy',
    country: 'Italy',
    tier: 'easy',
    description: 'Vertical tricolor: Green, White, Red',
    uniqueBaseColors: ['green', 'white', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect x="0" width="40" height="80" fill={COLOR_TO_HEX[c.green]} />
        <rect x="40" width="40" height="80" fill={COLOR_TO_HEX[c.white]} />
        <rect x="80" width="40" height="80" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'japan',
    country: 'Japan',
    tier: 'easy',
    description: 'White field with a centered red disc',
    uniqueBaseColors: ['white', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.white]} />
        <circle cx="60" cy="40" r="24" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'finland',
    country: 'Finland',
    tier: 'easy',
    description: 'White field with a blue Nordic cross',
    uniqueBaseColors: ['white', 'blue'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.white]} />
        <rect x="36" y="0" width="20" height="80" fill={COLOR_TO_HEX[c.blue]} />
        <rect x="0" y="30" width="120" height="20" fill={COLOR_TO_HEX[c.blue]} />
      </svg>
    ),
  },
  {
    id: 'netherlands',
    country: 'Netherlands',
    tier: 'easy',
    description: 'Horizontal tricolor: Red, White, Blue',
    uniqueBaseColors: ['red', 'white', 'blue'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.red]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
      </svg>
    ),
  },
  {
    id: 'russia',
    country: 'Russia',
    tier: 'easy',
    description: 'Horizontal tricolor: White, Blue, Red',
    uniqueBaseColors: ['white', 'blue', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'hungary',
    country: 'Hungary',
    tier: 'easy',
    description: 'Horizontal tricolor: Red, White, Green',
    uniqueBaseColors: ['red', 'white', 'green'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.red]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.green]} />
      </svg>
    ),
  },
  {
    id: 'bulgaria',
    country: 'Bulgaria',
    tier: 'easy',
    description: 'Horizontal tricolor: White, Green, Red',
    uniqueBaseColors: ['white', 'green', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.green]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'sierra-leone',
    country: 'Sierra Leone',
    tier: 'easy',
    description: 'Horizontal tricolor: Green, White, Blue',
    uniqueBaseColors: ['green', 'white', 'blue'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.green]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
      </svg>
    ),
  },
  {
    id: 'czechia',
    country: 'Czechia',
    tier: 'easy',
    description: 'White top, Red bottom, Blue hoist triangle',
    uniqueBaseColors: ['white', 'red', 'blue'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="40" fill={COLOR_TO_HEX[c.white]} />
        <rect y="40" width="120" height="40" fill={COLOR_TO_HEX[c.red]} />
        <polygon points="0,0 60,40 0,80" fill={COLOR_TO_HEX[c.blue]} />
      </svg>
    ),
  },
  {
    id: 'madagascar',
    country: 'Madagascar',
    tier: 'easy',
    description: 'White hoist band, Red top band, Green bottom band',
    uniqueBaseColors: ['white', 'red', 'green'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect x="0" y="0" width="40" height="80" fill={COLOR_TO_HEX[c.white]} />
        <rect x="40" y="0" width="80" height="40" fill={COLOR_TO_HEX[c.red]} />
        <rect x="40" y="40" width="80" height="40" fill={COLOR_TO_HEX[c.green]} />
      </svg>
    ),
  },
  {
    id: 'thailand',
    country: 'Thailand',
    tier: 'easy',
    description: 'Horizontal stripes: Red, White, double Blue, White, Red',
    uniqueBaseColors: ['red', 'white', 'blue'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="13.33" fill={COLOR_TO_HEX[c.red]} />
        <rect y="13.33" width="120" height="13.33" fill={COLOR_TO_HEX[c.white]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="53.33" width="120" height="13.33" fill={COLOR_TO_HEX[c.white]} />
        <rect y="66.67" width="120" height="13.33" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'honduras',
    country: 'Honduras',
    tier: 'easy',
    description: 'Blue, White, Blue horizontal stripes with 5 blue stars',
    uniqueBaseColors: ['blue', 'white'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
        {/* 5 stars in center */}
        <circle cx="50" cy="34" r="3" fill={COLOR_TO_HEX[c.blue]} />
        <circle cx="70" cy="34" r="3" fill={COLOR_TO_HEX[c.blue]} />
        <circle cx="60" cy="40" r="3.5" fill={COLOR_TO_HEX[c.blue]} />
        <circle cx="50" cy="46" r="3" fill={COLOR_TO_HEX[c.blue]} />
        <circle cx="70" cy="46" r="3" fill={COLOR_TO_HEX[c.blue]} />
      </svg>
    ),
  },
  {
    id: 'united-kingdom',
    country: 'United Kingdom',
    tier: 'easy',
    description: 'Blue field with overlapping White and Red crosses & saltires',
    uniqueBaseColors: ['blue', 'white', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.blue]} />
        {/* White Saltire */}
        <line x1="0" y1="0" x2="120" y2="80" stroke={COLOR_TO_HEX[c.white]} strokeWidth="16" />
        <line x1="0" y1="80" x2="120" y2="0" stroke={COLOR_TO_HEX[c.white]} strokeWidth="16" />
        {/* Red Saltire */}
        <line x1="0" y1="0" x2="120" y2="80" stroke={COLOR_TO_HEX[c.red]} strokeWidth="6" />
        <line x1="0" y1="80" x2="120" y2="0" stroke={COLOR_TO_HEX[c.red]} strokeWidth="6" />
        {/* White Cross */}
        <rect x="48" y="0" width="24" height="80" fill={COLOR_TO_HEX[c.white]} />
        <rect x="0" y="28" width="120" height="24" fill={COLOR_TO_HEX[c.white]} />
        {/* Red Cross */}
        <rect x="52" y="0" width="16" height="80" fill={COLOR_TO_HEX[c.red]} />
        <rect x="0" y="32" width="120" height="16" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
];

export const HARD_FLAGS: GameFlag[] = [
  {
    id: 'ukraine',
    country: 'Ukraine',
    tier: 'hard',
    description: 'Horizontal bicolour: Blue and Yellow',
    uniqueBaseColors: ['blue', 'yellow'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="40" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="40" width="120" height="40" fill={COLOR_TO_HEX[c.yellow]} />
      </svg>
    ),
  },
  {
    id: 'sweden',
    country: 'Sweden',
    tier: 'hard',
    description: 'Blue field with a yellow Nordic cross',
    uniqueBaseColors: ['blue', 'yellow'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.blue]} />
        <rect x="36" y="0" width="18" height="80" fill={COLOR_TO_HEX[c.yellow]} />
        <rect x="0" y="31" width="120" height="18" fill={COLOR_TO_HEX[c.yellow]} />
      </svg>
    ),
  },
  {
    id: 'belgium',
    country: 'Belgium',
    tier: 'hard',
    description: 'Vertical tricolor: Black, Yellow, Red',
    uniqueBaseColors: ['black', 'yellow', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect x="0" width="40" height="80" fill={COLOR_TO_HEX[c.black]} />
        <rect x="40" width="40" height="80" fill={COLOR_TO_HEX[c.yellow]} />
        <rect x="80" width="40" height="80" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'estonia',
    country: 'Estonia',
    tier: 'hard',
    description: 'Horizontal tricolor: Blue, Black, White',
    uniqueBaseColors: ['blue', 'black', 'white'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.black]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
      </svg>
    ),
  },
  {
    id: 'argentina',
    country: 'Argentina',
    tier: 'hard',
    description: 'Cyan stripes with a white center and yellow sun',
    uniqueBaseColors: ['cyan', 'white', 'yellow'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.cyan]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.white]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.cyan]} />
        <circle cx="60" cy="40" r="9" fill={COLOR_TO_HEX[c.yellow]} />
      </svg>
    ),
  },
  {
    id: 'kazakhstan',
    country: 'Kazakhstan',
    tier: 'hard',
    description: 'Cyan field with yellow sun and ornamental pattern',
    uniqueBaseColors: ['cyan', 'yellow'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.cyan]} />
        {/* Yellow ornamental hoist stripe */}
        <rect x="4" y="8" width="8" height="64" rx="2" fill={COLOR_TO_HEX[c.yellow]} />
        {/* Yellow sun with rays */}
        <circle cx="64" cy="38" r="14" fill={COLOR_TO_HEX[c.yellow]} />
        {/* Soaring steppe eagle silhouette */}
        <path d="M48 54 Q 64 48 80 54 Q 64 58 48 54 Z" fill={COLOR_TO_HEX[c.yellow]} />
      </svg>
    ),
  },
  {
    id: 'palau',
    country: 'Palau',
    tier: 'hard',
    description: 'Cyan field with yellow disc offset toward hoist',
    uniqueBaseColors: ['cyan', 'yellow'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.cyan]} />
        <circle cx="50" cy="40" r="22" fill={COLOR_TO_HEX[c.yellow]} />
      </svg>
    ),
  },
  {
    id: 'colombia',
    country: 'Colombia',
    tier: 'hard',
    description: 'Yellow top half, Blue middle quarter, Red bottom quarter',
    uniqueBaseColors: ['yellow', 'blue', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="40" fill={COLOR_TO_HEX[c.yellow]} />
        <rect y="40" width="120" height="20" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="60" width="120" height="20" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'romania',
    country: 'Romania',
    tier: 'hard',
    description: 'Vertical tricolor: Blue, Yellow, Red',
    uniqueBaseColors: ['blue', 'yellow', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect x="0" width="40" height="80" fill={COLOR_TO_HEX[c.blue]} />
        <rect x="40" width="40" height="80" fill={COLOR_TO_HEX[c.yellow]} />
        <rect x="80" width="40" height="80" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'mali',
    country: 'Mali',
    tier: 'hard',
    description: 'Vertical tricolor: Green, Yellow, Red',
    uniqueBaseColors: ['green', 'yellow', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect x="0" width="40" height="80" fill={COLOR_TO_HEX[c.green]} />
        <rect x="40" width="40" height="80" fill={COLOR_TO_HEX[c.yellow]} />
        <rect x="80" width="40" height="80" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'gabon',
    country: 'Gabon',
    tier: 'hard',
    description: 'Horizontal tricolor: Green, Yellow, Blue',
    uniqueBaseColors: ['green', 'yellow', 'blue'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="26.67" fill={COLOR_TO_HEX[c.green]} />
        <rect y="26.67" width="120" height="26.67" fill={COLOR_TO_HEX[c.yellow]} />
        <rect y="53.33" width="120" height="26.67" fill={COLOR_TO_HEX[c.blue]} />
      </svg>
    ),
  },
  {
    id: 'mauritius',
    country: 'Mauritius',
    tier: 'hard',
    description: 'Four horizontal stripes: Red, Blue, Yellow, Green',
    uniqueBaseColors: ['red', 'blue', 'yellow', 'green'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="20" fill={COLOR_TO_HEX[c.red]} />
        <rect y="20" width="120" height="20" fill={COLOR_TO_HEX[c.blue]} />
        <rect y="40" width="120" height="20" fill={COLOR_TO_HEX[c.yellow]} />
        <rect y="60" width="120" height="20" fill={COLOR_TO_HEX[c.green]} />
      </svg>
    ),
  },
  {
    id: 'jamaica',
    country: 'Jamaica',
    tier: 'hard',
    description: 'Green and Black triangles divided by a Yellow saltire',
    uniqueBaseColors: ['yellow', 'green', 'black'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        {/* Background yellow saltire base */}
        <rect width="120" height="80" fill={COLOR_TO_HEX[c.yellow]} />
        {/* Top/bottom green triangles */}
        <polygon points="12,0 108,0 60,34" fill={COLOR_TO_HEX[c.green]} />
        <polygon points="12,80 108,80 60,46" fill={COLOR_TO_HEX[c.green]} />
        {/* Left/right black triangles */}
        <polygon points="0,8 0,72 50,40" fill={COLOR_TO_HEX[c.black]} />
        <polygon points="120,8 120,72 70,40" fill={COLOR_TO_HEX[c.black]} />
      </svg>
    ),
  },
  {
    id: 'congo',
    country: 'Congo',
    tier: 'hard',
    description: 'Green hoist triangle, Red fly triangle, Yellow diagonal band',
    uniqueBaseColors: ['green', 'yellow', 'red'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <polygon points="0,0 72,0 0,72" fill={COLOR_TO_HEX[c.green]} />
        <polygon points="120,80 48,80 120,8" fill={COLOR_TO_HEX[c.red]} />
        <polygon points="72,0 120,0 120,8 48,80 0,80 0,72" fill={COLOR_TO_HEX[c.yellow]} />
      </svg>
    ),
  },
  {
    id: 'spain',
    country: 'Spain',
    tier: 'hard',
    description: 'Red, double Yellow, Red horizontal stripes',
    uniqueBaseColors: ['red', 'yellow'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        <rect y="0" width="120" height="20" fill={COLOR_TO_HEX[c.red]} />
        <rect y="20" width="120" height="40" fill={COLOR_TO_HEX[c.yellow]} />
        <rect y="60" width="120" height="20" fill={COLOR_TO_HEX[c.red]} />
        {/* Simplified coat of arms pillar */}
        <circle cx="34" cy="40" r="7" fill={COLOR_TO_HEX[c.red]} />
      </svg>
    ),
  },
  {
    id: 'south-africa',
    country: 'South Africa',
    tier: 'hard',
    description: 'Six-colour flag with horizontal Red, Blue, and central Green Y-pall',
    uniqueBaseColors: ['red', 'blue', 'green', 'black', 'yellow', 'white'],
    render: (c, cls) => (
      <svg viewBox="0 0 120 80" className={cls || "w-full h-full"}>
        {/* Red top & Blue bottom */}
        <rect y="0" width="120" height="40" fill={COLOR_TO_HEX[c.red]} />
        <rect y="40" width="120" height="40" fill={COLOR_TO_HEX[c.blue]} />
        {/* White border pall */}
        <polygon points="0,0 36,0 72,30 120,30 120,50 72,50 36,80 0,80 0,64 32,40 0,16" fill={COLOR_TO_HEX[c.white]} />
        {/* Green central Y-pall */}
        <polygon points="0,8 28,8 64,34 120,34 120,46 64,46 28,72 0,72 0,60 26,40 0,20" fill={COLOR_TO_HEX[c.green]} />
        {/* Yellow V-border for black triangle */}
        <polygon points="0,16 28,40 0,64" fill={COLOR_TO_HEX[c.yellow]} />
        {/* Black hoist triangle */}
        <polygon points="0,22 22,40 0,58" fill={COLOR_TO_HEX[c.black]} />
      </svg>
    ),
  },
];
