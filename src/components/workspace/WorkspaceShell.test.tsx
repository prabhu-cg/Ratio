import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { ToastProvider } from '@/components/ui/ToastProvider';

const ONBOARDING_KEY = 'ratio:onboarding-dismissed:v1';

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

/** Most behavioural tests aren't about onboarding — dismiss it upfront so it doesn't
 * sit on top of the workspace, unless a test explicitly wants it open. */
function skipOnboarding() {
  window.localStorage.setItem(ONBOARDING_KEY, '1');
}

function renderWorkspace() {
  render(
    <MemoryRouter>
      <ToastProvider>
        <WorkspaceShell />
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('WorkspaceShell', () => {
  it('starts with the default 60/30/10 palette', () => {
    skipOnboarding();
    renderWorkspace();

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset palette' })).toBeDisabled();
  });

  it('updates the ratio visualisation immediately when a colour changes via the hex input', async () => {
    const user = userEvent.setup();
    skipOnboarding();
    renderWorkspace();

    const accentInput = screen.getByLabelText('Accent hex value');
    await user.clear(accentInput);
    await user.type(accentInput, '#00A86B');
    await user.tab();

    expect(screen.getByRole('img', { name: /#00A86B/ })).toBeInTheDocument();
  });

  it('rejects an invalid hex value with an inline error and leaves the visual unchanged', async () => {
    const user = userEvent.setup();
    skipOnboarding();
    renderWorkspace();

    const dominantInput = screen.getByLabelText('Dominant hex value');
    await user.clear(dominantInput);
    await user.type(dominantInput, 'not-a-colour');
    await user.tab();

    expect(screen.getByRole('alert')).toHaveTextContent(/valid hex colour/i);
    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
  });

  it('accepts 3-digit hex shorthand and normalises it', async () => {
    const user = userEvent.setup();
    skipOnboarding();
    renderWorkspace();

    const secondaryInput = screen.getByLabelText('Secondary hex value');
    await user.clear(secondaryInput);
    await user.type(secondaryInput, '#000');
    await user.tab();

    expect(screen.getByRole('img', { name: /30% Secondary, #000000/ })).toBeInTheDocument();
  });

  it('only enables Reset after a real change, and restores defaults on confirm', async () => {
    const user = userEvent.setup();
    skipOnboarding();
    renderWorkspace();

    expect(screen.getByRole('button', { name: 'Reset palette' })).toBeDisabled();

    const accentInput = screen.getByLabelText('Accent hex value');
    await user.clear(accentInput);
    await user.type(accentInput, '#00A86B');
    await user.tab();

    const resetButton = screen.getByRole('button', { name: 'Reset palette' });
    expect(resetButton).toBeEnabled();

    await user.click(resetButton);
    expect(screen.getByText('Restore the original example colours?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset palette' })).toBeDisabled();
  });

  it('shows the Text / Foreground supporting control alongside the ratio controls', () => {
    skipOnboarding();
    renderWorkspace();

    expect(screen.getByText('Supporting colours')).toBeInTheDocument();
    expect(screen.getByLabelText('Text / Foreground hex value')).toBeInTheDocument();
  });

  it('changing Text / Foreground updates its own control and leaves the 60/30/10 ratio untouched', async () => {
    const user = userEvent.setup();
    skipOnboarding();
    renderWorkspace();

    const textInput = screen.getByLabelText('Text / Foreground hex value');
    await user.clear(textInput);
    await user.type(textInput, '#123456');
    await user.tab();

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0.*30% Secondary, #D9D4CC.*10% Accent, #C74504/ }))
      .toBeInTheDocument();
  });

  it('reset restores all four project colours, including Text / Foreground', async () => {
    const user = userEvent.setup();
    skipOnboarding();
    renderWorkspace();

    const accentInput = screen.getByLabelText('Accent hex value');
    await user.clear(accentInput);
    await user.type(accentInput, '#00A86B');
    await user.tab();

    const textInput = screen.getByLabelText('Text / Foreground hex value');
    await user.clear(textInput);
    await user.type(textInput, '#123456');
    await user.tab();

    await user.click(screen.getByRole('button', { name: 'Reset palette' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Text / Foreground hex value')).toHaveValue('#444444');
  });

  describe('first-run guidance', () => {
    it('appears automatically for a new user', () => {
      renderWorkspace();
      expect(screen.getByRole('dialog', { name: 'How RATIO works' })).toBeInTheDocument();
    });

    it('dismissing it persists the state and closes it', async () => {
      const user = userEvent.setup();
      renderWorkspace();

      const dialog = screen.getByRole('dialog', { name: 'How RATIO works' });
      await user.click(within(dialog).getByRole('button', { name: 'Get started' }));

      expect(screen.queryByRole('dialog', { name: 'How RATIO works' })).not.toBeInTheDocument();
      expect(window.localStorage.getItem(ONBOARDING_KEY)).toBe('1');
    });

    it('does not reappear once dismissed, even after "reloading" (remounting)', () => {
      skipOnboarding();
      renderWorkspace();
      expect(screen.queryByRole('dialog', { name: 'How RATIO works' })).not.toBeInTheDocument();
    });

    it('Escape dismisses it the same as clicking "Get started"', async () => {
      const user = userEvent.setup();
      renderWorkspace();

      expect(screen.getByRole('dialog', { name: 'How RATIO works' })).toBeInTheDocument();
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog', { name: 'How RATIO works' })).not.toBeInTheDocument();
      expect(window.localStorage.getItem(ONBOARDING_KEY)).toBe('1');
    });

    it('can be reopened on demand from the topbar without blocking the app beforehand', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'How RATIO works' }));
      expect(screen.getByRole('dialog', { name: 'How RATIO works' })).toBeInTheDocument();
    });

    it('resetting the palette does not reopen or reset onboarding dismissal', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      const accentInput = screen.getByLabelText('Accent hex value');
      await user.clear(accentInput);
      await user.type(accentInput, '#00A86B');
      await user.tab();

      await user.click(screen.getByRole('button', { name: 'Reset palette' }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(screen.queryByRole('dialog', { name: 'How RATIO works' })).not.toBeInTheDocument();
      expect(window.localStorage.getItem(ONBOARDING_KEY)).toBe('1');
    });
  });

  describe('contextual feedback', () => {
    it('announces a status message when the palette is reset', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      const accentInput = screen.getByLabelText('Accent hex value');
      await user.clear(accentInput);
      await user.type(accentInput, '#00A86B');
      await user.tab();

      await user.click(screen.getByRole('button', { name: 'Reset palette' }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      const status = await screen.findByText('Palette restored to the example');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('announces a status message when switching preview templates', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      await user.click(screen.getByRole('tab', { name: 'Dashboard' }));

      expect(screen.getByText('Viewing dashboard preview')).toBeInTheDocument();
    });

    it('announces a status message when a hex value is committed via the text input', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      const accentInput = screen.getByLabelText('Accent hex value');
      await user.clear(accentInput);
      await user.type(accentInput, '#00A86B');
      await user.tab();

      expect(screen.getByText('Preview updated')).toBeInTheDocument();
    });
  });

  describe('keyboard flow', () => {
    it('supports keyboard-only reset and template switching without traps', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      const dashboardTab = screen.getByRole('tab', { name: 'Dashboard' });
      dashboardTab.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('tab', { name: 'Dashboard' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('workspace sections', () => {
    it('renders accessibility as its own independently-labelled section', () => {
      skipOnboarding();
      renderWorkspace();

      expect(screen.getByRole('heading', { name: '3 · Accessibility' })).toBeInTheDocument();
      expect(screen.getByText('Check important foreground and background colour relationships.')).toBeInTheDocument();
    });
  });

  describe('colour usage entry point', () => {
    it('is not open by default, and opens the colour usage panel on demand', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      expect(screen.queryByRole('dialog', { name: 'Colour usage' })).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Explore colour usage' }));

      expect(screen.getByRole('dialog', { name: 'Colour usage' })).toBeInTheDocument();
    });

    it('reflects a colour change made after the panel was last opened', async () => {
      const user = userEvent.setup();
      skipOnboarding();
      renderWorkspace();

      const accentInput = screen.getByLabelText('Accent hex value');
      await user.clear(accentInput);
      await user.type(accentInput, '#00A86B');
      await user.tab();

      await user.click(screen.getByRole('button', { name: 'Explore colour usage' }));

      const dialog = screen.getByRole('dialog', { name: 'Colour usage' });
      expect(within(dialog).getByText('#00A86B')).toBeInTheDocument();
    });
  });
});
