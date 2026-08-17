import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { DEFAULT_PALETTE, paletteRoles } from '@/types/palette';
import { pickReadableTextColor } from '@/lib/color';

const roles = paletteRoles(DEFAULT_PALETTE);

export function RatioExplainerSection() {
  return (
    <Section tone="alt" id="the-principle">
      <Container width="wide">
        <div className="max-w-lg">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            The formula
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-4xl">
            One ratio, three roles
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-primary">
            The 60–30–10 principle splits an interface into three proportions, each with its own
            job to do.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border-strong"
            >
              <div
                className="flex items-end justify-between p-6"
                style={{
                  backgroundColor: role.colour.hex,
                  color: pickReadableTextColor(role.colour.rgb),
                  height: '9rem',
                }}
              >
                <span className="font-display text-4xl font-extrabold tracking-[-0.02em]">
                  {role.percentage}%
                </span>
              </div>
              <div className="bg-surface-card p-6">
                <h3 className="font-display text-lg font-bold text-text-heading">{role.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
