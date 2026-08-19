import type { UsageContext, UsageContextId } from '@/types/usageContext';

export const DEFAULT_USAGE_CONTEXT_ID: UsageContextId = 'general';

/**
 * The five supported contexts. Kept as a plain, ordered list (rather than
 * a keyed record) so new contexts can be appended without touching
 * anything that iterates them — the model is meant to stay extensible.
 */
export const USAGE_CONTEXTS: UsageContext[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Broadly applicable usage that works across most kinds of interface.',
  },
  {
    id: 'marketing',
    name: 'Marketing Website',
    description: 'Landing pages and marketing sites built to explain and persuade.',
  },
  {
    id: 'saas',
    name: 'SaaS / Product',
    description: 'Application interfaces designed for daily, repeated use.',
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    description: 'Compact, touch-first mobile screens.',
  },
  {
    id: 'editorial',
    name: 'Editorial / Content',
    description: 'Long-form reading experiences such as articles and posts.',
  },
];

const USAGE_CONTEXT_IDS = new Set<string>(USAGE_CONTEXTS.map((context) => context.id));

/** Safely validates a persisted or otherwise untrusted value as a real context id. */
export function isUsageContextId(value: unknown): value is UsageContextId {
  return typeof value === 'string' && USAGE_CONTEXT_IDS.has(value);
}

export function getUsageContext(id: UsageContextId): UsageContext {
  return USAGE_CONTEXTS.find((context) => context.id === id) ?? USAGE_CONTEXTS[0];
}
