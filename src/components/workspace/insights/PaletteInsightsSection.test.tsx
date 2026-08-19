import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaletteInsightsSection } from '@/components/workspace/insights/PaletteInsightsSection';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('PaletteInsightsSection', () => {
  it('shows the three insight cards, each collapsed by default', () => {
    render(<PaletteInsightsSection palette={createDefaultProjectPalette()} />);

    expect(screen.getByRole('heading', { level: 4, name: 'Surface hierarchy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Accent prominence' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Text readability' })).toBeInTheDocument();

    // What/why explanations only render inside the (closed) <details> body — present
    // in the DOM, but not part of the collapsed scan view a sighted user sees.
    for (const details of document.querySelectorAll('details')) {
      expect(details).not.toHaveAttribute('open');
    }
  });

  it('renders the overview headline from the real good/total counts, not a fake score', () => {
    render(<PaletteInsightsSection palette={createDefaultProjectPalette()} />);

    expect(screen.getByText('1 of 3 key relationships look strong.')).toBeInTheDocument();
    expect(screen.queryByText(/\d+\s*\/\s*100/)).not.toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('never suggests a replacement colour anywhere in the rendered insights', () => {
    render(<PaletteInsightsSection palette={createDefaultProjectPalette()} />);

    expect(screen.queryByText(/try #/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/recommended replacement/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/generate/i)).not.toBeInTheDocument();
  });

  it('updates live when the palette changes', () => {
    const palette = createDefaultProjectPalette();
    const { rerender } = render(<PaletteInsightsSection palette={palette} />);

    // The default Dominant/Secondary pairing is subtly separated (~1.35:1).
    expect(screen.getAllByText('Subtle surface separation').length).toBeGreaterThan(0);

    const strongSecondary = toColour('#4D4D4D');
    if (!strongSecondary) throw new Error('expected a valid colour');
    const updated = {
      ...palette,
      ratio: { ...palette.ratio, secondary: { ...palette.ratio.secondary, colour: strongSecondary } },
    };

    rerender(<PaletteInsightsSection palette={updated} />);

    // Independently verified: #F7F5F0 vs #4D4D4D is a ~7.8:1 pairing — strong.
    expect(screen.queryByText('Subtle surface separation')).not.toBeInTheDocument();
    expect(screen.getAllByText('Clear surface separation').length).toBeGreaterThan(0);
  });

  it('labels each status with text, not colour alone', () => {
    render(<PaletteInsightsSection palette={createDefaultProjectPalette()} />);

    // Every insight card status badge renders an accessible text label
    // ("Good" / "Review" / "Issue") alongside its icon.
    expect(screen.getAllByText('Good').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Issue').length).toBeGreaterThan(0);
  });
});
