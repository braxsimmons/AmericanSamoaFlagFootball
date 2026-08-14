"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV, TEAM } from "@/lib/content";
import { SpearRow } from "./tatau";
import { InstagramIcon, YouTubeIcon } from "./social";

/**
 * Fixed header.
 *
 * Transparent over the hero so the photography runs to the top of the window,
 * then it takes on the navy once you have scrolled past it. The threshold is
 * deliberately short, a header that only solidifies halfway down the page
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
          {/* The federation's real crest. The previous mark was an invented
              shield, which is the one asset a national team cannot approximate. */}
          <Image
            src="/media/asnff-crest.png"
            alt="American Samoa National Football Federation"
            width={44}
            height={44}
            priority
            className="size-10 shrink-0 object-contain"
          />
          <span className="display text-bone leading-none">
            <span className="block text-[11px] tracking-[0.28em] opacity-70">
              American Samoa
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
                  underline, the header's only hover affordance, never fired. */}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-red transition-[width] duration-300 ease-[var(--ease-out-quint)] group-hover:w-full" />
            </Link>
          ))}

          {/* The two places the team actually publishes. Icon-only is fine
              here, the labelled buttons live in the section and the footer , 
              but each still carries an accessible name. */}
          <span className="h-5 w-px bg-bone/25" />
          <a
            href={TEAM.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-bone/70 transition-transform duration-200 hover:scale-110 hover:text-bone"
          >
            <InstagramIcon className="size-[18px]" />
            <span className="sr-only">Instagram, opens in a new tab</span>
          </a>
          <a
            href={TEAM.youtube}
            target="_blank"
            rel="noreferrer"
            className="text-bone/70 transition-transform duration-200 hover:scale-110 hover:text-bone"
          >
            <YouTubeIcon className="size-[18px]" />
            <span className="sr-only">YouTube, opens in a new tab</span>
          </a>
        </nav>
      </div>

      {/*
        `<details>` rather than React state: the previous version rendered the
        mobile links only when a `useState` flag was true, so a phone with
        JavaScript disabled had no navigation at all, and the desktop nav is
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
          <div className="flex items-center gap-6 px-5 pb-5 pt-3">
            <a
              href={TEAM.instagram}
              target="_blank"
              rel="noreferrer"
              className="display inline-flex items-center gap-2 text-sm tracking-[0.16em] text-red-bright"
            >
              <InstagramIcon className="size-5" />
              Instagram
            </a>
            <a
              href={TEAM.youtube}
              target="_blank"
              rel="noreferrer"
              className="display inline-flex items-center gap-2 text-sm tracking-[0.16em] text-red-bright"
            >
              <YouTubeIcon className="size-5" />
              YouTube
            </a>
          </div>
        </nav>
      </details>

      <SpearRow className="h-[6px] w-full text-red/70" />
    </header>
  );
}
