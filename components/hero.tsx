import Link from "next/link";
import { HERO_PHOTOS, WORLDS } from "@/lib/content";
import { HeroCarousel } from "./carousel";
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


      {/* The arc artwork this cell used to hold has been replaced by the squad
          photograph below, which is what it was always a placeholder for. It is
          pulled back to a faint wash so the corner is not empty behind the
          photo's edge. */}
      <TatauArc
        className="pointer-events-none absolute -right-32 top-1/2 hidden h-[130%] w-[62%] -translate-y-1/2 text-bone lg:block"
        opacity={0.05}
        position="center"
      />

      {/* A wash so type stays legible once real photography lands behind it. */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/30" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-20 pt-32 sm:px-8 sm:pb-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
        <div>
          <LiveBadge />

          {/*
          Three deliberate lines, the way the jersey breaks it: TEAM above
          AMERICAN SAMOA. Written as one string it wrapped on its own and landed
          in the same place here, but the wrap point moves with the column
          width, so at some sizes it would have read "Team American" over
          "Samoa" instead. `whitespace-nowrap` pins each line so the lockup is
          the same shape at every breakpoint.
        */}
        <h1 className="display mt-7 text-bone">
          {[
            { word: "Team", delay: 60, jersey: false },
            { word: "American", delay: 150, jersey: false },
            { word: "Samoa", delay: 240, jersey: true },
          ].map(({ word, delay, jersey }) => (
            <span key={word} className="block overflow-hidden">
              <span
                className={`hero-line block whitespace-nowrap text-[11vw] leading-[0.86] sm:text-[7.5vw] lg:text-[5.25rem] xl:text-[6rem] ${
                  jersey ? "jersey-type" : ""
                }`}
                style={{ "--delay": `${delay}ms` } as React.CSSProperties}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

          <div
            className="hero-rule mt-6 h-[3px] w-full max-w-md bg-red"
            style={{ "--delay": "480ms" } as React.CSSProperties}
          />

          <p
            className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-bone/75 sm:text-xl"
            style={{ "--delay": "600ms" } as React.CSSProperties}
          >
            Fifty-five square miles. One national team. Fifth in the world on
            our World Championship debut, having beaten the United States along
            the way. Unity. Culture. Family.
          </p>

          <div
            className="hero-fade mt-9 flex flex-wrap items-center gap-4"
            style={{ "--delay": "720ms" } as React.CSSProperties}
          >
            <Link
              href="/shop"
              className="display group relative inline-flex h-14 items-center gap-3 bg-red px-8 text-lg tracking-[0.1em] text-bone transition-transform duration-200 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop our Merch
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

        {/*
          The squad in Düsseldorf, after the group stage. This is the single
          most valuable asset on the site: a real photograph of the real team,
          in front of the tournament's own backdrop, which does more to prove
          the whole page than any amount of copy.

          Sized down rather than bled full-height. It sits beside the type on
          desktop and under the buttons on mobile, where the hero is already
          tall and a large image would push the buttons off the first screen.

          `priority` because it is above the fold on desktop and is the largest
          contentful paint there.
        */}
        <div className="relative w-full lg:max-w-none">
          <HeroCarousel slides={[...HERO_PHOTOS]} />
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
 * "live" the moment the tournament ends instead of quietly lying for a year,
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
