import { describe, expect, it } from 'vitest';
import {
  USAGE_CONTEXTS,
  DEFAULT_USAGE_CONTEXT_ID,
  isUsageContextId,
  getUsageContext,
} from '@/lib/usageContexts';

describe('usage context registry', () => {
  it('defines exactly the five supported contexts, in order', () => {
    expect(USAGE_CONTEXTS.map((context) => context.id)).toEqual([
      'general',
      'marketing',
      'saas',
      'mobile',
      'editorial',
    ]);
  });

  it('defaults to General', () => {
    expect(DEFAULT_USAGE_CONTEXT_ID).toBe('general');
  });

  it('gives every context a non-empty name and description', () => {
    for (const context of USAGE_CONTEXTS) {
      expect(context.name.length).toBeGreaterThan(0);
      expect(context.description.length).toBeGreaterThan(0);
    }
  });

  describe('isUsageContextId', () => {
    it('accepts every real context id', () => {
      for (const context of USAGE_CONTEXTS) {
        expect(isUsageContextId(context.id)).toBe(true);
      }
    });

    it('rejects invalid, missing, or malformed values safely', () => {
      expect(isUsageContextId('not-a-context')).toBe(false);
      expect(isUsageContextId(undefined)).toBe(false);
      expect(isUsageContextId(null)).toBe(false);
      expect(isUsageContextId(42)).toBe(false);
      expect(isUsageContextId({})).toBe(false);
      expect(isUsageContextId('')).toBe(false);
    });
  });

  describe('getUsageContext', () => {
    it('returns the matching context', () => {
      expect(getUsageContext('marketing').name).toBe('Marketing Website');
      expect(getUsageContext('editorial').name).toBe('Editorial / Content');
    });
  });
});
