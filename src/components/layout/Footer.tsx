import { Link } from 'react-router-dom';
import { RatioMark } from '@/components/brand/RatioMark';
import { Container } from '@/components/ui/Container';
import { MARKETING_NAV_LINKS, FOOTER_LEGAL_LINKS } from '@/types/navigation';

const GITHUB_URL = 'https://github.com/prabhu-cg/Ratio';

const FOOTER_LINK_CLASSES =
  'text-sm text-text-muted transition-colors duration-150 hover:text-text-heading';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-surface-page">
      <Container width="wide" className="py-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <RatioMark size={20} />
            <span className="font-display text-base font-extrabold tracking-[-0.02em] text-text-heading">
              RATIO
            </span>
          </div>

          <p className="text-sm text-text-muted">
            © {year} RATIO. Balance colour. Build hierarchy.
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {MARKETING_NAV_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className={FOOTER_LINK_CLASSES}>
                {link.label}
              </Link>
            ))}
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className={FOOTER_LINK_CLASSES}>
                {link.label}
              </Link>
            ))}
            <Link to="/app" className={FOOTER_LINK_CLASSES}>
              Open RATIO
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={FOOTER_LINK_CLASSES}
            >
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
