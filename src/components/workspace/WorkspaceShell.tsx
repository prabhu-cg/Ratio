import { useCallback, useEffect, useState } from 'react';
import { WorkspaceTopBar } from '@/components/workspace/WorkspaceTopBar';
import { ControlsPanel } from '@/components/workspace/ControlsPanel';
import { RatioVisualisation } from '@/components/workspace/RatioVisualisation';
import { PreviewPanel } from '@/components/workspace/PreviewPanel';
import { AccessibilityPanel } from '@/components/workspace/AccessibilityPanel';
import { GuidePanel } from '@/components/workspace/GuidePanel';
import { ColourUsagePanel } from '@/components/workspace/usage/ColourUsagePanel';
import { useToast } from '@/components/ui/ToastProvider';
import { usePalette } from '@/hooks/usePalette';
import { usePreviewSettings } from '@/hooks/usePreviewSettings';
import { useOnboarding } from '@/hooks/useOnboarding';

export function WorkspaceShell() {
  const { palette, setRoleHex, resetRole, resetPalette, isModified } = usePalette();
  const [isColourUsageOpen, setColourUsageOpen] = useState(false);
  const {
    templateId,
    setTemplateId,
    viewport,
    setViewport,
    visionMode,
    setVisionMode,
    resetVisionMode,
  } = usePreviewSettings();
  const { isGuideOpen, dismissGuide, openGuide } = useOnboarding();
  const { notify } = useToast();

  const handleReset = useCallback(() => {
    resetPalette();
    resetVisionMode();
    notify('Palette restored to the example');
  }, [resetPalette, resetVisionMode, notify]);

  // The workspace is a fixed-viewport app shell — nothing outside the three columns
  // (and the device preview canvas inside them) should ever scroll the page itself.
  // Wheel input over an area with nothing scrollable under the cursor — like the
  // topbar — has no local scroll container to consume it, so browsers hand it to the
  // document as a fallback. CSS alone (overflow: hidden on <html>, overscroll-behavior)
  // doesn't reliably stop that hand-off in every case, so this blocks it directly at
  // the event level: any wheel event that didn't originate inside one of the
  // legitimately-scrollable regions is simply prevented outright.
  useEffect(() => {
    // Modals (the guide panel, the export drawer) render outside the workspace grid
    // entirely, so their own scrollable content must also be exempted here — otherwise
    // this handler blocks scrolling inside them too.
    const SCROLLABLE_SELECTOR =
      '.workspace-controls, .workspace-viz, .workspace-preview, .workspace-accessibility, [role="dialog"]';

    const handleWheel = (event: WheelEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(SCROLLABLE_SELECTOR)) {
        event.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    // Belt-and-suspenders for non-wheel scroll input (keyboard Page Down/spacebar,
    // touch drag on a trackpad-less device): <html> is the actual scrolling element
    // in a standards-mode document, so this is what needs to be non-scrollable.
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('wheel', handleWheel);
      html.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <a
        href="#workspace-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-text-inverse"
      >
        Skip to workspace
      </a>
      <WorkspaceTopBar
        palette={palette}
        isModified={isModified}
        onReset={handleReset}
        onOpenGuide={openGuide}
      />
      <h1 className="sr-only">RATIO workspace — colour controls, ratio, and live preview</h1>
      <div id="workspace-main" className="workspace-grid min-h-0 flex-1 overflow-y-auto md:overflow-visible">
        <ControlsPanel
          palette={palette}
          onChangeRoleHex={setRoleHex}
          onResetRole={resetRole}
          onOpenColourUsage={() => setColourUsageOpen(true)}
        />
        <RatioVisualisation palette={palette} />
        <AccessibilityPanel palette={palette} />
        <PreviewPanel
          palette={palette}
          templateId={templateId}
          viewport={viewport}
          visionMode={visionMode}
          onTemplateChange={setTemplateId}
          onViewportChange={setViewport}
          onVisionModeChange={setVisionMode}
        />
      </div>

      <GuidePanel open={isGuideOpen} onClose={dismissGuide} />
      <ColourUsagePanel
        open={isColourUsageOpen}
        onClose={() => setColourUsageOpen(false)}
        palette={palette}
      />
    </div>
  );
}
