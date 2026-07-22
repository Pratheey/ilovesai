// Donations are handled by PayPal as a fully-hosted, OUTBOUND link — the donor
// leaves this site to give. Card data never touches us, keeping PCI scope at
// SAQ-A. The rule is "redirect, don't embed": this must stay a plain <a href> to
// PayPal's hosted page, never PayPal's JS SDK / smart-button embed, which would
// put card-adjacent fields on our page and force a CSP loosening.
//
// The hosted link carries a `token=` param, so treat it as semi-sensitive: don't
// post it publicly outside the site. Not an env var (it's meant to be clicked in
// a public href) — a plain constant is correct.
export const PAYPAL_DONATE_URL = '[PLACEHOLDER: verified PayPal hosted donate URL]';

// Internal path to the on-site donate page. Every "Donate" link across the site
// points here (not straight to PayPal) so the giving options + context live in
// one place.
export const DONATE_PATH = '/donate';

export interface GivingOption {
  /** Stable id, also used as the anchor / key. */
  id: string;
  title: string;
  blurb: string;
  /** Shown as guidance only ("about ₹2,000 (≈ $24)"), never a hard promise.
   * PayPal localizes currency to the viewer, so copy must not fix a currency. */
  suggestedAmount?: string;
  /** Where the donor is sent. Today every option uses the one verified hosted
   * link; later, individual options can move to their own PayPal buttons. */
  link: string;
  ctaLabel: string;
}

// General giving only for now. The memorial-tree, Satcharitra-chapter, and
// language-sponsorship options from the old site are intentionally NOT listed
// until the coordinator confirms those programs are still running — a mislabeled
// "plant a tree in their name" with no tree is a trust failure. This stays an
// array so adding a confirmed option later is a data edit, not a rebuild.
export const givingOptions: GivingOption[] = [
  {
    id: 'general',
    title: 'General donation',
    blurb:
      'Support the whole of I Love Sai — the seva, the events, and the work in Shirdi and beyond. Your gift goes where it is most needed.',
    link: PAYPAL_DONATE_URL,
    ctaLabel: 'Donate',
  },
];
