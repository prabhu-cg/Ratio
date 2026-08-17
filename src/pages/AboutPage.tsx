import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const PRINCIPLES = [
  {
    title: 'Judgement stays with the designer',
    body: 'RATIO visualises a ratio — it does not choose colours or generate palettes on your behalf.',
  },
  {
    title: 'No account, no lock-in',
    body: 'Open the tool and start working. There is nothing to sign up for and nothing to export you into.',
  },
  {
    title: 'Small and fast',
    body: 'RATIO does one thing — showing how colour is distributed — and tries to do it well.',
  },
];

export function AboutPage() {
  useDocumentTitle('About — RATIO');

  return (
    <>
      <Section spacing="compact">
        <Container width="narrow">
          <Badge tone="brand">About RATIO</Badge>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-text-heading sm:text-5xl">
            A quiet tool for a loud problem
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-primary">
            Most colour tools help you find colours. Very few help you decide how much of each
            one to use. RATIO was built to fill that gap — a small, focused way to see the
            60–30–10 principle applied before it's built into a real interface.
          </p>
        </Container>
      </Section>

      <Section tone="alt">
        <Container width="narrow">
          <h2 className="font-display text-2xl font-bold text-text-heading">Why 60–30–10</h2>
          <p className="mt-4 text-base leading-relaxed text-text-primary">
            The principle comes from interior design, where a dominant colour sets the tone of a
            room, a secondary colour gives it structure, and an accent colour is used sparingly to
            draw attention. Interfaces work the same way. Without a clear ratio, every colour
            competes for attention and nothing does its job well.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-primary">
            RATIO takes that idea and makes it visible, so the decision about where colour goes is
            as deliberate as the decision about which colours to use.
          </p>
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <h2 className="font-display text-2xl font-bold text-text-heading">
            What RATIO believes in
          </h2>
          <div className="mt-8 flex flex-col">
            {PRINCIPLES.map((principle, index) => (
              <div key={principle.title}>
                <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-10">
                  <h3 className="w-full flex-none font-display text-base font-bold text-text-heading sm:w-56">
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-muted">{principle.body}</p>
                </div>
                {index !== PRINCIPLES.length - 1 ? <Divider /> : null}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container width="narrow">
          <div className="flex flex-col items-start gap-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-text-heading">
              Try RATIO on your next project.
            </h2>
            <Button href="/app" size="lg">
              Open RATIO — Free
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default AboutPage;
