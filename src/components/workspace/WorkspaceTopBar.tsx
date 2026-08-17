import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

interface WorkspaceTopBarProps {
  isModified: boolean;
  onReset: () => void;
}

export function WorkspaceTopBar({ isModified, onReset }: WorkspaceTopBarProps) {
  const [confirming, setConfirming] = useState(false);

  const handleResetClick = () => {
    if (!isModified) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onReset();
    setConfirming(false);
  };

  return (
    <header className="flex h-14 flex-none items-center justify-between border-b border-border-default bg-surface-card px-4 sm:px-6">
      <Logo />

      <div className="flex items-center gap-2">
        {confirming ? (
          <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-strong bg-surface-alt py-1 pl-3 pr-1.5">
            <span className="text-xs text-text-muted">Reset to default palette?</span>
            <Button size="md" className="h-7 px-3 text-xs" onClick={handleResetClick}>
              Confirm
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="h-7 px-3 text-xs"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="md" onClick={handleResetClick} disabled={!isModified}>
            Reset
          </Button>
        )}

        <Tooltip content="Export arrives in a later phase">
          <Button variant="secondary" size="md" disabled aria-disabled="true">
            Export
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}
