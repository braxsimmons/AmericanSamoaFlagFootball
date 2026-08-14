"use client";

import { useState } from "react";
import { TEAM } from "@/lib/content";
import { TatauField } from "./tatau";
import { Reveal } from "./reveal";

type State = "idle" | "sending" | "done" | "error";

/**
 * Email capture.
 *
 * The reason to give an address is stated plainly — fixtures, results, and
 * when the squad is announced — because "subscribe to our newsletter" asks
 * for something and offers nothing in return, and people have learned that.
 *
 * One field. Name is optional and secondary; every extra required field costs
 * conversions, and a national team's supporter list does not need a job title.
 */
export function FollowSection() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = new FormData(event.currentTarget);
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          name: form.get("name"),
          honeypot: form.get("company"),
        }),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(body.error ?? "Something went wrong. Try again.");
        return;
      }

      setState("done");
    } catch {
      setState("error");
      setMessage("Could not reach us. Check your connection and try again.");
    }
  }

  return (
    <section id="follow" className="relative overflow-hidden bg-navy py-24 text-bone sm:py-32">
      <TatauField className="absolute inset-0" color="#f5f2ec" opacity={0.08} />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="display text-xs tracking-[0.3em] text-red-bright">
            Stay with the team
          </span>
          <h2 className="display mt-5 text-5xl sm:text-6xl">
            Know before
            <span className="block text-red-bright">everyone else</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-bone/70">
            Fixtures, results from Düsseldorf, and the squad announcement — sent
            when there is something worth sending. No more than that.
          </p>
        </Reveal>

        {state === "done" ? (
          <div
            className="mx-auto mt-12 max-w-md border border-bone/25 bg-navy-deep/60 p-8"
            role="status"
          >
            <p className="display text-3xl">Mālō. You&apos;re on the list.</p>
            <p className="mt-3 text-bone/70">
              We&apos;ll be in touch when there is news from the team.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-md text-left">
            {/* Bots fill this. It is off-screen rather than display:none, which
                some crawlers skip. */}
            <label className="sr-only" htmlFor="company">
              Company (leave blank)
            </label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px]"
            />

            <label htmlFor="name" className="display text-xs tracking-[0.2em] text-bone/60">
              Name <span className="normal-case tracking-normal opacity-60">(optional)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 h-14 w-full border border-bone/25 bg-navy-deep/50 px-4 text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-red-bright"
              placeholder="Your name"
            />

            <label htmlFor="email" className="display mt-6 block text-xs tracking-[0.2em] text-bone/60">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 h-14 w-full border border-bone/25 bg-navy-deep/50 px-4 text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-red-bright"
              placeholder="you@example.com"
            />

            {state === "error" ? (
              <p className="mt-3 text-sm text-red-bright" role="alert">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state === "sending"}
              className="display mt-6 h-14 w-full bg-red text-lg tracking-[0.1em] text-bone transition-all duration-200 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:bg-red-bright active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {state === "sending" ? "Sending…" : "Keep me posted"}
            </button>

            <p className="mt-4 text-center text-xs text-bone/40">
              We will not share your address. Unsubscribe any time.
            </p>
          </form>
        )}

        <div className="mt-14 border-t border-bone/15 pt-10">
          <p className="text-bone/50">Everything as it happens, on Instagram.</p>
          <a
            href={TEAM.instagram}
            target="_blank"
            rel="noreferrer"
            className="display mt-3 inline-flex items-center gap-3 text-2xl text-bone transition-colors hover:text-red-bright"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.41.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2Z" />
            </svg>
            {TEAM.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
