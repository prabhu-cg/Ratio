import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { CopyButton } from '@/components/ui/CopyButton';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import {
  buildCssVariables,
  buildJsonExport,
  buildPalettePngBlob,
  buildPaletteSvg,
  downloadBlob,
  downloadTextFile,
} from '@/lib/exportFormats';
import { paletteRoles, supportingRoles } from '@/types/palette';
import type { ProjectPalette } from '@/types/palette';

interface ExportDrawerProps {
  palette: ProjectPalette;
  open: boolean;
  onClose: () => void;
}

export function ExportDrawer({ palette, open, onClose }: ExportDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { copy, copiedKey } = useCopyToClipboard();

  useFocusTrap(open, panelRef, closeButtonRef, onClose);

  if (!open) return null;

  const css = buildCssVariables(palette);
  const json = buildJsonExport(palette);

  const handleDownloadSvg = () => {
    downloadTextFile(buildPaletteSvg(palette.ratio), 'ratio-palette.svg', 'image/svg+xml');
  };

  const handleDownloadPng = async () => {
    const blob = await buildPalettePngBlob(palette.ratio);
    if (blob) downloadBlob(blob, 'ratio-palette.png');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink-900/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-drawer-heading"
        className="relative flex h-full w-full max-w-sm flex-col gap-6 overflow-y-auto border-l border-border-default bg-surface-card p-6 shadow-[var(--shadow-card)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="export-drawer-heading"
              className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted"
            >
              5 · Export
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Take your palette into your design or development workflow.
            </p>
          </div>
          <IconButton ref={closeButtonRef} label="Close export panel" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Palette
          </h3>

          <div className="flex flex-col gap-2">
            {[...paletteRoles(palette.ratio), ...supportingRoles(palette.supporting)].map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-border-default p-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-6 w-6 flex-none rounded-[var(--radius-sm)] border border-border-strong"
                    style={{ backgroundColor: role.colour.hex }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-text-heading">{role.label}</div>
                    <div className="font-mono text-xs text-text-muted">{role.colour.hex}</div>
                  </div>
                </div>
                <CopyButton
                  label={`Copy ${role.label} hex value`}
                  copied={copiedKey === `palette-${role.id}`}
                  onCopy={() => copy(`palette-${role.id}`, role.colour.hex, `${role.label} hex`)}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={handleDownloadSvg}>
              Download SVG
            </Button>
            <Button variant="secondary" size="md" className="flex-1" onClick={handleDownloadPng}>
              Download PNG
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
              CSS
            </h3>
            <CopyButton
              label="Copy CSS variables"
              copied={copiedKey === 'css'}
              onCopy={() => copy('css', css, 'CSS variables')}
            />
          </div>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] border border-border-default bg-surface-alt p-3 font-mono text-xs leading-relaxed text-text-primary">
            <code>{css}</code>
          </pre>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
              JSON
            </h3>
            <CopyButton
              label="Copy JSON"
              copied={copiedKey === 'json'}
              onCopy={() => copy('json', json, 'JSON')}
            />
          </div>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] border border-border-default bg-surface-alt p-3 font-mono text-xs leading-relaxed text-text-primary">
            <code>{json}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
