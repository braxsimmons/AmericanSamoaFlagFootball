"use client";

import { useCallback, useEffect, useState } from "react";

/*
  Cookie consent.

  Built around Google Consent Mode v2 rather than around hiding the tag. The
  GA snippet sets every consent signal to "denied" before gtag.js loads, so
  nothing is written to storage until somebody says yes. Accepting fires a
  consent update in the same page view, so the visit still counts.

  Why this shape:

  - Reject has to be as easy as accept. A banner where "Accept" is a button and
    the refusal is a link buried in settings is the pattern EU regulators have
    been fining people over. Both are buttons, same size, same row.

  - Nothing is written before a choice is made. No cookie, no localStorage key,
    no beacon.

  - It does not block the page. No overlay, no scrim, no scroll lock. A visitor
    who ignores it can read everything, and ignoring it counts as no consent,
    which is the correct default.

  - The choice is reversible, via a link in the footer. Consent that cannot be
    withdrawn is not consent.

  Anyone who never chose is simply never tracked. That is the point.
*/

const KEY = "asff-consent";
type Choice = "granted" | "denied";

/** Fired by the footer link to reopen the banner after a choice was made. */
export const CONSENT_EVENT = "asff:open-consent";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

function tellGoogle(choice: Choice) {
  // Queue onto dataLayer directly rather than calling window.gtag. If a visitor
  // decides before gtag.js has finished loading, that helper does not exist yet
  // and the update would be dropped silently. The queue is created by the
  // inline snippet and is always there, and gtag.js drains it in order once it
  // arrives, so an early answer is still honoured.
  //
  // It has to be an `arguments` object, not an array literal: that is the shape
  // gtag.js expects, which is the whole reason the official snippet defines a
  // function whose only job is to forward `arguments`.
  window.dataLayer = window.dataLayer || [];
  // Cast rather than a rest parameter: `arguments` is what gets pushed, and a
  // declared-but-unused parameter list only exists to satisfy the call site.
  // `arguments` stays reachable because this is a function expression rather
  // than an arrow.
  const gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...args: unknown[]) => void;

  gtag("consent", "update", {
    analytics_storage: choice === "granted" ? "granted" : "denied",
  });
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      // Safari in private mode throws on localStorage. Treat it as no choice
      // and show the banner rather than crashing the page.
    }

    if (stored === "granted" || stored === "denied") {
      tellGoogle(stored);
    } else {
      // react-hooks/set-state-in-effect flags this, and is wrong here. The
      // banner's visibility depends on localStorage, which does not exist
      // during the server render. Deriving it at render time instead would make
      // the server and client disagree on first paint, which is the hydration
      // mismatch this deliberately avoids. Reading after mount is the point.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }

    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_EVENT, reopen);
  }, []);

  const choose = useCallback((choice: Choice) => {
    try {
      window.localStorage.setItem(KEY, choice);
    } catch {
      // If we cannot remember the answer, still honour it for this page view.
    }
    tellGoogle(choice);
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      // `region` rather than `dialog`: this does not trap focus or block the
      // page, and announcing it as a dialog would tell a screen reader the rest
      // of the site is inert when it is not.
      role="region"
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-red bg-navy-deep/95 text-bone backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <p className="text-sm leading-relaxed text-bone/80">
          We use Google Analytics to see which pages people actually read. It
          sets cookies. Nothing is stored until you choose, and nothing here
          identifies you personally.
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="display h-11 flex-1 border border-bone/35 px-5 text-xs tracking-[0.14em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-navy-deep sm:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="display h-11 flex-1 bg-red px-5 text-xs tracking-[0.14em] text-bone transition-colors hover:bg-red-bright sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Footer link that brings the banner back.
 *
 * Withdrawing consent has to be as reachable as giving it, and a visitor who
 * declined once may want to change their mind.
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
