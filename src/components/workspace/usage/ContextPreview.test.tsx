import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContextPreview } from '@/components/workspace/usage/ContextPreview';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';
import { USAGE_CONTEXTS } from '@/lib/usageContexts';

describe('ContextPreview', () => {
  it('renders a labelled preview referencing live palette hex values for every context', () => {
    const palette = createDefaultProjectPalette();

    for (const context of USAGE_CONTEXTS) {
      const { unmount } = render(<ContextPreview contextId={context.id} palette={palette} />);
      const preview = screen.getByRole('img');
      expect(preview.getAttribute('aria-label')).toContain('#F7F5F0');
      unmount();
    }
  });

  it('updates immediately when the palette changes', () => {
    const palette = createDefaultProjectPalette();
    const { rerender } = render(<ContextPreview contextId="marketing" palette={palette} />);

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('#F7F5F0');

    const newDominant = toColour('#001122');
    if (!newDominant) throw new Error('expected a valid colour');
    const updated = {
      ...palette,
      ratio: { ...palette.ratio, dominant: { ...palette.ratio.dominant, colour: newDominant } },
    };

    rerender(<ContextPreview contextId="marketing" palette={updated} />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('#001122');
  });

  it('renders a different composition per context, not one generic mockup reused everywhere', () => {
    const palette = createDefaultProjectPalette();
    const labels = USAGE_CONTEXTS.map((context) => {
      const { unmount } = render(<ContextPreview contextId={context.id} palette={palette} />);
      const label = screen.getByRole('img').getAttribute('aria-label');
      unmount();
      return label;
    });

    expect(new Set(labels).size).toBe(labels.length);
  });

  it('does not break when every palette colour is identical', () => {
    const palette = createDefaultProjectPalette();
    const flat = toColour('#808080');
    if (!flat) throw new Error('expected a valid colour');

    const flattened = {
      ratio: {
        dominant: { ...palette.ratio.dominant, colour: flat },
        secondary: { ...palette.ratio.secondary, colour: flat },
        accent: { ...palette.ratio.accent, colour: flat },
      },
      supporting: { text: { ...palette.supporting.text, colour: flat } },
    };

    for (const context of USAGE_CONTEXTS) {
      const { unmount } = render(<ContextPreview contextId={context.id} palette={flattened} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      unmount();
    }
  });
});
