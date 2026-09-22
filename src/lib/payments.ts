// Stripe Payment Links — the no-code, no-backend way to take payments on a
// statically exported site. Create each link in the Stripe Dashboard
// (Payment Links -> New) and paste its URL below. Stripe hosts the actual
// checkout page, so no secret key or card data ever touches this repo.
//
// Entries with an empty url are hidden by PaymentButton rather than linking
// somewhere dead.
export type PaymentLink = {
  key: string;
  label: string;
  url: string;
};

export const paymentLinks: Record<string, PaymentLink> = {
  "landing-pages": {
    key: "landing-pages",
    label: "Pay Deposit for Landing Pages",
    url: "",
  },
  "business-websites": {
    key: "business-websites",
    label: "Pay Deposit for Business Websites",
    url: "",
  },
  "website-care": {
    key: "website-care",
    label: "Start Website Care Plan",
    url: "",
  },
  "website-growth": {
    key: "website-growth",
    label: "Start Website Growth Plan",
    url: "",
  },
};

// For a fuller cart/checkout flow later (line items, promo codes,
// server-verified fulfillment via webhook) instead of static Payment Links:
//   1. Add a Cloudflare Pages Function (functions/api/checkout.ts) that
//      creates a Stripe Checkout Session using STRIPE_SECRET_KEY, stored as
//      an encrypted Cloudflare Pages environment variable — never in this
//      repo.
//   2. From a client component, POST to /api/checkout and redirect to the
//      returned Checkout URL (window.location.href = session.url).
//   3. Handle fulfillment via a Stripe webhook, also implemented as a
//      Pages Function, verified with STRIPE_WEBHOOK_SECRET.
export type CheckoutRequest = {
  priceId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
};
