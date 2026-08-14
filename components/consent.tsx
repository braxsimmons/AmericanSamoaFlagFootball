"use client";

import { useCallback, useEffect, useState } from "react";
import { pageView, setAnalyticsConsent } from "@/lib/gtag";

/*
  Cookie consent.

  Built around Google Consent Mode v2 rather than around hiding the tag. The GA
  snippet queues every consent signal as "denied" before gtag.js loads, so
  nothing is written to storage until somebody says yes. Accepting fires a
  consent update in the same page view, so the visit still counts.

  Why this shape:

  - Refusing is the same weight as accepting. Same size, same colour, same row.
    A banner where accept is a button and refusal is buried behind "Manage" is
    the specific pattern EU regulators have been fining people over.

  - Nothing is written before a choice is made. No cookie, no localStorage key,
    no beacon.

  - It does not block the page. No overlay, no scrim, no scroll lock. Ignoring
    it counts as no consent, which is the correct default.

  - Reversible from the footer. Consent that cannot be withdrawn is not consent.

  Manage lists two categories because this site runs two things: the essentials
  it cannot function without, and Google Analytics. There is no advertising or
  personalisation category, because there is no advertising or personalisation
  tag. Listing empty categories to look thorough would misdescribe what actually
  runs, which is the thing the banner exists to get right.
*/

const KEY = "asff-consent";
type Choice = "granted" | "denied";

/** Fired by the footer link to reopen the banner after a choice was made. */
export const CONSENT_EVENT = "asff:open-consent";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      // Safari in private mode throws on localStorage. Treat it as no choice
      // and show the banner rather than crashing the page.
    }

    if (stored === "granted" || stored === "denied") {
      setAnalyticsConsent(stored === "granted");
    } else {
      // react-hooks/set-state-in-effect flags this, and is wrong here. Whether
      // the banner shows depends on localStorage, which does not exist during
      // the server render. Deriving it at render time instead would make server
      // and client disagree on first paint, which is the hydration mismatch
      // this deliberately avoids. Reading after mount is the point.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }

    const reopen = () => {
      let current: string | null = null;
      try {
        current = window.localStorage.getItem(KEY);
      } catch {
        /* ignore */
      }
      // Reflect the existing choice when reopening, so the panel shows what is
      // actually set rather than resetting to off and inviting a mis-save.
      setAnalytics(current === "granted");
      setManaging(false);
      setOpen(true);
    };

    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  const choose = useCallback((choice: Choice) => {
    try {
      window.localStorage.setItem(KEY, choice);
    } catch {
      // If the answer cannot be remembered, still honour it for this page view.
    }
    setAnalyticsConsent(choice === "granted");

    // The load-time page view already went out under the denied default, as a
    // cookieless ping. Granting does not retroactively upgrade it, so without
    // this a visitor who accepts and then reads the page without navigating is
    // never recorded as a session at all.
    if (choice === "granted") pageView();

    setOpen(false);
    setManaging(false);
  }, []);

  if (!open) return null;

  return (
    <div
      // `region`, not `dialog`: this does not trap focus or make the rest of the
      // page inert, and announcing it as a dialog would tell a screen reader
      // otherwise.
      role="region"
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-bone/15 bg-navy-deep/95 text-bone backdrop-blur-sm"
    >
      <div className="mx-auto max-w-5xl px-5 py-3.5 sm:px-8">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-sm text-bone/70">
            We use cookies to improve your experience and analyze site usage.
          </p>

          <div className="flex shrink-0 items-center gap-2.5 text-sm">
            <Action onClick={() => choose("granted")}>Accept All</Action>
            <Dot />
            <Action onClick={() => choose("denied")}>Reject Non-Essential</Action>
            <Dot />
            <Action
              onClick={() => setManaging((v) => !v)}
              aria-expanded={managing}
              aria-controls="consent-manage"
            >
              Manage
            </Action>
          </div>
        </div>

        {managing ? (
          <div id="consent-manage" className="mt-3.5 border-t border-bone/12 pt-3.5">
            <ul className="space-y-2.5">
              <li className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-bone/85">Essential</p>
                  <p className="text-xs text-bone/50">
                    Needed for the site to load and remember this choice.
                  </p>
                </div>
                <span className="shrink-0 text-xs tracking-[0.14em] text-bone/40">
                  ALWAYS ON
                </span>
              </li>

              <li className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-bone/85">Analytics</p>
                  <p className="text-xs text-bone/50">
                    Google Analytics, so we can see which pages people read.
                  </p>
                </div>
                <Switch checked={analytics} onChange={setAnalytics} label="Analytics cookies" />
              </li>
            </ul>

            <div className="mt-3.5 flex justify-end">
              <Action onClick={() => choose(analytics ? "granted" : "denied")}>
                Save choices
              </Action>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-bone/25">
      ·
    </span>
  );
}

/**
 * Every action is the same element with the same weight.
 *
 * The moment one of these becomes a filled button and the others stay as text,
 * the banner starts steering the answer.
 */
function Action({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap text-bone/85 underline underline-offset-4 transition-colors hover:text-bone"
      {...rest}
    >
      {children}
    </button>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-red" : "bg-bone/25"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-bone transition-transform ${
          checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/**
 * Footer link that brings the banner back.
 *
 * Withdrawing consent has to be as reachable as giving it.
 */
export function ConsentReopen({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_EVENT))}
      className={`text-left underline underline-offset-4 transition-colors hover:text-bone ${className}`}
    >
      Cookie choices
    </button>
  );
}
