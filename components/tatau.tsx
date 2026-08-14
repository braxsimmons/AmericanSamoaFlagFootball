/*
  Tatau-inspired geometry.

  Redrawn against reference artwork the client supplied: dense curved bands, each
  band carrying a *different* motif — bird-track rows, comb ticks, solid triangle
  rows, diamond chains — separated by heavy solid rules, all following an arc.
  The earlier version scattered motifs on an orthogonal grid at uniform weight,
  which is the signature of generic "tribal" decoration rather than tatau.

  Rendered as CSS masks over `currentColor` rather than inline `<svg>` with
  `<pattern>` fills. Two bugs forced that, and both are worth recording because
  the naive version looks right in isolation and breaks on a page:

  1. `<pattern id="spear">` is *document*-scoped. Four bands on one page emitted
     four identical ids, every `url(#spear)` resolved to the first, and the
     `color` prop silently did nothing on the rest — a band authored navy
     rendered red.

  2. A `viewBox="0 0 120 12"` with `preserveAspectRatio="none"` stretched to a
     1440px viewport made each triangle 120px wide and 12px tall. On the jersey
     the same band is dense — forty-odd spearheads across, not six.

  Masks fix both: no ids to collide, `mask-size` in pixels holds the tile's true
  proportion at any width, colour follows `text-*` like any other element.

  ---------------------------------------------------------------------------
  CULTURAL NOTE — please do not delete this.

  These are respectful geometric motifs in the spirit of the artwork the team
  already wears. They are not reproductions of any specific pe'a or malu. Samoan
  tatau is earned through tā tatau and carries the wearer's rank and lineage.

  The reference images used to draw these appear to be stock previews and are
  NOT shipped in this repository. Before launch: the federation's kit supplier
  already owns finished, licensed pattern artwork — source it from there — or
  commission a Samoan designer to redraw these properly and credit them by name
  in the footer. An uncredited developer's approximation is the appropriative
  version of this.
  ---------------------------------------------------------------------------
*/

/** Wraps an SVG string as a mask-image data URI. */
const mask = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;

/*
  The vocabulary. Each is one band's worth of motif, drawn black; the mask makes
  black opaque and white transparent, so `currentColor` shows through.
*/

/** `atualoa` — the centipede. A row of solid triangles under a rule. */
const BAND_SPEAR = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18">
    <rect width="24" height="2.2" fill="#000"/>
    <path d="M0 18 L6 5 L12 18 Z M12 18 L18 5 L24 18 Z" fill="#000"/>
  </svg>`;

/** Bird-track row — the small chevron pairs that fill the finer bands. */
const BAND_BIRD = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
    <path d="M2 11 L5 4 L8 11" fill="none" stroke="#000" stroke-width="1.6"/>
    <path d="M9 11 L12 4 L15 11" fill="none" stroke="#000" stroke-width="1.6"/>
  </svg>`;

/** Comb row — fine parallel ticks between two rules. */
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
 * The tile is fixed and repeated — never stretched.
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
 * A stack of different bands — the way the reference artwork builds an edge.
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
 * The large field pattern.
 *
 * Four stacked bands of different motif and weight, rotated slightly — tatau
 * follows the body and is never a flat orthogonal grid. Texture only; it must
 * never be the thing carrying meaning.
 */
const FIELD_TILE = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <rect y="0" width="96" height="3.4" fill="#000"/>
    <path d="M0 22 L8 6 L16 22 Z M16 22 L24 6 L32 22 Z M32 22 L40 6 L48 22 Z
             M48 22 L56 6 L64 22 Z M64 22 L72 6 L80 22 Z M80 22 L88 6 L96 22 Z" fill="#000"/>
    <rect y="26" width="96" height="1.2" fill="#000"/>
    <g stroke="#000" stroke-width="1.3" fill="none">
      <path d="M3 42 L7 33 L11 42 M15 42 L19 33 L23 42 M27 42 L31 33 L35 42
               M39 42 L43 33 L47 42 M51 42 L55 33 L59 42 M63 42 L67 33 L71 42
               M75 42 L79 33 L83 42 M87 42 L91 33 L95 42"/>
    </g>
    <rect y="47" width="96" height="1.2" fill="#000"/>
    <g fill="#000">
      <rect x="2" y="52" width="1.6" height="11"/><rect x="10" y="52" width="1.6" height="11"/>
      <rect x="18" y="52" width="1.6" height="11"/><rect x="26" y="52" width="1.6" height="11"/>
      <rect x="34" y="52" width="1.6" height="11"/><rect x="42" y="52" width="1.6" height="11"/>
      <rect x="50" y="52" width="1.6" height="11"/><rect x="58" y="52" width="1.6" height="11"/>
      <rect x="66" y="52" width="1.6" height="11"/><rect x="74" y="52" width="1.6" height="11"/>
      <rect x="82" y="52" width="1.6" height="11"/><rect x="90" y="52" width="1.6" height="11"/>
    </g>
    <rect y="66" width="96" height="1.2" fill="#000"/>
    <g fill="none" stroke="#000" stroke-width="1.4">
      <path d="M10 78 L18 85 L10 92 L2 85 Z M30 78 L38 85 L30 92 L22 85 Z
               M50 78 L58 85 L50 92 L42 85 Z M70 78 L78 85 L70 92 L62 85 Z
               M90 78 L98 85 L90 92 L82 85 Z"/>
    </g>
    <rect y="94" width="96" height="2" fill="#000"/>
  </svg>`;

export function TatauField({
  className = "",
  opacity = 0.12,
  rotate = -12,
}: {
  className?: string;
  opacity?: number;
  /** Tatau follows the body. A slight rotation stops it reading as wallpaper. */
  rotate?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        opacity,
        maskImage: mask(FIELD_TILE),
        WebkitMaskImage: mask(FIELD_TILE),
        maskSize: "96px 96px",
        WebkitMaskSize: "96px 96px",
        maskRepeat: "repeat",
        WebkitMaskRepeat: "repeat",
        // Rotating the mask, not the element, so the box still fills its parent.
        transform: `rotate(${rotate}deg) scale(1.35)`,
        transformOrigin: "center",
      }}
    />
  );
}

/** A vertical flank column — the tatau band down the side of the jersey. */
const FLANK_TILE = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
    <rect x="0" width="3.6" height="56" fill="#000"/>
    <path d="M8 0 L22 9 L8 18 Z M8 19 L22 28 L8 37 Z M8 38 L22 47 L8 56 Z" fill="#000"/>
    <rect x="26" width="1.2" height="56" fill="#000"/>
    <g fill="#000">
      <rect x="31" y="3" width="9" height="1.5"/><rect x="31" y="11" width="9" height="1.5"/>
      <rect x="31" y="19" width="9" height="1.5"/><rect x="31" y="27" width="9" height="1.5"/>
      <rect x="31" y="35" width="9" height="1.5"/><rect x="31" y="43" width="9" height="1.5"/>
      <rect x="31" y="51" width="9" height="1.5"/>
    </g>
    <path d="M52 0 L44 9 L52 18 Z M52 19 L44 28 L52 37 Z M52 38 L44 47 L52 56 Z"
          fill="none" stroke="#000" stroke-width="1.3"/>
  </svg>`;

export function TatauFlank({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "currentColor",
        maskImage: mask(FLANK_TILE),
        WebkitMaskImage: mask(FLANK_TILE),
        maskSize: "56px 56px",
        WebkitMaskSize: "56px 56px",
        maskRepeat: "repeat-y",
        WebkitMaskRepeat: "repeat-y",
      }}
    />
  );
}

/**
 * The circular motif from the back of the jersey.
 *
 * Three concentric bands rather than one ring of identical spikes — a heavy
 * spearhead ring, fine rules, then a dense inner row — broken top and bottom by
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

/**
 * A koru — the unfurling frond spiral, filled with banded pattern.
 *
 * Drawn from the reference artwork's flowing spiral forms. Used large and
 * low-contrast as a corner mark; it is the one motif here with real movement in
 * it, and it does the job the earlier version asked a gradient to do.
 */
export function Koru({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true" fill="none">
      {/* Outer sweep */}
      <path
        d="M150 12 C 196 52 190 116 150 146 C 116 172 74 160 62 130 C 52 104 68 78 92 76
           C 112 74 126 90 122 106 C 119 118 106 124 98 118"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* The long tail, tapering */}
      <path
        d="M150 12 C 96 6 44 40 26 96 C 8 152 26 214 74 246"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Inner banded fill — comb ticks following the sweep */}
      <g stroke="currentColor" strokeWidth="2.4" opacity="0.7">
        <path d="M158 30 L170 26 M164 46 L177 43 M167 63 L180 62 M167 80 L180 82" />
        <path d="M40 96 L28 92 M38 118 L25 116 M40 140 L27 141 M46 161 L34 165" />
      </g>
      {/* Spearhead row inside the tail */}
      <g fill="currentColor" opacity="0.85">
        <path d="M58 60 L66 66 L56 72 Z" />
        <path d="M46 84 L55 89 L45 96 Z" />
        <path d="M39 110 L48 114 L39 122 Z" />
        <path d="M38 137 L47 140 L39 149 Z" />
        <path d="M44 163 L53 165 L46 175 Z" />
      </g>
      {/* The tight inner curl */}
      <path
        d="M104 108 C 112 106 116 116 110 122 C 104 128 94 124 94 116"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
