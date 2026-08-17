import type { ContrastStatus } from '@/lib/wcag';

export interface ContrastCheckResult {
  id: string;
  label: string;
  /** Why this pairing matters — what it corresponds to in a real interface. */
  purpose: string;
  fgHex: string;
  bgHex: string;
  ratio: number;
  aaNormal: boolean;
  aaaNormal: boolean;
  status: ContrastStatus;
  guidance: string;
}

export type VisionSimulationId =
  | 'normal'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'grayscale';

export interface VisionSimulationOption {
  id: VisionSimulationId;
  label: string;
}

export const VISION_SIMULATIONS: VisionSimulationOption[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
  { id: 'grayscale', label: 'Grayscale' },
];

/** CSS `filter` values applied to the preview canvas only — see VisionFilters. */
export const VISION_FILTER_STYLES: Record<VisionSimulationId, string> = {
  normal: 'none',
  protanopia: 'url(#ratio-vision-protanopia)',
  deuteranopia: 'url(#ratio-vision-deuteranopia)',
  tritanopia: 'url(#ratio-vision-tritanopia)',
  grayscale: 'grayscale(1)',
};
