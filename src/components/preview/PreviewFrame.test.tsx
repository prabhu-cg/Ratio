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
      <PreviewFrame palette={palette} templateId="landing" viewport="desktop" visionMode="normal">
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
      <PreviewFrame palette={palette} templateId="dashboard" viewport="mobile" visionMode="normal">
        <div>content</div>
      </PreviewFrame>,
    );

    expect(screen.getByText(/Dashboard · Mobile · 390px/)).toBeInTheDocument();
  });

  it('applies a colour-vision filter to the preview canvas only, not the toolbar', () => {
    const palette = createDefaultPalette();
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
    const palette = createDefaultPalette();
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
    const palette = createDefaultPalette();
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
