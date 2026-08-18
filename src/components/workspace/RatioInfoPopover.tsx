import { useEffect, useId, useRef, useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { HelpIcon } from '@/components/ui/HelpIcon';

const ROLES = [
  {
    percentage: '60%',
    label: 'Dominant colour',
    description: 'The primary visual foundation.',
  },
  {
    percentage: '30%',
    label: 'Secondary colour',
    description: 'Adds structure and visual support.',
  },
  {
    percentage: '10%',
    label: 'Accent colour',
    description: 'Creates emphasis and draws attention.',
  },
];

/**
 * Compact "Learn about the ratio" trigger — keeps the 60/30/10 explanation available
 * without permanently occupying workspace space. Same floating-popover pattern as
 * ColourDetails (button + absolute panel + click-outside), for a consistent feel.
 */
export function RatioInfoPopover() {
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

  return (
    <div ref={containerRef} className="relative flex-none">
      <Tooltip content="Learn about the ratio" side="bottom" align="end">
        <IconButton
          label="Learn about the ratio"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>

      {open ? (
        <div
          id={panelId}
          role="note"
          className="absolute right-0 top-full z-20 mt-2 flex w-72 flex-col gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface-card p-4 shadow-[var(--shadow-card)]"
        >
          {ROLES.map((role) => (
            <div key={role.label} className="flex items-baseline gap-3">
              <span className="w-10 flex-none font-display text-lg font-bold text-text-heading">
                {role.percentage}
              </span>
              <div>
                <div className="text-xs font-semibold text-text-heading">{role.label}</div>
                <div className="text-xs text-text-muted">{role.description}</div>
              </div>
            </div>
          ))}
          <p className="border-t border-border-default pt-3 text-xs leading-relaxed text-text-muted">
            60–30–10 is a visual guideline, not a strict mathematical requirement.
          </p>
        </div>
      ) : null}
    </div>
  );
}
