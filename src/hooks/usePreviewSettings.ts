import { useCallback, useEffect, useState } from 'react';
import { loadPersistedState, patchPersistedState } from '@/lib/storage';
import { PREVIEW_TEMPLATES, PREVIEW_VIEWPORTS } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import { VISION_SIMULATIONS } from '@/types/accessibility';
import type { VisionSimulationId } from '@/types/accessibility';

const DEFAULT_TEMPLATE: PreviewTemplateId = 'landing';
const DEFAULT_VIEWPORT: PreviewViewportId = 'desktop';
const DEFAULT_VISION: VisionSimulationId = 'normal';

function isValidTemplate(value: string | undefined): value is PreviewTemplateId {
  return PREVIEW_TEMPLATES.some((option) => option.id === value);
}

function isValidViewport(value: string | undefined): value is PreviewViewportId {
  return PREVIEW_VIEWPORTS.some((option) => option.id === value);
}

function isValidVision(value: string | undefined): value is VisionSimulationId {
  return VISION_SIMULATIONS.some((option) => option.id === value);
}

export function usePreviewSettings() {
  const [templateId, setTemplateId] = useState<PreviewTemplateId>(() => {
    const persisted = loadPersistedState().template;
    return isValidTemplate(persisted) ? persisted : DEFAULT_TEMPLATE;
  });
  const [viewport, setViewport] = useState<PreviewViewportId>(() => {
    const persisted = loadPersistedState().viewport;
    return isValidViewport(persisted) ? persisted : DEFAULT_VIEWPORT;
  });
  const [visionMode, setVisionMode] = useState<VisionSimulationId>(() => {
    const persisted = loadPersistedState().visionMode;
    return isValidVision(persisted) ? persisted : DEFAULT_VISION;
  });

  useEffect(() => {
    patchPersistedState({ template: templateId, viewport, visionMode });
  }, [templateId, viewport, visionMode]);

  const resetVisionMode = useCallback(() => setVisionMode(DEFAULT_VISION), []);

  return {
    templateId,
    setTemplateId,
    viewport,
    setViewport,
    visionMode,
    setVisionMode,
    resetVisionMode,
  };
}
