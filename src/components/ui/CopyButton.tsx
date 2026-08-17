interface CopyButtonProps {
  label: string;
  copied: boolean;
  onCopy: () => void;
  className?: string;
}

export function CopyButton({ label, copied, onCopy, className = '' }: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      className={`inline-flex h-9 flex-none items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 ${
        copied
          ? 'text-brand'
          : 'text-text-muted hover:bg-surface-alt hover:text-text-heading'
      } ${className}`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2.5 6.5L4.75 8.75L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M2.5 7.5V2.5C2.5 1.94772 2.94772 1.5 3.5 1.5H7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
