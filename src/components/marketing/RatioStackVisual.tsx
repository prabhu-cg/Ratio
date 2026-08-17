import { DEFAULT_PALETTE, paletteRoles, type RatioPalette } from '@/types/palette';
import { pickReadableTextColor } from '@/lib/color';

interface RatioStackVisualProps {
  palette?: RatioPalette;
  className?: string;
  heightClassName?: string;
  labelled?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export function RatioStackVisual({
  palette = DEFAULT_PALETTE,
  className = '',
  heightClassName = 'h-[380px] sm:h-[440px]',
  labelled = true,
  orientation = 'vertical',
}: RatioStackVisualProps) {
  const roles = paletteRoles(palette);
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`flex overflow-hidden rounded-[var(--radius-lg)] border border-border-strong shadow-[var(--shadow-card)] ${
        isHorizontal ? 'flex-row' : 'flex-col'
      } ${heightClassName} ${className}`}
      role="img"
      aria-label={`A visual balance of ${roles
        .map((role) => `${role.percentage}% ${role.label}, ${role.colour.hex}`)
        .join(', ')}.`}
    >
      {roles.map((role, index) => (
        <div
          key={role.id}
          className={`relative flex transition-colors duration-200 ${
            isHorizontal
              ? `flex-col items-start justify-end gap-1 px-3 py-4 sm:px-4 ${
                  index !== roles.length - 1 ? 'border-r border-black/10' : ''
                }`
              : `items-center justify-between px-6 sm:px-8 ${
                  index !== roles.length - 1 ? 'border-b border-black/10' : ''
                }`
          }`}
          style={{
            flexGrow: role.percentage,
            backgroundColor: role.colour.hex,
            color: pickReadableTextColor(role.colour.rgb),
          }}
        >
          {labelled ? (
            <>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80 sm:text-xs">
                {role.label}
              </span>
              <span
                className={`font-display font-extrabold tracking-[-0.02em] ${
                  isHorizontal ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'
                }`}
              >
                {role.percentage}%
              </span>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
