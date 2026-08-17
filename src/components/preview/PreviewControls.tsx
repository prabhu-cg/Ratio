import { PREVIEW_TEMPLATES, PREVIEW_VIEWPORTS } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import { VISION_SIMULATIONS } from '@/types/accessibility';
import type { VisionSimulationId } from '@/types/accessibility';

interface PreviewControlsProps {
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
  visionMode: VisionSimulationId;
  onTemplateChange: (id: PreviewTemplateId) => void;
  onViewportChange: (id: PreviewViewportId) => void;
  onVisionModeChange: (id: VisionSimulationId) => void;
}

export function PreviewControls({
  templateId,
  viewport,
  visionMode,
  onTemplateChange,
  onViewportChange,
  onVisionModeChange,
}: PreviewControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div role="tablist" aria-label="Preview template" className="flex flex-wrap gap-1">
        {PREVIEW_TEMPLATES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={option.id === templateId}
            onClick={() => onTemplateChange(option.id)}
            className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
              option.id === templateId
                ? 'bg-brand text-text-inverse'
                : 'bg-surface-alt text-text-muted hover:text-text-heading'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div role="tablist" aria-label="Preview viewport" className="flex gap-1">
        {PREVIEW_VIEWPORTS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={option.id === viewport}
            onClick={() => onViewportChange(option.id)}
            className={`flex-1 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
              option.id === viewport
                ? 'bg-ink-900 text-text-inverse'
                : 'bg-surface-alt text-text-muted hover:text-text-heading'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-text-faint">
          Vision
        </span>
        <div role="tablist" aria-label="Colour vision simulation" className="flex flex-wrap gap-1">
          {VISION_SIMULATIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={option.id === visionMode}
              onClick={() => onVisionModeChange(option.id)}
              className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                option.id === visionMode
                  ? 'bg-ink-900 text-text-inverse'
                  : 'bg-surface-alt text-text-muted hover:text-text-heading'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
