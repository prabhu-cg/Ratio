import { Link } from 'react-router-dom';
import { RatioMark } from '@/components/brand/RatioMark';
import { Container } from '@/components/ui/Container';
import { Divider } from '@/components/ui/Divider';
import { MARKETING_NAV_LINKS } from '@/types/navigation';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-inverse text-text-inverse">
      <Container width="wide" className="py-14 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <RatioMark size={22} />
              <span className="font-display text-lg font-extrabold tracking-[-0.02em]">
                RATIO
              </span>
            </div>
            <p className="max-w-xs text-sm text-text-inverse/70">
              Balance colour. Build hierarchy.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2.5 sm:items-end">
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-text-inverse/80 hover:text-text-inverse"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/app" className="text-sm text-text-inverse/80 hover:text-text-inverse">
              Open RATIO
            </Link>
          </nav>
        </div>

        <Divider className="my-10 border-white/10" />

        <p className="text-xs text-text-inverse/50">
          © {year} RATIO. A free tool for designers — no account, no tracking of your palettes.
        </p>
      </Container>
    </footer>
  );
}
