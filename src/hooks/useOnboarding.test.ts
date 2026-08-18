import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useOnboarding } from '@/hooks/useOnboarding';

beforeEach(() => {
  window.localStorage.clear();
});

describe('useOnboarding', () => {
  it('opens the guide automatically when nothing has been dismissed yet', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isGuideOpen).toBe(true);
  });

  it('does not open automatically once a previous visit dismissed it', () => {
    window.localStorage.setItem('ratio:onboarding-dismissed:v1', '1');
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isGuideOpen).toBe(false);
  });

  it('dismissing closes the guide and persists the dismissal', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => result.current.dismissGuide());

    expect(result.current.isGuideOpen).toBe(false);
    expect(window.localStorage.getItem('ratio:onboarding-dismissed:v1')).toBe('1');
  });

  it('does not reopen automatically on the next mount once dismissed', () => {
    const first = renderHook(() => useOnboarding());
    act(() => first.result.current.dismissGuide());

    const second = renderHook(() => useOnboarding());
    expect(second.result.current.isGuideOpen).toBe(false);
  });

  it('can be reopened on demand after being dismissed', () => {
    const { result } = renderHook(() => useOnboarding());
    act(() => result.current.dismissGuide());

    act(() => result.current.openGuide());

    expect(result.current.isGuideOpen).toBe(true);
  });
});
