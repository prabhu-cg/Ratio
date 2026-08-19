import { describe, expect, it } from 'vitest';
import {
  USAGE_ITEMS,
  getUsageItemsForRole,
  getUsageItemsForRoleAndContext,
  getUsageItemsForRoleByCategory,
  getUsageItemCount,
} from '@/lib/usageItems';
import { COLOUR_ROLE_ORDER } from '@/lib/colourRoles';
import { USAGE_CONTEXTS } from '@/lib/usageContexts';
import type { UsageContextId } from '@/types/usageContext';

describe('usage item catalogue', () => {
  it('never duplicates an id, even across roles', () => {
    const ids = USAGE_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every item has a non-empty label and description', () => {
    for (const item of USAGE_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    }
  });

  it('every item applies to one of the four known roles', () => {
    for (const item of USAGE_ITEMS) {
      expect(COLOUR_ROLE_ORDER).toContain(item.applicableRole);
    }
  });

  it('every role has at least one usage item, so the future map never shows an empty role', () => {
    for (const id of COLOUR_ROLE_ORDER) {
      expect(getUsageItemsForRole(id).length).toBeGreaterThan(0);
    }
  });

  it('getUsageItemsForRole only returns items for the requested role', () => {
    const accentItems = getUsageItemsForRole('accent');
    expect(accentItems.length).toBeGreaterThan(0);
    expect(accentItems.every((item) => item.applicableRole === 'accent')).toBe(true);
  });

  it('groups a role\'s items by category without losing or duplicating any', () => {
    const accentItems = getUsageItemsForRole('accent');
    const grouped = getUsageItemsForRoleByCategory('accent');
    const regrouped = Object.values(grouped).flat();

    expect(regrouped).toHaveLength(accentItems.length);
    expect(new Set(regrouped.map((item) => item.id))).toEqual(new Set(accentItems.map((item) => item.id)));
  });

  it('getUsageItemCount matches the actual number of items for a role', () => {
    for (const id of COLOUR_ROLE_ORDER) {
      expect(getUsageItemCount(id)).toBe(getUsageItemsForRole(id).length);
    }
  });

  describe('getUsageItemsForRoleAndContext', () => {
    it('General always returns the full, unfiltered catalogue for a role', () => {
      for (const id of COLOUR_ROLE_ORDER) {
        expect(getUsageItemsForRoleAndContext(id, 'general')).toEqual(getUsageItemsForRole(id));
      }
    });

    it('every non-general context returns at least one item per role, matching its tagged subset', () => {
      const nonGeneralContexts = USAGE_CONTEXTS.map((context) => context.id).filter(
        (id): id is UsageContextId => id !== 'general',
      );

      for (const contextId of nonGeneralContexts) {
        for (const roleId of COLOUR_ROLE_ORDER) {
          const items = getUsageItemsForRoleAndContext(roleId, contextId);
          expect(items.length).toBeGreaterThan(0);
          expect(items.every((item) => item.applicableRole === roleId)).toBe(true);
          expect(items.every((item) => item.contexts?.includes(contextId))).toBe(true);
        }
      }
    });

    it('a non-general context never returns more items than General for the same role', () => {
      for (const roleId of COLOUR_ROLE_ORDER) {
        const generalCount = getUsageItemsForRoleAndContext(roleId, 'general').length;
        for (const contextId of ['marketing', 'saas', 'mobile', 'editorial'] as const) {
          expect(getUsageItemsForRoleAndContext(roleId, contextId).length).toBeLessThanOrEqual(generalCount);
        }
      }
    });

    it('matches the exact per-role counts specified for Marketing Website', () => {
      expect(getUsageItemsForRoleAndContext('dominant', 'marketing')).toHaveLength(2);
      expect(getUsageItemsForRoleAndContext('secondary', 'marketing')).toHaveLength(2);
      expect(getUsageItemsForRoleAndContext('accent', 'marketing')).toHaveLength(3);
      expect(getUsageItemsForRoleAndContext('text', 'marketing')).toHaveLength(2);
    });

    it('matches the exact per-role counts specified for SaaS / Product', () => {
      expect(getUsageItemsForRoleAndContext('dominant', 'saas')).toHaveLength(2);
      expect(getUsageItemsForRoleAndContext('secondary', 'saas')).toHaveLength(3);
      expect(getUsageItemsForRoleAndContext('accent', 'saas')).toHaveLength(3);
      expect(getUsageItemsForRoleAndContext('text', 'saas')).toHaveLength(3);
    });

    it('matches the exact per-role counts specified for Mobile App', () => {
      expect(getUsageItemsForRoleAndContext('dominant', 'mobile')).toHaveLength(1);
      expect(getUsageItemsForRoleAndContext('secondary', 'mobile')).toHaveLength(3);
      expect(getUsageItemsForRoleAndContext('accent', 'mobile')).toHaveLength(2);
      expect(getUsageItemsForRoleAndContext('text', 'mobile')).toHaveLength(3);
    });

    it('matches the exact per-role counts specified for Editorial / Content', () => {
      expect(getUsageItemsForRoleAndContext('dominant', 'editorial')).toHaveLength(2);
      expect(getUsageItemsForRoleAndContext('secondary', 'editorial')).toHaveLength(2);
      expect(getUsageItemsForRoleAndContext('accent', 'editorial')).toHaveLength(3);
      expect(getUsageItemsForRoleAndContext('text', 'editorial')).toHaveLength(3);
    });
  });
});
