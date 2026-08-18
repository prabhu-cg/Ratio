import { PreviewNavigation } from './PreviewNavigation';
import { PreviewButton } from './PreviewButton';
import { PreviewMenuIcon } from './PreviewMenuIcon';

interface PreviewHeaderProps {
  brand: string;
  links: string[];
  cta?: string;
}

export function PreviewHeader({ brand, links, cta }: PreviewHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 bg-[var(--preview-secondary)] px-6 py-4 text-[var(--preview-text)] @lg:px-10">
      <span className="text-base font-bold">{brand}</span>

      <PreviewNavigation links={links} activeIndex={0} className="hidden @lg:flex" />

      {cta ? (
        <PreviewButton variant="primary" className="hidden! @lg:inline-flex!">
          {cta}
        </PreviewButton>
      ) : null}

      <PreviewMenuIcon className="@lg:hidden" />
    </header>
  );
}
