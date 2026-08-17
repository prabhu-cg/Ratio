import { useId, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cloneElement } from 'react';

interface TooltipProps {
  content: string;
  children: ReactElement<{ 'aria-describedby'?: string }>;
  side?: 'top' | 'bottom';
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps): ReactNode {
  const [visible, setVisible] = useState(false);
  const id = useId();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const sidePosition = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-surface-inverse px-2.5 py-1.5 text-xs font-medium text-text-inverse shadow-[var(--shadow-card)] transition-opacity duration-150 ${sidePosition} ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {content}
      </span>
    </span>
  );
}
