import { WorkspaceTopBar } from '@/components/workspace/WorkspaceTopBar';
import { ControlsPanel } from '@/components/workspace/ControlsPanel';
import { RatioVisualisation } from '@/components/workspace/RatioVisualisation';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { usePalette } from '@/hooks/usePalette';

export function WorkspaceShell() {
  const { palette, setRoleHex, resetRole, resetPalette, isModified } = usePalette();

  return (
    <div className="flex h-dvh flex-col">
      <a
        href="#workspace-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-text-inverse"
      >
        Skip to workspace
      </a>
      <WorkspaceTopBar isModified={isModified} onReset={resetPalette} />
      <div id="workspace-main" className="workspace-grid min-h-0 flex-1 overflow-y-auto md:overflow-visible">
        <ControlsPanel
          palette={palette}
          isModified={isModified}
          onChangeRoleHex={setRoleHex}
          onResetRole={resetRole}
        />
        <RatioVisualisation palette={palette} />
        <PreviewPanel palette={palette} />
      </div>
    </div>
  );
}
