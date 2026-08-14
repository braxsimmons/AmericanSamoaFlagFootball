import { TEAM } from "@/lib/content";
import { BandStack } from "./tatau";
import { InstagramIcon, SocialButtons, YouTubeIcon } from "./social";

/*
  The Instagram section.

  A word on what is and is not possible here, because it shapes the design.

  Instagram removed free *profile* feed embeds. The blockquote embed still works
  for individual posts without a token, but there is no supported way to render
  "the latest N posts from @amsnff_" without either the Graph API (which needs a
  Business/Creator account, a Facebook Page, an app and a long-lived token) or a
  third-party widget (SnapWidget, LightWidget, Elfsight, all have free tiers).

  So this renders a real widget when one is configured and an honest, designed
  link-out when one is not. Deliberately not a "coming soon" box: the account is
  live and active right now, and the job of this section either way is to move
  somebody to it.
*/

export function InstagramSection() {
  const widget = process.env.NEXT_PUBLIC_INSTAGRAM_EMBED_URL;

  return (
    <section id="follow-social" className="relative overflow-hidden bg-bone py-24 sm:py-32">

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="display display-balanced mt-5 max-w-2xl text-5xl text-navy-deep sm:text-6xl">
              Training, travel,
              <span className="block text-red">and the games themselves</span>
            </h2>
          </div>

          <SocialButtons tone="light" />
        </div>

        <div className="mt-14">
          {widget ? (
            <div className="overflow-hidden border border-navy/15 bg-white">
              <iframe
                src={widget}
                title={`Instagram feed for ${TEAM.instagramHandle}`}
                className="h-[720px] w-full"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          ) : (
            <FeedFallback />
          )}
        </div>
      </div>

      <BandStack className="mt-20 w-full text-navy/20" motifs={["spear", "comb"]} />
    </section>
  );
}

/**
 * What shows before a feed widget is wired up.
 *
 * Two large cards rather than a grid of grey rectangles pretending to be posts.
 * Fake post placeholders are the single most obvious "unfinished site" signal,
 * and they promise content that is not there, whereas the accounts genuinely
 * are there and worth going to.
 */
function FeedFallback() {
  return (
    <div className="grid gap-px overflow-hidden border border-navy/15 bg-navy/15 sm:grid-cols-2">
      <a
        href={TEAM.instagram}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col justify-between bg-bone p-8 transition-colors hover:bg-white sm:p-10"
      >
        <div className="flex items-center gap-3 text-navy">
          <InstagramIcon className="size-8" />
          <span className="display text-2xl">{TEAM.instagramHandle}</span>
        </div>
        <p className="mt-6 max-w-sm leading-relaxed text-navy/70">
          Day to day from the squad: sessions, the flight out, and the games as
          they happen. The account posts before anything reaches this page.
        </p>
        <span className="display mt-8 inline-flex items-center gap-2 text-sm tracking-[0.14em] text-red">
          Follow on Instagram
          <svg
            viewBox="0 0 24 24"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>

      <a
        href={TEAM.youtube}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col justify-between bg-bone p-8 transition-colors hover:bg-white sm:p-10"
      >
        <div className="flex items-center gap-3 text-navy">
          <YouTubeIcon className="size-8" />
          <span className="display text-2xl">{TEAM.youtubeHandle}</span>
        </div>
        <p className="mt-6 max-w-sm leading-relaxed text-navy/70">
          Full match footage and longer pieces on the programme. Where the games
          live once they are done.
        </p>
        <span className="display mt-8 inline-flex items-center gap-2 text-sm tracking-[0.14em] text-red">
          Watch on YouTube
          <svg
            viewBox="0 0 24 24"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </span>
      </a>
    </div>
  );
}
