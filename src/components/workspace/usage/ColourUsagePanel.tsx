import { useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Badge } from '@/components/ui/Badge';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { listColourRoles, getRoleColourHex, getRoleDisplay } from '@/lib/colourRoles';
import { getUsageItemsForRole } from '@/lib/usageItems';
import { UsageVisualExample } from '@/components/workspace/usage/UsageVisualExample';
import type { AnyRoleId, ProjectPalette } from '@/types/palette';
import type { UsageCategory } from '@/types/colourRole';

interface ColourUsagePanelProps {
  open: boolean;
  onClose: () => void;
  palette: ProjectPalette;
}

const CATEGORY_LABEL: Record<UsageCategory, string> = {
  surface: 'Surface',
  content: 'Content',
  action: 'Action',
  navigation: 'Navigation',
  feedback: 'Feedback',
  decoration: 'Decoration',
};

/**
 * The interactive Colour Usage Map (V1.9.2). Builds entirely on the
 * V1.9.1 role registry and usage catalogue (src/lib/colourRoles.ts,
 * src/lib/usageItems.ts) — this file only adds interaction and
 * presentation, never a second copy of that data. A right-anchored
 * drawer (matching ExportDrawer) rather than another centred modal, so
 * this doesn't stack on top of the Guide modal as more "modal overload".
 */
export function ColourUsagePanel({ open, onClose, palette }: ColourUsagePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<AnyRoleId>('dominant');
  const baseId = useId();

  useFocusTrap(open, panelRef, closeButtonRef, onClose);

  const roles = useMemo(() => listColourRoles(), []);

  if (!open) return null;

  const selectedIndex = Math.max(
    0,
    roles.findIndex((role) => role.id === selectedRoleId),
  );
  const selectedRole = roles[selectedIndex];
  const selectedDisplay = getRoleDisplay(selectedRole);
  const selectedColourHex = getRoleColourHex(palette, selectedRole.id);
  const usageItems = getUsageItemsForRole(selectedRole.id);

  const handleTablistKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = roles[(selectedIndex + delta + roles.length) % roles.length];
    setSelectedRoleId(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="colour-usage-heading"
        className="relative flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-border-default bg-surface-card shadow-[var(--shadow-card)]"
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

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 pt-5 sm:p-8 sm:pt-6">
          <p className="rounded-[var(--radius-md)] border border-dashed border-border-strong p-3 text-xs leading-relaxed text-text-muted">
            Colour roles are guides, not fixed rules — the same colour may serve different purposes
            depending on the product and context. The 60–30–10 principle describes visual hierarchy,
            not a strict requirement for every interface element.
          </p>

          <div
            role="tablist"
            aria-label="Colour role"
            onKeyDown={handleTablistKeyDown}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {roles.map((role) => {
              const selected = role.id === selectedRole.id;
              const hex = getRoleColourHex(palette, role.id);

              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${role.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${role.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border p-2.5 text-center transition-colors duration-150 ${
                    selected
                      ? 'border-brand bg-brand-soft'
                      : 'border-border-default hover:border-border-strong hover:bg-surface-alt'
                  }`}
                >
                  <span className="relative flex-none">
                    <span
                      aria-hidden="true"
                      className="block h-6 w-6 rounded-full border border-border-strong"
                      style={{ backgroundColor: hex }}
                    />
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-text-inverse"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1 4L3 6L7 1.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                  <span className={`text-xs font-semibold ${selected ? 'text-brand' : 'text-text-heading'}`}>
                    {role.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel-${selectedRole.id}`}
            aria-labelledby={`${baseId}-tab-${selectedRole.id}`}
            tabIndex={0}
            className="flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-10 w-10 flex-none rounded-full border border-border-strong shadow-sm"
                  style={{ backgroundColor: selectedColourHex }}
                />
                <div>
                  <div className="text-base font-semibold text-text-heading">{selectedDisplay.name}</div>
                  <div className="font-mono text-xs text-text-muted">{selectedColourHex}</div>
                </div>
              </div>
              <Badge tone={selectedDisplay.includedInRatio ? 'brand' : 'neutral'} className="flex-none">
                {selectedDisplay.ratioLabel}
              </Badge>
            </div>

            <p className="text-sm text-text-muted">{selectedDisplay.purpose}</p>

            <div className="flex flex-col gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                Common uses
              </h3>

              {usageItems.map((item) => (
                <details
                  key={item.id}
                  className="group rounded-[var(--radius-md)] border border-border-default"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-text-heading [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                      className="flex-none transition-transform duration-150 group-open:rotate-180"
                    >
                      <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className="flex flex-col gap-3 border-t border-border-default px-4 py-3">
                    <p className="text-xs leading-relaxed text-text-muted">{item.description}</p>
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-text-faint">
                        Category
                      </span>
                      <div className="mt-1.5">
                        <Badge tone="neutral">{CATEGORY_LABEL[item.category]}</Badge>
                      </div>
                    </div>
                    {item.visualExample ? (
                      <UsageVisualExample kind={item.visualExample} palette={palette} />
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
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
