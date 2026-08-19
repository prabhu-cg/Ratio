import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { listColourRoles, getRoleColourHex, getRoleDisplay } from '@/lib/colourRoles';
import type { ProjectPalette } from '@/types/palette';

interface ColourUsagePanelProps {
  open: boolean;
  onClose: () => void;
  palette: ProjectPalette;
}

/**
 * The entry point for the future interactive Colour Usage Map (V1.9.2+).
 * For now this establishes the architecture end-to-end — role registry,
 * live palette colours, and display helpers — without the full browsable/
 * filterable usage-item experience that's still to come.
 */
export function ColourUsagePanel({ open, onClose, palette }: ColourUsagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(open, panelRef, closeButtonRef, onClose);

  if (!open) return null;

  const roles = listColourRoles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="colour-usage-heading"
        className="relative flex max-h-[min(720px,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-card shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-none items-start justify-between gap-3 border-b border-border-default p-6 pb-5 sm:p-8 sm:pb-6">
          <div>
            <h2 id="colour-usage-heading" className="font-display text-xl font-bold text-text-heading">
              Colour usage
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Explore where each colour in your palette can typically be applied.
            </p>
          </div>
          <IconButton ref={closeButtonRef} label="Close colour usage" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 pt-5 sm:p-8 sm:pt-6">
          {roles.map((role) => {
            const display = getRoleDisplay(role);
            const colourHex = getRoleColourHex(palette, role.id);

            return (
              <div
                key={role.id}
                className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border-default p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-8 w-8 flex-none rounded-full border border-border-strong shadow-sm"
                      style={{ backgroundColor: colourHex }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-text-heading">{display.name}</div>
                      <div className="font-mono text-[11px] text-text-muted">{colourHex}</div>
                    </div>
                  </div>
                  <Badge tone={display.includedInRatio ? 'brand' : 'neutral'} className="flex-none">
                    {display.ratioLabel}
                  </Badge>
                </div>

                <p className="text-xs leading-relaxed text-text-muted">{display.purpose}</p>

                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-text-faint">
                    Typical usage
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {role.typicalUsage.map((usage) => (
                      <li
                        key={usage}
                        className="rounded-full border border-border-default bg-surface-alt px-2.5 py-1 text-xs text-text-primary"
                      >
                        {usage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-none justify-end border-t border-border-default p-6 pt-5 sm:p-8 sm:pt-6">
          <Button variant="secondary" size="md" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
