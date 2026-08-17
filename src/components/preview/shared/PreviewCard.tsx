import type { HTMLAttributes, ReactNode } from 'react';

interface PreviewCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PreviewCard({ children, className = '', ...rest }: PreviewCardProps) {
  return (
    <div
      className={`rounded-lg bg-[var(--preview-secondary)] p-5 text-[var(--preview-on-secondary)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
