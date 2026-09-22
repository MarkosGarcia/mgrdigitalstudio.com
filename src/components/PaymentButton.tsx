import React from "react";
import { paymentLinks } from "@/lib/payments";

export const PaymentButton: React.FC<{ serviceSlug: string; className?: string }> = ({
  serviceSlug,
  className = "",
}) => {
  const link = paymentLinks[serviceSlug];
  if (!link || !link.url) return null;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 text-sm font-medium text-ink glass hover:bg-white/85 border border-hair rounded-lg px-4 py-2.5 transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      {link.label}
    </a>
  );
};
