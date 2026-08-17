interface RatioMarkProps {
  size?: number;
  className?: string;
}

export function RatioMark({ size = 24, className = '' }: RatioMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="1.5" y="1.5" width="97" height="97" rx="14" fill="#f7f5f0" />
      <rect x="59.5" y="1.5" width="29" height="97" fill="#444444" />
      <rect x="88.5" y="1.5" width="10" height="97" fill="#c74504" />
      <rect x="1.5" y="1.5" width="97" height="97" rx="14" fill="none" stroke="#444444" strokeWidth="3" />
    </svg>
  );
}
