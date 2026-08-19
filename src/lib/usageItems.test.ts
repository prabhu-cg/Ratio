import { describe, expect, it } from 'vitest';
import {
  USAGE_ITEMS,
  getUsageItemsForRole,
  getUsageItemsForRoleByCategory,
  getUsageItemCount,
} from '@/lib/usageItems';
import { COLOUR_ROLE_ORDER } from '@/lib/colourRoles';

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
});
