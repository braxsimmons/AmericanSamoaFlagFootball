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

/*
  Düsseldorf, as it happened.

  Supplied by the federation. Two of these were independently confirmed before
  they arrived, the United States game and the Canada quarter-final, and the
  Israel score reconciles exactly against the published group table: 38 + 21 +
  24 is the 83 points for, and 32 + 7 + 40 is the 79 against. That arithmetic is
  what settled an orientation no secondary source agreed on.

  Dates are given only where they are certain. The stage is always right; a
  guessed date on an official record is the same class of error as a guessed
  score, just harder to notice.
*/
export interface Result {
  stage: string;
  opponent: string;
  us: number;
  them: number;
  date?: string;
  /** ISO form of `date`, for <time dateTime>. */
  iso?: string;
  /** The one that made the news. */
  headline?: boolean;
  note?: string;
}

export const RESULTS: readonly Result[] = [
  { stage: "Group A", opponent: "Australia", us: 21, them: 7 },
  {
    stage: "Group A",
    opponent: "United States",
    us: 38,
    them: 32,
    date: "14 August 2026",
    iso: "2026-08-14",
    headline: true,
    note: "The first defeat for the United States in more than 50 competitive games, and their first since 2012. They went on to win the tournament.",
  },
  {
    stage: "Group A",
    opponent: "Israel",
    us: 24,
    them: 40,
    note: "Played after top spot in the group was already secured.",
  },
  {
    stage: "Quarter-final",
    opponent: "Canada",
    us: 14,
    them: 24,
    date: "15 August 2026",
    iso: "2026-08-15",
    note: "Canada finished third.",
  },
  { stage: "Fifth to eighth", opponent: "Germany", us: 34, them: 31 },
  {
    stage: "Fifth place game",
    opponent: "Japan",
    us: 48,
    them: 38,
    date: "16 August 2026",
    iso: "2026-08-16",
    note: "Japan had taken the United States to the final minutes of their quarter-final.",
  },
];

/** Won on 2-1, ahead of the United States. Reported by Olympics.com and IFAF. */
export const GROUP_RESULT = "Won Group A";

/*
  Where they finished.

  Fifth of twelve, on debut, from the lowest ranking in the field. Derived from
  winning the fifth place game rather than asserted separately, so the number
  and the result behind it can never drift apart.
*/
export const FINAL_PLACING = 5;
export const FIELD_SIZE = 12;

/*
  Press coverage.

  Headlines and links only, with a summary written here. Republishing the
  articles themselves would be a copyright problem and would add nothing: the
  value of this page is that it points outward, at independent sources, and
  gives a journalist arriving late a map of who has already covered this.

  Every entry is a real article that has been checked to exist. Add to it as
  coverage lands; a press page padded with syndication duplicates of the same
  wire story looks like more than it is.
*/
export interface PressItem {
  outlet: string;
  title: string;
  date: string;
  /** ISO form of `date`, for <time dateTime>. */
  iso: string;
  url: string;
  summary: string;
}

export const PRESS: readonly PressItem[] = [
  {
    outlet: "Olympics.com",
    title:
      "American Samoa's flag football team bows heads in underdog triumph over USA on world debut",
    date: "14 August 2026",
    iso: "2026-08-14",
    url: "https://www.olympics.com/en/news/american-samoa-flag-football-underdog-triumph-usa-world-debut-family-of-brothers-interview",
    summary:
      "Interviews with the squad after the win over the United States, including the line the team gave the tournament: we are a family of brothers.",
  },
  {
    outlet: "NBC Sports",
    title: "Team USA's 14-year unbeaten streak in flag football ends, thanks to American Samoa",
    date: "14 August 2026",
    iso: "2026-08-14",
    url: "https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/team-usas-14-year-unbeaten-streak-in-flag-football-ends-thanks-to-american-samoa",
    summary:
      "Pro Football Talk on the end of a run that had lasted more than 50 games and stretched back to 2012.",
  },
  {
    outlet: "UPI",
    title: "Taulia Tagovailoa-led American Samoa stuns USA at flag football championships",
    date: "14 August 2026",
    iso: "2026-08-14",
    url: "https://www.upi.com/Sports_News/2026/08/14/germany-Tagovailoa-American-Samoa-beat-USA-flag-football/4291786721053/",
    summary: "Wire coverage of the result, carried on across the United States.",
  },
  {
    outlet: "American Football International",
    title: "Quarterfinals set for IFAF World Flag 2026 on Saturday",
    date: "15 August 2026",
    iso: "2026-08-15",
    url: "https://www.americanfootballinternational.com/quarterfinals-set-for-ifaf-world-flag-2026-on-saturday/",
    summary:
      "The bracket after the group stage, with head coach Sterling Carvalho on how the squad approached the United States.",
  },
  {
    outlet: "CBC",
    title: "Düsseldorf 2026 quarter-finals: Canada vs. American Samoa",
    date: "15 August 2026",
    iso: "2026-08-15",
    url: "https://www.cbc.ca/player/play/video/9.7308601",
    summary: "Full broadcast of the quarter-final against Canada, who went on to take bronze.",
  },
];

export interface GroupTeam {
  country: string;
  code: string;
  worldRank: number;
  /**
   * Flag roundel. All four are cut to one diameter on a transparent circle by
   * `scripts/flags.mjs`; see that file for why each source needs a different
   * method to find its disc.
   */
  flag: string;
  /** Marks the home side, so the table can weight one row without a name check. */
  isUs?: boolean;
}

export const GROUP_A: readonly GroupTeam[] = [
  { country: "United States", code: "US", worldRank: 1, flag: "/flags/us.png" },
  { country: "Australia", code: "AU", worldRank: 8, flag: "/flags/au.png" },
  { country: "Israel", code: "IL", worldRank: 12, flag: "/flags/il.png" },
  { country: "American Samoa", code: "AS", worldRank: 33, flag: "/flags/as.png", isUs: true },
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
    title: "IFAF Asia-Oceania Championship",
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
    date: "14 August 2026",
    place: "Düsseldorf, Germany",
    title: "American Samoa 38, United States 32",
    body: "On debut, against the defending champions and world number one. It was the first defeat for the United States in more than 50 competitive games, and their first since 2012. They went on to win the tournament anyway.",
    highlight: true,
  },
  {
    date: "15 August 2026",
    place: "Düsseldorf, Germany",
    title: "Won Group A",
    body: "Through as group winners ahead of the United States, into a quarter-final against Canada, who finished the tournament third.",
    highlight: true,
  },
  {
    date: "16 August 2026",
    place: "Düsseldorf, Germany",
    title: "Fifth in the world",
    body: "Germany beaten 34 to 31, then Japan 48 to 38 in the fifth place game. Fifth of twelve nations, on debut, from the lowest ranking in the field.",
    highlight: true,
  },
];

/**
 * The squad and the staff.
 *
 * This was an empty array with a comment saying an invented roster is the worst
 * thing a team site can carry. It is now the real one, supplied by the
 * federation.
 *
 * `number`, `position` and `village` stay optional and stay unset. They were
 * not supplied, and the rule that kept this list empty is the same rule that
 * keeps them blank: a plausible-looking guess at a squad number is worse than
 * an obvious gap, because nobody can tell it is a guess.
 *
 * Player order is the federation's own. Sorting it alphabetically would be
 * tidier and would also throw away whatever the order is saying.
 *
 * Names are the highest-value text on this site for search. Several of these
 * players are searched by name far more often than the team is, so spelling
 * them exactly right is the whole job: "Puka Nakua" ranks for nothing.
 */
export interface Person {
  name: string;
  number?: number;
  position?: string;
  village?: string;
}

export const COACHES: readonly Person[] = [
  { name: "Sterling Carvalho" },
  { name: "Stewart Carvalho" },
];

export const ROSTER: readonly Person[] = [
  // Order is set by the federation, not alphabetical and not by squad number.
  // The grid fills left to right across three columns, so the first three are
  // the whole top row and the fourth opens the second.
  { name: "Taulia Tagovailoa" },
  { name: "Batchlor Johnson" },
  { name: "Jahcour Pearson" },
  { name: "Bralond Brown" },
  { name: "Vai Peko" },
  { name: "Tai Tiedmann" },
  { name: "John Hardy-Tulia" },
  { name: "London Iakopo" },
  { name: "Robert Regpala" },
  { name: "Adam Wright" },
  { name: "Alijah Holder" },
  { name: "Antonio Hill" },
  { name: "Puka Nacua" },
  { name: "Tetairoa McMillan" },
];

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
 * Google Analytics 4 measurement id. Public by design: it is visible in the
 * page source of every GA-instrumented site on the web, so hiding it in an env
 * var buys nothing and costs the next person ten minutes finding it.
 */
/*
  Hero photographs, in order.

  The field shot leads because it is the one taken at the moment the site is
  about. All three are cropped to one shape by `scripts/squad-photos.mjs`; a
  carousel whose slides disagree on height drags the headline beside it around
  every time it advances.

*/
export const HERO_PHOTOS = [
  {
    src: "/photos/squad-dusseldorf.webp",
    alt: "The American Samoa squad on the field in Düsseldorf, holding two American Samoa flags in front of the IFAF World Flag Düsseldorf 2026 backdrop.",
  },
  {
    src: "/photos/squad-backdrop.webp",
    alt: "The squad in blue Amerika Sāmoa jerseys wearing ʻula, throwing shakas in front of the IFAF World Flag Düsseldorf 2026 backdrop.",
  },
  {
    src: "/photos/squad-delegation.webp",
    alt: "The full travelling party, players, coaches and staff, standing together indoors behind the flag of American Samoa.",
  },
] as const;

/*
  The Ecwid store.

  The store id is public: it is in the script URL on every page that shows a
  product, so an env var would hide it from the next developer and from nobody
  else.

  `price` is the value Ecwid stamped into the microdata when these snippets were
  generated. The widget itself always renders the live price from the store, so
  a price change in Ecwid shows correctly on the page, but this attribute keeps
  the old number. It is only read by crawlers, and a rich result quoting a price
  the checkout disagrees with is worth avoiding, so update it here whenever the
  store price changes.

  The signature flag football jersey is deliberately absent. It is not for sale.
*/
export const ECWID_STORE_ID = "140913833";

export interface EcwidProduct {
  id: string;
  name: string;
  price: string;
}

export const ECWID_PRODUCTS: readonly EcwidProduct[] = [
  { id: "856409459", name: "Navy Jersey Shirt", price: "39.99" },
  { id: "856425429", name: "White Jersey Shirt", price: "39.99" },
  { id: "856409463", name: "Navy Training Tank", price: "39.99" },
  { id: "856421368", name: "White Training Tank", price: "39.99" },
];

export const GA_MEASUREMENT_ID = "G-VGG3Q8M8GY";

/**
 * Intrinsic pixel size of every kit render. All five are padded to one canvas
 * by `scripts/kit-images.mjs`, so a single pair of numbers is correct for all
 * of them, and Next reserves the right box before the image loads. Re-shoot the
 * kit and this is the only place the numbers change.
 */
export const KIT_W = 1401;
export const KIT_H = 920;

/*
  The kit.

  The signature match jersey is still first and is still not for sale. It is
  kept because it is the garment the squad actually wore in Düsseldorf and the
  archive is worth having, but nothing renders it: the landing page now shows a
  shirt somebody can buy.

  `detail` describes what is on the garment, not how it makes you feel. The
  photographs show front and back together, so the back copy is worth naming:
  it is the part a buyer cannot otherwise read.
*/
export const KIT = [
  {
    id: "jersey-signature",
    src: "/kit/jersey-signature.webp",
    name: "Match jersey",
    detail: "The Signature fit. Worn at the 2026 IFAF World Championships.",
    alt: "The signature Team American Samoa flag football match jersey, front and back. Navy with white tatau panels, the American Samoa flag on the chest and both sleeves, and Amerika Samoa above Unity, Culture, Family across the back.",
  },
  {
    id: "jersey-navy",
    src: "/kit/jersey-navy.webp",
    name: "Navy jersey",
    detail: "Navy, white tatau flanks, flag on the chest and both sleeves",
    alt: "Team American Samoa navy jersey, front and back, with white tatau panels and the American Samoa flag roundel across the back.",
  },
  {
    id: "jersey-white",
    src: "/kit/jersey-white.webp",
    name: "White jersey",
    detail: "White, navy tatau, red piping through the flanks",
    alt: "Team American Samoa white jersey, front and back, with navy tatau panels, red piping and the American Samoa flag roundel across the back.",
  },
  {
    id: "tank-navy",
    src: "/kit/tank-navy.webp",
    name: "Training tank",
    detail: "Navy. Unity, culture, family across the back",
    alt: "Team American Samoa navy training tank, front and back, with white tatau panels and the flag roundel on the reverse.",
  },
  {
    id: "tank-white",
    src: "/kit/tank-white.webp",
    name: "Training tank",
    detail: "White. Unity, culture, family across the back",
    alt: "Team American Samoa white training tank, front and back, with navy tatau panels and the flag roundel on the reverse.",
  },
] as const;

/*
  The kit shown beside the Group A table on the landing page.

  It has to be something the shop actually sells. It used to be the signature
  flag football jersey, which was right while the shop was a lookbook and wrong
  the moment the shop became a store: that card carries a "Shop" link, and the
  match jersey is not one of the four products.

  Looked up by id rather than by index, so reordering KIT cannot silently point
  this at a different shirt, and it fails the build rather than rendering a
  broken image if the id ever stops existing.
*/
const landingKit = KIT.find((item) => item.id === "jersey-navy");
if (!landingKit) {
  throw new Error("LANDING_KIT: no kit item with id 'jersey-navy'");
}
export const LANDING_KIT = landingKit;

/**
 * Two pages, two links.
 *
 * The nav used to carry six items, four of which were anchors to sections of
 * the page a visitor was already on. In-page anchors in a top nav make a site
 * look larger than it is and give somebody a menu to read instead of a page to
 * scroll, which is the opposite of the job. Everything they pointed at is still
 * one scroll away, and the crest still goes home.
 */
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/press", label: "Results" },
  { href: "/shop", label: "Shop" },
] as const;
