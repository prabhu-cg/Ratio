import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
}

export function Input({ label, hideLabel = false, hint, id, className = '', ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={
          hideLabel
            ? 'sr-only'
            : 'font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted'
        }
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`h-10 rounded-[var(--radius-sm)] border border-border-default bg-surface-card px-3 text-sm text-text-heading placeholder:text-text-faint focus-visible:border-brand ${className}`}
        {...rest}
      />
      {hint ? <span className="text-xs text-text-muted">{hint}</span> : null}
    </div>
  );
}
