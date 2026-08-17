import { PreviewNavigation } from './PreviewNavigation';
import { PreviewButton } from './PreviewButton';

interface PreviewHeaderProps {
  brand: string;
  links: string[];
  cta?: string;
}

export function PreviewHeader({ brand, links, cta }: PreviewHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 bg-[var(--preview-secondary)] px-6 py-4 text-[var(--preview-on-secondary)] @lg:px-10">
      <span className="text-base font-bold">{brand}</span>

      <PreviewNavigation links={links} activeIndex={0} className="hidden @lg:flex" />

      {cta ? (
        <PreviewButton variant="primary" className="hidden! @lg:inline-flex!">
          {cta}
        </PreviewButton>
      ) : null}

      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-md border border-current/25 @lg:hidden"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 4h10M2 7h10M2 10h10"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </header>
  );
}
