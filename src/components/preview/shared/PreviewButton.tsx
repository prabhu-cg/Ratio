import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PreviewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const base =
  'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-opacity ' +
  'duration-150 hover:opacity-85 focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[var(--preview-accent)]';

const variants: Record<'primary' | 'secondary' | 'ghost', string> = {
  primary: 'bg-[var(--preview-accent)] text-[var(--preview-on-accent)] px-4 py-2',
  secondary:
    'border border-current bg-transparent text-[var(--preview-text)] px-4 py-2',
  ghost: 'bg-transparent text-[var(--preview-text)] underline underline-offset-4 px-0 py-1',
};

export function PreviewButton({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: PreviewButtonProps) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
