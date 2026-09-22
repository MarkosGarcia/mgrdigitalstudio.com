"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { GoldButton } from "./Buttons";
import { PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF } from "@/lib/business";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/ottawa-trades", label: "For Trades" },
  { href: "/launch-kit", label: "Launch Kit" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M3 5a2 2 0 012-2h2.5a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.25 1l-1.5 1.5a14 14 0 006.3 6.3l1.5-1.5a1 1 0 011-.25l3.6 1.2a1 1 0 01.7.95V19a2 2 0 01-2 2h-1C10.6 21 3 13.4 3 6V5z"
    />
  </svg>
);

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full glass-blur border-b border-hair sticky top-0 z-50">
      {/* Contact strip — a phone number that is always one tap away, for the
          sizeable share of small business owners who would rather call than
          fill in a form. */}
      <div className="hidden md:block border-b border-hair band">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-end gap-6 text-xs">
          <a
            href={PHONE_HREF}
            className="link-underline inline-flex items-center gap-2 text-ink-2 hover:text-gold transition-colors"
          >
            <PhoneIcon />
            {PHONE_DISPLAY}
          </a>
          <a
            href={EMAIL_HREF}
            className="link-underline text-ink-2 hover:text-gold transition-colors"
          >
            {EMAIL}
          </a>
          <span className="text-ink-4">Hablamos español</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 py-4 px-6">
        <Link href="/" className="focus-visible:outline-none min-w-0 shrink">
          <Logo />
        </Link>

        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-ink-2"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline hover:text-ink transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={PHONE_HREF}
            className="pressable inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
          >
            <PhoneIcon />
            <span className="hidden xl:inline">{PHONE_DISPLAY}</span>
          </a>
          <GoldButton>Free website review</GoldButton>
        </div>

        {/* Tap-to-call stays visible on mobile rather than living inside the
            menu — phones are where a call is most likely, and one tap beats
            three. */}
        <div className="flex items-center gap-1 lg:hidden shrink-0">
          <a
            href={PHONE_HREF}
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="pressable inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-gold"
          >
            <PhoneIcon />
            <span className="hidden sm:inline">Call</span>
          </a>

        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="pressable text-ink-2 hover:text-ink p-2"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden pb-6 px-6 glass-blur border-t border-hair flex flex-col">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="menu-item text-ink-2 hover:text-ink py-3 border-b border-hair"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 mt-5">
            <a
              href={PHONE_HREF}
              className="pressable inline-flex items-center justify-center gap-2 rounded-xl border border-hair glass py-3 text-sm font-semibold text-ink"
            >
              <PhoneIcon />
              {PHONE_DISPLAY}
            </a>
            <a
              href={EMAIL_HREF}
              className="pressable inline-flex items-center justify-center rounded-xl border border-hair glass py-3 text-sm text-ink-2"
            >
              {EMAIL}
            </a>
            <div onClick={() => setMobileMenuOpen(false)}>
              <GoldButton className="w-full">Free website review</GoldButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
