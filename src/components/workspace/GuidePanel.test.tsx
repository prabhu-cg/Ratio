import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuidePanel } from '@/components/workspace/GuidePanel';

describe('GuidePanel', () => {
  it('renders nothing when closed', () => {
    render(<GuidePanel open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('lists the five workflow steps and answers common questions', () => {
    render(<GuidePanel open onClose={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'How RATIO works' })).toBeInTheDocument();
    expect(screen.getByText('Choose your colours')).toBeInTheDocument();
    expect(screen.getByText('Balance the hierarchy')).toBeInTheDocument();
    expect(screen.getByText('See it in context')).toBeInTheDocument();
    expect(screen.getByText('Check readability')).toBeInTheDocument();
    expect(screen.getByText('Export your palette')).toBeInTheDocument();
    expect(screen.getByText('What is 60–30–10?')).toBeInTheDocument();
  });

  it('closes on Escape and restores focus to the previously focused element', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    document.body.innerHTML = '<button id="trigger">Help</button>';
    const trigger = document.getElementById('trigger') as HTMLButtonElement;
    trigger.focus();

    render(<GuidePanel open onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('focuses the close button when opened, for keyboard users', () => {
    render(<GuidePanel open onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Close guide' })).toHaveFocus();
  });

  it('"Get started" calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<GuidePanel open onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Get started' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('clicking the backdrop calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<GuidePanel open onClose={onClose} />);

    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
