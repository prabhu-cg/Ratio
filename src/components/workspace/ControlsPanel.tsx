import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { ColourInputCard } from '@/components/workspace/ColourInputCard';
import { paletteRoles } from '@/types/palette';
import type { PaletteRoleId, RatioPalette } from '@/types/palette';

interface ControlsPanelProps {
  palette: RatioPalette;
  isModified: boolean;
  onChangeRoleHex: (roleId: PaletteRoleId, hex: string) => boolean;
  onResetRole: (roleId: PaletteRoleId) => void;
}

export function ControlsPanel({
  palette,
  isModified,
  onChangeRoleHex,
  onResetRole,
}: ControlsPanelProps) {
  const roles = paletteRoles(palette);

  return (
    <aside className="workspace-controls flex flex-col gap-6 overflow-y-auto overflow-x-hidden bg-surface-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          1 · Choose colours
        </h2>
        <Badge tone={isModified ? 'brand' : 'neutral'}>{isModified ? 'Custom' : 'Default'}</Badge>
      </div>

      <ol className="flex flex-col gap-6">
        {roles.map((role, index) => (
          <li key={role.id} className="flex flex-col gap-6">
            <ColourInputCard
              role={role}
              onChangeHex={(hex) => onChangeRoleHex(role.id, hex)}
              onResetRole={() => onResetRole(role.id)}
            />
            {index !== roles.length - 1 ? <Divider /> : null}
          </li>
        ))}
      </ol>

      <p className="mt-auto rounded-[var(--radius-md)] border border-dashed border-border-strong p-4 text-xs leading-relaxed text-text-muted">
        Colours only live in this session — nothing is saved once you close the tab.
      </p>
    </aside>
  );
}
