import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewControls } from '@/components/preview/PreviewControls';

describe('PreviewControls', () => {
  it('marks the active template and viewport as selected, and the vision mode as the select value', () => {
    render(
      <PreviewControls
        templateId="dashboard"
        viewport="tablet"
        visionMode="deuteranopia"
        onTemplateChange={vi.fn()}
        onViewportChange={vi.fn()}
        onVisionModeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Landing Page' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: 'Tablet' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('combobox', { name: 'Vision' })).toHaveValue('deuteranopia');
  });

  it('calls back immediately when a template, viewport, or vision mode is chosen', async () => {
    const user = userEvent.setup();
    const onTemplateChange = vi.fn();
    const onViewportChange = vi.fn();
    const onVisionModeChange = vi.fn();

    render(
      <PreviewControls
        templateId="landing"
        viewport="desktop"
        visionMode="normal"
        onTemplateChange={onTemplateChange}
        onViewportChange={onViewportChange}
        onVisionModeChange={onVisionModeChange}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'Content' }));
    expect(onTemplateChange).toHaveBeenCalledWith('content');

    await user.click(screen.getByRole('tab', { name: 'Mobile' }));
    expect(onViewportChange).toHaveBeenCalledWith('mobile');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Vision' }), 'grayscale');
    expect(onVisionModeChange).toHaveBeenCalledWith('grayscale');
  });
});
