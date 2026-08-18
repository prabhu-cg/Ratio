/** The "?" glyph used for every help/info trigger, so they all read as the same affordance. */
export function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M6.2 6.3c0-1 .8-1.7 1.8-1.7s1.8.6 1.8 1.6c0 .9-.6 1.2-1.2 1.6-.5.3-.8.6-.8 1.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="11.4" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
