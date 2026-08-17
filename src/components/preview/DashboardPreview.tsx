import { memo, useState } from 'react';
import { PreviewButton, PreviewCard, PreviewNavigation } from '@/components/preview/shared';

const SIDEBAR_LINKS = ['Overview', 'Projects', 'Activity', 'Reports', 'Settings'];
const DATE_RANGES = ['This week', 'This month', 'This quarter'];

const SUMMARY = [
  { label: 'Active projects', value: '24' },
  { label: 'Tasks completed', value: '312' },
  { label: 'Team members', value: '18' },
];

const ROWS = [
  { name: 'Website redesign', owner: 'Priya', status: 'On track' },
  { name: 'Mobile app v2', owner: 'Daniel', status: 'At risk' },
  { name: 'Q3 marketing plan', owner: 'Sofia', status: 'On track' },
  { name: 'API migration', owner: 'Marcus', status: 'Blocked' },
];

export const DashboardPreview = memo(function DashboardPreview() {
  const [activeRange, setActiveRange] = useState(0);

  return (
    <div className="flex min-h-full bg-[var(--preview-dominant)] text-[var(--preview-on-dominant)]">
      <aside className="hidden flex-none flex-col gap-8 bg-[var(--preview-secondary)] px-5 py-6 text-[var(--preview-on-secondary)] @5xl:flex @5xl:w-56">
        <span className="text-base font-bold">Acme</span>
        <PreviewNavigation links={SIDEBAR_LINKS} orientation="vertical" activeIndex={0} />
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 bg-[var(--preview-secondary)] px-5 py-4 text-[var(--preview-on-secondary)] @5xl:bg-transparent @5xl:px-8 @5xl:py-6 @5xl:text-[var(--preview-on-dominant)]">
          <span className="text-base font-bold @5xl:hidden">Acme</span>
          <h1 className="hidden text-xl font-bold @5xl:block">Overview</h1>
          <PreviewButton variant="primary" className="hidden! @lg:inline-flex!">
            New project
          </PreviewButton>
        </div>

        <nav
          aria-label="Sections"
          className="flex gap-2 overflow-x-auto border-b border-[var(--preview-on-dominant)]/10 px-5 py-3 @5xl:hidden"
        >
          {SIDEBAR_LINKS.map((link, index) => (
            <span
              key={link}
              className={`flex-none rounded-full px-3 py-1.5 text-xs font-semibold ${
                index === 0
                  ? 'bg-[var(--preview-accent)] text-[var(--preview-on-accent)]'
                  : 'bg-[var(--preview-on-dominant)]/5 opacity-70'
              }`}
            >
              {link}
            </span>
          ))}
        </nav>

        <div className="flex flex-1 flex-col gap-8 px-5 py-6 @lg:px-8 @lg:py-8">
          <h1 className="text-xl font-bold @5xl:hidden">Overview</h1>

          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
            {SUMMARY.map((item) => (
              <PreviewCard key={item.label}>
                <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                  {item.label}
                </div>
                <div className="mt-2 text-2xl font-bold">{item.value}</div>
              </PreviewCard>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div
              role="tablist"
              aria-label="Date range"
              className="flex gap-1 border-b border-[var(--preview-on-dominant)]/10"
            >
              {DATE_RANGES.map((range, index) => (
                <button
                  key={range}
                  type="button"
                  role="tab"
                  aria-selected={index === activeRange}
                  onClick={() => setActiveRange(index)}
                  className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    index === activeRange
                      ? 'border-[var(--preview-accent)] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-[var(--preview-on-dominant)]/10">
              <div className="hidden grid-cols-[1fr_auto_auto] gap-4 bg-[var(--preview-on-dominant)]/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide opacity-60 @lg:grid">
                <span>Project</span>
                <span>Owner</span>
                <span>Status</span>
              </div>
              {ROWS.map((row, index) => (
                <div
                  key={row.name}
                  className={`flex flex-col gap-1 px-4 py-3 @lg:grid @lg:grid-cols-[1fr_auto_auto] @lg:items-center @lg:gap-4 ${
                    index !== 0 ? 'border-t border-[var(--preview-on-dominant)]/10' : ''
                  }`}
                >
                  <span className="text-sm font-medium">{row.name}</span>
                  <span className="text-xs opacity-70">{row.owner}</span>
                  <span className="inline-flex w-fit items-center rounded-full border border-current/25 px-2 py-0.5 text-[11px] font-medium opacity-80">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
