import type { HTMLAttributes, ReactNode } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width?: 'default' | 'narrow' | 'wide';
}

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

export function Container({ children, width = 'default', className = '', ...rest }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${widths[width]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
