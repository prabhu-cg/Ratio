interface RatioMarkProps {
  size?: number;
  className?: string;
}

const NATIVE_WIDTH = 142;
const NATIVE_HEIGHT = 128;

export function RatioMark({ size = 24, className = '' }: RatioMarkProps) {
  const height = size;
  const width = (size * NATIVE_WIDTH) / NATIVE_HEIGHT;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${NATIVE_WIDTH} ${NATIVE_HEIGHT}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 0H54.9677V128H0V0Z" fill="#C74504" />
      <path d="M68.7097 0H112.226V128H68.7097V0Z" fill="#444444" />
      <path d="M125.968 0H142V128H125.968V0Z" fill="#D98155" />
    </svg>
  );
}
