import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccessibilityPanel } from '@/components/workspace/AccessibilityPanel';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('AccessibilityPanel', () => {
  it('shows all five contrast checks for the default palette', () => {
    render(<AccessibilityPanel palette={createDefaultProjectPalette()} />);

    expect(screen.getByText('Text on Dominant')).toBeInTheDocument();
    expect(screen.getByText('Text on Secondary')).toBeInTheDocument();
    expect(screen.getByText('Text on Accent')).toBeInTheDocument();
    expect(screen.getByText('White on Accent')).toBeInTheDocument();
    expect(screen.getByText('Dark text on Accent')).toBeInTheDocument();
  });

  it('flags some, but not all, of the default pairings as review-worthy', () => {
    // The default project Text (#444444) reads comfortably on Dominant and Secondary,
    // but is much weaker directly on Accent — a meaningful sanity check that the engine
    // isn't just reporting "good" for everything.
    render(<AccessibilityPanel palette={createDefaultProjectPalette()} />);

    expect(screen.getByText('2 of 5 to review')).toBeInTheDocument();
  });

  it('states plainly that 60/30/10 is not an accessibility standard', () => {
    render(<AccessibilityPanel palette={createDefaultProjectPalette()} />);

    expect(
      screen.getByText(/doesn't say anything about whether text stays readable/i),
    ).toBeInTheDocument();
  });

  it('flags a low-contrast pairing as needing review, without implying the whole palette fails', () => {
    const palette = createDefaultProjectPalette();
    const flatText = toColour('#F0EEE8');
    if (!flatText) throw new Error('expected a valid colour');
    palette.supporting.text = { ...palette.supporting.text, colour: flatText };

    render(<AccessibilityPanel palette={palette} />);

    expect(screen.getByText(/to review/i)).toBeInTheDocument();
    expect(screen.getAllByText('Fails').length).toBeGreaterThan(0);
  });

  it('updates contrast results immediately when the project text colour changes', () => {
    const palette = createDefaultProjectPalette();
    const { rerender } = render(<AccessibilityPanel palette={palette} />);

    expect(screen.getByText('#444444 on #F7F5F0')).toBeInTheDocument();

    const nearWhiteText = toColour('#F7F6F4');
    if (!nearWhiteText) throw new Error('expected a valid colour');
    const updated = { ...palette, supporting: { text: { ...palette.supporting.text, colour: nearWhiteText } } };

    rerender(<AccessibilityPanel palette={updated} />);

    expect(screen.getByText('#F7F6F4 on #F7F5F0')).toBeInTheDocument();
  });
});
