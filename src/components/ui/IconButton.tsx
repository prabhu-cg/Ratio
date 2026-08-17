import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  variant?: 'default' | 'inverse';
}

export function IconButton({
  label,
  children,
  variant = 'default',
  className = '',
  ...rest
}: IconButtonProps) {
  const variants = {
    default: 'text-text-primary hover:bg-surface-alt hover:text-text-heading',
    inverse: 'text-text-inverse/80 hover:bg-white/10 hover:text-text-inverse',
  };

  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-150 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
