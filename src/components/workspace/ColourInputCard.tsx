import { useId, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { ColourDetails } from '@/components/workspace/ColourDetails';
import type { RatioRole, SupportingRole } from '@/types/palette';

interface ColourInputCardProps {
  role: RatioRole | SupportingRole;
  defaultHex: string;
  onChangeHex: (hex: string) => boolean;
  onResetRole: () => void;
}

export function ColourInputCard({ role, defaultHex, onChangeHex, onResetRole }: ColourInputCardProps) {
  const [draft, setDraft] = useState(role.colour.hex);
  const [error, setError] = useState(false);
  const [syncedHex, setSyncedHex] = useState(role.colour.hex);
  const descriptionId = useId();
  const inputId = useId();
  const pickerLabelId = useId();

  if (role.colour.hex !== syncedHex) {
    setSyncedHex(role.colour.hex);
    setDraft(role.colour.hex);
    setError(false);
  }

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(role.colour.hex);
      setError(false);
      return;
    }
    setError(!onChangeHex(trimmed));
  };

  const isDefault = role.colour.hex === defaultHex;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span id={pickerLabelId} className="text-sm font-semibold text-text-heading">
          {role.label}
        </span>
        {'percentage' in role ? (
          <span className="font-mono text-xs text-text-muted">{role.percentage}%</span>
        ) : null}
      </div>

      <p id={descriptionId} className="text-xs leading-relaxed text-text-muted">
        {role.description}
      </p>

      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-labelledby={pickerLabelId}
          aria-describedby={descriptionId}
          value={role.colour.hex}
          onChange={(event) => onChangeHex(event.target.value)}
          className="h-9 w-9 flex-none cursor-pointer rounded-[var(--radius-sm)] border border-border-strong bg-transparent p-0 [&::-webkit-color-swatch]:rounded-[3px] [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0.5"
        />

        <div className="flex-1">
          <Input
            id={inputId}
            label={`${role.label} hex value`}
            hideLabel
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commit();
              }
            }}
            aria-describedby={descriptionId}
            aria-invalid={error}
            spellCheck={false}
            autoComplete="off"
            className={`font-mono text-xs uppercase tracking-wide ${
              error ? 'border-red-400 text-red-600 focus-visible:border-red-400' : ''
            }`}
          />
        </div>
      </div>

      <div className="flex items-start justify-between">
        <ColourDetails colour={role.colour} roleLabel={role.label} />

        <Tooltip
          align="end"
          content={isDefault ? `${role.label} is at its default colour` : `Reset ${role.label} to default`}
        >
          <IconButton
            label={`Reset ${role.label} to default`}
            onClick={onResetRole}
            disabled={isDefault}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2.5 7a4.5 4.5 0 1 1 1.35 3.2M2.5 7V3.5M2.5 7H6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        </Tooltip>
      </div>

      {error ? (
        <p role="alert" className="text-xs text-red-600">
          Enter a valid hex colour, like #C74504.
        </p>
      ) : null}
    </div>
  );
}
