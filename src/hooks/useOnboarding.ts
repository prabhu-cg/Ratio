import { useCallback, useState } from 'react';

/**
 * Deliberately its own localStorage key, separate from `ratio:workspace:v1` (palette,
 * preview settings). Keeping it separate means resetting the palette can never touch
 * onboarding state, and vice versa — each persists independently.
 */
const ONBOARDING_STORAGE_KEY = 'ratio:onboarding-dismissed:v1';

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
  } catch {
    // Storage unavailable — the guide just reappears next visit, which is harmless.
  }
}

/**
 * Drives the guide panel: open automatically the first time (nothing dismissed yet),
 * stay closed on every later visit, and reopen on demand via the topbar's Help trigger.
 */
export function useOnboarding() {
  const [isGuideOpen, setGuideOpen] = useState(() => !readDismissed());

  const dismissGuide = useCallback(() => {
    writeDismissed();
    setGuideOpen(false);
  }, []);

  const openGuide = useCallback(() => setGuideOpen(true), []);

  return { isGuideOpen, dismissGuide, openGuide };
}
