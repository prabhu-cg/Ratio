import type { AnyRoleId } from '@/types/palette';
import type { UsageCategory, UsageItem } from '@/types/colourRole';
import type { UsageContextId } from '@/types/usageContext';

/**
 * The catalogue of concrete usage ideas behind the Colour Usage Map. This
 * is the single list every role/context lookup derives from — there is no
 * separate, hand-maintained "role → usage" or "context → usage" config to
 * drift out of sync with it. IDs are unique across the whole catalogue,
 * not just within a role, so they can be addressed individually.
 *
 * `contexts` marks the design contexts (V1.9.3) an item is specifically
 * emphasised in — see src/types/usageContext.ts. Items without it (or
 * whose `contexts` doesn't include the selected one) simply aren't shown
 * for that context; "General" is the exception and always shows every
 * item regardless of this field, since it represents the full, unfiltered
 * catalogue rather than a curated subset.
 */
export const USAGE_ITEMS: UsageItem[] = [
  // Dominant — the main visual foundation.
  {
    id: 'dominant-page-background',
    label: 'Page background',
    description: 'The base surface behind everything else in the interface.',
    category: 'surface',
    applicableRole: 'dominant',
    visualExample: 'page-canvas',
    contexts: ['marketing'],
  },
  {
    id: 'dominant-main-canvas',
    label: 'Main canvas',
    description: 'The primary working area a user spends most of their time looking at.',
    category: 'surface',
    applicableRole: 'dominant',
    contexts: ['saas', 'mobile'],
  },
  {
    id: 'dominant-large-sections',
    label: 'Large layout regions',
    description: 'Broad structural areas, such as a page shell or content column.',
    category: 'surface',
    applicableRole: 'dominant',
    contexts: ['saas', 'editorial'],
  },
  {
    id: 'dominant-hero-sections',
    label: 'Hero sections',
    description: 'The large, attention-grabbing top section of a landing or marketing page.',
    category: 'surface',
    applicableRole: 'dominant',
    contexts: ['marketing'],
  },
  {
    id: 'dominant-reading-surface',
    label: 'Reading surface',
    description: 'The background an article or long-form piece of content sits on.',
    category: 'surface',
    applicableRole: 'dominant',
    contexts: ['editorial'],
  },

  // Secondary — adds structure and separation.
  {
    id: 'secondary-cards',
    label: 'Cards',
    description: 'Distinct content groupings that sit on top of the dominant surface.',
    category: 'surface',
    applicableRole: 'secondary',
    visualExample: 'card',
    contexts: ['saas', 'mobile'],
  },
  {
    id: 'secondary-panels',
    label: 'Panels',
    description: 'Sidebars, drawers and other supporting regions alongside the main content.',
    category: 'surface',
    applicableRole: 'secondary',
    contexts: ['saas'],
  },
  {
    id: 'secondary-containers',
    label: 'Containers',
    description: 'Grouped sections that need light visual separation from what surrounds them.',
    category: 'surface',
    applicableRole: 'secondary',
    contexts: ['marketing', 'mobile', 'editorial'],
  },
  {
    id: 'secondary-feature-cards',
    label: 'Feature cards',
    description: 'Cards that showcase an individual product feature or benefit.',
    category: 'surface',
    applicableRole: 'secondary',
    contexts: ['marketing'],
  },
  {
    id: 'secondary-navigation-regions',
    label: 'Navigation regions',
    description: 'Sidebars and navigation rails that help users move through an application.',
    category: 'navigation',
    applicableRole: 'secondary',
    contexts: ['saas'],
  },
  {
    id: 'secondary-sheets',
    label: 'Sheets',
    description: 'Bottom sheets and modals that slide in over the main screen.',
    category: 'surface',
    applicableRole: 'secondary',
    contexts: ['mobile'],
  },
  {
    id: 'secondary-callouts',
    label: 'Callouts',
    description: 'Boxed asides, tips or warnings set apart from the main reading flow.',
    category: 'surface',
    applicableRole: 'secondary',
    contexts: ['editorial'],
  },

  // Accent — creates emphasis and draws attention.
  {
    id: 'accent-primary-buttons',
    label: 'Primary buttons',
    description: 'The main call-to-action a user is meant to notice first.',
    category: 'action',
    applicableRole: 'accent',
    visualExample: 'button',
    contexts: ['saas', 'mobile'],
  },
  {
    id: 'accent-important-links',
    label: 'Important links',
    description: 'Links that need to stand out from ordinary body text.',
    category: 'action',
    applicableRole: 'accent',
    contexts: ['marketing', 'editorial'],
  },
  {
    id: 'accent-highlights',
    label: 'Highlights',
    description: 'Drawing the eye to a specific piece of content or a new feature.',
    category: 'decoration',
    applicableRole: 'accent',
    contexts: ['marketing', 'editorial'],
  },
  {
    id: 'accent-selected-states',
    label: 'Selected states',
    description: 'Showing which tab, item or option is currently active.',
    category: 'feedback',
    applicableRole: 'accent',
    contexts: ['saas', 'mobile'],
  },
  {
    id: 'accent-key-indicators',
    label: 'Key indicators',
    description: 'Badges, counters or markers that flag something needs attention.',
    category: 'feedback',
    applicableRole: 'accent',
    contexts: ['saas'],
  },
  {
    id: 'accent-cta',
    label: 'CTA',
    description: 'The call-to-action button designed to convert a visitor into a customer.',
    category: 'action',
    applicableRole: 'accent',
    contexts: ['marketing'],
  },
  {
    id: 'accent-pull-quotes',
    label: 'Pull quotes',
    description: 'A quoted excerpt visually pulled out to break up long-form text.',
    category: 'decoration',
    applicableRole: 'accent',
    contexts: ['editorial'],
  },

  // Text / Foreground — supports readable content and foreground elements.
  {
    id: 'text-headings',
    label: 'Headings',
    description: 'Section and page titles that establish content hierarchy.',
    category: 'content',
    applicableRole: 'text',
    visualExample: 'heading-hierarchy',
    contexts: ['marketing', 'mobile', 'editorial'],
  },
  {
    id: 'text-body-copy',
    label: 'Body copy',
    description: 'The bulk of readable, everyday interface content.',
    category: 'content',
    applicableRole: 'text',
    contexts: ['marketing', 'mobile', 'editorial'],
  },
  {
    id: 'text-labels',
    label: 'Labels',
    description: 'Short descriptive text for form fields, tags and metadata.',
    category: 'content',
    applicableRole: 'text',
    contexts: ['saas'],
  },
  {
    id: 'text-icons',
    label: 'Icons',
    description: 'Foreground iconography that should read at the same weight as body text.',
    category: 'content',
    applicableRole: 'text',
    visualExample: 'icon',
  },
  {
    id: 'text-data',
    label: 'Data',
    description: 'Numbers, statistics and structured values shown in tables or dashboards.',
    category: 'content',
    applicableRole: 'text',
    contexts: ['saas'],
  },
  {
    id: 'text-navigation-content',
    label: 'Navigation content',
    description: 'Menu items, breadcrumbs and other wayfinding text.',
    category: 'navigation',
    applicableRole: 'text',
    contexts: ['saas'],
  },
  {
    id: 'text-navigation-labels',
    label: 'Navigation labels',
    description: 'Short labels under tab bar icons and other mobile navigation controls.',
    category: 'navigation',
    applicableRole: 'text',
    contexts: ['mobile'],
  },
  {
    id: 'text-metadata',
    label: 'Metadata',
    description: 'Author names, publish dates and reading time — secondary to the main content.',
    category: 'content',
    applicableRole: 'text',
    contexts: ['editorial'],
  },
];

export function getUsageItemsForRole(roleId: AnyRoleId): UsageItem[] {
  return USAGE_ITEMS.filter((item) => item.applicableRole === roleId);
}

/**
 * The usage items for a role, filtered to a design context. "General"
 * always returns the full set for that role — see the `contexts` field
 * doc comment above for why.
 */
export function getUsageItemsForRoleAndContext(roleId: AnyRoleId, contextId: UsageContextId): UsageItem[] {
  const items = getUsageItemsForRole(roleId);
  if (contextId === 'general') return items;
  return items.filter((item) => item.contexts?.includes(contextId));
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
