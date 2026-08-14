/*
  Tatau-inspired geometry.

  Redrawn against reference artwork the client supplied: dense curved bands, each
  band carrying a *different* motif, bird-track rows, comb ticks, solid triangle
  rows, diamond chains, separated by heavy solid rules, all following an arc.
  The earlier version scattered motifs on an orthogonal grid at uniform weight,
  which is the signature of generic "tribal" decoration rather than tatau.

  Rendered as CSS masks over `currentColor` rather than inline `<svg>` with
  `<pattern>` fills. Two bugs forced that, and both are worth recording because
  the naive version looks right in isolation and breaks on a page:

  1. `<pattern id="spear">` is *document*-scoped. Four bands on one page emitted
     four identical ids, every `url(#spear)` resolved to the first, and the
     `color` prop silently did nothing on the rest, a band authored navy
     rendered red.

  2. A `viewBox="0 0 120 12"` with `preserveAspectRatio="none"` stretched to a
     1440px viewport made each triangle 120px wide and 12px tall. On the jersey
     the same band is dense, forty-odd spearheads across, not six.

  Masks fix both: no ids to collide, `mask-size` in pixels holds the tile's true
  proportion at any width, colour follows `text-*` like any other element.

  ---------------------------------------------------------------------------
  CULTURAL NOTE, please do not delete this.

  These are respectful geometric motifs in the spirit of the artwork the team
  already wears. They are not reproductions of any specific pe'a or malu. Samoan
  tatau is earned through tā tatau and carries the wearer's rank and lineage.

  The large field and arc are now the client's own supplied artwork, with the
  white paper knocked out to transparency (`scripts/knockout.mjs`). Only the
  thin divider bands are still drawn here, because a 360px raster cropped to a
  12px strip cannot stay crisp.

  LICENSING, unresolved, and worth settling before launch. The supplied pattern
  images look like stock illustrations. If they were licensed, confirm the
  licence covers commercial web use. If not, the federation's kit supplier
  already owns finished artwork for these jerseys, which is the better source.
  Otherwise commission a Samoan designer and credit them by name in the footer.
  ---------------------------------------------------------------------------
*/

/** Wraps an SVG string as a mask-image data URI. */
const mask = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;

/*
  The vocabulary. Each is one band's worth of motif, drawn black; the mask makes
  black opaque and white transparent, so `currentColor` shows through.
*/

/** `atualoa`, the centipede. A row of solid triangles under a rule. */
const BAND_SPEAR = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18">
    <rect width="24" height="2.2" fill="#000"/>
    <path d="M0 18 L6 5 L12 18 Z M12 18 L18 5 L24 18 Z" fill="#000"/>
  </svg>`;

/** Bird-track row, the small chevron pairs that fill the finer bands. */
const BAND_BIRD = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
    <path d="M2 11 L5 4 L8 11" fill="none" stroke="#000" stroke-width="1.6"/>
    <path d="M9 11 L12 4 L15 11" fill="none" stroke="#000" stroke-width="1.6"/>
  </svg>`;

/** Comb row, fine parallel ticks between two rules. */
const BAND_COMB = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 20">
    <rect width="8" height="1.4" fill="#000"/>
    <rect x="2" y="3" width="1.5" height="14" fill="#000"/>
    <rect y="18.6" width="8" height="1.4" fill="#000"/>
  </svg>`;

/** Diamond chain. */
const BAND_DIAMOND = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16">
    <path d="M10 1 L18 8 L10 15 L2 8 Z" fill="none" stroke="#000" stroke-width="1.5"/>
    <path d="M10 5 L13.5 8 L10 11 L6.5 8 Z" fill="#000"/>
  </svg>`;

export type BandMotif = "spear" | "bird" | "comb" | "diamond";

const BANDS: Record<BandMotif, { svg: string; tile: string }> = {
  spear: { svg: BAND_SPEAR, tile: "24px 100%" },
  bird: { svg: BAND_BIRD, tile: "16px 100%" },
  comb: { svg: BAND_COMB, tile: "8px 100%" },
  diamond: { svg: BAND_DIAMOND, tile: "20px 100%" },
};

/**
 * A single horizontal band.
 *
 * Colour comes from `currentColor`, so `text-red` / `text-navy` work normally.
 * The tile is fixed and repeated, never stretched.
 */
export function SpearRow({
  className = "",
  motif = "spear",
  flip = false,
}: {
  className?: string;
  motif?: BandMotif;
  flip?: boolean;
}) {
  const band = BANDS[motif];
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        maskImage: mask(band.svg),
        WebkitMaskImage: mask(band.svg),
        maskSize: band.tile,
        WebkitMaskSize: band.tile,
        maskRepeat: "repeat-x",
        WebkitMaskRepeat: "repeat-x",
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    />
  );
}

/**
 * A stack of different bands, the way the reference artwork builds an edge.
 *
 * Unequal weights next to each other is the whole point: a heavy triangle row
 * above fine comb ticks above a diamond chain reads as tatau; three rows of the
 * same weight read as a border.
 */
export function BandStack({
  className = "",
  motifs = ["spear", "comb", "bird"],
  flip = false,
}: {
  className?: string;
  motifs?: BandMotif[];
  flip?: boolean;
}) {
  const heights: Record<BandMotif, string> = {
    spear: "h-4",
    bird: "h-3",
    comb: "h-2.5",
    diamond: "h-3.5",
  };

  return (
    <div aria-hidden="true" className={className} style={{ transform: flip ? "scaleY(-1)" : undefined }}>
      {motifs.map((m, i) => (
        <SpearRow key={`${m}-${i}`} motif={m} className={`w-full ${heights[m]}`} />
      ))}
    </div>
  );
}

/**
 * The large field pattern, the client's own artwork.
 *
 * Backed by `public/patterns/field-symmetry.png`: the supplied reference with
 * its white paper knocked out to transparency (see `scripts/knockout.mjs`).
 * Used as a `mask-image` rather than an `<img>`, so colour still comes from
 * `currentColor` and one file serves navy, red and bone without three copies.
 *
 * This replaces a hand-drawn approximation. Real artwork carries irregularities
 * (a hand's line weight, motifs that do not tile perfectly) that a generated
 * pattern does not, and those irregularities are most of why it reads as
 * authentic rather than as decoration.
 */
export function TatauField({
  className = "",
  opacity = 0.12,
  size = 420,
}: {
  className?: string;
  opacity?: number;
  /** Tile width in px. Larger reads as artwork; smaller reads as texture. */
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        opacity,
        maskImage: "url(/patterns/field-symmetry.png)",
        WebkitMaskImage: "url(/patterns/field-symmetry.png)",
        maskSize: `${size}px auto`,
        WebkitMaskSize: `${size}px auto`,
        maskRepeat: "repeat",
        WebkitMaskRepeat: "repeat",
      }}
    />
  );
}

/**
 * The curved band artwork, placed as a large panel.
 *
 * `band-arc.png` is the supplied arc reference, knocked out the same way. It
 * carries the sweep the tiled field does not, so it anchors an edge or a corner
 * where a flat repeat would read as wallpaper.
 */
export function TatauArc({
  className = "",
  opacity = 0.16,
  position = "right top",
}: {
  className?: string;
  opacity?: number;
  position?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        opacity,
        maskImage: "url(/patterns/band-arc.png)",
        WebkitMaskImage: "url(/patterns/band-arc.png)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: position,
        WebkitMaskPosition: position,
      }}
    />
  );
}

/**
 * The circular motif from the back of the jersey.
 *
 * Three concentric bands rather than one ring of identical spikes, a heavy
 * spearhead ring, fine rules, then a dense inner row, broken top and bottom by
 * a vertical spear, as the jersey breaks it. A single even spike ring reads as
 * a sunburst icon; the banding is what makes it read as tatau.
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
      <path d={ring(30, 41, 49, 0.34)} />
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="50" r="36.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <path d={ring(44, 35, 30, 0.3)} opacity="0.85" />
      <circle cx="50" cy="50" r="28.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M50 2 L54 14 L50 20 L46 14 Z" />
      <path d="M50 98 L54 86 L50 80 L46 86 Z" />
    </svg>
  );
}

