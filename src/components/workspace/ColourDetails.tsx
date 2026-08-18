import { useEffect, useId, useRef, useState } from 'react';
import { formatHsl, formatRgb } from '@/lib/color';
import { CopyButton } from '@/components/ui/CopyButton';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Colour } from '@/types/color';

interface ColourDetailsProps {
  colour: Colour;
  roleLabel: string;
}

/**
 * Doubles as the card's copy affordance: opening it is how you get to a copyable
 * value, rather than a separate one-click "copy hex" button sitting next to it.
 * Floats over the content below instead of pushing it down, so opening one card's
 * copy panel doesn't shift every card and control beneath it.
 */
export function ColourDetails({ colour, roleLabel }: ColourDetailsProps) {
  const { copy, copiedKey } = useCopyToClipboard();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const rows = [
    { key: 'hex', label: 'HEX', value: colour.hex },
    { key: 'rgb', label: 'RGB', value: formatRgb(colour.rgb) },
    { key: 'hsl', label: 'HSL', value: formatHsl(colour.hsl) },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        aria-label={`Copy ${roleLabel} colour value`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted transition-colors duration-150 hover:bg-surface-alt hover:text-text-heading"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M2.5 7.5V2.5C2.5 1.94772 2.94772 1.5 3.5 1.5H7.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        Copy
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-0 top-full z-20 mt-2 flex w-56 flex-col gap-1 rounded-[var(--radius-sm)] border border-border-strong bg-surface-card p-3 shadow-[var(--shadow-card)]"
        >
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-text-primary">
                <span className="mr-2 text-text-faint">{row.label}</span>
                {row.value}
              </span>
              <CopyButton
                label={`Copy ${row.label} value for ${roleLabel}`}
                copied={copiedKey === row.key}
                onCopy={() => copy(row.key, row.value, `${roleLabel} ${row.label}`)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
