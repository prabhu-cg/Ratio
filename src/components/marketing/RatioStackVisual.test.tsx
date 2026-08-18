import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RatioStackVisual } from '@/components/marketing/RatioStackVisual';
import { createDefaultPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('RatioStackVisual', () => {
  it('sizes each segment proportionally to its role percentage, not with static widths', () => {
    const palette = createDefaultPalette();
    render(<RatioStackVisual palette={palette} orientation="horizontal" />);

    expect(screen.getByText('60%').closest('div')).toHaveStyle({ flexGrow: '60' });
    expect(screen.getByText('30%').closest('div')).toHaveStyle({ flexGrow: '30' });
    expect(screen.getByText('10%').closest('div')).toHaveStyle({ flexGrow: '10' });
  });

  it('renders each segment with the actual selected colour, not a fixed default', () => {
    const palette = createDefaultPalette();
    const customAccent = toColour('#00A86B');
    if (!customAccent) throw new Error('expected a valid colour');
    palette.accent = { ...palette.accent, colour: customAccent };

    render(<RatioStackVisual palette={palette} orientation="horizontal" />);

    const accentSegment = screen.getByText('10%').closest('div');
    expect(accentSegment).toHaveStyle({ backgroundColor: '#00A86B' });
  });

  it('exposes the current balance through an accessible label', () => {
    const palette = createDefaultPalette();
    render(<RatioStackVisual palette={palette} />);

    expect(
      screen.getByRole('img', {
        name: /60% Dominant, #F7F5F0.*30% Secondary, #D9D4CC.*10% Accent, #C74504/,
      }),
    ).toBeInTheDocument();
  });
});
