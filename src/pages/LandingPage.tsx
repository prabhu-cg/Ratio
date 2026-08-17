import { Hero } from '@/components/marketing/Hero';
import { ProblemSection } from '@/components/marketing/ProblemSection';
import { RatioExplainerSection } from '@/components/marketing/RatioExplainerSection';
import { PreviewSection } from '@/components/marketing/PreviewSection';
import { AccessibilitySection } from '@/components/marketing/AccessibilitySection';
import { BenefitsSection } from '@/components/marketing/BenefitsSection';
import { FinalCtaSection } from '@/components/marketing/FinalCtaSection';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function LandingPage() {
  useDocumentTitle('RATIO — Balance colour. Build hierarchy.');

  return (
    <>
      <Hero />
      <ProblemSection />
      <RatioExplainerSection />
      <PreviewSection />
      <AccessibilitySection />
      <BenefitsSection />
      <FinalCtaSection />
    </>
  );
}

export default LandingPage;
