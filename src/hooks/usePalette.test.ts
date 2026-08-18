import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePalette } from '@/hooks/usePalette';
import { loadPersistedState } from '@/lib/storage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('usePalette persistence', () => {
  it('starts from the default palette when nothing is stored', () => {
    const { result } = renderHook(() => usePalette());
    expect(result.current.palette.ratio.accent.colour.hex).toBe('#C74504');
    expect(result.current.palette.ratio.secondary.colour.hex).toBe('#D9D4CC');
    expect(result.current.palette.supporting.text.colour.hex).toBe('#444444');
    expect(result.current.isModified).toBe(false);
  });

  it('persists colour changes to localStorage as they happen', () => {
    const { result } = renderHook(() => usePalette());

    act(() => {
      result.current.setRoleHex('accent', '#2563EB');
    });

    expect(loadPersistedState().accent).toBe('#2563EB');
  });

  it('can edit the Text / Foreground supporting colour independently of the ratio', () => {
    const { result } = renderHook(() => usePalette());

    act(() => {
      result.current.setRoleHex('text', '#111111');
    });

    expect(result.current.palette.supporting.text.colour.hex).toBe('#111111');
    expect(result.current.palette.ratio.dominant.colour.hex).toBe('#F7F5F0');
    expect(result.current.palette.ratio.secondary.colour.hex).toBe('#D9D4CC');
    expect(result.current.palette.ratio.accent.colour.hex).toBe('#C74504');
    expect(loadPersistedState().text).toBe('#111111');
  });

  it('restores a previously persisted palette on the next mount', () => {
    const first = renderHook(() => usePalette());
    act(() => {
      first.result.current.setRoleHex('accent', '#2563EB');
      first.result.current.setRoleHex('secondary', '#111111');
      first.result.current.setRoleHex('text', '#222222');
    });

    const second = renderHook(() => usePalette());
    expect(second.result.current.palette.ratio.accent.colour.hex).toBe('#2563EB');
    expect(second.result.current.palette.ratio.secondary.colour.hex).toBe('#111111');
    expect(second.result.current.palette.supporting.text.colour.hex).toBe('#222222');
    expect(second.result.current.isModified).toBe(true);
  });

  it('migrates old 3-colour persisted data safely, defaulting Text to #444444', () => {
    window.localStorage.setItem(
      'ratio:workspace:v1',
      JSON.stringify({ dominant: '#F7F5F0', secondary: '#D9D4CC', accent: '#C74504' }),
    );

    const { result } = renderHook(() => usePalette());
    expect(result.current.palette.supporting.text.colour.hex).toBe('#444444');
    expect(result.current.isModified).toBe(false);
  });

  it('ignores corrupted persisted colour values and falls back to defaults', () => {
    window.localStorage.setItem(
      'ratio:workspace:v1',
      JSON.stringify({ accent: 'not-a-colour', text: 'also-not-a-colour' }),
    );

    const { result } = renderHook(() => usePalette());
    expect(result.current.palette.ratio.accent.colour.hex).toBe('#C74504');
    expect(result.current.palette.supporting.text.colour.hex).toBe('#444444');
  });

  it('reset restores and persists the default 4-colour palette', () => {
    const { result } = renderHook(() => usePalette());

    act(() => {
      result.current.setRoleHex('accent', '#2563EB');
      result.current.setRoleHex('text', '#000000');
    });
    expect(result.current.isModified).toBe(true);

    act(() => {
      result.current.resetPalette();
    });

    expect(result.current.isModified).toBe(false);
    expect(loadPersistedState().accent).toBe('#C74504');
    expect(loadPersistedState().text).toBe('#444444');
  });
});
