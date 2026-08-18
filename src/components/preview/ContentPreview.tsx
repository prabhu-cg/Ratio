import { memo } from 'react';
import {
  PreviewButton,
  PreviewCard,
  PreviewHeader,
  PreviewNavigation,
} from '@/components/preview/shared';

const NAV_LINKS = ['Latest', 'Guides', 'Interviews'];

const RELATED = [
  'How teams are rethinking onboarding',
  'A field guide to async design reviews',
  'What changed in our design system this quarter',
];

export const ContentPreview = memo(function ContentPreview() {
  return (
    <div className="min-h-full bg-[var(--preview-dominant)] text-[var(--preview-text)]">
      <PreviewHeader brand="The Journal" links={NAV_LINKS} cta="Subscribe" />

      <div className="flex flex-col gap-10 px-6 py-10 @lg:flex-row @lg:px-10 @lg:py-14">
        <article className="min-w-0 flex-1 @5xl:max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wide opacity-60">
            Design systems
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight @lg:text-3xl">
            Why hierarchy matters more than colour choice
          </h1>
          <p className="mt-3 text-xs opacity-60">By Elena Ruiz · 6 min read</p>

          <p className="mt-6 text-sm leading-relaxed opacity-90 @lg:text-base">
            Most design critiques focus on which colours a product uses. Far fewer ask how much
            of each colour actually appears on screen — and that ratio, more than any single hex
            value, is what makes an interface feel calm or chaotic.
          </p>

          <blockquote className="my-6 border-l-2 border-[var(--preview-accent)] pl-4 text-base font-medium italic @lg:text-lg">
            "Balance isn't a rule you break for emphasis — it's the reason emphasis still works
            when you need it."
          </blockquote>

          <p className="text-sm leading-relaxed opacity-90 @lg:text-base">
            A dominant tone gives an interface somewhere to rest. A secondary tone gives it
            shape. And an accent, used sparingly, gives it a voice — one people actually notice,
            because it hasn't been worn out everywhere else.
          </p>

          <PreviewButton variant="ghost" className="mt-6">
            View report →
          </PreviewButton>
        </article>

        <aside className="flex flex-col gap-4 @5xl:w-72 @5xl:flex-none">
          <PreviewCard>
            <h2 className="text-sm font-bold">Stay in the loop</h2>
            <p className="mt-1 text-xs opacity-80">One email a week, no noise.</p>
            <PreviewButton variant="primary" className="mt-3 w-full">
              Subscribe
            </PreviewButton>
          </PreviewCard>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide opacity-60">Related</h2>
            {RELATED.map((title) => (
              <a
                key={title}
                href="#"
                onClick={(event) => event.preventDefault()}
                className="text-sm font-medium leading-snug hover:opacity-70"
              >
                {title}
              </a>
            ))}
          </div>
        </aside>
      </div>

      <footer className="flex flex-col gap-4 bg-[var(--preview-secondary)] px-6 py-8 text-[var(--preview-text)] @lg:flex-row @lg:items-center @lg:justify-between @lg:px-10">
        <span className="text-sm font-semibold">The Journal</span>
        <PreviewNavigation links={['Privacy', 'Terms', 'Contact']} activeIndex={-1} />
      </footer>
    </div>
  );
});
