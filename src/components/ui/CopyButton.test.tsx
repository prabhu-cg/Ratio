import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyButton } from '@/components/ui/CopyButton';

describe('CopyButton', () => {
  it('confirms a copy with text, not colour alone', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const { rerender } = render(<CopyButton label="Copy hex" copied={false} onCopy={onCopy} />);

    expect(screen.getByRole('button', { name: 'Copy hex' })).toHaveTextContent('Copy');

    await user.click(screen.getByRole('button', { name: 'Copy hex' }));
    expect(onCopy).toHaveBeenCalledTimes(1);

    rerender(<CopyButton label="Copy hex" copied onCopy={onCopy} />);
    expect(screen.getByRole('button', { name: 'Copy hex' })).toHaveTextContent('Copied');
  });
});
