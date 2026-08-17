import { PREVIEW_TEMPLATES, PREVIEW_VIEWPORTS } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';

interface PreviewToolbarProps {
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
}

export function PreviewToolbar({ templateId, viewport }: PreviewToolbarProps) {
  const template = PREVIEW_TEMPLATES.find((option) => option.id === templateId);
  const view = PREVIEW_VIEWPORTS.find((option) => option.id === viewport);

  return (
    <div className="flex items-center gap-3 border-b border-border-default bg-surface-card px-3 py-2">
      <div className="flex flex-none gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
      </div>
      <span className="flex-1 truncate rounded-[var(--radius-sm)] bg-surface-alt px-2.5 py-1 text-center font-mono text-[11px] text-text-muted">
        {template?.label} · {view?.label} · {view?.width}px
      </span>
    </div>
  );
}
