import Link from "next/link";
import { WORLDS } from "@/lib/content";
import { BandStack, TatauArc, TatauField } from "./tatau";

/**
 * The hero.
 *
 * Leads with where the team is right now rather than with a slogan. A national
 * team's site should answer "what is happening" above the fold; "elevating the
 * game" answers nothing and is what every template says.
 *
 * The wordmark animates in by line, staggered, with the red keyline drawing
 * underneath, the same gesture as the jersey's lettering. All of it is
 * suppressed under `prefers-reduced-motion`.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-navy-deep">
      {/* Field texture. Sits behind everything and never carries meaning. */}
      <TatauField className="absolute inset-0 text-bone" opacity={0.09} />

      {/* The flank panel from the side of the jersey, bleeding off the right. */}


      {/* The client's own arc artwork, large and bled off the right edge. When
          the federation's photography arrives this is the element it replaces , 
          same cell, same bleed, so the type scale will not need redoing. */}
      <TatauArc
        className="pointer-events-none absolute -right-32 top-1/2 hidden h-[130%] w-[62%] -translate-y-1/2 text-bone lg:block"
        opacity={0.14}
        position="center"
      />

      {/* A wash so type stays legible once real photography lands behind it. */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/30" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pb-24">
        <LiveBadge />

        <h1 className="display mt-7 text-bone">
          <span className="block overflow-hidden">
            <span
              className="hero-line block text-[13vw] leading-[0.84] sm:text-[9vw] lg:text-[7.5rem]"
              style={{ "--delay": "60ms" } as React.CSSProperties}
            >
              American
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="jersey-type hero-line block text-[13vw] leading-[0.84] sm:text-[9vw] lg:text-[7.5rem]"
              style={{ "--delay": "160ms" } as React.CSSProperties}
            >
              Samoa
            </span>
          </span>
        </h1>

        <div
          className="hero-rule mt-6 h-[3px] w-full max-w-md bg-red"
          style={{ "--delay": "480ms" } as React.CSSProperties}
        />

        <p
          className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-bone/75 sm:text-xl"
          style={{ "--delay": "600ms" } as React.CSSProperties}
        >
          Fifty-five square miles. One national team. A first world championship,
          won on the field against China, and a bracket in Düsseldorf that nobody
          drew us into.
        </p>

        <div
          className="hero-fade mt-9 flex flex-wrap items-center gap-4"
          style={{ "--delay": "720ms" } as React.CSSProperties}
        >
          <Link
            href="/shop"
            className="display group relative inline-flex h-14 items-center gap-3 bg-red px-8 text-lg tracking-[0.1em] text-bone transition-transform duration-200 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Shop the kit
            <svg viewBox="0 0 24 24" className="size-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a
            href="#road"
            className="display inline-flex h-14 items-center border border-bone/30 px-8 text-lg tracking-[0.1em] text-bone/90 transition-colors hover:border-bone hover:text-bone"
          >
            How we got here
          </a>
        </div>
      </div>

      <BandStack className="absolute bottom-0 left-0 w-full text-red" motifs={["comb", "spear"]} />
    </section>
  );
}

/**
 * Where the team is, right now.
 *
 * Computed from the fixture dates rather than hardcoded, so it stops saying
 * "live" the moment the tournament ends instead of quietly lying for a year , 
 * which is the most common way a team site goes stale.
 */
function LiveBadge() {
  const now = new Date();
  const start = new Date(`${WORLDS.startDate}T00:00:00Z`);
  const end = new Date(`${WORLDS.endDate}T23:59:59Z`);

  const live = now >= start && now <= end;
  const upcoming = now < start;

  const label = live
    ? "Competing now"
    : upcoming
      ? "Next up"
      : "Most recent";

  return (
    <div className="inline-flex items-center gap-3 border border-bone/25 bg-navy/40 px-4 py-2 backdrop-blur">
      {live ? (
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-bright opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-red-bright" />
        </span>
      ) : null}
      <span className="display text-xs tracking-[0.24em] text-bone/70">{label}</span>
      <span className="h-4 w-px bg-bone/20" />
      <span className="display text-xs tracking-[0.14em] text-bone">
        {WORLDS.event} · {WORLDS.city} · Group {WORLDS.group}
      </span>
    </div>
  );
}
