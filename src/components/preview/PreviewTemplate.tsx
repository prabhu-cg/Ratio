import { memo } from 'react';
import { LandingPreview } from '@/components/preview/LandingPreview';
import { DashboardPreview } from '@/components/preview/DashboardPreview';
import { ContentPreview } from '@/components/preview/ContentPreview';
import type { PreviewTemplateId } from '@/types/preview';

interface PreviewTemplateProps {
  templateId: PreviewTemplateId;
}

export const PreviewTemplate = memo(function PreviewTemplate({ templateId }: PreviewTemplateProps) {
  switch (templateId) {
    case 'dashboard':
      return <DashboardPreview />;
    case 'content':
      return <ContentPreview />;
    case 'landing':
    default:
      return <LandingPreview />;
  }
});
