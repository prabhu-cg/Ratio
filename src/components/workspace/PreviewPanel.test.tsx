import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { createDefaultPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('PreviewPanel', () => {
  it('defaults to the Landing Page template at the Desktop viewport', () => {
    render(<PreviewPanel palette={createDefaultPalette()} />);

    expect(screen.getByRole('tab', { name: 'Landing Page' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Desktop' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Design with confidence, ship with clarity')).toBeInTheDocument();
  });

  it('switches templates without needing a reload', async () => {
    const user = userEvent.setup();
    render(<PreviewPanel palette={createDefaultPalette()} />);

    expect(screen.queryAllByText('Overview')).toHaveLength(0);

    await user.click(screen.getByRole('tab', { name: 'Dashboard' }));

    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0);
    expect(screen.queryByText('Design with confidence, ship with clarity')).not.toBeInTheDocument();
  });

  it('reflects the live palette inside the preview canvas immediately', () => {
    const palette = createDefaultPalette();
    const customAccent = toColour('#2563EB');
    if (!customAccent) throw new Error('expected a valid colour');
    palette.accent = { ...palette.accent, colour: customAccent };

    render(<PreviewPanel palette={palette} />);

    const varHost = screen
      .getByText('Design with confidence, ship with clarity')
      .closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({ '--preview-accent': '#2563EB' });
  });
});
