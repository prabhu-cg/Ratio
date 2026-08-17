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
    expect(result.current.palette.accent.colour.hex).toBe('#C74504');
    expect(result.current.isModified).toBe(false);
  });

  it('persists colour changes to localStorage as they happen', () => {
    const { result } = renderHook(() => usePalette());

    act(() => {
      result.current.setRoleHex('accent', '#2563EB');
    });

    expect(loadPersistedState().accent).toBe('#2563EB');
  });

  it('restores a previously persisted palette on the next mount', () => {
    const first = renderHook(() => usePalette());
    act(() => {
      first.result.current.setRoleHex('accent', '#2563EB');
      first.result.current.setRoleHex('secondary', '#111111');
    });

    const second = renderHook(() => usePalette());
    expect(second.result.current.palette.accent.colour.hex).toBe('#2563EB');
    expect(second.result.current.palette.secondary.colour.hex).toBe('#111111');
    expect(second.result.current.isModified).toBe(true);
  });

  it('ignores corrupted persisted colour values and falls back to defaults', () => {
    window.localStorage.setItem(
      'ratio:workspace:v1',
      JSON.stringify({ accent: 'not-a-colour' }),
    );

    const { result } = renderHook(() => usePalette());
    expect(result.current.palette.accent.colour.hex).toBe('#C74504');
  });

  it('reset restores and persists the default palette', () => {
    const { result } = renderHook(() => usePalette());

    act(() => {
      result.current.setRoleHex('accent', '#2563EB');
    });
    expect(result.current.isModified).toBe(true);

    act(() => {
      result.current.resetPalette();
    });

    expect(result.current.isModified).toBe(false);
    expect(loadPersistedState().accent).toBe('#C74504');
  });
});
