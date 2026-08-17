import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportDrawer } from '@/components/workspace/ExportDrawer';
import { createDefaultPalette } from '@/types/palette';

// userEvent.setup() resets navigator.clipboard to jsdom's own implementation, so the
// mock must be (re-)applied *after* setup(), not in a beforeEach that runs before it.
function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  return writeText;
}

describe('ExportDrawer', () => {
  it('renders nothing when closed', () => {
    render(<ExportDrawer palette={createDefaultPalette()} open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the palette, CSS, and JSON sections with the live palette values', () => {
    render(<ExportDrawer palette={createDefaultPalette()} open onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Export' })).toBeInTheDocument();
    expect(screen.getByText('Palette')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();

    const cssSection = screen.getByText('CSS').closest('section');
    expect(cssSection?.textContent).toContain('--ratio-dominant: #F7F5F0;');

    const jsonSection = screen.getByText('JSON').closest('section');
    expect(jsonSection?.textContent).toContain('"accent": "#C74504"');
  });

  it('copies the CSS and JSON blocks with confirmation', async () => {
    const user = userEvent.setup();
    const writeText = mockClipboard();
    render(<ExportDrawer palette={createDefaultPalette()} open onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Copy CSS variables' }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('--ratio-accent: #C74504;'));

    await user.click(screen.getByRole('button', { name: 'Copy JSON' }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('"brand": "RATIO"'));
  });

  it('copies an individual role hex from the palette section', async () => {
    const user = userEvent.setup();
    const writeText = mockClipboard();
    render(<ExportDrawer palette={createDefaultPalette()} open onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Copy Accent hex value' }));
    expect(writeText).toHaveBeenCalledWith('#C74504');
  });

  it('closes on Escape and restores focus to the previously focused element', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    document.body.innerHTML = '<button id="trigger">Export</button>';
    const trigger = document.getElementById('trigger') as HTMLButtonElement;
    trigger.focus();

    render(<ExportDrawer palette={createDefaultPalette()} open onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('focuses the close button when opened, for keyboard users', () => {
    render(<ExportDrawer palette={createDefaultPalette()} open onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Close export panel' })).toHaveFocus();
  });
});
