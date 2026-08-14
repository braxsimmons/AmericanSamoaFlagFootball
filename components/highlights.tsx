import { HIGHLIGHTS, TEAM, WORLDS } from "@/lib/content";
import { BandStack } from "./tatau";
import { YouTubeIcon } from "./social";

/**
 * Düsseldorf highlights.
 *
 * Facades rather than live YouTube iframes. An embedded player loads roughly a
 * megabyte of script per video before anybody presses play, and sets cookies on
 * arrival; a poster image and a play button load a single thumbnail and hand off
 * to YouTube on click. On a page with several clips that is the difference
 * between a fast page and a slow one, and it keeps third-party cookies off a
 * visitor who never watched anything.
 */
export function HighlightsSection() {
  if (HIGHLIGHTS.length === 0) return null;

  return (
    <section id="highlights" className="relative overflow-hidden bg-navy-deep py-24 text-bone sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display display-balanced max-w-2xl text-5xl sm:text-6xl">
            Highlights from
            <span className="block text-red">{WORLDS.city}</span>
          </h2>

          <a
            href={TEAM.youtube}
            target="_blank"
            rel="noreferrer"
            className="display group inline-flex h-12 items-center gap-3 border border-bone/30 px-5 text-sm tracking-[0.14em] text-bone transition-all duration-200 hover:-translate-y-0.5 hover:border-bone hover:bg-bone hover:text-navy-deep"
          >
            <YouTubeIcon className="size-5" />
            Every video
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        {/*
          One clip is a feature, not a grid cell. A lone card in a three-column
          layout reads as a section waiting for content; the same card at half
          width reads as the thing the section is about. The grid returns on its
          own as more footage lands.
        */}
        <ul
          className={
            HIGHLIGHTS.length === 1
              ? "mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
              : "mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {HIGHLIGHTS.map((clip) => (
            <li key={clip.id}>
              <a
                href={`https://youtu.be/${clip.id}`}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <div className="relative aspect-video overflow-hidden border border-bone/20 bg-navy">
                  {/*
                    YouTube's own thumbnail, served from its CDN. `hqdefault`
                    exists for every video; `maxresdefault` does not, and a
                    missing one renders as a grey placeholder.
                  */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-105"
                  />

                  <span className="absolute inset-0 bg-navy-deep/25 transition-colors duration-300 group-hover:bg-navy-deep/10" />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-16 items-center justify-center rounded-full bg-red text-bone shadow-lg transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden="true">
                        <path d="M7 4.5v15l13-7.5Z" />
                      </svg>
                    </span>
                  </span>
                </div>

                <p
                  className={`display mt-4 transition-colors group-hover:text-red-bright ${
                    HIGHLIGHTS.length === 1 ? "text-3xl sm:text-4xl" : "text-2xl"
                  }`}
                >
                  {clip.title}
                </p>
                {clip.note ? (
                  <p className="mt-1.5 text-sm text-bone/65">{clip.note}</p>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <BandStack className="mt-20 w-full text-red/70" motifs={["spear", "comb"]} />
    </section>
  );
}
