import { TEAM } from "@/lib/content";

/*
  Instagram and YouTube.

  Icons drawn inline rather than pulled from an icon package: two glyphs do not
  justify a dependency, and both marks have brand guidelines about proportion
  that a generic icon set tends to get wrong.
*/

export function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.41.6.22 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2Z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.1 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.1ZM9.6 15.6V8.4l6.3 3.6Z" />
    </svg>
  );
}

/**
 * The social buttons.
 *
 * Labelled, not icon-only. An unlabelled glyph is a guess for anyone using a
 * screen reader and a small target for everyone else — and these are the only
 * places the team currently publishes anything, so they are primary navigation
 * rather than footer decoration.
 */
export function SocialButtons({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** `dark` sits on navy; `light` sits on bone. */
  tone?: "dark" | "light";
}) {
  const base =
    "display group inline-flex h-12 items-center gap-3 px-5 text-sm tracking-[0.14em] transition-all duration-200 ease-[var(--ease-out-quint)] hover:-translate-y-0.5";

  const styles =
    tone === "dark"
      ? "border border-bone/30 text-bone hover:border-bone hover:bg-bone hover:text-navy-deep"
      : "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-bone";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={TEAM.instagram}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${styles}`}
      >
        <InstagramIcon className="size-5 transition-transform duration-200 group-hover:scale-110" />
        Instagram
        <span className="sr-only"> — opens in a new tab</span>
      </a>

      <a
        href={TEAM.youtube}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${styles}`}
      >
        <YouTubeIcon className="size-5 transition-transform duration-200 group-hover:scale-110" />
        YouTube
        <span className="sr-only"> — opens in a new tab</span>
      </a>
    </div>
  );
}
