import type { Metadata } from "next";
import { PRESS, RESULTS, SITE_URL, TEAM, WORLDS } from "@/lib/content";
import { BandStack, SpearRow, TatauField } from "@/components/tatau";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  /*
    Absolute, so it does not become "Press · American Samoa Flag Football".
    Nobody searches "press". They search the team, the result and the
    tournament, and a title tag is the single strongest on-page signal there is.
  */
  title: {
    absolute: "American Samoa Flag Football: Düsseldorf 2026 Results and Press",
  },
  description:
    "Every American Samoa result from the 2026 IFAF Flag Football World Championship in Düsseldorf, including the 38–32 win over the United States, plus media coverage and contact for the federation.",
  alternates: { canonical: "/press" },
};

/*
  Press.

  Two jobs, and they pull in opposite directions if you are not careful.

  The first is to be useful to a journalist filing today: verified scores they
  can quote, correct spellings, a contact. That is why the facts sit above the
  coverage rather than below it.

  The second is to point outward. The links here go to other people's articles
  and nothing is republished. A page that reproduced the coverage would be a
  copyright problem and would give a search engine a duplicate of something it
  already has; a page that links out is evidence that independent sources are
  writing about this team, which is the thing worth demonstrating.

  Deliberately not padded. Five real articles beat thirty syndication copies of
  the same wire story, which is what this list becomes if nobody is disciplined.
*/
export default function PressPage() {
  /*
    Structured data for the tournament and every game in it.

    A scoreline in a paragraph is text a crawler has to interpret. As `subEvent`
    on a `SportsEvent`, with both sides named as `SportsTeam`, it is a fact
    about who played whom, and it ties this page to the tournament entity and
    to the team entity declared site-wide in the root layout.

    Being straight about the limit: schema.org has no score property that Google
    turns into a rich result, so this will not put "38-32" in the search listing.
    What it does is make the relationships legible, which is what entity ranking
    for a name like this actually runs on.

    BreadcrumbList is the one here with a visible payoff: it replaces the raw
    URL under the result with a Home > Press trail.
  */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Results and press", item: `${SITE_URL}/press` },
        ],
      },
      {
        "@type": "SportsEvent",
        name: `${WORLDS.year} ${WORLDS.event}`,
        sport: "Flag football",
        startDate: WORLDS.startDate,
        endDate: WORLDS.endDate,
        location: {
          "@type": "Place",
          name: `${WORLDS.city}, ${WORLDS.country}`,
          address: { "@type": "PostalAddress", addressLocality: WORLDS.city, addressCountry: "DE" },
        },
        organizer: {
          "@type": "SportsOrganization",
          name: "International Federation of American Football",
          alternateName: "IFAF",
        },
        subEvent: RESULTS.map((game) => ({
          "@type": "SportsEvent",
          name: `American Samoa ${game.us}, ${game.opponent} ${game.them}`,
          sport: "Flag football",
          ...(game.iso ? { startDate: game.iso } : {}),
          location: { "@type": "Place", name: `${WORLDS.city}, ${WORLDS.country}` },
          competitor: [
            { "@type": "SportsTeam", name: "American Samoa", url: SITE_URL },
            { "@type": "SportsTeam", name: game.opponent },
          ],
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="relative overflow-hidden bg-navy-deep pb-16 pt-36 text-bone sm:pt-44">
        <TatauField className="absolute inset-0 text-bone" opacity={0.08} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/*
            "In the news" looked better and told a search engine nothing. The
            headline now carries the tournament and the word somebody actually
            types, and the sentence under it carries the team name.
          */}
          <h1 className="display display-balanced mt-5 max-w-3xl text-6xl sm:text-7xl">
            Düsseldorf 2026
            <span className="block text-red">results and press</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/70">
            Fifth in the world on debut. Coverage of American Samoa at the{" "}
            {WORLDS.year} {WORLDS.event} in {WORLDS.city}, and the full record
            behind it.
          </p>
        </div>
        <SpearRow className="absolute bottom-0 left-0 h-3 w-full text-red" />
      </section>

      {/*
        Results first. Somebody writing about this team needs a number they can
        trust more than they need our press clippings, and if this page does not
        give it to them they will take it from a secondary source that has it
        wrong.
      */}
      <section className="bg-bone py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="display text-sm tracking-[0.24em] text-navy/55">
            Verified results
          </h2>

          <ul className="mt-6 max-w-3xl">
            {RESULTS.map((game) => (
              <li
                key={game.opponent}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-navy/12 py-4"
              >
                <span className="display text-xl text-navy-deep sm:text-2xl">
                  American Samoa {game.us}, {game.opponent} {game.them}
                </span>
                <span className="text-sm text-navy/55">
                  {game.stage}
                  {game.date ? (
                    <>
                      {" · "}
                      <time dateTime={game.iso}>{game.date}</time>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-navy/60">
            American Samoa won Group A and finished fifth of twelve nations, on
            debut, from the lowest ranking in the field. Scores as recorded by
            the American Samoa National Football Federation.
          </p>
        </div>
      </section>

      <section className="bg-bone pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="display text-sm tracking-[0.24em] text-navy/55">Coverage</h2>

          <ul className="mt-6 grid gap-px overflow-hidden border border-navy/12 bg-navy/12">
            {PRESS.map((item, i) => (
              <Reveal as="li" key={item.url} delay={Math.min(i, 6) * 60} className="block">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block bg-bone p-6 transition-colors hover:bg-white sm:p-7"
                >
                  <div className="display flex flex-wrap items-baseline gap-x-4 text-xs tracking-[0.18em] text-navy/50">
                    <span className="text-red">{item.outlet}</span>
                    <time dateTime={item.iso}>{item.date}</time>
                  </div>
                  <p className="display mt-2 max-w-3xl text-2xl leading-tight text-navy-deep transition-colors group-hover:text-red sm:text-3xl">
                    {item.title}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/60">
                    {item.summary}
                  </p>
                  <span className="display mt-4 inline-flex items-center gap-2 text-xs tracking-[0.14em] text-red">
                    Read on {item.outlet}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <BandStack className="mt-16 w-full text-navy/20" motifs={["spear", "comb"]} />
      </section>

      <section className="bg-navy-deep py-16 text-bone">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="display text-3xl sm:text-4xl">Media enquiries</h2>
          <div className="mt-5 h-[3px] w-24 bg-red" />
          <p className="mt-5 max-w-xl leading-relaxed text-bone/70">
            For interviews, photography or squad information, contact the{" "}
            {TEAM.federation} through{" "}
            <a
              href={TEAM.instagram}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-red underline underline-offset-4"
            >
              {TEAM.instagramHandle}
            </a>
            . Team name on first reference: American Samoa. The squad is also
            known as Amerika Sāmoa.
          </p>
        </div>
      </section>
    </>
  );
}
