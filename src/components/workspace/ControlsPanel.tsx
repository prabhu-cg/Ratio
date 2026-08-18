import { Divider } from '@/components/ui/Divider';
import { ColourInputCard } from '@/components/workspace/ColourInputCard';
import { DEFAULT_HEX, DEFAULT_SUPPORTING_HEX, paletteRoles, supportingRoles } from '@/types/palette';
import type { AnyRoleId, ProjectPalette } from '@/types/palette';

interface ControlsPanelProps {
  palette: ProjectPalette;
  onChangeRoleHex: (roleId: AnyRoleId, hex: string) => boolean;
  onResetRole: (roleId: AnyRoleId) => void;
}

export function ControlsPanel({ palette, onChangeRoleHex, onResetRole }: ControlsPanelProps) {
  const roles = paletteRoles(palette.ratio);
  const supporting = supportingRoles(palette.supporting);

  return (
    <aside className="workspace-controls flex flex-col gap-6 overflow-y-auto overflow-x-hidden bg-surface-card p-5 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          1 · Your colours
        </h2>
        <p className="text-sm text-text-muted">
          Choose the colours that define your visual hierarchy.
        </p>
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
          Text / Foreground is a supporting colour used for readable content and interface
          foregrounds — it is not included in the 60–30–10 visual ratio.
        </p>
      </div>

      <p className="mt-auto flex items-center gap-1.5 text-xs text-text-faint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.5 6.25L4.75 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Saved locally in this browser
      </p>
    </aside>
  );
}
