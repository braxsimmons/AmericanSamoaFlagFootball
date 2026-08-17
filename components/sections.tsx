import Image from "next/image";
import Link from "next/link";
import { COACHES, GROUP_A, KIT_H, KIT_W, LANDING_KIT, RESULTS, ROAD, ROSTER, TEAM, VALUES, WORLDS } from "@/lib/content";
import { BandStack, TatauField, TatauRing } from "./tatau";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------- Düsseldorf -- */

export function WorldsSection() {
  return (
    <section id="worlds" className="relative overflow-hidden bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="display display-balanced mt-5 max-w-3xl text-5xl text-navy-deep sm:text-6xl">
            World Championships.{" "}
            <span className="text-red">Against all odds.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
            Team American Samoa arrived in {WORLDS.city} as the lowest ranked
            side in the field, 33rd in the world, playing its first World
            Championship. It left having beaten the United States and won Group
            A.
          </p>
        </Reveal>

        {/*
          The scorelines, above the table, because the result is the news and
          the seedings are only the context that makes it one.

          Two games, not the full run. Every score here is confirmed by at least
          two independent published sources; the rest of the tournament is
          missing rather than guessed. See RESULTS in lib/content.ts.
        */}
        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="display text-sm tracking-[0.24em] text-navy/55">Düsseldorf</h3>
          <Link href="/press" className="display group text-sm tracking-[0.14em] text-red">
            Results and press coverage
            <span
              aria-hidden
              className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {RESULTS.map((game, i) => {
            const won = game.us > game.them;
            return (
              <Reveal as="li" key={game.opponent} delay={i * 90} className="block">
                <div
                  className={`h-full border p-6 sm:p-7 ${
                    game.headline ? "border-red bg-navy-deep text-bone" : "border-navy/15 bg-white"
                  }`}
                >
                  <div
                    className={`display flex items-baseline gap-3 text-xs tracking-[0.18em] ${
                      game.headline ? "text-bone/55" : "text-navy/50"
                    }`}
                  >
                    <span>{game.stage}</span>
                    <span>{game.date}</span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-6">
                    <div>
                      <p className={`display text-2xl ${game.headline ? "" : "text-navy-deep"}`}>
                        American Samoa
                      </p>
                      <p
                        className={`display text-2xl ${
                          game.headline ? "text-bone/60" : "text-navy/55"
                        }`}
                      >
                        {game.opponent}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`display text-4xl tabular-nums sm:text-5xl ${
                          won ? "text-red" : game.headline ? "" : "text-navy-deep"
                        }`}
                      >
                        {game.us}
                      </p>
                      <p
                        className={`display text-4xl tabular-nums sm:text-5xl ${
                          game.headline ? "text-bone/60" : "text-navy/55"
                        }`}
                      >
                        {game.them}
                      </p>
                    </div>
                  </div>

                  {game.note ? (
                    <p
                      className={`mt-5 text-sm leading-relaxed ${
                        game.headline ? "text-bone/70" : "text-navy/60"
                      }`}
                    >
                      {game.note}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
        <div className="overflow-hidden border border-navy/10 bg-white">
          <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4">
            <span className="display text-sm tracking-[0.24em] text-bone">
              Group {WORLDS.group}
            </span>
            <span className="display text-xs tracking-[0.2em] text-bone/60">
              World ranking going in
            </span>
          </div>

          <ul>
            {GROUP_A.map((team, i) => (
              <Reveal as="li" key={team.code} delay={i * 60} className="block">
                <div
                  className={`flex items-center justify-between gap-4 border-b border-navy/15 px-6 py-5 last:border-0 ${
                    team.isUs ? "bg-navy/[0.04]" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    {/*
                      The flag rather than a two-letter code. American Samoa
                      keeps its emphasis through a red ring rather than through
                      being the only row without a flag, which is what swapping
                      the code box for an image would otherwise have cost.
                    */}
                    <span
                      className={`relative flex size-9 shrink-0 overflow-hidden rounded-full ${
                        team.isUs ? "ring-2 ring-red ring-offset-2 ring-offset-white" : ""
                      }`}
                    >
                      <Image
                        src={team.flag}
                        alt=""
                        width={128}
                        height={128}
                        sizes="36px"
                        className="size-full object-cover"
                      />
                    </span>
                    <span
                      className={`display truncate text-2xl sm:text-3xl ${
                        team.isUs ? "text-navy-deep" : "text-navy/70"
                      }`}
                    >
                      {team.country}
                    </span>
                  </div>
                  <span
                    className={`display shrink-0 text-2xl tabular-nums sm:text-3xl ${
                      team.isUs ? "text-red" : "text-navy/60"
                    }`}
                  >
                    #{team.worldRank}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
          </div>

            <Reveal delay={100}>
              <p className="mt-5 text-sm text-navy/65">
                Rankings as they stood before the tournament, as published by the
                International Federation of American Football. American Samoa
                entered the rankings for the first time in November 2025 and won
                the group.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            {/* Deliberately a shirt the shop sells, not the match jersey. This
                card carries a "Shop" link, and the match jersey is not one of
                the four products, so pointing here at it sent people to a store
                that did not stock the thing they had just been shown. */}
            <Link href="/shop" className="group block">
              <div className="overflow-hidden border border-navy/15 bg-white">
                <Image
                  src={LANDING_KIT.src}
                  alt={LANDING_KIT.alt}
                  width={KIT_W}
                  height={KIT_H}
                  sizes="(min-width: 1024px) 34rem, 90vw"
                  className="h-auto w-full transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <p className="display text-2xl text-navy-deep transition-colors group-hover:text-red">
                    {LANDING_KIT.name}
                  </p>
                  <p className="mt-1 text-sm text-navy/70">{LANDING_KIT.detail}</p>
                </div>
                <span className="display shrink-0 text-sm tracking-[0.14em] text-red">
                  Shop
                  <span
                    aria-hidden
                    className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- The road -- */

export function RoadSection() {
  return (
    <section id="road" className="relative overflow-hidden bg-navy-deep py-24 text-bone sm:py-32">
      <TatauField className="absolute inset-0 text-bone" opacity={0.05} size={520} />
      {/* The one motif here with real movement in it. Large, low contrast, and
          bleeding off the corner so it reads as artwork rather than as an icon. */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="display display-balanced mt-5 max-w-2xl text-5xl sm:text-6xl">
            Earned.
            <span className="block text-red">Not given.</span>
          </h2>
        </Reveal>

        <ol className="mt-16 space-y-0">
          {ROAD.map((stop, i) => (
            <Reveal as="li" key={stop.title} delay={i * 80} className="block">
              <div className="group relative grid gap-4 border-t border-bone/15 py-9 sm:grid-cols-[13rem_1fr] sm:gap-10">
                <div>
                  <p className="display text-sm tracking-[0.18em] text-red">{stop.date}</p>
                  <p className="mt-1 text-sm text-bone/65">{stop.place}</p>
                </div>
                <div>
                  <h3
                    className={`display ${
                      stop.highlight
                        ? "text-4xl sm:text-5xl"
                        : "text-2xl text-bone/80 sm:text-3xl"
                    }`}
                  >
                    {stop.title}
                  </h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-bone/60">{stop.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Values -- */

export function ValuesSection() {
  return (
    <section className="relative overflow-hidden bg-red py-24 text-bone sm:py-28">
      <TatauField className="absolute inset-0 text-white" opacity={0.07} size={520} />
      <BandStack className="absolute inset-x-0 top-0 w-full text-bone/30" motifs={["spear"]} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-px bg-bone/20 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.samoan} delay={i * 70}>
              <div className="h-full bg-red p-7">
                <p className="display text-3xl leading-none">{value.samoan}</p>
                <p className="display mt-2 text-sm tracking-[0.2em] text-bone/70">
                  {value.english}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-bone/80">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Team -- */

export function TeamSection() {
  return (
    <section id="team" className="bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal>
            <h2 className="display display-balanced mt-5 max-w-xl text-5xl text-navy-deep sm:text-6xl">
              Fifty-five square miles,
              <span className="block text-red">one national team</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70">
              American Samoa sends more players per capita into American
              football than anywhere else on earth. Flag is where the next
              generation starts, and where the territory now has a national
              side ranked among the world&apos;s best.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-navy/60">
              The programme is run by the {TEAM.federation}.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <TatauRing className="absolute inset-0 size-full text-navy" />
              <div className="absolute inset-[18%] overflow-hidden rounded-full border-4 border-bone shadow-2xl">
                {/* `contain` on a navy field: `cover` cropped the eagle and the
                    point off the flag's triangle. */}
                <Image
                  src="/media/american-samoa-flag.png"
                  alt="Flag of American Samoa"
                  fill
                  sizes="(min-width: 1024px) 28rem, 60vw"
                  className="bg-navy-deep object-contain p-2"
                  priority={false}
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/*
          The squad, by name.

          This was a dashed "roster coming" box for as long as there was nothing
          real to put in it. Now that there is, it is the most valuable text on
          the site for search: several of these players are searched by name far
          more often than the team is, and a name only earns that traffic if it
          is on the page as readable text rather than buried in an image.

          No numbers, positions or villages, because none were supplied. The
          rule that kept this box empty is the same one that leaves those out.
        */}
        <Reveal delay={100}>
          <div className="mt-16">
            <h3 className="display text-sm tracking-[0.24em] text-navy/55">
              The squad
            </h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {ROSTER.map((person) => (
                <li
                  key={person.name}
                  className="display border-b border-navy/10 pb-3 text-2xl text-navy-deep"
                >
                  {person.name}
                </li>
              ))}
            </ul>

            <h3 className="display mt-12 text-sm tracking-[0.24em] text-navy/55">
              Coaching staff
            </h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {COACHES.map((person) => (
                <li
                  key={person.name}
                  className="display border-b border-navy/10 pb-3 text-2xl text-navy-deep"
                >
                  {person.name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Three different motifs at three different weights, the way the
          reference artwork builds an edge. One repeated row reads as a border;
          this reads as tatau. */}
      <BandStack className="mt-20 w-full text-navy/20" motifs={["spear", "comb"]} />
    </section>
  );
}
