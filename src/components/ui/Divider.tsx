interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className = '', orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch bg-border-default ${className}`}
      />
    );
  }

  return (
    <hr role="separator" className={`border-t border-border-default ${className}`} />
  );
}
