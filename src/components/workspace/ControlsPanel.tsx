import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { ColourInputCard } from '@/components/workspace/ColourInputCard';
import { DEFAULT_HEX, DEFAULT_SUPPORTING_HEX, paletteRoles, supportingRoles } from '@/types/palette';
import type { AnyRoleId, ProjectPalette } from '@/types/palette';

interface ControlsPanelProps {
  palette: ProjectPalette;
  isModified: boolean;
  onChangeRoleHex: (roleId: AnyRoleId, hex: string) => boolean;
  onResetRole: (roleId: AnyRoleId) => void;
}

export function ControlsPanel({
  palette,
  isModified,
  onChangeRoleHex,
  onResetRole,
}: ControlsPanelProps) {
  const roles = paletteRoles(palette.ratio);
  const supporting = supportingRoles(palette.supporting);

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
              defaultHex={DEFAULT_HEX[role.id]}
              onChangeHex={(hex) => onChangeRoleHex(role.id, hex)}
              onResetRole={() => onResetRole(role.id)}
            />
            {index !== roles.length - 1 ? <Divider /> : null}
          </li>
        ))}
      </ol>

      <Divider />

      <div className="flex flex-col gap-6">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Supporting colours
        </h2>

        {supporting.map((role) => (
          <ColourInputCard
            key={role.id}
            role={role}
            defaultHex={DEFAULT_SUPPORTING_HEX[role.id]}
            onChangeHex={(hex) => onChangeRoleHex(role.id, hex)}
            onResetRole={() => onResetRole(role.id)}
          />
        ))}

        <p className="text-xs leading-relaxed text-text-muted">
          Supporting colours are functional colours used alongside the 60–30–10 palette and are
          not included in the visual ratio.
        </p>
      </div>

      <p className="mt-auto rounded-[var(--radius-md)] border border-dashed border-border-strong p-4 text-xs leading-relaxed text-text-muted">
        Colours only live in this session — nothing is saved once you close the tab.
      </p>
    </aside>
  );
}
