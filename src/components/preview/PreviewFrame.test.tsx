import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { createDefaultPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('PreviewFrame', () => {
  it('exposes the current palette as CSS custom properties, not component props', () => {
    const palette = createDefaultPalette();
    const customAccent = toColour('#2563EB');
    if (!customAccent) throw new Error('expected a valid colour');
    palette.accent = { ...palette.accent, colour: customAccent };

    render(
      <PreviewFrame palette={palette} templateId="landing" viewport="desktop">
        <div data-testid="preview-child">content</div>
      </PreviewFrame>,
    );

    const child = screen.getByTestId('preview-child');
    const varHost = child.closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({
      '--preview-dominant': '#F7F5F0',
      '--preview-secondary': '#444444',
      '--preview-accent': '#2563EB',
    });
  });

  it('renders the toolbar with the current template and viewport', () => {
    const palette = createDefaultPalette();
    render(
      <PreviewFrame palette={palette} templateId="dashboard" viewport="mobile">
        <div>content</div>
      </PreviewFrame>,
    );

    expect(screen.getByText(/Dashboard · Mobile · 390px/)).toBeInTheDocument();
  });
});
