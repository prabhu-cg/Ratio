import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MARKETING_NAV_LINKS } from '@/types/navigation';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-surface-page/90 backdrop-blur-sm">
      <Container width="wide">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {MARKETING_NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-text-heading'
                      : 'text-text-primary hover:text-text-heading'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button href="/app" size="md" className="ml-2" withArrow>
              Try RATIO — Free
            </Button>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-text-heading md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 4L16 16M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M3 5.5H17M3 10H17M3 14.5H17"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div id="mobile-nav" className="border-t border-border-default bg-surface-page md:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
              {MARKETING_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-[var(--radius-sm)] px-3 py-2.5 text-base font-medium ${
                      isActive ? 'text-text-heading' : 'text-text-primary'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Button
                href="/app"
                size="lg"
                className="mt-2 w-full"
                onClick={() => setMenuOpen(false)}
                withArrow
              >
                Try RATIO — Free
              </Button>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
