import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

const QUESTIONS = [
  'Which colour should dominate?',
  'Which should support it?',
  'Which should attract attention?',
  'How much accent colour is appropriate?',
];

export function ProblemSection() {
  return (
    <Section tone="page">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="max-w-lg font-display text-3xl font-extrabold leading-tight tracking-[-0.02em] text-text-heading sm:text-4xl">
              Choosing colours is easy. Knowing where to use them is harder.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-primary">
              Most designers already have a shortlist of colours that work well together. The
              hard part is deciding how much space each one should take up in the interface.
            </p>
          </div>

          <ul className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-border-default">
            {QUESTIONS.map((question) => (
              <li
                key={question}
                className="flex items-center gap-4 bg-surface-card px-6 py-5 text-base font-medium text-text-heading"
              >
                <span aria-hidden="true" className="h-2 w-2 flex-none rounded-[2px] bg-brand" />
                {question}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
