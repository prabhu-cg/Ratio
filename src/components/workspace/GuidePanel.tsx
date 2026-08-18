import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface GuidePanelProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: 'Choose your colours',
    description: 'Select a Dominant, Secondary and Accent colour.',
  },
  {
    title: 'Balance the hierarchy',
    description: 'Use the 60–30–10 principle to understand the visual relationship.',
  },
  {
    title: 'See it in context',
    description: 'Preview your colours in realistic interfaces.',
  },
  {
    title: 'Check readability',
    description: 'Review important colour relationships.',
  },
  {
    title: 'Export your palette',
    description: 'Copy or export your colour values.',
  },
];

const FAQ = [
  {
    question: 'What is 60–30–10?',
    answer:
      'A visual guideline for distributing colour: roughly 60% dominant, 30% secondary, 10% accent. A guideline, not a strict rule.',
  },
  {
    question: 'What does Dominant mean?',
    answer: 'Your primary visual foundation — typically backgrounds and major surfaces.',
  },
  {
    question: 'What does Secondary mean?',
    answer: 'Adds structure and visual support alongside the dominant colour.',
  },
  {
    question: 'What does Accent mean?',
    answer: 'Creates emphasis and draws attention to key actions and content.',
  },
  {
    question: 'Why is Text / Foreground outside the ratio?',
    answer:
      'It is a functional supporting colour for readable content, not part of the 60–30–10 visual balance.',
  },
  {
    question: 'How should the preview be interpreted?',
    answer:
      'It shows your palette applied to realistic interface templates — a sense check, not a literal design spec.',
  },
  {
    question: 'What do contrast results mean?',
    answer:
      'Each check compares a foreground/background pairing against WCAG contrast thresholds, showing whether text stays readable.',
  },
];

/**
 * Doubles as first-run onboarding (auto-opened once, then never again) and on-demand
 * help (reopened anytime via the topbar's "?" button) — one component, one set of
 * explanatory copy, rather than two overlapping systems.
 */
export function GuidePanel({ open, onClose }: GuidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(open, panelRef, closeButtonRef, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-panel-heading"
        className="relative flex max-h-[min(720px,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-card shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-none items-start justify-between gap-3 border-b border-border-default p-6 pb-5 sm:p-8 sm:pb-6">
          <div>
            <h2 id="guide-panel-heading" className="font-display text-xl font-bold text-text-heading">
              How RATIO works
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Balance colour, preview it in context, and check it stays readable.
            </p>
          </div>
          <IconButton ref={closeButtonRef} label="Close guide" onClick={onClose}>
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

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 pt-5 sm:p-8 sm:pt-6">
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-soft font-mono text-xs font-semibold text-brand">
                  {index + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-heading">{step.title}</div>
                  <div className="text-xs leading-relaxed text-text-muted">{step.description}</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="border-t border-border-default pt-5">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
              Common questions
            </h3>
            <div className="mt-3 flex flex-col gap-1">
              {FAQ.map((item) => (
                <details key={item.question} className="group rounded-[var(--radius-sm)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-2 text-sm font-medium text-text-heading [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                      className="flex-none transition-transform duration-150 group-open:rotate-180"
                    >
                      <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="pb-3 text-xs leading-relaxed text-text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <Button variant="primary" size="md" onClick={onClose} className="w-full sm:w-auto sm:self-end">
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
