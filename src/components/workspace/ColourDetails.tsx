import { formatHsl, formatRgb } from '@/lib/color';
import { CopyButton } from '@/components/ui/CopyButton';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Colour } from '@/types/color';

interface ColourDetailsProps {
  colour: Colour;
  roleLabel: string;
}

export function ColourDetails({ colour, roleLabel }: ColourDetailsProps) {
  const { copy, copiedKey } = useCopyToClipboard();

  const rows = [
    { key: 'hex', label: 'HEX', value: colour.hex },
    { key: 'rgb', label: 'RGB', value: formatRgb(colour.rgb) },
    { key: 'hsl', label: 'HSL', value: formatHsl(colour.hsl) },
  ];

  return (
    <details className="group rounded-[var(--radius-sm)] border border-border-default">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-semibold text-text-muted [&::-webkit-details-marker]:hidden">
        <span>Colour values</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-150 group-open:rotate-180"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="flex flex-col gap-1 border-t border-border-default p-3">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-text-primary">
              <span className="mr-2 text-text-faint">{row.label}</span>
              {row.value}
            </span>
            <CopyButton
              label={`Copy ${row.label} value for ${roleLabel}`}
              copied={copiedKey === row.key}
              onCopy={() => copy(row.key, row.value)}
            />
          </div>
        ))}
      </div>
    </details>
  );
}
