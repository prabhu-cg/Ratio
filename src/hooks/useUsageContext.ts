import { useEffect, useState } from 'react';
import { loadPersistedState, patchPersistedState } from '@/lib/storage';
import { DEFAULT_USAGE_CONTEXT_ID, isUsageContextId } from '@/lib/usageContexts';
import type { UsageContextId } from '@/types/usageContext';

/**
 * Persists the selected Colour Usage Map context — separate from, and
 * never touching, the project palette's own persisted fields (see
 * usePalette.ts). An invalid or missing stored value safely falls back to
 * the default ("General") rather than throwing.
 */
export function useUsageContext() {
  const [contextId, setContextId] = useState<UsageContextId>(() => {
    const persisted = loadPersistedState().usageContext;
    return isUsageContextId(persisted) ? persisted : DEFAULT_USAGE_CONTEXT_ID;
  });

  useEffect(() => {
    patchPersistedState({ usageContext: contextId });
  }, [contextId]);

  return { contextId, setContextId };
}
