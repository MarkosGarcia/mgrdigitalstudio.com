"use client";

import React from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { useAssessmentModal } from "./AssessmentModalContext";

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.35.65 4.55 1.79 6.43L3 29l7.75-2.72a12.9 12.9 0 0 0 5.26 1.12h.01c6.63 0 12-5.38 12-12.01C28.02 8.38 22.64 3 16.01 3Zm0 21.94h-.01a10.9 10.9 0 0 1-5.56-1.53l-.4-.24-4.6 1.61 1.63-4.49-.26-.46a10.86 10.86 0 0 1-1.68-5.81c0-6 4.9-10.9 10.9-10.9 2.92 0 5.65 1.14 7.71 3.2a10.82 10.82 0 0 1 3.19 7.71c0 6.01-4.9 10.9-10.92 10.9Zm5.98-8.17c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.51-.16-.73.16-.22.33-.84 1.06-1.03 1.27-.19.22-.38.24-.71.08-.33-.16-1.38-.51-2.63-1.63-.97-.86-1.63-1.93-1.82-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71 0 1.6 1.16 3.15 1.32 3.37.16.22 2.29 3.49 5.54 4.9.77.33 1.38.53 1.85.68.78.25 1.48.21 2.04.13.62-.09 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38Z" />
  </svg>
);

const HelpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 1.9-2.4 3.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AssistanceFloatingButton: React.FC = () => {
  const { open } = useAssessmentModal();
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Get a free website assessment"
      className="fixed bottom-24 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_4px_20px_rgba(212,169,55,0.35)] hover:scale-105 transition-transform"
    >
      <HelpIcon className="w-7 h-7" />
    </button>
  );
};

export const WhatsAppFloatingButton: React.FC = () => (
  <a
    href={whatsappLink("Hi! I'd like to get a free website assessment.")}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform"
  >
    <WhatsAppIcon className="w-7 h-7" />
  </a>
);

export const WhatsAppButton: React.FC<{
  className?: string;
  message?: string;
  children?: React.ReactNode;
}> = ({ className = "", message, children }) => (
  <a
    href={whatsappLink(message)}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors ${className}`}
  >
    <WhatsAppIcon className="w-4 h-4" />
    {children ?? "Chat on WhatsApp"}
  </a>
);
