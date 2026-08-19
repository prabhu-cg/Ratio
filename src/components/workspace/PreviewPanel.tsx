import { Badge } from '@/components/ui/Badge';
import { PreviewControls } from '@/components/preview/PreviewControls';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { PreviewTemplate } from '@/components/preview/PreviewTemplate';
import { useToast } from '@/components/ui/ToastProvider';
import { PREVIEW_TEMPLATES } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import type { ProjectPalette } from '@/types/palette';
import type { VisionSimulationId } from '@/types/accessibility';

interface PreviewPanelProps {
  palette: ProjectPalette;
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
  visionMode: VisionSimulationId;
  onTemplateChange: (id: PreviewTemplateId) => void;
  onViewportChange: (id: PreviewViewportId) => void;
  onVisionModeChange: (id: VisionSimulationId) => void;
}

export function PreviewPanel({
  palette,
  templateId,
  viewport,
  visionMode,
  onTemplateChange,
  onViewportChange,
  onVisionModeChange,
}: PreviewPanelProps) {
  const { notify } = useToast();

  const handleTemplateChange = (id: PreviewTemplateId) => {
    onTemplateChange(id);
    const label = PREVIEW_TEMPLATES.find((option) => option.id === id)?.label ?? id;
    notify(`Viewing ${label.toLowerCase()} preview`);
  };

  return (
    <aside
      aria-label="Live preview"
      className="workspace-preview flex flex-col gap-4 overflow-y-auto overflow-x-hidden bg-surface-card p-5 sm:p-8"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            4 · Preview
          </h2>
          <Badge tone="brand" className="flex-none">
            Live
          </Badge>
        </div>
        <p className="text-sm text-text-muted">
          See how your colours behave in a realistic interface.
        </p>
      </div>

      <PreviewControls
        templateId={templateId}
        viewport={viewport}
        visionMode={visionMode}
        onTemplateChange={handleTemplateChange}
        onViewportChange={onViewportChange}
        onVisionModeChange={onVisionModeChange}
      />

      <div className="min-h-0 flex-1">
        <PreviewFrame palette={palette} templateId={templateId} viewport={viewport} visionMode={visionMode}>
          <PreviewTemplate templateId={templateId} />
        </PreviewFrame>
      </div>
    </aside>
  );
}
