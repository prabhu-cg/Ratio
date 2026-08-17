interface PreviewNavigationProps {
  links: string[];
  /** Index of the link styled as the current page, using the accent colour sparingly. Pass -1 for none. */
  activeIndex?: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function PreviewNavigation({
  links,
  activeIndex = 0,
  orientation = 'horizontal',
  className = '',
}: PreviewNavigationProps) {
  return (
    <nav
      aria-label="Preview site navigation"
      className={`flex ${orientation === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-1'} ${className}`}
    >
      {links.map((link, index) => {
        const isActive = index === activeIndex;
        return (
          <a
            key={link}
            href="#"
            onClick={(event) => event.preventDefault()}
            aria-current={isActive ? 'page' : undefined}
            className={`text-sm font-medium transition-opacity duration-150 hover:opacity-100 ${
              isActive ? 'text-[var(--preview-accent)] opacity-100' : 'opacity-75'
            } ${orientation === 'vertical' ? 'rounded-md px-2 py-1.5' : ''} ${
              isActive && orientation === 'vertical' ? 'bg-[var(--preview-accent)]/10' : ''
            }`}
          >
            {link}
          </a>
        );
      })}
    </nav>
  );
}
