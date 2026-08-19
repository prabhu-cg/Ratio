import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageVisualExample } from '@/components/workspace/usage/UsageVisualExample';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';
import type { UsageVisualExampleKind } from '@/types/colourRole';

const KINDS: UsageVisualExampleKind[] = ['page-canvas', 'card', 'button', 'heading-hierarchy', 'icon'];

describe('UsageVisualExample', () => {
  it('renders a labelled example for every kind, referencing the live hex value', () => {
    const palette = createDefaultProjectPalette();

    for (const kind of KINDS) {
      const { unmount } = render(<UsageVisualExample kind={kind} palette={palette} />);
      const example = screen.getByRole('img');
      expect(example.getAttribute('aria-label')).toMatch(/#/);
      unmount();
    }
  });

  it('updates its label and rendered colour immediately when the palette changes', () => {
    const palette = createDefaultProjectPalette();
    const { rerender } = render(<UsageVisualExample kind="page-canvas" palette={palette} />);

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('#F7F5F0');

    const newDominant = toColour('#123456');
    if (!newDominant) throw new Error('expected a valid colour');
    const updated = {
      ...palette,
      ratio: { ...palette.ratio, dominant: { ...palette.ratio.dominant, colour: newDominant } },
    };

    rerender(<UsageVisualExample kind="page-canvas" palette={updated} />);

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('#123456');
  });

  it('keeps the button label readable even when Accent is very light', () => {
    const palette = createDefaultProjectPalette();
    const lightAccent = toColour('#FFFFFF');
    if (!lightAccent) throw new Error('expected a valid colour');
    palette.ratio.accent = { ...palette.ratio.accent, colour: lightAccent };

    render(<UsageVisualExample kind="button" palette={palette} />);

    const label = screen.getByText('Button');
    // pickReadableTextColor must choose the dark ink tone against a white accent.
    expect(label).toHaveStyle({ color: '#1E1C1A' });
  });

  it('keeps the button label readable even when Accent is very dark', () => {
    const palette = createDefaultProjectPalette();
    const darkAccent = toColour('#000000');
    if (!darkAccent) throw new Error('expected a valid colour');
    palette.ratio.accent = { ...palette.ratio.accent, colour: darkAccent };

    render(<UsageVisualExample kind="button" palette={palette} />);

    const label = screen.getByText('Button');
    expect(label).toHaveStyle({ color: '#F7F5F0' });
  });

  it('does not hide the example when every colour in the palette is identical', () => {
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

    render(<UsageVisualExample kind="card" palette={flattened} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
