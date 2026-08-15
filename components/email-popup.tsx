"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONSENT_CHOSEN } from "./consent";

/*
  The signup popup.

  Timing, and why it is not literally on load:

  Google treats an interstitial that covers the content on arrival from search
  as a ranking problem on mobile. We have just spent real effort on the site's
  search position, so this waits until the page has been seen. It also waits for
  the cookie banner to be answered, because two overlays at once is not a choice
  anybody makes well.

  Shown once. A visitor who closes it or signs up never sees it again, stored in
  localStorage rather than a cookie so it survives the cookie banner being
  declined.

  This is a real dialog, unlike the cookie bar: it takes focus, traps it, closes
  on Escape, and the page behind it genuinely is inert. So `role="dialog"` and
  `aria-modal` are correct here where they would have been a lie there.
*/

const KEY = "asff-signup";
const DELAY_MS = 6000;

export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(window.localStorage.getItem(KEY));
    } catch {
      // Private mode. Showing it is better than crashing on the check.
    }
    if (seen) return;

    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    };

    let consented = false;
    try {
      consented = Boolean(window.localStorage.getItem("asff-consent"));
    } catch {
      consented = true;
    }

    if (consented) arm();
    else window.addEventListener(CONSENT_CHOSEN, arm);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_CHOSEN, arm);
    };
  }, []);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* nothing to do */
    }
    setOpen(false);
    if (restoreFocusTo.current instanceof HTMLElement) restoreFocusTo.current.focus();
  }, []);

  // Focus management and the Escape key.
  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement;
    closeButton.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      // Keep Tab inside the dialog. Without this, tabbing walks off into the
      // page behind, which for a screen reader user means being lost in content
      // that is visually covered.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          name: String(data.get("name") ?? ""),
          honeypot: String(data.get("company") ?? ""),
          source: "popup",
        }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.error ?? "That did not go through. Try again in a moment.");
        return;
      }

      setStatus("done");
      try {
        window.localStorage.setItem(KEY, "1");
      } catch {
        /* nothing to do */
      }
    } catch {
      setStatus("error");
      setMessage("That did not go through. Check your connection and try again.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      {/* Clicking away closes it. A modal you can only leave by finding the X is
          a dark pattern, and this is asking for a favour, not granting one. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-navy-deep/70 backdrop-blur-sm"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        className="relative w-full max-w-lg border-t-2 border-red bg-navy-deep text-bone shadow-2xl"
      >
        <button
          ref={closeButton}
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex size-9 items-center justify-center text-bone/50 transition-colors hover:text-bone"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="p-7 sm:p-9">
          {status === "done" ? (
            <div>
              <h2 id="signup-title" className="display text-4xl leading-none">
                You are in.
                <span className="block text-red">Fa&apos;afetai.</span>
              </h2>
              <p className="mt-5 leading-relaxed text-bone/70">
                Watch your inbox. Your discount code arrives with the first
                newsletter, once the store opens.
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="display mt-7 h-12 w-full bg-red text-sm tracking-[0.14em] text-bone transition-colors hover:bg-red-bright"
              >
                Back to the site
              </button>
            </div>
          ) : (
            <>
              <h2 id="signup-title" className="display text-4xl leading-[0.95]">
                Ride with
                <span className="block text-red">the squad</span>
              </h2>

              <ul className="mt-6 space-y-3">
                {/*
                  Two, not three. The third was a draw for LA28 tickets, pulled
                  before launch: there are no tickets to give, the squad has not
                  qualified, a prize draw needs published rules, and Olympic
                  marks are protected in the US under the Ted Stevens Act. A
                  fourth benefit invented to round the list out would be the
                  same mistake in a smaller size, so the list is short and true.
                */}
                {[
                  "Team news, results and squad updates in the newsletter",
                  "15% off your first merch order",
                ].map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-bone/85">
                    <span aria-hidden className="mt-1.5 size-2 shrink-0 rotate-45 bg-red" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/*
                `action` and `method` are set, not decorative. Without them a
                browser with JavaScript broken falls back to a GET and puts the
                subscriber's address in the URL, where it lands in history and
                referrer headers. A privacy leak dressed as a broken form.
              */}
              <form
                onSubmit={onSubmit}
                action="/api/subscribe"
                method="post"
                className="mt-7"
              >
                <label htmlFor="signup-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="h-12 w-full border border-bone/25 bg-bone/5 px-4 text-bone placeholder:text-bone/40 focus:border-bone focus:outline-none"
                />

                {/* Bots fill every field they find. Nobody else ever sees this. */}
                <div aria-hidden className="absolute left-[-9999px]">
                  <label htmlFor="signup-company">Company</label>
                  <input id="signup-company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="display mt-3 h-12 w-full bg-red text-sm tracking-[0.14em] text-bone transition-colors hover:bg-red-bright disabled:opacity-60"
                >
                  {status === "sending" ? "Sending" : "Sign me up"}
                </button>

                {status === "error" ? (
                  <p role="alert" className="mt-3 text-sm text-red-bright">
                    {message}
                  </p>
                ) : null}

                {/*
                  What they are agreeing to, said before they agree rather than
                  buried in a footer. The discount is conditional on a store
                  that is not open yet, and saying so is the difference between
                  an offer and a promise.
                */}
                <p className="mt-4 text-xs leading-relaxed text-bone/45">
                  We email about the team and the store, and you can
                  unsubscribe from either at any time. The discount code arrives
                  once the store opens.
                </p>
              </form>

              <button
                type="button"
                onClick={dismiss}
                className="mt-4 w-full text-xs text-bone/40 underline underline-offset-4 transition-colors hover:text-bone/70"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
