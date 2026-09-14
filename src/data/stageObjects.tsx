import React from 'react';
import { RGB } from '../types';
import { calculateReflectedRGB, rgbToString } from '../utils/colorPhysics';

export interface StageObject {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'mixed';
  subtitle: string;
  // Inherent base reflectance in R, G, B channels (each 0 to 1)
  overallReflectance: [number, number, number];
  // Sub-region reflectance based on normalized 0..1 coordinates (X from left, Y from top)
  getReflectanceAt?: (normX: number, normY: number) => [number, number, number];
  render: (lightRGB: RGB, isOutlineOnly: boolean) => React.ReactNode;
}

export const STAGE_OBJECTS: StageObject[] = [
  // 1. WHITE T-SHIRT
  {
    id: 'white-tshirt',
    name: 'White T-Shirt',
    category: 'primary',
    subtitle: 'Reflects All (R+G+B)',
    overallReflectance: [1, 1, 1],
    getReflectanceAt: () => [1, 1, 1],
    render: (light, outline) => {
      const shirtCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 255, b: 255 }, light));
      const strokeCol = outline ? '#94A3B8' : '#334155';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path
            d="M30 18 L42 28 C46 22 54 22 58 28 L70 18 L88 32 L78 48 L70 42 L70 86 L30 86 L30 42 L22 48 L12 32 Z"
            fill={shirtCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
            strokeLinejoin="round"
          />
          {!outline && (
            <path d="M42 28 C46 36 54 36 58 28" fill="none" stroke="#64748B" strokeWidth="1.5" />
          )}
        </svg>
      );
    },
  },

  // 2. RED APPLE
  {
    id: 'red-apple',
    name: 'Red Apple',
    category: 'primary',
    subtitle: 'Reflects Red (Black Stalk)',
    overallReflectance: [1, 0, 0],
    getReflectanceAt: (_x, y) => {
      // Black stalk near top
      return y < 0.28 ? [0, 0, 0] : [1, 0, 0];
    },
    render: (light, outline) => {
      const bodyCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 0, b: 0 }, light));
      const stalkCol = outline ? '#94A3B8' : '#18181B';
      const strokeCol = outline ? '#94A3B8' : '#450A0A';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path
            d="M50 28 C49 20 54 14 62 10 C59 14 56 20 53 28 Z"
            fill={stalkCol}
            stroke={outline ? '#94A3B8' : '#09090B'}
            strokeWidth={outline ? 2 : 1}
          />
          <path
            d="M50 32 C38 22 20 28 20 48 C20 72 38 88 50 88 C62 88 80 72 80 48 C80 28 62 22 50 32 Z"
            fill={bodyCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
          />
          {!outline && (
            <circle cx="36" cy="42" r="4" fill="rgba(255,255,255,0.4)" />
          )}
        </svg>
      );
    },
  },

  // 3. GREEN LEAF
  {
    id: 'green-leaf',
    name: 'Green Leaf',
    category: 'primary',
    subtitle: 'Reflects Green Only',
    overallReflectance: [0, 1, 0],
    getReflectanceAt: () => [0, 1, 0],
    render: (light, outline) => {
      const leafCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 0, g: 255, b: 0 }, light));
      const strokeCol = outline ? '#94A3B8' : '#052E16';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <path
            d="M20 80 C20 40 45 20 82 18 C80 55 60 80 20 80 Z"
            fill={leafCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
            strokeLinejoin="round"
          />
          <path
            d="M20 80 Q 48 52 82 18"
            fill="none"
            stroke={outline ? '#94A3B8' : '#14532D'}
            strokeWidth={outline ? 2 : 1.5}
          />
          {!outline && (
            <>
              <path d="M42 58 Q 50 48 60 52" fill="none" stroke="#14532D" strokeWidth="1" />
              <path d="M55 45 Q 64 36 74 38" fill="none" stroke="#14532D" strokeWidth="1" />
            </>
          )}
        </svg>
      );
    },
  },

  // 4. BLUE SAPPHIRE
  {
    id: 'blue-sapphire',
    name: 'Blue Sapphire',
    category: 'primary',
    subtitle: 'Reflects Blue Only',
    overallReflectance: [0, 0, 1],
    getReflectanceAt: () => [0, 0, 1],
    render: (light, outline) => {
      const gemCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 0, g: 0, b: 255 }, light));
      const strokeCol = outline ? '#94A3B8' : '#172554';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <polygon
            points="30,22 70,22 86,44 50,86 14,44"
            fill={gemCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
            strokeLinejoin="round"
          />
          <line x1="30" y1="22" x2="14" y2="44" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
          <line x1="70" y1="22" x2="86" y2="44" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
          <line x1="14" y1="44" x2="86" y2="44" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
          <line x1="30" y1="22" x2="40" y2="44" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
          <line x1="70" y1="22" x2="60" y2="44" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
          <line x1="40" y1="44" x2="50" y2="86" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
          <line x1="60" y1="44" x2="50" y2="86" stroke={outline ? '#94A3B8' : '#1E3A8A'} strokeWidth="1" />
        </svg>
      );
    },
  },

  // 5. BLUE & WHITE SMURF
  {
    id: 'smurf',
    name: 'Blue & White Smurf',
    category: 'primary',
    subtitle: 'Blue Skin + White Cap & Pants',
    overallReflectance: [0.5, 0.5, 1.0],
    getReflectanceAt: (_x, y) => {
      // Hat (White)
      if (y < 0.36) return [1, 1, 1];
      // Face and torso (Blue skin)
      if (y < 0.68) return [0, 0, 1];
      // Pants & shoes (White)
      return [1, 1, 1];
    },
    render: (light, outline) => {
      const skinCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 0, g: 0, b: 255 }, light));
      const whiteCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 255, b: 255 }, light));
      const strokeCol = outline ? '#94A3B8' : '#1E293B';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Hat (White) */}
          <path
            d="M32 36 C32 16 62 10 74 20 C82 28 66 36 68 36 Z"
            fill={whiteCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
          />
          {/* Head (Blue) */}
          <circle cx="50" cy="45" r="15" fill={skinCol} stroke={strokeCol} strokeWidth={outline ? 2.5 : 1.5} />
          <ellipse cx="50" cy="46" rx="4" ry="3" fill={skinCol} stroke={strokeCol} strokeWidth="1" />
          {!outline && (
            <>
              <circle cx="45" cy="42" r="2" fill="#0F172A" />
              <circle cx="55" cy="42" r="2" fill="#0F172A" />
            </>
          )}
          {/* Body/Arms (Blue) */}
          <rect x="42" y="58" width="16" height="14" rx="4" fill={skinCol} stroke={strokeCol} strokeWidth={outline ? 2.5 : 1.5} />
          {/* Pants & Shoes (White) */}
          <path
            d="M40 70 L60 70 L64 88 L52 88 L50 78 L48 88 L36 88 Z"
            fill={whiteCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
          />
        </svg>
      );
    },
  },

  // 6. BENDY BANANA (Yellow: Reflects Red & Green)
  {
    id: 'yellow-banana',
    name: 'Yellow Banana',
    category: 'secondary',
    subtitle: 'Reflects Red & Green (Yellow)',
    overallReflectance: [1, 1, 0],
    getReflectanceAt: () => [1, 1, 0],
    render: (light, outline) => {
      const bananaCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 255, b: 0 }, light));
      const stemCol = outline ? '#94A3B8' : '#271705';
      const strokeCol = outline ? '#94A3B8' : '#713F12';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bendy Crescent Banana Body */}
          <path
            d="M74 24 C82 38 82 56 68 74 C54 88 34 86 20 78 C24 74 34 68 44 58 C58 44 64 34 70 24 Z"
            fill={bananaCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
            strokeLinejoin="round"
          />
          {/* Curved inner facet */}
          <path
            d="M70 24 C76 38 74 54 62 70 C50 82 32 80 20 78 C28 82 46 84 62 72 C78 54 78 38 72 24 Z"
            fill={outline ? 'none' : 'rgba(0,0,0,0.06)'}
          />
          {/* Curved longitudinal spine line */}
          <path
            d="M71 24 C74 42 66 60 40 76"
            fill="none"
            stroke={outline ? '#94A3B8' : 'rgba(113, 63, 18, 0.35)'}
            strokeWidth="1.2"
          />
          {/* Stem at top-right */}
          <path
            d="M70 24 L76 16 L80 19 L74 25 Z"
            fill={stemCol}
            stroke={strokeCol}
            strokeWidth="1"
          />
          {/* Tip at bottom-left */}
          <path
            d="M20 78 C17 77 17 80 19 82 C21 82 22 80 20 78 Z"
            fill={stemCol}
          />
        </svg>
      );
    },
  },

  // 7. MAGENTA LIPSTICK (Magenta Tip + White Tube)
  {
    id: 'magenta-lipstick',
    name: 'Magenta Lipstick',
    category: 'secondary',
    subtitle: 'Magenta Bullet + White Tube',
    overallReflectance: [1, 0, 1],
    getReflectanceAt: (_x, y) => {
      // y < 0.48 is the lipstick tip bullet (Magenta)
      // y >= 0.48 is the white tube body
      return y < 0.48 ? [1, 0, 1] : [1, 1, 1];
    },
    render: (light, outline) => {
      const tipCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 0, b: 255 }, light));
      const tubeCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 255, b: 255 }, light));
      const strokeCol = outline ? '#94A3B8' : '#4C0519';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Lipstick slant tip (Magenta) */}
          <path
            d="M40 48 L40 28 L56 16 L60 48 Z"
            fill={tipCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
          />
          {/* Inner metal holder */}
          <rect x="38" y="48" width="24" height="8" fill={outline ? 'none' : '#E2E8F0'} stroke={strokeCol} strokeWidth={outline ? 2.5 : 1} />
          {/* White outer Tube */}
          <rect x="35" y="56" width="30" height="34" rx="3" fill={tubeCol} stroke={strokeCol} strokeWidth={outline ? 2.5 : 1.5} />
          {/* Stripe on tube */}
          {!outline && (
            <line x1="35" y1="72" x2="65" y2="72" stroke="#CBD5E1" strokeWidth="2" />
          )}
        </svg>
      );
    },
  },

  // 8. CYAN URANUS (Cyan Planet with rings)
  {
    id: 'cyan-uranus',
    name: 'Cyan Uranus',
    category: 'secondary',
    subtitle: 'Reflects Green & Blue (Cyan)',
    overallReflectance: [0, 1, 1],
    getReflectanceAt: () => [0, 1, 1],
    render: (light, outline) => {
      const planetCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 0, g: 255, b: 255 }, light));
      const strokeCol = outline ? '#94A3B8' : '#155E75';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Back ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="42"
            ry="14"
            fill="none"
            stroke={outline ? '#94A3B8' : strokeCol}
            strokeWidth={outline ? 2 : 2.5}
            transform="rotate(-25 50 50)"
          />
          {/* Planet Sphere */}
          <circle cx="50" cy="50" r="25" fill={planetCol} stroke={strokeCol} strokeWidth={outline ? 2.5 : 1.5} />
          {/* Front ring overlay */}
          <path
            d="M12 50 A 42 14 0 0 0 88 50"
            fill="none"
            stroke={outline ? '#94A3B8' : '#67E8F9'}
            strokeWidth={outline ? 2 : 2.5}
            transform="rotate(-25 50 50)"
          />
          {!outline && (
            <ellipse cx="44" cy="42" rx="6" ry="3" fill="rgba(255,255,255,0.4)" transform="rotate(-25 44 42)" />
          )}
        </svg>
      );
    },
  },

  // 9. ORANGE FISH
  {
    id: 'orange-fish',
    name: 'Orange Fish',
    category: 'mixed',
    subtitle: 'Primary + Secondary Mix (Orange)',
    overallReflectance: [1.0, 0.55, 0.0],
    getReflectanceAt: () => [1.0, 0.55, 0.0],
    render: (light, outline) => {
      const fishCol = outline ? 'none' : rgbToString(calculateReflectedRGB({ r: 255, g: 140, b: 0 }, light));
      const strokeCol = outline ? '#94A3B8' : '#7C2D12';
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Tail fin */}
          <path
            d="M26 50 L12 32 C16 45 16 55 12 68 Z"
            fill={fishCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
          />
          {/* Dorsal fin */}
          <path
            d="M45 32 C55 20 65 24 70 34 Z"
            fill={fishCol}
            stroke={strokeCol}
            strokeWidth={outline ? 2.5 : 1.5}
          />
          {/* Body */}
          <ellipse cx="52" cy="50" rx="28" ry="18" fill={fishCol} stroke={strokeCol} strokeWidth={outline ? 2.5 : 1.5} />
          {/* Pectoral fin */}
          <path d="M48 52 C42 56 42 64 48 64 Z" fill={fishCol} stroke={strokeCol} strokeWidth="1" />
          {/* Eye */}
          <circle cx="70" cy="46" r="4" fill={outline ? 'none' : '#FFFFFF'} stroke={strokeCol} strokeWidth="1" />
          <circle cx="71" cy="46" r="2" fill={outline ? '#94A3B8' : '#0F172A'} />
        </svg>
      );
    },
  },
];
