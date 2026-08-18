import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('PreviewFrame', () => {
  it('exposes the current ratio palette and project text as CSS custom properties, not component props', () => {
    const palette = createDefaultProjectPalette();
    const customAccent = toColour('#2563EB');
    if (!customAccent) throw new Error('expected a valid colour');
    palette.ratio.accent = { ...palette.ratio.accent, colour: customAccent };

    render(
      <PreviewFrame palette={palette} templateId="landing" viewport="desktop" visionMode="normal">
        <div data-testid="preview-child">content</div>
      </PreviewFrame>,
    );

    const child = screen.getByTestId('preview-child');
    const varHost = child.closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({
      '--preview-dominant': '#F7F5F0',
      '--preview-secondary': '#D9D4CC',
      '--preview-accent': '#2563EB',
      '--preview-text': '#444444',
    });
  });

  it('does not include Text / Foreground as a ratio percentage in the preview vars', () => {
    const palette = createDefaultProjectPalette();
    const customText = toColour('#00FF00');
    if (!customText) throw new Error('expected a valid colour');
    palette.supporting.text = { ...palette.supporting.text, colour: customText };

    render(
      <PreviewFrame palette={palette} templateId="landing" viewport="desktop" visionMode="normal">
        <div data-testid="preview-child">content</div>
      </PreviewFrame>,
    );

    const child = screen.getByTestId('preview-child');
    const varHost = child.closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({
      '--preview-dominant': '#F7F5F0',
      '--preview-secondary': '#D9D4CC',
      '--preview-accent': '#C74504',
      '--preview-text': '#00FF00',
    });
  });

  it('renders the toolbar with the current template and viewport', () => {
    const palette = createDefaultProjectPalette();
    render(
      <PreviewFrame palette={palette} templateId="dashboard" viewport="mobile" visionMode="normal">
        <div>content</div>
      </PreviewFrame>,
    );

    expect(screen.getByText(/Dashboard · Mobile · 375px/)).toBeInTheDocument();
  });

  it('applies a colour-vision filter to the preview canvas only, not the toolbar', () => {
    const palette = createDefaultProjectPalette();
    render(
      <PreviewFrame
        palette={palette}
        templateId="landing"
        viewport="desktop"
        visionMode="deuteranopia"
      >
        <div data-testid="preview-child">content</div>
      </PreviewFrame>,
    );

    const child = screen.getByTestId('preview-child');
    const varHost = child.closest('.\\@container') as HTMLElement;
    expect(varHost).toHaveStyle({ filter: 'url(#ratio-vision-deuteranopia)' });

    expect(screen.getByText(/Landing Page · Desktop/)).not.toHaveStyle({
      filter: 'url(#ratio-vision-deuteranopia)',
    });
  });

  it('leaves the preview unfiltered in Normal vision mode', () => {
    const palette = createDefaultProjectPalette();
    render(
      <PreviewFrame palette={palette} templateId="landing" viewport="desktop" visionMode="normal">
        <div data-testid="preview-child">content</div>
      </PreviewFrame>,
    );

    const child = screen.getByTestId('preview-child');
    const varHost = child.closest('.\\@container') as HTMLElement;
    expect(varHost).toHaveStyle({ filter: 'none' });
  });

  it('announces the active simulation for screen readers', () => {
    const palette = createDefaultProjectPalette();
    const { rerender } = render(
      <PreviewFrame palette={palette} templateId="landing" viewport="desktop" visionMode="normal">
        <div>content</div>
      </PreviewFrame>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/simulation is off/i);

    rerender(
      <PreviewFrame
        palette={palette}
        templateId="landing"
        viewport="desktop"
        visionMode="protanopia"
      >
        <div>content</div>
      </PreviewFrame>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/simulating Protanopia vision/i);
  });
});
