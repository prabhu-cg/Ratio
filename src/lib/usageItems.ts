import type { AnyRoleId } from '@/types/palette';
import type { UsageCategory, UsageItem } from '@/types/colourRole';

/**
 * The catalogue of concrete usage ideas behind the (future) Colour Usage
 * Map. This is the single list every role-to-usage lookup derives from —
 * there is no separate, hand-maintained "role → usage" config to drift out
 * of sync with it. IDs are unique across the whole catalogue, not just
 * within a role, so they can be addressed individually once the
 * interactive map exists.
 */
export const USAGE_ITEMS: UsageItem[] = [
  // Dominant — the main visual foundation.
  {
    id: 'dominant-page-background',
    label: 'Page background',
    description: 'The base surface behind everything else in the interface.',
    category: 'surface',
    applicableRole: 'dominant',
  },
  {
    id: 'dominant-main-canvas',
    label: 'Main canvas',
    description: 'The primary working area a user spends most of their time looking at.',
    category: 'surface',
    applicableRole: 'dominant',
  },
  {
    id: 'dominant-large-sections',
    label: 'Large layout regions',
    description: 'Broad structural areas, such as a page shell or content column.',
    category: 'surface',
    applicableRole: 'dominant',
  },

  // Secondary — adds structure and separation.
  {
    id: 'secondary-cards',
    label: 'Cards',
    description: 'Distinct content groupings that sit on top of the dominant surface.',
    category: 'surface',
    applicableRole: 'secondary',
  },
  {
    id: 'secondary-panels',
    label: 'Panels',
    description: 'Sidebars, drawers and other supporting regions alongside the main content.',
    category: 'surface',
    applicableRole: 'secondary',
  },
  {
    id: 'secondary-containers',
    label: 'Containers',
    description: 'Grouped sections that need light visual separation from what surrounds them.',
    category: 'surface',
    applicableRole: 'secondary',
  },

  // Accent — creates emphasis and draws attention.
  {
    id: 'accent-primary-buttons',
    label: 'Primary buttons',
    description: 'The main call-to-action a user is meant to notice first.',
    category: 'action',
    applicableRole: 'accent',
  },
  {
    id: 'accent-important-links',
    label: 'Important links',
    description: 'Links that need to stand out from ordinary body text.',
    category: 'action',
    applicableRole: 'accent',
  },
  {
    id: 'accent-highlights',
    label: 'Highlights',
    description: 'Drawing the eye to a specific piece of content or a new feature.',
    category: 'decoration',
    applicableRole: 'accent',
  },
  {
    id: 'accent-selected-states',
    label: 'Selected states',
    description: 'Showing which tab, item or option is currently active.',
    category: 'feedback',
    applicableRole: 'accent',
  },
  {
    id: 'accent-key-indicators',
    label: 'Key indicators',
    description: 'Badges, counters or markers that flag something needs attention.',
    category: 'feedback',
    applicableRole: 'accent',
  },

  // Text / Foreground — supports readable content and foreground elements.
  {
    id: 'text-headings',
    label: 'Headings',
    description: 'Section and page titles that establish content hierarchy.',
    category: 'content',
    applicableRole: 'text',
  },
  {
    id: 'text-body-copy',
    label: 'Body copy',
    description: 'The bulk of readable, everyday interface content.',
    category: 'content',
    applicableRole: 'text',
  },
  {
    id: 'text-labels',
    label: 'Labels',
    description: 'Short descriptive text for form fields, tags and metadata.',
    category: 'content',
    applicableRole: 'text',
  },
  {
    id: 'text-icons',
    label: 'Icons',
    description: 'Foreground iconography that should read at the same weight as body text.',
    category: 'content',
    applicableRole: 'text',
  },
];

export function getUsageItemsForRole(roleId: AnyRoleId): UsageItem[] {
  return USAGE_ITEMS.filter((item) => item.applicableRole === roleId);
}

export function getUsageItemsForRoleByCategory(
  roleId: AnyRoleId,
): Partial<Record<UsageCategory, UsageItem[]>> {
  const grouped: Partial<Record<UsageCategory, UsageItem[]>> = {};
  for (const item of getUsageItemsForRole(roleId)) {
    const bucket = grouped[item.category];
    if (bucket) {
      bucket.push(item);
    } else {
      grouped[item.category] = [item];
    }
  }
  return grouped;
}

export function getUsageItemCount(roleId: AnyRoleId): number {
  return getUsageItemsForRole(roleId).length;
}
