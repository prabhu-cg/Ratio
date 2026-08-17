import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SECTIONS = [
  {
    title: 'Using RATIO',
    body: 'RATIO is free to use, with no account, no trial period, and no paid tier. You can use it for personal or commercial design work without asking permission.',
  },
  {
    title: 'No warranty',
    body: "RATIO is provided as-is. It's a visualisation and guidance tool — it doesn't guarantee that a palette is accessible or appropriate for every context. Final colour decisions, and their consequences, are yours.",
  },
  {
    title: 'Your palettes',
    body: "Anything you build in RATIO — the colours you choose, the exports you download — is yours. RATIO doesn't claim any rights over it, because RATIO never sees it in the first place.",
  },
  {
    title: 'Changes',
    body: "RATIO may change, add to, or remove features over time as it's developed further. These terms may be updated to match; continued use after a change means you accept the update.",
  },
];

export function TermsPage() {
  useDocumentTitle('Terms — RATIO');

  return (
    <>
      <Section spacing="compact">
        <Container width="narrow">
          <Badge tone="brand">Terms</Badge>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-text-heading sm:text-5xl">
            Terms of use
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-primary">
            Short version: RATIO is free, it's yours to use, and there's no fine print designed
            to catch you out.
          </p>
        </Container>
      </Section>

      <Section tone="alt">
        <Container width="narrow">
          <div className="flex flex-col">
            {SECTIONS.map((section, index) => (
              <div key={section.title}>
                <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-10">
                  <h2 className="w-full flex-none font-display text-base font-bold text-text-heading sm:w-56">
                    {section.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-text-muted">{section.body}</p>
                </div>
                {index !== SECTIONS.length - 1 ? <Divider /> : null}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="compact">
        <Container width="narrow">
          <p className="text-sm leading-relaxed text-text-muted">
            Questions about these terms can be raised as an issue on{' '}
            <a
              href="https://github.com/prabhu-cg/Ratio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-text-heading underline underline-offset-2 hover:text-brand"
            >
              GitHub
            </a>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}

export default TermsPage;
