import { RGB, StandardColor } from '../types';

export const STANDARD_COLORS: Record<StandardColor, RGB> = {
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  cyan: { r: 0, g: 255, b: 255 },
  magenta: { r: 255, g: 0, b: 255 },
  yellow: { r: 255, g: 255, b: 0 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};

export const COLOR_HEX: Record<StandardColor, string> = {
  red: '#EF4444',
  green: '#22C55E',
  blue: '#3B82F6',
  cyan: '#06B6D4',
  magenta: '#D946EF',
  yellow: '#EAB308',
  white: '#FFFFFF',
  black: '#111827',
};

// Reflectance factor (0 to 1) for each channel [R, G, B]
export const STANDARD_COLOR_REFLECTANCE: Record<StandardColor, [number, number, number]> = {
  red: [1, 0, 0],
  green: [0, 1, 0],
  blue: [0, 0, 1],
  cyan: [0, 1, 1],
  magenta: [1, 0, 1],
  yellow: [1, 1, 0],
  white: [1, 1, 1],
  black: [0, 0, 0],
};

/**
 * Calculates the reflected color of an idealized standard color under an incoming light color.
 */
export function calculateReflectedStandardColor(
  baseColor: StandardColor,
  lightColor: StandardColor
): StandardColor {
  const [bR, bG, bB] = STANDARD_COLOR_REFLECTANCE[baseColor];
  const [lR, lG, lB] = STANDARD_COLOR_REFLECTANCE[lightColor];

  const r = bR && lR ? 1 : 0;
  const g = bG && lG ? 1 : 0;
  const b = bB && lB ? 1 : 0;

  if (r && g && b) return 'white';
  if (r && g && !b) return 'yellow';
  if (r && !g && b) return 'magenta';
  if (!r && g && b) return 'cyan';
  if (r && !g && !b) return 'red';
  if (!r && g && !b) return 'green';
  if (!r && !g && b) return 'blue';
  return 'black';
}

/**
 * Computes RGB color reflecting continuous light RGB (0-255)
 */
export function calculateReflectedRGB(
  baseReflectance: { r: number; g: number; b: number },
  lightRGB: RGB
): RGB {
  return {
    r: Math.round((lightRGB.r / 255) * baseReflectance.r),
    g: Math.round((lightRGB.g / 255) * baseReflectance.g),
    b: Math.round((lightRGB.b / 255) * baseReflectance.b),
  };
}

export function rgbToString(rgb: RGB, alpha?: number): string {
  if (alpha !== undefined) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// ROYGBIV spectral definitions
// Ordered as specified in the prompt: Left = Red, Right = Violet
export interface SpectralPoint {
  letter: 'R' | 'O' | 'Y' | 'G' | 'B' | 'I' | 'V';
  name: string;
  wavelength: number; // nm
  baseHueHex: string;
  rWeight: number;
  gWeight: number;
  bWeight: number;
}

export const ROYGBIV_BANDS: SpectralPoint[] = [
  { letter: 'R', name: 'Red', wavelength: 680, baseHueHex: '#FF1E1E', rWeight: 1.0, gWeight: 0.0, bWeight: 0.0 },
  { letter: 'O', name: 'Orange', wavelength: 615, baseHueHex: '#FF7A00', rWeight: 0.95, gWeight: 0.45, bWeight: 0.0 },
  { letter: 'Y', name: 'Yellow', wavelength: 580, baseHueHex: '#FFDD00', rWeight: 0.85, gWeight: 0.85, bWeight: 0.0 },
  { letter: 'G', name: 'Green', wavelength: 530, baseHueHex: '#00E844', rWeight: 0.0, gWeight: 1.0, bWeight: 0.0 },
  { letter: 'B', name: 'Blue', wavelength: 475, baseHueHex: '#00A3FF', rWeight: 0.0, gWeight: 0.4, bWeight: 1.0 },
  { letter: 'I', name: 'Indigo', wavelength: 440, baseHueHex: '#4A21EF', rWeight: 0.25, gWeight: 0.0, bWeight: 0.95 },
  { letter: 'V', name: 'Violet', wavelength: 410, baseHueHex: '#8B00FF', rWeight: 0.45, gWeight: 0.0, bWeight: 0.85 },
];

/**
 * Computes a smooth spectral intensity array (0 to 1) for 40 sample points along the spectrum
 * from Left (Red ~700nm) to Right (Violet ~400nm).
 */
export function generateSpectrumCurve(
  lightRGB: RGB,
  objectReflectance: [number, number, number] | null,
  isTargetInLight: boolean
): { xPercent: number; intensity: number; colorHex: string; wavelength: number }[] {
  if (!isTargetInLight) {
    // Target is in dark area -> flatlines to 0
    return Array.from({ length: 41 }).map((_, i) => ({
      xPercent: (i / 40) * 100,
      intensity: 0,
      colorHex: '#334155',
      wavelength: Math.round(700 - (i / 40) * 300),
    }));
  }

  // Incoming light normalized 0 to 1
  const normR = lightRGB.r / 255;
  const normG = lightRGB.g / 255;
  const normB = lightRGB.b / 255;

  // Filter by object reflectance if target is on object
  const refR = objectReflectance ? objectReflectance[0] : 1;
  const refG = objectReflectance ? objectReflectance[1] : 1;
  const refB = objectReflectance ? objectReflectance[2] : 1;

  const effR = normR * refR;
  const effG = normG * refG;
  const effB = normB * refB;

  const steps = 40;
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 (Red) to 1 (Violet)
    const wavelength = Math.round(700 - t * 300); // 700nm down to 400nm

    // Continuous spectral response functions
    // Red peak near t = 0.05
    const rComponent = Math.exp(-Math.pow((t - 0.08) / 0.18, 2)) * effR;
    // Orange/Yellow overlap near t = 0.25 - 0.35
    const yComponent = Math.exp(-Math.pow((t - 0.32) / 0.14, 2)) * Math.min(effR, effG);
    // Green peak near t = 0.50
    const gComponent = Math.exp(-Math.pow((t - 0.50) / 0.16, 2)) * effG;
    // Blue peak near t = 0.72
    const bComponent = Math.exp(-Math.pow((t - 0.72) / 0.16, 2)) * effB;
    // Indigo/Violet peak near t = 0.90
    const vComponent = Math.exp(-Math.pow((t - 0.92) / 0.15, 2)) * (effB * 0.85 + effR * 0.25);

    let intensity = Math.max(
      0,
      Math.min(1, rComponent * 0.95 + yComponent * 0.6 + gComponent * 0.95 + bComponent * 0.95 + vComponent * 0.7)
    );

    // Dynamic color at this wavelength
    let colorHex = '#FFFFFF';
    if (t < 0.18) colorHex = '#EF4444'; // Red
    else if (t < 0.32) colorHex = '#F97316'; // Orange
    else if (t < 0.44) colorHex = '#EAB308'; // Yellow
    else if (t < 0.62) colorHex = '#22C55E'; // Green
    else if (t < 0.78) colorHex = '#06B6D4'; // Cyan/Blue
    else if (t < 0.90) colorHex = '#3B82F6'; // Blue/Indigo
    else colorHex = '#A855F7'; // Violet

    points.push({
      xPercent: t * 100,
      intensity,
      colorHex,
      wavelength,
    });
  }

  return points;
}
