export type PreviewTemplateId = 'landing' | 'dashboard' | 'content';
export type PreviewViewportId = 'desktop' | 'tablet' | 'mobile';

export interface PreviewTemplateOption {
  id: PreviewTemplateId;
  label: string;
}

export interface PreviewViewportOption {
  id: PreviewViewportId;
  label: string;
  /** Emulated device width in px. The frame renders real DOM at this width and scales to fit. */
  width: number;
}

export const PREVIEW_TEMPLATES: PreviewTemplateOption[] = [
  { id: 'landing', label: 'Landing Page' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'content', label: 'Content' },
];

export const PREVIEW_VIEWPORTS: PreviewViewportOption[] = [
  { id: 'desktop', label: 'Desktop', width: 1440 },
  { id: 'tablet', label: 'Tablet', width: 768 },
  { id: 'mobile', label: 'Mobile', width: 375 },
];
