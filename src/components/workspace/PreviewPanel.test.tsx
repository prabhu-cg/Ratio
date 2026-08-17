import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { usePreviewSettings } from '@/hooks/usePreviewSettings';
import { createDefaultPalette } from '@/types/palette';
import { toColour } from '@/lib/color';
import type { RatioPalette } from '@/types/palette';

function Harness({ palette }: { palette: RatioPalette }) {
  const { templateId, setTemplateId, viewport, setViewport, visionMode, setVisionMode } =
    usePreviewSettings();

  return (
    <PreviewPanel
      palette={palette}
      templateId={templateId}
      viewport={viewport}
      visionMode={visionMode}
      onTemplateChange={setTemplateId}
      onViewportChange={setViewport}
      onVisionModeChange={setVisionMode}
    />
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('PreviewPanel', () => {
  it('defaults to the Landing Page template at the Desktop viewport', () => {
    render(<Harness palette={createDefaultPalette()} />);

    expect(screen.getByRole('tab', { name: 'Landing Page' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Desktop' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Design with confidence, ship with clarity')).toBeInTheDocument();
  });

  it('switches templates without needing a reload', async () => {
    const user = userEvent.setup();
    render(<Harness palette={createDefaultPalette()} />);

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

    render(<Harness palette={palette} />);

    const varHost = screen
      .getByText('Design with confidence, ship with clarity')
      .closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({ '--preview-accent': '#2563EB' });
  });

  it('applies a colour-vision simulation to the preview immediately when selected', async () => {
    const user = userEvent.setup();
    render(<Harness palette={createDefaultPalette()} />);

    const varHost = screen
      .getByText('Design with confidence, ship with clarity')
      .closest('.\\@container') as HTMLElement;
    expect(varHost).toHaveStyle({ filter: 'none' });

    await user.click(screen.getByRole('tab', { name: 'Tritanopia' }));

    expect(varHost).toHaveStyle({ filter: 'url(#ratio-vision-tritanopia)' });
  });
});
