import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'md' | 'lg';

interface SharedProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Appends a trailing arrow — RATIO's CTA convention for the primary "go" action. */
  withArrow?: boolean;
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold ' +
  'transition-colors duration-150 ease-[var(--ease-standard)] disabled:opacity-50 ' +
  'disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-text-inverse hover:bg-brand-ink',
  secondary:
    'bg-transparent text-text-heading border border-border-strong hover:bg-surface-alt hover:border-ink-700',
  ghost: 'bg-transparent text-text-primary hover:text-text-heading hover:bg-surface-alt',
  inverse: 'bg-surface-card text-text-heading hover:bg-surface-alt',
};

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    withArrow = false,
    ...rest
  } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = withArrow ? (
    <>
      {children}
      <ArrowIcon />
    </>
  ) : (
    children
  );

  if ('href' in props && props.href) {
    const href = props.href;
    const { href: _href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    const isInternal = href.startsWith('/');
    if (isInternal) {
      return (
        <Link to={href} className={classes} {...anchorRest}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorRest}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
