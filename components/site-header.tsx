"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV, TEAM } from "@/lib/content";
import { SpearRow } from "./tatau";

/**
 * Fixed header.
 *
 * Transparent over the hero so the photography runs to the top of the window,
 * then it takes on the navy once you have scrolled past it. The threshold is
 * deliberately short — a header that only solidifies halfway down the page
 * spends most of a scroll unreadable against whatever is behind it.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-navy-deep/95 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Crest />
          <span className="display text-bone leading-none">
            <span className="block text-[11px] tracking-[0.28em] opacity-70">
              Amerika Sāmoa
            </span>
            <span className="block text-xl sm:text-2xl">Flag Football</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group display relative text-sm tracking-[0.14em] text-bone/80 transition-colors hover:text-bone"
            >
              {item.label}
              {/* The red keyline from the jersey sleeve, drawn on hover. */}
              {/* `group` lives on this link now. It was on the logo, so this
                  underline — the header's only hover affordance — never fired. */}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-red transition-[width] duration-300 ease-[var(--ease-out-quint)] group-hover:w-full" />
            </Link>
          ))}
        </nav>

      </div>

      {/*
        `<details>` rather than React state: the previous version rendered the
        mobile links only when a `useState` flag was true, so a phone with
        JavaScript disabled had no navigation at all — and the desktop nav is
        hidden below `md`. A disclosure element needs no script to open.
      */}
      <details
        className="group/menu md:hidden"
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="flex h-11 w-full cursor-pointer list-none items-center justify-end px-5 text-bone marker:hidden">
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path className="group-open/menu:hidden" d="M3 7h18M3 12h18M3 17h18" />
            <path className="hidden group-open/menu:block" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </summary>

        <nav aria-label="Primary" className="border-t border-white/10">
          <ul className="px-5 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="display block border-b border-white/5 py-4 text-xl tracking-wide text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={TEAM.instagram}
            target="_blank"
            rel="noreferrer"
            className="display block px-5 pb-5 pt-2 text-sm tracking-[0.2em] text-red-bright"
          >
            {TEAM.instagramHandle}
          </a>
        </nav>
      </details>

      <SpearRow className="h-[6px] w-full text-red/70" />
    </header>
  );
}

/** The shield from the jersey tag, reduced to something legible at 40px. */
function Crest() {
  return (
    <svg viewBox="0 0 40 44" className="size-9 shrink-0" aria-hidden="true">
      <path
        d="M20 1 L38 7 v18 c0 9-8 15-18 18 C10 40 2 34 2 25 V7 Z"
        fill="#14224f"
        stroke="#f5f2ec"
        strokeWidth="2"
      />
      <path d="M20 8 L34 12 v12 c0 6-6 10-14 12 C12 30 6 26 6 20 V12 Z" fill="#c8102e" opacity="0.9" />
      <ellipse cx="20" cy="22" rx="9" ry="6" fill="#f5f2ec" />
      <path d="M13 22 h14" stroke="#14224f" strokeWidth="1.6" />
      <path d="M15 19.5 h10 M15 24.5 h10" stroke="#14224f" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
