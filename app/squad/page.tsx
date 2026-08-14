import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COACHES, ROSTER, TEAM, WORLDS, type Person } from "@/lib/content";
import { BandStack, SpearRow, TatauField } from "@/components/tatau";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Squad",
  description:
    "The Team American Samoa flag football squad and coaching staff for the 2026 IFAF World Championship in Düsseldorf.",
  alternates: { canonical: "/squad" },
};

/*
  The squad page.

  Built without a single portrait, and it is not waiting on them. The thing that
  looks unfinished is a grid of faces with grey rectangles where faces are
  missing; a roster set as type does not read as missing anything, because there
  is no slot standing empty.

  Portraits are supported and will appear the moment the set is complete. See
  `everyoneHasAPhoto` below for why it is all-or-nothing.

  Why this exists as its own page rather than staying a block on the home page:
  several of these players are searched by name far more often than the team is,
  and on the home page those names compete with the tournament, the kit and the
  timeline for what the page is about. Here they are what it is about.
*/

/**
 * Portraits are all-or-nothing.
 *
 * Photographs of a touring squad arrive in ones and twos. Rendering them as
 * they land means a page that is half faces and half placeholders for weeks,
 * which reads as broken in a way that no faces at all never does. When the last
 * one lands this flips on its own with no code change.
 */
function everyoneHasAPhoto(people: readonly Person[]) {
  return people.length > 0 && people.every((p) => Boolean(p.photo));
}

export default function SquadPage() {
  const withPortraits = everyoneHasAPhoto(ROSTER);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep pb-16 pt-36 text-bone sm:pt-44">
        <TatauField className="absolute inset-0 text-bone" opacity={0.08} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <h1 className="display display-balanced mt-5 max-w-3xl text-6xl sm:text-7xl">
            The squad
            <span className="block text-red">that got there</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/70">
            The {ROSTER.length} players and {COACHES.length} coaches
            representing American Samoa at the {WORLDS.event} in {WORLDS.city},
            {" "}13 to 16 August 2026.
          </p>
        </div>
        <SpearRow className="absolute bottom-0 left-0 h-3 w-full text-red" />
      </section>

      <section className="bg-bone py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Roster people={ROSTER} heading="Players" withPortraits={withPortraits} />

          <div className="mt-20">
            <Roster people={COACHES} heading="Coaching staff" withPortraits={false} />
          </div>

          <Reveal delay={80}>
            <p className="mt-16 max-w-2xl text-sm leading-relaxed text-navy/60">
              Squad numbers, positions and villages are published here as the
              federation confirms them. Nothing on this page is estimated.
            </p>
          </Reveal>
        </div>

        <BandStack className="mt-20 w-full text-navy/20" motifs={["spear", "comb"]} />
      </section>

      <section className="bg-navy-deep py-16 text-bone">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="display text-3xl sm:text-4xl">Wear what they wear.</p>
          <Link
            href="/shop"
            className="display group inline-flex h-12 shrink-0 items-center gap-3 border border-bone/30 px-6 text-sm tracking-[0.14em] transition-all duration-200 hover:-translate-y-0.5 hover:border-bone hover:bg-bone hover:text-navy-deep"
          >
            Shop our merch
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

function Roster({
  people,
  heading,
  withPortraits,
}: {
  people: readonly Person[];
  heading: string;
  withPortraits: boolean;
}) {
  return (
    <>
      <h2 className="display text-sm tracking-[0.24em] text-navy/55">{heading}</h2>

      <ul
        className={
          withPortraits
            ? "mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            : "mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {people.map((person, i) => (
          <Reveal as="li" key={person.name} delay={Math.min(i, 8) * 45} className="block">
            {withPortraits && person.photo ? (
              <div className="overflow-hidden border border-navy/15 bg-white">
                <Image
                  src={person.photo}
                  alt={`${person.name}, ${TEAM.shortName} flag football`}
                  width={600}
                  height={750}
                  sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 90vw"
                  className="h-auto w-full"
                />
              </div>
            ) : null}

            {/*
              A heading per person, not a plain list item. This is the text
              somebody is searching for, and a name inside a heading is a far
              stronger signal than the same name in a list. It is also where the
              number, position and village will hang once they exist.
            */}
            <h3
              className={`display text-navy-deep ${
                withPortraits
                  ? "mt-4 text-2xl"
                  : "border-b border-navy/10 py-4 text-2xl sm:text-3xl"
              }`}
            >
              {person.name}
            </h3>

            {person.position || person.number || person.village ? (
              <p className="mt-1 text-sm text-navy/60">
                {[
                  person.number ? `#${person.number}` : null,
                  person.position,
                  person.village,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
          </Reveal>
        ))}
      </ul>
    </>
  );
}
