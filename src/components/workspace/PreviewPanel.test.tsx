import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { usePreviewSettings } from '@/hooks/usePreviewSettings';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';
import type { ProjectPalette } from '@/types/palette';

function Harness({ palette }: { palette: ProjectPalette }) {
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
    render(<Harness palette={createDefaultProjectPalette()} />);

    expect(screen.getByRole('tab', { name: 'Landing Page' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Desktop' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Design with confidence, ship with clarity')).toBeInTheDocument();
  });

  it('switches templates without needing a reload', async () => {
    const user = userEvent.setup();
    render(<Harness palette={createDefaultProjectPalette()} />);

    expect(screen.queryAllByText('Overview')).toHaveLength(0);

    await user.click(screen.getByRole('tab', { name: 'Dashboard' }));

    expect(screen.getAllByText('Overview').length).toBeGreaterThan(0);
    expect(screen.queryByText('Design with confidence, ship with clarity')).not.toBeInTheDocument();
  });

  it('reflects the live ratio palette inside the preview canvas immediately', () => {
    const palette = createDefaultProjectPalette();
    const customAccent = toColour('#2563EB');
    if (!customAccent) throw new Error('expected a valid colour');
    palette.ratio.accent = { ...palette.ratio.accent, colour: customAccent };

    render(<Harness palette={palette} />);

    const varHost = screen
      .getByText('Design with confidence, ship with clarity')
      .closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({ '--preview-accent': '#2563EB' });
  });

  it('reflects the live Text / Foreground colour inside the preview canvas immediately', () => {
    const palette = createDefaultProjectPalette();
    const customText = toColour('#123456');
    if (!customText) throw new Error('expected a valid colour');
    palette.supporting.text = { ...palette.supporting.text, colour: customText };

    render(<Harness palette={palette} />);

    const varHost = screen
      .getByText('Design with confidence, ship with clarity')
      .closest('.\\@container') as HTMLElement;

    expect(varHost).toHaveStyle({ '--preview-text': '#123456' });
  });

  it('applies a colour-vision simulation to the preview immediately when selected', async () => {
    const user = userEvent.setup();
    render(<Harness palette={createDefaultProjectPalette()} />);

    const varHost = screen
      .getByText('Design with confidence, ship with clarity')
      .closest('.\\@container') as HTMLElement;
    expect(varHost).toHaveStyle({ filter: 'none' });

    await user.selectOptions(screen.getByRole('combobox', { name: 'Vision' }), 'tritanopia');

    expect(varHost).toHaveStyle({ filter: 'url(#ratio-vision-tritanopia)' });
  });
});
