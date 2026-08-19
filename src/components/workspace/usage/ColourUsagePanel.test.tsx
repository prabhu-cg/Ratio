import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColourUsagePanel } from '@/components/workspace/usage/ColourUsagePanel';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('ColourUsagePanel', () => {
  it('renders nothing when closed', () => {
    render(<ColourUsagePanel open={false} onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('lists all four roles with their live palette colour and ratio label', () => {
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    const dialog = screen.getByRole('dialog', { name: 'Colour usage' });

    expect(within(dialog).getByText('Dominant')).toBeInTheDocument();
    expect(within(dialog).getByText('60% of visual hierarchy')).toBeInTheDocument();
    expect(within(dialog).getByText('#F7F5F0')).toBeInTheDocument();

    expect(within(dialog).getByText('Secondary')).toBeInTheDocument();
    expect(within(dialog).getByText('30% of visual hierarchy')).toBeInTheDocument();

    expect(within(dialog).getByText('Accent')).toBeInTheDocument();
    expect(within(dialog).getByText('10% of visual hierarchy')).toBeInTheDocument();

    expect(within(dialog).getByText('Text / Foreground')).toBeInTheDocument();
    expect(within(dialog).getByText('Supporting colour — outside the ratio')).toBeInTheDocument();
  });

  it('reflects the current palette, not a fixed default, when a colour has been changed', () => {
    const palette = createDefaultProjectPalette();
    const newAccent = toColour('#00A86B');
    if (!newAccent) throw new Error('expected a valid colour');
    palette.ratio.accent = { ...palette.ratio.accent, colour: newAccent };

    render(<ColourUsagePanel open onClose={vi.fn()} palette={palette} />);

    expect(screen.getByText('#00A86B')).toBeInTheDocument();
    expect(screen.queryByText('#C74504')).not.toBeInTheDocument();
  });

  it('shows typical usage examples for each role', () => {
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    expect(screen.getByText('Page backgrounds')).toBeInTheDocument();
    expect(screen.getByText('Primary actions')).toBeInTheDocument();
    expect(screen.getByText('Headings')).toBeInTheDocument();
  });

  it('closes via the close button', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ColourUsagePanel open onClose={handleClose} palette={createDefaultProjectPalette()} />);

    await user.click(screen.getByRole('button', { name: 'Close colour usage' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ColourUsagePanel open onClose={handleClose} palette={createDefaultProjectPalette()} />);

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });
});
