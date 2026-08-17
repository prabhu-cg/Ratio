import { Link } from 'react-router-dom';
import { RatioMark } from './RatioMark';

interface LogoProps {
  withTagline?: boolean;
  className?: string;
  to?: string;
}

export function Logo({ withTagline = false, className = '', to = '/' }: LogoProps) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] ${className}`}
      aria-label="RATIO — home"
    >
      <RatioMark size={22} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-extrabold tracking-[-0.02em] text-text-heading">
          RATIO
        </span>
        {withTagline ? (
          <span className="mt-1 font-mono text-[11px] font-medium tracking-[0.02em] text-text-muted">
            Balance colour. Build hierarchy.
          </span>
        ) : null}
      </span>
    </Link>
  );
}
