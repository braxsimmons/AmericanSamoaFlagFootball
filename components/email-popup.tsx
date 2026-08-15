"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  The signup popup.

  Fires on load. It previously waited six seconds and queued behind the cookie
  banner, which meant anyone who ignored the cookie bar never saw it at all.
  That was the "super delayed" part, not the timer.

  The 400ms that remains is not a delay in any perceptible sense: it is one
  paint, so the page is behind the modal rather than the modal arriving over a
  blank screen. Set it to 0 and the dialog can render before the hero does.

  The known cost, decided rather than overlooked: Google treats an interstitial
  covering content on arrival from search as a mobile ranking factor. If search
  traffic ever looks soft on mobile, this is the first thing to try moving to a
  scroll or exit trigger.

  Shown once. A visitor who closes it or signs up never sees it again, stored in
  localStorage rather than a cookie so it survives the cookie banner being
  declined.

  This is a real dialog, unlike the cookie bar: it takes focus, traps it, closes
  on Escape, and the page behind it genuinely is inert. So `role="dialog"` and
  `aria-modal` are correct here where they would have been a lie there.

  The backdrop is a light tint with no blur. Its job is to say which layer is
  interactive, not to hide the page: a blurred-out site behind a signup form
  reads as being held hostage for an email address, and the hero is the best
  argument for giving one.
*/

/*
  What signing up gets you.

  The 15% discount is commented out rather than deleted: the code does not exist
  yet, because there was nothing to issue it from until the store went live.
  Promising a discount that no email can deliver is the one failure a signup
  form cannot recover from, since the person only finds out after they have
  handed over their address.

  Uncomment it the moment the code exists in Ecwid, and put the fine print in
  `FINE_PRINT` back with it.
*/
const BENEFITS = [
  "Team news, results and squad updates in the newsletter",
  // "15% off your first merch order",
] as const;

const KEY = "asff-signup";
const DELAY_MS = 400;

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

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-4">
      {/* Clicking away closes it. A modal you can only leave by finding the X is
          a dark pattern, and this is asking for a favour, not granting one. */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-navy-deep/35"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        className="relative w-full max-w-sm border-t-2 border-red bg-navy-deep text-bone shadow-2xl"
      >
        <button
          ref={closeButton}
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex size-9 items-center justify-center text-bone/50 outline-none transition-colors hover:text-bone focus-visible:ring-2 focus-visible:ring-red"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="p-6 sm:p-7">
          {status === "done" ? (
            <div>
              <h2 id="signup-title" className="display text-3xl leading-none">
                You are in.
                <span className="block text-red">Fa&apos;afetai.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-bone/70">
                We will keep you updated on the team and where to see them
                play next.
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="display mt-6 h-11 w-full bg-red text-sm tracking-[0.14em] text-bone transition-colors hover:bg-red-bright"
              >
                Back to the site
              </button>
            </div>
          ) : (
            <>
              <h2 id="signup-title" className="display text-3xl leading-[0.95]">
                Ride with
                <span className="block text-red">the squad</span>
              </h2>

              {/*
                A single benefit reads as a sentence, not as a bulleted list of
                one, which looks like a list that lost its other items. Restore
                the discount to BENEFITS and this becomes a list again on its
                own.
              */}
              {BENEFITS.length === 1 ? (
                <p className="mt-4 text-sm leading-relaxed text-bone/75">{BENEFITS[0]}</p>
              ) : (
                <ul className="mt-5 space-y-2.5">
                  {BENEFITS.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-bone/85"
                    >
                      <span aria-hidden className="mt-[0.4rem] size-1.5 shrink-0 rotate-45 bg-red" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}

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
                className="mt-6"
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
                  className="h-11 w-full border border-bone/25 bg-bone/5 px-3.5 text-sm text-bone placeholder:text-bone/40 focus:border-bone focus:outline-none"
                />

                {/* Bots fill every field they find. Nobody else ever sees this. */}
                <div aria-hidden className="absolute left-[-9999px]">
                  <label htmlFor="signup-company">Company</label>
                  <input id="signup-company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="display mt-2.5 h-11 w-full bg-red text-sm tracking-[0.14em] text-bone transition-colors hover:bg-red-bright disabled:opacity-60"
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
                  buried in a footer. Nothing here is conditional on something
                  that has not happened, which is why there is nothing left to
                  qualify.
                */}
                <p className="mt-3.5 text-[0.6875rem] leading-relaxed text-bone/45">
                  We email about the team and its upcoming events, and you can
                  unsubscribe at any time.
                </p>
              </form>

              <button
                type="button"
                onClick={dismiss}
                className="mt-3 w-full text-[0.6875rem] text-bone/40 underline underline-offset-4 transition-colors hover:text-bone/70"
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
