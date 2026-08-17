import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ToastContextValue {
  notify: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nextId = useRef(0);

  const notify = useCallback((message: string) => {
    clearTimeout(timeoutRef.current);
    nextId.current += 1;
    // Keying on an incrementing id (rather than just the message) forces the live
    // region to remount even when the same message fires twice in a row, so screen
    // readers reliably announce it every time, not just on the first occurrence.
    setToast({ id: nextId.current, message });
    timeoutRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-hidden={!toast}
        className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
      >
        {toast ? (
          <span
            key={toast.id}
            role="status"
            aria-live="polite"
            className="rounded-full border border-border-strong bg-surface-inverse px-4 py-2 text-sm font-medium text-text-inverse shadow-[var(--shadow-card)]"
          >
            {toast.message}
          </span>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

const NOOP_TOAST: ToastContextValue = { notify: () => {} };

/**
 * Falls back to a harmless no-op outside a ToastProvider (e.g. in component tests
 * that don't need toast infrastructure) rather than throwing — the app always
 * mounts ToastProvider at the root, so this only matters in isolated tests.
 */
export function useToast(): ToastContextValue {
  return useContext(ToastContext) ?? NOOP_TOAST;
}
