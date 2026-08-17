import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';

export function useCopyToClipboard(resetDelay = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { notify } = useToast();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = useCallback(
    async (key: string, value: string, label = 'Value') => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopiedKey(null), resetDelay);
        notify(`${label} copied to clipboard`);
        return true;
      } catch {
        notify(`Couldn't copy — copy ${value} manually`);
        return false;
      }
    },
    [resetDelay, notify],
  );

  return { copy, copiedKey };
}
