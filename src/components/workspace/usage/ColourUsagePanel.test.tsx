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

  it('shows all four roles as selectable tabs, with Dominant selected by default', () => {
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    const tablist = screen.getByRole('tablist', { name: 'Colour role' });
    const tabs = within(tablist).getAllByRole('tab');

    expect(tabs.map((tab) => tab.textContent)).toEqual(['Dominant', 'Secondary', 'Accent', 'Text / Foreground']);
    expect(within(tablist).getByRole('tab', { name: 'Dominant' })).toHaveAttribute('aria-selected', 'true');
    expect(within(tablist).getByRole('tab', { name: 'Secondary' })).toHaveAttribute('aria-selected', 'false');
  });

  it('shows the selected role\'s live colour, hex, ratio label and purpose', () => {
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    const detail = screen.getByRole('tabpanel');
    expect(within(detail).getByText('Dominant')).toBeInTheDocument();
    expect(within(detail).getByText('#F7F5F0')).toBeInTheDocument();
    expect(within(detail).getByText('60% of visual hierarchy')).toBeInTheDocument();
    expect(within(detail).getByText('Provides the main visual foundation.')).toBeInTheDocument();
  });

  it('lists Common uses for the selected role, collapsed by default', () => {
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    expect(screen.getByText('Common uses')).toBeInTheDocument();
    expect(screen.getByText('Page background')).toBeInTheDocument();
    expect(screen.getByText('Main canvas')).toBeInTheDocument();
    expect(screen.getByText('Large layout regions')).toBeInTheDocument();

    for (const details of document.querySelectorAll('details')) {
      expect(details).not.toHaveAttribute('open');
    }
  });

  it('selecting a role updates the detail panel, including for Text / Foreground being outside the ratio', async () => {
    const user = userEvent.setup();
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    await user.click(screen.getByRole('tab', { name: 'Text / Foreground' }));

    expect(screen.getByRole('tab', { name: 'Text / Foreground' })).toHaveAttribute('aria-selected', 'true');
    const detail = screen.getByRole('tabpanel');
    expect(within(detail).getByText('#444444')).toBeInTheDocument();
    expect(within(detail).getByText('Supporting colour — outside the ratio')).toBeInTheDocument();
    expect(screen.getByText('Headings')).toBeInTheDocument();
  });

  it('supports arrow-key navigation between role tabs, moving focus with selection', async () => {
    const user = userEvent.setup();
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    screen.getByRole('tab', { name: 'Dominant' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Secondary' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Secondary' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Dominant' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Dominant' })).toHaveFocus();
  });

  it('expanding a usage item shows its description, category, and (where applicable) a live visual example', async () => {
    const user = userEvent.setup();
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    await user.click(screen.getByText('Page background'));

    const detailsEl = screen.getByText('Page background').closest('details');
    expect(detailsEl).not.toBeNull();
    const item = within(detailsEl as HTMLElement);

    expect(item.getByText('The base surface behind everything else in the interface.')).toBeInTheDocument();
    expect(item.getByText('Surface')).toBeInTheDocument();
    expect(
      item.getByRole('img', { name: /Miniature page canvas using your Dominant colour, #F7F5F0/ }),
    ).toBeInTheDocument();
  });

  it('updates the visual example immediately when the underlying colour changes', () => {
    const palette = createDefaultProjectPalette();
    const { rerender } = render(<ColourUsagePanel open onClose={vi.fn()} palette={palette} />);

    const newDominant = toColour('#001122');
    if (!newDominant) throw new Error('expected a valid colour');
    const updated = {
      ...palette,
      ratio: { ...palette.ratio, dominant: { ...palette.ratio.dominant, colour: newDominant } },
    };

    rerender(<ColourUsagePanel open onClose={vi.fn()} palette={updated} />);

    expect(screen.getByRole('tabpanel')).toHaveTextContent('#001122');
  });

  it('closes via the close button and on Escape', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<ColourUsagePanel open onClose={handleClose} palette={createDefaultProjectPalette()} />);

    await user.click(screen.getByRole('button', { name: 'Close colour usage' }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('includes the educational note about roles being guides, not fixed rules', () => {
    render(<ColourUsagePanel open onClose={vi.fn()} palette={createDefaultProjectPalette()} />);

    expect(screen.getByText(/guides, not fixed rules/i)).toBeInTheDocument();
    expect(screen.getByText(/not a strict requirement for every interface element/i)).toBeInTheDocument();
  });

  it('does not break when every project colour is identical', async () => {
    const user = userEvent.setup();
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

    render(<ColourUsagePanel open onClose={vi.fn()} palette={flattened} />);

    for (const roleName of ['Dominant', 'Secondary', 'Accent', 'Text / Foreground']) {
      await user.click(screen.getByRole('tab', { name: roleName }));
      expect(screen.getByRole('tabpanel')).toHaveTextContent('#808080');
    }
  });
});
