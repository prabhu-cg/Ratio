import type { HTMLAttributes, ReactNode } from 'react';

interface PreviewSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function PreviewSection({ children, className = '', ...rest }: PreviewSectionProps) {
  return (
    <section className={`px-6 py-10 @lg:px-10 @lg:py-14 ${className}`} {...rest}>
      {children}
    </section>
  );
}
