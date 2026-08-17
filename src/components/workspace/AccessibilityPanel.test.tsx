import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccessibilityPanel } from '@/components/workspace/AccessibilityPanel';
import { createDefaultPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('AccessibilityPanel', () => {
  it('shows all six contrast checks for the default palette', () => {
    render(<AccessibilityPanel palette={createDefaultPalette()} />);

    expect(screen.getByText('Primary text on Dominant')).toBeInTheDocument();
    expect(screen.getByText('Primary text on Secondary')).toBeInTheDocument();
    expect(screen.getByText('Primary text on Accent')).toBeInTheDocument();
    expect(screen.getByText('White on Accent')).toBeInTheDocument();
    expect(screen.getByText('Dark text on Accent')).toBeInTheDocument();
    expect(screen.getByText('Secondary as text on Dominant')).toBeInTheDocument();
  });

  it('correctly flags the default brand accent as review-worthy for dark text specifically', () => {
    // #C74504 against near-black text sits at ~3.46:1 — real AA-large territory, not a
    // full pass. This is the RATIO defaults themselves, so it's a meaningful sanity
    // check that the engine isn't just reporting "good" for everything.
    render(<AccessibilityPanel palette={createDefaultPalette()} />);

    expect(screen.getByText('1 of 6 to review')).toBeInTheDocument();
  });

  it('states plainly that 60/30/10 is not an accessibility standard', () => {
    render(<AccessibilityPanel palette={createDefaultPalette()} />);

    expect(
      screen.getByText(/doesn't say anything about whether text stays readable/i),
    ).toBeInTheDocument();
  });

  it('flags a low-contrast pairing as needing review, without implying the whole palette fails', () => {
    const palette = createDefaultPalette();
    const flatSecondary = toColour('#F0EEE8');
    if (!flatSecondary) throw new Error('expected a valid colour');
    palette.secondary = { ...palette.secondary, colour: flatSecondary };

    render(<AccessibilityPanel palette={palette} />);

    expect(screen.getByText(/to review/i)).toBeInTheDocument();
    expect(screen.getAllByText('Fails').length).toBeGreaterThan(0);
  });
});
