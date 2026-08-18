import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { HelpIcon } from '@/components/ui/HelpIcon';
import { ExportDrawer } from '@/components/workspace/ExportDrawer';
import type { ProjectPalette } from '@/types/palette';

interface WorkspaceTopBarProps {
  palette: ProjectPalette;
  isModified: boolean;
  onReset: () => void;
  onOpenGuide: () => void;
}

export function WorkspaceTopBar({ palette, isModified, onReset, onOpenGuide }: WorkspaceTopBarProps) {
  const [confirming, setConfirming] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

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
            <span className="text-xs text-text-muted">Restore the original example colours?</span>
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
          <Tooltip content="Restore the original example colours" side="bottom">
            <Button variant="ghost" size="md" onClick={handleResetClick} disabled={!isModified}>
              Reset palette
            </Button>
          </Tooltip>
        )}

        <Button variant="secondary" size="md" onClick={() => setExportOpen(true)}>
          Export
        </Button>

        <Tooltip content="How RATIO works" side="bottom">
          <IconButton label="How RATIO works" onClick={onOpenGuide}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </div>

      <ExportDrawer palette={palette} open={exportOpen} onClose={() => setExportOpen(false)} />
    </header>
  );
}
