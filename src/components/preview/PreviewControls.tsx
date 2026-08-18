import { useId } from 'react';
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

const TEMPLATE_SEGMENT_ACTIVE = 'bg-brand text-text-inverse shadow-sm';
const VIEWPORT_SEGMENT_ACTIVE = 'bg-ink-900 text-text-inverse shadow-sm';
const SEGMENT_INACTIVE = 'text-text-muted hover:text-text-heading';

export function PreviewControls({
  templateId,
  viewport,
  visionMode,
  onTemplateChange,
  onViewportChange,
  onVisionModeChange,
}: PreviewControlsProps) {
  const visionLabelId = useId();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div
        role="tablist"
        aria-label="Preview template"
        className="inline-flex items-center gap-0.5 rounded-[var(--radius-md)] border border-border-default bg-surface-alt p-0.5"
      >
        {PREVIEW_TEMPLATES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={option.id === templateId}
            onClick={() => onTemplateChange(option.id)}
            className={`rounded-[calc(var(--radius-md)-2px)] px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
              option.id === templateId ? TEMPLATE_SEGMENT_ACTIVE : SEGMENT_INACTIVE
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div
          role="tablist"
          aria-label="Preview viewport"
          className="inline-flex items-center gap-0.5 rounded-[var(--radius-md)] border border-border-default bg-surface-alt p-0.5"
        >
          {PREVIEW_VIEWPORTS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={option.id === viewport}
              onClick={() => onViewportChange(option.id)}
              className={`rounded-[calc(var(--radius-md)-2px)] px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                option.id === viewport ? VIEWPORT_SEGMENT_ACTIVE : SEGMENT_INACTIVE
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <label
            id={visionLabelId}
            htmlFor="preview-vision-select"
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-text-faint"
          >
            Vision
          </label>
          <select
            id="preview-vision-select"
            aria-labelledby={visionLabelId}
            value={visionMode}
            onChange={(event) => onVisionModeChange(event.target.value as VisionSimulationId)}
            className="rounded-[var(--radius-sm)] border border-border-strong bg-surface-alt px-2 py-1.5 text-xs font-semibold text-text-heading"
          >
            {VISION_SIMULATIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
