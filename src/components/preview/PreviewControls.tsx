import { PREVIEW_TEMPLATES, PREVIEW_VIEWPORTS } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';

interface PreviewControlsProps {
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
  onTemplateChange: (id: PreviewTemplateId) => void;
  onViewportChange: (id: PreviewViewportId) => void;
}

export function PreviewControls({
  templateId,
  viewport,
  onTemplateChange,
  onViewportChange,
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
    </div>
  );
}
