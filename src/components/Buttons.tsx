"use client";

import React from "react";
import Link from "next/link";
import { useAssessmentModal } from "./AssessmentModalContext";

type Size = "md" | "lg";

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

export const GoldButton = React.forwardRef<
  HTMLButtonElement,
  {
    size?: Size;
    className?: string;
    children?: React.ReactNode;
  }
>(({ size = "md", className = "", children }, ref) => {
  const { open } = useAssessmentModal();

  return (
    <button
      ref={ref}
      type="button"
      onClick={open}
      className={`pressable lift inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl shadow-[0_4px_20px_rgba(212,169,55,0.25)] ${sizeClasses[size]} ${className}`}
    >
      {children ?? "Get a free website review"}
    </button>
  );
});
GoldButton.displayName = "GoldButton";

export const OutlineLink = React.forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    size?: Size;
    className?: string;
    children: React.ReactNode;
  }
>(({ href, size = "md", className = "", children }, ref) => (
  <Link
    ref={ref}
    href={href}
    className={`pressable lift inline-flex items-center justify-center glass hover:bg-white/85 hover:border-hair-strong text-ink font-medium border border-hair rounded-xl ${sizeClasses[size]} ${className}`}
  >
    {children}
  </Link>
));
OutlineLink.displayName = "OutlineLink";
