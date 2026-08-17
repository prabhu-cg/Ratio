export interface NavLinkItem {
  label: string;
  href: string;
}

export const MARKETING_NAV_LINKS: NavLinkItem[] = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
];

/** Legal links shown in the footer only — not part of the primary header nav. */
export const FOOTER_LEGAL_LINKS: NavLinkItem[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];
