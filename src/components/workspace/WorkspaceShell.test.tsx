import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

function renderWorkspace() {
  render(
    <MemoryRouter>
      <WorkspaceShell />
    </MemoryRouter>,
  );
}

describe('WorkspaceShell', () => {
  it('starts with the default 60/30/10 palette', () => {
    renderWorkspace();

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('updates the ratio visualisation immediately when a colour changes via the hex input', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const accentInput = screen.getByLabelText('Accent hex value');
    await user.clear(accentInput);
    await user.type(accentInput, '#00A86B');
    await user.tab();

    expect(screen.getByRole('img', { name: /#00A86B/ })).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('rejects an invalid hex value with an inline error and leaves the visual unchanged', async () => {
    const user = userEvent.setup();
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
    renderWorkspace();

    const secondaryInput = screen.getByLabelText('Secondary hex value');
    await user.clear(secondaryInput);
    await user.type(secondaryInput, '#000');
    await user.tab();

    expect(screen.getByRole('img', { name: /30% Secondary, #000000/ })).toBeInTheDocument();
  });

  it('only enables Reset after a real change, and restores defaults on confirm', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();

    const accentInput = screen.getByLabelText('Accent hex value');
    await user.clear(accentInput);
    await user.type(accentInput, '#00A86B');
    await user.tab();

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    expect(resetButton).toBeEnabled();

    await user.click(resetButton);
    expect(screen.getByText('Reset to default palette?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('shows the Text / Foreground supporting control alongside the ratio controls', () => {
    renderWorkspace();

    expect(screen.getByText('Supporting colours')).toBeInTheDocument();
    expect(screen.getByLabelText('Text / Foreground hex value')).toBeInTheDocument();
  });

  it('changing Text / Foreground updates its own control and leaves the 60/30/10 ratio untouched', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const textInput = screen.getByLabelText('Text / Foreground hex value');
    await user.clear(textInput);
    await user.type(textInput, '#123456');
    await user.tab();

    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0.*30% Secondary, #D9D4CC.*10% Accent, #C74504/ }))
      .toBeInTheDocument();
  });

  it('reset restores all four project colours, including Text / Foreground', async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const accentInput = screen.getByLabelText('Accent hex value');
    await user.clear(accentInput);
    await user.type(accentInput, '#00A86B');
    await user.tab();

    const textInput = screen.getByLabelText('Text / Foreground hex value');
    await user.clear(textInput);
    await user.type(textInput, '#123456');
    await user.tab();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(screen.getByRole('img', { name: /60% Dominant, #F7F5F0/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Text / Foreground hex value')).toHaveValue('#444444');
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});
