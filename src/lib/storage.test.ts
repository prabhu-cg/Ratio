import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearPersistedState, isStorageAvailable, loadPersistedState, patchPersistedState } from '@/lib/storage';

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadPersistedState / patchPersistedState', () => {
  it('returns an empty object when nothing is stored', () => {
    expect(loadPersistedState()).toEqual({});
  });

  it('round-trips a patch through localStorage', () => {
    patchPersistedState({ dominant: '#F7F5F0' });
    expect(loadPersistedState()).toEqual({ dominant: '#F7F5F0' });
  });

  it('merges patches instead of clobbering unrelated fields', () => {
    patchPersistedState({ dominant: '#F7F5F0', secondary: '#444444' });
    patchPersistedState({ template: 'dashboard' });

    expect(loadPersistedState()).toEqual({
      dominant: '#F7F5F0',
      secondary: '#444444',
      template: 'dashboard',
    });
  });

  it('overwrites only the fields present in the patch', () => {
    patchPersistedState({ viewport: 'desktop' });
    patchPersistedState({ viewport: 'mobile' });

    expect(loadPersistedState().viewport).toBe('mobile');
  });

  it('recovers gracefully from corrupted JSON instead of throwing', () => {
    window.localStorage.setItem('ratio:workspace:v1', '{not valid json');
    expect(loadPersistedState()).toEqual({});
  });

  it('recovers gracefully from a stored value that is not an object', () => {
    window.localStorage.setItem('ratio:workspace:v1', '"just a string"');
    expect(loadPersistedState()).toEqual({});
  });
});

describe('clearPersistedState', () => {
  it('removes everything that was stored', () => {
    patchPersistedState({ dominant: '#C74504' });
    clearPersistedState();
    expect(loadPersistedState()).toEqual({});
  });
});

describe('graceful degradation when localStorage throws', () => {
  it('patchPersistedState does not throw when setItem is unavailable', () => {
    const spy = vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });

    expect(() => patchPersistedState({ dominant: '#C74504' })).not.toThrow();

    spy.mockRestore();
  });

  it('loadPersistedState returns {} when getItem is unavailable', () => {
    const spy = vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });

    expect(loadPersistedState()).toEqual({});

    spy.mockRestore();
  });

  it('isStorageAvailable reflects whether storage actually works', () => {
    expect(isStorageAvailable()).toBe(true);

    const spy = vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });
    expect(isStorageAvailable()).toBe(false);
    spy.mockRestore();
  });
});
