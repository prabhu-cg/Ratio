import { useId, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { cloneElement } from 'react';

interface TooltipProps {
  content: string;
  children: ReactElement<{ 'aria-describedby'?: string }>;
  side?: 'top' | 'bottom';
  /** 'center' pins the tooltip's midpoint to the trigger's midpoint (default). 'end'
   * pins the tooltip's right edge to the trigger's right edge instead, so a tooltip
   * wider than its trigger grows leftward — use this for triggers near a container's
   * right edge, where a centered tooltip would overflow and get clipped. */
  align?: 'center' | 'end';
}

export function Tooltip({ content, children, side = 'top', align = 'center' }: TooltipProps): ReactNode {
  const [visible, setVisible] = useState(false);
  const id = useId();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const sidePosition = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const alignPosition = align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';

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
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-[var(--radius-sm)] bg-surface-inverse px-2.5 py-1.5 text-xs font-medium text-text-inverse shadow-[var(--shadow-card)] transition-opacity duration-150 ${sidePosition} ${alignPosition} ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {content}
      </span>
    </span>
  );
}
