import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useUsageContext } from '@/hooks/useUsageContext';
import { loadPersistedState } from '@/lib/storage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useUsageContext persistence', () => {
  it('defaults to General', () => {
    const { result } = renderHook(() => useUsageContext());
    expect(result.current.contextId).toBe('general');
  });

  it('persists the selected context across remounts ("refresh")', () => {
    const first = renderHook(() => useUsageContext());
    act(() => {
      first.result.current.setContextId('marketing');
    });

    expect(loadPersistedState()).toMatchObject({ usageContext: 'marketing' });

    const second = renderHook(() => useUsageContext());
    expect(second.result.current.contextId).toBe('marketing');
  });

  it('falls back safely to General when the persisted context is invalid', () => {
    window.localStorage.setItem(
      'ratio:workspace:v1',
      JSON.stringify({ usageContext: 'not-a-real-context' }),
    );

    const { result } = renderHook(() => useUsageContext());
    expect(result.current.contextId).toBe('general');
  });

  it('falls back safely when the persisted context is missing entirely', () => {
    window.localStorage.setItem('ratio:workspace:v1', JSON.stringify({ dominant: '#000000' }));

    const { result } = renderHook(() => useUsageContext());
    expect(result.current.contextId).toBe('general');
  });

  it('does not touch the persisted palette fields', () => {
    window.localStorage.setItem(
      'ratio:workspace:v1',
      JSON.stringify({ dominant: '#123456', secondary: '#ABCDEF' }),
    );

    const { result } = renderHook(() => useUsageContext());
    act(() => {
      result.current.setContextId('editorial');
    });

    expect(loadPersistedState()).toMatchObject({
      dominant: '#123456',
      secondary: '#ABCDEF',
      usageContext: 'editorial',
    });
  });
});
