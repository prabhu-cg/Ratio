import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePreviewSettings } from '@/hooks/usePreviewSettings';
import { loadPersistedState } from '@/lib/storage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('usePreviewSettings persistence', () => {
  it('defaults to Landing Page, Desktop, Normal vision', () => {
    const { result } = renderHook(() => usePreviewSettings());
    expect(result.current.templateId).toBe('landing');
    expect(result.current.viewport).toBe('desktop');
    expect(result.current.visionMode).toBe('normal');
  });

  it('persists and restores the selected template, viewport, and vision mode', () => {
    const first = renderHook(() => usePreviewSettings());
    act(() => {
      first.result.current.setTemplateId('dashboard');
      first.result.current.setViewport('mobile');
      first.result.current.setVisionMode('deuteranopia');
    });

    expect(loadPersistedState()).toMatchObject({
      template: 'dashboard',
      viewport: 'mobile',
      visionMode: 'deuteranopia',
    });

    const second = renderHook(() => usePreviewSettings());
    expect(second.result.current.templateId).toBe('dashboard');
    expect(second.result.current.viewport).toBe('mobile');
    expect(second.result.current.visionMode).toBe('deuteranopia');
  });

  it('ignores an invalid persisted value and falls back to the default', () => {
    window.localStorage.setItem(
      'ratio:workspace:v1',
      JSON.stringify({ template: 'not-a-real-template' }),
    );

    const { result } = renderHook(() => usePreviewSettings());
    expect(result.current.templateId).toBe('landing');
  });

  it('resetVisionMode returns to Normal without touching template or viewport', () => {
    const { result } = renderHook(() => usePreviewSettings());
    act(() => {
      result.current.setTemplateId('content');
      result.current.setViewport('tablet');
      result.current.setVisionMode('protanopia');
    });

    act(() => {
      result.current.resetVisionMode();
    });

    expect(result.current.visionMode).toBe('normal');
    expect(result.current.templateId).toBe('content');
    expect(result.current.viewport).toBe('tablet');
  });
});
