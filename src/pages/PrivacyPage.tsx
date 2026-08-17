import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Divider } from '@/components/ui/Divider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SECTIONS = [
  {
    title: 'What RATIO stores',
    body: "Your Dominant, Secondary, and Accent colours, along with your selected preview template, viewport, and colour-vision mode, are saved in your browser's localStorage so they're there the next time you open RATIO. That's the only reason RATIO stores anything.",
  },
  {
    title: 'Where it stays',
    body: 'On your device, in your browser. RATIO has no backend and no database — there is nowhere for that data to go. Clearing your browser storage, or using a private/incognito window, removes it completely.',
  },
  {
    title: "What RATIO doesn't do",
    body: 'No accounts, no sign-up, no analytics, no tracking scripts, and no cookies used to identify or follow you. RATIO does not know who you are, and has no way to find out.',
  },
  {
    title: 'The one external request',
    body: 'RATIO loads its typefaces (Manrope and JetBrains Mono) from Google Fonts. That request goes to Google, not to RATIO, and is the only network request the app makes on its own.',
  },
  {
    title: 'Clearing your data',
    body: 'Use Reset in the workspace to restore the default palette, or clear your browser\'s site data for RATIO to remove everything, including the saved palette and preferences.',
  },
];

export function PrivacyPage() {
  useDocumentTitle('Privacy — RATIO');

  return (
    <>
      <Section spacing="compact">
        <Container width="narrow">
          <Badge tone="brand">Privacy</Badge>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-text-heading sm:text-5xl">
            Your colours stay in your browser
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-primary">
            RATIO doesn't have an account system, a server, or a database — so there's very
            little to say here, and all of it is straightforward.
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
            If RATIO ever needs to store or send data anywhere else, this page will say so before
            it happens. Questions can be raised as an issue on{' '}
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

export default PrivacyPage;
