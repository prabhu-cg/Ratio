import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  padding = 'md',
  bordered = true,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] bg-surface-card ${
        bordered ? 'border border-border-default' : ''
      } ${paddings[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
