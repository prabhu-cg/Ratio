import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(resetDelay = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = useCallback(
    async (key: string, value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopiedKey(null), resetDelay);
        return true;
      } catch {
        return false;
      }
    },
    [resetDelay],
  );

  return { copy, copiedKey };
}
