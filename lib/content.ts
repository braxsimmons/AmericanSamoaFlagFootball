/*
  The canonical origin. Everything SEO reads from here: the canonical link, the
  sitemap, robots.txt and the structured data.

  It must match the domain that answers 200, not the one that redirects. The
  vercel.app URL now 307s to this domain and the apex 308s to www, so pointing
  any of the above at either would hand a crawler a canonical URL that is itself
  a redirect, which is the fastest way to split ranking signals between two
  hostnames.
*/
export const SITE_URL = "https://www.americansamoaflagfootball.com";

/*
  Everything the site says, in one place.

  Kept separate from the components so the federation can correct a score or
  add a fixture without going near JSX. Every claim below is sourced, the
  citations are in README.md, because the fastest way to make a site feel
  fake is to fill it with plausible-sounding nothing. "Empowering athletes to
  reach their potential" is what a template says. "Beat China 41–34 in Ningbo
  to qualify" is what a team says.
*/

export const TEAM = {
  name: "American Samoa National Flag Football",
  shortName: "American Samoa",
  federation: "American Samoa National Football Federation",
  instagram: "https://www.instagram.com/amsnff_/",
  instagramHandle: "@amsnff_",
  youtube: "https://youtube.com/@amsnff",
  youtubeHandle: "@amsnff",
} as const;

/**
 * The four values printed along the bottom of the team's own jersey.
 * These are theirs, not ours, which is exactly why they belong on the site.
 */
export const VALUES = [
  {
    samoan: "Fa'asāmoa",
    english: "Our heritage",
    body: "The Samoan way. Respect for the aiga, for the elders, and for everyone who wore this before you.",
  },
  {
    samoan: "Laumei le Atua",
    english: "God is with us",
    body: "Faith travels with the team. It is spoken before every game and it does not stay on the island.",
  },
  {
    samoan: "One team",
    english: "One island",
    body: "Fifty-five square miles and roughly 45,000 people. Everybody on the roster is playing for all of it.",
  },
  {
    samoan: "Play with heart",
    english: "Represent with pride",
    body: "Nobody expects us in this bracket. That has never once been the point.",
  },
] as const;

/**
 * The 2026 IFAF Flag Football World Championship, Düsseldorf, 13–16 August.
 * American Samoa's first appearance at a world championship, in Group A.
 */
export const WORLDS = {
  event: "IFAF Flag Football World Championship",
  year: 2026,
  city: "Düsseldorf",
  country: "Germany",
  startDate: "2026-08-13",
  endDate: "2026-08-16",
  group: "A",
  /** Also the first Olympic qualification cycle, flag football debuts at LA28. */
  stakes: "Olympic quota places for LA28 are on the line.",
} as const;

export interface GroupTeam {
  country: string;
  code: string;
  worldRank: number;
  /** Marks the home side, so the table can weight one row without a name check. */
  isUs?: boolean;
}

export const GROUP_A: readonly GroupTeam[] = [
  { country: "United States", code: "US", worldRank: 1 },
  { country: "Australia", code: "AU", worldRank: 8 },
  { country: "Israel", code: "IL", worldRank: 12 },
  { country: "American Samoa", code: "AS", worldRank: 33, isUs: true },
];

/**
 * How they got there. The qualifying run is the story, a first-ever berth
 * won on the field, not awarded.
 */
export interface RoadStop {
  date: string;
  place: string;
  title: string;
  body: string;
  /** The two moments that actually changed the team's standing. */
  highlight?: boolean;
}

export const ROAD: readonly RoadStop[] = [
  {
    date: "October 2025",
    place: "Ningbo, China",
    title: "IFAF Asia–Oceania Championship",
    body: "American Samoa travelled to the Fenghua Sports Center for the regional championship. It was the qualifying route to a first world championship.",
  },
  {
    date: "26 October 2025",
    place: "Ningbo, China",
    title: "American Samoa 41, China 34",
    body: "The third-place playoff. A win over the hosts, and with it the territory's first berth at an IFAF World Championship.",
    highlight: true,
  },
  {
    date: "November 2025",
    place: "",
    title: "World ranking: 33",
    body: "An inaugural entry in the IFAF World Rankings. Two months earlier the team was unranked.",
  },
  {
    date: "13–16 August 2026",
    place: "Düsseldorf, Germany",
    title: "World Championship debut",
    body: "Group A: the United States, Australia, Israel, American Samoa.",
    highlight: true,
  },
];

/**
 * Set once the federation supplies the roster. Rendered as an honest empty
 * state rather than invented names, a fake roster is the single worst thing
 * a team site can carry.
 */
export const ROSTER: {
  name: string;
  number?: number;
  position?: string;
  village?: string;
}[] = [];

/**
 * Media placeholders. Replace `src` as the federation's own photography and
 * match footage comes in, every entry here is flagged so nothing ships to
 * production still pointing at a stand-in.
 */
export const MEDIA: {
  id: string;
  kind: "image" | "video";
  src: string;
  alt: string;
  credit: string;
  placeholder: boolean;
}[] = [
  {
    id: "flag",
    kind: "image",
    src: "/media/american-samoa-flag.svg",
    alt: "The flag of American Samoa: a red-bordered white triangle on navy, carrying a bald eagle holding a uatogi and a fue.",
    credit: "Public domain",
    placeholder: false,
  },
];

/**
 * Match footage. `id` is the YouTube video id, not a full URL, because the
 * thumbnail, the watch link and any future embed all derive from it.
 *
 * Add a line per clip as the federation posts them.
 */
export const HIGHLIGHTS: {
  id: string;
  title: string;
  note?: string;
}[] = [
  {
    id: "iP_w9qhaKsc",
    title: "Düsseldorf 2026",
    note: "American Samoa at its first IFAF World Championship.",
  },
];

/**
 * Two pages, two links.
 *
 * The nav used to carry six items, four of which were anchors to sections of
 * the page a visitor was already on. In-page anchors in a top nav make a site
 * look larger than it is and give somebody a menu to read instead of a page to
 * scroll, which is the opposite of the job. Everything they pointed at is still
 * one scroll away, and the crest still goes home.
 */
/**
 * The kit.
 *
 * Every card links to the shop. The point of putting these on the landing page
 * is not decoration: somebody who can see the shirt is the person who signs up
 * to buy it, and until now the shop was a page nobody had a reason to open.
 */
export const KIT = [
  {
    id: "jersey-navy",
    src: "/kit/jersey-navy.webp",
    name: "Home jersey",
    detail: "Navy, full tatau flank, flag on the chest",
    alt: "Team American Samoa navy jersey, front and back, with Polynesian tatau panels and the American Samoa flag.",
  },
  {
    id: "jersey-white",
    src: "/kit/jersey-white.webp",
    name: "Away jersey",
    detail: "White, navy tatau, red piping",
    alt: "Team American Samoa white jersey, front and back, with navy tatau panels and red piping.",
  },
  {
    id: "tank-navy",
    src: "/kit/tank-navy.webp",
    name: "Training tank",
    detail: "Navy. Unity, culture, family across the back",
    alt: "Team American Samoa navy training tank, front and back.",
  },
  {
    id: "tank-white",
    src: "/kit/tank-white.webp",
    name: "Training tank",
    detail: "White. Unity, culture, family across the back",
    alt: "Team American Samoa white training tank, front and back.",
  },
] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
] as const;
