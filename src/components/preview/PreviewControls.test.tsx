import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewControls } from '@/components/preview/PreviewControls';

describe('PreviewControls', () => {
  it('marks the active template and viewport as selected', () => {
    render(
      <PreviewControls
        templateId="dashboard"
        viewport="tablet"
        onTemplateChange={vi.fn()}
        onViewportChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Landing Page' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: 'Tablet' })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls back immediately when a template or viewport is chosen', async () => {
    const user = userEvent.setup();
    const onTemplateChange = vi.fn();
    const onViewportChange = vi.fn();

    render(
      <PreviewControls
        templateId="landing"
        viewport="desktop"
        onTemplateChange={onTemplateChange}
        onViewportChange={onViewportChange}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'Content' }));
    expect(onTemplateChange).toHaveBeenCalledWith('content');

    await user.click(screen.getByRole('tab', { name: 'Mobile' }));
    expect(onViewportChange).toHaveBeenCalledWith('mobile');
  });
});
