/*
  Tatau-inspired geometry.

  Rendered as CSS masks over `currentColor` rather than as inline `<svg>` with
  `<pattern>` fills. Two bugs forced the rewrite, and both are worth recording
  because the naive version looks correct in isolation and is broken on a page:

  1. `<pattern id="spear">` is a *document*-scoped id. Four bands on one page
     emit four identical ids, every `url(#spear)` resolves to the first, and the
     `color` prop silently does nothing on the other three — the team section's
     band was authored navy and rendered red.

  2. A `viewBox="0 0 120 12"` with `preserveAspectRatio="none"` stretched to a
     1440px viewport makes each triangle 120px wide and 12px tall. On the jersey
     the same band is dense and roughly square — forty-odd spearheads across, not
     six. Stretched, it reads as a decorative squiggle rather than as tatau.

  Masks fix both: no ids to collide, `mask-size` in pixels holds the tile's true
  proportion at any width, and colour follows the `text-*` utility like any other
  element.

  STRUCTURE. The bands are built the way the jersey builds them — parallel strips
  of *unequal* weight: a solid rule, a dense triangle row, a row of fine lines,
  another rule. Even weight and scattered motifs are what make Pacific-inspired
  design read as generic "tribal" wallpaper; contrast and banding are what make
  it read as tatau.

  CULTURAL NOTE, and please do not delete it. These are respectful geometric
  motifs in the spirit of the artwork the team already wears — not reproductions
  of any specific pe'a or malu. Samoan tatau is earned through tā tatau and
  carries the wearer's rank and lineage. Before launch the federation's kit
  supplier already owns finished, licensed artwork; source the pattern from that,
  or commission a Samoan designer and credit them by name in the footer. An
  uncredited developer's approximation is the appropriative version of this.
*/

/** One spearhead tile: a solid triangle, a fine open one, and a hairline rule. */
const SPEAR_TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 16">
     <path d="M0 16 L7 2 L14 16 Z" fill="#000"/>
     <path d="M14 16 L21 2 L28 16 Z" fill="none" stroke="#000" stroke-width="1.4"/>
     <rect x="0" y="0" width="28" height="1.6" fill="#000"/>
   </svg>`,
);

/**
 * A horizontal spearhead band.
 *
 * `currentColor` fills a masked block, so `text-red` / `text-navy` work as they
 * do anywhere else. The tile is a fixed 28×16, repeated — never stretched.
 */
export function SpearRow({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        maskImage: `url("data:image/svg+xml,${SPEAR_TILE}")`,
        WebkitMaskImage: `url("data:image/svg+xml,${SPEAR_TILE}")`,
        maskSize: "28px 100%",
        WebkitMaskSize: "28px 100%",
        maskRepeat: "repeat-x",
        WebkitMaskRepeat: "repeat-x",
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    />
  );
}

/**
 * The large field pattern.
 *
 * Banded rather than scattered: a heavy rule, a dense triangle row, a row of
 * fine parallel lines, a lighter rule. Rotated slightly, because tatau follows
 * the body and is never a flat orthogonal grid.
 */
const FIELD_TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
     <rect x="0" y="0" width="72" height="4" fill="#000"/>
     <path d="M0 22 L6 8 L12 22 Z M12 22 L18 8 L24 22 Z M24 22 L30 8 L36 22 Z
              M36 22 L42 8 L48 22 Z M48 22 L54 8 L60 22 Z M60 22 L66 8 L72 22 Z" fill="#000"/>
     <rect x="0" y="27" width="72" height="1" fill="#000"/>
     <rect x="0" y="31" width="72" height="0.9" fill="#000"/>
     <rect x="0" y="35" width="72" height="0.9" fill="#000"/>
     <path d="M0 44 L6 58 L12 44 Z M12 44 L18 58 L24 44 Z M24 44 L30 58 L36 44 Z
              M36 44 L42 58 L48 44 Z M48 44 L54 58 L60 44 Z M60 44 L66 58 L72 44 Z"
           fill="none" stroke="#000" stroke-width="1.2"/>
     <rect x="0" y="66" width="72" height="2.4" fill="#000"/>
   </svg>`,
);

export function TatauField({
  className = "",
  opacity = 0.12,
}: {
  className?: string;
  /** Texture only. It must never be the thing carrying meaning. */
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        opacity,
        maskImage: `url("data:image/svg+xml,${FIELD_TILE}")`,
        WebkitMaskImage: `url("data:image/svg+xml,${FIELD_TILE}")`,
        maskSize: "72px 72px",
        WebkitMaskSize: "72px 72px",
        maskRepeat: "repeat",
        WebkitMaskRepeat: "repeat",
      }}
    />
  );
}

/**
 * A vertical flank panel — the tatau column down the side of the jersey.
 */
const FLANK_TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
     <rect x="0" y="0" width="4" height="48" fill="#000"/>
     <path d="M8 0 L20 8 L8 16 Z M8 16 L20 24 L8 32 Z M8 32 L20 40 L8 48 Z" fill="#000"/>
     <rect x="24" y="0" width="1" height="48" fill="#000"/>
     <rect x="28" y="0" width="1" height="48" fill="#000"/>
     <path d="M44 0 L34 8 L44 16 Z M44 16 L34 24 L44 32 Z M44 32 L34 40 L44 48 Z"
           fill="none" stroke="#000" stroke-width="1.2"/>
   </svg>`,
);

export function TatauFlank({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        maskImage: `url("data:image/svg+xml,${FLANK_TILE}")`,
        WebkitMaskImage: `url("data:image/svg+xml,${FLANK_TILE}")`,
        maskSize: "48px 48px",
        WebkitMaskSize: "48px 48px",
        maskRepeat: "repeat-y",
        WebkitMaskRepeat: "repeat-y",
      }}
    />
  );
}

/**
 * The circular motif from the back of the jersey.
 *
 * Three concentric bands rather than one ring of identical spikes — a spearhead
 * ring, a fine line band, then a dense inner triangle row — broken top and
 * bottom by a vertical spear, the way the jersey breaks it. A single even spike
 * ring reads as a sunburst icon; the banding is what makes it read as tatau.
 *
 * Inline SVG here rather than a mask, because it is one instance with no tiling
 * and the geometry is generated. Ids are avoided entirely.
 */
export function TatauRing({ className = "" }: { className?: string }) {
  const ring = (count: number, inner: number, outer: number, spread: number) =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 - Math.PI / 2;
      const s = ((Math.PI * 2) / count) * spread;
      const tip = [50 + Math.cos(a) * outer, 50 + Math.sin(a) * outer];
      const l = [50 + Math.cos(a - s) * inner, 50 + Math.sin(a - s) * inner];
      const r = [50 + Math.cos(a + s) * inner, 50 + Math.sin(a + s) * inner];
      return `M${l[0]!.toFixed(2)} ${l[1]!.toFixed(2)} L${tip[0]!.toFixed(2)} ${tip[1]!.toFixed(2)} L${r[0]!.toFixed(2)} ${r[1]!.toFixed(2)} Z`;
    }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      {/* Outer spearhead ring — heavy */}
      <path d={ring(30, 41, 49, 0.34)} />
      {/* Two fine rules */}
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="36.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
      {/* Inner dense band, pointing inward */}
      <path d={ring(44, 35, 30, 0.3)} opacity="0.85" />
      <circle cx="50" cy="50" r="28.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {/* The vertical spear that breaks the ring top and bottom */}
      <path d="M50 2 L54 14 L50 20 L46 14 Z" />
      <path d="M50 98 L54 86 L50 80 L46 86 Z" />
    </svg>
  );
}
