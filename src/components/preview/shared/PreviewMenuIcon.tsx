interface PreviewMenuIconProps {
  className?: string;
}

/** The mobile-nav hamburger glyph shown wherever a preview template collapses its
 * navigation below @lg — kept as one component so every template's mobile header uses
 * the same icon at the same size, rather than each hand-rolling its own. */
export function PreviewMenuIcon({ className = '' }: PreviewMenuIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-md border border-current/25 ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 4h10M2 7h10M2 10h10"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
