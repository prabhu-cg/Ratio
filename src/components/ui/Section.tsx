import type { HTMLAttributes, ReactNode } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  tone?: 'page' | 'alt' | 'inverse' | 'brand';
  spacing?: 'default' | 'compact';
}

const tones = {
  page: 'bg-surface-page text-text-primary',
  alt: 'bg-section-alt text-text-primary',
  inverse: 'bg-surface-inverse text-text-inverse',
  brand: 'bg-brand text-text-inverse',
};

const spacings = {
  default: 'py-16 sm:py-24',
  compact: 'py-10 sm:py-14',
};

export function Section({
  children,
  tone = 'page',
  spacing = 'default',
  className = '',
  ...rest
}: SectionProps) {
  return (
    <section className={`${tones[tone]} ${spacings[spacing]} ${className}`} {...rest}>
      {children}
    </section>
  );
}
