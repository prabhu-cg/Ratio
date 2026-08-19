import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColourUsagePanel } from '@/components/workspace/usage/ColourUsagePanel';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';
import { USAGE_CONTEXTS } from '@/lib/usageContexts';
import type { ProjectPalette } from '@/types/palette';

beforeEach(() => {
  window.localStorage.clear();
});

/**
 * V1.9.4 QA pass — section 6 (colour edge cases). The Usage Map must
 * remain fully functional (render, all roles selectable, all contexts
 * selectable, visual examples render) regardless of how extreme or
 * degenerate the user's actual palette is. Examples are never hidden
 * because colours are similar or hard to read — that's the accessibility
 * engine's job elsewhere in the app, not this feature's.
 */
function buildPalette(hexes: { dominant: string; secondary: string; accent: string; text: string }): ProjectPalette {
  const base = createDefaultProjectPalette();
  const colour = (hex: string) => {
    const c = toColour(hex);
    if (!c) throw new Error(`invalid test hex: ${hex}`);
    return c;
  };

  return {
    ratio: {
      dominant: { ...base.ratio.dominant, colour: colour(hexes.dominant) },
      secondary: { ...base.ratio.secondary, colour: colour(hexes.secondary) },
      accent: { ...base.ratio.accent, colour: colour(hexes.accent) },
    },
    supporting: {
      text: { ...base.supporting.text, colour: colour(hexes.text) },
    },
  };
}

const EDGE_CASE_PALETTES: Record<string, ReturnType<typeof buildPalette>> = {
  'all colours identical': buildPalette({
    dominant: '#808080',
    secondary: '#808080',
    accent: '#808080',
    text: '#808080',
  }),
  'black palette': buildPalette({ dominant: '#000000', secondary: '#000000', accent: '#000000', text: '#000000' }),
  'white palette': buildPalette({ dominant: '#FFFFFF', secondary: '#FFFFFF', accent: '#FFFFFF', text: '#FFFFFF' }),
  'very light palette': buildPalette({
    dominant: '#FEFEFE',
    secondary: '#FAFAFA',
    accent: '#F5F5F5',
    text: '#EFEFEF',
  }),
  'very dark palette': buildPalette({ dominant: '#0A0A0A', secondary: '#050505', accent: '#020202', text: '#000000' }),
  'low-contrast palette': buildPalette({
    dominant: '#888888',
    secondary: '#8A8A8A',
    accent: '#8C8C8C',
    text: '#909090',
  }),
  'highly saturated palette': buildPalette({
    dominant: '#FF00FF',
    secondary: '#00FFFF',
    accent: '#FFFF00',
    text: '#FF0000',
  }),
};

describe('Colour Usage Map — colour edge cases', () => {
  for (const [label, palette] of Object.entries(EDGE_CASE_PALETTES)) {
    describe(label, () => {
      it('renders without throwing, with all four roles selectable', async () => {
        const user = userEvent.setup();
        render(<ColourUsagePanel open onClose={vi.fn()} palette={palette} />);

        expect(screen.getByRole('dialog', { name: 'Colour usage' })).toBeInTheDocument();

        for (const roleName of ['Dominant', 'Secondary', 'Accent', 'Text / Foreground']) {
          await user.click(screen.getByRole('tab', { name: roleName }));
          expect(screen.getByRole('tab', { name: roleName })).toHaveAttribute('aria-selected', 'true');
        }
      });

      it('renders every context without throwing, and does not hide the context preview', async () => {
        const user = userEvent.setup();
        render(<ColourUsagePanel open onClose={vi.fn()} palette={palette} />);

        for (const context of USAGE_CONTEXTS) {
          await user.selectOptions(screen.getByLabelText('Context'), context.id);
          expect(screen.getByLabelText('Context')).toHaveValue(context.id);
          expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
        }
      });

      it('renders visual examples for usage items without hiding them', async () => {
        const user = userEvent.setup();
        render(<ColourUsagePanel open onClose={vi.fn()} palette={palette} />);

        await user.click(screen.getByRole('tab', { name: 'Accent' }));
        await user.click(screen.getByText('Primary buttons'));

        expect(screen.getByRole('img', { name: /primary button/i })).toBeInTheDocument();
      });
    });
  }
});
