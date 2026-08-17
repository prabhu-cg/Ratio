import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { PreviewControls } from '@/components/preview/PreviewControls';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { PreviewTemplate } from '@/components/preview/PreviewTemplate';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import type { RatioPalette } from '@/types/palette';
import type { VisionSimulationId } from '@/types/accessibility';

interface PreviewPanelProps {
  palette: RatioPalette;
}

export function PreviewPanel({ palette }: PreviewPanelProps) {
  const [templateId, setTemplateId] = useState<PreviewTemplateId>('landing');
  const [viewport, setViewport] = useState<PreviewViewportId>('desktop');
  const [visionMode, setVisionMode] = useState<VisionSimulationId>('normal');

  return (
    <aside
      aria-label="Live preview"
      className="workspace-preview flex flex-col gap-4 overflow-y-auto overflow-x-hidden bg-surface-card p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Preview
        </h2>
        <Badge tone="brand">Live</Badge>
      </div>

      <PreviewControls
        templateId={templateId}
        viewport={viewport}
        visionMode={visionMode}
        onTemplateChange={setTemplateId}
        onViewportChange={setViewport}
        onVisionModeChange={setVisionMode}
      />

      <PreviewFrame palette={palette} templateId={templateId} viewport={viewport} visionMode={visionMode}>
        <PreviewTemplate templateId={templateId} />
      </PreviewFrame>
    </aside>
  );
}
