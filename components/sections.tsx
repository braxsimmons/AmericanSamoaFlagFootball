import Image from "next/image";
import type { ReactNode } from "react";
import { GROUP_A, ROAD, ROSTER, TEAM, VALUES, WORLDS } from "@/lib/content";
import { BandStack, TatauArc, TatauField, TatauRing } from "./tatau";
import { Reveal } from "./reveal";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-[2px] w-10 bg-red" />
      <span className="display text-xs tracking-[0.3em] text-red">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------- Düsseldorf -- */

export function WorldsSection() {
  return (
    <section id="worlds" className="relative overflow-hidden bg-bone py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel>13–16 August 2026</SectionLabel>
          <h2 className="display mt-5 max-w-3xl text-5xl text-navy-deep sm:text-7xl">
            First world championship,
            <span className="text-red"> and the bracket knows it</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
            The {WORLDS.event} runs in {WORLDS.city} from 13 to 16 August. American
            Samoa is in Group {WORLDS.group} — drawn against the top-ranked
            United States, Australia and Israel. {WORLDS.stakes}
          </p>
        </Reveal>

        <div className="mt-14 overflow-hidden border border-navy/10 bg-white">
          <div className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4">
            <span className="display text-sm tracking-[0.24em] text-bone">
              Group {WORLDS.group}
            </span>
            <span className="display text-xs tracking-[0.2em] text-bone/60">
              IFAF world ranking
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
                    {team.isUs ? (
                      <span className="display flex size-9 shrink-0 items-center justify-center bg-red text-xs text-bone">
                        AS
                      </span>
                    ) : (
                      <span className="display flex size-9 shrink-0 items-center justify-center border border-navy/20 text-xs text-navy/65">
                        {team.code}
                      </span>
                    )}
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
          <p className="mt-6 text-sm text-navy/65">
            Rankings as published by the International Federation of American
            Football. American Samoa entered the rankings for the first time in
            November 2025.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- The road -- */

export function RoadSection() {
  return (
    <section id="road" className="relative overflow-hidden bg-navy-deep py-24 text-bone sm:py-32">
      <TatauField className="absolute inset-0 text-bone" opacity={0.07} />
      <TatauArc
        className="pointer-events-none absolute -right-20 top-0 hidden size-[620px] text-bone lg:block"
        opacity={0.08}
        position="center"
      />
      {/* The one motif here with real movement in it. Large, low contrast, and
          bleeding off the corner so it reads as artwork rather than as an icon. */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel>The road here</SectionLabel>
          <h2 className="display mt-5 max-w-3xl text-5xl sm:text-7xl">
            Nobody gave us
            <span className="block text-red">this place</span>
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
      <TatauField className="absolute inset-0 text-white" opacity={0.12} />
      <BandStack className="absolute inset-x-0 top-0 w-full text-bone/35" motifs={["comb", "spear"]} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="display max-w-2xl text-xs tracking-[0.3em] text-bone/70">
            Printed on the jersey. Not written for a website.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px bg-bone/20 sm:grid-cols-2 lg:grid-cols-4">
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
            <SectionLabel>The team</SectionLabel>
            <h2 className="display mt-5 text-5xl text-navy-deep sm:text-6xl">
              Fifty-five square miles,
              <span className="block text-red">one national team</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70">
              American Samoa sends more players per capita into American football
              than anywhere else on earth. Flag is where the next generation
              starts — and where the territory now has a national side ranked
              among the world&apos;s best.
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

        {/* Honest about what is not here yet. An invented roster is the worst
            thing a team site can carry, and a blank space with an explanation
            is more credible than filler. */}
        <Reveal delay={100}>
          <div className="mt-16 border border-dashed border-navy/25 bg-white/50 p-8 text-center">
            {ROSTER.length === 0 ? (
              <>
                <p className="display text-2xl text-navy-deep">Roster coming</p>
                <p className="mx-auto mt-3 max-w-md text-navy/60">
                  Player profiles, numbers and villages go here once the
                  federation releases the squad. Follow{" "}
                  <a
                    href={TEAM.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-red underline underline-offset-4"
                  >
                    {TEAM.instagramHandle}
                  </a>{" "}
                  in the meantime.
                </p>
              </>
            ) : null}
          </div>
        </Reveal>
      </div>

      {/* Three different motifs at three different weights — the way the
          reference artwork builds an edge. One repeated row reads as a border;
          this reads as tatau. */}
      <BandStack className="mt-20 w-full text-navy/25" motifs={["spear", "comb", "bird"]} />
    </section>
  );
}
